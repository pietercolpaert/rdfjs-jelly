import * as RDF from '@rdfjs/types';
import { Reader } from 'protobufjs/minimal.js';
import * as $protobuf from 'protobufjs';

declare const MIN_NAME_LOOKUP_SIZE = 8;
/** Largest lookup table this writer will build. */
declare const MAX_LOOKUP_SIZE = 4096;
declare const XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
declare const RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";
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
declare enum RdfStreamType {
    FLAT = 0,
    MESSAGES = 1
}
declare enum RdfVersion {
    UNSPECIFIED = 0,
    RDF_1_1 = 1,
    RDF_1_2_BASIC = 2,
    RDF_1_2 = 3
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
    streamType?: RdfStreamType;
    rdfVersion?: RdfVersion;
}
interface ParserOptions {
    factory?: RDF.DataFactory;
    delimited?: boolean | 'auto';
    strict?: boolean;
    maxSupportedVersion?: 1 | 2 | 3;
    /** Maximum statements per column batch (default 1,048,576). */
    maxRowsPerBatch?: number;
    messages?: boolean;
    rdfMessages?: boolean;
    maxMessageSize?: number;
    /**
     * Largest lookup table size this parser accepts from a stream's options row.
     * Defaults to `MAX_DECODED_LOOKUP_SIZE`. The specification sets no maximum, so
     * this only guards against a hostile stream declaring an absurd table.
     */
    maxLookupTableSize?: number;
}
interface WriterOptions {
    physicalType?: PhysicalStreamType;
    logicalType?: LogicalStreamType;
    delimited?: boolean;
    /** Row budget for 1.1, statement budget per column batch for 1.2. */
    messageSize?: number;
    streamName?: string;
    namespaces?: Record<string, string | RDF.NamedNode>;
    lookup?: Partial<LookupPreset>;
    /** Protocol tag: 2 = Jelly 1.1 (default), 3 = Jelly 1.2. */
    version?: 2 | 3;
    streamType?: RdfStreamType;
    rdfVersion?: RdfVersion;
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
    private readonly streaming;
    /**
     * Delimited output with no sink is serialised frame by frame as each one
     * completes, so finished rows and terms become garbage immediately instead of
     * being retained until end().
     */
    private readonly chunks?;
    constructor(options?: WriterOptions);
    constructor(output: BinaryOutput, options?: WriterOptions);
    addQuad(value: RDF.Quad | MessageQuad, done?: (error?: Error | null) => void): void;
    addQuads(values: Iterable<RDF.Quad | MessageQuad>): void;
    addNamespace(prefix: string, iri: string | RDF.NamedNode): void;
    addMessage(message: Iterable<RDF.Quad> | Message, metadata?: MessageMetadata): void;
    /** Complete all RDF Messages below messageCount, adding any empty messages. */
    finishMessages(messageCount: number): void;
    addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void;
    end(done?: WriterEndCallback): void;
    private collectChunks;
    private writeFrame;
    private addMessageQuad;
    private flushPending;
    private requireMode;
}

/** Namespace eu. */
declare namespace eu {

    /** Namespace ostrzyciel. */
    namespace ostrzyciel {

        /** Namespace jelly. */
        namespace jelly {

            /** Namespace core. */
            namespace core {

                /** Namespace proto. */
                namespace proto {

                    /** Namespace v1. */
                    namespace v1 {

                        /**
                         * Properties of a RdfIri.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties instead.
                         */
                        interface IRdfIri extends eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties {
                        }

                        /** Represents a RdfIri. */
                        class RdfIri {

                            /**
                             * Constructs a new RdfIri.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfIri prefixId. */
                            prefixId: number;

                            /** RdfIri nameId. */
                            nameId: number;

                            /**
                             * Creates a new RdfIri instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfIri instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfIri;

                            /**
                             * Encodes the specified RdfIri message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfIri.verify|verify} messages.
                             * @param message RdfIri message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfIri message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfIri.verify|verify} messages.
                             * @param message RdfIri message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfIri message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape} RdfIri
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape;

                            /**
                             * Decodes a RdfIri message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape} RdfIri
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape;
                        }

                        namespace RdfIri {

                            /** Properties of a RdfIri. */
                            interface $Properties {

                                /** RdfIri prefixId */
                                prefixId?: (number|null);

                                /** RdfIri nameId */
                                nameId?: (number|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfIri. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties;
                        }

                        /** RdfVersion enum. */
                        enum RdfVersion {

                            /** RDF_VERSION_UNSPECIFIED value */
                            RDF_VERSION_UNSPECIFIED = 0,

                            /** RDF_VERSION_1_1 value */
                            RDF_VERSION_1_1 = 1,

                            /** RDF_VERSION_1_2_BASIC value */
                            RDF_VERSION_1_2_BASIC = 2,

                            /** RDF_VERSION_1_2 value */
                            RDF_VERSION_1_2 = 3
                        }

                        /** RdfBaseDirection enum. */
                        enum RdfBaseDirection {

                            /** RDF_BASE_DIRECTION_UNSPECIFIED value */
                            RDF_BASE_DIRECTION_UNSPECIFIED = 0,

                            /** RDF_BASE_DIRECTION_LTR value */
                            RDF_BASE_DIRECTION_LTR = 1,

                            /** RDF_BASE_DIRECTION_RTL value */
                            RDF_BASE_DIRECTION_RTL = 2
                        }

                        /**
                         * Properties of a RdfLiteral.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties instead.
                         */
                        interface IRdfLiteral extends eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties {
                        }

                        /** Represents a RdfLiteral. */
                        class RdfLiteral {

                            /**
                             * Constructs a new RdfLiteral.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfLiteral lex. */
                            lex: string;

                            /** RdfLiteral langtag. */
                            langtag?: (string|null);

                            /** RdfLiteral datatype. */
                            datatype?: (number|null);

                            /** RdfLiteral direction. */
                            direction: eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection;

                            /** RdfLiteral literalKind. */
                            literalKind?: ("langtag"|"datatype");

                            /**
                             * Creates a new RdfLiteral instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfLiteral instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;

                            /**
                             * Encodes the specified RdfLiteral message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.verify|verify} messages.
                             * @param message RdfLiteral message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfLiteral message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.verify|verify} messages.
                             * @param message RdfLiteral message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfLiteral message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape} RdfLiteral
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape;

                            /**
                             * Decodes a RdfLiteral message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape} RdfLiteral
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape;
                        }

                        namespace RdfLiteral {

                            /** Properties of a RdfLiteral. */
                            interface $Properties {

                                /** RdfLiteral lex */
                                lex?: (string|null);

                                /** RdfLiteral langtag */
                                langtag?: (string|null);

                                /** RdfLiteral datatype */
                                datatype?: (number|null);

                                /** RdfLiteral direction */
                                direction?: (eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection|null);

                                /** RdfLiteral literalKind */
                                literalKind?: ("langtag"|"datatype");

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Narrowed shape of a RdfLiteral. */
                            type $Shape = {
                              lex?: string|null;
                              langtag?: string|null;
                              datatype?: number|null;
                              direction?: eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection|null;
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ literalKind?: undefined; langtag?: null; datatype?: null }|{ literalKind?: "langtag"; langtag: string; datatype?: null }|{ literalKind?: "datatype"; langtag?: null; datatype: number })
                            );
                        }

                        /**
                         * Properties of a RdfTripleTerm.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties instead.
                         */
                        interface IRdfTripleTerm extends eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties {
                        }

                        /** Represents a RdfTripleTerm. */
                        class RdfTripleTerm {

                            /**
                             * Constructs a new RdfTripleTerm.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfTripleTerm sIri. */
                            sIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfTripleTerm sBnode. */
                            sBnode?: (string|null);

                            /** RdfTripleTerm pIri. */
                            pIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfTripleTerm oIri. */
                            oIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfTripleTerm oBnode. */
                            oBnode?: (string|null);

                            /** RdfTripleTerm oLiteral. */
                            oLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfTripleTerm oTripleTerm. */
                            oTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties|null);

                            /** RdfTripleTerm subject. */
                            subject?: ("sIri"|"sBnode");

                            /** RdfTripleTerm object. */
                            object?: ("oIri"|"oBnode"|"oLiteral"|"oTripleTerm");

                            /**
                             * Creates a new RdfTripleTerm instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfTripleTerm instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;

                            /**
                             * Encodes the specified RdfTripleTerm message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.verify|verify} messages.
                             * @param message RdfTripleTerm message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfTripleTerm message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.verify|verify} messages.
                             * @param message RdfTripleTerm message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfTripleTerm message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape} RdfTripleTerm
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape;

                            /**
                             * Decodes a RdfTripleTerm message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape} RdfTripleTerm
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape;
                        }

                        namespace RdfTripleTerm {

                            /** Properties of a RdfTripleTerm. */
                            interface $Properties {

                                /** RdfTripleTerm sIri */
                                sIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfTripleTerm sBnode */
                                sBnode?: (string|null);

                                /** RdfTripleTerm pIri */
                                pIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfTripleTerm oIri */
                                oIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfTripleTerm oBnode */
                                oBnode?: (string|null);

                                /** RdfTripleTerm oLiteral */
                                oLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfTripleTerm oTripleTerm */
                                oTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties|null);

                                /** RdfTripleTerm subject */
                                subject?: ("sIri"|"sBnode");

                                /** RdfTripleTerm object */
                                object?: ("oIri"|"oBnode"|"oLiteral"|"oTripleTerm");

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Narrowed shape of a RdfTripleTerm. */
                            type $Shape = {
                              sIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              sBnode?: string|null;
                              pIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              oIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              oBnode?: string|null;
                              oLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              oTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape|null;
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ subject?: undefined; sIri?: null; sBnode?: null }|{ subject?: "sIri"; sIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; sBnode?: null }|{ subject?: "sBnode"; sIri?: null; sBnode: string })
                            ) & (
                              ({ object?: undefined; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oIri"; oIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oBnode"; oIri?: null; oBnode: string; oLiteral?: null; oTripleTerm?: null }|{ object?: "oLiteral"; oIri?: null; oBnode?: null; oLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; oTripleTerm?: null }|{ object?: "oTripleTerm"; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape })
                            );
                        }

                        /**
                         * Properties of a RdfLookupEntryPacked.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties instead.
                         */
                        interface IRdfLookupEntryPacked extends eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties {
                        }

                        /** Represents a RdfLookupEntryPacked. */
                        class RdfLookupEntryPacked {

                            /**
                             * Constructs a new RdfLookupEntryPacked.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfLookupEntryPacked id. */
                            id: number;

                            /** RdfLookupEntryPacked values. */
                            values: string[];

                            /**
                             * Creates a new RdfLookupEntryPacked instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfLookupEntryPacked instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked;

                            /**
                             * Encodes the specified RdfLookupEntryPacked message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.verify|verify} messages.
                             * @param message RdfLookupEntryPacked message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfLookupEntryPacked message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.verify|verify} messages.
                             * @param message RdfLookupEntryPacked message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfLookupEntryPacked message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape} RdfLookupEntryPacked
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape;

                            /**
                             * Decodes a RdfLookupEntryPacked message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape} RdfLookupEntryPacked
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape;
                        }

                        namespace RdfLookupEntryPacked {

                            /** Properties of a RdfLookupEntryPacked. */
                            interface $Properties {

                                /** RdfLookupEntryPacked id */
                                id?: (number|null);

                                /** RdfLookupEntryPacked values */
                                values?: (string[]|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfLookupEntryPacked. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties;
                        }

                        /**
                         * Properties of a RdfStreamOptions.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties instead.
                         */
                        interface IRdfStreamOptions extends eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties {
                        }

                        /** Represents a RdfStreamOptions. */
                        class RdfStreamOptions {

                            /**
                             * Constructs a new RdfStreamOptions.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfStreamOptions streamName. */
                            streamName: string;

                            /** RdfStreamOptions physicalType. */
                            physicalType: eu.ostrzyciel.jelly.core.proto.v1.PhysicalStreamType;

                            /** RdfStreamOptions generalizedStatements. */
                            generalizedStatements: boolean;

                            /** RdfStreamOptions rdfStar. */
                            rdfStar: boolean;

                            /** RdfStreamOptions streamType. */
                            streamType: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamType;

                            /** RdfStreamOptions rdfVersion. */
                            rdfVersion: eu.ostrzyciel.jelly.core.proto.v1.RdfVersion;

                            /** RdfStreamOptions maxNameTableSize. */
                            maxNameTableSize: number;

                            /** RdfStreamOptions maxPrefixTableSize. */
                            maxPrefixTableSize: number;

                            /** RdfStreamOptions maxDatatypeTableSize. */
                            maxDatatypeTableSize: number;

                            /** RdfStreamOptions logicalType. */
                            logicalType: eu.ostrzyciel.jelly.core.proto.v1.LogicalStreamType;

                            /** RdfStreamOptions version. */
                            version: number;

                            /**
                             * Creates a new RdfStreamOptions instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfStreamOptions instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions;

                            /**
                             * Encodes the specified RdfStreamOptions message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.verify|verify} messages.
                             * @param message RdfStreamOptions message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfStreamOptions message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.verify|verify} messages.
                             * @param message RdfStreamOptions message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfStreamOptions message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape} RdfStreamOptions
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape;

                            /**
                             * Decodes a RdfStreamOptions message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape} RdfStreamOptions
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape;
                        }

                        namespace RdfStreamOptions {

                            /** Properties of a RdfStreamOptions. */
                            interface $Properties {

                                /** RdfStreamOptions streamName */
                                streamName?: (string|null);

                                /** RdfStreamOptions physicalType */
                                physicalType?: (eu.ostrzyciel.jelly.core.proto.v1.PhysicalStreamType|null);

                                /** RdfStreamOptions generalizedStatements */
                                generalizedStatements?: (boolean|null);

                                /** RdfStreamOptions rdfStar */
                                rdfStar?: (boolean|null);

                                /** RdfStreamOptions streamType */
                                streamType?: (eu.ostrzyciel.jelly.core.proto.v1.RdfStreamType|null);

                                /** RdfStreamOptions rdfVersion */
                                rdfVersion?: (eu.ostrzyciel.jelly.core.proto.v1.RdfVersion|null);

                                /** RdfStreamOptions maxNameTableSize */
                                maxNameTableSize?: (number|null);

                                /** RdfStreamOptions maxPrefixTableSize */
                                maxPrefixTableSize?: (number|null);

                                /** RdfStreamOptions maxDatatypeTableSize */
                                maxDatatypeTableSize?: (number|null);

                                /** RdfStreamOptions logicalType */
                                logicalType?: (eu.ostrzyciel.jelly.core.proto.v1.LogicalStreamType|null);

                                /** RdfStreamOptions version */
                                version?: (number|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfStreamOptions. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties;
                        }

                        /** PhysicalStreamType enum. */
                        enum PhysicalStreamType {

                            /** PHYSICAL_STREAM_TYPE_UNSPECIFIED value */
                            PHYSICAL_STREAM_TYPE_UNSPECIFIED = 0,

                            /** PHYSICAL_STREAM_TYPE_TRIPLES value */
                            PHYSICAL_STREAM_TYPE_TRIPLES = 1,

                            /** PHYSICAL_STREAM_TYPE_QUADS value */
                            PHYSICAL_STREAM_TYPE_QUADS = 2,

                            /** PHYSICAL_STREAM_TYPE_GRAPHS value */
                            PHYSICAL_STREAM_TYPE_GRAPHS = 3
                        }

                        /** RdfStreamType enum. */
                        enum RdfStreamType {

                            /** RDF_STREAM_TYPE_FLAT value */
                            RDF_STREAM_TYPE_FLAT = 0,

                            /** RDF_STREAM_TYPE_MESSAGES value */
                            RDF_STREAM_TYPE_MESSAGES = 1
                        }

                        /**
                         * Properties of a RdfStreamFrame.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties instead.
                         */
                        interface IRdfStreamFrame extends eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties {
                        }

                        /** Represents a RdfStreamFrame. */
                        class RdfStreamFrame {

                            /**
                             * Constructs a new RdfStreamFrame.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfStreamFrame rows. */
                            rows: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties[];

                            /** RdfStreamFrame columns. */
                            columns?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties|null);

                            /** RdfStreamFrame metadata. */
                            metadata: { [k: string]: Uint8Array };

                            /**
                             * Creates a new RdfStreamFrame instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfStreamFrame instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;

                            /**
                             * Encodes the specified RdfStreamFrame message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.verify|verify} messages.
                             * @param message RdfStreamFrame message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfStreamFrame message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.verify|verify} messages.
                             * @param message RdfStreamFrame message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfStreamFrame message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape} RdfStreamFrame
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape;

                            /**
                             * Decodes a RdfStreamFrame message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape} RdfStreamFrame
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape;
                        }

                        namespace RdfStreamFrame {

                            /** Properties of a RdfStreamFrame. */
                            interface $Properties {

                                /** RdfStreamFrame rows */
                                rows?: (eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties[]|null);

                                /** RdfStreamFrame columns */
                                columns?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties|null);

                                /** RdfStreamFrame metadata */
                                metadata?: ({ [k: string]: Uint8Array }|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfStreamFrame. */
                            type $Shape = {
                              rows?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape[]|null;
                              columns?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape|null;
                              metadata?: { [k: string]: Uint8Array }|null;
                              $unknowns?: Uint8Array[];
                            };
                        }

                        /**
                         * Properties of a RdfColumnBatch.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties instead.
                         */
                        interface IRdfColumnBatch extends eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties {
                        }

                        /** Represents a RdfColumnBatch. */
                        class RdfColumnBatch {

                            /**
                             * Constructs a new RdfColumnBatch.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfColumnBatch rowCount. */
                            rowCount: number;

                            /** RdfColumnBatch names. */
                            names: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];

                            /** RdfColumnBatch prefixes. */
                            prefixes: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];

                            /** RdfColumnBatch datatypes. */
                            datatypes: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];

                            /** RdfColumnBatch namespaces. */
                            namespaces: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties[];

                            /** RdfColumnBatch subjects. */
                            subjects?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                            /** RdfColumnBatch predicates. */
                            predicates?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                            /** RdfColumnBatch objects. */
                            objects?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                            /** RdfColumnBatch graphs. */
                            graphs?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                            /** RdfColumnBatch messageLengths. */
                            messageLengths: number[];

                            /**
                             * Creates a new RdfColumnBatch instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfColumnBatch instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch;

                            /**
                             * Encodes the specified RdfColumnBatch message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.verify|verify} messages.
                             * @param message RdfColumnBatch message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfColumnBatch message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.verify|verify} messages.
                             * @param message RdfColumnBatch message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfColumnBatch message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape} RdfColumnBatch
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape;

                            /**
                             * Decodes a RdfColumnBatch message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape} RdfColumnBatch
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape;
                        }

                        namespace RdfColumnBatch {

                            /** Properties of a RdfColumnBatch. */
                            interface $Properties {

                                /** RdfColumnBatch rowCount */
                                rowCount?: (number|null);

                                /** RdfColumnBatch names */
                                names?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[]|null);

                                /** RdfColumnBatch prefixes */
                                prefixes?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[]|null);

                                /** RdfColumnBatch datatypes */
                                datatypes?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[]|null);

                                /** RdfColumnBatch namespaces */
                                namespaces?: (eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties[]|null);

                                /** RdfColumnBatch subjects */
                                subjects?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                                /** RdfColumnBatch predicates */
                                predicates?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                                /** RdfColumnBatch objects */
                                objects?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                                /** RdfColumnBatch graphs */
                                graphs?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null);

                                /** RdfColumnBatch messageLengths */
                                messageLengths?: (number[]|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfColumnBatch. */
                            type $Shape = {
                              rowCount?: number|null;
                              names?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape[]|null;
                              prefixes?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape[]|null;
                              datatypes?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape[]|null;
                              namespaces?: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape[]|null;
                              subjects?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                              predicates?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                              objects?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                              graphs?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                              messageLengths?: number[]|null;
                              $unknowns?: Uint8Array[];
                            };
                        }

                        /**
                         * Properties of a RdfNamespaceDeclaration.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties instead.
                         */
                        interface IRdfNamespaceDeclaration extends eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties {
                        }

                        /** Represents a RdfNamespaceDeclaration. */
                        class RdfNamespaceDeclaration {

                            /**
                             * Constructs a new RdfNamespaceDeclaration.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfNamespaceDeclaration name. */
                            name: string;

                            /** RdfNamespaceDeclaration value. */
                            value?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /**
                             * Creates a new RdfNamespaceDeclaration instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfNamespaceDeclaration instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration;

                            /**
                             * Encodes the specified RdfNamespaceDeclaration message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.verify|verify} messages.
                             * @param message RdfNamespaceDeclaration message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfNamespaceDeclaration message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.verify|verify} messages.
                             * @param message RdfNamespaceDeclaration message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfNamespaceDeclaration message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape} RdfNamespaceDeclaration
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape;

                            /**
                             * Decodes a RdfNamespaceDeclaration message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape} RdfNamespaceDeclaration
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape;
                        }

                        namespace RdfNamespaceDeclaration {

                            /** Properties of a RdfNamespaceDeclaration. */
                            interface $Properties {

                                /** RdfNamespaceDeclaration name */
                                name?: (string|null);

                                /** RdfNamespaceDeclaration value */
                                value?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfNamespaceDeclaration. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties;
                        }

                        /**
                         * Properties of a RdfColumn.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties instead.
                         */
                        interface IRdfColumn extends eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties {
                        }

                        /** Represents a RdfColumn. */
                        class RdfColumn {

                            /**
                             * Constructs a new RdfColumn.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfColumn kinds. */
                            kinds: Uint8Array;

                            /** RdfColumn layouts. */
                            layouts: number[];

                            /** RdfColumn nameIds. */
                            nameIds: number[];

                            /** RdfColumn prefixIds. */
                            prefixIds: number[];

                            /** RdfColumn lexValues. */
                            lexValues: string[];

                            /** RdfColumn literalKinds. */
                            literalKinds: number[];

                            /** RdfColumn langtags. */
                            langtags: string[];

                            /** RdfColumn langtagDirections. */
                            langtagDirections: number[];

                            /** RdfColumn bnodes. */
                            bnodes: string[];

                            /** RdfColumn tripleTerms. */
                            tripleTerms: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties[];

                            /**
                             * Creates a new RdfColumn instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfColumn instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;

                            /**
                             * Encodes the specified RdfColumn message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.verify|verify} messages.
                             * @param message RdfColumn message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfColumn message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.verify|verify} messages.
                             * @param message RdfColumn message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfColumn message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape} RdfColumn
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape;

                            /**
                             * Decodes a RdfColumn message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape} RdfColumn
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape;
                        }

                        namespace RdfColumn {

                            /** Properties of a RdfColumn. */
                            interface $Properties {

                                /** RdfColumn kinds */
                                kinds?: (Uint8Array|null);

                                /** RdfColumn layouts */
                                layouts?: (number[]|null);

                                /** RdfColumn nameIds */
                                nameIds?: (number[]|null);

                                /** RdfColumn prefixIds */
                                prefixIds?: (number[]|null);

                                /** RdfColumn lexValues */
                                lexValues?: (string[]|null);

                                /** RdfColumn literalKinds */
                                literalKinds?: (number[]|null);

                                /** RdfColumn langtags */
                                langtags?: (string[]|null);

                                /** RdfColumn langtagDirections */
                                langtagDirections?: (number[]|null);

                                /** RdfColumn bnodes */
                                bnodes?: (string[]|null);

                                /** RdfColumn tripleTerms */
                                tripleTerms?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties[]|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfColumn. */
                            type $Shape = {
                              kinds?: Uint8Array|null;
                              layouts?: number[]|null;
                              nameIds?: number[]|null;
                              prefixIds?: number[]|null;
                              lexValues?: string[]|null;
                              literalKinds?: number[]|null;
                              langtags?: string[]|null;
                              langtagDirections?: number[]|null;
                              bnodes?: string[]|null;
                              tripleTerms?: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape[]|null;
                              $unknowns?: Uint8Array[];
                            };
                        }

                        /**
                         * Properties of a RdfDefaultGraph.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties instead.
                         */
                        interface IRdfDefaultGraph extends eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties {
                        }

                        /** Represents a RdfDefaultGraph. */
                        class RdfDefaultGraph {

                            /**
                             * Constructs a new RdfDefaultGraph.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /**
                             * Creates a new RdfDefaultGraph instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfDefaultGraph instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph;

                            /**
                             * Encodes the specified RdfDefaultGraph message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.verify|verify} messages.
                             * @param message RdfDefaultGraph message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfDefaultGraph message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.verify|verify} messages.
                             * @param message RdfDefaultGraph message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfDefaultGraph message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape} RdfDefaultGraph
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape;

                            /**
                             * Decodes a RdfDefaultGraph message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape} RdfDefaultGraph
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape;
                        }

                        namespace RdfDefaultGraph {

                            /** Properties of a RdfDefaultGraph. */
                            interface $Properties {

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfDefaultGraph. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties;
                        }

                        /**
                         * Properties of a RdfTriple.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties instead.
                         */
                        interface IRdfTriple extends eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties {
                        }

                        /** Represents a RdfTriple. */
                        class RdfTriple {

                            /**
                             * Constructs a new RdfTriple.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfTriple sIri. */
                            sIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfTriple sBnode. */
                            sBnode?: (string|null);

                            /** RdfTriple sLiteral. */
                            sLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfTriple sTripleTerm. */
                            sTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfTriple pIri. */
                            pIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfTriple pBnode. */
                            pBnode?: (string|null);

                            /** RdfTriple pLiteral. */
                            pLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfTriple pTripleTerm. */
                            pTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfTriple oIri. */
                            oIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfTriple oBnode. */
                            oBnode?: (string|null);

                            /** RdfTriple oLiteral. */
                            oLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfTriple oTripleTerm. */
                            oTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfTriple subject. */
                            subject?: ("sIri"|"sBnode"|"sLiteral"|"sTripleTerm");

                            /** RdfTriple predicate. */
                            predicate?: ("pIri"|"pBnode"|"pLiteral"|"pTripleTerm");

                            /** RdfTriple object. */
                            object?: ("oIri"|"oBnode"|"oLiteral"|"oTripleTerm");

                            /**
                             * Creates a new RdfTriple instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfTriple instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfTriple;

                            /**
                             * Encodes the specified RdfTriple message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.verify|verify} messages.
                             * @param message RdfTriple message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfTriple message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.verify|verify} messages.
                             * @param message RdfTriple message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfTriple message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape} RdfTriple
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape;

                            /**
                             * Decodes a RdfTriple message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape} RdfTriple
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape;
                        }

                        namespace RdfTriple {

                            /** Properties of a RdfTriple. */
                            interface $Properties {

                                /** RdfTriple sIri */
                                sIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfTriple sBnode */
                                sBnode?: (string|null);

                                /** RdfTriple sLiteral */
                                sLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfTriple sTripleTerm */
                                sTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfTriple pIri */
                                pIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfTriple pBnode */
                                pBnode?: (string|null);

                                /** RdfTriple pLiteral */
                                pLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfTriple pTripleTerm */
                                pTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfTriple oIri */
                                oIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfTriple oBnode */
                                oBnode?: (string|null);

                                /** RdfTriple oLiteral */
                                oLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfTriple oTripleTerm */
                                oTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfTriple subject */
                                subject?: ("sIri"|"sBnode"|"sLiteral"|"sTripleTerm");

                                /** RdfTriple predicate */
                                predicate?: ("pIri"|"pBnode"|"pLiteral"|"pTripleTerm");

                                /** RdfTriple object */
                                object?: ("oIri"|"oBnode"|"oLiteral"|"oTripleTerm");

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Narrowed shape of a RdfTriple. */
                            type $Shape = {
                              sIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              sBnode?: string|null;
                              sLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              sTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              pIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              pBnode?: string|null;
                              pLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              pTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              oIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              oBnode?: string|null;
                              oLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              oTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ subject?: undefined; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sIri"; sIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sBnode"; sIri?: null; sBnode: string; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sLiteral"; sIri?: null; sBnode?: null; sLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; sTripleTerm?: null }|{ subject?: "sTripleTerm"; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                            ) & (
                              ({ predicate?: undefined; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pIri"; pIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pBnode"; pIri?: null; pBnode: string; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pLiteral"; pIri?: null; pBnode?: null; pLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; pTripleTerm?: null }|{ predicate?: "pTripleTerm"; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                            ) & (
                              ({ object?: undefined; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oIri"; oIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oBnode"; oIri?: null; oBnode: string; oLiteral?: null; oTripleTerm?: null }|{ object?: "oLiteral"; oIri?: null; oBnode?: null; oLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; oTripleTerm?: null }|{ object?: "oTripleTerm"; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                            );
                        }

                        /**
                         * Properties of a RdfQuad.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties instead.
                         */
                        interface IRdfQuad extends eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties {
                        }

                        /** Represents a RdfQuad. */
                        class RdfQuad {

                            /**
                             * Constructs a new RdfQuad.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfQuad sIri. */
                            sIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfQuad sBnode. */
                            sBnode?: (string|null);

                            /** RdfQuad sLiteral. */
                            sLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfQuad sTripleTerm. */
                            sTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfQuad pIri. */
                            pIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfQuad pBnode. */
                            pBnode?: (string|null);

                            /** RdfQuad pLiteral. */
                            pLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfQuad pTripleTerm. */
                            pTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfQuad oIri. */
                            oIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfQuad oBnode. */
                            oBnode?: (string|null);

                            /** RdfQuad oLiteral. */
                            oLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfQuad oTripleTerm. */
                            oTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfQuad gIri. */
                            gIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfQuad gBnode. */
                            gBnode?: (string|null);

                            /** RdfQuad gDefaultGraph. */
                            gDefaultGraph?: (eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null);

                            /** RdfQuad gLiteral. */
                            gLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfQuad subject. */
                            subject?: ("sIri"|"sBnode"|"sLiteral"|"sTripleTerm");

                            /** RdfQuad predicate. */
                            predicate?: ("pIri"|"pBnode"|"pLiteral"|"pTripleTerm");

                            /** RdfQuad object. */
                            object?: ("oIri"|"oBnode"|"oLiteral"|"oTripleTerm");

                            /** RdfQuad graph. */
                            graph?: ("gIri"|"gBnode"|"gDefaultGraph"|"gLiteral");

                            /**
                             * Creates a new RdfQuad instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfQuad instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfQuad;

                            /**
                             * Encodes the specified RdfQuad message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.verify|verify} messages.
                             * @param message RdfQuad message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfQuad message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.verify|verify} messages.
                             * @param message RdfQuad message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfQuad message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape} RdfQuad
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape;

                            /**
                             * Decodes a RdfQuad message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape} RdfQuad
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape;
                        }

                        namespace RdfQuad {

                            /** Properties of a RdfQuad. */
                            interface $Properties {

                                /** RdfQuad sIri */
                                sIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfQuad sBnode */
                                sBnode?: (string|null);

                                /** RdfQuad sLiteral */
                                sLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfQuad sTripleTerm */
                                sTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfQuad pIri */
                                pIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfQuad pBnode */
                                pBnode?: (string|null);

                                /** RdfQuad pLiteral */
                                pLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfQuad pTripleTerm */
                                pTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfQuad oIri */
                                oIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfQuad oBnode */
                                oBnode?: (string|null);

                                /** RdfQuad oLiteral */
                                oLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfQuad oTripleTerm */
                                oTripleTerm?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfQuad gIri */
                                gIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfQuad gBnode */
                                gBnode?: (string|null);

                                /** RdfQuad gDefaultGraph */
                                gDefaultGraph?: (eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null);

                                /** RdfQuad gLiteral */
                                gLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfQuad subject */
                                subject?: ("sIri"|"sBnode"|"sLiteral"|"sTripleTerm");

                                /** RdfQuad predicate */
                                predicate?: ("pIri"|"pBnode"|"pLiteral"|"pTripleTerm");

                                /** RdfQuad object */
                                object?: ("oIri"|"oBnode"|"oLiteral"|"oTripleTerm");

                                /** RdfQuad graph */
                                graph?: ("gIri"|"gBnode"|"gDefaultGraph"|"gLiteral");

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Narrowed shape of a RdfQuad. */
                            type $Shape = {
                              sIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              sBnode?: string|null;
                              sLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              sTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              pIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              pBnode?: string|null;
                              pLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              pTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              oIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              oBnode?: string|null;
                              oLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              oTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              gIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              gBnode?: string|null;
                              gDefaultGraph?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape|null;
                              gLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ subject?: undefined; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sIri"; sIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sBnode"; sIri?: null; sBnode: string; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sLiteral"; sIri?: null; sBnode?: null; sLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; sTripleTerm?: null }|{ subject?: "sTripleTerm"; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                            ) & (
                              ({ predicate?: undefined; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pIri"; pIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pBnode"; pIri?: null; pBnode: string; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pLiteral"; pIri?: null; pBnode?: null; pLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; pTripleTerm?: null }|{ predicate?: "pTripleTerm"; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                            ) & (
                              ({ object?: undefined; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oIri"; oIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oBnode"; oIri?: null; oBnode: string; oLiteral?: null; oTripleTerm?: null }|{ object?: "oLiteral"; oIri?: null; oBnode?: null; oLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; oTripleTerm?: null }|{ object?: "oTripleTerm"; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                            ) & (
                              ({ graph?: undefined; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gIri"; gIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gBnode"; gIri?: null; gBnode: string; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gDefaultGraph"; gIri?: null; gBnode?: null; gDefaultGraph: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape; gLiteral?: null }|{ graph?: "gLiteral"; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape })
                            );
                        }

                        /**
                         * Properties of a RdfGraphStart.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties instead.
                         */
                        interface IRdfGraphStart extends eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties {
                        }

                        /** Represents a RdfGraphStart. */
                        class RdfGraphStart {

                            /**
                             * Constructs a new RdfGraphStart.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfGraphStart gIri. */
                            gIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                            /** RdfGraphStart gBnode. */
                            gBnode?: (string|null);

                            /** RdfGraphStart gDefaultGraph. */
                            gDefaultGraph?: (eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null);

                            /** RdfGraphStart gLiteral. */
                            gLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                            /** RdfGraphStart graph. */
                            graph?: ("gIri"|"gBnode"|"gDefaultGraph"|"gLiteral");

                            /**
                             * Creates a new RdfGraphStart instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfGraphStart instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart;

                            /**
                             * Encodes the specified RdfGraphStart message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.verify|verify} messages.
                             * @param message RdfGraphStart message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfGraphStart message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.verify|verify} messages.
                             * @param message RdfGraphStart message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfGraphStart message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape} RdfGraphStart
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape;

                            /**
                             * Decodes a RdfGraphStart message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape} RdfGraphStart
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape;
                        }

                        namespace RdfGraphStart {

                            /** Properties of a RdfGraphStart. */
                            interface $Properties {

                                /** RdfGraphStart gIri */
                                gIri?: (eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null);

                                /** RdfGraphStart gBnode */
                                gBnode?: (string|null);

                                /** RdfGraphStart gDefaultGraph */
                                gDefaultGraph?: (eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null);

                                /** RdfGraphStart gLiteral */
                                gLiteral?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null);

                                /** RdfGraphStart graph */
                                graph?: ("gIri"|"gBnode"|"gDefaultGraph"|"gLiteral");

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Narrowed shape of a RdfGraphStart. */
                            type $Shape = {
                              gIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                              gBnode?: string|null;
                              gDefaultGraph?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape|null;
                              gLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ graph?: undefined; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gIri"; gIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gBnode"; gIri?: null; gBnode: string; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gDefaultGraph"; gIri?: null; gBnode?: null; gDefaultGraph: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape; gLiteral?: null }|{ graph?: "gLiteral"; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape })
                            );
                        }

                        /**
                         * Properties of a RdfGraphEnd.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties instead.
                         */
                        interface IRdfGraphEnd extends eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties {
                        }

                        /** Represents a RdfGraphEnd. */
                        class RdfGraphEnd {

                            /**
                             * Constructs a new RdfGraphEnd.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /**
                             * Creates a new RdfGraphEnd instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfGraphEnd instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd;

                            /**
                             * Encodes the specified RdfGraphEnd message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.verify|verify} messages.
                             * @param message RdfGraphEnd message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfGraphEnd message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.verify|verify} messages.
                             * @param message RdfGraphEnd message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfGraphEnd message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape} RdfGraphEnd
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape;

                            /**
                             * Decodes a RdfGraphEnd message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape} RdfGraphEnd
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape;
                        }

                        namespace RdfGraphEnd {

                            /** Properties of a RdfGraphEnd. */
                            interface $Properties {

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfGraphEnd. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties;
                        }

                        /**
                         * Properties of a RdfNameEntry.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties instead.
                         */
                        interface IRdfNameEntry extends eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties {
                        }

                        /** Represents a RdfNameEntry. */
                        class RdfNameEntry {

                            /**
                             * Constructs a new RdfNameEntry.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfNameEntry id. */
                            id: number;

                            /** RdfNameEntry value. */
                            value: string;

                            /**
                             * Creates a new RdfNameEntry instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfNameEntry instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry;

                            /**
                             * Encodes the specified RdfNameEntry message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.verify|verify} messages.
                             * @param message RdfNameEntry message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfNameEntry message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.verify|verify} messages.
                             * @param message RdfNameEntry message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfNameEntry message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape} RdfNameEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape;

                            /**
                             * Decodes a RdfNameEntry message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape} RdfNameEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape;
                        }

                        namespace RdfNameEntry {

                            /** Properties of a RdfNameEntry. */
                            interface $Properties {

                                /** RdfNameEntry id */
                                id?: (number|null);

                                /** RdfNameEntry value */
                                value?: (string|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfNameEntry. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties;
                        }

                        /**
                         * Properties of a RdfPrefixEntry.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties instead.
                         */
                        interface IRdfPrefixEntry extends eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties {
                        }

                        /** Represents a RdfPrefixEntry. */
                        class RdfPrefixEntry {

                            /**
                             * Constructs a new RdfPrefixEntry.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfPrefixEntry id. */
                            id: number;

                            /** RdfPrefixEntry value. */
                            value: string;

                            /**
                             * Creates a new RdfPrefixEntry instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfPrefixEntry instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry;

                            /**
                             * Encodes the specified RdfPrefixEntry message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.verify|verify} messages.
                             * @param message RdfPrefixEntry message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfPrefixEntry message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.verify|verify} messages.
                             * @param message RdfPrefixEntry message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfPrefixEntry message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape} RdfPrefixEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape;

                            /**
                             * Decodes a RdfPrefixEntry message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape} RdfPrefixEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape;
                        }

                        namespace RdfPrefixEntry {

                            /** Properties of a RdfPrefixEntry. */
                            interface $Properties {

                                /** RdfPrefixEntry id */
                                id?: (number|null);

                                /** RdfPrefixEntry value */
                                value?: (string|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfPrefixEntry. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties;
                        }

                        /**
                         * Properties of a RdfDatatypeEntry.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties instead.
                         */
                        interface IRdfDatatypeEntry extends eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties {
                        }

                        /** Represents a RdfDatatypeEntry. */
                        class RdfDatatypeEntry {

                            /**
                             * Constructs a new RdfDatatypeEntry.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfDatatypeEntry id. */
                            id: number;

                            /** RdfDatatypeEntry value. */
                            value: string;

                            /**
                             * Creates a new RdfDatatypeEntry instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfDatatypeEntry instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry;

                            /**
                             * Encodes the specified RdfDatatypeEntry message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.verify|verify} messages.
                             * @param message RdfDatatypeEntry message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfDatatypeEntry message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.verify|verify} messages.
                             * @param message RdfDatatypeEntry message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfDatatypeEntry message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape} RdfDatatypeEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape;

                            /**
                             * Decodes a RdfDatatypeEntry message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape} RdfDatatypeEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape;
                        }

                        namespace RdfDatatypeEntry {

                            /** Properties of a RdfDatatypeEntry. */
                            interface $Properties {

                                /** RdfDatatypeEntry id */
                                id?: (number|null);

                                /** RdfDatatypeEntry value */
                                value?: (string|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfDatatypeEntry. */
                            type $Shape = eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties;
                        }

                        /** LogicalStreamType enum. */
                        enum LogicalStreamType {

                            /** LOGICAL_STREAM_TYPE_UNSPECIFIED value */
                            LOGICAL_STREAM_TYPE_UNSPECIFIED = 0,

                            /** LOGICAL_STREAM_TYPE_FLAT_TRIPLES value */
                            LOGICAL_STREAM_TYPE_FLAT_TRIPLES = 1,

                            /** LOGICAL_STREAM_TYPE_FLAT_QUADS value */
                            LOGICAL_STREAM_TYPE_FLAT_QUADS = 2,

                            /** LOGICAL_STREAM_TYPE_GRAPHS value */
                            LOGICAL_STREAM_TYPE_GRAPHS = 3,

                            /** LOGICAL_STREAM_TYPE_DATASETS value */
                            LOGICAL_STREAM_TYPE_DATASETS = 4,

                            /** LOGICAL_STREAM_TYPE_SUBJECT_GRAPHS value */
                            LOGICAL_STREAM_TYPE_SUBJECT_GRAPHS = 13,

                            /** LOGICAL_STREAM_TYPE_NAMED_GRAPHS value */
                            LOGICAL_STREAM_TYPE_NAMED_GRAPHS = 14,

                            /** LOGICAL_STREAM_TYPE_TIMESTAMPED_NAMED_GRAPHS value */
                            LOGICAL_STREAM_TYPE_TIMESTAMPED_NAMED_GRAPHS = 114
                        }

                        /**
                         * Properties of a RdfStreamRow.
                         * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties instead.
                         */
                        interface IRdfStreamRow extends eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties {
                        }

                        /** Represents a RdfStreamRow. */
                        class RdfStreamRow {

                            /**
                             * Constructs a new RdfStreamRow.
                             * @param [properties] Properties to set
                             */
                            constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties);

                            /** Unknown fields preserved while decoding when enabled */
                            $unknowns?: Uint8Array[];

                            /** RdfStreamRow options. */
                            options?: (eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties|null);

                            /** RdfStreamRow triple. */
                            triple?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                            /** RdfStreamRow quad. */
                            quad?: (eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties|null);

                            /** RdfStreamRow graphStart. */
                            graphStart?: (eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties|null);

                            /** RdfStreamRow graphEnd. */
                            graphEnd?: (eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties|null);

                            /** RdfStreamRow namespace. */
                            namespace?: (eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties|null);

                            /** RdfStreamRow name. */
                            name?: (eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties|null);

                            /** RdfStreamRow prefix. */
                            prefix?: (eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties|null);

                            /** RdfStreamRow datatype. */
                            datatype?: (eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties|null);

                            /** RdfStreamRow row. */
                            row?: ("options"|"triple"|"quad"|"graphStart"|"graphEnd"|"namespace"|"name"|"prefix"|"datatype");

                            /**
                             * Creates a new RdfStreamRow instance using the specified properties.
                             * @param [properties] Properties to set
                             * @returns RdfStreamRow instance
                             */
                            static create(properties: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape;
                            static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow;

                            /**
                             * Encodes the specified RdfStreamRow message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.verify|verify} messages.
                             * @param message RdfStreamRow message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encode(message: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Encodes the specified RdfStreamRow message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.verify|verify} messages.
                             * @param message RdfStreamRow message or plain object to encode
                             * @param [writer] Writer to encode to
                             * @returns Writer
                             */
                            static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                            /**
                             * Decodes a RdfStreamRow message from the specified reader or buffer.
                             * @param reader Reader or buffer to decode from
                             * @param [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape} RdfStreamRow
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape;

                            /**
                             * Decodes a RdfStreamRow message from the specified reader or buffer, length delimited.
                             * @param reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape} RdfStreamRow
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape;
                        }

                        namespace RdfStreamRow {

                            /** Properties of a RdfStreamRow. */
                            interface $Properties {

                                /** RdfStreamRow options */
                                options?: (eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties|null);

                                /** RdfStreamRow triple */
                                triple?: (eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null);

                                /** RdfStreamRow quad */
                                quad?: (eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties|null);

                                /** RdfStreamRow graphStart */
                                graphStart?: (eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties|null);

                                /** RdfStreamRow graphEnd */
                                graphEnd?: (eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties|null);

                                /** RdfStreamRow namespace */
                                namespace?: (eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties|null);

                                /** RdfStreamRow name */
                                name?: (eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties|null);

                                /** RdfStreamRow prefix */
                                prefix?: (eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties|null);

                                /** RdfStreamRow datatype */
                                datatype?: (eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties|null);

                                /** RdfStreamRow row */
                                row?: ("options"|"triple"|"quad"|"graphStart"|"graphEnd"|"namespace"|"name"|"prefix"|"datatype");

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Narrowed shape of a RdfStreamRow. */
                            type $Shape = {
                              options?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape|null;
                              triple?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                              quad?: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape|null;
                              graphStart?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape|null;
                              graphEnd?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape|null;
                              namespace?: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape|null;
                              name?: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape|null;
                              prefix?: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape|null;
                              datatype?: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape|null;
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ row?: undefined; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "options"; options: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "triple"; options?: null; triple: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "quad"; options?: null; triple?: null; quad: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "graphStart"; options?: null; triple?: null; quad?: null; graphStart: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "graphEnd"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "namespace"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape; name?: null; prefix?: null; datatype?: null }|{ row?: "name"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape; prefix?: null; datatype?: null }|{ row?: "prefix"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape; datatype?: null }|{ row?: "datatype"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape })
                            );
                        }

                        /** Namespace sparql. */
                        namespace sparql {

                            /**
                             * Properties of a SparqlResultsOptions.
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties instead.
                             */
                            interface ISparqlResultsOptions extends eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties {
                            }

                            /** Represents a SparqlResultsOptions. */
                            class SparqlResultsOptions {

                                /**
                                 * Constructs a new SparqlResultsOptions.
                                 * @param [properties] Properties to set
                                 */
                                constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];

                                /** SparqlResultsOptions streamName. */
                                streamName: string;

                                /** SparqlResultsOptions streamType. */
                                streamType: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlStreamType;

                                /** SparqlResultsOptions rdfVersion. */
                                rdfVersion: eu.ostrzyciel.jelly.core.proto.v1.RdfVersion;

                                /** SparqlResultsOptions maxNameTableSize. */
                                maxNameTableSize: number;

                                /** SparqlResultsOptions maxPrefixTableSize. */
                                maxPrefixTableSize: number;

                                /** SparqlResultsOptions maxDatatypeTableSize. */
                                maxDatatypeTableSize: number;

                                /** SparqlResultsOptions version. */
                                version: number;

                                /**
                                 * Creates a new SparqlResultsOptions instance using the specified properties.
                                 * @param [properties] Properties to set
                                 * @returns SparqlResultsOptions instance
                                 */
                                static create(properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape;
                                static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions;

                                /**
                                 * Encodes the specified SparqlResultsOptions message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.verify|verify} messages.
                                 * @param message SparqlResultsOptions message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encode(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Encodes the specified SparqlResultsOptions message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.verify|verify} messages.
                                 * @param message SparqlResultsOptions message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Decodes a SparqlResultsOptions message from the specified reader or buffer.
                                 * @param reader Reader or buffer to decode from
                                 * @param [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape} SparqlResultsOptions
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape;

                                /**
                                 * Decodes a SparqlResultsOptions message from the specified reader or buffer, length delimited.
                                 * @param reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape} SparqlResultsOptions
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape;
                            }

                            namespace SparqlResultsOptions {

                                /** Properties of a SparqlResultsOptions. */
                                interface $Properties {

                                    /** SparqlResultsOptions streamName */
                                    streamName?: (string|null);

                                    /** SparqlResultsOptions streamType */
                                    streamType?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlStreamType|null);

                                    /** SparqlResultsOptions rdfVersion */
                                    rdfVersion?: (eu.ostrzyciel.jelly.core.proto.v1.RdfVersion|null);

                                    /** SparqlResultsOptions maxNameTableSize */
                                    maxNameTableSize?: (number|null);

                                    /** SparqlResultsOptions maxPrefixTableSize */
                                    maxPrefixTableSize?: (number|null);

                                    /** SparqlResultsOptions maxDatatypeTableSize */
                                    maxDatatypeTableSize?: (number|null);

                                    /** SparqlResultsOptions version */
                                    version?: (number|null);

                                    /** Unknown fields preserved while decoding when enabled */
                                    $unknowns?: Uint8Array[];
                                }

                                /** Shape of a SparqlResultsOptions. */
                                type $Shape = eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties;
                            }

                            /** SparqlStreamType enum. */
                            enum SparqlStreamType {

                                /** SPARQL_STREAM_TYPE_FLAT value */
                                SPARQL_STREAM_TYPE_FLAT = 0,

                                /** SPARQL_STREAM_TYPE_PUNCTUATED value */
                                SPARQL_STREAM_TYPE_PUNCTUATED = 1
                            }

                            /**
                             * Properties of a SparqlAskResult.
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties instead.
                             */
                            interface ISparqlAskResult extends eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties {
                            }

                            /** Represents a SparqlAskResult. */
                            class SparqlAskResult {

                                /**
                                 * Constructs a new SparqlAskResult.
                                 * @param [properties] Properties to set
                                 */
                                constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];

                                /** SparqlAskResult value. */
                                value: boolean;

                                /**
                                 * Creates a new SparqlAskResult instance using the specified properties.
                                 * @param [properties] Properties to set
                                 * @returns SparqlAskResult instance
                                 */
                                static create(properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape;
                                static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult;

                                /**
                                 * Encodes the specified SparqlAskResult message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.verify|verify} messages.
                                 * @param message SparqlAskResult message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encode(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Encodes the specified SparqlAskResult message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.verify|verify} messages.
                                 * @param message SparqlAskResult message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Decodes a SparqlAskResult message from the specified reader or buffer.
                                 * @param reader Reader or buffer to decode from
                                 * @param [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape} SparqlAskResult
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape;

                                /**
                                 * Decodes a SparqlAskResult message from the specified reader or buffer, length delimited.
                                 * @param reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape} SparqlAskResult
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape;
                            }

                            namespace SparqlAskResult {

                                /** Properties of a SparqlAskResult. */
                                interface $Properties {

                                    /** SparqlAskResult value */
                                    value?: (boolean|null);

                                    /** Unknown fields preserved while decoding when enabled */
                                    $unknowns?: Uint8Array[];
                                }

                                /** Shape of a SparqlAskResult. */
                                type $Shape = eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties;
                            }

                            /**
                             * Properties of a SparqlResultsTrailer.
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties instead.
                             */
                            interface ISparqlResultsTrailer extends eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties {
                            }

                            /** Represents a SparqlResultsTrailer. */
                            class SparqlResultsTrailer {

                                /**
                                 * Constructs a new SparqlResultsTrailer.
                                 * @param [properties] Properties to set
                                 */
                                constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];

                                /** SparqlResultsTrailer error. */
                                error: string;

                                /**
                                 * Creates a new SparqlResultsTrailer instance using the specified properties.
                                 * @param [properties] Properties to set
                                 * @returns SparqlResultsTrailer instance
                                 */
                                static create(properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape;
                                static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer;

                                /**
                                 * Encodes the specified SparqlResultsTrailer message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.verify|verify} messages.
                                 * @param message SparqlResultsTrailer message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encode(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Encodes the specified SparqlResultsTrailer message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.verify|verify} messages.
                                 * @param message SparqlResultsTrailer message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Decodes a SparqlResultsTrailer message from the specified reader or buffer.
                                 * @param reader Reader or buffer to decode from
                                 * @param [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape} SparqlResultsTrailer
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape;

                                /**
                                 * Decodes a SparqlResultsTrailer message from the specified reader or buffer, length delimited.
                                 * @param reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape} SparqlResultsTrailer
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape;
                            }

                            namespace SparqlResultsTrailer {

                                /** Properties of a SparqlResultsTrailer. */
                                interface $Properties {

                                    /** SparqlResultsTrailer error */
                                    error?: (string|null);

                                    /** Unknown fields preserved while decoding when enabled */
                                    $unknowns?: Uint8Array[];
                                }

                                /** Shape of a SparqlResultsTrailer. */
                                type $Shape = eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties;
                            }

                            /**
                             * Properties of a SparqlResultsFrame.
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties instead.
                             */
                            interface ISparqlResultsFrame extends eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties {
                            }

                            /** Represents a SparqlResultsFrame. */
                            class SparqlResultsFrame {

                                /**
                                 * Constructs a new SparqlResultsFrame.
                                 * @param [properties] Properties to set
                                 */
                                constructor(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];

                                /** SparqlResultsFrame options. */
                                options?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties|null);

                                /** SparqlResultsFrame variables. */
                                variables: string[];

                                /** SparqlResultsFrame rowCount. */
                                rowCount: number;

                                /** SparqlResultsFrame names. */
                                names: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];

                                /** SparqlResultsFrame prefixes. */
                                prefixes: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];

                                /** SparqlResultsFrame datatypes. */
                                datatypes: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[];

                                /** SparqlResultsFrame columns. */
                                columns: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties[];

                                /** SparqlResultsFrame askResult. */
                                askResult?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties|null);

                                /** SparqlResultsFrame trailer. */
                                trailer?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties|null);

                                /** SparqlResultsFrame metadata. */
                                metadata: { [k: string]: Uint8Array };

                                /**
                                 * Creates a new SparqlResultsFrame instance using the specified properties.
                                 * @param [properties] Properties to set
                                 * @returns SparqlResultsFrame instance
                                 */
                                static create(properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape;
                                static create(properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame;

                                /**
                                 * Encodes the specified SparqlResultsFrame message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.verify|verify} messages.
                                 * @param message SparqlResultsFrame message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encode(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Encodes the specified SparqlResultsFrame message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.verify|verify} messages.
                                 * @param message SparqlResultsFrame message or plain object to encode
                                 * @param [writer] Writer to encode to
                                 * @returns Writer
                                 */
                                static encodeDelimited(message: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                                /**
                                 * Decodes a SparqlResultsFrame message from the specified reader or buffer.
                                 * @param reader Reader or buffer to decode from
                                 * @param [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape} SparqlResultsFrame
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape;

                                /**
                                 * Decodes a SparqlResultsFrame message from the specified reader or buffer, length delimited.
                                 * @param reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape} SparqlResultsFrame
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape;
                            }

                            namespace SparqlResultsFrame {

                                /** Properties of a SparqlResultsFrame. */
                                interface $Properties {

                                    /** SparqlResultsFrame options */
                                    options?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties|null);

                                    /** SparqlResultsFrame variables */
                                    variables?: (string[]|null);

                                    /** SparqlResultsFrame rowCount */
                                    rowCount?: (number|null);

                                    /** SparqlResultsFrame names */
                                    names?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[]|null);

                                    /** SparqlResultsFrame prefixes */
                                    prefixes?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[]|null);

                                    /** SparqlResultsFrame datatypes */
                                    datatypes?: (eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[]|null);

                                    /** SparqlResultsFrame columns */
                                    columns?: (eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties[]|null);

                                    /** SparqlResultsFrame askResult */
                                    askResult?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties|null);

                                    /** SparqlResultsFrame trailer */
                                    trailer?: (eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties|null);

                                    /** SparqlResultsFrame metadata */
                                    metadata?: ({ [k: string]: Uint8Array }|null);

                                    /** Unknown fields preserved while decoding when enabled */
                                    $unknowns?: Uint8Array[];
                                }

                                /** Shape of a SparqlResultsFrame. */
                                type $Shape = {
                                  options?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape|null;
                                  variables?: string[]|null;
                                  rowCount?: number|null;
                                  names?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape[]|null;
                                  prefixes?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape[]|null;
                                  datatypes?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape[]|null;
                                  columns?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape[]|null;
                                  askResult?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape|null;
                                  trailer?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape|null;
                                  metadata?: { [k: string]: Uint8Array }|null;
                                  $unknowns?: Uint8Array[];
                                };
                            }
                        }
                    }
                }
            }
        }
    }
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
    streamType?: number;
    rdfVersion?: number;
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
    columns?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties;
    metadata: Map<string, Uint8Array>;
}

type NamespaceListener = (prefix: string, iri: RDF.NamedNode) => void;
type OptionsListener = (options: StreamOptions) => void;
interface DecoderEvents {
    namespace?: NamespaceListener;
    options?: OptionsListener;
}
declare class Decoder {
    private columns?;
    private readonly parserOptions;
    private readonly factory;
    private readonly strict;
    private readonly maxSupportedVersion;
    private readonly maxLookupTableSize;
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
    /** Decodes logical messages, which may cross or share column frames. */
    decodePayloadMessages(reader: Reader, length: number): Message[];
    finishMessages(): Message[];
    decode(frame: RdfStreamFrame): Message;
    decodeProto(frame: unknown): Message;
    private decodeEncodedFrame;
    /** Frame-oriented compatibility API; use decodePayloadMessages for logical boundaries. */
    decodeProtoPayload(rawReader: unknown, length: number): Message;
    private decodeRowPayload;
    decodeProtoPayloadTo(rawReader: unknown, length: number, output: RDF.Quad[]): void;
    private consumeProtoRow;
    private emitQuad;
    private decodeWireLookupEntry;
    private decodeWireTriple;
    /**
     * Quad rows read straight off the wire, mirroring decodeWireTriple with the
     * graph slot (fields 13-16) added. Falls back to the generated protobuf
     * decoder when a slot repeats, which is where merge semantics matter.
     */
    private decodeWireQuad;
    private decodeWireGraphTerm;
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

type Column = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties;
type Triple = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties;
type Literal$1 = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties;
/** Shared term collection and column encoding for both Jelly formats. */
declare class ColumnTermEncoder {
    protected readonly rdfVersion: RdfVersion;
    protected readonly tables: Map<string, number>[];
    constructor(rdfVersion: RdfVersion);
    protected keys(term: RDF.Term, names: string[], datatypes: string[], depth?: number): void;
    protected literal(term: RDF.Literal): Literal$1;
    protected triple(term: RDF.Quad): Triple;
    protected column(terms: RDF.Term[]): Column;
}

/** Batches own their lookup working set; entries can never be evicted mid-batch. */
declare class ColumnEncoder extends ColumnTermEncoder {
    private readonly options;
    private readonly sink?;
    readonly frames: RdfStreamFrame[];
    readonly physicalType: PhysicalStreamType;
    readonly lookup: LookupPreset;
    private readonly size;
    private readonly streamType;
    private quads;
    private namespaces;
    private first;
    private finished;
    private inMessage;
    constructor(options: WriterOptions, sink?: ((frame: RdfStreamFrame) => void) | undefined);
    private assertOpen;
    addNamespace(name: string, iri: string): void;
    addQuad(quad: RDF.Quad): void;
    addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void;
    addGraph(_graph: RDF.Quad_Graph, _quads: Iterable<RDF.Quad>, _metadata?: MessageMetadata): void;
    finish(): readonly RdfStreamFrame[];
    private fit;
    private flush;
}

declare class Encoder {
    readonly physicalType: PhysicalStreamType;
    readonly logicalType: LogicalStreamType;
    readonly lookup: LookupPreset;
    readonly messageSize: number;
    readonly frames: RdfStreamFrame[];
    private readonly frameSink?;
    private readonly names;
    private readonly prefixes;
    private readonly datatypes;
    private readonly repeated;
    private rows;
    private readonly scratchRows;
    private frameCount;
    private hasStatements;
    private finished;
    constructor(options?: WriterOptions, frameSink?: (frame: RdfStreamFrame) => void);
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
    /**
     * Grown on demand rather than allocated at the declared size, so a stream may
     * declare a large table without the parser paying for entries it never fills.
     */
    private readonly data;
    private lastAssignedIndex;
    private lastReusedIndex;
    constructor(size: number, limit?: number);
    assign(index: number, value: string): void;
    /** Extend the backing array by doubling, staying packed and capped at the table size. */
    private reserve;
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
/**
 * Receives one decoded frame. Returning `false` means "accepted, but stop
 * delivering" — the remaining bytes stay buffered until `resumeEach()`, which is
 * how a slow consumer applies backpressure without the decoder running ahead.
 */
type FrameConsumer<Frame> = (frame: Frame) => boolean | void;
/**
 * Incomplete frames accumulate in one amortised-growth buffer rather than being
 * re-concatenated per chunk. Bytes already consumed are skipped with an offset,
 * and the live region is only moved when the buffer has to grow or make room, so
 * total copying is linear in the input rather than quadratic in the frame size.
 */
declare class FramedMessageDecoder<Frame> {
    private readonly decodeFrame;
    private readonly decodeReader?;
    private buffer;
    private start;
    private filled;
    private delimited;
    private readonly mode;
    private readonly maxMessageSize;
    private finalising;
    private stopped;
    private delivered;
    constructor(options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>, decodeFrame: FrameDecoder<Frame>, decodeReader?: ReaderFrameDecoder<Frame> | undefined);
    private get retained();
    /** Bytes held back because a consumer paused or a frame is still incomplete. */
    get bufferedBytes(): number;
    get paused(): boolean;
    write(chunk: BinaryInput): Frame[];
    end(chunk?: BinaryInput): Frame[];
    decode(input: BinaryInput): Frame[];
    /** Returns false when the consumer paused delivery; call resumeEach() to continue. */
    writeEach(chunk: BinaryInput, consume: FrameConsumer<Frame>): boolean;
    endEach(consume: FrameConsumer<Frame>, chunk?: BinaryInput): boolean;
    /** Continue after a consumer paused delivery by returning false. */
    resumeEach(consume: FrameConsumer<Frame>): boolean;
    decodeEach(input: BinaryInput, consume: FrameConsumer<Frame>): void;
    /** Framing is decided from the first three bytes, wherever they happen to sit. */
    private detect;
    private pump;
    /** Returns the offset after the last frame handed to the consumer. */
    private readFrames;
    private append;
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
/** A producer reported an incomplete SPARQL result set in its trailer. */
declare class JellySparqlResultError extends JellyError {
    readonly resultIndex: number;
    constructor(resultIndex: number, message: string);
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

declare enum SparqlStreamType {
    FLAT = 0,
    PUNCTUATED = 1
}
type SparqlTerm = RDF.NamedNode | RDF.BlankNode | RDF.Literal | RDF.Quad;
/** Keys are variable names without ? or $. Missing keys represent unbound cells. */
type SparqlBinding = ReadonlyMap<string, SparqlTerm> | Readonly<Record<string, SparqlTerm | undefined>>;
interface SparqlResultInfo {
    links: string[];
    metadata: ReadonlyMap<string, Uint8Array>;
    complete: boolean;
    error?: string;
}
interface SparqlSelectResult extends SparqlResultInfo {
    type: 'select';
    variables: string[];
    bindings: Map<string, SparqlTerm>[];
}
interface SparqlAskResult extends SparqlResultInfo {
    type: 'ask';
    boolean: boolean;
}
type SparqlResult = SparqlSelectResult | SparqlAskResult;
type SparqlEvent = {
    type: 'header';
    resultIndex: number;
    variables: string[];
} | {
    type: 'binding';
    resultIndex: number;
    bindings: Map<string, SparqlTerm>;
} | {
    type: 'boolean';
    resultIndex: number;
    value: boolean;
} | {
    type: 'metadata';
    resultIndex: number;
    metadata: ReadonlyMap<string, Uint8Array>;
    links?: string[];
} | {
    type: 'end';
    resultIndex: number;
    complete: boolean;
    error?: string;
};
interface SparqlParserOptions extends Pick<ParserOptions, 'factory' | 'maxMessageSize' | 'maxLookupTableSize' | 'maxRowsPerBatch'> {
    /** Files use length-delimited frames (default true). False reads a single bare frame. */
    delimited?: boolean;
    /** Limits expanded cells per frame, including all variables (default 1,048,576). */
    maxCellsPerBatch?: number;
    /** Error trailers throw by default. A callback signals the failure and allows parsing to continue. */
    onResultError?: (error: JellySparqlResultError) => void;
}
interface SparqlWriterOptions {
    delimited?: boolean;
    streamType?: SparqlStreamType;
    rdfVersion?: RdfVersion;
    streamName?: string;
    lookup?: Partial<LookupPreset>;
    /** Maximum rows per frame. Lookup capacity may end a frame earlier. Default 250. */
    frameSize?: number;
}
interface SparqlResultMetadata {
    links?: readonly string[];
    metadata?: MessageMetadata;
}

/** Reads complete result streams. For row delivery use a SparqlStreamParser. */
declare class SparqlParser {
    readonly options: SparqlParserOptions;
    constructor(options?: SparqlParserOptions);
    /** Returns result sets in stream order (one for a FLAT stream). */
    parse(input: BinaryInput): SparqlResult[];
}

type SparqlWritableResult = ({
    type: 'select';
    variables: readonly string[];
    bindings: Iterable<SparqlBinding>;
} & SparqlResultMetadata & {
    error?: string;
    complete?: boolean;
}) | ({
    type: 'ask';
    boolean: boolean;
} & SparqlResultMetadata & {
    error?: string;
    complete?: boolean;
});
/** Incremental writer: buffers at most one batch, and optionally sends encoded frames to a sink. */
declare class SparqlWriter extends ColumnTermEncoder {
    private readonly config;
    private readonly frameSink?;
    readonly lookup: LookupPreset;
    private readonly frameSize;
    private readonly streamType;
    private readonly chunks;
    private rows;
    private metadata;
    private variables;
    private active?;
    private askValue;
    private firstFrame;
    private firstResultFrame;
    private resultCount;
    private frameCount;
    private ended;
    constructor(config?: SparqlWriterOptions, frameSink?: ((bytes: Uint8Array) => void) | undefined);
    startSelect(variables: readonly string[], info?: SparqlResultMetadata): void;
    startAsk(value: boolean, info?: SparqlResultMetadata): void;
    addBinding(binding: SparqlBinding): void;
    addMetadata(info: SparqlResultMetadata): void;
    endResult(error?: string): void;
    addAsk(value: boolean, info?: SparqlResultMetadata): void;
    addResult(result: SparqlWritableResult | SparqlResult): void;
    /** Accepts the events emitted by SparqlStreamParser. */
    write(event: SparqlEvent): void;
    /** Finalizes the open result (if any) and returns bytes, or empty bytes with a frame sink. */
    end(): Uint8Array;
    private start;
    private assertOpen;
    private flush;
}

/** Web Streams equivalent of the Node event parser, with frame-level backpressure. */
declare class SparqlStreamParser {
    readonly readable: ReadableStream<SparqlEvent>;
    readonly writable: WritableStream<BinaryInput>;
    constructor(options?: SparqlParserOptions);
    import(stream: ReadableStream<BinaryInput>): ReadableStream<SparqlEvent>;
}
declare class SparqlStreamWriter {
    readonly readable: ReadableStream<Uint8Array>;
    readonly writable: WritableStream<SparqlEvent>;
    constructor(options?: SparqlWriterOptions);
    import(stream: ReadableStream<SparqlEvent>): ReadableStream<Uint8Array>;
}

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

export { type BinaryInput, type BinaryOutput, BlankNode, type BrowserStreamChunk, ColumnEncoder, DEFAULT_LOOKUP_PRESET, DataFactory, Decoder, DefaultGraph, Encoder, JellyConformanceError, JellyError, JellySparqlResultError, JellyUnsupportedFeatureError, Literal, LogicalStreamType, LookupDecoder, LookupEncoder, type LookupPreset, MAX_LOOKUP_SIZE, MIN_NAME_LOOKUP_SIZE, Message, MessageDecoder, MessageEncoder, type MessageMetadata, type MessageQuad, type MessageQuadArray, NamedNode, type ParseCallback, Parser, type ParserOptions, type ParserOutput, type ParserOutputItem, PhysicalStreamType, Quad, RDF_DIR_LANG_STRING, RDF_LANG_STRING, RdfStreamType, RdfVersion, SMALL_LOOKUP_PRESET, SparqlAskResult, type SparqlBinding, type SparqlEvent, SparqlParser, type SparqlParserOptions, type SparqlResult, type SparqlResultInfo, type SparqlResultMetadata, type SparqlSelectResult, SparqlStreamParser, SparqlStreamType, SparqlStreamWriter, type SparqlTerm, type SparqlWritableResult, SparqlWriter, type SparqlWriterOptions, type StreamOptions, StreamParser, StreamWriter, Variable, Writer, type WriterEndCallback, type WriterOptions, XSD_STRING, delimitedJellyHint, isMessageQuad, normalizeLookupPreset, toMessages };
