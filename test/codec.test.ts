import { JellyConformanceError, MessageDecoder, MessageEncoder, Parser } from '../src';
import { encodeVarint } from '../src/codec/varint';
import type { RdfStreamFrame } from '../src/generated/rdf_pb';

const validFrame: RdfStreamFrame = {
  rows: [{
    case: 'options',
    value: {
      streamName: '', physicalType: 1, generalizedStatements: false, rdfStar: false,
      maxNameTableSize: 8, maxPrefixTableSize: 0, maxDatatypeTableSize: 0,
      logicalType: 1, version: 2,
    },
  }],
  metadata: new Map(),
};

describe('binary framing validation', () => {
  it('rejects truncated messages and varints', () => {
    const bytes = new MessageEncoder().encode(validFrame);
    expect(() => new MessageDecoder().decode(bytes.subarray(0, bytes.length - 1))).toThrow(/Truncated/);
    expect(() => new MessageDecoder({ delimited: true }).decode(Uint8Array.from([0x80, 0x80, 0x80, 0x80, 0x80])))
      .toThrow(JellyConformanceError);
  });

  it('enforces the configured message size', () => {
    const prefix = encodeVarint(1024);
    expect(() => new MessageDecoder({ delimited: true, maxMessageSize: 10 }).decode(prefix)).toThrow(/size limit/);
  });

  it('handles a Uint8Array with a non-zero byte offset', () => {
    const bytes = new MessageEncoder().encode(validFrame);
    const allocation = new Uint8Array(bytes.length + 8);
    allocation.set(bytes, 4);
    expect(new Parser().parseMessages(allocation.subarray(4, 4 + bytes.length))).toHaveLength(1);
  });
});
