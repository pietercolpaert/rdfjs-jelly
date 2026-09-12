import { JellyConformanceError } from './errors';

export const MIN_NAME_LOOKUP_SIZE = 8;

/**
 * Smallest prefix table this encoder can use without corrupting output.
 *
 * Every lookup entry a statement needs is emitted before the statement row, so a
 * table smaller than the number of distinct prefixes in one statement evicts an
 * entry an earlier term already points at. A standard RDF quad carries at most
 * four IRIs, so four is the smallest safe capacity. Zero disables the prefix
 * lookup entirely and is also safe.
 */
export const MIN_PREFIX_LOOKUP_SIZE = 4;

/** Largest lookup table this writer will build. */
export const MAX_LOOKUP_SIZE = 4096;

/**
 * Largest lookup table this parser accepts from a stream.
 *
 * The specification sets no maximum, so this is only a denial-of-service guard
 * and is deliberately far above what any producer is likely to declare. Decoder
 * tables grow on demand, so a large declared size costs nothing until used.
 * Override per parser with `maxLookupTableSize`.
 */
export const MAX_DECODED_LOOKUP_SIZE = 1_048_576;

export const XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';
export const RDF_LANG_STRING = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString';

export interface LookupPreset {
  maxNames: number;
  maxPrefixes: number;
  maxDatatypes: number;
}

export const DEFAULT_LOOKUP_PRESET: Readonly<LookupPreset> = Object.freeze({
  maxNames: 4000,
  maxPrefixes: 150,
  maxDatatypes: 32,
});

export const SMALL_LOOKUP_PRESET: Readonly<LookupPreset> = Object.freeze({
  maxNames: 128,
  maxPrefixes: 32,
  maxDatatypes: 32,
});

export function normalizeLookupPreset(value: Partial<LookupPreset> = {}): LookupPreset {
  const preset = { ...DEFAULT_LOOKUP_PRESET, ...value };
  if (!Number.isInteger(preset.maxNames) || preset.maxNames < MIN_NAME_LOOKUP_SIZE || preset.maxNames > MAX_LOOKUP_SIZE) {
    throw new JellyConformanceError(`Name lookup size must be between ${MIN_NAME_LOOKUP_SIZE} and ${MAX_LOOKUP_SIZE}`);
  }
  for (const [name, size] of [['Prefix', preset.maxPrefixes], ['Datatype', preset.maxDatatypes]] as const) {
    if (!Number.isInteger(size) || size < 0 || size > MAX_LOOKUP_SIZE) {
      throw new JellyConformanceError(`${name} lookup size must be between 0 and ${MAX_LOOKUP_SIZE}`);
    }
  }
  if (preset.maxPrefixes > 0 && preset.maxPrefixes < MIN_PREFIX_LOOKUP_SIZE) {
    throw new JellyConformanceError(
      `Prefix lookup size ${preset.maxPrefixes} cannot encode a statement whose terms use more prefixes than the table holds; ` +
      `use 0 to disable the prefix lookup or at least ${MIN_PREFIX_LOOKUP_SIZE}`,
    );
  }
  return preset;
}

