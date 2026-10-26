import { Readable } from 'node:stream';
import type * as RDF from '@rdfjs/types';
import { DataFactory, JellyConformanceError, MessageDecoder, Parser, StreamParser, Writer } from '../src';
import type { WriterOptions } from '../src';

const { blankNode, defaultGraph, literal, namedNode, quad } = DataFactory;

function write(quads: RDF.Quad[], options: WriterOptions = {}): Uint8Array {
  const writer = new Writer({ version: 2, ...options });
  writer.addQuads(quads);
  let output: Uint8Array | undefined;
  writer.end((error, bytes) => {
    if (error) throw error;
    output = bytes;
  });
  return output!;
}

function chunks(bytes: Uint8Array, size: number): Buffer[] {
  const output: Buffer[] = [];
  for (let offset = 0; offset < bytes.byteLength; offset += size) {
    output.push(Buffer.from(bytes.buffer, bytes.byteOffset + offset, Math.min(size, bytes.byteLength - offset)));
  }
  return output;
}

describe('frame accumulation', () => {
  const statements = Array.from({ length: 40 }, (_, index) => quad(
    namedNode(`https://example.org/s/${index}`),
    namedNode('https://example.org/p'),
    literal(`value ${index}`),
  ));

  it('reassembles frames across every chunk size without losing or duplicating rows', () => {
    const bytes = write(statements, { messageSize: 3 });
    for (const size of [1, 2, 3, 7, 64, 512, bytes.byteLength]) {
      let rows = 0;
      const decoder = new MessageDecoder({ delimited: true });
      const count = (frame: { rows: { case: string }[] }): void => {
        rows += frame.rows.filter(row => row.case === 'triple' || row.case === 'quad').length;
      };
      for (const chunk of chunks(bytes, size)) decoder.writeEach(chunk, count);
      decoder.endEach(count);
      expect(rows, `chunk size ${size}`).toBe(statements.length);
    }
  });

  // The accumulation buffer is reused across frames, so metadata must own its bytes.
  it('keeps message metadata valid after the frame buffer is reused', async () => {
    const writer = new Writer({ version: 2, messageSize: 1 });
    for (let index = 0; index < 8; index++) {
      writer.addMessage([statements[index]!], { tag: new TextEncoder().encode(`payload-${index}`) });
    }
    const bytes = await new Promise<Uint8Array>((resolve, reject) =>
      writer.end((error, output) => error ? reject(error) : resolve(output!)));

    const seen: string[] = [];
    const decoder = new MessageDecoder({ delimited: true });
    const collect = (frame: { metadata: Map<string, Uint8Array> }): void => {
      const tag = frame.metadata.get('tag');
      if (tag) seen.push(new TextDecoder().decode(tag));
    };
    for (const chunk of chunks(bytes, 5)) decoder.writeEach(chunk, collect);
    decoder.endEach(collect);
    expect(seen).toEqual(Array.from({ length: 8 }, (_, index) => `payload-${index}`));
  });

  it('enforces the message size limit while non-delimited input accumulates', () => {
    const bytes = write(statements, { delimited: false, messageSize: 1000 });
    const decoder = new MessageDecoder({ delimited: false, maxMessageSize: 64 });
    expect(() => {
      for (const chunk of chunks(bytes, 32)) decoder.writeEach(chunk, () => undefined);
    }).toThrow(JellyConformanceError);
  });
});

describe('quad rows on the direct wire path', () => {
  it('round-trips every graph term shape', () => {
    const statements = [
      quad(namedNode('https://example.org/s'), namedNode('https://example.org/p'), literal('a'), defaultGraph()),
      quad(namedNode('https://example.org/s'), namedNode('https://example.org/p'), literal('b'), namedNode('https://example.org/g')),
      quad(blankNode('s1'), namedNode('https://example.org/p'), blankNode('o1'), blankNode('g1')),
      quad(namedNode('urn:s'), namedNode('urn:p'), literal('nl', 'nl-be'), namedNode('urn:g')),
      quad(namedNode('urn:s'), namedNode('urn:p'), literal('7', namedNode('http://www.w3.org/2001/XMLSchema#integer')), defaultGraph()),
    ];
    const output = new Parser({ delimited: true }).parse(write(statements)) as RDF.Quad[];
    expect(output).toHaveLength(statements.length);
    for (const [index, expected] of statements.entries()) expect(output[index]!.equals(expected)).toBe(true);
  });

  it('repeats an omitted graph term from the previous quad', () => {
    const graph = namedNode('https://example.org/g');
    const statements = [
      quad(namedNode('urn:s1'), namedNode('urn:p'), literal('a'), graph),
      quad(namedNode('urn:s2'), namedNode('urn:p'), literal('b'), graph),
    ];
    const output = new Parser({ delimited: true }).parse(write(statements)) as RDF.Quad[];
    expect(output.map(statement => statement.graph.value)).toEqual([graph.value, graph.value]);
  });
});

describe('StreamParser backpressure', () => {
  const statements = Array.from({ length: 5000 }, (_, index) => quad(
    namedNode(`https://example.org/s/${index}`),
    namedNode('https://example.org/p'),
    literal(String(index)),
  ));

  it('stops decoding instead of queueing a whole chunk', async () => {
    const bytes = write(statements, { messageSize: 10 });
    const parser = new StreamParser({ delimited: true, highWaterMark: 16 });
    parser.write(Buffer.from(bytes));
    await new Promise(resolve => setImmediate(resolve));
    // Overshoot is now bounded by one Jelly message rather than the whole chunk.
    expect(parser.readableLength).toBeLessThan(statements.length / 10);
    parser.destroy();
  });

  it('still delivers every quad in order through a slow consumer', async () => {
    const bytes = write(statements, { messageSize: 10 });
    const parser = new StreamParser({ delimited: true, highWaterMark: 16 });
    const output: RDF.Quad[] = [];
    for await (const item of Readable.from(chunks(bytes, 997)).pipe(parser)) output.push(item as RDF.Quad);
    expect(output).toHaveLength(statements.length);
    expect(output[0]!.equals(statements[0]!)).toBe(true);
    expect(output.at(-1)!.equals(statements.at(-1)!)).toBe(true);
  });
});
