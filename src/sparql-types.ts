import type * as RDF from '@rdfjs/types';
import type { LookupPreset } from './options';
import type { MessageMetadata, ParserOptions, RdfVersion } from './types';

export enum SparqlStreamType { FLAT = 0, PUNCTUATED = 1 }
export type SparqlTerm = RDF.NamedNode | RDF.BlankNode | RDF.Literal | RDF.Quad;
/** Keys are variable names without ? or $. Missing keys represent unbound cells. */
export type SparqlBinding = ReadonlyMap<string, SparqlTerm> | Readonly<Record<string, SparqlTerm | undefined>>;
export interface SparqlResultInfo {
  links: string[];
  metadata: ReadonlyMap<string, Uint8Array>;
  complete: boolean;
  error?: string;
}
export interface SparqlSelectResult extends SparqlResultInfo {
  type: 'select';
  variables: string[];
  bindings: Map<string, SparqlTerm>[];
}
export interface SparqlAskResult extends SparqlResultInfo {
  type: 'ask';
  boolean: boolean;
}
export type SparqlResult = SparqlSelectResult | SparqlAskResult;
export type SparqlEvent =
  | { type: 'header'; resultIndex: number; variables: string[] }
  | { type: 'binding'; resultIndex: number; bindings: Map<string, SparqlTerm> }
  | { type: 'boolean'; resultIndex: number; value: boolean }
  | { type: 'metadata'; resultIndex: number; metadata: ReadonlyMap<string, Uint8Array>; links?: string[] }
  | { type: 'end'; resultIndex: number; complete: boolean; error?: string };
export interface SparqlParserOptions extends Pick<ParserOptions, 'factory' | 'maxMessageSize' | 'maxLookupTableSize' | 'maxRowsPerBatch'> {
  /** Files use length-delimited frames (default true). False reads a single bare frame. */
  delimited?: boolean;
  /** Limits expanded cells per frame, including all variables (default 1,048,576). */
  maxCellsPerBatch?: number;
  /** Error trailers throw by default. A callback signals the failure and allows parsing to continue. */
  onResultError?: (error: import('./errors').JellySparqlResultError) => void;
}
export interface SparqlWriterOptions {
  delimited?: boolean;
  streamType?: SparqlStreamType;
  rdfVersion?: RdfVersion;
  streamName?: string;
  lookup?: Partial<LookupPreset>;
  /** Maximum rows per frame. Lookup capacity may end a frame earlier. Default 250. */
  frameSize?: number;
}
export interface SparqlResultMetadata {
  links?: readonly string[];
  metadata?: MessageMetadata;
}
