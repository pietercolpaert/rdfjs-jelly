import { readFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import type * as RDF from '@rdfjs/types';
import { Reader, Writer as ProtoWriter } from 'protobufjs/minimal.js';
import {
  DataFactory as f, Decoder, MessageDecoder, MessageEncoder, Parser, PhysicalStreamType, RdfStreamType, StreamParser, Writer,
  type MessageQuad, type MessageQuadArray, type QuadPattern, type WriterOptions,
} from '../src';
import { StreamParser as BrowserStreamParser } from '../src/browser';
import { proto } from '../src/generated/rdf_pb';

const p = f.namedNode('urn:p'), other = f.namedNode('urn:other'), s = f.namedNode('urn:s');
const statements = [
  f.quad(s, p, f.literal('a')),
  f.quad(s, other, f.literal('b', 'EN')),
  f.quad(f.namedNode('urn:s2'), p, f.literal('c'), f.namedNode('urn:g')),
  f.quad(s, p, f.namedNode('urn:o')),
];
function write(quads: RDF.Quad[], options: WriterOptions = {}): Uint8Array {
  const writer = new Writer(options);
  writer.addQuads(quads);
  return end(writer);
}
function end(writer: Writer): Uint8Array {
  let output!: Uint8Array;
  writer.end((error, bytes) => { if (error) throw error; output = bytes!; });
  return output;
}
function keys(output: RDF.Quad[]): string[] { return output.map(q => JSON.stringify(q)); }
function delimited(frames: object[]): Uint8Array {
  const w = ProtoWriter.create();
  for (const frame of frames) w.bytes(proto.RdfStreamFrame.encode(frame).finish());
  return w.finish();
}
const options = { physicalType: 2, streamType: 1, version: 3, rdfVersion: 3,
  maxNameTableSize: 128, maxPrefixTableSize: 4, maxDatatypeTableSize: 4 };

describe('quad patterns', () => {
  it.each([2, 3] as const)('uses OR between patterns and AND between positions in version %i', version => {
    const bytes = write(statements, { version, messageSize: 2 });
    const parser = new Parser({ quadPatterns: [{ subject: s, predicate: other }, { graph: f.namedNode('urn:g') }] });
    expect(keys(parser.parse(bytes) as RDF.Quad[])).toEqual(keys([statements[1]!, statements[2]!]));
    const callbackOutput: RDF.Quad[] = [];
    parser.parse(bytes, (error, quad) => { if (error) throw error; if (quad) callbackOutput.push(quad); });
    expect(keys(callbackOutput)).toEqual(keys([statements[1]!, statements[2]!]));
  });

  it.each([2, 3] as const)('handles absent, empty, and wildcard patterns in version %i', version => {
    const bytes = write(statements, { version });
    for (const quadPatterns of [undefined, [{}], [{ subject: null, graph: null }]]) {
      expect(new Parser({ quadPatterns }).parse(bytes)).toHaveLength(4);
    }
    expect(new Parser({ quadPatterns: [] }).parse(bytes)).toEqual([]);
    expect(new Parser({ quadPatterns: [{ graph: f.defaultGraph() }] }).parse(bytes)).toHaveLength(3);
    expect(new Parser({ quadPatterns: [{ predicate: p }, { predicate: p }] }).parse(bytes)).toHaveLength(3);
  });

  it('compares literals by lexical form, datatype, language and direction', () => {
    const xsdString = f.namedNode('http://www.w3.org/2001/XMLSchema#string');
    const objects = [f.literal('x'), f.literal('x', xsdString), f.literal('x', 'EN'),
      f.literal('x', { language: 'en', direction: 'ltr' }), f.literal('x', { language: 'en', direction: 'rtl' }),
      f.literal('x', f.namedNode('urn:custom')), f.namedNode('x')];
    const bytes = write(objects.map(o => f.quad(s, p, o)));
    for (const object of objects) {
      const output = new Parser({ quadPatterns: [{ object }] }).parse(bytes) as RDF.Quad[];
      expect(output).toHaveLength(object.equals(objects[0]!) ? 2 : 1);
      expect(output.every(q => q.object.equals(object))).toBe(true);
    }
  });

  it('does not materialize rejected terms, triple terms or quads', () => {
    const factory = { ...f, namedNode: vi.fn(f.namedNode), blankNode: vi.fn(f.blankNode), literal: vi.fn(f.literal), quad: vi.fn(f.quad) };
    const nested = f.quad(f.blankNode('inner'), p, f.quad(s, p, f.literal('nested')));
    const bytes = write([f.quad(f.blankNode('outer'), p, nested), ...statements], { messageSize: 2 });
    expect(new Parser({ factory: factory as RDF.DataFactory, quadPatterns: [{ predicate: f.namedNode('urn:absent') }] }).parse(bytes)).toEqual([]);
    for (const method of [factory.namedNode, factory.blankNode, factory.literal, factory.quad]) expect(method).not.toHaveBeenCalled();
    const output = new Parser({ factory: factory as RDF.DataFactory, quadPatterns: [{ object: f.literal('c') }] }).parse(bytes) as RDF.Quad[];
    expect(output).toHaveLength(1);
    expect(output[0]!.equals(statements[2]!)).toBe(true);
    expect(factory.quad).toHaveBeenCalledTimes(1);
    expect(factory.literal).toHaveBeenCalledTimes(1);
    expect(factory.blankNode).not.toHaveBeenCalled();
  });

  it.each([true, false])('keeps counters, empty messages, scopes and metadata (packing: %s)', packMessages => {
    const writer = new Writer({ streamType: RdfStreamType.MESSAGES, messageSize: 2, packMessages });
    const b = f.blankNode('same');
    writer.addMessage([]);
    writer.addMessage([f.quad(b, p, f.literal('skip')), f.quad(b, p, f.literal('keep')), f.quad(b, p, f.literal('skip'))]);
    writer.addMessage([f.quad(b, other, f.literal('filtered'))], { source: Uint8Array.of(7) });
    writer.addMessage([]);
    writer.addMessage([f.quad(b, p, f.literal('keep'))]);
    writer.addMessage([]);
    const bytes = end(writer), parser = new Parser({ quadPatterns: [{ object: f.literal('keep') }] });
    const messages = parser.parseMessages(bytes);
    expect(messages.map(m => m.length)).toEqual([0, 1, 0, 0, 1, 0]);
    expect(messages.map(m => m.messageCounter)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(messages[2]!.metadata.get('source')).toEqual(Uint8Array.of(7));
    expect(messages[1]![0]!.subject.value).toBe('b1_same');
    expect(messages[4]![0]!.subject.value).toBe('b4_same');
    const wrapped = new Parser({ messages: true, quadPatterns: [{ predicate: other }] }).parse(bytes) as MessageQuadArray;
    expect(wrapped.messageCount).toBe(6);
    expect(wrapped.map(q => q.messageCounter)).toEqual([2]);
    expect(new Parser({ quadPatterns: [] }).parseMessages(bytes).map(m => m.length)).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it('matches blank nodes and nested triple terms against their output scopes', () => {
    const writer = new Writer({ streamType: RdfStreamType.MESSAGES });
    const triple = f.quad(f.blankNode('b'), p, f.quad(s, p, f.literal('x', 'en')));
    const q = f.quad(f.blankNode('b'), p, triple, f.blankNode('g'));
    writer.addMessage([q]); writer.addMessage([q]);
    const bytes = end(writer), all = new Parser().parseMessages(bytes);
    const pattern: QuadPattern = { subject: all[1]![0]!.subject, object: all[1]![0]!.object, graph: all[1]![0]!.graph };
    const filtered = new Parser({ quadPatterns: [pattern] }).parseMessages(bytes);
    expect(filtered.map(m => m.length)).toEqual([0, 1]);
    expect(filtered[1]![0]!.equals(all[1]![0]!)).toBe(true);
    expect(new Parser({ quadPatterns: [{ subject: f.blankNode('b') }] }).parse(bytes)).toHaveLength(0);
  });

  it('preserves unmatched unfinished messages at EOF and restated options', () => {
    const batch = { rowCount: 1, names: [{ id: 1, values: ['urn:s', 'urn:p'] }], subjects: { nameIds: [1] },
      predicates: { nameIds: [2] }, objects: { lexValues: ['x'] } };
    const bytes = delimited([{ rows: [{ options }], columns: batch }, { rows: [{ options }], columns: batch }]);
    const messages = new Parser({ quadPatterns: [] }).parseMessages(bytes);
    expect(messages.map(m => m.length)).toEqual([0, 0]);
    expect(messages.map(m => m.messageCounter)).toEqual([0, 1]);
  });

  it('updates lookup state on rejected rows and name/prefix/datatype replacements', () => {
    const batch = (prefix: string, name: string, datatype: string) => ({ columns: { rowCount: 1,
      names: [{ id: 1, values: [name, 'p'] }], prefixes: [{ id: 1, values: [prefix] }],
      datatypes: [{ id: 1, values: [datatype] }], subjects: { nameIds: [1], prefixIds: [1] },
      predicates: { nameIds: [2], prefixIds: [1] }, objects: { lexValues: ['v'], literalKinds: [1] }, messageLengths: [1] } });
    const bytes = delimited([{ rows: [{ options }] }, batch('urn:a:', 's', 'urn:t1'), batch('urn:b:', 's', 'urn:t1'),
      batch('urn:b:', 'new', 'urn:t2'), { rows: [{ options }] }, batch('urn:c:', 's', 'urn:t3')]);
    const parser = new Parser({ quadPatterns: [{ subject: f.namedNode('urn:b:new'), object: f.literal('v', f.namedNode('urn:t2')) },
      { predicate: f.namedNode('urn:c:p') }] });
    const output = parser.parseMessages(bytes);
    expect(output.map(m => m.length)).toEqual([0, 0, 1, 1]);
    expect(output[2]![0]!.subject.value).toBe('urn:b:new');
    expect(output[3]![0]!.subject.value).toBe('urn:c:s');
  });

  it('still rejects malformed values and positions in filtered-out rows', () => {
    const columns = { rowCount: 1, names: [{ id: 1, values: ['urn:s', 'urn:p'] }], subjects: { nameIds: [1] },
      predicates: { nameIds: [2] }, objects: { lexValues: ['x'] }, messageLengths: [1] };
    for (const patch of [ { objects: { nameIds: [127] } }, { subjects: { lexValues: ['bad subject'] } },
      { objects: { lexValues: ['x'], literalKinds: [1] } }, { objects: { lexValues: ['x'], literalKinds: [2], langtags: ['en'], langtagDirections: [3] } },
      { subjects: { layouts: [15] } }, { messageLengths: [2] } ]) {
      const bytes = delimited([{ rows: [{ options }], columns: { ...columns, ...patch } }]);
      expect(() => new Parser({ quadPatterns: [] }).parse(bytes)).toThrow();
    }
  });

  it('preserves namespaces when all quads are excluded', () => {
    const bytes = write(statements, { namespaces: { ex: 'urn:ex:' } });
    const namespaces: string[] = [];
    new Parser({ quadPatterns: [] }).parse(bytes, (error, _quad, ns) => {
      if (error) throw error;
      if (ns?.ex) namespaces.push(ns.ex.value);
    });
    expect(namespaces).toEqual(['urn:ex:']);
  });

  it.each([2, 3] as const)('filters decoded and protobuf frame APIs in version %i', version => {
    const bytes = write(statements, { version, messageSize: 2 });
    const frames = new MessageDecoder().decode(bytes);
    const decoder = new Decoder({ quadPatterns: [{ predicate: other }] });
    const output = frames.flatMap(frame => decoder.decode(frame));
    output.push(...decoder.finishMessages().flat());
    expect(output).toHaveLength(1);
    const direct = new Decoder({ quadPatterns: [{ predicate: other }] });
    const payloads = Reader.create(bytes);
    const protoOutput: RDF.Quad[] = [];
    while (payloads.pos < payloads.len) protoOutput.push(...direct.decodeProto(proto.RdfStreamFrame.decode(payloads.bytes())));
    protoOutput.push(...direct.finishMessages().flat());
    expect(protoOutput).toHaveLength(1);
  });

  it('selects predicate runs across messages and shrinks reused buffers without stale rows', () => {
    const writer = new Writer({ streamType: RdfStreamType.MESSAGES, messageSize: 1024, lookup: { maxNames: 128 } });
    for (let m = 0; m < 30; m++) {
      const length = m === 28 ? 0 : m === 29 ? 1 : 80;
      writer.addMessage(Array.from({ length }, (_, i) => f.quad(
        f.blankNode('shared'), i < 25 || i > 55 ? other : p,
        i % 3 ? f.literal(`value ${m}/${i}`) : f.namedNode(`https://example.org/${m}/${i}`),
      )));
    }
    const bytes = end(writer), all = new Parser().parseMessages(bytes);
    const selections: QuadPattern[][] = [ [{ predicate: p }], [{ predicate: p }, { predicate: other }],
      [{ predicate: p, object: f.literal('value 0/40') }, { predicate: other, subject: f.blankNode('b2_shared') }],
      [{ predicate: f.literal('never a predicate') }], [] ];
    for (const patterns of selections) {
      const actual = new Parser({ quadPatterns: patterns }).parseMessages(bytes);
      for (let m = 0; m < all.length; m++) {
        const expected = all[m]!.filter(q => patterns.some(pattern =>
          (!pattern.predicate || q.predicate.equals(pattern.predicate)) &&
          (!pattern.subject || q.subject.equals(pattern.subject)) && (!pattern.object || q.object.equals(pattern.object))));
        expect(actual[m]!.messageCounter).toBe(m);
        expect(actual[m]).toHaveLength(expected.length);
        for (let i = 0; i < expected.length; i++) expect(actual[m]![i]!.equals(expected[i]!)).toBe(true);
      }
    }
  });

  it('invalidates predicate verdicts on name, prefix and stream-option replacement', () => {
    const batch = (prefix: string, name: string) => ({ columns: { rowCount: 3,
      names: [{ id: 1, values: ['s', name] }], prefixes: [{ id: 1, values: [prefix] }],
      subjects: { nameIds: [1], prefixIds: [1], layouts: [1] },
      predicates: { nameIds: [2, 2], prefixIds: [1], layouts: [0] },
      objects: { lexValues: ['v'], layouts: [1] }, messageLengths: [1, 2],
    } });
    const bytes = delimited([{ rows: [{ options }] }, batch('urn:a:', 'p'), batch('urn:b:', 'p'),
      batch('urn:b:', 'q'), batch('urn:b:', 'p'), { rows: [{ options }] }, batch('urn:a:', 'p')]);
    const parser = new Parser({ quadPatterns: [{ predicate: f.namedNode('urn:a:p') }, { predicate: f.namedNode('urn:b:q') }] });
    const actual = parser.parseMessages(bytes);
    expect(actual.map(m => m.length)).toEqual([1, 2, 0, 0, 1, 2, 0, 0, 1, 2]);
    expect(actual.map(m => m.messageCounter)).toEqual(Array.from({ length: 10 }, (_, i) => i));
  });

  it('advances inferred triple-term references when earlier runs are rejected', () => {
    const rows = Array.from({ length: 60 }, (_, i) => f.quad(s, i % 3 ? other : p,
      f.quad(f.namedNode(`urn:inner${i}`), p, f.quad(f.blankNode('b'), other, f.literal(String(i), 'en')))));
    const bytes = write(rows, { messageSize: 17, lookup: { maxNames: 128 } });
    const expected = new Parser().parse(bytes) as RDF.Quad[];
    const actual = new Parser({ quadPatterns: [{ predicate: p }] }).parse(bytes) as RDF.Quad[];
    const selected = expected.filter(q => q.predicate.equals(p));
    expect(actual).toHaveLength(selected.length);
    for (let i = 0; i < actual.length; i++) expect(actual[i]!.equals(selected[i]!)).toBe(true);
  });

  it('validates unselected columns and predicate layouts without materializing rows', () => {
    const columns = { rowCount: 4, names: [{ id: 1, values: ['urn:s', 'urn:other'] }], subjects: { nameIds: [1], layouts: [2] },
      predicates: { nameIds: [2], layouts: [2] }, objects: { lexValues: ['x'], layouts: [2] }, messageLengths: [4] };
    const patches = [
      { subjects: null }, { objects: null }, { subjects: { nameIds: [1] } },
      { objects: { layouts: [18] } }, { graphs: { lexValues: ['invalid'], layouts: [2] } },
      { predicates: { nameIds: [2], layouts: [15] } }, { predicates: { nameIds: [2], layouts: [3] } },
      { predicates: { nameIds: [2] } }, { predicates: { layouts: [18] } },
      { predicates: { nameIds: [2], layouts: [2], kinds: Uint8Array.of(1) } },
      { predicates: { nameIds: [2], prefixIds: [4], layouts: [2] } },
      { objects: { nameIds: [127], layouts: [2] } },
      { objects: { lexValues: ['x'], literalKinds: [1], layouts: [2] } },
      { objects: { tripleTerms: [{}], layouts: [2] } },
    ];
    for (const patch of patches) {
      const bytes = delimited([{ rows: [{ options }], columns: { ...columns, ...patch } }]);
      expect(() => new Parser({ quadPatterns: [{ predicate: p }] }).parse(bytes)).toThrow();
    }
  });

  describe('column-driven selection on any pinned IRI position', () => {
    const graphs = [f.defaultGraph(), f.namedNode('urn:g:1'), f.namedNode('urn:g:2'), f.blankNode('g')];
    function build(physicalType: PhysicalStreamType, options: WriterOptions = {}): { bytes: Uint8Array; all: ReturnType<Parser["parseMessages"]> } {
      const writer = new Writer({ streamType: RdfStreamType.MESSAGES, physicalType, messageSize: 7, ...options });
      for (let m = 0; m < 25; m++) {
        writer.addMessage(Array.from({ length: m % 6 === 0 ? 0 : 3 + (m * 7) % 40 }, (_, i) => f.quad(
          i % 5 === 0 ? f.blankNode(`b${i % 3}`) : f.namedNode(`https://example.org/s/${(m + i) % 11}`),
          f.namedNode(`https://example.org/p${(i * 3) % 4}`),
          i % 4 === 0 ? f.literal(`héllo ✓ 日本 ${m}/${i}`) : i % 4 === 1 ? f.literal(String(i), f.namedNode('urn:integer'))
            : i % 4 === 2 ? f.literal(`tekst ${i}`, 'nl') : f.namedNode(`https://example.org/o/${i % 9}`),
          physicalType === PhysicalStreamType.QUADS ? graphs[(m + i) % 4]! : f.defaultGraph(),
        )));
      }
      let bytes!: Uint8Array;
      writer.end((error, output) => { if (error) throw error; bytes = output!; });
      return { bytes, all: new Parser().parseMessages(bytes) };
    }
    const matches = (q: RDF.Quad, patterns: readonly QuadPattern[]): boolean => patterns.some(p =>
      (!p.subject || q.subject.equals(p.subject)) && (!p.predicate || q.predicate.equals(p.predicate)) &&
      (!p.object || q.object.equals(p.object)) && (!p.graph || q.graph.equals(p.graph)));

    it.each([
      ['subject', [{ subject: f.namedNode('https://example.org/s/3') }, { subject: f.namedNode('https://example.org/s/7') }]],
      ['object', [{ object: f.namedNode('https://example.org/o/3') }]],
      ['graph', [{ graph: f.namedNode('urn:g:1') }, { graph: f.namedNode('urn:g:2') }]],
      ['predicate', [{ predicate: f.namedNode('https://example.org/p1') }]],
      ['subject with other positions', [{ subject: f.namedNode('https://example.org/s/3'), predicate: f.namedNode('https://example.org/p1') }]],
      ['object with other positions', [{ object: f.namedNode('https://example.org/o/3'), graph: f.namedNode('urn:g:1') }]],
      ['an absent IRI', [{ subject: f.namedNode('urn:nobody') }]],
    ] as Array<[string, QuadPattern[]]>)('selects by %s like filtering afterwards', (_name, patterns) => {
      for (const physicalType of [PhysicalStreamType.TRIPLES, PhysicalStreamType.QUADS]) {
        for (const options of [{}, { packMessages: false }, { persistentLookups: false }, { lookup: { maxNames: 128, maxPrefixes: 4, maxDatatypes: 2 } }]) {
          const { bytes, all } = build(physicalType, options);
          const actual = new Parser({ quadPatterns: patterns }).parseMessages(bytes);
          expect(actual.map(m => m.messageCounter)).toEqual(all.map(m => m.messageCounter));
          for (let m = 0; m < all.length; m++) {
            const expected = all[m]!.filter(q => matches(q, patterns));
            expect(actual[m], `message ${m}`).toHaveLength(expected.length);
            expected.forEach((q, i) => expect(q.equals(actual[m]![i]!)).toBe(true));
          }
          const flat = new Parser({ quadPatterns: patterns }).parse(bytes) as RDF.Quad[];
          expect(flat).toHaveLength(all.flat().filter(q => matches(q, patterns)).length);
        }
      }
    });

    it('decodes the literal text of selected rows only, including multi-byte characters', () => {
      const { bytes, all } = build(PhysicalStreamType.TRIPLES);
      const target = all.flat().find(q => q.object.termType === 'Literal' && q.object.value.startsWith('héllo'))!;
      const output = new Parser({ quadPatterns: [{ subject: target.subject.termType === 'NamedNode' ? target.subject : f.namedNode('https://example.org/s/1') }] }).parse(bytes) as RDF.Quad[];
      expect(output.some(q => q.object.value.startsWith('héllo ✓ 日本'))).toBe(true);
      for (const q of output) expect(all.flat().some(other => other.equals(q))).toBe(true);
    });

    it('selects subjects when the lookup entries holding them are replaced between batches', () => {
      const batch = (prefix: string, name: string) => ({ columns: { rowCount: 3,
        names: [{ id: 1, values: [name, 'p'] }], prefixes: [{ id: 1, values: [prefix] }],
        subjects: { nameIds: [1], prefixIds: [1], layouts: [1] },
        predicates: { nameIds: [2], prefixIds: [1], layouts: [1] },
        objects: { lexValues: ['v'], layouts: [1] }, messageLengths: [1, 2] } });
      const bytes = delimited([{ rows: [{ options }] }, batch('urn:a:', 's'), batch('urn:b:', 's'), batch('urn:b:', 't'), batch('urn:a:', 's')]);
      const actual = new Parser({ quadPatterns: [{ subject: f.namedNode('urn:a:s') }] }).parseMessages(bytes);
      expect(actual.map(m => m.length)).toEqual([1, 2, 0, 0, 0, 0, 1, 2]);
    });

    it('selects through frames that need the generated protobuf reader', () => {
      // A triple term in a column is outside the reusable reader, so this frame is read by the generated decoder, with eager literal text.
      const columns = { rowCount: 3, names: [{ id: 1, values: ['urn:s1', 'urn:s2', 'urn:p'] }], datatypes: [{ id: 1, values: ['urn:dt'] }],
        subjects: { nameIds: [1, 2, 1] }, predicates: { nameIds: [3], layouts: [1] },
        objects: { lexValues: ['jelly ✓', 'plain'], literalKinds: [1], kinds: Uint8Array.of(0b110101),
          tripleTerms: [{ sIri: { nameId: 1 }, pIri: { nameId: 3 }, oIri: { nameId: 1 } }] }, messageLengths: [3] };
      const bytes = delimited([{ rows: [{ options }], columns }]);
      const output = new Parser({ quadPatterns: [{ subject: f.namedNode('urn:s1') }] }).parse(bytes) as RDF.Quad[];
      expect(output.map(q => q.subject.value)).toEqual(['urn:s1', 'urn:s1']);
      expect(output[0]!.object.value).toBe('jelly ✓');
      expect(output[1]!.object.termType).toBe('Quad');
      expect(new Parser({ quadPatterns: [{ subject: f.namedNode('urn:s2') }] }).parse(bytes)).toHaveLength(1);
    });
  });

  it('supports legacy version 1 and graph streams without losing repeated slots', () => {
    const bytes = write(statements, { version: 2 });
    const frames = new MessageDecoder().decode(bytes);
    const option = frames[0]!.rows[0]!;
    if (option.case !== 'options') throw new Error('Missing options');
    option.value.version = 1;
    const legacy = new MessageEncoder().encodeAll(frames);
    expect(new Parser({ quadPatterns: [{ predicate: other }] }).parse(legacy)).toHaveLength(1);
    const writer = new Writer({ version: 2, physicalType: PhysicalStreamType.GRAPHS });
    for (const [graph, rows] of [[f.namedNode('urn:g1'), [statements[0]!, statements[1]!]], [f.namedNode('urn:g2'), [statements[0]!]]] as const) {
      writer.addGraph(graph, rows.map(q => f.quad(q.subject, q.predicate, q.object, graph)));
    }
    const output = new Parser({ quadPatterns: [{ graph: f.namedNode('urn:g2') }] }).parse(end(writer)) as RDF.Quad[];
    expect(output).toHaveLength(1);
    expect(output[0]!.graph.value).toBe('urn:g2');
  });

  it('runs the upstream RDF 1.2 fixtures through the wire-value path', () => {
    const fixtures = JSON.parse(readFileSync(new URL('fixtures/conformance/rdf12.json', import.meta.url), 'utf8')) as Array<{ name: string; input: string }>;
    for (const fixture of fixtures) {
      const bytes = Buffer.from(fixture.input, 'base64');
      if (fixture.name.includes('/neg_')) {
        expect(() => new Parser({ quadPatterns: [] }).parseMessages(bytes), fixture.name).toThrow();
      } else {
        const expected = new Parser().parseMessages(bytes);
        const patterns = expected.flatMap(m => m.map(q => ({ predicate: q.predicate })));
        const actual = new Parser({ quadPatterns: patterns }).parseMessages(bytes);
        expect(actual.map(m => m.length), fixture.name).toEqual(expected.map(m => m.length));
        for (const [index, message] of actual.entries()) {
          expect(message.messageCounter).toBe(expected[index]!.messageCounter);
          for (const [row, q] of message.entries()) expect(q.equals(expected[index]![row]!), fixture.name).toBe(true);
        }
      }
    }
  });

  it('filters Node and browser streams across one-byte chunk boundaries', async () => {
    const writer = new Writer({ streamType: RdfStreamType.MESSAGES, messageSize: 1 });
    writer.addMessage([statements[0]!]); writer.addMessage([]); writer.addMessage([statements[1]!]);
    const bytes = end(writer), config = { messages: true, quadPatterns: [{ predicate: other }] };
    const parser = new StreamParser(config), messages: number[] = [], output: MessageQuad[] = [];
    parser.on('message', m => messages.push(m.messageCounter));
    for await (const q of Readable.from(Array.from(bytes, byte => Uint8Array.of(byte))).pipe(parser)) output.push(q as MessageQuad);
    expect(messages).toEqual([0, 1, 2]);
    expect(output.map(q => q.messageCounter)).toEqual([2]);
    const browser = new BrowserStreamParser(config), seen: number[] = [];
    browser.on('message', m => seen.push(m.messageCounter));
    const source = new ReadableStream<Uint8Array>({ start(controller) {
      for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
      controller.close();
    } });
    const reader = source.pipeThrough(browser).getReader(), actual: MessageQuad[] = [];
    while (true) { const { value, done } = await reader.read(); if (done) break; actual.push(value as MessageQuad); }
    expect(seen).toEqual(messages);
    expect(actual.map(q => q.messageCounter)).toEqual([2]);
  });
});
