import { JellyConformanceError, LookupDecoder, LookupEncoder } from '../src';

describe('Jelly lookups', () => {
  it('implements sequential zero IDs and implicit next-name references', () => {
    const encoder = new LookupEncoder(8);
    expect(encoder.ensure('a')).toEqual({ id: 0, value: 'a' });
    expect(encoder.ensure('b')).toEqual({ id: 0, value: 'b' });
    expect(encoder.name('a')).toBe(0);
    expect(encoder.name('b')).toBe(0);

    const decoder = new LookupDecoder(8);
    decoder.assign(0, 'a');
    decoder.assign(0, 'b');
    expect(decoder.name(0)).toBe('a');
    expect(decoder.name(0)).toBe('b');
  });

  it('reuses least-recently-used indices', () => {
    const encoder = new LookupEncoder(2);
    encoder.ensure('a');
    encoder.ensure('b');
    encoder.name('a'); // b is now least recently used
    expect(encoder.ensure('c')).toEqual({ id: 2, value: 'c' });
  });

  it('rejects invalid and unassigned indices', () => {
    const decoder = new LookupDecoder(8);
    expect(() => decoder.name(9)).toThrow(JellyConformanceError);
    expect(() => decoder.name(1)).toThrow(/not been assigned/);
    expect(() => decoder.datatype(0)).toThrow(JellyConformanceError);
  });
});
