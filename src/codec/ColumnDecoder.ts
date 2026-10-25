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
  /** Set when a frame declared namespaces; the owner clears it after copying them. */
  public namespacesChanged = false;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null);
  private current: RDF.Quad[] = [];
  private openMessage = false;
  private counter = 0;
  private readonly subjectCells: Array<RDF.Term | undefined> = [];
  private readonly predicateCells: Array<RDF.Term | undefined> = [];
  private readonly objectCells: Array<RDF.Term | undefined> = [];
  private readonly graphCells: Array<RDF.Term | undefined> = [];

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
    const subjects = this.column(b.subjects as C | null, n, this.subjectCells);
    const predicates = this.column(b.predicates as C | null, n, this.predicateCells);
    const objects = this.column(b.objects as C | null, n, this.objectCells);
    const graphs = b.graphs ? this.column(b.graphs as C, n, this.graphCells) : undefined;
    if (!graphs) this.graphCells.length = 0;
    const lengths = b.messageLengths;
    if (this.streamOptions.streamType === 0 && lengths.length) fail('Message boundaries in a FLAT stream');
    let total = 0;
    for (let i = 0; i < lengths.length; i++) total += lengths[i]!;
    if (total > n) fail('Message lengths exceed row_count');
    // A complete message can be built in its final container. Partial messages
    // still use the accumulation path so their terminating frame owns metadata.
    if (!output && !this.openMessage && lengths.length === 1 && lengths[0] === n) {
      this.current = new Message(this.counter, [], metadata);
    }
    const scoped = this.streamOptions.streamType === 1;
    let pos = 0;
    for (let i = 0; i < lengths.length; i++) {
      this.append(output, pos, lengths[i]!, subjects, predicates, objects, graphs, scoped);
      pos += lengths[i]!;
      this.endMessage(out, output, metadata);
      this.resetBlankNodeScope();
    }
    this.append(output, pos, n - pos, subjects, predicates, objects, graphs, scoped);
    // FLAT streams expose batches through the existing message API; only
    // MESSAGES streams retain an unfinished message across frame boundaries.
    if (this.streamOptions.streamType === 0) this.endMessage(out, output, metadata);
    return out;
  }

  private endMessage(out: Message[], output: RDF.Quad[] | undefined, metadata: ReadonlyMap<string, Uint8Array>): void {
    if (!output) out.push(this.current instanceof Message ? this.current : this.ownMessage(metadata));
    this.counter++;
    this.current = [];
    this.openMessage = false;
  }

  private append(
    output: RDF.Quad[] | undefined, start: number, count: number,
    subjects: ReadonlyArray<RDF.Term | undefined>, predicates: ReadonlyArray<RDF.Term | undefined>,
    objects: ReadonlyArray<RDF.Term | undefined>, graphs: ReadonlyArray<RDF.Term | undefined> | undefined, scoped: boolean,
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
      target.push(factory.quad(
        (scoped && s.termType === 'BlankNode' ? this.scopeTerm(s, counter) : s) as RDF.Quad_Subject,
        p,
        (scoped && (o.termType === 'BlankNode' || o.termType === 'Quad') ? this.scopeTerm(o, counter) : o) as RDF.Quad_Object,
        g ? (scoped && g.termType === 'BlankNode' ? this.scopeTerm(g, counter) : g) as RDF.Quad_Graph : defaultGraph,
      ));
    }
    this.openMessage = true;
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
