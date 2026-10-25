import type * as RDF from '@rdfjs/types';
import { ColumnTermEncoder } from '../codec/ColumnTermEncoder';
import { concatBytes } from '../codec/bytes';
import { JellyConformanceError } from '../errors';
import { normalizeColumnLookupPreset, type LookupPreset } from '../options';
import { RdfVersion } from '../types';
import { SparqlStreamType, type SparqlBinding, type SparqlEvent, type SparqlResult, type SparqlResultMetadata, type SparqlWriterOptions } from '../sparql-types';
import { encodeSparqlFrame, type SparqlFrameProperties } from './framing';

export type SparqlWritableResult =
  | ({ type: 'select'; variables: readonly string[]; bindings: Iterable<SparqlBinding> } & SparqlResultMetadata & { error?: string; complete?: boolean })
  | ({ type: 'ask'; boolean: boolean } & SparqlResultMetadata & { error?: string; complete?: boolean });
function fail(message: string): never { throw new JellyConformanceError(message); }
/** Incremental writer: buffers at most one batch, and optionally sends encoded frames to a sink. */
export class SparqlWriter extends ColumnTermEncoder {
  public readonly lookup: LookupPreset;
  private readonly frameSize: number;
  private readonly streamType: SparqlStreamType;
  private readonly chunks: Uint8Array[] = [];
  private rows: ReadonlyMap<string, RDF.Term>[] = [];
  private metadata = new Map<string, Uint8Array>();
  private variables: string[] = [];
  private active?: 'select' | 'ask';
  private askValue = false;
  private firstFrame = true;
  private firstResultFrame = true;
  private resultCount = 0;
  private frameCount = 0;
  private ended = false;

  public constructor(private readonly config: SparqlWriterOptions = {}, private readonly frameSink?: (bytes: Uint8Array) => void) {
    super(config.rdfVersion ?? RdfVersion.RDF_1_2);
    this.lookup = normalizeColumnLookupPreset(config.lookup);
    this.streamType = config.streamType ?? SparqlStreamType.FLAT;
    if (![0, 1].includes(this.streamType)) fail('Unknown SPARQL streamType');
    if (![0, 1, 2, 3].includes(this.rdfVersion)) fail('Unknown RDF version');
    this.frameSize = config.frameSize ?? 250;
    if (!Number.isInteger(this.frameSize) || this.frameSize < 1 || this.frameSize > 0x7ffffff) fail('frameSize must be between 1 and 2^27 - 1');
  }
  public startSelect(variables: readonly string[], info: SparqlResultMetadata = {}): void {
    if (variables.some(v => !v || v.startsWith('?') || v.startsWith('$')) || new Set(variables).size !== variables.length) fail('Variables must be unique, nonempty names without ? or $');
    this.start('select');
    this.variables = [...variables];
    this.addMetadata(info);
  }
  public startAsk(value: boolean, info: SparqlResultMetadata = {}): void {
    if (typeof value !== 'boolean') fail('ASK result must be a boolean');
    this.start('ask');
    this.askValue = value;
    this.addMetadata(info);
  }
  public addBinding(binding: SparqlBinding): void {
    this.assertOpen();
    if (this.active !== 'select') fail('Start a SELECT result before adding bindings');
    // Snapshot the binding: callers may reuse or mutate their Maps between rows.
    const row = new Map(Symbol.iterator in binding ? binding as ReadonlyMap<string, import('../sparql-types').SparqlTerm> : Object.entries(binding));
    const names: string[] = [], datatypes: string[] = [];
    for (const [name, term] of row) {
      if (!this.variables.includes(name)) fail(`Undeclared variable ${name}`);
      if (term === undefined) { row.delete(name); continue; }
      if (!['NamedNode', 'BlankNode', 'Literal', 'Quad'].includes(term.termType)) fail(`Invalid SPARQL binding term ${term.termType}`);
      this.keys(term, names, datatypes);
    }
    if (this.rows.length >= this.frameSize) this.flush();
    if (!this.workingSetFits(names, datatypes, this.lookup)) {
      if (this.rows.length) this.flush();
      if (!this.workingSetFits(names, datatypes, this.lookup)) fail('A single solution does not fit in the configured lookup tables');
    }
    for (const [values, table] of [[names, this.tables[0]!], [datatypes, this.tables[1]!]] as const) for (const value of values) if (!table.has(value)) table.set(value, table.size + 1);
    this.rows.push(row as Map<string, RDF.Term>);
  }
  public addMetadata(info: SparqlResultMetadata): void {
    this.assertOpen();
    if (!this.active) fail('Start a result before adding metadata');
    const entries = info.metadata instanceof Map ? info.metadata : Object.entries(info.metadata ?? {});
    for (const [key, value] of entries) {
      if (key === 'link') {
        try { new TextDecoder('utf-8', { fatal: true }).decode(value); }
        catch { fail('The link metadata must be valid UTF-8'); }
      }
      this.metadata.set(key, new Uint8Array(value));
    }
    if (info.links) {
      if (info.links.some(link => typeof link !== 'string' || link.includes('\n'))) fail('Links must be strings without LF characters');
      this.metadata.set('link', new TextEncoder().encode(info.links.join('\n')));
    }
  }
  public endResult(error = ''): void {
    this.assertOpen();
    if (!this.active) fail('No SPARQL result set is open');
    this.flush(error);
    this.active = undefined;
    this.resultCount++;
  }
  public addAsk(value: boolean, info: SparqlResultMetadata = {}): void { this.startAsk(value, info); this.endResult(); }
  public addResult(result: SparqlWritableResult | SparqlResult): void {
    if (result.type === 'ask') this.startAsk(result.boolean, result);
    else { this.startSelect(result.variables, result); for (const binding of result.bindings) this.addBinding(binding); }
    this.endResult(result.error || (result.complete === false ? 'Result set incomplete' : ''));
  }
  /** Accepts the events emitted by SparqlStreamParser. */
  public write(event: SparqlEvent): void {
    if (event.type === 'header') this.startSelect(event.variables);
    else if (event.type === 'boolean') this.startAsk(event.value);
    else if (event.type === 'binding') this.addBinding(event.bindings);
    else if (event.type === 'metadata') this.addMetadata(event);
    else this.endResult(event.error || (event.complete ? '' : 'Result set incomplete'));
  }
  /** Finalizes the open result (if any) and returns bytes, or empty bytes with a frame sink. */
  public end(): Uint8Array {
    this.assertOpen();
    if (this.active) this.endResult();
    if (!this.resultCount) { this.startSelect([]); this.endResult(); }
    this.ended = true;
    const bytes = concatBytes(this.chunks);
    this.chunks.length = 0;
    return bytes;
  }
  private start(kind: 'select' | 'ask'): void {
    this.assertOpen();
    if (this.active) fail('End the current result set before starting another');
    if (this.streamType === 0 && this.resultCount) fail('Use PUNCTUATED to write more than one result set');
    this.active = kind;
    this.firstResultFrame = true;
    this.variables = [];
  }
  private assertOpen(): void { if (this.ended) fail('Jelly-SPARQL writer has already ended'); }
  private flush(error?: string): void {
    if (this.active === 'ask' && error === undefined) fail('An ASK result must fit in one frame with its trailer');
    if (this.config.delimited === false && this.frameCount) fail('Non-delimited Jelly-SPARQL output must contain exactly one frame');
    const frame: SparqlFrameProperties = {
      ...(this.firstFrame ? { options: { streamName: this.config.streamName ?? '', streamType: Number(this.streamType), rdfVersion: Number(this.rdfVersion),
        maxNameTableSize: this.lookup.maxNames, maxPrefixTableSize: this.lookup.maxPrefixes, maxDatatypeTableSize: this.lookup.maxDatatypes, version: 1 } } : {}),
      ...(this.active === 'ask' ? { askResult: { value: this.askValue } } : {
        variables: this.firstResultFrame ? this.variables : [], rowCount: this.rows.length,
        names: this.tables[0]!.size ? [{ id: 1, values: [...this.tables[0]!.keys()] }] : [],
        datatypes: this.tables[1]!.size ? [{ id: 1, values: [...this.tables[1]!.keys()] }] : [],
        columns: this.rows.length ? this.variables.map(v => this.column(this.rows.map(row => row.get(v) ?? UNBOUND))) : [],
      }),
      metadata: Object.fromEntries(this.metadata),
      ...(error !== undefined ? { trailer: { error } } : {}),
    };
    const bytes = encodeSparqlFrame(frame, this.config.delimited ?? true);
    if (this.frameSink) this.frameSink(bytes); else this.chunks.push(bytes);
    this.frameCount++;
    this.firstFrame = false;
    this.firstResultFrame = false;
    this.rows = [];
    this.metadata = new Map();
    for (const table of this.tables) table.clear();
  }
}
// DefaultGraph is the shared column encoder's unbound sentinel; it is never a binding value.
const UNBOUND: RDF.DefaultGraph = { termType: 'DefaultGraph', value: '', equals: other => other?.termType === 'DefaultGraph' };
