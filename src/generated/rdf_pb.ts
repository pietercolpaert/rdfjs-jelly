/*
 * TypeScript representation and binary codec for Jelly-RDF rdf.proto v1.1.1.
 * Schema: https://github.com/Jelly-RDF/jelly-protobuf/blob/main/proto/rdf.proto
 * The field numbers and oneof layout below are generated from that schema.
 */
import { JellyConformanceError } from '../errors';
import { concatBytes, decodeVarint, encodeVarint } from '../codec/varint';

export interface RdfIri { prefixId: number; nameId: number }
export interface RdfLiteral { lex: string; kind?: { case: 'langtag'; value: string } | { case: 'datatype'; value: number } }
export type RdfTerm =
  | { case: 'iri'; value: RdfIri }
  | { case: 'bnode'; value: string }
  | { case: 'literal'; value: RdfLiteral }
  | { case: 'defaultGraph'; value: Record<string, never> }
  | { case: 'triple'; value: RdfTriple };

export interface RdfTriple { subject?: RdfTerm; predicate?: RdfTerm; object?: RdfTerm }
export interface RdfQuad extends RdfTriple { graph?: RdfTerm }
export interface RdfGraphStart { graph?: RdfTerm }
export interface RdfStreamOptions {
  streamName: string;
  physicalType: number;
  generalizedStatements: boolean;
  rdfStar: boolean;
  maxNameTableSize: number;
  maxPrefixTableSize: number;
  maxDatatypeTableSize: number;
  logicalType: number;
  version: number;
}

export type RdfStreamRow =
  | { case: 'options'; value: RdfStreamOptions }
  | { case: 'triple'; value: RdfTriple }
  | { case: 'quad'; value: RdfQuad }
  | { case: 'graphStart'; value: RdfGraphStart }
  | { case: 'graphEnd'; value: Record<string, never> }
  | { case: 'namespace'; value: { name: string; value: RdfIri } }
  | { case: 'name'; value: { id: number; value: string } }
  | { case: 'prefix'; value: { id: number; value: string } }
  | { case: 'datatype'; value: { id: number; value: string } }
  | { case: 'unknown'; fieldNumber: number };

export interface RdfStreamFrame {
  rows: RdfStreamRow[];
  metadata: Map<string, Uint8Array>;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

class ProtoWriter {
  private readonly chunks: Uint8Array[] = [];
  public tag(field: number, wire: number): this { this.chunks.push(encodeVarint(field * 8 + wire)); return this; }
  public uint32(field: number, value: number): this {
    if (value !== 0) this.chunks.push(encodeVarint(field * 8), encodeVarint(value));
    return this;
  }
  public bool(field: number, value: boolean): this { return this.uint32(field, value ? 1 : 0); }
  public string(field: number, value: string): this { if (value) this.bytes(field, encoder.encode(value)); return this; }
  public bytes(field: number, value: Uint8Array): this {
    this.tag(field, 2).chunks.push(encodeVarint(value.byteLength), value);
    return this;
  }
  public message(field: number, value: Uint8Array): this { return this.bytes(field, value); }
  public finish(): Uint8Array { return concatBytes(this.chunks); }
}

class ProtoReader {
  public pos = 0;
  public constructor(public readonly input: Uint8Array) {}
  public get done(): boolean { return this.pos >= this.input.byteLength; }
  public varint(): number {
    const decoded = decodeVarint(this.input, this.pos);
    if (!decoded) throw new JellyConformanceError('Truncated protobuf varint');
    this.pos = decoded.offset;
    return decoded.value;
  }
  public tag(): { field: number; wire: number } {
    const tag = this.varint();
    if (tag === 0) throw new JellyConformanceError('Invalid protobuf tag 0');
    return { field: Math.floor(tag / 8), wire: tag & 7 };
  }
  public bytes(): Uint8Array {
    const length = this.varint();
    const end = this.pos + length;
    if (end > this.input.byteLength) throw new JellyConformanceError('Truncated length-delimited protobuf field');
    const value = this.input.subarray(this.pos, end);
    this.pos = end;
    return value;
  }
  public string(): string { return decoder.decode(this.bytes()); }
  public nested<T>(read: (reader: ProtoReader) => T): T {
    const nested = new ProtoReader(this.bytes());
    const value = read(nested);
    if (!nested.done) throw new JellyConformanceError('Trailing bytes in protobuf message');
    return value;
  }
  public skip(wire: number): void {
    if (wire === 0) { this.varint(); return; }
    if (wire === 1) { this.pos += 8; }
    else if (wire === 2) { const length = this.varint(); this.pos += length; }
    else if (wire === 5) { this.pos += 4; }
    else throw new JellyConformanceError(`Unsupported protobuf wire type ${wire}`);
    if (this.pos > this.input.byteLength) throw new JellyConformanceError('Truncated protobuf field');
  }
}

function requireWire(actual: number, expected: number, field: number): void {
  if (actual !== expected) throw new JellyConformanceError(`Invalid wire type for protobuf field ${field}`);
}

function encodeIri(value: RdfIri): Uint8Array {
  return new ProtoWriter().uint32(1, value.prefixId).uint32(2, value.nameId).finish();
}

function decodeIri(reader: ProtoReader): RdfIri {
  const value: RdfIri = { prefixId: 0, nameId: 0 };
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 0, field); value.prefixId = reader.varint(); }
    else if (field === 2) { requireWire(wire, 0, field); value.nameId = reader.varint(); }
    else reader.skip(wire);
  }
  return value;
}

function encodeLiteral(value: RdfLiteral): Uint8Array {
  const writer = new ProtoWriter().string(1, value.lex);
  if (value.kind?.case === 'langtag') writer.string(2, value.kind.value);
  else if (value.kind?.case === 'datatype') writer.uint32(3, value.kind.value);
  return writer.finish();
}

function decodeLiteral(reader: ProtoReader): RdfLiteral {
  const value: RdfLiteral = { lex: '' };
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 2, field); value.lex = reader.string(); }
    else if (field === 2) { requireWire(wire, 2, field); value.kind = { case: 'langtag', value: reader.string() }; }
    else if (field === 3) { requireWire(wire, 0, field); value.kind = { case: 'datatype', value: reader.varint() }; }
    else reader.skip(wire);
  }
  return value;
}

function encodeTerm(writer: ProtoWriter, term: RdfTerm, fields: readonly [number, number, number, number?]): void {
  if (term.case === 'iri') writer.message(fields[0], encodeIri(term.value));
  else if (term.case === 'bnode') writer.string(fields[1], term.value);
  else if (term.case === 'literal') writer.message(fields[2], encodeLiteral(term.value));
  else if (term.case === 'defaultGraph') writer.message(fields[2], new Uint8Array());
  else if (fields[3] !== undefined) writer.message(fields[3], encodeTriple(term.value));
}

function decodeTerm(reader: ProtoReader, field: number, wire: number, fields: readonly [number, number, number, number?], graph = false): RdfTerm | undefined {
  if (!fields.includes(field)) return undefined;
  requireWire(wire, 2, field);
  if (field === fields[0]) return { case: 'iri', value: reader.nested(decodeIri) };
  if (field === fields[1]) return { case: 'bnode', value: reader.string() };
  if (field === fields[2]) {
    if (graph) { reader.nested(r => { while (!r.done) { const tag = r.tag(); r.skip(tag.wire); } return undefined; }); return { case: 'defaultGraph', value: {} }; }
    return { case: 'literal', value: reader.nested(decodeLiteral) };
  }
  // RDF-star is deliberately unsupported by this package. Consume the nested
  // payload without recursively decoding it; the RDF decoder rejects the term.
  reader.bytes();
  return { case: 'triple', value: {} };
}

const SUBJECT_FIELDS = [1, 2, 3, 4] as const;
const PREDICATE_FIELDS = [5, 6, 7, 8] as const;
const OBJECT_FIELDS = [9, 10, 11, 12] as const;
const GRAPH_FIELDS = [13, 14, 15] as const;

function encodeTriple(value: RdfTriple): Uint8Array {
  const writer = new ProtoWriter();
  if (value.subject) encodeTerm(writer, value.subject, SUBJECT_FIELDS);
  if (value.predicate) encodeTerm(writer, value.predicate, PREDICATE_FIELDS);
  if (value.object) encodeTerm(writer, value.object, OBJECT_FIELDS);
  return writer.finish();
}

function decodeTriple(reader: ProtoReader): RdfTriple {
  const value: RdfTriple = {};
  while (!reader.done) {
    const { field, wire } = reader.tag();
    let term = decodeTerm(reader, field, wire, SUBJECT_FIELDS);
    if (term) value.subject = term;
    else if ((term = decodeTerm(reader, field, wire, PREDICATE_FIELDS))) value.predicate = term;
    else if ((term = decodeTerm(reader, field, wire, OBJECT_FIELDS))) value.object = term;
    else reader.skip(wire);
  }
  return value;
}

function encodeQuad(value: RdfQuad): Uint8Array {
  const writer = new ProtoWriter();
  if (value.subject) encodeTerm(writer, value.subject, SUBJECT_FIELDS);
  if (value.predicate) encodeTerm(writer, value.predicate, PREDICATE_FIELDS);
  if (value.object) encodeTerm(writer, value.object, OBJECT_FIELDS);
  if (value.graph) {
    if (value.graph.case === 'iri') writer.message(13, encodeIri(value.graph.value));
    else if (value.graph.case === 'bnode') writer.string(14, value.graph.value);
    else if (value.graph.case === 'defaultGraph') writer.message(15, new Uint8Array());
    else if (value.graph.case === 'literal') writer.message(16, encodeLiteral(value.graph.value));
  }
  return writer.finish();
}

function decodeQuad(reader: ProtoReader): RdfQuad {
  const value: RdfQuad = {};
  while (!reader.done) {
    const { field, wire } = reader.tag();
    let term = decodeTerm(reader, field, wire, SUBJECT_FIELDS);
    if (term) value.subject = term;
    else if ((term = decodeTerm(reader, field, wire, PREDICATE_FIELDS))) value.predicate = term;
    else if ((term = decodeTerm(reader, field, wire, OBJECT_FIELDS))) value.object = term;
    else if (field === 13) { requireWire(wire, 2, field); value.graph = { case: 'iri', value: reader.nested(decodeIri) }; }
    else if (field === 14) { requireWire(wire, 2, field); value.graph = { case: 'bnode', value: reader.string() }; }
    else if (field === 15) { requireWire(wire, 2, field); reader.bytes(); value.graph = { case: 'defaultGraph', value: {} }; }
    else if (field === 16) { requireWire(wire, 2, field); value.graph = { case: 'literal', value: reader.nested(decodeLiteral) }; }
    else reader.skip(wire);
  }
  return value;
}

function encodeGraphStart(value: RdfGraphStart): Uint8Array {
  const writer = new ProtoWriter();
  if (!value.graph) return writer.finish();
  if (value.graph.case === 'iri') writer.message(1, encodeIri(value.graph.value));
  else if (value.graph.case === 'bnode') writer.string(2, value.graph.value);
  else if (value.graph.case === 'defaultGraph') writer.message(3, new Uint8Array());
  else if (value.graph.case === 'literal') writer.message(4, encodeLiteral(value.graph.value));
  return writer.finish();
}

function decodeGraphStart(reader: ProtoReader): RdfGraphStart {
  const value: RdfGraphStart = {};
  while (!reader.done) {
    const { field, wire } = reader.tag(); requireWire(wire, 2, field);
    if (field === 1) value.graph = { case: 'iri', value: reader.nested(decodeIri) };
    else if (field === 2) value.graph = { case: 'bnode', value: reader.string() };
    else if (field === 3) { reader.bytes(); value.graph = { case: 'defaultGraph', value: {} }; }
    else if (field === 4) value.graph = { case: 'literal', value: reader.nested(decodeLiteral) };
    else reader.skip(wire);
  }
  return value;
}

function encodeOptions(value: RdfStreamOptions): Uint8Array {
  return new ProtoWriter()
    .string(1, value.streamName).uint32(2, value.physicalType)
    .bool(3, value.generalizedStatements).bool(4, value.rdfStar)
    .uint32(9, value.maxNameTableSize).uint32(10, value.maxPrefixTableSize)
    .uint32(11, value.maxDatatypeTableSize).uint32(14, value.logicalType)
    .uint32(15, value.version).finish();
}

function decodeOptions(reader: ProtoReader): RdfStreamOptions {
  const value: RdfStreamOptions = { streamName: '', physicalType: 0, generalizedStatements: false, rdfStar: false, maxNameTableSize: 0, maxPrefixTableSize: 0, maxDatatypeTableSize: 0, logicalType: 0, version: 0 };
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 2, field); value.streamName = reader.string(); continue; }
    if ([2, 3, 4, 9, 10, 11, 14, 15].includes(field)) {
      requireWire(wire, 0, field); const number = reader.varint();
      if (field === 2) value.physicalType = number;
      else if (field === 3) value.generalizedStatements = number !== 0;
      else if (field === 4) value.rdfStar = number !== 0;
      else if (field === 9) value.maxNameTableSize = number;
      else if (field === 10) value.maxPrefixTableSize = number;
      else if (field === 11) value.maxDatatypeTableSize = number;
      else if (field === 14) value.logicalType = number;
      else value.version = number;
    } else reader.skip(wire);
  }
  return value;
}

function encodeEntry(value: { id: number; value: string }): Uint8Array {
  return new ProtoWriter().uint32(1, value.id).string(2, value.value).finish();
}

function decodeEntry(reader: ProtoReader): { id: number; value: string } {
  const value = { id: 0, value: '' };
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 0, field); value.id = reader.varint(); }
    else if (field === 2) { requireWire(wire, 2, field); value.value = reader.string(); }
    else reader.skip(wire);
  }
  return value;
}

function encodeNamespace(value: { name: string; value: RdfIri }): Uint8Array {
  return new ProtoWriter().string(1, value.name).message(2, encodeIri(value.value)).finish();
}

function decodeNamespace(reader: ProtoReader): { name: string; value: RdfIri } {
  const value = { name: '', value: { prefixId: 0, nameId: 0 } };
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 2, field); value.name = reader.string(); }
    else if (field === 2) { requireWire(wire, 2, field); value.value = reader.nested(decodeIri); }
    else reader.skip(wire);
  }
  return value;
}

function encodeRow(row: RdfStreamRow): Uint8Array {
  const writer = new ProtoWriter();
  if (row.case === 'options') writer.message(1, encodeOptions(row.value));
  else if (row.case === 'triple') writer.message(2, encodeTriple(row.value));
  else if (row.case === 'quad') writer.message(3, encodeQuad(row.value));
  else if (row.case === 'graphStart') writer.message(4, encodeGraphStart(row.value));
  else if (row.case === 'graphEnd') writer.message(5, new Uint8Array());
  else if (row.case === 'namespace') writer.message(6, encodeNamespace(row.value));
  else if (row.case === 'name') writer.message(9, encodeEntry(row.value));
  else if (row.case === 'prefix') writer.message(10, encodeEntry(row.value));
  else if (row.case === 'datatype') writer.message(11, encodeEntry(row.value));
  return writer.finish();
}

function decodeRow(reader: ProtoReader): RdfStreamRow {
  let row: RdfStreamRow | undefined;
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if ([1, 2, 3, 4, 5, 6, 9, 10, 11].includes(field)) requireWire(wire, 2, field);
    if (field === 1) row = { case: 'options', value: reader.nested(decodeOptions) };
    else if (field === 2) row = { case: 'triple', value: reader.nested(decodeTriple) };
    else if (field === 3) row = { case: 'quad', value: reader.nested(decodeQuad) };
    else if (field === 4) row = { case: 'graphStart', value: reader.nested(decodeGraphStart) };
    else if (field === 5) { reader.bytes(); row = { case: 'graphEnd', value: {} }; }
    else if (field === 6) row = { case: 'namespace', value: reader.nested(decodeNamespace) };
    else if (field === 9) row = { case: 'name', value: reader.nested(decodeEntry) };
    else if (field === 10) row = { case: 'prefix', value: reader.nested(decodeEntry) };
    else if (field === 11) row = { case: 'datatype', value: reader.nested(decodeEntry) };
    else { reader.skip(wire); row = { case: 'unknown', fieldNumber: field }; }
  }
  return row ?? { case: 'unknown', fieldNumber: 0 };
}

function encodeMetadataEntry(key: string, value: Uint8Array): Uint8Array {
  return new ProtoWriter().string(1, key).bytes(2, value).finish();
}

function decodeMetadataEntry(reader: ProtoReader): [string, Uint8Array] {
  let key = ''; let value: Uint8Array<ArrayBufferLike> = new Uint8Array();
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 2, field); key = reader.string(); }
    else if (field === 2) { requireWire(wire, 2, field); value = reader.bytes(); }
    else reader.skip(wire);
  }
  return [key, value];
}

export function encodeRdfStreamFrame(frame: RdfStreamFrame): Uint8Array {
  const writer = new ProtoWriter();
  for (const row of frame.rows) writer.message(1, encodeRow(row));
  for (const [key, value] of frame.metadata) writer.message(15, encodeMetadataEntry(key, value));
  return writer.finish();
}

export function decodeRdfStreamFrame(input: Uint8Array): RdfStreamFrame {
  const reader = new ProtoReader(input);
  const frame: RdfStreamFrame = { rows: [], metadata: new Map() };
  while (!reader.done) {
    const { field, wire } = reader.tag();
    if (field === 1) { requireWire(wire, 2, field); frame.rows.push(reader.nested(decodeRow)); }
    else if (field === 15) { requireWire(wire, 2, field); const [key, value] = reader.nested(decodeMetadataEntry); frame.metadata.set(key, value); }
    else reader.skip(wire);
  }
  return frame;
}
