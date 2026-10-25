import { Readable } from 'node:stream';
import { StreamParser as BrowserStreamParser, StreamWriter as BrowserStreamWriter } from '../src/browser';
import { StreamParser } from '../src';
import { readFileSync } from 'node:fs';
import type * as RDF from '@rdfjs/types';
import { Parser as TextParser } from 'rdf-parser-ts';
import { DataFactory, Parser, Writer, MessageDecoder, RdfStreamType, type WriterOptions } from '../src';

const textFactory = { ...DataFactory, literal: (value: string, language?: string | RDF.NamedNode | RDF.DirectionalLanguage) => {
  if (typeof language === 'string' && /--(ltr|rtl)$/.test(language)) {
    const at = language.lastIndexOf('--');
    return DataFactory.literal(value, { language: language.slice(0, at), direction: language.slice(at + 2) as 'ltr' | 'rtl' });
  }
  return DataFactory.literal(value, language);
} };
const fixtures = JSON.parse(readFileSync(new URL('fixtures/conformance/rdf12.json', import.meta.url), 'utf8')) as Array<{ name: string; input: string; expected: string[] }>;
function key(term: RDF.Term): unknown {
  if (term.termType === 'Quad') return [key(term.subject), key(term.predicate), key(term.object), key(term.graph)];
  if (term.termType === 'Literal') return [term.termType, term.value, term.language, term.datatype.value, term.direction || ''];
  return [term.termType, term.value];
}
function keys(quads: Iterable<RDF.Quad>): string[] { return [...quads].map(q => JSON.stringify(key(q))).sort(); }
function scopedKeys(quads: Iterable<RDF.Quad>): string[] {
  const labels = new Map<string, string>();
  const normalize = (term: RDF.Term): RDF.Term => {
    if (term.termType === 'BlankNode') {
      if (!labels.has(term.value)) labels.set(term.value, `b${labels.size}`);
      return DataFactory.blankNode(labels.get(term.value)!);
    }
    if (term.termType === 'Quad') return DataFactory.quad(normalize(term.subject) as RDF.Quad_Subject, term.predicate as RDF.Quad_Predicate, normalize(term.object) as RDF.Quad_Object, normalize(term.graph) as RDF.Quad_Graph);
    return term;
  };
  return keys([...quads].map(q => normalize(q) as RDF.Quad));
}
function write(quads: RDF.Quad[], options: WriterOptions = {}): Uint8Array {
  const writer = new Writer({ version: 3, ...options }); writer.addQuads(quads);
  let out!: Uint8Array;
  writer.end((e, b) => { if (e) throw e; out = b!; });
  return out;
}

describe('upstream Jelly-RDF 1.2 parser fixtures (v1.2.0)', () => {
  for (const fixture of fixtures) it(fixture.name, () => {
    const input = Buffer.from(fixture.input, 'base64');
    if (fixture.name.includes('/neg_')) { expect(() => new Parser().parse(input)).toThrow(); return; }
    const messages = new Parser().parseMessages(input);
    const expected = fixture.expected.map(text => new TextParser({ format: 'N-Quads', factory: textFactory }).parse(text) as RDF.Quad[]);
    // Blank node labels can be renamed to keep messages disjoint.
    if (fixture.name.startsWith('messages/')) {
      expect(messages.map(m => scopedKeys(m))).toEqual(expected.map(m => scopedKeys(m)));
    } else expect(keys(messages.flat())).toEqual(keys(expected.flat()));
    expect(keys(new Parser().parse(input) as RDF.Quad[])).toEqual(keys(messages.flat()));
  });
});

describe('Jelly-RDF 1.2 writer', () => {
  it('round-trips mixed RDF 1.2 terms and many batches', () => {
    const { quad, namedNode: n, literal: l, blankNode: b } = DataFactory;
    const terms = [n('urn:o'), b('b'), l('plain'), l('bonjour', 'fr'), l('مرحبا', { language: 'ar', direction: 'rtl' }), l('1', n('urn:type')), quad(b('s'), n('urn:p'), l('nested'))];
    const quads = Array.from({ length: 500 }, (_, i) => quad(n(`urn:s${i}`), n('urn:p'), terms[i % terms.length]!, i % 3 ? n('urn:g') : DataFactory.defaultGraph()));
    expect(keys(new Parser().parse(write(quads, { messageSize: 17, lookup: { maxNames: 128 } })) as RDF.Quad[])).toEqual(keys(quads));
  });
  it('preserves message boundaries across batches and empty messages', () => {
    const q = DataFactory.quad(DataFactory.blankNode('same'), DataFactory.namedNode('urn:p'), DataFactory.literal('v'));
    const writer = new Writer({ version: 3, streamType: RdfStreamType.MESSAGES, messageSize: 2 });
    writer.addMessage([q, q, q]); writer.addMessage([]); writer.addMessage([q]);
    let bytes!: Uint8Array; writer.end((e, b) => { if (e) throw e; bytes = b!; });
    const messages = new Parser().parseMessages(bytes);
    expect(messages.map(m => m.length)).toEqual([3, 0, 1]);
    expect(messages[0]![0]!.subject.equals(messages[2]![0]!.subject)).toBe(false);
  });
  it('keeps 1.1 output as the default and allows an explicit parser cap', () => {
    const writer = new Writer(); let bytes!: Uint8Array; writer.end((e, b) => { if (e) throw e; bytes = b!; });
    expect(() => new Parser({ maxSupportedVersion: 2 }).parse(bytes)).not.toThrow();
    expect(() => new Parser({ maxSupportedVersion: 2 }).parse(write([]))).toThrow(/version 3/);
  });
});


describe('Jelly 1.2 streaming and limits', () => {
  it('decodes logical messages identically through Node and browser streams', async () => {
    const fixture = fixtures.find(f => f.name === 'messages/pos_007')!;
    const input = Buffer.from(fixture.input, 'base64');
    const expected = new Parser().parse(input, undefined);
    const expectedMessages = new Parser().parseMessages(input);
    const parser = new StreamParser({ messages: true });
    const seen: number[] = []; parser.on('message', m => seen.push(m.length));
    Readable.from(Array.from(input, v => Buffer.from([v]))).pipe(parser);
    const node: RDF.Quad[] = [];
    for await (const entry of parser) node.push(entry.quad);
    expect(keys(node)).toEqual(keys(expected as RDF.Quad[]));
    expect(seen).toEqual(expectedMessages.map(m => m.length));
    const source = new ReadableStream<Uint8Array>({ start(c) { for (const value of input) c.enqueue(Uint8Array.of(value)); c.close(); } });
    const browser = new BrowserStreamParser({ messages: true });
    const reader = source.pipeThrough(browser).getReader();
    const result: RDF.Quad[] = [];
    while (true) { const { done, value } = await reader.read(); if (done) break; result.push((value as { quad: RDF.Quad }).quad); }
    expect(keys(result)).toEqual(keys(node));
  });
  it('writes version 3 through browser Web Streams', async () => {
    const q = DataFactory.quad(DataFactory.namedNode('urn:s'), DataFactory.namedNode('urn:p'), DataFactory.literal('v'));
    const source = new ReadableStream<RDF.Quad>({ start(c) { c.enqueue(q); c.close(); } });
    const reader = source.pipeThrough(new BrowserStreamWriter({ version: 3 })).getReader();
    const chunks: Uint8Array[] = [];
    while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); }
    expect(keys(new Parser().parse(Buffer.concat(chunks)) as RDF.Quad[])).toEqual(keys([q]));
  });
  it('enforces a configurable row limit before expanding compressed columns', () => {
    const q = DataFactory.quad(DataFactory.namedNode('urn:s'), DataFactory.namedNode('urn:p'), DataFactory.literal('v'));
    const bytes = write([q, q, q]);
    expect(() => new Parser({ maxRowsPerBatch: 2 }).parse(bytes)).toThrow(/row_count/);
    expect(new Parser({ maxRowsPerBatch: 3 }).parse(bytes)).toHaveLength(3);
  });
  it('rejects invalid writer combinations and working sets that cannot fit', () => {
    expect(() => new Writer({ version: 3, physicalType: 3 })).toThrow(/QUADS/);
    expect(() => new Writer({ version: 3, lookup: { maxNames: 8 } })).toThrow(/128/);
    const q = DataFactory.quad(DataFactory.namedNode('urn:s'), DataFactory.namedNode('urn:p'), DataFactory.literal('v', DataFactory.namedNode('urn:type')));
    expect(() => write([q], { lookup: { maxDatatypes: 0 } })).toThrow(/single statement/);
    const directional = DataFactory.quad(q.subject, q.predicate, DataFactory.literal('v', { language: 'en', direction: 'ltr' }));
    expect(() => write([directional], { rdfVersion: 1 })).toThrow(/base directions/);
  });
});

describe('upstream Jelly-RDF 1.2 writer fixtures (v1.2.0)', () => {
  const cases = JSON.parse(readFileSync(new URL('fixtures/conformance/rdf12-writer.json', import.meta.url), 'utf8')) as Array<{ name: string; options: string; input: string[]; expected: string | null }>;
  for (const fixture of cases) it(fixture.name, () => {
    const framing = new MessageDecoder({ delimited: true });
    const optionFrame = framing.decode(Buffer.from(fixture.options, 'base64'))[0]!;
    const raw = optionFrame.rows[0]!;
    if (raw.case !== 'options') throw new Error('Missing options fixture');
    const o = raw.value;
    const serialize = (): Uint8Array => {
      const writer = new Writer({ version: 3, physicalType: o.physicalType, rdfVersion: o.rdfVersion, streamType: o.streamType,
        lookup: { maxNames: o.maxNameTableSize, maxPrefixes: o.maxPrefixTableSize, maxDatatypes: o.maxDatatypeTableSize }, messageSize: 7 });
      for (const text of fixture.input) {
        const quads = new TextParser({ format: 'N-Quads', factory: textFactory }).parse(text) as RDF.Quad[];
        if (o.streamType === 1) writer.addMessage(quads); else writer.addQuads(quads);
      }
      let bytes!: Uint8Array; writer.end((e, b) => { if (e) throw e; bytes = b!; }); return bytes;
    };
    if (!fixture.expected) { expect(serialize).toThrow(); return; }
    const expected = new Parser().parseMessages(Buffer.from(fixture.expected, 'base64'));
    const actual = new Parser().parseMessages(serialize());
    if (o.streamType === 1) expect(actual.map(m => scopedKeys(m))).toEqual(expected.map(m => scopedKeys(m)));
    else expect(keys(actual.flat())).toEqual(keys(expected.flat()));
  });
});
