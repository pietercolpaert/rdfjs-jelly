import { Parser } from '../src/api/Parser';
import {
  compressZstd,
  convertMessageLogStreamToJelly,
  convertMessageLogToJelly,
  createZstdCompressionStream,
  decompressZstd,
} from '../src/playground';
import { zstdCompressSync, zstdDecompressSync } from 'node:zlib';

async function collect<T>(stream: ReadableStream<T>): Promise<T[]> {
  const output: T[] = [];
  const reader = stream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) return output;
    output.push(value);
  }
}

describe('playground support', () => {
  it('round-trips zstd data', async () => {
    const input = new TextEncoder().encode('Jelly zstd round trip '.repeat(100));
    const compressed = await compressZstd(input);

    expect([...compressed.subarray(0, 4)]).toEqual([0x28, 0xb5, 0x2f, 0xfd]);
    await expect(decompressZstd(compressed)).resolves.toEqual(input);
    expect(new Uint8Array(zstdDecompressSync(compressed))).toEqual(input);
    await expect(decompressZstd(zstdCompressSync(input))).resolves.toEqual(input);
  });

  it('preserves RDF Message Stream Log boundaries when converting to Jelly', () => {
    const input = [
      'VERSION "1.2-messages"',
      '<https://example/s1> <https://example/p> <https://example/o1> .',
      'MESSAGE',
      'MESSAGE',
      '<https://example/s2> <https://example/p> "two" .',
    ].join('\n');

    const result = convertMessageLogToJelly(input);
    const messages = new Parser().parseMessages(result.jelly);

    expect(result.messageCount).toBe(3);
    expect(result.quadCount).toBe(2);
    expect(messages.map(message => message.length)).toEqual([1, 0, 1]);
  });

  it('converts fragmented message logs incrementally including trailing empty messages', async () => {
    const text = [
      'VERSION "1.2-messages"',
      '<https://example/s1> <https://example/p> <https://example/o1> .',
      'MESSAGE',
      'MESSAGE',
      '<https://example/s2> <https://example/p> "two" .',
      'MESSAGE',
      'MESSAGE',
    ].join('\n');
    const bytes = new TextEncoder().encode(text);
    const source = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let index = 0; index < bytes.byteLength; index += 7) controller.enqueue(bytes.subarray(index, index + 7));
        controller.close();
      },
    });
    const conversion = convertMessageLogStreamToJelly(source);
    const chunks = await collect(conversion.readable);
    const result = await conversion.result;
    const jelly = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.byteLength, 0));
    let offset = 0;
    for (const chunk of chunks) {
      jelly.set(chunk, offset);
      offset += chunk.byteLength;
    }

    expect(chunks.length).toBe(4);
    expect(result).toMatchObject({ messageCount: 4, quadCount: 2, jellyByteCount: jelly.byteLength });
    expect(new Parser().parseMessages(jelly).map(message => message.length)).toEqual([1, 0, 1, 0]);
  });

  it('compresses a sequence of chunks as one streaming zstd frame', async () => {
    const input = new TextEncoder().encode('streaming zstd '.repeat(20_000));
    const source = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let index = 0; index < input.byteLength; index += 997) controller.enqueue(input.subarray(index, index + 997));
        controller.close();
      },
    });
    const chunks = await collect(source.pipeThrough(await createZstdCompressionStream(3, 4096)));
    const compressed = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));

    expect(chunks.length).toBeGreaterThan(1);
    expect(zstdDecompressSync(compressed)).toEqual(Buffer.from(input));
  });
});
