import { Reader } from 'protobufjs/minimal.js';
import { proto, decodeProtoRdfStreamFrameReader, type ProtoFrame } from '../generated/rdf_pb';
import { JellyConformanceError } from '../errors';

type Column = InstanceType<typeof proto.RdfColumn>;
type Entry = InstanceType<typeof proto.RdfLookupEntryPacked>;

/** Private reusable protobuf storage for ordinary column-only RDF frames.
 *
 * Nothing in this storage escapes the synchronous term decoder. Options,
 * metadata, namespaces, triple terms, unknown fields and merged singular
 * messages use the generated reader, preserving all protobuf semantics.
 */
export class ColumnFrameReader {
  private readonly batch = new proto.RdfColumnBatch();
  private readonly columns = [new proto.RdfColumn(), new proto.RdfColumn(), new proto.RdfColumn(), new proto.RdfColumn()];
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
    batch.names.length = batch.prefixes.length = batch.datatypes.length = batch.messageLengths.length = 0;
    batch.subjects = batch.predicates = batch.objects = batch.graphs = null;
    let seen = 0;
    while (reader.pos < end) {
      const tag = reader.tag(), field = tag >>> 3, wire = tag & 7;
      if (field === 1 && wire === 0) batch.rowCount = reader.uint32();
      else if (field >= 2 && field <= 4 && wire === 2) {
        const list = field === 2 ? batch.names : field === 3 ? batch.prefixes : batch.datatypes;
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
        if (wire === 0) batch.messageLengths.push(reader.uint32());
        else reader.uint32s(batch.messageLengths);
      } else return false;
    }
    return reader.pos === end;
  }

  private readColumn(reader: Reader, column: Column, end: number): boolean {
    column.kinds = EMPTY_BYTES;
    column.layouts.length = column.nameIds.length = column.prefixIds.length = column.lexValues.length = 0;
    column.literalKinds.length = column.langtags.length = column.langtagDirections.length = column.bnodes.length = 0;
    while (reader.pos < end) {
      const tag = reader.tag(), field = tag >>> 3, wire = tag & 7;
      if (field === 1 && wire === 2) column.kinds = reader.bytes();
      else if ((field === 2 || field === 3 || field === 4 || field === 6 || field === 8) && (wire === 0 || wire === 2)) {
        const values = field === 2 ? column.layouts : field === 3 ? column.nameIds : field === 4 ? column.prefixIds
          : field === 6 ? column.literalKinds : column.langtagDirections;
        if (wire === 0) values.push(reader.uint32());
        else reader.uint32s(values);
      } else if ((field === 5 || field === 7 || field === 9) && wire === 2) {
        const values = field === 5 ? column.lexValues : field === 7 ? column.langtags : column.bnodes;
        values.push(reader.string());
      } else return false;
    }
    return reader.pos === end;
  }
}
const EMPTY_BYTES = new Uint8Array();
