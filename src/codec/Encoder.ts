import type * as RDF from '@rdfjs/types';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import type { RdfIri, RdfLiteral, RdfQuad, RdfStreamFrame, RdfStreamRow, RdfTerm, RdfTriple } from '../generated/rdf_pb';
import { XSD_STRING, normalizeLookupPreset, type LookupPreset } from '../options';
import { LogicalStreamType, PhysicalStreamType, type MessageMetadata, type WriterOptions } from '../types';
import { LookupEncoder } from './LookupEncoder';

function metadataMap(metadata: MessageMetadata | undefined): Map<string, Uint8Array> {
  if (!metadata) return new Map();
  return metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata));
}

function sameTerm(left: RDF.Term | undefined, right: RDF.Term): boolean {
  if (left === right) return true;
  if (!left || left.termType !== right.termType || left.value !== right.value) return false;
  if (left.termType === 'Literal' && right.termType === 'Literal') {
    return left.language === right.language && left.direction === right.direction &&
      left.datatype.value === right.datatype.value;
  }
  return left.termType !== 'Quad';
}

export class Encoder {
  public readonly physicalType: PhysicalStreamType;
  public readonly logicalType: LogicalStreamType;
  public readonly lookup: LookupPreset;
  public readonly messageSize: number;
  public readonly frames: RdfStreamFrame[] = [];
  private readonly names: LookupEncoder;
  private readonly prefixes: LookupEncoder;
  private readonly datatypes: LookupEncoder;
  private readonly repeated: Array<RDF.Term | undefined> = new Array(4);
  private rows: RdfStreamRow[];
  private readonly scratchRows: RdfStreamRow[] = [];
  private hasStatements = false;
  private finished = false;

  public constructor(options: WriterOptions = {}) {
    if (options.version !== undefined && options.version !== 2) {
      throw new JellyUnsupportedFeatureError('Writing is supported only for Jelly protocol version 2');
    }
    this.physicalType = options.physicalType ?? PhysicalStreamType.QUADS;
    if (![PhysicalStreamType.TRIPLES, PhysicalStreamType.QUADS, PhysicalStreamType.GRAPHS].includes(this.physicalType)) {
      throw new JellyConformanceError(`Invalid physical stream type ${this.physicalType}`);
    }
    this.logicalType = options.logicalType ?? (this.physicalType === PhysicalStreamType.TRIPLES
      ? LogicalStreamType.FLAT_TRIPLES
      : LogicalStreamType.FLAT_QUADS);
    this.validateLogicalType();
    this.lookup = normalizeLookupPreset(options.lookup);
    this.messageSize = options.messageSize ?? 250;
    if (!Number.isInteger(this.messageSize) || this.messageSize < 1) throw new JellyConformanceError('messageSize must be a positive integer');
    this.names = new LookupEncoder(this.lookup.maxNames);
    this.prefixes = new LookupEncoder(this.lookup.maxPrefixes);
    this.datatypes = new LookupEncoder(this.lookup.maxDatatypes);
    this.rows = [{
      case: 'options',
      value: {
        streamName: options.streamName ?? '',
        physicalType: this.physicalType,
        generalizedStatements: false,
        rdfStar: false,
        maxNameTableSize: this.lookup.maxNames,
        maxPrefixTableSize: this.lookup.maxPrefixes,
        maxDatatypeTableSize: this.lookup.maxDatatypes,
        logicalType: this.logicalType,
        version: 2,
      },
    }];
  }

  private validateLogicalType(): void {
    const base = this.logicalType % 10;
    const tripleOrientedPhysical = this.physicalType === PhysicalStreamType.TRIPLES;
    const tripleOrientedLogical = base === LogicalStreamType.FLAT_TRIPLES || base === LogicalStreamType.GRAPHS;
    const valid = this.logicalType === LogicalStreamType.UNSPECIFIED || tripleOrientedPhysical === tripleOrientedLogical;
    if (!valid) throw new JellyConformanceError(`Physical stream type ${this.physicalType} is incompatible with logical type ${this.logicalType}`);
  }

  public addNamespace(name: string, iri: string): void {
    this.assertOpen();
    const rows = this.scratchRows;
    rows.length = 0;
    const value = this.encodeIri(iri, rows);
    rows.push({ case: 'namespace', value: { name, value } });
    this.appendRows(rows, false);
    rows.length = 0;
  }

  public addQuad(quad: RDF.Quad): void {
    this.assertOpen();
    if (this.physicalType === PhysicalStreamType.GRAPHS) {
      throw new JellyConformanceError('Use addGraph() when writing a GRAPHS physical stream');
    }
    if (this.physicalType === PhysicalStreamType.TRIPLES && quad.graph.termType !== 'DefaultGraph') {
      throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
    }
    const rows = this.scratchRows;
    rows.length = 0;
    if (this.physicalType === PhysicalStreamType.TRIPLES) this.encodeTriple(quad, rows);
    else this.encodeQuad(quad, rows);
    this.appendRows(rows, true);
    rows.length = 0;
  }

  public addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.hasStatements) this.flush(undefined, true);
    for (const quad of quads) {
      if (this.physicalType === PhysicalStreamType.GRAPHS) throw new JellyConformanceError('Use addGraph() for GRAPHS streams');
      if (this.physicalType === PhysicalStreamType.TRIPLES && quad.graph.termType !== 'DefaultGraph') {
        throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
      }
      if (this.physicalType === PhysicalStreamType.TRIPLES) this.encodeTriple(quad, this.rows);
      else this.encodeQuad(quad, this.rows);
      this.hasStatements = true;
    }
    this.flush(metadata, true);
  }

  public addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.physicalType !== PhysicalStreamType.GRAPHS) throw new JellyConformanceError('addGraph() requires a GRAPHS physical stream');
    if (this.hasStatements) this.flush(undefined, true);
    const encodedGraph = this.encodeTerm(graph, 3, this.rows, true);
    this.rows.push({ case: 'graphStart', value: { graph: encodedGraph } });
    for (const quad of quads) {
      if (!quad.graph.equals(graph)) throw new JellyConformanceError('Every quad passed to addGraph() must use the graph argument');
      this.encodeTriple(quad, this.rows);
      this.hasStatements = true;
    }
    this.rows.push({ case: 'graphEnd', value: {} });
    this.flush(metadata, true);
  }

  public finish(): readonly RdfStreamFrame[] {
    this.assertOpen();
    this.finished = true;
    if (this.rows.length > 0 || this.frames.length === 0) this.flush(undefined, true);
    return this.frames;
  }

  private appendRows(rows: RdfStreamRow[], statement: boolean): void {
    if (statement && this.hasStatements && this.rows.length + rows.length > this.messageSize) this.flush(undefined, true);
    this.rows.push(...rows);
    this.hasStatements ||= statement;
  }

  private flush(metadata?: MessageMetadata, force = false): void {
    if (force || this.rows.length > 0) {
      this.frames.push({ rows: this.rows, metadata: metadataMap(metadata) });
    }
    this.rows = [];
    this.hasStatements = false;
  }

  private encodeIri(iri: string, rows: RdfStreamRow[]): RdfIri {
    const hashIndex = iri.lastIndexOf('#');
    const separatorIndex = hashIndex >= 0 ? hashIndex : iri.lastIndexOf('/');
    let prefix = separatorIndex >= 0 ? iri.slice(0, separatorIndex + 1) : '';
    let name = separatorIndex >= 0 ? iri.slice(separatorIndex + 1) : iri;
    if (this.lookup.maxPrefixes === 0) { prefix = ''; name = iri; }
    else {
      const id = this.prefixes.ensureId(prefix);
      if (id >= 0) rows.push({ case: 'prefix', value: { id, value: prefix } });
    }
    const nameId = this.names.ensureId(name);
    if (nameId >= 0) rows.push({ case: 'name', value: { id: nameId, value: name } });
    return {
      prefixId: this.lookup.maxPrefixes === 0 ? 0 : this.prefixes.ensuredPrefix(),
      nameId: this.names.ensuredName(),
    };
  }

  private encodeLiteral(term: RDF.Literal, rows: RdfStreamRow[]): RdfLiteral {
    if (term.direction) throw new JellyUnsupportedFeatureError('Directional language literals are not supported by Jelly-RDF 1.1');
    if (term.language) return { lex: term.value, kind: { case: 'langtag', value: term.language } };
    if (term.datatype.value === XSD_STRING) return { lex: term.value };
    if (this.lookup.maxDatatypes === 0) throw new JellyConformanceError('Datatype lookup is disabled but a typed literal was provided');
    const id = this.datatypes.ensureId(term.datatype.value);
    if (id >= 0) rows.push({ case: 'datatype', value: { id, value: term.datatype.value } });
    return { lex: term.value, kind: { case: 'datatype', value: this.datatypes.ensuredDatatype() } };
  }

  private encodeTerm(term: RDF.Term, slot: number, rows: RdfStreamRow[], graph = false): RdfTerm {
    if (term.termType === 'Quad') throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
    if (term.termType === 'Variable') throw new JellyConformanceError('RDF variables cannot be serialized as RDF statements');
    if (term.termType === 'NamedNode') {
      return { case: 'iri', value: this.encodeIri(term.value, rows) };
    }
    if (term.termType === 'BlankNode') return { case: 'bnode', value: term.value };
    if (term.termType === 'Literal' && !graph) return { case: 'literal', value: this.encodeLiteral(term, rows) };
    if (term.termType === 'DefaultGraph' && graph) return { case: 'defaultGraph', value: {} };
    throw new JellyConformanceError(`Invalid RDF term ${term.termType} in statement slot ${slot}`);
  }

  private encodeSpo(quad: RDF.Quad, target: RdfTriple | RdfQuad, rows: RdfStreamRow[]): void {
    const subject = quad.subject;
    if (!sameTerm(this.repeated[0], subject)) {
      target.subject = this.encodeTerm(subject, 0, rows);
      this.repeated[0] = subject;
    }
    const predicate = quad.predicate;
    if (!sameTerm(this.repeated[1], predicate)) {
      target.predicate = this.encodeTerm(predicate, 1, rows);
      this.repeated[1] = predicate;
    }
    const object = quad.object;
    if (!sameTerm(this.repeated[2], object)) {
      target.object = this.encodeTerm(object, 2, rows);
      this.repeated[2] = object;
    }
  }

  private encodeTriple(quad: RDF.Quad, rows: RdfStreamRow[]): void {
    const value: RdfTriple = {};
    this.encodeSpo(quad, value, rows);
    rows.push({ case: 'triple', value });
  }

  private encodeQuad(quad: RDF.Quad, rows: RdfStreamRow[]): void {
    const value: RdfQuad = {};
    this.encodeSpo(quad, value, rows);
    if (!sameTerm(this.repeated[3], quad.graph)) {
      value.graph = this.encodeTerm(quad.graph, 3, rows, true);
      this.repeated[3] = quad.graph;
    }
    rows.push({ case: 'quad', value });
  }

  private assertOpen(): void {
    if (this.finished) throw new JellyConformanceError('Jelly encoder has already ended');
  }
}
