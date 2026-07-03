import { Parser } from '../src/api/Parser';
import { compressZstd, convertMessageLogToJelly, decompressZstd } from '../src/playground';
import { zstdCompressSync, zstdDecompressSync } from 'node:zlib';

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
});
