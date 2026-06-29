import { JellyConformanceError } from '../errors';
import { Reader } from 'protobufjs/minimal.js';
import { eu } from './proto/rdf_pb.mjs';

const proto = eu.ostrzyciel.jelly.core.proto.v1;

export type ProtoIri = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
export type ProtoLiteral = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;
export type ProtoTriple = eu.ostrzyciel.jelly.core.proto.v1.RdfTriple;
export type ProtoQuad = eu.ostrzyciel.jelly.core.proto.v1.RdfQuad;
export type ProtoGraphStart = eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart;
export type ProtoRow = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow;
export type ProtoStreamOptions = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions;
export type ProtoFrame = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
type TripleProperties = eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties;
type QuadProperties = eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties;
type RowProperties = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties;
type FrameProperties = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties;

export interface ProtoOneofMarkers {
  $literalKind?: 'langtag' | 'datatype';
  $subject?: 'sIri' | 'sBnode' | 'sLiteral' | 'sTripleTerm';
  $predicate?: 'pIri' | 'pBnode' | 'pLiteral' | 'pTripleTerm';
  $object?: 'oIri' | 'oBnode' | 'oLiteral' | 'oTripleTerm';
  $graph?: 'gIri' | 'gBnode' | 'gDefaultGraph' | 'gLiteral';
  $row?: 'options' | 'triple' | 'quad' | 'graphStart' | 'graphEnd' | 'namespace' | 'name' | 'prefix' | 'datatype';
}

export const enum ProtoRowKind {
  UNKNOWN = 0,
  OPTIONS = 1,
  TRIPLE = 2,
  QUAD = 3,
  GRAPH_START = 4,
  GRAPH_END = 5,
  NAMESPACE = 6,
  NAME = 9,
  PREFIX = 10,
  DATATYPE = 11,
}

type ProtoRowConsumer = (
  kind: ProtoRowKind,
  value: unknown,
  wireReader?: Reader,
  wireLength?: number,
) => void;
type InternalDecode = (
  reader: Reader,
  length: number,
  end: undefined,
  depth: number,
  target: unknown,
) => unknown;

const decodeOptions = proto.RdfStreamOptions.decode as unknown as InternalDecode;
const decodeTriple = proto.RdfTriple.decode as unknown as InternalDecode;
const decodeQuad = proto.RdfQuad.decode as unknown as InternalDecode;
const decodeGraphStart = proto.RdfGraphStart.decode as unknown as InternalDecode;
const decodeGraphEnd = proto.RdfGraphEnd.decode as unknown as InternalDecode;
const decodeNamespace = proto.RdfNamespaceDeclaration.decode as unknown as InternalDecode;
const decodeName = proto.RdfNameEntry.decode as unknown as InternalDecode;
const decodePrefix = proto.RdfPrefixEntry.decode as unknown as InternalDecode;
const decodeDatatype = proto.RdfDatatypeEntry.decode as unknown as InternalDecode;

export function decodeProtoTripleWire(reader: Reader, length: number): ProtoTriple {
  return decodeTriple(reader, length, undefined, 2, undefined) as ProtoTriple;
}

function decodeRowField(field: number, reader: Reader, length: number, target: unknown): unknown {
  switch (field) {
    case ProtoRowKind.OPTIONS: return decodeOptions(reader, length, undefined, 2, target);
    case ProtoRowKind.TRIPLE: return decodeTriple(reader, length, undefined, 2, target);
    case ProtoRowKind.QUAD: return decodeQuad(reader, length, undefined, 2, target);
    case ProtoRowKind.GRAPH_START: return decodeGraphStart(reader, length, undefined, 2, target);
    case ProtoRowKind.GRAPH_END: return decodeGraphEnd(reader, length, undefined, 2, target);
    case ProtoRowKind.NAMESPACE: return decodeNamespace(reader, length, undefined, 2, target);
    case ProtoRowKind.NAME: return decodeName(reader, length, undefined, 2, target);
    case ProtoRowKind.PREFIX: return decodePrefix(reader, length, undefined, 2, target);
    case ProtoRowKind.DATATYPE: return decodeDatatype(reader, length, undefined, 2, target);
    default: return undefined;
  }
}

function decodeProtoRow(reader: Reader, length: number, consume: ProtoRowConsumer): void {
  const end = reader.pos + length;
  if (end > reader.len) throw new RangeError('Truncated Jelly protobuf row');
  if (length === 0) {
    consume(ProtoRowKind.UNKNOWN, undefined);
    return;
  }
  const firstTag = reader.uint32();
  const firstField = firstTag >>> 3;
  const firstWireType = firstTag & 7;
  if (firstWireType === 2 && (
    firstField === ProtoRowKind.TRIPLE || firstField === ProtoRowKind.NAME ||
    firstField === ProtoRowKind.PREFIX || firstField === ProtoRowKind.DATATYPE
  )) {
    const nestedLength = reader.uint32();
    if (reader.pos + nestedLength === end) {
      consume(firstField, undefined, reader, nestedLength);
      if (reader.pos !== end) throw new RangeError('Invalid Jelly protobuf row payload length');
      return;
    }
  }
  reader.pos = end - length;
  let kind: ProtoRowKind | undefined;
  let value: unknown;
  while (reader.pos < end) {
    const tag = reader.uint32();
    const field = tag >>> 3;
    const wireType = tag & 7;
    if (wireType === 2 && (
      field === ProtoRowKind.OPTIONS || field === ProtoRowKind.TRIPLE || field === ProtoRowKind.QUAD ||
      field === ProtoRowKind.GRAPH_START || field === ProtoRowKind.GRAPH_END || field === ProtoRowKind.NAMESPACE ||
      field === ProtoRowKind.NAME || field === ProtoRowKind.PREFIX || field === ProtoRowKind.DATATYPE
    )) {
      const nestedLength = reader.uint32();
      const target = kind === field ? value : undefined;
      value = decodeRowField(field, reader, nestedLength, target);
      kind = field;
      continue;
    }
    reader.skipType(wireType);
  }
  if (reader.pos !== end) throw new RangeError('Invalid Jelly protobuf row length');
  consume(kind ?? ProtoRowKind.UNKNOWN, value);
}

function decodeMetadataEntry(reader: Reader, length: number, metadata: Map<string, Uint8Array>): void {
  const end = reader.pos + length;
  if (end > reader.len) throw new RangeError('Truncated Jelly metadata entry');
  let key = '';
  let value: Uint8Array<ArrayBufferLike> = new Uint8Array();
  while (reader.pos < end) {
    const tag = reader.uint32();
    const field = tag >>> 3;
    const wireType = tag & 7;
    if (field === 1 && wireType === 2) key = reader.string();
    else if (field === 2 && wireType === 2) {
      const bytes = reader.bytes();
      value = bytes instanceof Uint8Array && bytes.constructor === Uint8Array
        ? bytes
        : new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    }
    else reader.skipType(wireType);
  }
  if (reader.pos !== end) throw new RangeError('Invalid Jelly metadata entry length');
  metadata.set(key, value);
}

export function decodeProtoRdfStreamFrameRows(
  reader: Reader,
  length: number,
  consume: ProtoRowConsumer,
  metadata: Map<string, Uint8Array>,
): void {
  let consumerError: unknown;
  const guardedConsume: ProtoRowConsumer = (kind, value, wireReader, wireLength) => {
    try {
      consume(kind, value, wireReader, wireLength);
    } catch (error) {
      consumerError = error;
      throw error;
    }
  };
  try {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError('Truncated Jelly protobuf frame');
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 2) decodeProtoRow(reader, reader.uint32(), guardedConsume);
      else if (field === 15 && wireType === 2) decodeMetadataEntry(reader, reader.uint32(), metadata);
      else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError('Invalid Jelly protobuf frame length');
  } catch (error) {
    if (error === consumerError) throw error;
    throw new JellyConformanceError('Invalid Jelly protobuf frame', {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

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

function toIri(value: RdfIri): eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties {
  return { prefixId: value.prefixId, nameId: value.nameId };
}

function fromIri(value: ProtoIri): RdfIri {
  return { prefixId: value.prefixId, nameId: value.nameId };
}

function toLiteral(value: RdfLiteral): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties {
  if (value.kind?.case === 'langtag') return { lex: value.lex, langtag: value.kind.value };
  if (value.kind?.case === 'datatype') return { lex: value.lex, datatype: value.kind.value };
  return { lex: value.lex };
}

function fromLiteral(value: ProtoLiteral): RdfLiteral {
  const field = (value as ProtoLiteral & ProtoOneofMarkers).$literalKind ?? value.literalKind;
  if (field === 'langtag') return { lex: value.lex, kind: { case: 'langtag', value: value.langtag! } };
  if (field === 'datatype') return { lex: value.lex, kind: { case: 'datatype', value: value.datatype! } };
  return { lex: value.lex };
}

function setSubject(target: TripleProperties, term: RdfTerm | undefined): void {
  if (!term) return;
  if (term.case === 'iri') target.sIri = toIri(term.value);
  else if (term.case === 'bnode') target.sBnode = term.value;
  else if (term.case === 'literal') target.sLiteral = toLiteral(term.value);
  else if (term.case === 'triple') target.sTripleTerm = toTriple(term.value);
}

function setPredicate(target: TripleProperties, term: RdfTerm | undefined): void {
  if (!term) return;
  if (term.case === 'iri') target.pIri = toIri(term.value);
  else if (term.case === 'bnode') target.pBnode = term.value;
  else if (term.case === 'literal') target.pLiteral = toLiteral(term.value);
  else if (term.case === 'triple') target.pTripleTerm = toTriple(term.value);
}

function setObject(target: TripleProperties, term: RdfTerm | undefined): void {
  if (!term) return;
  if (term.case === 'iri') target.oIri = toIri(term.value);
  else if (term.case === 'bnode') target.oBnode = term.value;
  else if (term.case === 'literal') target.oLiteral = toLiteral(term.value);
  else if (term.case === 'triple') target.oTripleTerm = toTriple(term.value);
}

function setGraph(target: QuadProperties, term: RdfTerm | undefined): void {
  if (!term) return;
  if (term.case === 'iri') target.gIri = toIri(term.value);
  else if (term.case === 'bnode') target.gBnode = term.value;
  else if (term.case === 'literal') target.gLiteral = toLiteral(term.value);
  else if (term.case === 'defaultGraph') target.gDefaultGraph = {};
}

function toTriple(value: RdfTriple): TripleProperties {
  const output: TripleProperties = {};
  setSubject(output, value.subject);
  setPredicate(output, value.predicate);
  setObject(output, value.object);
  return output;
}

function toQuad(value: RdfQuad): QuadProperties {
  const output: QuadProperties = {};
  setSubject(output, value.subject);
  setPredicate(output, value.predicate);
  setObject(output, value.object);
  setGraph(output, value.graph);
  return output;
}

function fromSubject(value: ProtoTriple): RdfTerm | undefined {
  const field = (value as ProtoTriple & ProtoOneofMarkers).$subject ?? value.subject;
  if (field === 'sIri') return { case: 'iri', value: fromIri(value.sIri as ProtoIri) };
  if (field === 'sBnode') return { case: 'bnode', value: value.sBnode! };
  if (field === 'sLiteral') return { case: 'literal', value: fromLiteral(value.sLiteral as ProtoLiteral) };
  if (field === 'sTripleTerm') return { case: 'triple', value: fromTriple(value.sTripleTerm as ProtoTriple) };
  return undefined;
}

function fromPredicate(value: ProtoTriple): RdfTerm | undefined {
  const field = (value as ProtoTriple & ProtoOneofMarkers).$predicate ?? value.predicate;
  if (field === 'pIri') return { case: 'iri', value: fromIri(value.pIri as ProtoIri) };
  if (field === 'pBnode') return { case: 'bnode', value: value.pBnode! };
  if (field === 'pLiteral') return { case: 'literal', value: fromLiteral(value.pLiteral as ProtoLiteral) };
  if (field === 'pTripleTerm') return { case: 'triple', value: fromTriple(value.pTripleTerm as ProtoTriple) };
  return undefined;
}

function fromObject(value: ProtoTriple): RdfTerm | undefined {
  const field = (value as ProtoTriple & ProtoOneofMarkers).$object ?? value.object;
  if (field === 'oIri') return { case: 'iri', value: fromIri(value.oIri as ProtoIri) };
  if (field === 'oBnode') return { case: 'bnode', value: value.oBnode! };
  if (field === 'oLiteral') return { case: 'literal', value: fromLiteral(value.oLiteral as ProtoLiteral) };
  if (field === 'oTripleTerm') return { case: 'triple', value: fromTriple(value.oTripleTerm as ProtoTriple) };
  return undefined;
}

function fromGraph(value: ProtoQuad | ProtoGraphStart): RdfTerm | undefined {
  const field = (value as (ProtoQuad | ProtoGraphStart) & ProtoOneofMarkers).$graph ?? value.graph;
  if (field === 'gIri') return { case: 'iri', value: fromIri(value.gIri as ProtoIri) };
  if (field === 'gBnode') return { case: 'bnode', value: value.gBnode! };
  if (field === 'gLiteral') return { case: 'literal', value: fromLiteral(value.gLiteral as ProtoLiteral) };
  if (field === 'gDefaultGraph') return { case: 'defaultGraph', value: {} };
  return undefined;
}

function fromTriple(value: ProtoTriple): RdfTriple {
  return { subject: fromSubject(value), predicate: fromPredicate(value), object: fromObject(value) };
}

function fromQuad(value: ProtoQuad): RdfQuad {
  return {
    subject: fromSubject(value as unknown as ProtoTriple),
    predicate: fromPredicate(value as unknown as ProtoTriple),
    object: fromObject(value as unknown as ProtoTriple),
    graph: fromGraph(value),
  };
}

function fromOptions(value: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions): RdfStreamOptions {
  return {
    streamName: value.streamName,
    physicalType: value.physicalType,
    generalizedStatements: value.generalizedStatements,
    rdfStar: value.rdfStar,
    maxNameTableSize: value.maxNameTableSize,
    maxPrefixTableSize: value.maxPrefixTableSize,
    maxDatatypeTableSize: value.maxDatatypeTableSize,
    logicalType: value.logicalType,
    version: value.version,
  };
}

function toRow(row: RdfStreamRow): RowProperties {
  if (row.case === 'options') return { options: row.value };
  if (row.case === 'triple') return { triple: toTriple(row.value) };
  if (row.case === 'quad') return { quad: toQuad(row.value) };
  if (row.case === 'graphStart') {
    const graphStart: QuadProperties = {};
    setGraph(graphStart, row.value.graph);
    return { graphStart };
  }
  if (row.case === 'graphEnd') return { graphEnd: {} };
  if (row.case === 'namespace') return { namespace: { name: row.value.name, value: toIri(row.value.value) } };
  if (row.case === 'name') return { name: row.value };
  if (row.case === 'prefix') return { prefix: row.value };
  if (row.case === 'datatype') return { datatype: row.value };
  return {};
}

function fromRow(row: ProtoRow): RdfStreamRow {
  const field = (row as ProtoRow & ProtoOneofMarkers).$row ?? row.row;
  if (field === 'options') return { case: 'options', value: fromOptions(row.options! as eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions) };
  if (field === 'triple') return { case: 'triple', value: fromTriple(row.triple! as ProtoTriple) };
  if (field === 'quad') return { case: 'quad', value: fromQuad(row.quad! as ProtoQuad) };
  if (field === 'graphStart') return { case: 'graphStart', value: { graph: fromGraph(row.graphStart! as ProtoGraphStart) } };
  if (field === 'graphEnd') return { case: 'graphEnd', value: {} };
  if (field === 'namespace') {
    const value = row.namespace!;
    return { case: 'namespace', value: { name: value.name ?? '', value: fromIri(value.value as ProtoIri) } };
  }
  if (field === 'name') return { case: 'name', value: { id: row.name!.id ?? 0, value: row.name!.value ?? '' } };
  if (field === 'prefix') return { case: 'prefix', value: { id: row.prefix!.id ?? 0, value: row.prefix!.value ?? '' } };
  if (field === 'datatype') return { case: 'datatype', value: { id: row.datatype!.id ?? 0, value: row.datatype!.value ?? '' } };
  return { case: 'unknown', fieldNumber: 0 };
}

function toProtoFrame(frame: RdfStreamFrame): FrameProperties {
  return { rows: frame.rows.map(toRow), metadata: Object.fromEntries(frame.metadata) };
}

export function encodeRdfStreamFrame(frame: RdfStreamFrame): Uint8Array {
  return proto.RdfStreamFrame.encode(toProtoFrame(frame)).finish();
}

export function encodeDelimitedRdfStreamFrame(frame: RdfStreamFrame): Uint8Array {
  return proto.RdfStreamFrame.encodeDelimited(toProtoFrame(frame)).finish();
}

export function decodeRdfStreamFrame(input: Uint8Array): RdfStreamFrame {
  try {
    const frame = decodeProtoRdfStreamFrame(input);
    return { rows: frame.rows.map(row => fromRow(row as ProtoRow)), metadata: new Map(Object.entries(frame.metadata)) };
  } catch (error) {
    throw new JellyConformanceError('Invalid Jelly protobuf frame', {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

export function decodeProtoRdfStreamFrame(input: Uint8Array): ProtoFrame {
  try {
    return proto.RdfStreamFrame.decode(input) as unknown as ProtoFrame;
  } catch (error) {
    throw new JellyConformanceError('Invalid Jelly protobuf frame', {
      cause: error instanceof Error ? error : undefined,
    });
  }
}

export function decodeProtoRdfStreamFrameReader(reader: Reader, length: number): ProtoFrame {
  try {
    return proto.RdfStreamFrame.decode(reader, length) as unknown as ProtoFrame;
  } catch (error) {
    throw new JellyConformanceError('Invalid Jelly protobuf frame', {
      cause: error instanceof Error ? error : undefined,
    });
  }
}
