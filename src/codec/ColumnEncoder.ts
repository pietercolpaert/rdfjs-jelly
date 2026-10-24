import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { ColumnTermEncoder } from './ColumnTermEncoder';
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

  public constructor(private readonly options: WriterOptions, private readonly sink?: (frame: RdfStreamFrame) => void) {
    super(options.rdfVersion ?? RdfVersion.RDF_1_2);
    this.physicalType = options.physicalType ?? PhysicalStreamType.QUADS;
    if (this.physicalType !== 1 && this.physicalType !== 2) throw new JellyConformanceError('Jelly 1.2 requires TRIPLES or QUADS; use QUADS for named graphs');
    if (options.logicalType) throw new JellyConformanceError('Jelly 1.2 uses streamType instead of logicalType');
    this.streamType = options.streamType ?? RdfStreamType.FLAT;
    if (![0, 1].includes(this.streamType) || ![0, 1, 2, 3].includes(this.rdfVersion)) throw new JellyConformanceError('Invalid streamType or rdfVersion');
    this.lookup = normalizeColumnLookupPreset(options.lookup);
    if (this.lookup.maxNames < 128) throw new JellyConformanceError('Jelly 1.2 requires a name lookup size of at least 128');
    this.size = options.messageSize ?? 250;
    if (!Number.isInteger(this.size) || this.size < 1 || this.size > 0x7ffffff) throw new JellyConformanceError('messageSize must be between 1 and 2^27 - 1');
  }
  private assertOpen(): void { if (this.finished) throw new JellyConformanceError('Jelly encoder has already ended'); }
  public addNamespace(name: string, iri: string): void {
    this.assertOpen();
    this.fit([iri], []);
    this.tables[0]!.set(iri, this.tables[0]!.get(iri) ?? this.tables[0]!.size + 1);
    this.namespaces.push([name, iri]);
  }
  public addQuad(quad: RDF.Quad): void {
    this.assertOpen();
    if (this.streamType === 1 && !this.inMessage) throw new JellyConformanceError('Use addMessage() or message counters with streamType MESSAGES');
    if (this.physicalType === 1 && quad.graph.termType !== 'DefaultGraph') throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
    if (!['NamedNode', 'BlankNode', 'Literal', 'Quad'].includes(quad.object.termType)) throw new JellyConformanceError('Invalid RDF object');
    if (!['NamedNode', 'BlankNode'].includes(quad.subject.termType) || quad.predicate.termType !== 'NamedNode' || !['DefaultGraph', 'NamedNode', 'BlankNode'].includes(quad.graph.termType)) throw new JellyConformanceError('Invalid RDF statement');
    const names: string[] = [], datatypes: string[] = [];
    for (const term of [quad.subject, quad.predicate, quad.object, quad.graph]) this.keys(term, names, datatypes);
    if (this.quads.length >= this.size) this.flush();
    this.fit(names, datatypes);
    for (const [values, table] of [[names, this.tables[0]!], [datatypes, this.tables[1]!]] as const) for (const value of values) if (!table.has(value)) table.set(value, table.size + 1);
    this.quads.push(quad);
  }
  public addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.streamType !== 1) throw new JellyConformanceError('Jelly 1.2 addMessage() requires streamType MESSAGES');
    this.inMessage = true;
    try { for (const quad of quads) this.addQuad(quad); this.flush(metadata, true); }
    finally { this.inMessage = false; }
  }
  public addGraph(_graph: RDF.Quad_Graph, _quads: Iterable<RDF.Quad>, _metadata?: MessageMetadata): void {
    throw new JellyUnsupportedFeatureError('Jelly 1.2 has no GRAPHS layout; use QUADS and addMessage()');
  }
  public finish(): readonly RdfStreamFrame[] {
    this.assertOpen();
    if (this.first || this.quads.length || this.namespaces.length) this.flush();
    this.finished = true;
    return this.frames;
  }
  private fit(names: string[], datatypes: string[]): void {
    if (this.workingSetFits(names, datatypes, this.lookup)) return;
    this.flush();
    if (!this.workingSetFits(names, datatypes, this.lookup)) throw new JellyConformanceError('A single statement does not fit in the configured lookup tables');
  }
  private flush(metadata?: MessageMetadata, boundary = false): void {
    const columns: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties = {
      rowCount: this.quads.length,
      names: this.tables[0]!.size ? [{ id: 1, values: [...this.tables[0]!.keys()] }] : [],
      datatypes: this.tables[1]!.size ? [{ id: 1, values: [...this.tables[1]!.keys()] }] : [],
      namespaces: this.namespaces.map(([name, iri]) => ({ name, value: { nameId: this.tables[0]!.get(iri)! } })),
      subjects: this.column(this.quads.map(q => q.subject)), predicates: this.column(this.quads.map(q => q.predicate)), objects: this.column(this.quads.map(q => q.object)),
      ...(this.physicalType === 2 ? { graphs: this.column(this.quads.map(q => q.graph)) } : {}),
      messageLengths: boundary ? [this.quads.length] : [],
    };
    const frame: RdfStreamFrame = { rows: this.first ? [{ case: 'options', value: {
      streamName: this.options.streamName ?? '', physicalType: this.physicalType, generalizedStatements: false, rdfStar: false, logicalType: 0,
      streamType: this.streamType, rdfVersion: this.rdfVersion, maxNameTableSize: this.lookup.maxNames, maxPrefixTableSize: this.lookup.maxPrefixes, maxDatatypeTableSize: this.lookup.maxDatatypes, version: 3,
    } }] : [], columns, metadata: metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata ?? {})) };
    if (this.sink) this.sink(frame); else this.frames.push(frame);
    this.first = false;
    this.quads = []; this.namespaces = [];
    for (const table of this.tables) table.clear();
  }
}
