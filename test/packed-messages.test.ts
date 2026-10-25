import { Readable } from 'node:stream';
import type * as RDF from '@rdfjs/types';
import { DataFactory as f, Message, MessageDecoder, Parser, PhysicalStreamType, RdfStreamType, StreamParser, Writer } from '../src';
import { Parser as BrowserParser } from '../src/browser';
import { ColumnLookupEncoder } from '../src/codec/ColumnLookupEncoder';

const quad = (value: string) => f.quad(f.blankNode('same'), f.namedNode('urn:p'), f.literal(value));
function encode(messages: Array<RDF.Quad[] | Message>, size = 4, packMessages = true): Uint8Array {
  const w = new Writer({ version: 3, physicalType: PhysicalStreamType.TRIPLES, streamType: RdfStreamType.MESSAGES,
    packMessages, messageSize: size });
  for (const message of messages) w.addMessage(message);
  let bytes!: Uint8Array;
  w.end((error, b) => { if (error) throw error; bytes = b!; });
  return bytes;
}

describe('Jelly 1.2 message packing', () => {
  it('packs messages, empty boundaries and repeated blank labels without merging scopes', () => {
    const input = [[quad('a')], [], [quad('b')], [quad('c')], []];
    const bytes = encode(input);
    const frames = new MessageDecoder().end(bytes);
    expect(frames.length).toBeLessThan(input.length);
    const output = new Parser().parseMessages(bytes);
    expect(output.map(m => m.length)).toEqual([1, 0, 1, 1, 0]);
    expect(output.flat().map(q => q.object.value)).toEqual(['a', 'b', 'c']);
    expect(new Set(output.flat().map(q => q.subject.value)).size).toBe(3);
    expect(new BrowserParser().parseMessages(bytes).map(m => m.length)).toEqual([1, 0, 1, 1, 0]);
  });

  it('preserves messages spanning batches and boundaries immediately after a full batch', () => {
    const messages = [[quad('a')], Array.from({ length: 11 }, (_, i) => quad(`b${i}`)), [], [quad('c')]];
    const bytes = encode(messages, 3);
    const output = new Parser().parseMessages(bytes);
    expect(output.map(m => m.length)).toEqual(messages.map(m => m.length));
    expect(output.flat().map(q => q.object.value)).toEqual(messages.flat().map(q => q.object.value));
    expect(output[1]!.every(q => q.subject.equals(output[1]![0]!.subject))).toBe(true);
    expect(output[1]![0]!.subject.equals(output[0]![0]!.subject)).toBe(false);
  });

  it('isolates metadata-bearing messages, including empty messages', () => {
    const messages = [new Message(0, [quad('a')]),
      new Message(1, [quad('b'), quad('c'), quad('d'), quad('e'), quad('f')], { test: Uint8Array.of(1, 2) }),
      new Message(2), new Message(3, [], { empty: Uint8Array.of(3) }), new Message(4, [quad('g')])];
    const output = new Parser().parseMessages(encode(messages, 3));
    expect(output.map(m => m.length)).toEqual([1, 5, 0, 0, 1]);
    expect(output.map(m => [...m.metadata.keys()])).toEqual([[], ['test'], [], ['empty'], []]);
    expect([...output[1]!.metadata.get('test')!]).toEqual([1, 2]);
    expect([...output[3]!.metadata.get('empty')!]).toEqual([3]);
  });

  it('bounds batches consisting only of empty messages', () => {
    const bytes = encode(Array.from({ length: 100 }, () => []), 4);
    expect(new MessageDecoder().end(bytes)).toHaveLength(25);
    expect(new Parser().parseMessages(bytes)).toHaveLength(100);
  });

  it('emits one frame per message when packing is disabled', () => {
    const input = [[quad('a')], [quad('b')], []];
    const bytes = encode(input, 100, false);
    expect(new MessageDecoder().end(bytes)).toHaveLength(3);
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([1, 1, 0]);
  });

  it('reuses dictionary entries and safely evicts them across capacity-forced batches', () => {
    const messages = Array.from({ length: 600 }, (_, i) => [
      f.quad(f.namedNode(`urn:s${i}`), f.namedNode('urn:p'), f.namedNode(`urn:o${i % 180}`)),
      f.quad(f.namedNode(`urn:s${i}`), f.namedNode('urn:type'), f.literal(String(i), f.namedNode(`urn:dt${i % 3}`))),
    ]);
    const writer = new Writer({ version: 3, physicalType: PhysicalStreamType.TRIPLES, streamType: RdfStreamType.MESSAGES,
      packMessages: true, messageSize: 1024, lookup: { maxNames: 128, maxDatatypes: 2 } });
    for (const message of messages) writer.addMessage(message);
    let bytes!: Uint8Array; writer.end((error, data) => { if (error) throw error; bytes = data!; });
    const output = new Parser().parseMessages(bytes);
    expect(output.map(m => m.length)).toEqual(messages.map(m => m.length));
    expect(output.every((m, i) => m.every((q, j) => q.equals(messages[i]![j]!)))).toBe(true);
    expect(new MessageDecoder().end(bytes).length).toBeGreaterThan(2);
  });

  it('never evicts a pinned slot and emits only new dictionary entries', () => {
    const lookup = new ColumnLookupEncoder(2);
    expect(lookup.ensure('a')).toBe(1); expect(lookup.ensure('b')).toBe(2);
    expect(() => lookup.ensure('c')).toThrow(/capacity/);
    lookup.endBatch();
    expect(lookup.ensure('b')).toBe(2);
    expect(lookup.entries).toEqual([]);
    expect(lookup.ensure('c')).toBe(1);
    expect(lookup.entries).toEqual([{ id: 1, values: ['c'] }]);
    lookup.endBatch();
    expect(lookup.ensure('c')).toBe(1);
    expect(lookup.ensure('a')).toBe(2);
    expect(() => lookup.ensure('b')).toThrow(/capacity/);
  });

  it('streams tiny chunks through backpressure with all message boundaries intact', async () => {
    const bytes = encode(Array.from({ length: 30 }, (_, i) => i % 5 ? [quad(String(i))] : []), 8);
    const expected = new Parser().parseMessages(bytes);
    const parser = new StreamParser({ messages: true, readableHighWaterMark: 1 });
    const lengths: number[] = [];
    parser.on('message', (m: Message) => lengths.push(m.length));
    Readable.from(Array.from(bytes, b => Uint8Array.of(b))).pipe(parser);
    const counters: number[] = [];
    for await (const item of parser) counters.push(item.messageCounter);
    expect(lengths).toEqual(expected.map(m => m.length));
    expect(counters).toEqual(expected.flatMap(m => m.map(() => m.messageCounter)));
  });
});

describe('Jelly 1.2 persistent lookups with one frame per message', () => {
  const messages = Array.from({ length: 600 }, (_, i) => [
    f.quad(f.namedNode(`urn:s${i}`), f.namedNode('urn:p'), f.namedNode(`urn:o${i % 180}`)),
    f.quad(f.namedNode(`urn:s${i}`), f.namedNode('urn:type'), f.literal(String(i), f.namedNode(`urn:dt${i % 3}`))),
  ]);
  const write = (persistentLookups?: boolean): Uint8Array => {
    const writer = new Writer({ version: 3, physicalType: PhysicalStreamType.TRIPLES, streamType: RdfStreamType.MESSAGES,
      packMessages: false, messageSize: 1024, lookup: { maxNames: 128, maxDatatypes: 2 }, persistentLookups });
    for (const message of messages) writer.addMessage(message);
    let bytes!: Uint8Array; writer.end((error, data) => { if (error) throw error; bytes = data!; });
    return bytes;
  };

  it('keeps lookups persistent by default with per-message framing, even during eviction', () => {
    const bytes = write();
    expect(new MessageDecoder().end(bytes)).toHaveLength(messages.length);
    const output = new Parser().parseMessages(bytes);
    expect(output.map(m => m.length)).toEqual(messages.map(m => m.length));
    expect(output.every((m, i) => m.every((q, j) => q.equals(messages[i]![j]!)))).toBe(true);
  });

  it('sends each reused name once per stream; false restores self-contained batches', () => {
    const persistent = write(), local = write(false);
    expect(persistent.length).toBeLessThan(local.length);
    const output = new Parser().parseMessages(local);
    expect(output.every((m, i) => m.every((q, j) => q.equals(messages[i]![j]!)))).toBe(true);
  });
});
