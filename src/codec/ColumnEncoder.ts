import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { ColumnTermEncoder } from './ColumnTermEncoder';
import { ColumnLookupEncoder } from './ColumnLookupEncoder';
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
  private quads: RDF.Quad[] = [];
  private namespaces: Array<[string, string]> = [];
  private first = true;
  private finished = false;
  private inMessage = false;
  private messageLengths: number[] = [];
  private readonly rowNames: string[] = [];
  private readonly rowDatatypes: string[] = [];
  private lastBoundary = 0;
  private readonly persistentLookups?: readonly [ColumnLookupEncoder, ColumnLookupEncoder];

  public constructor(private readonly options: WriterOptions, private readonly sink?: (frame: RdfStreamFrame) => void) {
    super(options.rdfVersion ?? RdfVersion.RDF_1_2);
    this.physicalType = options.physicalType ?? PhysicalStreamType.QUADS;
    if (this.physicalType !== 1 && this.physicalType !== 2) throw new JellyConformanceError('Jelly 1.2 requires TRIPLES or QUADS; use QUADS for named graphs');
    if (options.logicalType) throw new JellyConformanceError('Jelly 1.2 uses streamType instead of logicalType');
    this.streamType = options.streamType ?? RdfStreamType.FLAT;
    if (![0, 1].includes(this.streamType) || ![0, 1, 2, 3].includes(this.rdfVersion)) throw new JellyConformanceError('Invalid streamType or rdfVersion');
    this.lookup = normalizeColumnLookupPreset(options.lookup);
    if (options.persistentLookups ?? true) this.persistentLookups = [new ColumnLookupEncoder(this.lookup.maxNames), new ColumnLookupEncoder(this.lookup.maxDatatypes)];
    if (this.lookup.maxNames < 128) throw new JellyConformanceError('Jelly 1.2 requires a name lookup size of at least 128');
    this.size = options.messageSize ?? 250;
    if (!Number.isInteger(this.size) || this.size < 1 || this.size > 0x7ffffff) throw new JellyConformanceError('messageSize must be between 1 and 2^27 - 1');
  }
  private assertOpen(): void { if (this.finished) throw new JellyConformanceError('Jelly encoder has already ended'); }
  public addNamespace(name: string, iri: string): void {
    this.assertOpen();
    if (this.options.packMessages && (this.quads.length || this.messageLengths.length)) this.flush();
    this.fit([iri], []);
    this.register([iri], []);
    this.namespaces.push([name, iri]);
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
    // Reused per statement; neither list outlives this call.
    const names = this.rowNames, datatypes = this.rowDatatypes;
    names.length = datatypes.length = 0;
    this.keys(subject, names, datatypes);
    this.keys(predicate, names, datatypes);
    this.keys(object, names, datatypes);
    this.keys(graph, names, datatypes);
    if (this.quads.length >= this.size) this.flush();
    this.fit(names, datatypes);
    this.register(names, datatypes);
    this.quads.push(quad);
  }
  public addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.streamType !== 1) throw new JellyConformanceError('Jelly 1.2 addMessage() requires streamType MESSAGES');
    const hasMetadata = metadata instanceof Map ? metadata.size > 0 : Object.keys(metadata ?? {}).length > 0;
    if (this.options.packMessages && hasMetadata && (this.quads.length || this.messageLengths.length)) this.flush();
    this.inMessage = true;
    try {
      for (const quad of quads) this.addQuad(quad);
      this.messageLengths.push(this.quads.length - this.lastBoundary);
      this.lastBoundary = this.quads.length;
      // Bound runs of empty messages as well as the statement count.
      if (!this.options.packMessages || hasMetadata || this.messageLengths.length >= this.size) this.flush(metadata);
    }
    finally { this.inMessage = false; }
  }
  public addGraph(_graph: RDF.Quad_Graph, _quads: Iterable<RDF.Quad>, _metadata?: MessageMetadata): void {
    throw new JellyUnsupportedFeatureError('Jelly 1.2 has no GRAPHS layout; use QUADS and addMessage()');
  }
  public finish(): readonly RdfStreamFrame[] {
    this.assertOpen();
    if (this.first || this.quads.length || this.namespaces.length || this.messageLengths.length) this.flush();
    this.finished = true;
    return this.frames;
  }
  private fit(names: string[], datatypes: string[]): void {
    if (this.workingSetFits(names, datatypes, this.lookup)) return;
    this.flush();
    if (!this.workingSetFits(names, datatypes, this.lookup)) throw new JellyConformanceError('A single statement does not fit in the configured lookup tables');
  }
  private register(names: string[], datatypes: string[]): void {
    const namesTable = this.tables[0]!, datatypeTable = this.tables[1]!;
    const nameLookup = this.persistentLookups?.[0], datatypeLookup = this.persistentLookups?.[1];
    for (const value of names) if (!namesTable.has(value)) namesTable.set(value, nameLookup ? nameLookup.ensure(value) : namesTable.size + 1);
    for (const value of datatypes) if (!datatypeTable.has(value)) datatypeTable.set(value, datatypeLookup ? datatypeLookup.ensure(value) : datatypeTable.size + 1);
  }
  private flush(metadata?: MessageMetadata): void {
    const columns: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties = {
      rowCount: this.quads.length,
      names: this.persistentLookups ? this.persistentLookups[0].entries : this.tables[0]!.size ? [{ id: 1, values: [...this.tables[0]!.keys()] }] : [],
      datatypes: this.persistentLookups ? this.persistentLookups[1].entries : this.tables[1]!.size ? [{ id: 1, values: [...this.tables[1]!.keys()] }] : [],
      namespaces: this.namespaces.map(([name, iri]) => ({ name, value: { nameId: this.tables[0]!.get(iri)! } })),
      subjects: this.column(this.quads.map(q => q.subject)), predicates: this.column(this.quads.map(q => q.predicate)), objects: this.column(this.quads.map(q => q.object)),
      ...(this.physicalType === 2 ? { graphs: this.column(this.quads.map(q => q.graph)) } : {}),
      messageLengths: this.messageLengths,
    };
    const frame: RdfStreamFrame = { rows: this.first ? [{ case: 'options', value: {
      streamName: this.options.streamName ?? '', physicalType: this.physicalType, generalizedStatements: false, rdfStar: false, logicalType: 0,
      streamType: this.streamType, rdfVersion: this.rdfVersion, maxNameTableSize: this.lookup.maxNames, maxPrefixTableSize: this.lookup.maxPrefixes, maxDatatypeTableSize: this.lookup.maxDatatypes, version: 3,
    } }] : [], columns, metadata: metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata ?? {})) };
    if (this.sink) this.sink(frame); else this.frames.push(frame);
    this.first = false;
    this.quads = []; this.namespaces = [];
    this.messageLengths = [];
    this.lastBoundary = 0;
    for (const table of this.tables) table.clear();
    if (this.persistentLookups) for (const lookup of this.persistentLookups) lookup.endBatch();
  }
}
