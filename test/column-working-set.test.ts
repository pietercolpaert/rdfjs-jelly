import type * as RDF from '@rdfjs/types';
import { DataFactory as f, MessageDecoder, MessageEncoder, Parser, SparqlParser, SparqlWriter, Writer } from '../src';

function finish(writer: Writer): Uint8Array {
  let bytes!: Uint8Array;
  writer.end((error, output) => { if (error) throw error; bytes = output!; });
  return bytes;
}
function deepTerm(): RDF.Quad {
  let object: RDF.Quad_Object = f.namedNode('urn:leaf');
  for (let i = 0; i < 64; i++) object = f.quad(f.namedNode(`urn:s${i}`), f.namedNode(`urn:p${i}`), object);
  return object as RDF.Quad;
}

describe('column writer lookup working sets', () => {
  it('counts a repeated new key once when only one name slot remains', () => {
    const writer = new Writer({ version: 3, lookup: { maxNames: 128 }, messageSize: 1000 });
    const quads = Array.from({ length: 125 }, (_, i) => f.quad(f.namedNode('urn:s'), f.namedNode('urn:p'), f.namedNode(`urn:o${i}`)));
    const last = f.namedNode('urn:last'); quads.push(f.quad(last, last, last));
    writer.addQuads(quads);
    const bytes = finish(writer);
    expect(new MessageDecoder().decode(bytes)).toHaveLength(1);
    const parsed = new Parser().parse(bytes) as RDF.Quad[];
    expect(parsed.every((q, i) => q.equals(quads[i]!))).toBe(true);
  });
  it('flushes before a new row would invalidate any earlier lookup references', () => {
    const quads = Array.from({ length: 500 }, (_, i) => f.quad(f.namedNode(`urn:s${i}`), f.namedNode('urn:p'), f.namedNode(`urn:o${i}`)));
    const writer = new Writer({ version: 3, lookup: { maxNames: 128 }, messageSize: 4000 });
    writer.addQuads(quads); const bytes = finish(writer);
    expect(new MessageDecoder().decode(bytes).length).toBeGreaterThan(1);
    const parsed = new Parser().parse(bytes) as RDF.Quad[];
    expect(parsed.every((q, i) => q.equals(quads[i]!))).toBe(true);
  });
  it('handles SPARQL duplicate names and datatypes at exact capacity', () => {
    const writer = new SparqlWriter({ lookup: { maxNames: 128, maxDatatypes: 1 }, frameSize: 4000 });
    writer.startSelect(['x', 'y']);
    for (let i = 0; i < 127; i++) writer.addBinding({ x: f.namedNode(`urn:${i}`) });
    writer.addBinding({ x: f.namedNode('urn:last'), y: f.namedNode('urn:last') });
    const dt = f.namedNode('urn:type');
    writer.addBinding({ x: f.literal('1', dt), y: f.literal('2', dt) });
    writer.addBinding({ x: f.literal('3', dt), y: f.literal('4', dt) });
    // This row must flush, while all earlier bindings keep their values.
    writer.addBinding({ x: f.namedNode('urn:overflow') });
    const result = new SparqlParser().parse(writer.end())[0]!;
    if (result.type !== 'select') throw new Error('Expected SELECT');
    expect(result.bindings).toHaveLength(131);
    expect(result.bindings[127]!.get('x')!.equals(result.bindings[127]!.get('y')!)).toBe(true);
    expect(result.bindings[128]!.get('x')!.equals(f.literal('1', dt))).toBe(true);
    expect(result.bindings[130]!.get('x')!.value).toBe('urn:overflow');
  });
  it('accounts for names inside triple terms and rejects a statement that cannot fit', () => {
    const writer = new Writer({ version: 3, lookup: { maxNames: 128 } });
    const valid = f.quad(f.namedNode('urn:s'), f.namedNode('urn:p'), f.literal('valid'));
    writer.addQuad(valid);
    expect(() => writer.addQuad(f.quad(valid.subject, valid.predicate, deepTerm()))).toThrow(/single statement/);
    const parsed = new Parser().parse(finish(writer)) as RDF.Quad[];
    expect(parsed).toHaveLength(1); expect(parsed[0]!.equals(valid)).toBe(true);
  });
  it('rejects an oversized SPARQL solution without corrupting previously accepted rows', () => {
    const writer = new SparqlWriter({ lookup: { maxNames: 128 } }); writer.startSelect(['x']);
    writer.addBinding({ x: f.literal('valid') });
    expect(() => writer.addBinding({ x: deepTerm() })).toThrow(/single solution/);
    const result = new SparqlParser().parse(writer.end())[0]!;
    if (result.type !== 'select') throw new Error('Expected SELECT');
    expect(result.complete).toBe(true); expect(result.bindings).toHaveLength(1);
    expect(result.bindings[0]!.get('x')!.value).toBe('valid');
  });
});

describe('column decoder allocation paths', () => {
  it('keeps scope boundaries when direct quad output encounters restated options', () => {
    const writer = new Writer({ version: 3, physicalType: 1, streamType: 1 });
    writer.addMessage([f.quad(f.blankNode('same'), f.namedNode('urn:p'), f.literal('v'))]);
    const frame = new MessageDecoder().decode(finish(writer))[0]!;
    frame.columns!.messageLengths = []; // Open message ends at the next options row.
    const bytes = new MessageEncoder().encodeAll([frame, frame]);
    const quads = new Parser().parse(bytes) as RDF.Quad[];
    const messages = new Parser().parseMessages(bytes);
    expect(messages.map(m => m.length)).toEqual([1, 1]);
    expect(quads).toHaveLength(2);
    expect(quads[0]!.subject.equals(quads[1]!.subject)).toBe(false);
    expect(quads.every((q, i) => q.equals(messages[i]![0]!))).toBe(true);
  });
  it('keeps scoped labels distinct even when raw labels look like generated labels', () => {
    const writer = new Writer({ version: 3, streamType: 1, messageSize: 1 });
    const labels = ['x', 'b0_x', 'b1_x', 'jelly1_x', 'sparql1_x'];
    for (let i = 0; i < 3; i++) writer.addMessage(labels.map(label => {
      const b = f.blankNode(label);
      return f.quad(b, f.namedNode('urn:p'), f.quad(b, f.namedNode('urn:inner'), b));
    }));
    const quads = new Parser().parse(finish(writer)) as RDF.Quad[];
    expect(new Set(quads.map(q => q.subject.value)).size).toBe(15);
    for (const q of quads) {
      const triple = q.object as RDF.Quad;
      expect(q.subject.equals(triple.subject)).toBe(true);
      expect(q.subject.equals(triple.object)).toBe(true);
    }
  });
  it('uses the same bounded scoping strategy for punctuated SPARQL results', () => {
    const writer = new SparqlWriter({ streamType: 1, frameSize: 1 });
    for (let i = 0; i < 3; i++) {
      writer.startSelect(['b']);
      for (const label of ['x', 'b0_x', 'b1_x']) writer.addBinding({ b: f.blankNode(label) });
      writer.endResult();
    }
    const terms = new SparqlParser().parse(writer.end()).flatMap(result => result.type === 'select' ? result.bindings.map(b => b.get('b')!) : []);
    expect(new Set(terms.map(t => t.value)).size).toBe(9);
  });
});
