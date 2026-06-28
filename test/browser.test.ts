import type * as RDF from '@rdfjs/types';
import { DataFactory, Parser } from '../src';
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
    const encoded = await collect(source.pipeThrough(new StreamWriter()));
    expect(encoded).toHaveLength(1);
    expect(new Parser().parse(encoded[0]!)).toHaveLength(2);

    const bytes = encoded[0]!;
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
});
