import type * as RDF from '@rdfjs/types';
import { Decoder, JellyUnsupportedFeatureError, MessageEncoder, Parser, PhysicalStreamType } from '../src';
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
});
