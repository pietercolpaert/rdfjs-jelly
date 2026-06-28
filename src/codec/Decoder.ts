import type * as RDF from '@rdfjs/types';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import type { RdfIri, RdfLiteral, RdfQuad, RdfStreamFrame, RdfStreamOptions, RdfTerm, RdfTriple } from '../generated/rdf_pb';
import { MAX_LOOKUP_SIZE, MIN_NAME_LOOKUP_SIZE, RDF_LANG_STRING, XSD_STRING } from '../options';
import { DataFactory } from '../rdfjs/adapter';
import { LogicalStreamType, Message, PhysicalStreamType, type ParserOptions, type StreamOptions } from '../types';
import { LookupDecoder } from './LookupDecoder';

type NamespaceListener = (prefix: string, iri: RDF.NamedNode) => void;
type OptionsListener = (options: StreamOptions) => void;

export interface DecoderEvents {
  namespace?: NamespaceListener;
  options?: OptionsListener;
}

export class Decoder {
  private readonly factory: RDF.DataFactory;
  private readonly strict: boolean;
  private readonly maxSupportedVersion: number;
  private names?: LookupDecoder;
  private prefixes?: LookupDecoder;
  private datatypes?: LookupDecoder;
  private repeated: Array<RDF.Term | undefined> = new Array(4);
  private graph: RDF.Quad_Graph | undefined;
  private sawAnyRow = false;
  private messageCounter = 0;
  private readonly events: DecoderEvents;
  public streamOptions?: StreamOptions;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null) as Record<string, RDF.NamedNode>;

  public constructor(options: ParserOptions = {}, events: DecoderEvents = {}) {
    this.factory = options.factory ?? DataFactory;
    this.strict = options.strict ?? true;
    this.maxSupportedVersion = options.maxSupportedVersion ?? 2;
    this.events = events;
  }

  public decode(frame: RdfStreamFrame): Message {
    const message = new Message(this.messageCounter++, [], frame.metadata);
    for (const row of frame.rows) {
      if (row.case === 'options') { this.ingestOptions(row.value); continue; }
      if (!this.streamOptions) throw new JellyConformanceError('Stream options must occur before all other Jelly rows');
      this.sawAnyRow = true;
      if (row.case === 'name') this.names!.assign(row.value.id, row.value.value);
      else if (row.case === 'prefix') this.prefixes!.assign(row.value.id, row.value.value);
      else if (row.case === 'datatype') this.datatypes!.assign(row.value.id, row.value.value);
      else if (row.case === 'namespace') this.decodeNamespace(row.value.name, row.value.value);
      else if (row.case === 'triple') message.push(this.decodeTriple(row.value));
      else if (row.case === 'quad') message.push(this.decodeQuad(row.value));
      else if (row.case === 'graphStart') this.startGraph(row.value.graph);
      else if (row.case === 'graphEnd') this.endGraph();
      else throw new JellyConformanceError(`Unsupported or empty Jelly row field ${row.fieldNumber}`);
    }
    return message;
  }

  public finish(): void {
    if (!this.streamOptions) throw new JellyConformanceError('No Jelly stream options row was found');
    if (this.graph !== undefined) throw new JellyConformanceError('Jelly graph stream ended before graph_end');
  }

  private ingestOptions(raw: RdfStreamOptions): void {
    if (this.streamOptions) {
      const current = this.streamOptions;
      const identical = current.streamName === raw.streamName && current.physicalType === raw.physicalType &&
        current.logicalType === raw.logicalType && current.generalizedStatements === raw.generalizedStatements &&
        current.rdfStar === raw.rdfStar && current.maxNameTableSize === raw.maxNameTableSize &&
        current.maxPrefixTableSize === raw.maxPrefixTableSize && current.maxDatatypeTableSize === raw.maxDatatypeTableSize &&
        current.version === raw.version;
      if (!identical) throw new JellyConformanceError('Repeated Jelly stream options must be identical');
      return;
    }
    if (this.sawAnyRow) throw new JellyConformanceError('Stream options must occur before all other rows');
    if (raw.version < 1 || raw.version > this.maxSupportedVersion) {
      throw new JellyUnsupportedFeatureError(`Unsupported Jelly protocol version ${raw.version}`);
    }
    if (raw.rdfStar) throw new JellyUnsupportedFeatureError('RDF-star Jelly streams are not supported');
    if (raw.generalizedStatements) throw new JellyUnsupportedFeatureError('Generalized RDF Jelly streams are not supported');
    if (raw.maxNameTableSize < MIN_NAME_LOOKUP_SIZE || raw.maxNameTableSize > MAX_LOOKUP_SIZE) {
      throw new JellyConformanceError(`Invalid name lookup size ${raw.maxNameTableSize}`);
    }
    if (raw.maxPrefixTableSize > MAX_LOOKUP_SIZE || raw.maxDatatypeTableSize > MAX_LOOKUP_SIZE) {
      throw new JellyConformanceError('Jelly lookup size exceeds the supported maximum');
    }
    if (![PhysicalStreamType.TRIPLES, PhysicalStreamType.QUADS, PhysicalStreamType.GRAPHS].includes(raw.physicalType)) {
      throw new JellyConformanceError(`Invalid physical stream type ${raw.physicalType}`);
    }
    this.validateLogicalType(raw.physicalType, raw.logicalType);
    this.streamOptions = {
      streamName: raw.streamName,
      physicalType: raw.physicalType,
      logicalType: raw.logicalType,
      generalizedStatements: raw.generalizedStatements,
      rdfStar: raw.rdfStar,
      maxNameTableSize: raw.maxNameTableSize,
      maxPrefixTableSize: raw.maxPrefixTableSize,
      maxDatatypeTableSize: raw.maxDatatypeTableSize,
      version: raw.version,
    };
    this.names = new LookupDecoder(raw.maxNameTableSize);
    this.prefixes = new LookupDecoder(raw.maxPrefixTableSize);
    this.datatypes = new LookupDecoder(raw.maxDatatypeTableSize);
    this.events.options?.(this.streamOptions);
  }

  private validateLogicalType(physical: number, logical: number): void {
    if (logical === LogicalStreamType.UNSPECIFIED) return;
    const base = logical % 10;
    const tripleOrientedPhysical = physical === PhysicalStreamType.TRIPLES;
    const tripleOrientedLogical = base === LogicalStreamType.FLAT_TRIPLES || base === LogicalStreamType.GRAPHS;
    const valid = tripleOrientedPhysical === tripleOrientedLogical;
    if (!valid && this.strict) throw new JellyConformanceError(`Physical stream type ${physical} is incompatible with logical type ${logical}`);
  }

  private decodeNamespace(name: string, iri: RdfIri): void {
    if (this.streamOptions!.version < 2) throw new JellyConformanceError('Namespace declarations require Jelly protocol version 2');
    const term = this.decodeIri(iri);
    this.namespaces[name] = term;
    this.events.namespace?.(name, term);
  }

  private decodeIri(value: RdfIri): RDF.NamedNode {
    const name = this.names!.name(value.nameId);
    const prefix = this.prefixes!.prefix(value.prefixId);
    return this.factory.namedNode(prefix + name);
  }

  private decodeLiteral(value: RdfLiteral): RDF.Literal {
    if (value.kind?.case === 'langtag') return this.factory.literal(value.lex, value.kind.value);
    if (value.kind?.case === 'datatype') return this.factory.literal(value.lex, this.factory.namedNode(this.datatypes!.datatype(value.kind.value)));
    return this.factory.literal(value.lex, this.factory.namedNode(XSD_STRING));
  }

  private decodeTerm(value: RdfTerm, slot: number, allowDefaultGraph = false): RDF.Term {
    if (value.case === 'triple') throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
    if (value.case === 'iri') return this.decodeIri(value.value);
    if (value.case === 'bnode') return this.factory.blankNode(value.value);
    if (value.case === 'literal') return this.decodeLiteral(value.value);
    if (value.case === 'defaultGraph' && allowDefaultGraph) return this.factory.defaultGraph();
    throw new JellyConformanceError(`Invalid term in Jelly statement slot ${slot}`);
  }

  private statementTerms(value: RdfTriple | RdfQuad): [RDF.Quad_Subject, RDF.Quad_Predicate, RDF.Quad_Object] {
    const encoded = [value.subject, value.predicate, value.object] as const;
    const terms: RDF.Term[] = [];
    for (let slot = 0; slot < 3; slot++) {
      const field = encoded[slot];
      const term = field ? this.decodeTerm(field, slot) : this.repeated[slot];
      if (!term) throw new JellyConformanceError(`First Jelly statement must set slot ${slot}`);
      if (slot === 0 && term.termType !== 'NamedNode' && term.termType !== 'BlankNode') {
        throw new JellyConformanceError('Invalid RDF subject term');
      }
      if (slot === 1 && term.termType !== 'NamedNode') throw new JellyConformanceError('Invalid RDF predicate term');
      if (slot === 2 && !['NamedNode', 'BlankNode', 'Literal'].includes(term.termType)) {
        throw new JellyConformanceError('Invalid RDF object term');
      }
      terms.push(term);
      this.repeated[slot] = term;
    }
    return terms as [RDF.Quad_Subject, RDF.Quad_Predicate, RDF.Quad_Object];
  }

  private decodeTriple(value: RdfTriple): RDF.Quad {
    const physical = this.streamOptions!.physicalType;
    if (physical !== PhysicalStreamType.TRIPLES && physical !== PhysicalStreamType.GRAPHS) {
      throw new JellyConformanceError('Triple row is invalid in this physical stream type');
    }
    const [subject, predicate, object] = this.statementTerms(value);
    if (physical === PhysicalStreamType.GRAPHS && this.graph === undefined) {
      throw new JellyConformanceError('Triple row occurred outside a graph in a GRAPHS stream');
    }
    return this.factory.quad(subject, predicate, object, this.graph ?? this.factory.defaultGraph());
  }

  private decodeQuad(value: RdfQuad): RDF.Quad {
    if (this.streamOptions!.physicalType !== PhysicalStreamType.QUADS) {
      throw new JellyConformanceError('Quad row is invalid in this physical stream type');
    }
    const [subject, predicate, object] = this.statementTerms(value);
    const graph = value.graph ? this.decodeTerm(value.graph, 3, true) : this.repeated[3];
    if (!graph) throw new JellyConformanceError('First Jelly quad must set its graph');
    if (!['NamedNode', 'BlankNode', 'DefaultGraph'].includes(graph.termType)) throw new JellyConformanceError('Invalid RDF graph term');
    this.repeated[3] = graph;
    return this.factory.quad(subject, predicate, object, graph as RDF.Quad_Graph);
  }

  private startGraph(encoded: RdfTerm | undefined): void {
    if (this.streamOptions!.physicalType !== PhysicalStreamType.GRAPHS) throw new JellyConformanceError('graph_start outside a GRAPHS stream');
    if (this.graph !== undefined) throw new JellyConformanceError('Nested graph_start is invalid');
    if (!encoded) throw new JellyConformanceError('graph_start must identify a graph');
    const graph = this.decodeTerm(encoded, 3, true);
    if (!['NamedNode', 'BlankNode', 'DefaultGraph'].includes(graph.termType)) throw new JellyConformanceError('Invalid RDF graph name');
    this.graph = graph as RDF.Quad_Graph;
  }

  private endGraph(): void {
    if (this.streamOptions!.physicalType !== PhysicalStreamType.GRAPHS || this.graph === undefined) {
      throw new JellyConformanceError('graph_end occurred without an open graph');
    }
    this.graph = undefined;
  }
}
