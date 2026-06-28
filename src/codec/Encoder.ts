import type * as RDF from '@rdfjs/types';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import type { RdfIri, RdfLiteral, RdfQuad, RdfStreamFrame, RdfStreamRow, RdfTerm, RdfTriple } from '../generated/rdf_pb';
import { XSD_STRING, normalizeLookupPreset, type LookupPreset } from '../options';
import { LogicalStreamType, PhysicalStreamType, type MessageMetadata, type WriterOptions } from '../types';
import { LookupEncoder } from './LookupEncoder';

function splitIri(iri: string): [string, string] {
  for (const separator of ['#', '/']) {
    const index = iri.lastIndexOf(separator);
    if (index >= 0) return [iri.slice(0, index + 1), iri.slice(index + 1)];
  }
  return ['', iri];
}

function metadataMap(metadata: MessageMetadata | undefined): Map<string, Uint8Array> {
  if (!metadata) return new Map();
  return metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata));
}

function sameTerm(left: RDF.Term | undefined, right: RDF.Term): boolean {
  return left?.equals(right) ?? false;
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
    const encoded = this.encodeIri(iri);
    this.appendRows([...encoded.rows, { case: 'namespace', value: { name, value: encoded.value } }], false);
  }

  public addQuad(quad: RDF.Quad): void {
    this.assertOpen();
    if (this.physicalType === PhysicalStreamType.GRAPHS) {
      throw new JellyConformanceError('Use addGraph() when writing a GRAPHS physical stream');
    }
    if (this.physicalType === PhysicalStreamType.TRIPLES && quad.graph.termType !== 'DefaultGraph') {
      throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
    }
    const rows = this.physicalType === PhysicalStreamType.TRIPLES ? this.encodeTriple(quad) : this.encodeQuad(quad);
    this.appendRows(rows, true);
  }

  public addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.hasStatements) this.flush(undefined, true);
    for (const quad of quads) {
      if (this.physicalType === PhysicalStreamType.GRAPHS) throw new JellyConformanceError('Use addGraph() for GRAPHS streams');
      if (this.physicalType === PhysicalStreamType.TRIPLES && quad.graph.termType !== 'DefaultGraph') {
        throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
      }
      this.rows.push(...(this.physicalType === PhysicalStreamType.TRIPLES ? this.encodeTriple(quad) : this.encodeQuad(quad)));
      this.hasStatements = true;
    }
    this.flush(metadata, true);
  }

  public addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.physicalType !== PhysicalStreamType.GRAPHS) throw new JellyConformanceError('addGraph() requires a GRAPHS physical stream');
    if (this.hasStatements) this.flush(undefined, true);
    const encodedGraph = this.encodeTerm(graph, 3, true);
    this.rows.push(...encodedGraph.rows, { case: 'graphStart', value: { graph: encodedGraph.value } });
    for (const quad of quads) {
      if (!quad.graph.equals(graph)) throw new JellyConformanceError('Every quad passed to addGraph() must use the graph argument');
      this.rows.push(...this.encodeTriple(quad));
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
    if (force || this.rows.length > 0) this.frames.push({ rows: this.rows, metadata: metadataMap(metadata) });
    this.rows = [];
    this.hasStatements = false;
  }

  private encodeIri(iri: string): { rows: RdfStreamRow[]; value: RdfIri } {
    let [prefix, name] = splitIri(iri);
    const rows: RdfStreamRow[] = [];
    if (this.lookup.maxPrefixes === 0) { prefix = ''; name = iri; }
    else {
      const entry = this.prefixes.ensure(prefix);
      if (entry) rows.push({ case: 'prefix', value: entry });
    }
    const nameEntry = this.names.ensure(name);
    if (nameEntry) rows.push({ case: 'name', value: nameEntry });
    return { rows, value: { prefixId: this.prefixes.prefix(prefix), nameId: this.names.name(name) } };
  }

  private encodeLiteral(term: RDF.Literal): { rows: RdfStreamRow[]; value: RdfLiteral } {
    if (term.direction) throw new JellyUnsupportedFeatureError('Directional language literals are not supported by Jelly-RDF 1.1');
    if (term.language) return { rows: [], value: { lex: term.value, kind: { case: 'langtag', value: term.language } } };
    if (term.datatype.value === XSD_STRING) return { rows: [], value: { lex: term.value } };
    if (this.lookup.maxDatatypes === 0) throw new JellyConformanceError('Datatype lookup is disabled but a typed literal was provided');
    const entry = this.datatypes.ensure(term.datatype.value);
    return {
      rows: entry ? [{ case: 'datatype', value: entry }] : [],
      value: { lex: term.value, kind: { case: 'datatype', value: this.datatypes.datatype(term.datatype.value) } },
    };
  }

  private encodeTerm(term: RDF.Term, slot: number, graph = false): { rows: RdfStreamRow[]; value: RdfTerm } {
    if (term.termType === 'Quad') throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
    if (term.termType === 'Variable') throw new JellyConformanceError('RDF variables cannot be serialized as RDF statements');
    if (term.termType === 'NamedNode') {
      const encoded = this.encodeIri(term.value);
      return { rows: encoded.rows, value: { case: 'iri', value: encoded.value } };
    }
    if (term.termType === 'BlankNode') return { rows: [], value: { case: 'bnode', value: term.value } };
    if (term.termType === 'Literal' && !graph) {
      const encoded = this.encodeLiteral(term);
      return { rows: encoded.rows, value: { case: 'literal', value: encoded.value } };
    }
    if (term.termType === 'DefaultGraph' && graph) return { rows: [], value: { case: 'defaultGraph', value: {} } };
    throw new JellyConformanceError(`Invalid RDF term ${term.termType} in statement slot ${slot}`);
  }

  private encodeSpo(quad: RDF.Quad, target: RdfTriple | RdfQuad): RdfStreamRow[] {
    const terms = [quad.subject, quad.predicate, quad.object] as const;
    const rows: RdfStreamRow[] = [];
    for (let slot = 0; slot < 3; slot++) {
      const term = terms[slot]!;
      if (sameTerm(this.repeated[slot], term)) continue;
      const encoded = this.encodeTerm(term, slot);
      rows.push(...encoded.rows);
      if (slot === 0) target.subject = encoded.value;
      else if (slot === 1) target.predicate = encoded.value;
      else target.object = encoded.value;
      this.repeated[slot] = term;
    }
    return rows;
  }

  private encodeTriple(quad: RDF.Quad): RdfStreamRow[] {
    const value: RdfTriple = {};
    const rows = this.encodeSpo(quad, value);
    rows.push({ case: 'triple', value });
    return rows;
  }

  private encodeQuad(quad: RDF.Quad): RdfStreamRow[] {
    const value: RdfQuad = {};
    const rows = this.encodeSpo(quad, value);
    if (!sameTerm(this.repeated[3], quad.graph)) {
      const encoded = this.encodeTerm(quad.graph, 3, true);
      rows.push(...encoded.rows);
      value.graph = encoded.value;
      this.repeated[3] = quad.graph;
    }
    rows.push({ case: 'quad', value });
    return rows;
  }

  private assertOpen(): void {
    if (this.finished) throw new JellyConformanceError('Jelly encoder has already ended');
  }
}
