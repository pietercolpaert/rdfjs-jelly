import * as $protobuf from "protobufjs";

/** Namespace eu. */
export namespace eu {

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
                              $unknowns?: Uint8Array[];
                            } & (
                              ({ literalKind?: undefined; langtag?: null; datatype?: null }|{ literalKind?: "langtag"; langtag: string; datatype?: null }|{ literalKind?: "datatype"; langtag?: null; datatype: number })
                            );
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

                                /** RdfStreamFrame metadata */
                                metadata?: ({ [k: string]: Uint8Array }|null);

                                /** Unknown fields preserved while decoding when enabled */
                                $unknowns?: Uint8Array[];
                            }

                            /** Shape of a RdfStreamFrame. */
                            type $Shape = {
                              rows?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape[]|null;
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
