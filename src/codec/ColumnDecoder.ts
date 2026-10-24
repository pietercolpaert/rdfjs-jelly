import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { Message, type ParserOptions, type StreamOptions } from '../types';
import type { DecoderEvents } from './Decoder';
import { ColumnTermDecoder } from './ColumnTermDecoder';

type P = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
function fail(message: string): never { throw new JellyConformanceError(message); }
const EMPTY_METADATA: ReadonlyMap<string, Uint8Array> = new Map();

/** The column layout has independent IRI inference sequences and message boundaries. */
export class ColumnDecoder extends ColumnTermDecoder {
  public streamOptions?: StreamOptions;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null);
  private current: RDF.Quad[] = [];
  private openMessage = false;
  private counter = 0;

  public constructor(options: ParserOptions, private readonly events: DecoderEvents) { super(options); }

  public decode(frame: P, output?: RDF.Quad[]): Message[] {
    const out: Message[] = [];
    let metadata = EMPTY_METADATA;
    if (!output) for (const key in frame.metadata) {
      if (!Object.hasOwn(frame.metadata, key)) continue;
      if (metadata === EMPTY_METADATA) metadata = new Map();
      (metadata as Map<string, Uint8Array>).set(key, new Uint8Array(frame.metadata[key]!));
    }
    if (output && this.current.length) {
      for (const quad of this.current) output.push(quad);
      this.current = [];
    }
    const endMessage = (): void => {
      if (!output) out.push(new Message(this.counter, this.current, metadata));
      this.counter++;
      this.current = [];
      this.openMessage = false;
    };
    if (frame.rows.length > 1) fail('Column layout permits only one options row per frame');
    for (const row of frame.rows) {
      const kind = (row as typeof row & { $row?: string }).$row ?? row.row;
      if (kind !== 'options') fail('Row layout data is invalid in a column stream');
      const raw = row.options as unknown as StreamOptions & { streamType: number; rdfVersion: number };
      const old = this.streamOptions;
      if (raw.version !== 3) fail('Cannot change Jelly layout within a stream');
      if (raw.generalizedStatements || raw.rdfStar || raw.logicalType) fail('Row layout options are invalid in a column stream');
      if (raw.physicalType !== 1 && raw.physicalType !== 2) fail('Column streams require physical type TRIPLES or QUADS');
      if (raw.streamType !== 0 && raw.streamType !== 1) fail(`Unknown RDF stream type ${raw.streamType}`);
      if (raw.rdfVersion < 0 || raw.rdfVersion > 3) fail(`Unknown RDF version ${raw.rdfVersion}`);
      if (old && (raw.physicalType !== old.physicalType || raw.streamType !== old.streamType)) fail('Restated options must preserve physical type, stream type, and version');
      if (old?.streamType === 1) {
        if (this.openMessage) endMessage();
        this.resetBlankNodeScope();
      }
      this.resetLookups(raw);
      this.streamOptions = {
        streamName: raw.streamName, physicalType: raw.physicalType, logicalType: 0, generalizedStatements: false, rdfStar: false,
        maxNameTableSize: raw.maxNameTableSize, maxPrefixTableSize: raw.maxPrefixTableSize, maxDatatypeTableSize: raw.maxDatatypeTableSize,
        version: 3, streamType: raw.streamType, rdfVersion: raw.rdfVersion,
      };
      this.events.options?.(this.streamOptions);
    }
    const b = frame.columns as eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch | null;
    if (!b) return out;
    if (!this.streamOptions) fail('Column batch before stream options');
    const n = b.rowCount;
    this.checkRowCount(n);
    this.applyLookups([[b.names, this.names], [b.prefixes, this.prefixes], [b.datatypes, this.datatypes]]);
    const nsState = [0, 0];
    for (const rawNs of b.namespaces) {
      const ns = rawNs as eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration;
      const term = this.iri((ns.value ?? {}) as I, nsState);
      this.namespaces[ns.name] = term;
      this.events.namespace?.(ns.name, term);
    }
    if (this.streamOptions.physicalType === 1 && b.graphs) fail('Graphs column in a TRIPLES stream');
    const subjects = this.column(b.subjects as C | null, n);
    const predicates = this.column(b.predicates as C | null, n);
    const objects = this.column(b.objects as C | null, n);
    const graphs = b.graphs ? this.column(b.graphs as C, n) : undefined;
    const lengths = b.messageLengths;
    if (this.streamOptions.streamType === 0 && lengths.length) fail('Message boundaries in a FLAT stream');
    if (lengths.reduce((sum, v) => sum + v, 0) > n) fail('Message lengths exceed row_count');
    let pos = 0;
    const append = (count: number): void => {
      for (const end = pos + count; pos < end; pos++) {
        // Remap blank nodes per logical message, including those in triple terms.
        const s = subjects[pos], p = predicates[pos], o = objects[pos], g = graphs?.[pos];
        if (!s || (s.termType !== 'NamedNode' && s.termType !== 'BlankNode')) fail('Invalid or unbound subject in column');
        if (!p || p.termType !== 'NamedNode') fail('Invalid or unbound predicate in column');
        if (!o) fail('Unbound object in column');
        if (g && g.termType !== 'NamedNode' && g.termType !== 'BlankNode') fail('Invalid graph in column');
        const quad = this.factory.quad(this.scoped(s) as RDF.Quad_Subject, p, this.scoped(o) as RDF.Quad_Object, g ? this.scoped(g) as RDF.Quad_Graph : this.defaultGraph);
        (output ?? this.current).push(quad);
        this.openMessage = true;
      }
    };
    for (const length of lengths) {
      append(length);
      endMessage();
      this.resetBlankNodeScope();
    }
    append(n - pos);
    // FLAT streams expose batches through the existing message API; only
    // MESSAGES streams retain an unfinished message across frame boundaries.
    if (this.streamOptions.streamType === 0) endMessage();
    return out;
  }

  public finish(): Message[] {
    if (!this.streamOptions) fail('No Jelly stream options row was found');
    if (!this.openMessage) return [];
    const out = new Message(this.counter++, this.current);
    this.current = [];
    this.openMessage = false;
    return [out];
  }

  private scoped(term: RDF.Term): RDF.Term {
    return this.streamOptions!.streamType === 1 ? this.scopeTerm(term, this.counter) : term;
  }
}
