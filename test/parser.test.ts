import type * as RDF from '@rdfjs/types';
import { Writer as ProtoWriter } from 'protobufjs/minimal.js';
import { Decoder, JellyConformanceError, JellyUnsupportedFeatureError, MessageEncoder, Parser, PhysicalStreamType } from '../src';
import { eu } from '../src/generated/proto/rdf_pb.mjs';
import type { RdfStreamFrame } from '../src/generated/rdf_pb';

function options(overrides: Record<string, unknown> = {}): RdfStreamFrame {
  return {
    rows: [{
      case: 'options',
      value: {
        streamName: '', physicalType: PhysicalStreamType.TRIPLES, generalizedStatements: false, rdfStar: false,
        maxNameTableSize: 8, maxPrefixTableSize: 0, maxDatatypeTableSize: 0, logicalType: 1, version: 2,
        ...overrides,
      },
    }],
    metadata: new Map(),
  };
}

describe('Parser validation', () => {
  it('accepts protocol versions 1 and 2', () => {
    for (const version of [1, 2]) {
      const bytes = new MessageEncoder().encode(options({ version }));
      expect(new Parser().parseMessages(bytes)).toHaveLength(1);
    }
  });

  it('accepts repeated identical options rows', () => {
    const frame = options();
    frame.rows.push(frame.rows[0]!);
    expect(new Parser().parseMessages(new MessageEncoder().encode(frame))).toHaveLength(1);
  });

  it('rejects RDF-star and generalized stream flags', () => {
    expect(() => new Parser().parse(new MessageEncoder().encode(options({ rdfStar: true })))).toThrow(JellyUnsupportedFeatureError);
    expect(() => new Parser().parse(new MessageEncoder().encode(options({ generalizedStatements: true })))).toThrow(JellyUnsupportedFeatureError);
  });

  it('rejects a quoted triple even when the stream flag is false', () => {
    const frame = options();
    frame.rows.push({
      case: 'triple',
      value: {
        subject: { case: 'triple', value: {} },
        predicate: { case: 'bnode', value: 'invalid-generalized-predicate' },
        object: { case: 'bnode', value: 'o' },
      },
    });
    expect(() => new Parser().parse(new MessageEncoder().encode(frame))).toThrow(JellyUnsupportedFeatureError);
  });

  it('uses a custom RDF/JS factory', async () => {
    const base = (await import('../src')).DataFactory;
    let namedNodes = 0;
    const factory: RDF.DataFactory = { ...base, namedNode: value => { namedNodes++; return base.namedNode(value); } };
    const frame = options();
    frame.rows.push(
      { case: 'name', value: { id: 0, value: 'urn:s' } },
      { case: 'name', value: { id: 0, value: 'urn:p' } },
      { case: 'name', value: { id: 0, value: 'urn:o' } },
      { case: 'triple', value: {
        subject: { case: 'iri', value: { prefixId: 0, nameId: 1 } },
        predicate: { case: 'iri', value: { prefixId: 0, nameId: 2 } },
        object: { case: 'iri', value: { prefixId: 0, nameId: 3 } },
      } },
    );
    expect(new Parser({ factory }).parse(new MessageEncoder().encode(frame))).toHaveLength(1);
    expect(namedNodes).toBe(3);
  });

  it('preserves protobuf last-one-wins semantics on the optimized oneof path', () => {
    const ProtoFrame = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
    const optionsRow = options().rows[0];
    if (!optionsRow || optionsRow.case !== 'options') throw new Error('Missing test stream options');
    const bytes = ProtoFrame.encode({ rows: [
      { options: optionsRow.value },
      { name: { id: 0, value: 'urn:p' } },
      { name: { id: 0, value: 'urn:o' } },
      { triple: {
        sIri: { prefixId: 0, nameId: 1 },
        sBnode: 'last-subject',
        pIri: { prefixId: 0, nameId: 1 },
        oIri: { prefixId: 0, nameId: 2 },
      } },
    ] }).finish();
    const [quad] = new Parser({ delimited: false }).parse(bytes) as RDF.Quad[];
    expect(quad?.subject.termType).toBe('BlankNode');
    expect(quad?.subject.value).toBe('last-subject');

    const rowBytes = ProtoFrame.encode({ rows: [
      { options: optionsRow.value },
      {
        triple: { sBnode: 'ignored', pBnode: 'invalid', oBnode: 'ignored' },
        name: { id: 0, value: 'last-row-field' },
      },
    ] }).finish();
    expect(new Parser({ delimited: false }).parse(rowBytes)).toEqual([]);
  });

  it('preserves protobuf merging for a repeated embedded triple field', () => {
    const ProtoRow = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow;
    const optionsRow = options({ maxPrefixTableSize: 1 }).rows[0];
    if (!optionsRow || optionsRow.case !== 'options') throw new Error('Missing test stream options');
    const frame = ProtoWriter.create();
    const appendRow = (row: Parameters<typeof ProtoRow.encode>[0]): void => {
      ProtoRow.encode(row, frame.uint32(10).fork()).ldelim();
    };
    appendRow({ options: optionsRow.value });
    appendRow({ prefix: { id: 0, value: 'https://' } });
    appendRow({ name: { id: 0, value: 'subject' } });
    appendRow({ name: { id: 0, value: 'predicate' } });
    appendRow({ name: { id: 0, value: 'object' } });

    const triple = ProtoWriter.create();
    triple.uint32(10).fork().uint32(8).uint32(1).ldelim();
    triple.uint32(10).fork().uint32(16).uint32(1).ldelim();
    triple.uint32(42).fork().uint32(16).uint32(2).ldelim();
    triple.uint32(74).fork().uint32(16).uint32(3).ldelim();
    const row = ProtoWriter.create().uint32(18).bytes(triple.finish()).finish();
    frame.uint32(10).bytes(row);

    const [quad] = new Parser({ delimited: false }).parse(frame.finish()) as RDF.Quad[];
    expect(quad?.subject.value).toBe('https://subject');
    expect(quad?.predicate.value).toBe('https://predicate');
    expect(quad?.object.value).toBe('https://object');
  });

  it('rejects an empty protobuf row on the fused decoder path', () => {
    const ProtoFrame = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
    const optionsRow = options().rows[0];
    if (!optionsRow || optionsRow.case !== 'options') throw new Error('Missing test stream options');
    const bytes = ProtoFrame.encode({ rows: [{ options: optionsRow.value }, {}] }).finish();
    expect(() => new Parser({ delimited: false }).parse(bytes)).toThrow(JellyConformanceError);
  });
});
