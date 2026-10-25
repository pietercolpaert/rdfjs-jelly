import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { ColumnTermEncoder, type IriRef } from './ColumnTermEncoder';
import { BatchLookup, ColumnLookupEncoder, type ColumnLookup } from './ColumnLookupEncoder';
import type { RdfStreamFrame } from '../generated/rdf_pb';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { normalizeColumnLookupPreset, type LookupPreset } from '../options';
import { PhysicalStreamType, RdfStreamType, RdfVersion, type WriterOptions, type MessageMetadata } from '../types';

/** Batches own their lookup working set; entries can never be evicted mid-batch. */
export class ColumnEncoder extends ColumnTermEncoder {
  public readonly frames: RdfStreamFrame[] = [];
  public readonly physicalType: PhysicalStreamType;
  public readonly lookup: LookupPreset;
  private readonly size: number;
  private readonly streamType: RdfStreamType;
  // Terms of the current batch by position, with the ref of each IRI term.
  private subjects: RDF.Term[] = [];
  private predicates: RDF.Term[] = [];
  private objects: RDF.Term[] = [];
  private graphs: RDF.Term[] = [];
  private subjectRefs: Array<IriRef | undefined> = [];
  private predicateRefs: Array<IriRef | undefined> = [];
  private objectRefs: Array<IriRef | undefined> = [];
  private graphRefs: Array<IriRef | undefined> = [];
  private rowSubjectRef?: IriRef;
  private rowPredicateRef?: IriRef;
  private rowObjectRef?: IriRef;
  private rowGraphRef?: IriRef;
  private namespaces: Array<[string, string]> = [];
  private first = true;
  private finished = false;
  private inMessage = false;
  private messageLengths: number[] = [];
  private readonly rowNames: string[] = [];
  private readonly rowDatatypes: string[] = [];
  private lastBoundary = 0;
  private readonly packMessages: boolean;
  private readonly nameLookup: ColumnLookup;
  private readonly prefixLookup: ColumnLookup;
  private readonly datatypeLookup: ColumnLookup;
  private readonly scratch = new Set<string>();
  private lastPrefix = '';
  private lastPrefixBatch = 0;
  private lastPrefixId = 0;

  public constructor(private readonly options: WriterOptions, private readonly sink?: (frame: RdfStreamFrame) => void) {
    super(options.rdfVersion ?? RdfVersion.RDF_1_2, normalizeColumnLookupPreset(options.lookup).maxPrefixes > 0);
    this.physicalType = options.physicalType ?? PhysicalStreamType.QUADS;
    if (this.physicalType !== 1 && this.physicalType !== 2) throw new JellyConformanceError('Jelly 1.2 requires TRIPLES or QUADS; use QUADS for named graphs');
    if (options.logicalType) throw new JellyConformanceError('Jelly 1.2 uses streamType instead of logicalType');
    this.streamType = options.streamType ?? RdfStreamType.FLAT;
    if (![0, 1].includes(this.streamType) || ![0, 1, 2, 3].includes(this.rdfVersion)) throw new JellyConformanceError('Invalid streamType or rdfVersion');
    this.lookup = normalizeColumnLookupPreset(options.lookup);
    // Dictionaries that outlive a batch send each name once per stream.
    const make = (capacity: number): ColumnLookup => options.persistentLookups ?? true ? new ColumnLookupEncoder(capacity) : new BatchLookup(capacity);
    this.nameLookup = make(this.lookup.maxNames);
    this.prefixLookup = make(this.lookup.maxPrefixes);
    this.datatypeLookup = make(this.lookup.maxDatatypes);
    if (this.lookup.maxNames < 128) throw new JellyConformanceError('Jelly 1.2 requires a name lookup size of at least 128');
    this.packMessages = options.packMessages ?? true;
    this.size = options.messageSize ?? 250;
    if (!Number.isInteger(this.size) || this.size < 1 || this.size > 0x7ffffff) throw new JellyConformanceError('messageSize must be between 1 and 2^27 - 1');
  }
  private assertOpen(): void { if (this.finished) throw new JellyConformanceError('Jelly encoder has already ended'); }
  public addNamespace(name: string, iri: string): void {
    this.assertOpen();
    if (this.packMessages && (this.subjects.length || this.messageLengths.length)) this.flushFrame();
    this.collectIri(iri);
    if (!this.rowFits()) { this.flushFrame(); this.collectIri(iri); this.assertRowFits(); }
    this.register();
    this.namespaces.push([name, iri]);
  }
  private collectIri(iri: string): void {
    this.clearRow();
    this.keyIri(iri, this.rowNames);
  }
  public addQuad(quad: RDF.Quad): void {
    this.assertOpen();
    if (this.streamType === 1 && !this.inMessage) throw new JellyConformanceError('Use addMessage() or message counters with streamType MESSAGES');
    if (this.physicalType === 1 && quad.graph.termType !== 'DefaultGraph') throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
    const { subject, predicate, object, graph } = quad;
    const objectType = object.termType, graphType = graph.termType;
    if (objectType !== 'NamedNode' && objectType !== 'BlankNode' && objectType !== 'Literal' && objectType !== 'Quad') throw new JellyConformanceError('Invalid RDF object');
    if ((subject.termType !== 'NamedNode' && subject.termType !== 'BlankNode') || predicate.termType !== 'NamedNode' ||
      (graphType !== 'DefaultGraph' && graphType !== 'NamedNode' && graphType !== 'BlankNode')) throw new JellyConformanceError('Invalid RDF statement');
    if (this.subjects.length >= this.size) this.flushFrame();
    this.collect(quad);
    // A flush starts a new batch, which holds none of the row's keys: collect them all again.
    if (!this.rowFits()) { this.flushFrame(); this.collect(quad); this.assertRowFits(); }
    this.register();
    this.subjects.push(quad.subject); this.predicates.push(quad.predicate); this.objects.push(quad.object); this.graphs.push(quad.graph);
    this.subjectRefs.push(this.rowSubjectRef); this.predicateRefs.push(this.rowPredicateRef); this.objectRefs.push(this.rowObjectRef); this.graphRefs.push(this.rowGraphRef);
  }
  private clearRow(): void {
    // Truncating an empty list still costs a call, and most rows add nothing new.
    if (this.rowNames.length) this.rowNames.length = 0;
    if (this.rowDatatypes.length) this.rowDatatypes.length = 0;
    if (this.rowRefs.length) this.rowRefs.length = 0;
  }
  /** Gathers the keys of a row that its batch does not hold yet. Lists are reused per row. */
  private collect(quad: RDF.Quad): void {
    this.clearRow();
    this.rowSubjectRef = this.keyOf(quad.subject);
    this.rowPredicateRef = this.keyOf(quad.predicate);
    this.rowObjectRef = this.keyOf(quad.object);
    this.rowGraphRef = this.keyOf(quad.graph);
  }
  /** Collects a term's keys, returning its ref if it is an IRI under prefix compression. */
  private keyOf(term: RDF.Term): IriRef | undefined {
    this.keys(term, this.rowNames, this.rowDatatypes);
    return this.splitIris && term.termType === 'NamedNode' ? this.lastRef : undefined;
  }
  public addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.streamType !== 1) throw new JellyConformanceError('Jelly 1.2 addMessage() requires streamType MESSAGES');
    const hasMetadata = metadata instanceof Map ? metadata.size > 0 : Object.keys(metadata ?? {}).length > 0;
    if (this.packMessages && hasMetadata && (this.subjects.length || this.messageLengths.length)) this.flushFrame();
    this.inMessage = true;
    try {
      for (const quad of quads) this.addQuad(quad);
      this.messageLengths.push(this.subjects.length - this.lastBoundary);
      this.lastBoundary = this.subjects.length;
      // Bound runs of empty messages as well as the statement count.
      if (!this.packMessages || hasMetadata || this.messageLengths.length >= this.size) this.flushFrame(metadata);
    }
    finally { this.inMessage = false; }
  }
  public addGraph(_graph: RDF.Quad_Graph, _quads: Iterable<RDF.Quad>, _metadata?: MessageMetadata): void {
    throw new JellyUnsupportedFeatureError('Jelly 1.2 has no GRAPHS layout; use QUADS and addMessage()');
  }
  /** Emit the current batch without closing the stream. */
  public flush(): void {
    this.assertOpen();
    if (this.first || this.subjects.length || this.namespaces.length || this.messageLengths.length) this.flushFrame();
  }

  public finish(): readonly RdfStreamFrame[] {
    this.assertOpen();
    if (this.first || this.subjects.length || this.namespaces.length || this.messageLengths.length) this.flushFrame();
    this.finished = true;
    return this.frames;
  }
  private rowFits(): boolean {
    const { nameLookup, prefixLookup, datatypeLookup } = this;
    const refs = this.rowRefs.length;
    // Cheap bound that ignores duplicates; exact counting only runs near capacity.
    if (nameLookup.pinnedCount + refs + this.rowNames.length <= nameLookup.capacity &&
      prefixLookup.pinnedCount + refs <= prefixLookup.capacity &&
      datatypeLookup.pinnedCount + this.rowDatatypes.length <= datatypeLookup.capacity) return true;
    const seen = this.scratch;
    seen.clear();
    let count = nameLookup.pinnedCount;
    for (const ref of this.rowRefs) if (!nameLookup.inBatch(ref.name) && !seen.has(ref.name) && (seen.add(ref.name), ++count > nameLookup.capacity)) return false;
    for (const name of this.rowNames) if (!nameLookup.inBatch(name) && !seen.has(name) && (seen.add(name), ++count > nameLookup.capacity)) return false;
    seen.clear();
    count = prefixLookup.pinnedCount;
    for (const ref of this.rowRefs) if (!prefixLookup.inBatch(ref.prefix) && !seen.has(ref.prefix) && (seen.add(ref.prefix), ++count > prefixLookup.capacity)) return false;
    seen.clear();
    count = datatypeLookup.pinnedCount;
    for (const value of this.rowDatatypes) if (!datatypeLookup.inBatch(value) && !seen.has(value) && (seen.add(value), ++count > datatypeLookup.capacity)) return false;
    return true;
  }
  private assertRowFits(): void {
    if (!this.rowFits()) throw new JellyConformanceError('A single statement does not fit in the configured lookup tables');
  }
  private register(): void {
    for (const ref of this.rowRefs) {
      if (ref.batch === this.batchNo) continue;
      ref.nameId = this.nameLookup.ensure(ref.name);
      // Consecutive IRIs often share a namespace.
      if (ref.prefix !== this.lastPrefix || this.lastPrefixBatch !== this.batchNo) {
        this.lastPrefix = ref.prefix;
        this.lastPrefixBatch = this.batchNo;
        this.lastPrefixId = this.prefixLookup.ensure(ref.prefix);
      }
      ref.prefixId = this.lastPrefixId;
      ref.batch = this.batchNo;
    }
    for (const value of this.rowNames) this.nameLookup.ensure(value);
    for (const value of this.rowDatatypes) this.datatypeLookup.ensure(value);
  }
  protected override nameId(iri: string): number { return this.nameLookup.idOf(iri); }
  protected override datatypeId(iri: string): number { return this.datatypeLookup.idOf(iri); }
  private flushFrame(metadata?: MessageMetadata): void {
    const columns: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties = {
      rowCount: this.subjects.length,
      names: this.nameLookup.entries,
      prefixes: this.prefixLookup.entries,
      datatypes: this.datatypeLookup.entries,
      namespaces: this.namespaces.map(([name, iri]) => ({ name, value: this.iriProperties(iri) })),
      subjects: this.column(this.subjects, this.subjectRefs), predicates: this.column(this.predicates, this.predicateRefs), objects: this.column(this.objects, this.objectRefs),
      ...(this.physicalType === 2 ? { graphs: this.column(this.graphs, this.graphRefs) } : {}),
      messageLengths: this.messageLengths,
    };
    const frame: RdfStreamFrame = { rows: this.first ? [{ case: 'options', value: {
      streamName: this.options.streamName ?? '', physicalType: this.physicalType, generalizedStatements: false, rdfStar: false, logicalType: 0,
      streamType: this.streamType, rdfVersion: this.rdfVersion, maxNameTableSize: this.lookup.maxNames, maxPrefixTableSize: this.lookup.maxPrefixes, maxDatatypeTableSize: this.lookup.maxDatatypes, version: 3,
    } }] : [], columns, metadata: metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata ?? {})) };
    if (this.sink) this.sink(frame); else this.frames.push(frame);
    this.first = false;
    this.subjects = []; this.predicates = []; this.objects = []; this.graphs = [];
    this.subjectRefs = []; this.predicateRefs = []; this.objectRefs = []; this.graphRefs = [];
    this.namespaces = [];
    this.messageLengths = [];
    this.lastBoundary = 0;
    this.nextBatch();
    this.nameLookup.endBatch();
    this.prefixLookup.endBatch();
    this.datatypeLookup.endBatch();
  }
}
