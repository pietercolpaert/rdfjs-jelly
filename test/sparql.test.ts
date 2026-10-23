import { Readable } from 'node:stream';
import { SparqlStreamParser, SparqlStreamWriter, JellySparqlResultError, RdfVersion, SparqlStreamType } from '../src';
import { SparqlStreamParser as WebParser, SparqlStreamWriter as WebWriter } from '../src/browser';
import { encodeSparqlFrame, sparqlProto } from '../src/sparql/framing';
import { readFileSync } from 'node:fs';
import type * as RDF from '@rdfjs/types';
import { DataFactory } from '../src';
import { SparqlWriter } from '../src/sparql/SparqlWriter';
import { SparqlFrameDecoder } from '../src/sparql/framing';
import { SparqlParser } from '../src/sparql/SparqlParser';
import type { SparqlEvent, SparqlResult, SparqlTerm } from '../src/sparql-types';

type JsonTerm = { type: string; value: string | { subject: JsonTerm; predicate: JsonTerm; object: JsonTerm }; datatype?: string; 'xml:lang'?: string; 'its:dir'?: 'ltr' | 'rtl' };
type JsonResult = { head?: { vars?: string[]; link?: string[] }; boolean?: boolean; results?: { bindings: Record<string, JsonTerm>[] } };
type Fixture = { name: string; data: string | null; results: JsonResult[]; options?: string };
const parseFixtures = JSON.parse(readFileSync(new URL('fixtures/conformance/sparql-from_jelly.json', import.meta.url), 'utf8')) as Fixture[];
function fromJson(t: JsonTerm): SparqlTerm {
  const f = DataFactory;
  if (t.type === 'uri') return f.namedNode(t.value as string);
  if (t.type === 'bnode') return f.blankNode(t.value as string);
  if (t.type === 'literal' || t.type === 'typed-literal') return f.literal(t.value as string, t['its:dir'] ? { language: t['xml:lang']!, direction: t['its:dir'] } : t['xml:lang'] ?? (t.datatype ? f.namedNode(t.datatype) : undefined));
  if (t.type === 'triple') { const v = t.value as { subject: JsonTerm; predicate: JsonTerm; object: JsonTerm }; return f.quad(fromJson(v.subject) as RDF.Quad_Subject, fromJson(v.predicate) as RDF.Quad_Predicate, fromJson(v.object)); }
  throw new Error(`Unsupported JSON term ${t.type}`);
}
function termKey(term: RDF.Term, labels: Map<string, number>): unknown {
  if (term.termType === 'BlankNode') { if (!labels.has(term.value)) labels.set(term.value, labels.size); return ['blank', labels.get(term.value)]; }
  if (term.termType === 'Quad') return [termKey(term.subject, labels), termKey(term.predicate, labels), termKey(term.object, labels)];
  if (term.termType === 'Literal') return ['literal', term.value, term.language, term.direction || '', term.datatype.value];
  return [term.termType, term.value];
}
function normalized(result: SparqlResult): unknown {
  if (result.type === 'ask') return { boolean: result.boolean };
  const labels = new Map<string, number>();
  return { variables: result.variables, links: result.links, bindings: result.bindings.map(b => result.variables.filter(v => b.has(v)).map(v => [v, termKey(b.get(v)!, labels)])) };
}
function expected(j: JsonResult): SparqlResult {
  const info = { complete: true, links: j.head?.link ?? [], metadata: new Map<string, Uint8Array>() };
  return 'boolean' in j ? { ...info, type: 'ask', boolean: j.boolean! } : { ...info, type: 'select', variables: j.head?.vars ?? [], bindings: j.results!.bindings.map(row => new Map(Object.entries(row).map(([k, v]) => [k, fromJson(v)]))) };
}
describe('official Jelly-SPARQL parser fixtures (v1.2.0)', () => {
  for (const fixture of parseFixtures) it(fixture.name, () => {
    const data = Buffer.from(fixture.data!, 'base64');
    if (fixture.name.includes('/neg_')) { expect(() => new SparqlParser().parse(data)).toThrow(); return; }
    expect(new SparqlParser().parse(data).map(normalized)).toEqual(fixture.results.map(expected).map(normalized));
  });
});

describe('official Jelly-SPARQL writer fixtures (v1.2.0)', () => {
  const fixtures = JSON.parse(readFileSync(new URL('fixtures/conformance/sparql-to_jelly.json', import.meta.url), 'utf8')) as Fixture[];
  for (const fixture of fixtures) it(fixture.name, () => {
    const options = new SparqlFrameDecoder().decode(Buffer.from(fixture.options!, 'base64'))[0]!.options!;
    const write = (): Uint8Array => {
      const writer = new SparqlWriter({ streamType: Number(options.streamType), rdfVersion: Number(options.rdfVersion), streamName: options.streamName ?? '', frameSize: 7,
        lookup: { maxNames: options.maxNameTableSize!, maxPrefixes: options.maxPrefixTableSize!, maxDatatypes: options.maxDatatypeTableSize! } });
      for (const result of fixture.results) writer.addResult(expected(result));
      return writer.end();
    };
    if (fixture.name.includes('/neg_')) { expect(write).toThrow(); return; }
    const actual = new SparqlParser().parse(write());
    const reference = new SparqlParser().parse(Buffer.from(fixture.data!, 'base64'));
    expect(actual.map(normalized)).toEqual(reference.map(normalized));
    expect(actual.every(r => r.complete)).toBe(true);
  });
});


const value = DataFactory.literal('hello');
function selectBytes(count: number, frameSize = 7): Uint8Array {
  const writer = new SparqlWriter({ frameSize, lookup: { maxNames: 128 } });
  writer.startSelect(['s', 'v'], { links: ['https://example.org/results'], metadata: { binary: Uint8Array.of(255, 0, 128) } });
  for (let i = 0; i < count; i++) writer.addBinding(new Map<string, SparqlTerm>([['s', DataFactory.namedNode(`urn:${i}`)], ['v', value]]));
  return writer.end();
}
async function collectWeb<T>(stream: ReadableStream<T>): Promise<T[]> {
  const reader = stream.getReader(); const result: T[] = [];
  while (true) { const { done, value } = await reader.read(); if (done) return result; result.push(value); }
}
describe('SPARQL completion, scopes, and guardrails', () => {
  it('marks a missing trailer incomplete while retaining SELECT rows and ASK false', () => {
    for (const ask of [false, true]) {
      const w = new SparqlWriter();
      if (ask) w.addAsk(false); else { w.startSelect(['x']); w.addBinding({ x: value }); }
      const frame = new SparqlFrameDecoder().decode(w.end())[0]!;
      frame.trailer = null;
      const result = new SparqlParser().parse(encodeSparqlFrame(frame))[0]!;
      expect(result.complete).toBe(false);
      if (result.type === 'ask') expect(result.boolean).toBe(false);
      else expect(result.bindings[0]!.get('x')!.equals(value)).toBe(true);
    }
  });
  it('signals producer errors and can continue punctuated streams through a callback', () => {
    const writer = new SparqlWriter({ streamType: SparqlStreamType.PUNCTUATED });
    writer.startSelect(['x']); writer.addBinding({ x: value }); writer.endResult('backend timeout');
    writer.addAsk(false);
    const bytes = writer.end();
    expect(() => new SparqlParser().parse(bytes)).toThrow(JellySparqlResultError);
    const errors: JellySparqlResultError[] = [];
    const results = new SparqlParser({ onResultError: error => errors.push(error) }).parse(bytes);
    expect(errors.map(e => [e.resultIndex, e.message])).toEqual([[0, 'backend timeout']]);
    expect(results.map(r => r.complete)).toEqual([false, true]);
    expect(results[0]!.error).toBe('backend timeout');
  });
  it('preserves a flat error even after concatenated options and a successful trailer', () => {
    const a = new SparqlWriter(); a.startSelect(['x']); a.addBinding({ x: value }); a.endResult('failed');
    const b = new SparqlWriter(); b.startSelect(['x']); b.addBinding({ x: value });
    const result = new SparqlParser({ onResultError: () => undefined }).parse(Buffer.concat([a.end(), b.end()]))[0]!;
    expect(result.complete).toBe(false); expect(result.error).toBe('failed');
    expect(result.type === 'select' && result.bindings.length).toBe(2);
  });
  it('scopes blank nodes per result set, including in nested triple terms and across frames', () => {
    const writer = new SparqlWriter({ streamType: SparqlStreamType.PUNCTUATED, frameSize: 1 });
    const b = DataFactory.blankNode('b'); const t = DataFactory.quad(b, DataFactory.namedNode('urn:p'), b);
    for (let i = 0; i < 2; i++) { writer.startSelect(['b', 't']); writer.addBinding({ b, t }); writer.addBinding({ b, t }); writer.endResult(); }
    const results = new SparqlParser().parse(writer.end());
    if (results[0]!.type !== 'select' || results[1]!.type !== 'select') throw new Error('Expected SELECT');
    const first = results[0]!.bindings;
    expect(first[0]!.get('b')!.equals(first[1]!.get('b')!)).toBe(true);
    expect(first[0]!.get('b')!.equals((first[0]!.get('t') as RDF.Quad).subject)).toBe(true);
    expect(first[0]!.get('b')!.equals(results[1]!.bindings[0]!.get('b')!)).toBe(false);
  });
  it('handles unbound and special variable names and keeps binary metadata', () => {
    const writer = new SparqlWriter(); writer.startSelect(['__proto__', 'toString', 'x']);
    writer.addBinding(new Map([['__proto__', value]])); writer.addBinding({ x: undefined });
    const result = new SparqlParser().parse(writer.end())[0]!;
    if (result.type !== 'select') throw new Error('Expected SELECT');
    expect(result.bindings[0]!.get('__proto__')!.equals(value)).toBe(true);
    expect(result.bindings[1]!.size).toBe(0);
    const metadata = new SparqlParser().parse(selectBytes(1))[0]!;
    expect(metadata.links).toEqual(['https://example.org/results']);
    expect(metadata.metadata.get('binary')).toEqual(Uint8Array.of(255, 0, 128));
  });
  it('enforces row, cell, frame, and lookup limits', () => {
    const bytes = selectBytes(3);
    expect(() => new SparqlParser({ maxRowsPerBatch: 2 }).parse(bytes)).toThrow(/row_count/);
    expect(() => new SparqlParser({ maxCellsPerBatch: 5 }).parse(bytes)).toThrow(/cell count/);
    expect(() => new SparqlParser({ maxMessageSize: 4 }).parse(bytes)).toThrow(/size limit/);
    expect(() => new SparqlParser({ maxLookupTableSize: 127 }).parse(bytes)).toThrow(/Lookup size/);
    expect(new SparqlParser({ maxRowsPerBatch: 3, maxCellsPerBatch: 6 }).parse(bytes)).toHaveLength(1);
    expect(() => new SparqlParser().parse(new Uint8Array())).toThrow(/no frames/);
  });
  it('rejects terms incompatible with the declared RDF version and cannot-fit rows', () => {
    const writer = new SparqlWriter({ rdfVersion: RdfVersion.RDF_1_1 }); writer.startSelect(['x']);
    expect(() => writer.addBinding({ x: DataFactory.literal('v', { language: 'en', direction: 'ltr' }) })).toThrow(/base directions/);
    const small = new SparqlWriter({ lookup: { maxDatatypes: 0 } }); small.startSelect(['x']);
    expect(() => small.addBinding({ x: DataFactory.literal('1', DataFactory.namedNode('urn:type')) })).toThrow(/single solution/);
    expect(() => writer.addBinding({ missing: value })).toThrow(/Undeclared variable/);
  });
  it('supports bare single frames when explicitly requested', () => {
    const writer = new SparqlWriter({ delimited: false }); writer.addAsk(true);
    expect(new SparqlParser({ delimited: false }).parse(writer.end())[0]).toMatchObject({ type: 'ask', boolean: true, complete: true });
  });
});

describe('SPARQL Node and browser event streams', () => {
  it.each([1, Number.MAX_SAFE_INTEGER])('parses fragmented input with chunk size %s', async chunkSize => {
    const bytes = selectBytes(chunkSize === 1 ? 20 : 1000, 11);
    const chunks: Uint8Array[] = [];
    for (let at = 0; at < bytes.length; at += chunkSize) chunks.push(bytes.subarray(at, at + chunkSize));
    const nodeEvents: SparqlEvent[] = [];
    for await (const event of Readable.from(chunks).pipe(new SparqlStreamParser({ highWaterMark: 1 }))) {
      nodeEvents.push(event);
      if (nodeEvents.length % 101 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    const source = new ReadableStream<Uint8Array>({ start(c) { for (const chunk of chunks) c.enqueue(chunk); c.close(); } });
    const webEvents = await collectWeb(source.pipeThrough(new WebParser()));
    expect(webEvents).toEqual(nodeEvents);
    expect(nodeEvents.filter(e => e.type === 'binding')).toHaveLength(chunkSize === 1 ? 20 : 1000);
    expect(nodeEvents.at(-1)).toEqual({ type: 'end', resultIndex: 0, complete: true });
  });
  it('pipes punctuated results through both stream writers', async () => {
    const fixture = parseFixtures.find(f => f.name === 'punctuated/pos_003')!;
    const bytes = Buffer.from(fixture.data!, 'base64');
    const expectedResults = new SparqlParser().parse(bytes).map(normalized);
    const output: Uint8Array[] = [];
    for await (const chunk of Readable.from([bytes]).pipe(new SparqlStreamParser()).pipe(new SparqlStreamWriter({ streamType: SparqlStreamType.PUNCTUATED, frameSize: 1 }))) output.push(chunk);
    expect(new SparqlParser().parse(Buffer.concat(output)).map(normalized)).toEqual(expectedResults);
    const source = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(bytes); c.close(); } });
    const web = await collectWeb(source.pipeThrough(new WebParser()).pipeThrough(new WebWriter({ streamType: SparqlStreamType.PUNCTUATED, frameSize: 1 })));
    expect(new SparqlParser().parse(Buffer.concat(web)).map(normalized)).toEqual(expectedResults);
  });
  it('reports invalid frames through Node and browser streams', async () => {
    const bytes = Uint8Array.of(5, 1);
    await expect((async () => { for await (const _ of Readable.from([bytes]).pipe(new SparqlStreamParser())) { /* drain */ } })()).rejects.toThrow(/Truncated/);
    const source = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(bytes); c.close(); } });
    await expect(collectWeb(source.pipeThrough(new WebParser()))).rejects.toThrow(/Truncated/);
  });
});
