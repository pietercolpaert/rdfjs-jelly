import { JellyConformanceError, MessageDecoder, MessageEncoder, Parser } from '../src';
import { eu } from '../src/generated/proto/rdf_pb.mjs';
import type { RdfStreamFrame } from '../src/generated/rdf_pb';

const streamOptions = {
  streamName: '', physicalType: 1, generalizedStatements: false, rdfStar: false,
  maxNameTableSize: 8, maxPrefixTableSize: 0, maxDatatypeTableSize: 0,
  logicalType: 1, version: 2,
};

const validFrame: RdfStreamFrame = {
  rows: [{ case: 'options', value: streamOptions }],
  metadata: new Map(),
};

describe('binary framing validation', () => {
  it('matches protobuf.js wire output for all supported row shapes', () => {
    const frame: RdfStreamFrame = {
      rows: [
        validFrame.rows[0]!,
        { case: 'name', value: { id: 0, value: 'name' } },
        { case: 'prefix', value: { id: 2, value: 'https://' } },
        { case: 'datatype', value: { id: 1, value: 'urn:datatype' } },
        { case: 'namespace', value: { name: 'ex', value: { prefixId: 2, nameId: 1 } } },
        { case: 'triple', value: {
          subject: { case: 'iri', value: { prefixId: 2, nameId: 1 } },
          predicate: { case: 'bnode', value: 'predicate' },
          object: { case: 'literal', value: { lex: 'value', kind: { case: 'datatype', value: 1 } } },
        } },
        { case: 'quad', value: {
          subject: { case: 'bnode', value: 'subject' },
          predicate: { case: 'iri', value: { prefixId: 2, nameId: 1 } },
          object: { case: 'literal', value: { lex: 'bonjour', kind: { case: 'langtag', value: 'fr' } } },
          graph: { case: 'defaultGraph', value: {} },
        } },
        { case: 'graphStart', value: { graph: { case: 'iri', value: { prefixId: 2, nameId: 1 } } } },
        { case: 'graphEnd', value: {} },
      ],
      metadata: new Map([['key', new Uint8Array([1, 2, 3])]]),
    };
    const expected = {
      rows: [
        { options: streamOptions },
        { name: { id: 0, value: 'name' } },
        { prefix: { id: 2, value: 'https://' } },
        { datatype: { id: 1, value: 'urn:datatype' } },
        { namespace: { name: 'ex', value: { prefixId: 2, nameId: 1 } } },
        { triple: {
          sIri: { prefixId: 2, nameId: 1 }, pBnode: 'predicate',
          oLiteral: { lex: 'value', datatype: 1 },
        } },
        { quad: {
          sBnode: 'subject', pIri: { prefixId: 2, nameId: 1 },
          oLiteral: { lex: 'bonjour', langtag: 'fr' }, gDefaultGraph: {},
        } },
        { graphStart: { gIri: { prefixId: 2, nameId: 1 } } },
        { graphEnd: {} },
      ],
      metadata: { key: new Uint8Array([1, 2, 3]) },
    };
    const ProtoFrame = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
    expect(new MessageEncoder(false).encode(frame)).toEqual(ProtoFrame.encode(expected).finish());
    expect(new MessageEncoder(true).encode(frame)).toEqual(ProtoFrame.encodeDelimited(expected).finish());
  });

  it('rejects truncated messages and varints', () => {
    const bytes = new MessageEncoder().encode(validFrame);
    expect(() => new MessageDecoder().decode(bytes.subarray(0, bytes.length - 1))).toThrow(/Truncated/);
    expect(() => new MessageDecoder({ delimited: true }).decode(Uint8Array.from([0x80, 0x80, 0x80, 0x80, 0x80])))
      .toThrow(JellyConformanceError);
  });

  it('enforces the configured message size', () => {
    const prefix = Uint8Array.from([0x80, 0x08]); // Protobuf varint for 1024.
    expect(() => new MessageDecoder({ delimited: true, maxMessageSize: 10 }).decode(prefix)).toThrow(/size limit/);
  });

  it('handles a Uint8Array with a non-zero byte offset', () => {
    const bytes = new MessageEncoder().encode(validFrame);
    const allocation = new Uint8Array(bytes.length + 8);
    allocation.set(bytes, 4);
    expect(new Parser().parseMessages(allocation.subarray(4, 4 + bytes.length))).toHaveLength(1);
  });
});
