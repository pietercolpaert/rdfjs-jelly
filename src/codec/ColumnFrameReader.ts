import { Reader } from 'protobufjs/minimal.js';
import { proto, decodeProtoRdfStreamFrameReader, type ProtoFrame } from '../generated/rdf_pb';
import { JellyConformanceError } from '../errors';

type Entry = InstanceType<typeof proto.RdfLookupEntryPacked>;

/** Private reusable protobuf storage for ordinary column-only RDF frames.
 *
 * Nothing in this storage escapes the synchronous term decoder. Options,
 * metadata, namespaces, triple terms, unknown fields and merged singular
 * messages use the generated reader, preserving all protobuf semantics.
 */
export class ColumnFrameReader {
  private readonly batch = new proto.RdfColumnBatch();
  private readonly columns = [new ReusableColumn(), new ReusableColumn(), new ReusableColumn(), new ReusableColumn()];
  private readonly entries: Entry[][] = [[], [], []];
  private readonly frame = new proto.RdfStreamFrame({ columns: this.batch });

  public read(reader: Reader, length: number): ProtoFrame {
    const start = reader.pos, savedLimit = reader.len, end = start + length;
    try {
      if (end > savedLimit) throw new RangeError('Truncated Jelly column frame');
      reader.len = end;
      if (length && reader.tag() === 18) {
        const size = reader.size();
        // More than one frame field can require protobuf message merging. It
        // must be handled before any lookup updates or RDF objects are emitted.
        if (reader.pos + size === end && this.readBatch(reader, end)) return this.frame;
      }
      reader.pos = start;
      reader.len = end;
      return decodeProtoRdfStreamFrameReader(reader, length);
    } catch (error) {
      if (error instanceof JellyConformanceError) throw error;
      throw new JellyConformanceError('Invalid Jelly protobuf frame', { cause: error instanceof Error ? error : undefined });
    } finally {
      reader.len = savedLimit;
    }
  }

  private readBatch(reader: Reader, end: number): boolean {
    const batch = this.batch;
    batch.rowCount = 0;
    batch.names = batch.prefixes = batch.datatypes = EMPTY_ENTRIES;
    batch.messageLengths = EMPTY_LIST;
    batch.subjects = batch.predicates = batch.objects = batch.graphs = null;
    let seen = 0;
    while (reader.pos < end) {
      const tag = reader.tag(), field = tag >>> 3, wire = tag & 7;
      if (field === 1 && wire === 0) batch.rowCount = reader.uint32();
      else if (field >= 2 && field <= 4 && wire === 2) {
        let list = field === 2 ? batch.names : field === 3 ? batch.prefixes : batch.datatypes;
        if (list === EMPTY_ENTRIES) {
          list = [];
          if (field === 2) batch.names = list; else if (field === 3) batch.prefixes = list; else batch.datatypes = list;
        }
        const pool = this.entries[field - 2]!;
        const entry = pool[list.length] ?? (pool[list.length] = new proto.RdfLookupEntryPacked());
        const entryEnd = reader.size() + reader.pos;
        if (entryEnd > end) throw new RangeError('Truncated Jelly packed lookup entry');
        const limit = reader.len;
        reader.len = entryEnd;
        entry.id = 0;
        let count = 0;
        while (reader.pos < entryEnd) {
          const entryTag = reader.tag();
          if (entryTag === 8) entry.id = reader.uint32();
          else if (entryTag === 18) entry.values[count++] = reader.string();
          else return false;
        }
        entry.values.length = count;
        reader.len = limit;
        list.push(entry);
      } else if (field >= 6 && field <= 9 && wire === 2) {
        const bit = 1 << field;
        if (seen & bit) return false;
        seen |= bit;
        const column = this.columns[field - 6]!;
        const columnEnd = reader.size() + reader.pos;
        if (columnEnd > end) throw new RangeError('Truncated Jelly column');
        const limit = reader.len;
        reader.len = columnEnd;
        if (!this.readColumn(reader, column, columnEnd)) return false;
        reader.len = limit;
        if (field === 6) batch.subjects = column;
        else if (field === 7) batch.predicates = column;
        else if (field === 8) batch.objects = column;
        else batch.graphs = column;
      } else if (field === 15 && (wire === 0 || wire === 2)) {
        if (batch.messageLengths === EMPTY_LIST) batch.messageLengths = [];
        if (wire === 0) batch.messageLengths.push(reader.uint32());
        else reader.uint32s(batch.messageLengths);
      } else return false;
    }
    return reader.pos === end;
  }

  private readColumn(reader: Reader, column: ReusableColumn, end: number): boolean {
    column.kinds = EMPTY_BYTES;
    column.kindsLength = column.layoutCount = column.nameIdCount = column.prefixIdCount = column.lexCount = 0;
    column.literalKindCount = column.langtagCount = column.directionCount = column.bnodeCount = 0;
    while (reader.pos < end) {
      const tag = reader.tag(), field = tag >>> 3, wire = tag & 7;
      if (field === 1 && wire === 2) {
        column.kindsLength = reader.uint32();
        column.kindsOffset = reader.pos;
        if (column.kindsOffset + column.kindsLength > end) throw new RangeError('Truncated Jelly column kinds');
        column.kinds = reader.buf;
        reader.pos += column.kindsLength;
      } else if (field === 2 && (wire === 0 || wire === 2)) column.layoutCount = readNumbers(reader, wire, column.layouts, column.layoutCount);
      else if (field === 3 && (wire === 0 || wire === 2)) column.nameIdCount = readNumbers(reader, wire, column.nameIds, column.nameIdCount);
      else if (field === 4 && (wire === 0 || wire === 2)) column.prefixIdCount = readNumbers(reader, wire, column.prefixIds, column.prefixIdCount);
      else if (field === 6 && (wire === 0 || wire === 2)) column.literalKindCount = readNumbers(reader, wire, column.literalKinds, column.literalKindCount);
      else if (field === 8 && (wire === 0 || wire === 2)) column.directionCount = readNumbers(reader, wire, column.langtagDirections, column.directionCount);
      else if (field === 5 && wire === 2) column.lexValues[column.lexCount++] = reader.string();
      else if (field === 7 && wire === 2) column.langtags[column.langtagCount++] = reader.string();
      else if (field === 9 && wire === 2) column.bnodes[column.bnodeCount++] = reader.string();
      else return false;
    }
    return reader.pos === end;
  }
}

/**
 * Column storage kept between frames. Truncating arrays would drop their
 * backing stores, so each list keeps its capacity and only the first `*Count`
 * entries are live. Consumers must not read `.length` of these lists.
 */
export class ReusableColumn extends proto.RdfColumn {
  public layoutCount = 0;
  public nameIdCount = 0;
  public prefixIdCount = 0;
  public lexCount = 0;
  public literalKindCount = 0;
  public langtagCount = 0;
  public directionCount = 0;
  public bnodeCount = 0;
  /** `kinds` aliases the input buffer: its live bytes are `kindsLength` bytes at `kindsOffset`. */
  public kindsOffset = 0;
  public kindsLength = 0;
}

/** Appends a packed or single unpacked varint to `values[count...]` and returns the new count. */
function readNumbers(reader: Reader, wire: number, values: number[], count: number): number {
  if (wire === 0) { values[count++] = reader.uint32(); return count; }
  const size = reader.uint32(), end = reader.pos + size;
  if (end > reader.len) throw new RangeError('Truncated Jelly packed column list');
  const buf = reader.buf;
  let pos = reader.pos;
  while (pos < end) {
    // Single-byte values dominate lookup ids and layout tokens.
    const value = buf[pos]!;
    if (value < 128) { values[count++] = value; pos++; } else {
      reader.pos = pos;
      values[count++] = reader.uint32();
      pos = reader.pos;
    }
  }
  if (pos !== end) throw new RangeError('Invalid Jelly packed column list');
  reader.pos = pos;
  return count;
}
// Absent batch-level lists share these read-only sentinels; they are never mutated.
const EMPTY_BYTES = new Uint8Array();
const EMPTY_LIST: number[] = [];
const EMPTY_ENTRIES: Entry[] = [];
