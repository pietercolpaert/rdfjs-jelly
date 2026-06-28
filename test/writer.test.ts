import type * as RDF from '@rdfjs/types';
import {
  DataFactory,
  JellyConformanceError,
  JellyUnsupportedFeatureError,
  LogicalStreamType,
  MessageDecoder,
  Parser,
  PhysicalStreamType,
  Writer,
} from '../src';

const { namedNode, blankNode, literal, defaultGraph, quad } = DataFactory;

function end(writer: Writer): Promise<Uint8Array> {
  return new Promise((resolve, reject) => writer.end((error, output) => {
    if (error) reject(error);
    else resolve(output!);
  }));
}

describe('Writer', () => {
  it('writes only protocol version 2 and round-trips RDF/JS quads', async () => {
    const writer = new Writer();
    const input = [
      quad(namedNode('https://example.org/s'), namedNode('https://example.org/p'), literal('hello')),
      quad(blankNode('b'), namedNode('https://example.org/p'), literal('bonjour', 'fr'), namedNode('https://example.org/g')),
      quad(namedNode('urn:s'), namedNode('urn:p'), literal('4', namedNode('http://www.w3.org/2001/XMLSchema#integer'))),
    ];
    writer.addQuads(input);
    const bytes = await end(writer);
    const frames = new MessageDecoder().decode(bytes);
    expect(frames[0]?.rows[0]).toMatchObject({ case: 'options', value: { version: 2, rdfStar: false, generalizedStatements: false } });
    const output = new Parser().parse(bytes) as RDF.Quad[];
    expect(output).toHaveLength(input.length);
    for (let i = 0; i < input.length; i++) expect(output[i]!.equals(input[i])).toBe(true);
  });

  it('rejects writer versions other than 2', () => {
    expect(() => new Writer({ version: 1 as 2 })).toThrow(JellyUnsupportedFeatureError);
  });

  it('supports non-delimited single-message output', async () => {
    const writer = new Writer({ delimited: false });
    writer.addQuad(quad(namedNode('urn:s'), namedNode('urn:p'), namedNode('urn:o')));
    const bytes = await end(writer);
    expect(new Parser({ delimited: false }).parse(bytes)).toHaveLength(1);
  });

  it('rejects multiple non-delimited messages', async () => {
    const writer = new Writer({ delimited: false });
    writer.addMessage([]);
    writer.addMessage([]);
    await expect(end(writer)).rejects.toThrow(/exactly one message/);
  });

  it('rejects RDF-star, generalized positions, and named graphs in triples', async () => {
    const quoted = quad(namedNode('urn:s'), namedNode('urn:p'), namedNode('urn:o'));
    const outer = quad(quoted, namedNode('urn:p'), namedNode('urn:o'));
    const starWriter = new Writer();
    expect(() => starWriter.addQuad(outer)).toThrow(JellyUnsupportedFeatureError);

    const tripleWriter = new Writer({ physicalType: PhysicalStreamType.TRIPLES });
    expect(() => tripleWriter.addQuad(quad(namedNode('urn:s'), namedNode('urn:p'), namedNode('urn:o'), namedNode('urn:g'))))
      .toThrow(JellyConformanceError);
  });

  it('writes explicit graph messages', async () => {
    const graph = namedNode('urn:g');
    const statement = quad(namedNode('urn:s'), namedNode('urn:p'), literal('o'), graph);
    const writer = new Writer({ physicalType: PhysicalStreamType.GRAPHS, logicalType: LogicalStreamType.FLAT_QUADS });
    writer.addGraph(graph, [statement], { source: new Uint8Array([1, 2]) });
    const messages = new Parser().parseMessages(await end(writer));
    expect(messages).toHaveLength(1);
    expect(messages[0]?.[0]?.equals(statement)).toBe(true);
    expect(messages[0]?.metadata.get('source')).toEqual(new Uint8Array([1, 2]));
  });
});
