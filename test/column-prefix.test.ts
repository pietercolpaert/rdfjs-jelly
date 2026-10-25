import type * as RDF from '@rdfjs/types';
import { DataFactory as f, MessageDecoder, Parser, PhysicalStreamType, RdfStreamType, Writer, type WriterOptions } from '../src';

const iri = f.namedNode;
function write(messages: RDF.Quad[][], options: Partial<WriterOptions> = {}): Uint8Array {
  const writer = new Writer({ version: 3, physicalType: PhysicalStreamType.TRIPLES, streamType: RdfStreamType.MESSAGES, messageSize: 64, ...options });
  for (const message of messages) writer.addMessage(message);
  let bytes!: Uint8Array;
  writer.end((error, data) => { if (error) throw error; bytes = data!; });
  return bytes;
}
function expectRoundTrip(messages: RDF.Quad[][], options: Partial<WriterOptions> = {}): Uint8Array {
  const bytes = write(messages, options);
  const output = new Parser().parseMessages(bytes);
  expect(output.map(m => m.length)).toEqual(messages.map(m => m.length));
  output.forEach((message, i) => message.forEach((quad, j) => expect(quad.equals(messages[i]![j]!)).toBe(true)));
  return bytes;
}
const variants: Array<[string, Partial<WriterOptions>]> = [
  ['default', {}],
  ['per-message framing', { packMessages: false }],
  ['batch-local dictionaries', { persistentLookups: false }],
  ['per-message framing with batch-local dictionaries', { packMessages: false, persistentLookups: false }],
  ['tiny tables', { lookup: { maxNames: 128, maxPrefixes: 4 } }],
  ['no prefix table', { lookup: { maxPrefixes: 0 } }],
];

describe('Jelly 1.2 writer IRI prefix compression', () => {
  const shapes = [
    iri('http://example.org/ns#term'), iri('http://example.org/path/leaf'), iri('http://example.org/ns#'), iri('http://example.org/path/'),
    iri('urn:no-separator'), iri('http://example.org/a#b/c'), iri('http://example.org/'), iri('x'),
  ];
  const messages = Array.from({ length: 20 }, (_, m) => shapes.map((s, i) => f.quad(s, shapes[(i + m) % shapes.length]!, shapes[(i * 3 + m) % shapes.length]!)));

  it.each(variants)('round-trips every IRI shape with %s', (_name, options) => {
    expectRoundTrip(messages, options);
  });

  it('repeats names under different prefixes and sends fewer bytes than full IRIs', () => {
    const many = Array.from({ length: 200 }, (_, m) => ['a', 'b', 'c'].map(kind =>
      f.quad(iri(`http://example.org/${kind}/${m}`), iri('http://example.org/vocab#value'), f.literal(String(m)))));
    const compressed = expectRoundTrip(many);
    const full = expectRoundTrip(many, { lookup: { maxPrefixes: 0 } });
    expect(compressed.length).toBeLessThan(full.length * 0.8);
  });

  it('survives dictionary eviction when far more IRIs than entries are used', () => {
    const unique = Array.from({ length: 600 }, (_, m) => [
      f.quad(iri(`http://example.org/p${m % 40}/s${m}`), iri(`http://example.org/vocab#p${m % 7}`), iri(`http://other.example/${m % 13}/o${m}`)),
      f.quad(iri(`http://example.org/p${m % 40}/s${m}`), iri('http://example.org/vocab#p0'), f.literal(`v${m}`, iri(`http://example.org/dt#${m % 5}`))),
    ]);
    for (const options of [{ packMessages: false, lookup: { maxNames: 128, maxPrefixes: 8, maxDatatypes: 4 } }, { packMessages: true, lookup: { maxNames: 128, maxPrefixes: 8, maxDatatypes: 4 } }]) {
      expectRoundTrip(unique, options);
    }
  });

  it('keeps recently used names when the name table fills up', () => {
    const hot = iri('http://example.org/vocab#hot');
    const stream = Array.from({ length: 500 }, (_, m) => [f.quad(iri(`http://example.org/s/${m}`), hot, iri(`http://example.org/o/${m}`))]);
    const bytes = expectRoundTrip(stream, { packMessages: false, lookup: { maxNames: 128 } });
    const sent = new MessageDecoder().end(bytes).flatMap(frame => frame.columns?.names ?? []).flatMap(entry => entry.values);
    // Round-robin eviction would send 'hot' again every table turn; recency keeps it.
    expect(sent.filter(name => name === 'hot')).toHaveLength(1);
  });

  it('covers namespaces, triple terms and named graphs', () => {
    const triple = f.quad(iri('http://example.org/s#a'), iri('http://example.org/p#b'), iri('http://example.org/o/c'));
    const quads = [
      f.quad(iri('http://example.org/s#a'), iri('http://example.org/p#b'), triple),
      f.quad(triple.subject as RDF.Quad_Subject, iri('http://example.org/p#b'), f.literal('x', 'en'), iri('http://example.org/g/')),
    ];
    for (const options of [{ packMessages: false, physicalType: PhysicalStreamType.QUADS }, { physicalType: PhysicalStreamType.QUADS, packMessages: true }]) {
      const writer = new Writer({ version: 3, streamType: RdfStreamType.MESSAGES, namespaces: { ex: 'http://example.org/ns#', root: 'http://example.org/' }, ...options });
      writer.addMessage(quads);
      let bytes!: Uint8Array;
      writer.end((error, data) => { if (error) throw error; bytes = data!; });
      const seen: RDF.Quad[] = [];
      let namespaces: Record<string, RDF.NamedNode> = {};
      new Parser().parse(bytes, (error, quad, ns) => { if (error) throw error; if (quad) seen.push(quad); namespaces = ns ?? namespaces; });
      expect(seen).toHaveLength(2);
      expect(seen.every((quad, i) => quad.equals(quads[i]!))).toBe(true);
      expect(namespaces.ex?.value).toBe('http://example.org/ns#');
      expect(namespaces.root?.value).toBe('http://example.org/');
    }
  });
});
