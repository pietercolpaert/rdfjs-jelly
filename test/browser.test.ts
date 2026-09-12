import type * as RDF from '@rdfjs/types';
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

  // The parser stops decoding once the readable queue fills and resumes on the
  // next chunk or the final flush, so both shapes have to reach the consumer.
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
});
