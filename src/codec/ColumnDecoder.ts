import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { ColumnSelection } from './ColumnSelection';
import { SelectiveColumn } from './SelectiveColumn';
import { ColumnValueDecoder } from './ColumnValueDecoder';
import { DEFAULT_GRAPH_VALUE, POSITIONS, matchesPatterns, selectivePatterns, selectionPosition, type TermValue } from './QuadFilter';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { Message, type ParserOptions, type QuadPattern, type StreamOptions } from '../types';
import type { DecoderEvents } from './Decoder';
import { ColumnTermDecoder, type ColumnValueReader } from './ColumnTermDecoder';

type P = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
function fail(message: string): never { throw new JellyConformanceError(message); }
const EMPTY_METADATA: ReadonlyMap<string, Uint8Array> = new Map();
const NO_QUADS: readonly RDF.Quad[] = [];

/** The column layout has independent IRI inference sequences and message boundaries. */
export class ColumnDecoder extends ColumnTermDecoder {
  public streamOptions?: StreamOptions;
  /** Set when a frame declared namespaces; the owner clears it after copying them. */
  public namespacesChanged = false;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null);
  private readonly patterns: readonly QuadPattern[] | undefined;
  private readonly columnSelection?: ColumnSelection;
  private valueDecoder?: ColumnValueDecoder;
  private selective?: SelectiveColumn;
  /** Values of the selected rows only, one array per position, indexed by selection order. */
  private readonly selectedCells: Array<Array<RDF.Term | TermValue | undefined>> = [[], [], [], []];
  private readonly valueCells: Array<Array<TermValue | undefined>> = [[], [], [], []];
  private materialized = new WeakMap<TermValue, RDF.Term>();
  private scopedMaterialized = new WeakMap<TermValue, RDF.Term>();
  private current: RDF.Quad[] = [];
  private openMessage = false;
  private counter = 0;
  private readonly subjectCells: Array<RDF.Term | undefined> = [];
  private readonly predicateCells: Array<RDF.Term | undefined> = [];
  private readonly objectCells: Array<RDF.Term | undefined> = [];
  private readonly graphCells: Array<RDF.Term | undefined> = [];

  public constructor(options: ParserOptions, private readonly events: DecoderEvents) {
    super(options);
    this.patterns = selectivePatterns(options.quadPatterns);
    const position = selectionPosition(this.patterns);
    if (position) this.columnSelection = new ColumnSelection(this.patterns!, position);
  }

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
        if (this.openMessage) this.endMessage(out, output, metadata);
        this.resetBlankNodeScope();
      }
      this.resetLookups(raw);
      this.valueDecoder = undefined;
      this.selective = undefined;
      this.materialized = new WeakMap();
      this.scopedMaterialized = new WeakMap();
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
    this.applyLookups(b.names, this.names);
    this.applyLookups(b.prefixes, this.prefixes);
    this.applyLookups(b.datatypes, this.datatypes);
    const nsState = b.namespaces.length ? [0, 0] : undefined;
    for (const rawNs of b.namespaces) {
      const ns = rawNs as eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration;
      const term = this.iri((ns.value ?? {}) as I, nsState!);
      this.namespaces[ns.name] = term;
      this.namespacesChanged = true;
      this.events.namespace?.(ns.name, term);
    }
    if (this.streamOptions.physicalType === 1 && b.graphs) fail('Graphs column in a TRIPLES stream');
    // The ordinary decoder keeps its direct RDF/JS path when no filter is set.
    const filtered = this.patterns !== undefined;
    let subjects: ReadonlyArray<RDF.Term | TermValue | undefined>, predicates: typeof subjects, objects: typeof subjects;
    let graphs: typeof subjects | undefined;
    let selective: SelectiveColumn | undefined;
    if (this.columnSelection) {
      // One column chooses the rows; the other columns are built for those rows only.
      const selection = this.columnSelection;
      const valueDecoder = this.valueDecoder ??= new ColumnValueDecoder(this.names, this.prefixes, this.datatypes);
      selective = this.selective ??= new SelectiveColumn(this.names, this.prefixes, this.datatypes, valueDecoder);
      const reader = (selection.selectorOnly ? this.termReader : valueDecoder) as ColumnValueReader<RDF.Term | TermValue>;
      const columns = [b.subjects, b.predicates, b.objects, b.graphs] as Array<C | null>;
      const cells = this.selectedCells;
      selective.select(columns[selection.index]!, n, POSITIONS[selection.index]!, selection, reader, cells[selection.index]!);
      for (let i = 0; i < 4; i++) if (i !== selection.index) selective.gather(columns[i]!, n, POSITIONS[i]!, reader, cells[i]!);
      subjects = cells[0]!; predicates = cells[1]!; objects = cells[2]!;
      graphs = b.graphs ? cells[3]! : undefined;
    } else if (filtered) {
      const reader = this.valueDecoder ??= new ColumnValueDecoder(this.names, this.prefixes, this.datatypes);
      predicates = this.expandColumn(b.predicates as C | null, n, this.valueCells[1]!, reader);
      subjects = this.expandColumn(b.subjects as C | null, n, this.valueCells[0]!, reader, 'subject');
      objects = this.expandColumn(b.objects as C | null, n, this.valueCells[2]!, reader, 'object');
      graphs = b.graphs ? this.expandColumn(b.graphs as C, n, this.valueCells[3]!, reader, 'graph') : undefined;
    } else {
      predicates = this.column(b.predicates as C | null, n, this.predicateCells);
      subjects = this.column(b.subjects as C | null, n, this.subjectCells);
      objects = this.column(b.objects as C | null, n, this.objectCells);
      graphs = b.graphs ? this.column(b.graphs as C, n, this.graphCells) : undefined;
    }
    if (!graphs) { this.graphCells.length = 0; this.valueCells[3]!.length = 0; }
    const lengths = b.messageLengths;
    if (this.streamOptions.streamType === 0 && lengths.length) fail('Message boundaries in a FLAT stream');
    let total = 0;
    for (let i = 0; i < lengths.length; i++) total += lengths[i]!;
    if (total > n) fail('Message lengths exceed row_count');
    // A complete message can be built in its final container. Partial messages
    // still use the accumulation path so their terminating frame owns metadata.
    if (!output && !selective && !this.openMessage && lengths.length === 1 && lengths[0] === n) {
      this.current = new Message(this.counter, NO_QUADS, metadata);
    }
    const scoped = this.streamOptions.streamType === 1;
    let pos = 0, cursor = 0;
    for (let i = 0; i < lengths.length; i++) {
      // A message that starts and ends in this frame is built in its final container.
      if (!output && selective && (i > 0 || !this.openMessage)) this.current = new Message(this.counter, NO_QUADS, metadata);
      if (selective) cursor = this.appendSelected(output, pos + lengths[i]!, lengths[i]!, cursor, selective, subjects, predicates, objects, graphs, scoped);
      else this.append(output, pos, lengths[i]!, subjects, predicates, objects, graphs, scoped);
      pos += lengths[i]!;
      this.endMessage(out, output, metadata);
      this.resetBlankNodeScope();
      if (filtered) this.scopedMaterialized = new WeakMap();
    }
    if (selective) this.appendSelected(output, n, n - pos, cursor, selective, subjects, predicates, objects, graphs, scoped);
    else this.append(output, pos, n - pos, subjects, predicates, objects, graphs, scoped);
    // FLAT streams expose batches through the existing message API; only
    // MESSAGES streams retain an unfinished message across frame boundaries.
    if (this.streamOptions.streamType === 0) this.endMessage(out, output, metadata);
    return out;
  }

  private endMessage(out: Message[], output: RDF.Quad[] | undefined, metadata: ReadonlyMap<string, Uint8Array>): void {
    // Constructing an empty message is several times cheaper than converting an array into one.
    if (!output) out.push(this.current instanceof Message ? this.current : this.current.length ? this.ownMessage(metadata) : new Message(this.counter, NO_QUADS, metadata));
    this.counter++;
    this.current = [];
    this.openMessage = false;
  }

  private append(
    output: RDF.Quad[] | undefined, start: number, count: number,
    subjects: ReadonlyArray<RDF.Term | TermValue | undefined>, predicates: ReadonlyArray<RDF.Term | TermValue | undefined>,
    objects: ReadonlyArray<RDF.Term | TermValue | undefined>, graphs: ReadonlyArray<RDF.Term | TermValue | undefined> | undefined, scoped: boolean,
  ): void {
    if (!count) return;
    const target = output ?? this.current, factory = this.factory, defaultGraph = this.defaultGraph, counter = this.counter;
    for (let pos = start, end = start + count; pos < end; pos++) {
      // Remap blank nodes per logical message, including those in triple terms.
      const s = subjects[pos], p = predicates[pos], o = objects[pos], g = graphs?.[pos];
      if (!s || (s.termType !== 'NamedNode' && s.termType !== 'BlankNode')) fail('Invalid or unbound subject in column');
      if (!p || p.termType !== 'NamedNode') fail('Invalid or unbound predicate in column');
      if (!o) fail('Unbound object in column');
      if (g && g.termType !== 'NamedNode' && g.termType !== 'BlankNode') fail('Invalid graph in column');
      if (this.patterns !== undefined) {
        if (!matchesPatterns(this.patterns, s, p, o, g ?? DEFAULT_GRAPH_VALUE, scoped ? counter : undefined)) continue;
        target.push(factory.quad(
          this.materialize(s as TermValue, scoped ? counter : undefined) as RDF.Quad_Subject,
          this.materialize(p as TermValue) as RDF.Quad_Predicate,
          this.materialize(o as TermValue, scoped ? counter : undefined) as RDF.Quad_Object,
          g ? this.materialize(g as TermValue, scoped ? counter : undefined) as RDF.Quad_Graph : defaultGraph,
        ));
      } else {
        target.push(factory.quad(
          (scoped && s.termType === 'BlankNode' ? this.scopeTerm(s as RDF.Term, counter) : s) as RDF.Quad_Subject,
          p as RDF.Quad_Predicate,
          (scoped && (o.termType === 'BlankNode' || o.termType === 'Quad') ? this.scopeTerm(o as RDF.Term, counter) : o) as RDF.Quad_Object,
          g ? (scoped && g.termType === 'BlankNode' ? this.scopeTerm(g as RDF.Term, counter) : g) as RDF.Quad_Graph : defaultGraph,
        ));
      }
    }
    this.openMessage = true;
  }

  /** Append the selected rows before `end`, whose values `selective` has gathered in selection order; returns the next selection index. */
  private appendSelected(
    output: RDF.Quad[] | undefined, end: number, count: number, index: number, selective: SelectiveColumn,
    subjects: ReadonlyArray<RDF.Term | TermValue | undefined>, predicates: ReadonlyArray<RDF.Term | TermValue | undefined>,
    objects: ReadonlyArray<RDF.Term | TermValue | undefined>, graphs: ReadonlyArray<RDF.Term | TermValue | undefined> | undefined, scoped: boolean,
  ): number {
    if (!count) return index;
    const target = output ?? this.current, factory = this.factory, defaultGraph = this.defaultGraph, counter = this.counter;
    const rows = selective.rows, selected = selective.rowCount;
    if (this.columnSelection!.selectorOnly) {
      for (; index < selected && rows[index]! < end; index++) {
        const s = subjects[index] as RDF.Term, p = predicates[index] as RDF.Term, o = objects[index] as RDF.Term, g = graphs?.[index] as RDF.Term | undefined;
        target.push(factory.quad(
          (scoped && s.termType === 'BlankNode' ? this.scopeTerm(s, counter) : s) as RDF.Quad_Subject,
          p as RDF.Quad_Predicate,
          (scoped && (o.termType === 'BlankNode' || o.termType === 'Quad') ? this.scopeTerm(o, counter) : o) as RDF.Quad_Object,
          g ? (scoped && g.termType === 'BlankNode' ? this.scopeTerm(g, counter) : g) as RDF.Quad_Graph : defaultGraph,
        ));
      }
    } else {
      const patterns = this.patterns!, scope = scoped ? counter : undefined;
      for (; index < selected && rows[index]! < end; index++) {
        const s = subjects[index] as TermValue, p = predicates[index] as TermValue, o = objects[index] as TermValue, g = graphs?.[index] as TermValue | undefined;
        if (!matchesPatterns(patterns, s, p, o, g ?? DEFAULT_GRAPH_VALUE, scope)) continue;
        target.push(factory.quad(
          this.materialize(s, scope) as RDF.Quad_Subject, this.materialize(p) as RDF.Quad_Predicate,
          this.materialize(o, scope) as RDF.Quad_Object, g ? this.materialize(g, scope) as RDF.Quad_Graph : defaultGraph,
        ));
      }
    }
    this.openMessage = true;
    return index;
  }

  /** Only selected values cross the RDF/JS data-factory boundary. */
  private materialize(value: TermValue, scope?: number): RDF.Term {
    const cache = scope !== undefined && (value.termType === 'BlankNode' || value.termType === 'Quad') ? this.scopedMaterialized : this.materialized;
    const cached = cache.get(value);
    if (cached) return cached;
    let term: RDF.Term;
    if (value.termType === 'NamedNode') term = this.factory.namedNode(value.value);
    else if (value.termType === 'DefaultGraph') term = this.defaultGraph;
    else if (value.termType === 'BlankNode') {
      // scopeTerm owns the per-message identity cache; the wire value only
      // needs a label and kind, so no unscoped RDF blank node is allocated.
      term = scope === undefined ? this.factory.blankNode(value.value) : this.scopeBlankNode(value.value, scope);
    } else if (value.termType === 'Quad') term = this.factory.quad(
      this.materialize(value.subject, scope) as RDF.Quad_Subject,
      this.materialize(value.predicate) as RDF.Quad_Predicate,
      this.materialize(value.object, scope) as RDF.Quad_Object,
      this.defaultGraph,
    );
    else {
      term = value.direction ? this.factory.literal(value.value, { language: value.language, direction: value.direction })
        : value.language ? this.factory.literal(value.value, value.language)
        : this.factory.literal(value.value, this.materialize(value.datatype) as RDF.NamedNode);
      if (value.direction && (term.termType !== 'Literal' || term.direction !== value.direction || term.datatype.value !== value.datatype.value)) {
        throw new JellyUnsupportedFeatureError('The RDF data factory does not support directional language literals');
      }
    }
    cache.set(value, term);
    return term;
  }

  /** The accumulation array is private and is replaced immediately after this
   * call. Transfer it to the result instead of copying every quad into a second
   * array. Initialize the same public fields as the Message constructor. */
  private ownMessage(metadata: ReadonlyMap<string, Uint8Array>): Message {
    const message = this.current as RDF.Quad[] & { messageCounter: number; metadata: ReadonlyMap<string, Uint8Array> };
    message.messageCounter = this.counter;
    message.metadata = metadata;
    return Object.setPrototypeOf(message, Message.prototype) as Message;
  }

  public finish(): Message[] {
    if (!this.streamOptions) fail('No Jelly stream options row was found');
    if (!this.openMessage) return [];
    const out = new Message(this.counter++, this.current);
    this.current = [];
    this.openMessage = false;
    return [out];
  }

}
