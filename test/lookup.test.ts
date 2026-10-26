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

describe('Jelly lookup change tracking', () => {
  it('tracks the assigned prefix of a table', () => {
    const decoder = new LookupDecoder(8);
    expect(decoder.contiguous).toBe(0);
    decoder.assign(2, 'b');
    expect(decoder.contiguous).toBe(0);
    decoder.assign(1, 'a');
    expect(decoder.contiguous).toBe(2);
    decoder.assign(3, 'c');
    expect(decoder.contiguous).toBe(3);
    decoder.assign(5, 'e');
    decoder.assign(4, 'd');
    decoder.assign(3, 'x');
    expect(decoder.contiguous).toBe(5);
    expect([1, 2, 3, 4, 5].every(index => decoder.stamp(index) > 0)).toBe(true);
    expect(decoder.stamp(6)).toBe(0);
    expect(decoder.stamp(0)).toBe(0);
    expect(decoder.stamp(99)).toBe(0);
  });

  it('reports only the overwriting of assigned entries', () => {
    const decoder = new LookupDecoder(8), replaced: number[] = [];
    decoder.onReplace = index => replaced.push(index);
    decoder.assign(1, 'a');
    decoder.assign(2, 'b');
    expect(replaced).toEqual([]);
    const stamp = decoder.stamp(1);
    decoder.assign(1, 'changed');
    decoder.assign(2, 'b');
    expect(replaced).toEqual([1, 2]);
    expect(decoder.stamp(1)).not.toBe(stamp);
    expect(decoder.name(1)).toBe('changed');
    expect(decoder.contiguous).toBe(2);
  });
});
