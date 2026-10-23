import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { ColumnTermDecoder } from '../codec/ColumnTermDecoder';
import { JellyConformanceError, JellySparqlResultError, JellyUnsupportedFeatureError } from '../errors';
import { SparqlStreamType, type SparqlEvent, type SparqlParserOptions, type SparqlTerm } from '../sparql-types';
import type { SparqlFrame } from './framing';

function fail(message: string): never { throw new JellyConformanceError(message); }
/** Stateful result-set validation on top of the shared RDF column decoder. */
export class SparqlDecoder extends ColumnTermDecoder {
  public streamType?: SparqlStreamType;
  private first = true;
  private seenFrame = false;
  private kind?: 'select' | 'ask';
  private header?: string[];
  private trailer = false;
  private resultIndex = 0;
  private resultError?: string;
  private readonly bnodes = new Map<string, RDF.BlankNode>();
  private readonly usedLabels = new Set<string>();
  private ended = false;

  public constructor(private readonly config: SparqlParserOptions = {}) {
    super(config);
    if (config.maxCellsPerBatch !== undefined && (!Number.isInteger(config.maxCellsPerBatch) || config.maxCellsPerBatch < 0)) fail('maxCellsPerBatch must be a nonnegative integer');
  }
  public decode(frame: SparqlFrame): SparqlEvent[] {
    if (this.ended) fail('Jelly-SPARQL decoder has already ended');
    const events: SparqlEvent[] = [];
    const first = this.first;
    if (!first && this.kind === 'ask') fail('A frame follows an ASK result without starting a new result set');
    if (this.streamType === 0 && this.trailer && !frame.options) fail('A frame without stream options follows a trailer');
    if (this.streamType === 1 && frame.options && !first) fail('Stream options occur inside a punctuated result set');
    if (frame.options) {
      const o = frame.options as eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions;
      if (o.version !== 1) throw new JellyUnsupportedFeatureError(`Unsupported Jelly-SPARQL protocol version ${o.version}`);
      if (o.streamType !== 0 && o.streamType !== 1) fail(`Unknown SPARQL stream type ${o.streamType}`);
      if (this.streamType !== undefined && this.streamType !== Number(o.streamType)) fail('SPARQL stream type cannot change');
      if (o.rdfVersion < 0 || o.rdfVersion > 3) fail(`Unknown RDF version ${o.rdfVersion}`);
      this.resetLookups(o);
      this.streamType = Number(o.streamType);
      this.trailer = false;
    } else if (!this.seenFrame) fail('The first Jelly-SPARQL frame must have stream options');
    this.seenFrame = true;
    this.first = false;
    this.checkRowCount(frame.rowCount);
    const entries = frame.names as eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];
    this.applyLookups([[entries, this.names], [frame.prefixes, this.prefixes], [frame.datatypes, this.datatypes]]);
    if (frame.askResult) {
      if (!first) fail('ASK result must be in the first frame of its result set');
      if (frame.variables.length || frame.columns.length || frame.rowCount) fail('ASK frame cannot contain variables, columns, or rows');
      this.kind = 'ask';
      events.push({ type: 'boolean', resultIndex: this.resultIndex, value: frame.askResult.value ?? false });
    } else {
      if (first) this.kind = 'select';
      if (first || frame.options) {
        if (frame.variables.some(v => !v) || new Set(frame.variables).size !== frame.variables.length) fail('Variable names must be nonempty and unique');
        if (this.header && (this.header.length !== frame.variables.length || this.header.some((v, i) => v !== frame.variables[i]))) fail('Restated header must declare the same variables in the same order');
        this.header = [...frame.variables];
        if (first) events.push({ type: 'header', resultIndex: this.resultIndex, variables: [...this.header] });
      } else if (frame.variables.length) fail('Header is only allowed at the start or with stream options');
      const variables = this.header!;
      const count = frame.rowCount;
      if (count * Math.max(1, variables.length) > (this.config.maxCellsPerBatch ?? 1_048_576)) fail('Column cell count exceeds configured size limit');
      if (frame.columns.length && frame.columns.length !== variables.length) fail('Column count differs from variable count');
      if (!frame.columns.length && variables.length && count) fail('Rows with variables require columns');
      const columns = frame.columns.map(c => this.column(c as eu.ostrzyciel.jelly.core.proto.v1.RdfColumn, count));
      for (let r = 0; r < count; r++) {
        const bindings = new Map<string, SparqlTerm>();
        for (let v = 0; v < variables.length; v++) {
          const term = columns[v]![r];
          if (term) bindings.set(variables[v]!, this.scoped(term) as SparqlTerm);
        }
        events.push({ type: 'binding', resultIndex: this.resultIndex, bindings });
      }
    }
    const metadata = new Map(Object.entries(frame.metadata).map(([k, v]) => [k, new Uint8Array(v)]));
    if (metadata.size) {
      let links: string[] | undefined;
      if (metadata.has('link')) {
        try { const text = new TextDecoder('utf-8', { fatal: true }).decode(metadata.get('link')); links = text ? text.split('\n') : []; }
        catch { metadata.delete('link'); }
      }
      events.push({ type: 'metadata', resultIndex: this.resultIndex, metadata, ...(links ? { links } : {}) });
    }
    if (frame.trailer) {
      this.trailer = true;
      const error = frame.trailer.error ?? '';
      if (error) {
        this.resultError ??= error;
        const failure = new JellySparqlResultError(this.resultIndex, error);
        if (this.config.onResultError) this.config.onResultError(failure); else throw failure;
      }
      if (this.streamType === 1) {
        events.push(this.endEvent());
        this.resultIndex++;
        this.first = true;
        this.kind = undefined;
        this.header = undefined;
        this.resultError = undefined;
        this.trailer = false;
        this.bnodes.clear();
      }
    }
    return events;
  }
  public finish(): SparqlEvent[] {
    if (this.ended) fail('Jelly-SPARQL decoder has already ended');
    this.ended = true;
    if (!this.seenFrame) fail('Jelly-SPARQL input contains no frames');
    return this.first ? [] : [this.endEvent()];
  }
  private endEvent(): SparqlEvent {
    return { type: 'end', resultIndex: this.resultIndex, complete: this.trailer && !this.resultError, ...(this.resultError ? { error: this.resultError } : {}) };
  }
  private scoped(term: RDF.Term): RDF.Term {
    if (this.streamType === 0) return term;
    if (term.termType === 'Quad') return this.factory.quad(this.scoped(term.subject) as RDF.Quad_Subject, term.predicate as RDF.Quad_Predicate, this.scoped(term.object) as RDF.Quad_Object);
    if (term.termType !== 'BlankNode') return term;
    let node = this.bnodes.get(term.value);
    if (!node) {
      let label = term.value;
      while (this.usedLabels.has(label)) label = `sparql${this.resultIndex}_${label}`;
      this.usedLabels.add(label);
      node = this.factory.blankNode(label);
      this.bnodes.set(term.value, node);
    }
    return node;
  }
}
