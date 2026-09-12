import { DataFactory, JellyConformanceError, Parser, Writer, normalizeLookupPreset } from '../src';
import type { WriterOptions } from '../src';

const { literal, namedNode, quad } = DataFactory;

function write(statements: Parameters<Writer['addQuads']>[0], options: WriterOptions = {}): Uint8Array {
  const writer = new Writer(options);
  writer.addQuads(statements);
  let output: Uint8Array | undefined;
  writer.end((error, bytes) => {
    if (error) throw error;
    output = bytes;
  });
  return output!;
}

describe('prefix lookup capacity', () => {
  // Lookup rows are emitted before the statement that uses them, so a table
  // smaller than the prefixes in one statement would evict an entry the
  // statement already points at and silently change the RDF.
  it('rejects capacities too small to encode one statement', () => {
    for (const maxPrefixes of [1, 2, 3]) {
      expect(() => normalizeLookupPreset({ maxPrefixes })).toThrow(JellyConformanceError);
      expect(() => new Writer({ lookup: { maxPrefixes } })).toThrow(/at least 4/);
    }
  });

  it('accepts a disabled table and the smallest safe table', () => {
    const statement = quad(
      namedNode('https://a.example/s'),
      namedNode('https://b.example/p'),
      namedNode('https://c.example/o'),
      namedNode('https://d.example/g'),
    );
    for (const maxPrefixes of [0, 4, 150]) {
      const output = new Parser().parse(write([statement], { lookup: { maxPrefixes } })) as ReturnType<typeof quad>[];
      expect(output[0]!.equals(statement), `maxPrefixes ${maxPrefixes}`).toBe(true);
    }
  });
});

describe('declared lookup table sizes', () => {
  /** Rewrite max_name_table_size in a stream's options row; 4000 and 8192 are both two-byte varints. */
  function retagNameTable(bytes: Uint8Array): Uint8Array {
    const patched = Buffer.from(bytes);
    const at = patched.indexOf(Buffer.from([0x48, 0xa0, 0x1f]));
    expect(at).toBeGreaterThanOrEqual(0);
    patched[at + 1] = 0x80;
    patched[at + 2] = 0x40;
    return patched;
  }

  const statement = quad(namedNode('http://example.org/s'), namedNode('http://example.org/p'), literal('v'));

  // The specification sets a minimum of 8 and no maximum, so a producer using a
  // larger table than this library writes must still be readable.
  it('reads a stream declaring a name table larger than this writer builds', () => {
    const bytes = retagNameTable(write([statement], { lookup: { maxNames: 4000 } }));
    const output = new Parser().parse(bytes) as ReturnType<typeof quad>[];
    expect(output).toHaveLength(1);
    expect(output[0]!.equals(statement)).toBe(true);
  });

  it('still rejects a table above the configured guard', () => {
    const bytes = retagNameTable(write([statement], { lookup: { maxNames: 4000 } }));
    expect(() => new Parser({ maxLookupTableSize: 4096 }).parse(bytes)).toThrow(JellyConformanceError);
  });
});
