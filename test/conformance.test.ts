import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JellyConformanceError, Parser } from '../src';

function fixture(name: string): Uint8Array {
  const path = fileURLToPath(new URL(`fixtures/conformance/${name}.jelly.base64`, import.meta.url));
  return Buffer.from(readFileSync(path, 'utf8').trim(), 'base64');
}

describe('official Jelly-RDF conformance fixtures', () => {
  it.each([
    ['triples-pos-001', 7],
    ['quads-pos-001', 7],
    ['graphs-pos-001', 3],
  ])('decodes %s', (name, count) => {
    const messages = new Parser().parseMessages(fixture(name));
    expect(messages.reduce((sum, message) => sum + message.length, 0)).toBe(count);
  });

  it('rejects a lookup table larger than the protocol limit', () => {
    expect(() => new Parser().parse(fixture('triples-neg-001'))).toThrow(JellyConformanceError);
  });
});
