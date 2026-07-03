import * as RDF from '@rdfjs/types';
import { Reader } from 'protobufjs/minimal.js';

declare const MIN_NAME_LOOKUP_SIZE = 8;
declare const MAX_LOOKUP_SIZE = 4096;
declare const XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
declare const RDF_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
interface LookupPreset {
    maxNames: number;
    maxPrefixes: number;
    maxDatatypes: number;
}
declare const DEFAULT_LOOKUP_PRESET: Readonly<LookupPreset>;
declare const SMALL_LOOKUP_PRESET: Readonly<LookupPreset>;
declare function normalizeLookupPreset(value?: Partial<LookupPreset>): LookupPreset;

declare enum PhysicalStreamType {
    UNSPECIFIED = 0,
    TRIPLES = 1,
    QUADS = 2,
    GRAPHS = 3
}
declare enum LogicalStreamType {
    UNSPECIFIED = 0,
    FLAT_TRIPLES = 1,
    FLAT_QUADS = 2,
    GRAPHS = 3,
    DATASETS = 4,
    SUBJECT_GRAPHS = 13,
    NAMED_GRAPHS = 14,
    TIMESTAMPED_NAMED_GRAPHS = 114
}
type BinaryInput = Uint8Array | ArrayBuffer;
type MessageMetadata = ReadonlyMap<string, Uint8Array> | Record<string, Uint8Array>;
interface MessageQuad {
    quad: RDF.Quad;
    messageCounter: number;
}
interface MessageQuadArray extends Array<MessageQuad> {
    messageCount: number;
}
declare class Message extends Array<RDF.Quad> {
    readonly messageCounter: number;
    static get [Symbol.species](): ArrayConstructor;
    readonly metadata: ReadonlyMap<string, Uint8Array>;
    constructor(messageCounter: number, quads?: Iterable<RDF.Quad>, metadata?: MessageMetadata);
}
interface StreamOptions {
    streamName: string;
    physicalType: PhysicalStreamType;
    logicalType: LogicalStreamType;
    generalizedStatements: boolean;
    rdfStar: boolean;
    maxNameTableSize: number;
    maxPrefixTableSize: number;
    maxDatatypeTableSize: number;
    version: number;
}
interface ParserOptions {
    factory?: RDF.DataFactory;
    delimited?: boolean | 'auto';
    strict?: boolean;
    maxSupportedVersion?: 1 | 2;
    messages?: boolean;
    rdfMessages?: boolean;
    maxMessageSize?: number;
}
interface WriterOptions {
    physicalType?: PhysicalStreamType;
    logicalType?: LogicalStreamType;
    delimited?: boolean;
    messageSize?: number;
    streamName?: string;
    namespaces?: Record<string, string | RDF.NamedNode>;
    lookup?: Partial<LookupPreset>;
    version?: 2;
}
interface BinaryOutput {
    write(chunk: Uint8Array, callback?: (error?: Error | null) => void): unknown;
    end(callback?: (error?: Error | null) => void): unknown;
}
type ParserOutput = RDF.Quad[] | MessageQuadArray;
type ParserOutputItem = RDF.Quad | MessageQuad;
type ParseCallback = (error: Error | null, quad?: RDF.Quad | null, namespaces?: Record<string, RDF.NamedNode>, messageCounter?: number) => void;
type WriterEndCallback = (error: Error | null, output?: Uint8Array) => void;
declare function isMessageQuad(value: unknown): value is MessageQuad;
declare function toMessages(output: Iterable<ParserOutputItem>, messageCount?: number): Message[];

declare class Parser {
    readonly options: ParserOptions;
    _factory: RDF.DataFactory;
    constructor(options?: ParserOptions);
    parse(input: BinaryInput, callback?: ParseCallback): ParserOutput | undefined;
    parseMessages(input: BinaryInput): Message[];
    private decode;
    private decodeQuads;
    private flattenQuads;
    private flattenMessageQuads;
}

declare class Writer {
    private readonly encoder;
    private readonly messageEncoder;
    private readonly output?;
    private pendingCounter;
    private pendingQuads;
    private lastCompletedCounter;
    private mode;
    private ended;
    constructor(options?: WriterOptions);
    constructor(output: BinaryOutput, options?: WriterOptions);
    addQuad(value: RDF.Quad | MessageQuad, done?: (error?: Error | null) => void): void;
    addQuads(values: Iterable<RDF.Quad | MessageQuad>): void;
    addNamespace(prefix: string, iri: string | RDF.NamedNode): void;
    addMessage(message: Iterable<RDF.Quad> | Message, metadata?: MessageMetadata): void;
    addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void;
    end(done?: WriterEndCallback): void;
    private addMessageQuad;
    private flushPending;
    private requireMode;
}

interface RdfIri {
    prefixId: number;
    nameId: number;
}
interface RdfLiteral {
    lex: string;
    kind?: {
        case: 'langtag';
        value: string;
    } | {
        case: 'datatype';
        value: number;
    };
}
type RdfTerm = {
    case: 'iri';
    value: RdfIri;
} | {
    case: 'bnode';
    value: string;
} | {
    case: 'literal';
    value: RdfLiteral;
} | {
    case: 'defaultGraph';
    value: Record<string, never>;
} | {
    case: 'triple';
    value: RdfTriple;
};
interface RdfTriple {
    subject?: RdfTerm;
    predicate?: RdfTerm;
    object?: RdfTerm;
}
interface RdfQuad extends RdfTriple {
    graph?: RdfTerm;
}
interface RdfGraphStart {
    graph?: RdfTerm;
}
interface RdfStreamOptions {
    streamName: string;
    physicalType: number;
    generalizedStatements: boolean;
    rdfStar: boolean;
    maxNameTableSize: number;
    maxPrefixTableSize: number;
    maxDatatypeTableSize: number;
    logicalType: number;
    version: number;
}
type RdfStreamRow = {
    case: 'options';
    value: RdfStreamOptions;
} | {
    case: 'triple';
    value: RdfTriple;
} | {
    case: 'quad';
    value: RdfQuad;
} | {
    case: 'graphStart';
    value: RdfGraphStart;
} | {
    case: 'graphEnd';
    value: Record<string, never>;
} | {
    case: 'namespace';
    value: {
        name: string;
        value: RdfIri;
    };
} | {
    case: 'name';
    value: {
        id: number;
        value: string;
    };
} | {
    case: 'prefix';
    value: {
        id: number;
        value: string;
    };
} | {
    case: 'datatype';
    value: {
        id: number;
        value: string;
    };
} | {
    case: 'unknown';
    fieldNumber: number;
};
interface RdfStreamFrame {
    rows: RdfStreamRow[];
    metadata: Map<string, Uint8Array>;
}

type NamespaceListener = (prefix: string, iri: RDF.NamedNode) => void;
type OptionsListener = (options: StreamOptions) => void;
interface DecoderEvents {
    namespace?: NamespaceListener;
    options?: OptionsListener;
}
declare class Decoder {
    private readonly factory;
    private readonly strict;
    private readonly maxSupportedVersion;
    private names?;
    private prefixes?;
    private datatypes?;
    private repeated;
    private graph;
    private sawAnyRow;
    private messageCounter;
    private readonly events;
    private readonly defaultGraph;
    private readonly datatypeNodes;
    private xsdString?;
    streamOptions?: StreamOptions;
    readonly namespaces: Record<string, RDF.NamedNode>;
    constructor(options?: ParserOptions, events?: DecoderEvents);
    decode(frame: RdfStreamFrame): Message;
    decodeProto(frame: unknown): Message;
    decodeProtoPayload(rawReader: unknown, length: number): Message;
    decodeProtoPayloadTo(rawReader: unknown, length: number, output: RDF.Quad[]): void;
    private consumeProtoRow;
    private emitQuad;
    private decodeWireLookupEntry;
    private decodeWireTriple;
    private decodeWireTerm;
    private decodeWireIri;
    private decodeWireLiteral;
    finish(): void;
    private ingestOptions;
    private validateLogicalType;
    private decodeNamespace;
    private decodeIri;
    private datatypeNode;
    private decodeLiteral;
    private decodeTerm;
    private statementTerms;
    private decodeTriple;
    private decodeQuad;
    private decodeProtoNamespace;
    private decodeProtoIri;
    private decodeProtoLiteral;
    private protoStatementTerms;
    private decodeProtoTriple;
    private decodeProtoGraphTerm;
    private decodeProtoQuad;
    private startProtoGraph;
    private startGraph;
    private endGraph;
}

declare class Encoder {
    readonly physicalType: PhysicalStreamType;
    readonly logicalType: LogicalStreamType;
    readonly lookup: LookupPreset;
    readonly messageSize: number;
    readonly frames: RdfStreamFrame[];
    private readonly names;
    private readonly prefixes;
    private readonly datatypes;
    private readonly repeated;
    private rows;
    private readonly scratchRows;
    private hasStatements;
    private finished;
    constructor(options?: WriterOptions);
    private validateLogicalType;
    addNamespace(name: string, iri: string): void;
    addQuad(quad: RDF.Quad): void;
    addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void;
    addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void;
    finish(): readonly RdfStreamFrame[];
    private appendRows;
    private flush;
    private encodeIri;
    private encodeLiteral;
    private encodeTerm;
    private encodeSpo;
    private encodeTriple;
    private encodeQuad;
    private assertOpen;
}

declare class LookupDecoder {
    readonly size: number;
    private readonly data;
    private lastAssignedIndex;
    private lastReusedIndex;
    constructor(size: number);
    assign(index: number, value: string): void;
    private at;
    prefix(index: number): string;
    name(index: number): string;
    datatype(index: number): string;
}

interface EncodedLookupEntry {
    id: number;
    value: string;
}
declare class LookupEncoder {
    readonly size: number;
    private readonly data;
    private readonly values;
    private readonly older;
    private readonly newer;
    private count;
    private oldestIndex;
    private newestIndex;
    private lastAssignedIndex;
    private lastEnsuredIndex;
    private lastReusedIndex;
    constructor(size: number);
    ensure(value: string): EncodedLookupEntry | undefined;
    ensureId(value: string): number;
    private touch;
    private unlink;
    private append;
    private use;
    prefix(value: string): number;
    name(value: string): number;
    datatype(value: string): number;
    ensuredPrefix(): number;
    ensuredName(): number;
    ensuredDatatype(): number;
}

declare function delimitedJellyHint(input: Uint8Array): boolean;
type FrameDecoder<Frame> = (input: Uint8Array) => Frame;
type ReaderFrameDecoder<Frame> = (reader: Reader, length: number) => Frame;
type FrameConsumer<Frame> = (frame: Frame) => void;
declare class FramedMessageDecoder<Frame> {
    private readonly decodeFrame;
    private readonly decodeReader?;
    private buffer;
    private delimited;
    private readonly mode;
    private readonly maxMessageSize;
    constructor(options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>, decodeFrame: FrameDecoder<Frame>, decodeReader?: ReaderFrameDecoder<Frame> | undefined);
    write(chunk: BinaryInput): Frame[];
    end(chunk?: BinaryInput): Frame[];
    decode(input: BinaryInput): Frame[];
    writeEach(chunk: BinaryInput, consume: FrameConsumer<Frame>): void;
    endEach(consume: FrameConsumer<Frame>, chunk?: BinaryInput): void;
    decodeEach(input: BinaryInput, consume: FrameConsumer<Frame>): void;
    private readDelimited;
}
declare class MessageDecoder extends FramedMessageDecoder<RdfStreamFrame> {
    constructor(options?: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>);
}

declare class MessageEncoder {
    readonly delimited: boolean;
    constructor(delimited?: boolean);
    encode(frame: RdfStreamFrame): Uint8Array;
    encodeAll(frames: readonly RdfStreamFrame[]): Uint8Array;
}

declare class JellyError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
declare class JellyConformanceError extends JellyError {
}
declare class JellyUnsupportedFeatureError extends JellyError {
}

declare class NamedNode<Iri extends string = string> implements RDF.NamedNode<Iri> {
    readonly value: Iri;
    readonly termType: "NamedNode";
    constructor(value: Iri);
    equals(other: RDF.Term | null | undefined): boolean;
}
declare class BlankNode implements RDF.BlankNode {
    readonly value: string;
    readonly termType: "BlankNode";
    constructor(value: string);
    equals(other: RDF.Term | null | undefined): boolean;
}
declare class Variable implements RDF.Variable {
    readonly value: string;
    readonly termType: "Variable";
    constructor(value: string);
    equals(other: RDF.Term | null | undefined): boolean;
}
declare class DefaultGraph implements RDF.DefaultGraph {
    readonly termType: "DefaultGraph";
    readonly value: "";
    equals(other: RDF.Term | null | undefined): boolean;
}
declare class Literal implements RDF.Literal {
    readonly value: string;
    readonly language: string;
    readonly datatype: RDF.NamedNode;
    readonly direction?: "ltr" | "rtl" | "" | null | undefined;
    readonly termType: "Literal";
    constructor(value: string, language?: string, datatype?: RDF.NamedNode, direction?: "ltr" | "rtl" | "" | null | undefined);
    equals(other: RDF.Term | null | undefined): boolean;
}
declare class Quad implements RDF.Quad {
    readonly subject: RDF.Quad_Subject;
    readonly predicate: RDF.Quad_Predicate;
    readonly object: RDF.Quad_Object;
    readonly graph: RDF.Quad_Graph;
    readonly termType: "Quad";
    readonly value: "";
    constructor(subject: RDF.Quad_Subject, predicate: RDF.Quad_Predicate, object: RDF.Quad_Object, graph?: RDF.Quad_Graph);
    equals(other: RDF.Term | null | undefined): boolean;
}
declare const DataFactory: RDF.DataFactory;

type BrowserStreamChunk = Uint8Array | ArrayBuffer;
type BrowserParserEvent = 'options' | 'namespace' | 'message' | 'messageCounter';
type Listener = (...args: any[]) => void;
declare class StreamParser {
    readonly readable: ReadableStream<ParserOutputItem>;
    readonly writable: WritableStream<BrowserStreamChunk>;
    private readonly listeners;
    constructor(options?: ParserOptions);
    import(stream: ReadableStream<BrowserStreamChunk>): ReadableStream<ParserOutputItem>;
    on(event: BrowserParserEvent, listener: Listener): this;
    addEventListener(event: BrowserParserEvent, listener: Listener): this;
    private emit;
}
declare class StreamWriter {
    readonly readable: ReadableStream<Uint8Array>;
    readonly writable: WritableStream<RDF.Quad | MessageQuad>;
    constructor(options?: WriterOptions);
    import(stream: ReadableStream<RDF.Quad | MessageQuad>): ReadableStream<Uint8Array>;
}

export { type BinaryInput, type BinaryOutput, BlankNode, type BrowserStreamChunk, DEFAULT_LOOKUP_PRESET, DataFactory, Decoder, DefaultGraph, Encoder, JellyConformanceError, JellyError, JellyUnsupportedFeatureError, Literal, LogicalStreamType, LookupDecoder, LookupEncoder, type LookupPreset, MAX_LOOKUP_SIZE, MIN_NAME_LOOKUP_SIZE, Message, MessageDecoder, MessageEncoder, type MessageMetadata, type MessageQuad, type MessageQuadArray, NamedNode, type ParseCallback, Parser, type ParserOptions, type ParserOutput, type ParserOutputItem, PhysicalStreamType, Quad, RDF_LANG_STRING, SMALL_LOOKUP_PRESET, type StreamOptions, StreamParser, StreamWriter, Variable, Writer, type WriterEndCallback, type WriterOptions, XSD_STRING, delimitedJellyHint, isMessageQuad, normalizeLookupPreset, toMessages };
