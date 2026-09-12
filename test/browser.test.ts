import type * as RDF from '@rdfjs/types';
import type { MessageQuad } from '../src';
import { DataFactory, Parser, Writer } from '../src';
import { StreamParser, StreamWriter } from '../src/browser';

const statement = DataFactory.quad(DataFactory.namedNode('urn:s'), DataFactory.namedNode('urn:p'), DataFactory.literal('browser'));

async function collect<T>(stream: ReadableStream<T>): Promise<T[]> {
  const output: T[] = [];
  const reader = stream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) return output;
    output.push(value);
  }
}

describe('browser Web Streams', () => {
  it('writes and incrementally parses browser chunks', async () => {
    const source = new ReadableStream<RDF.Quad>({
      start(controller) {
        controller.enqueue(statement);
        controller.enqueue(statement);
        controller.close();
      },
    });
    const encoded = await collect(source.pipeThrough(new StreamWriter({ messageSize: 1 })));
    expect(encoded).toHaveLength(2);
    const allBytes = new Uint8Array(encoded.reduce((total, chunk) => total + chunk.byteLength, 0));
    let offset = 0;
    for (const chunk of encoded) {
      allBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    expect(new Parser().parse(allBytes)).toHaveLength(2);

    const bytes = allBytes;
    const binary = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let i = 0; i < bytes.length; i++) controller.enqueue(bytes.subarray(i, i + 1));
        controller.close();
      },
    });
    const parsed = await collect(binary.pipeThrough(new StreamParser())) as RDF.Quad[];
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.equals(statement)).toBe(true);
  });

  // Consumer demand must drain buffered frames regardless of chunk boundaries.
  it.each([
    ['many chunks', 4096],
    ['a single chunk', Number.MAX_SAFE_INTEGER],
  ])('delivers every quad through a slow reader from %s', async (_label, chunkSize) => {
    const statements = Array.from({ length: 3000 }, (_, index) => DataFactory.quad(
      DataFactory.namedNode(`https://example.org/s/${index}`),
      DataFactory.namedNode('https://example.org/p'),
      DataFactory.literal(String(index)),
    ));
    const writer = new Writer({ messageSize: 10 });
    writer.addQuads(statements);
    const bytes = await new Promise<Uint8Array>((resolve, reject) =>
      writer.end((error, output) => error ? reject(error) : resolve(output!)));

    const binary = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let offset = 0; offset < bytes.byteLength; offset += chunkSize) {
          controller.enqueue(bytes.subarray(offset, Math.min(offset + chunkSize, bytes.byteLength)));
        }
        controller.close();
      },
    });
    const reader = binary.pipeThrough(new StreamParser({ delimited: true })).getReader();
    const output: RDF.Quad[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      output.push(value as RDF.Quad);
      if (output.length % 500 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    expect(output).toHaveLength(statements.length);
    expect(output[0]!.equals(statements[0]!)).toBe(true);
    expect(output.at(-1)!.equals(statements.at(-1)!)).toBe(true);
  });

  async function fixture(delimited = true): Promise<Uint8Array> {
    const writer = new Writer({ messageSize: delimited ? 20 : 10000, delimited });
    writer.addQuads(Array.from({ length: 1000 }, (_, i) => DataFactory.quad(
      DataFactory.blankNode('shared'), statement.predicate, DataFactory.literal(String(i)),
    )));
    return new Promise((resolve, reject) => writer.end((error, bytes) =>
      error ? reject(error) : resolve(bytes!)));
  }

  const turn = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

  it('drains a single chunk while input stays open, preserving terms and message counters', async () => {
    const bytes = await fixture();
    const expected = new Parser().parseMessages(bytes).flatMap(message =>
      message.map(quad => ({ quad, messageCounter: message.messageCounter })));
    const parser = new StreamParser({ delimited: true, messages: true });
    const writer = parser.writable.getWriter();
    const reader = parser.readable.getReader();
    const writing = writer.write(bytes);
    for (const entry of expected) {
      const result = await reader.read();
      expect(result.done).toBe(false);
      const actual = result.value as MessageQuad;
      expect(actual.quad.equals(entry.quad)).toBe(true);
      expect(actual.messageCounter).toBe(entry.messageCounter);
    }
    await writing;
    await writer.close();
    expect((await reader.read()).done).toBe(true);
  });

  it.each([true, false])('bounds output for a slow reader including closure (delimited: %s)', async delimited => {
    const parser = new StreamParser({ delimited, messages: true });
    let enqueued = 0;
    parser.on('messageCounter', () => { enqueued++; });
    const writer = parser.writable.getWriter();
    const reader = parser.readable.getReader();
    const writing = writer.write(await fixture(delimited));
    const closing = writer.close();
    let closed = false;
    void closing.then(() => { closed = true; });
    await turn();
    expect(enqueued).toBe(256);
    expect(closed).toBe(false);
    for (let i = 0; i < 1000; i++) {
      const result = await reader.read();
      expect(result.done).toBe(false);
      expect((result.value as MessageQuad).quad.object.value).toBe(String(i));
      if (i % 100 === 0) {
        await turn();
        expect(enqueued - (i + 1)).toBeLessThanOrEqual(256);
      }
    }
    await writing;
    await closing;
    expect((await reader.read()).done).toBe(true);
  });

  it('cancels upstream and rejects an in-flight pipe without requiring more reads', async () => {
    const bytes = await fixture();
    let cancelled: unknown;
    const source = new ReadableStream<Uint8Array>({
      start: controller => { controller.enqueue(bytes); },
      cancel: reason => { cancelled = reason; },
    });
    const parser = new StreamParser({ delimited: true });
    const reason = new Error('consumer stopped');
    const piping = source.pipeTo(parser.writable);
    const rejected = expect(piping).rejects.toBe(reason);
    await turn();
    await parser.readable.cancel(reason);
    await rejected;
    expect(cancelled).toBe(reason);
  });

  it('aborts a blocked write and errors the readable side', async () => {
    const parser = new StreamParser({ delimited: true });
    const writer = parser.writable.getWriter();
    const writing = writer.write(await fixture());
    const reason = new Error('producer stopped');
    const rejected = expect(writing).rejects.toBe(reason);
    await turn();
    await writer.abort(reason);
    await rejected;
    await expect(parser.readable.getReader().read()).rejects.toBe(reason);
  });

  it('cancels a blocked non-delimited close', async () => {
    const parser = new StreamParser({ delimited: false });
    const writer = parser.writable.getWriter();
    await writer.write(await fixture(false));
    const reason = new Error('closed consumer');
    const closing = writer.close();
    const rejected = expect(closing).rejects.toBe(reason);
    await turn();
    await parser.readable.cancel(reason);
    await rejected;
  });

  it('propagates truncated input errors to both sides', async () => {
    const parser = new StreamParser({ delimited: true });
    const writer = parser.writable.getWriter();
    const collecting = collect(parser.readable);
    const readError = expect(collecting).rejects.toThrow('Truncated');
    await writer.write(new Uint8Array([10, 10]));
    await expect(writer.close()).rejects.toThrow('Truncated');
    await readError;
  });
});
