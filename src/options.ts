import { JellyConformanceError } from './errors';

export const MIN_NAME_LOOKUP_SIZE = 8;
export const MAX_LOOKUP_SIZE = 4096;
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
  return preset;
}

