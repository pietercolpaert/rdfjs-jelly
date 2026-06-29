import type * as RDF from '@rdfjs/types';
import type { Reader } from 'protobufjs/minimal.js';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { ProtoRowKind, decodeProtoRdfStreamFrameRows, decodeProtoTripleWire } from '../generated/rdf_pb';
import type {
  ProtoFrame,
  ProtoGraphStart,
  ProtoIri,
  ProtoLiteral,
  ProtoOneofMarkers,
  ProtoQuad,
  ProtoRow,
  ProtoStreamOptions,
  ProtoTriple,
  RdfIri,
  RdfLiteral,
  RdfQuad,
  RdfStreamFrame,
  RdfStreamOptions,
  RdfTerm,
  RdfTriple,
} from '../generated/rdf_pb';
import { MAX_LOOKUP_SIZE, MIN_NAME_LOOKUP_SIZE, RDF_LANG_STRING, XSD_STRING } from '../options';
import { DataFactory } from '../rdfjs/adapter';
import { LogicalStreamType, Message, PhysicalStreamType, type ParserOptions, type StreamOptions } from '../types';
import { LookupDecoder } from './LookupDecoder';

type NamespaceListener = (prefix: string, iri: RDF.NamedNode) => void;
type OptionsListener = (options: StreamOptions) => void;
const EMPTY_METADATA: ReadonlyMap<string, Uint8Array> = new Map();

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
  private readonly defaultGraph: RDF.DefaultGraph;
  private readonly datatypeNodes: Array<RDF.NamedNode | undefined> = [];
  private xsdString?: RDF.NamedNode;
  public streamOptions?: StreamOptions;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null) as Record<string, RDF.NamedNode>;

  public constructor(options: ParserOptions = {}, events: DecoderEvents = {}) {
    this.factory = options.factory ?? DataFactory;
    this.strict = options.strict ?? true;
    this.maxSupportedVersion = options.maxSupportedVersion ?? 2;
    this.events = events;
    this.defaultGraph = this.factory.defaultGraph();
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

  public decodeProto(frame: unknown): Message {
    const protoFrame = frame as ProtoFrame;
    let metadata: Map<string, Uint8Array> | undefined;
    for (const key in protoFrame.metadata) {
      if (Object.hasOwn(protoFrame.metadata, key)) (metadata ??= new Map()).set(key, protoFrame.metadata[key]!);
    }
    const message = new Message(this.messageCounter++, [], metadata ?? EMPTY_METADATA);
    for (const rawRow of protoFrame.rows) {
      const row = rawRow as ProtoRow & ProtoOneofMarkers;
      const field = row.$row ?? row.row;
      if (field === 'options') { this.ingestOptions(row.options as ProtoStreamOptions); continue; }
      if (!this.streamOptions) throw new JellyConformanceError('Stream options must occur before all other Jelly rows');
      this.sawAnyRow = true;
      if (field === 'name') this.names!.assign(row.name!.id ?? 0, row.name!.value ?? '');
      else if (field === 'prefix') this.prefixes!.assign(row.prefix!.id ?? 0, row.prefix!.value ?? '');
      else if (field === 'datatype') this.datatypes!.assign(row.datatype!.id ?? 0, row.datatype!.value ?? '');
      else if (field === 'namespace') {
        const value = row.namespace!;
        this.decodeProtoNamespace(value.name ?? '', value.value as ProtoIri);
      } else if (field === 'triple') message.push(this.decodeProtoTriple(row.triple as ProtoTriple));
      else if (field === 'quad') message.push(this.decodeProtoQuad(row.quad as ProtoQuad));
      else if (field === 'graphStart') this.startProtoGraph(row.graphStart as ProtoGraphStart);
      else if (field === 'graphEnd') this.endGraph();
      else throw new JellyConformanceError('Unsupported or empty Jelly row field 0');
    }
    return message;
  }

  public decodeProtoPayload(rawReader: unknown, length: number): Message {
    const metadata = new Map<string, Uint8Array>();
    const message = new Message(this.messageCounter++, [], metadata);
    decodeProtoRdfStreamFrameRows(
      rawReader as Reader,
      length,
      (kind, value, wireReader, wireLength) => this.consumeProtoRow(
        kind, value, message, undefined, wireReader, wireLength,
      ),
      metadata,
    );
    return message;
  }

  public decodeProtoPayloadTo(rawReader: unknown, length: number, output: RDF.Quad[]): void {
    this.messageCounter++;
    decodeProtoRdfStreamFrameRows(
      rawReader as Reader,
      length,
      (kind, value, wireReader, wireLength) => this.consumeProtoRow(
        kind, value, undefined, output, wireReader, wireLength,
      ),
      new Map(),
    );
  }

  private consumeProtoRow(
    kind: ProtoRowKind,
    value: unknown,
    message?: Message,
    output?: RDF.Quad[],
    wireReader?: Reader,
    wireLength?: number,
  ): void {
    if (kind === ProtoRowKind.OPTIONS) { this.ingestOptions(value as ProtoStreamOptions); return; }
    if (!this.streamOptions) throw new JellyConformanceError('Stream options must occur before all other Jelly rows');
    this.sawAnyRow = true;
    if (wireReader && wireLength !== undefined) {
      try {
        if (kind === ProtoRowKind.TRIPLE) {
          this.emitQuad(this.decodeWireTriple(wireReader, wireLength), message, output);
          return;
        }
        if (kind === ProtoRowKind.NAME) this.decodeWireLookupEntry(wireReader, wireLength, this.names!);
        else if (kind === ProtoRowKind.PREFIX) this.decodeWireLookupEntry(wireReader, wireLength, this.prefixes!);
        else this.decodeWireLookupEntry(wireReader, wireLength, this.datatypes!);
        return;
      } catch (error) {
        if (error instanceof JellyConformanceError || error instanceof JellyUnsupportedFeatureError) throw error;
        throw new JellyConformanceError('Invalid Jelly protobuf row', {
          cause: error instanceof Error ? error : undefined,
        });
      }
    }
    if (kind === ProtoRowKind.NAME) {
      const entry = value as { id: number; value: string };
      this.names!.assign(entry.id, entry.value);
    } else if (kind === ProtoRowKind.PREFIX) {
      const entry = value as { id: number; value: string };
      this.prefixes!.assign(entry.id, entry.value);
    } else if (kind === ProtoRowKind.DATATYPE) {
      const entry = value as { id: number; value: string };
      this.datatypes!.assign(entry.id, entry.value);
    } else if (kind === ProtoRowKind.NAMESPACE) {
      const declaration = value as { name: string; value: ProtoIri };
      this.decodeProtoNamespace(declaration.name, declaration.value);
    } else if (kind === ProtoRowKind.TRIPLE) this.emitQuad(this.decodeProtoTriple(value as ProtoTriple), message, output);
    else if (kind === ProtoRowKind.QUAD) this.emitQuad(this.decodeProtoQuad(value as ProtoQuad), message, output);
    else if (kind === ProtoRowKind.GRAPH_START) this.startProtoGraph(value as ProtoGraphStart);
    else if (kind === ProtoRowKind.GRAPH_END) this.endGraph();
    else throw new JellyConformanceError('Unsupported or empty Jelly row field 0');
  }

  private emitQuad(quad: RDF.Quad, message?: Message, output?: RDF.Quad[]): void {
    if (message) message.push(quad);
    else output!.push(quad);
  }

  private decodeWireLookupEntry(reader: Reader, length: number, lookup: LookupDecoder): void {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError('Truncated Jelly lookup entry');
    let id = 0;
    let value = '';
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 0) id = reader.uint32();
      else if (field === 2 && wireType === 2) value = reader.string();
      else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError('Invalid Jelly lookup entry length');
    lookup.assign(id, value);
  }

  private decodeWireTriple(reader: Reader, length: number): RDF.Quad {
    const physical = this.streamOptions!.physicalType;
    if (physical !== PhysicalStreamType.TRIPLES && physical !== PhysicalStreamType.GRAPHS) {
      throw new JellyConformanceError('Triple row is invalid in this physical stream type');
    }

    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError('Truncated Jelly triple');
    let subjectField = 0;
    let subjectPosition = 0;
    let predicateField = 0;
    let predicatePosition = 0;
    let objectField = 0;
    let objectPosition = 0;
    let duplicateField = false;
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field >= 1 && field <= 12 && wireType === 2) {
        const position = reader.pos;
        const termLength = reader.uint32();
        reader.pos += termLength;
        if (reader.pos > end) throw new RangeError('Invalid Jelly triple term length');
        if (field <= 4) {
          duplicateField ||= subjectField === field;
          subjectField = field;
          subjectPosition = position;
        } else if (field <= 8) {
          duplicateField ||= predicateField === field;
          predicateField = field;
          predicatePosition = position;
        } else {
          duplicateField ||= objectField === field;
          objectField = field;
          objectPosition = position;
        }
      } else {
        reader.skipType(wireType);
        if (reader.pos > end) throw new RangeError('Invalid Jelly triple field length');
      }
    }
    if (reader.pos !== end) throw new RangeError('Invalid Jelly triple length');
    if (duplicateField) {
      reader.pos = end - length;
      return this.decodeProtoTriple(decodeProtoTripleWire(reader, length));
    }

    const subject = subjectField
      ? this.decodeWireTerm(reader, subjectField, subjectPosition)
      : this.repeated[0];
    if (!subject) throw new JellyConformanceError('First Jelly statement must set slot 0');
    if (subject.termType !== 'NamedNode' && subject.termType !== 'BlankNode') {
      throw new JellyConformanceError('Invalid RDF subject term');
    }
    const predicate = predicateField
      ? this.decodeWireTerm(reader, predicateField, predicatePosition)
      : this.repeated[1];
    if (!predicate) throw new JellyConformanceError('First Jelly statement must set slot 1');
    if (predicate.termType !== 'NamedNode') throw new JellyConformanceError('Invalid RDF predicate term');
    const object = objectField
      ? this.decodeWireTerm(reader, objectField, objectPosition)
      : this.repeated[2];
    if (!object) throw new JellyConformanceError('First Jelly statement must set slot 2');
    if (object.termType !== 'NamedNode' && object.termType !== 'BlankNode' && object.termType !== 'Literal') {
      throw new JellyConformanceError('Invalid RDF object term');
    }

    reader.pos = end;
    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    if (physical === PhysicalStreamType.GRAPHS && this.graph === undefined) {
      throw new JellyConformanceError('Triple row occurred outside a graph in a GRAPHS stream');
    }
    return this.factory.quad(subject, predicate, object, this.graph ?? this.defaultGraph);
  }

  private decodeWireTerm(reader: Reader, field: number, position: number): RDF.Term {
    const kind = (field - 1) & 3;
    reader.pos = position;
    if (kind === 0) return this.decodeWireIri(reader, reader.uint32());
    if (kind === 1) return this.factory.blankNode(reader.string());
    if (kind === 2) return this.decodeWireLiteral(reader, reader.uint32());
    throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
  }

  private decodeWireIri(reader: Reader, length: number): RDF.NamedNode {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError('Truncated Jelly IRI');
    let prefixId = 0;
    let nameId = 0;
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 0) prefixId = reader.uint32();
      else if (field === 2 && wireType === 0) nameId = reader.uint32();
      else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError('Invalid Jelly IRI length');
    return this.factory.namedNode(this.prefixes!.prefix(prefixId) + this.names!.name(nameId));
  }

  private decodeWireLiteral(reader: Reader, length: number): RDF.Literal {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError('Truncated Jelly literal');
    let lex = '';
    let kind = 0;
    let langtag = '';
    let datatype = 0;
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 2) lex = reader.string();
      else if (field === 2 && wireType === 2) { langtag = reader.string(); kind = 2; }
      else if (field === 3 && wireType === 0) { datatype = reader.uint32(); kind = 3; }
      else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError('Invalid Jelly literal length');
    if (kind === 2) return this.factory.literal(lex, langtag);
    if (kind === 3) return this.factory.literal(lex, this.datatypeNode(datatype));
    return this.factory.literal(lex, this.xsdString ??= this.factory.namedNode(XSD_STRING));
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

  private datatypeNode(index: number): RDF.NamedNode {
    const value = this.datatypes!.datatype(index);
    const cached = this.datatypeNodes[index];
    if (cached?.value === value) return cached;
    const term = this.factory.namedNode(value);
    this.datatypeNodes[index] = term;
    return term;
  }

  private decodeLiteral(value: RdfLiteral): RDF.Literal {
    if (value.kind?.case === 'langtag') return this.factory.literal(value.lex, value.kind.value);
    if (value.kind?.case === 'datatype') return this.factory.literal(value.lex, this.datatypeNode(value.kind.value));
    return this.factory.literal(value.lex, this.xsdString ??= this.factory.namedNode(XSD_STRING));
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
    const subject = value.subject ? this.decodeTerm(value.subject, 0) : this.repeated[0];
    if (!subject) throw new JellyConformanceError('First Jelly statement must set slot 0');
    if (subject.termType !== 'NamedNode' && subject.termType !== 'BlankNode') throw new JellyConformanceError('Invalid RDF subject term');
    const predicate = value.predicate ? this.decodeTerm(value.predicate, 1) : this.repeated[1];
    if (!predicate) throw new JellyConformanceError('First Jelly statement must set slot 1');
    if (predicate.termType !== 'NamedNode') throw new JellyConformanceError('Invalid RDF predicate term');
    const object = value.object ? this.decodeTerm(value.object, 2) : this.repeated[2];
    if (!object) throw new JellyConformanceError('First Jelly statement must set slot 2');
    if (object.termType !== 'NamedNode' && object.termType !== 'BlankNode' && object.termType !== 'Literal') {
      throw new JellyConformanceError('Invalid RDF object term');
    }
    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    return [subject, predicate, object];
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
    return this.factory.quad(subject, predicate, object, this.graph ?? this.defaultGraph);
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

  private decodeProtoNamespace(name: string, iri: ProtoIri): void {
    if (this.streamOptions!.version < 2) throw new JellyConformanceError('Namespace declarations require Jelly protocol version 2');
    const term = this.decodeProtoIri(iri);
    this.namespaces[name] = term;
    this.events.namespace?.(name, term);
  }

  private decodeProtoIri(value: ProtoIri): RDF.NamedNode {
    return this.factory.namedNode(this.prefixes!.prefix(value.prefixId) + this.names!.name(value.nameId));
  }

  private decodeProtoLiteral(value: ProtoLiteral): RDF.Literal {
    const kind = (value as ProtoLiteral & ProtoOneofMarkers).$literalKind ?? value.literalKind;
    if (kind === 'langtag') return this.factory.literal(value.lex, value.langtag!);
    if (kind === 'datatype') return this.factory.literal(value.lex, this.datatypeNode(value.datatype!));
    return this.factory.literal(value.lex, this.xsdString ??= this.factory.namedNode(XSD_STRING));
  }

  private protoStatementTerms(value: ProtoTriple): [RDF.Quad_Subject, RDF.Quad_Predicate, RDF.Quad_Object] {
    const marked = value as ProtoTriple & ProtoOneofMarkers;
    let subject: RDF.Term | undefined;
    if (marked.$subject === 'sIri') subject = this.decodeProtoIri(value.sIri as ProtoIri);
    else if (marked.$subject === 'sBnode') subject = this.factory.blankNode(value.sBnode!);
    else if (marked.$subject === 'sLiteral') subject = this.decodeProtoLiteral(value.sLiteral as ProtoLiteral);
    else if (marked.$subject === 'sTripleTerm') throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
    else subject = this.repeated[0];
    if (!subject) throw new JellyConformanceError('First Jelly statement must set slot 0');
    if (subject.termType !== 'NamedNode' && subject.termType !== 'BlankNode') throw new JellyConformanceError('Invalid RDF subject term');

    let predicate: RDF.Term | undefined;
    if (marked.$predicate === 'pIri') predicate = this.decodeProtoIri(value.pIri as ProtoIri);
    else if (marked.$predicate === 'pBnode') predicate = this.factory.blankNode(value.pBnode!);
    else if (marked.$predicate === 'pLiteral') predicate = this.decodeProtoLiteral(value.pLiteral as ProtoLiteral);
    else if (marked.$predicate === 'pTripleTerm') throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
    else predicate = this.repeated[1];
    if (!predicate) throw new JellyConformanceError('First Jelly statement must set slot 1');
    if (predicate.termType !== 'NamedNode') throw new JellyConformanceError('Invalid RDF predicate term');

    let object: RDF.Term | undefined;
    if (marked.$object === 'oIri') object = this.decodeProtoIri(value.oIri as ProtoIri);
    else if (marked.$object === 'oBnode') object = this.factory.blankNode(value.oBnode!);
    else if (marked.$object === 'oLiteral') object = this.decodeProtoLiteral(value.oLiteral as ProtoLiteral);
    else if (marked.$object === 'oTripleTerm') throw new JellyUnsupportedFeatureError('RDF-star quoted triple terms are not supported');
    else object = this.repeated[2];
    if (!object) throw new JellyConformanceError('First Jelly statement must set slot 2');
    if (object.termType !== 'NamedNode' && object.termType !== 'BlankNode' && object.termType !== 'Literal') {
      throw new JellyConformanceError('Invalid RDF object term');
    }

    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    return [subject, predicate, object];
  }

  private decodeProtoTriple(value: ProtoTriple): RDF.Quad {
    const physical = this.streamOptions!.physicalType;
    if (physical !== PhysicalStreamType.TRIPLES && physical !== PhysicalStreamType.GRAPHS) {
      throw new JellyConformanceError('Triple row is invalid in this physical stream type');
    }
    const [subject, predicate, object] = this.protoStatementTerms(value);
    if (physical === PhysicalStreamType.GRAPHS && this.graph === undefined) {
      throw new JellyConformanceError('Triple row occurred outside a graph in a GRAPHS stream');
    }
    return this.factory.quad(subject, predicate, object, this.graph ?? this.defaultGraph);
  }

  private decodeProtoGraphTerm(value: ProtoQuad | ProtoGraphStart): RDF.Term | undefined {
    const kind = (value as (ProtoQuad | ProtoGraphStart) & ProtoOneofMarkers).$graph;
    if (kind === 'gIri') return this.decodeProtoIri(value.gIri as ProtoIri);
    if (kind === 'gBnode') return this.factory.blankNode(value.gBnode!);
    if (kind === 'gLiteral') return this.decodeProtoLiteral(value.gLiteral as ProtoLiteral);
    if (kind === 'gDefaultGraph') return this.defaultGraph;
    return undefined;
  }

  private decodeProtoQuad(value: ProtoQuad): RDF.Quad {
    if (this.streamOptions!.physicalType !== PhysicalStreamType.QUADS) {
      throw new JellyConformanceError('Quad row is invalid in this physical stream type');
    }
    const [subject, predicate, object] = this.protoStatementTerms(value as unknown as ProtoTriple);
    const graph = this.decodeProtoGraphTerm(value) ?? this.repeated[3];
    if (!graph) throw new JellyConformanceError('First Jelly quad must set its graph');
    if (graph.termType !== 'NamedNode' && graph.termType !== 'BlankNode' && graph.termType !== 'DefaultGraph') {
      throw new JellyConformanceError('Invalid RDF graph term');
    }
    this.repeated[3] = graph;
    return this.factory.quad(subject, predicate, object, graph);
  }

  private startProtoGraph(value: ProtoGraphStart): void {
    if (this.streamOptions!.physicalType !== PhysicalStreamType.GRAPHS) throw new JellyConformanceError('graph_start outside a GRAPHS stream');
    if (this.graph !== undefined) throw new JellyConformanceError('Nested graph_start is invalid');
    const graph = this.decodeProtoGraphTerm(value);
    if (!graph) throw new JellyConformanceError('graph_start must identify a graph');
    if (graph.termType !== 'NamedNode' && graph.termType !== 'BlankNode' && graph.termType !== 'DefaultGraph') {
      throw new JellyConformanceError('Invalid RDF graph name');
    }
    this.graph = graph;
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
