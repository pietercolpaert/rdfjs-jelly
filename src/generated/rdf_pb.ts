import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { sizeDelimitedEncode } from '@bufbuild/protobuf/wire';
import { JellyConformanceError } from '../errors';
import {
  RdfDatatypeEntrySchema,
  RdfDefaultGraphSchema,
  RdfGraphEndSchema,
  RdfGraphStartSchema,
  RdfIriSchema,
  RdfLiteralSchema,
  RdfNameEntrySchema,
  RdfNamespaceDeclarationSchema,
  RdfPrefixEntrySchema,
  RdfQuadSchema,
  RdfStreamFrameSchema,
  RdfStreamOptionsSchema,
  RdfStreamRowSchema,
  RdfTripleSchema,
  type RdfGraphStart as ProtoGraphStart,
  type RdfQuad as ProtoQuad,
  type RdfStreamRow as ProtoStreamRow,
  type RdfTriple as ProtoTriple,
} from './proto/rdf_pb';

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

function toIri(value: RdfIri) {
  return create(RdfIriSchema, value);
}

function fromIri(value: { prefixId: number; nameId: number }): RdfIri {
  return { prefixId: value.prefixId, nameId: value.nameId };
}

function toLiteral(value: RdfLiteral) {
  return create(RdfLiteralSchema, {
    lex: value.lex,
    literalKind: value.kind ?? { case: undefined },
  });
}

function fromLiteral(value: { lex: string; literalKind: { case?: string; value?: string | number } }): RdfLiteral {
  const kind = value.literalKind.case === 'langtag'
    ? { case: 'langtag' as const, value: value.literalKind.value as string }
    : value.literalKind.case === 'datatype'
      ? { case: 'datatype' as const, value: value.literalKind.value as number }
      : undefined;
  return { lex: value.lex, ...(kind ? { kind } : {}) };
}

function toSubject(term: RdfTerm | undefined): ProtoTriple['subject'] {
  if (!term) return { case: undefined };
  if (term.case === 'iri') return { case: 'sIri', value: toIri(term.value) };
  if (term.case === 'bnode') return { case: 'sBnode', value: term.value };
  if (term.case === 'literal') return { case: 'sLiteral', value: toLiteral(term.value) };
  if (term.case === 'triple') return { case: 'sTripleTerm', value: toTriple(term.value) };
  return { case: undefined };
}

function toPredicate(term: RdfTerm | undefined): ProtoTriple['predicate'] {
  if (!term) return { case: undefined };
  if (term.case === 'iri') return { case: 'pIri', value: toIri(term.value) };
  if (term.case === 'bnode') return { case: 'pBnode', value: term.value };
  if (term.case === 'literal') return { case: 'pLiteral', value: toLiteral(term.value) };
  if (term.case === 'triple') return { case: 'pTripleTerm', value: toTriple(term.value) };
  return { case: undefined };
}

function toObject(term: RdfTerm | undefined): ProtoTriple['object'] {
  if (!term) return { case: undefined };
  if (term.case === 'iri') return { case: 'oIri', value: toIri(term.value) };
  if (term.case === 'bnode') return { case: 'oBnode', value: term.value };
  if (term.case === 'literal') return { case: 'oLiteral', value: toLiteral(term.value) };
  if (term.case === 'triple') return { case: 'oTripleTerm', value: toTriple(term.value) };
  return { case: undefined };
}

function toGraph(term: RdfTerm | undefined): ProtoQuad['graph'] {
  if (!term) return { case: undefined };
  if (term.case === 'iri') return { case: 'gIri', value: toIri(term.value) };
  if (term.case === 'bnode') return { case: 'gBnode', value: term.value };
  if (term.case === 'literal') return { case: 'gLiteral', value: toLiteral(term.value) };
  if (term.case === 'defaultGraph') return { case: 'gDefaultGraph', value: create(RdfDefaultGraphSchema) };
  return { case: undefined };
}

function toTriple(value: RdfTriple) {
  return create(RdfTripleSchema, {
    subject: toSubject(value.subject),
    predicate: toPredicate(value.predicate),
    object: toObject(value.object),
  });
}

function toQuad(value: RdfQuad) {
  return create(RdfQuadSchema, {
    subject: toSubject(value.subject),
    predicate: toPredicate(value.predicate),
    object: toObject(value.object),
    graph: toGraph(value.graph),
  });
}

function fromSpoTerm(term: ProtoTriple['subject'] | ProtoTriple['predicate'] | ProtoTriple['object']): RdfTerm | undefined {
  if (term.case === undefined) return undefined;
  if (term.case.endsWith('Iri')) return { case: 'iri', value: fromIri(term.value as { prefixId: number; nameId: number }) };
  if (term.case.endsWith('Bnode')) return { case: 'bnode', value: term.value as string };
  if (term.case.endsWith('Literal')) return { case: 'literal', value: fromLiteral(term.value as Parameters<typeof fromLiteral>[0]) };
  return { case: 'triple', value: fromTriple(term.value as ProtoTriple) };
}

function fromGraphTerm(term: ProtoQuad['graph'] | ProtoGraphStart['graph']): RdfTerm | undefined {
  if (term.case === undefined) return undefined;
  if (term.case === 'gIri') return { case: 'iri', value: fromIri(term.value) };
  if (term.case === 'gBnode') return { case: 'bnode', value: term.value };
  if (term.case === 'gLiteral') return { case: 'literal', value: fromLiteral(term.value) };
  return { case: 'defaultGraph', value: {} };
}

function fromTriple(value: ProtoTriple): RdfTriple {
  return {
    subject: fromSpoTerm(value.subject),
    predicate: fromSpoTerm(value.predicate),
    object: fromSpoTerm(value.object),
  };
}

function fromQuad(value: ProtoQuad): RdfQuad {
  return {
    subject: fromSpoTerm(value.subject),
    predicate: fromSpoTerm(value.predicate),
    object: fromSpoTerm(value.object),
    graph: fromGraphTerm(value.graph),
  };
}

function toOptions(value: RdfStreamOptions) {
  return create(RdfStreamOptionsSchema, value);
}

function fromOptions(value: Parameters<typeof toOptions>[0]): RdfStreamOptions {
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

function toRow(row: RdfStreamRow) {
  let value: ProtoStreamRow['row'];
  if (row.case === 'options') value = { case: 'options', value: toOptions(row.value) };
  else if (row.case === 'triple') value = { case: 'triple', value: toTriple(row.value) };
  else if (row.case === 'quad') value = { case: 'quad', value: toQuad(row.value) };
  else if (row.case === 'graphStart') value = { case: 'graphStart', value: create(RdfGraphStartSchema, { graph: toGraph(row.value.graph) }) };
  else if (row.case === 'graphEnd') value = { case: 'graphEnd', value: create(RdfGraphEndSchema) };
  else if (row.case === 'namespace') value = { case: 'namespace', value: create(RdfNamespaceDeclarationSchema, { name: row.value.name, value: toIri(row.value.value) }) };
  else if (row.case === 'name') value = { case: 'name', value: create(RdfNameEntrySchema, row.value) };
  else if (row.case === 'prefix') value = { case: 'prefix', value: create(RdfPrefixEntrySchema, row.value) };
  else if (row.case === 'datatype') value = { case: 'datatype', value: create(RdfDatatypeEntrySchema, row.value) };
  else value = { case: undefined };
  return create(RdfStreamRowSchema, { row: value });
}

function fromRow(row: ProtoStreamRow): RdfStreamRow {
  const value = row.row;
  if (value.case === 'options') return { case: 'options', value: fromOptions(value.value) };
  if (value.case === 'triple') return { case: 'triple', value: fromTriple(value.value) };
  if (value.case === 'quad') return { case: 'quad', value: fromQuad(value.value) };
  if (value.case === 'graphStart') return { case: 'graphStart', value: { graph: fromGraphTerm(value.value.graph) } };
  if (value.case === 'graphEnd') return { case: 'graphEnd', value: {} };
  if (value.case === 'namespace') return { case: 'namespace', value: { name: value.value.name, value: fromIri(value.value.value!) } };
  if (value.case === 'name') return { case: 'name', value: { id: value.value.id, value: value.value.value } };
  if (value.case === 'prefix') return { case: 'prefix', value: { id: value.value.id, value: value.value.value } };
  if (value.case === 'datatype') return { case: 'datatype', value: { id: value.value.id, value: value.value.value } };
  return { case: 'unknown', fieldNumber: 0 };
}

function toProtoFrame(frame: RdfStreamFrame) {
  return create(RdfStreamFrameSchema, {
    rows: frame.rows.map(toRow),
    metadata: Object.fromEntries(frame.metadata),
  });
}

export function encodeRdfStreamFrame(frame: RdfStreamFrame): Uint8Array {
  const message = toProtoFrame(frame);
  return toBinary(RdfStreamFrameSchema, message);
}

export function encodeDelimitedRdfStreamFrame(frame: RdfStreamFrame): Uint8Array {
  return sizeDelimitedEncode(RdfStreamFrameSchema, toProtoFrame(frame));
}

export function decodeRdfStreamFrame(input: Uint8Array): RdfStreamFrame {
  try {
    const frame = fromBinary(RdfStreamFrameSchema, input);
    return {
      rows: frame.rows.map(fromRow),
      metadata: new Map(Object.entries(frame.metadata)),
    };
  } catch (error) {
    throw new JellyConformanceError('Invalid Jelly protobuf frame', {
      cause: error instanceof Error ? error : undefined,
    });
  }
}
