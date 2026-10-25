/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $RangeError = $util.global.RangeError;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const eu = $root.eu = (() => {

    /**
     * Namespace eu.
     * @exports eu
     * @namespace
     */
    const eu = {};

    eu.ostrzyciel = (function() {

        /**
         * Namespace ostrzyciel.
         * @memberof eu
         * @namespace
         */
        const ostrzyciel = {};

        ostrzyciel.jelly = (function() {

            /**
             * Namespace jelly.
             * @memberof eu.ostrzyciel
             * @namespace
             */
            const jelly = {};

            jelly.core = (function() {

                /**
                 * Namespace core.
                 * @memberof eu.ostrzyciel.jelly
                 * @namespace
                 */
                const core = {};

                core.proto = (function() {

                    /**
                     * Namespace proto.
                     * @memberof eu.ostrzyciel.jelly.core
                     * @namespace
                     */
                    const proto = {};

                    proto.v1 = (function() {

                        /**
                         * Namespace v1.
                         * @memberof eu.ostrzyciel.jelly.core.proto
                         * @namespace
                         */
                        const v1 = {};

                        v1.RdfIri = (function() {

                            /**
                             * Properties of a RdfIri.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties
                             * @property {number|null} [prefixId] RdfIri prefixId
                             * @property {number|null} [nameId] RdfIri nameId
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfIri.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfIri
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties instead.
                             */

                            /**
                             * Shape of a RdfIri.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape
                             */

                            /**
                             * Constructs a new RdfIri.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfIri.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfIri = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfIri prefixId.
                             * @member {number} prefixId
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @instance
                             */
                            RdfIri.prototype.prefixId = 0;

                            /**
                             * RdfIri nameId.
                             * @member {number} nameId
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @instance
                             */
                            RdfIri.prototype.nameId = 0;

                            /**
                             * Creates a new RdfIri instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfIri} RdfIri instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
                             * }}
                             */
                            RdfIri.create = function(properties) {
                                return new RdfIri(properties);
                            };

                            /**
                             * Encodes the specified RdfIri message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfIri.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties} message RdfIri message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfIri.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.prefixId != null && $Object.hasOwnProperty.call(message, "prefixId") && message.prefixId !== 0)
                                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.prefixId);
                                if (message.nameId != null && $Object.hasOwnProperty.call(message, "nameId") && message.nameId !== 0)
                                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.nameId);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfIri message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfIri.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties} message RdfIri message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfIri.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfIri message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape} RdfIri
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfIri.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.prefixId = value;
                                            else
                                                delete message.prefixId;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.nameId = value;
                                            else
                                                delete message.nameId;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfIri message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfIri
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfIri & eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape} RdfIri
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfIri.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfIri;
                        })();

                        /**
                         * RdfVersion enum.
                         * @name eu.ostrzyciel.jelly.core.proto.v1.RdfVersion
                         * @enum {number}
                         * @property {number} RDF_VERSION_UNSPECIFIED=0 RDF_VERSION_UNSPECIFIED value
                         * @property {number} RDF_VERSION_1_1=1 RDF_VERSION_1_1 value
                         * @property {number} RDF_VERSION_1_2_BASIC=2 RDF_VERSION_1_2_BASIC value
                         * @property {number} RDF_VERSION_1_2=3 RDF_VERSION_1_2 value
                         */
                        v1.RdfVersion = (function() {
                            const valuesById = $Object.create(null), values = $Object.create(valuesById);
                            values[valuesById[0] = "RDF_VERSION_UNSPECIFIED"] = 0;
                            values[valuesById[1] = "RDF_VERSION_1_1"] = 1;
                            values[valuesById[2] = "RDF_VERSION_1_2_BASIC"] = 2;
                            values[valuesById[3] = "RDF_VERSION_1_2"] = 3;
                            return values;
                        })();

                        /**
                         * RdfBaseDirection enum.
                         * @name eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection
                         * @enum {number}
                         * @property {number} RDF_BASE_DIRECTION_UNSPECIFIED=0 RDF_BASE_DIRECTION_UNSPECIFIED value
                         * @property {number} RDF_BASE_DIRECTION_LTR=1 RDF_BASE_DIRECTION_LTR value
                         * @property {number} RDF_BASE_DIRECTION_RTL=2 RDF_BASE_DIRECTION_RTL value
                         */
                        v1.RdfBaseDirection = (function() {
                            const valuesById = $Object.create(null), values = $Object.create(valuesById);
                            values[valuesById[0] = "RDF_BASE_DIRECTION_UNSPECIFIED"] = 0;
                            values[valuesById[1] = "RDF_BASE_DIRECTION_LTR"] = 1;
                            values[valuesById[2] = "RDF_BASE_DIRECTION_RTL"] = 2;
                            return values;
                        })();

                        v1.RdfLiteral = (function() {

                            /**
                             * Properties of a RdfLiteral.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties
                             * @property {string|null} [lex] RdfLiteral lex
                             * @property {string|null} [langtag] RdfLiteral langtag
                             * @property {number|null} [datatype] RdfLiteral datatype
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection|null} [direction] RdfLiteral direction
                             * @property {"langtag"|"datatype"} [literalKind] RdfLiteral literalKind
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfLiteral.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfLiteral
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties instead.
                             */

                            /**
                             * Narrowed shape of a RdfLiteral.
                             * @typedef {{
                             *   lex?: string|null;
                             *   langtag?: string|null;
                             *   datatype?: number|null;
                             *   direction?: eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * } & (
                             *   ({ literalKind?: undefined; langtag?: null; datatype?: null }|{ literalKind?: "langtag"; langtag: string; datatype?: null }|{ literalKind?: "datatype"; langtag?: null; datatype: number })
                             * )} eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape
                             */

                            /**
                             * Constructs a new RdfLiteral.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfLiteral.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfLiteral = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfLiteral lex.
                             * @member {string} lex
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @instance
                             */
                            RdfLiteral.prototype.lex = "";

                            /**
                             * RdfLiteral langtag.
                             * @member {string|null|undefined} langtag
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @instance
                             */
                            RdfLiteral.prototype.langtag = null;

                            /**
                             * RdfLiteral datatype.
                             * @member {number|null|undefined} datatype
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @instance
                             */
                            RdfLiteral.prototype.datatype = null;

                            /**
                             * RdfLiteral direction.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfBaseDirection} direction
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @instance
                             */
                            RdfLiteral.prototype.direction = 0;

                            // OneOf field names bound to virtual getters and setters
                            let $oneOfFields;

                            /**
                             * RdfLiteral literalKind.
                             * @member {"langtag"|"datatype"|undefined} literalKind
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @instance
                             */
                            $Object.defineProperty(RdfLiteral.prototype, "literalKind", {
                                get: $util.oneOfGetter($oneOfFields = ["langtag", "datatype"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * Creates a new RdfLiteral instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral} RdfLiteral instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;
                             * }}
                             */
                            RdfLiteral.create = function(properties) {
                                return new RdfLiteral(properties);
                            };

                            /**
                             * Encodes the specified RdfLiteral message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties} message RdfLiteral message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfLiteral.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.lex != null && $Object.hasOwnProperty.call(message, "lex") && message.lex !== "")
                                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.lex);
                                if (message.langtag != null && $Object.hasOwnProperty.call(message, "langtag"))
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.langtag);
                                if (message.datatype != null && $Object.hasOwnProperty.call(message, "datatype"))
                                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.datatype);
                                if (message.direction != null && $Object.hasOwnProperty.call(message, "direction") && message.direction !== 0)
                                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.direction);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfLiteral message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties} message RdfLiteral message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfLiteral.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfLiteral message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape} RdfLiteral
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfLiteral.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.stringVerify()).length)
                                                message.lex = value;
                                            else
                                                delete message.lex;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.langtag = reader.stringVerify();
                                            message.$literalKind = "langtag";
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 0)
                                                break;
                                            message.datatype = reader.uint32();
                                            message.$literalKind = "datatype";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.int32())
                                                message.direction = value;
                                            else
                                                delete message.direction;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfLiteral message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral & eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape} RdfLiteral
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfLiteral.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfLiteral;
                        })();

                        v1.RdfTripleTerm = (function() {

                            /**
                             * Properties of a RdfTripleTerm.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [sIri] RdfTripleTerm sIri
                             * @property {string|null} [sBnode] RdfTripleTerm sBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [pIri] RdfTripleTerm pIri
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [oIri] RdfTripleTerm oIri
                             * @property {string|null} [oBnode] RdfTripleTerm oBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [oLiteral] RdfTripleTerm oLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties|null} [oTripleTerm] RdfTripleTerm oTripleTerm
                             * @property {"sIri"|"sBnode"} [subject] RdfTripleTerm subject
                             * @property {"oIri"|"oBnode"|"oLiteral"|"oTripleTerm"} [object] RdfTripleTerm object
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfTripleTerm.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfTripleTerm
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties instead.
                             */

                            /**
                             * Narrowed shape of a RdfTripleTerm.
                             * @typedef {{
                             *   sIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   sBnode?: string|null;
                             *   pIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   oIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   oBnode?: string|null;
                             *   oLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   oTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * } & (
                             *   ({ subject?: undefined; sIri?: null; sBnode?: null }|{ subject?: "sIri"; sIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; sBnode?: null }|{ subject?: "sBnode"; sIri?: null; sBnode: string })
                             * ) & (
                             *   ({ object?: undefined; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oIri"; oIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oBnode"; oIri?: null; oBnode: string; oLiteral?: null; oTripleTerm?: null }|{ object?: "oLiteral"; oIri?: null; oBnode?: null; oLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; oTripleTerm?: null }|{ object?: "oTripleTerm"; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape })
                             * )} eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape
                             */

                            /**
                             * Constructs a new RdfTripleTerm.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfTripleTerm.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfTripleTerm = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfTripleTerm sIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} sIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.sIri = null;

                            /**
                             * RdfTripleTerm sBnode.
                             * @member {string|null|undefined} sBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.sBnode = null;

                            /**
                             * RdfTripleTerm pIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} pIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.pIri = null;

                            /**
                             * RdfTripleTerm oIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} oIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.oIri = null;

                            /**
                             * RdfTripleTerm oBnode.
                             * @member {string|null|undefined} oBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.oBnode = null;

                            /**
                             * RdfTripleTerm oLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} oLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.oLiteral = null;

                            /**
                             * RdfTripleTerm oTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties|null|undefined} oTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            RdfTripleTerm.prototype.oTripleTerm = null;

                            // OneOf field names bound to virtual getters and setters
                            let $oneOfFields;

                            /**
                             * RdfTripleTerm subject.
                             * @member {"sIri"|"sBnode"|undefined} subject
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            $Object.defineProperty(RdfTripleTerm.prototype, "subject", {
                                get: $util.oneOfGetter($oneOfFields = ["sIri", "sBnode"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * RdfTripleTerm object.
                             * @member {"oIri"|"oBnode"|"oLiteral"|"oTripleTerm"|undefined} object
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @instance
                             */
                            $Object.defineProperty(RdfTripleTerm.prototype, "object", {
                                get: $util.oneOfGetter($oneOfFields = ["oIri", "oBnode", "oLiteral", "oTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * Creates a new RdfTripleTerm instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm} RdfTripleTerm instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;
                             * }}
                             */
                            RdfTripleTerm.create = function(properties) {
                                return new RdfTripleTerm(properties);
                            };

                            /**
                             * Encodes the specified RdfTripleTerm message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties} message RdfTripleTerm message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfTripleTerm.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.sIri != null && $Object.hasOwnProperty.call(message, "sIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.sIri, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                if (message.sBnode != null && $Object.hasOwnProperty.call(message, "sBnode"))
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.sBnode);
                                if (message.pIri != null && $Object.hasOwnProperty.call(message, "pIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.pIri, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                                if (message.oIri != null && $Object.hasOwnProperty.call(message, "oIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.oIri, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                                if (message.oBnode != null && $Object.hasOwnProperty.call(message, "oBnode"))
                                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.oBnode);
                                if (message.oLiteral != null && $Object.hasOwnProperty.call(message, "oLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.oLiteral, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                                if (message.oTripleTerm != null && $Object.hasOwnProperty.call(message, "oTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.encode(message.oTripleTerm, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfTripleTerm message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties} message RdfTripleTerm message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfTripleTerm.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfTripleTerm message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape} RdfTripleTerm
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfTripleTerm.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            message.sIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.sIri);
                                            message.$subject = "sIri";
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.sBnode = reader.stringVerify();
                                            message.$subject = "sBnode";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.pIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.pIri);
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.oIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.oIri);
                                            message.$object = "oIri";
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 2)
                                                break;
                                            message.oBnode = reader.stringVerify();
                                            message.$object = "oBnode";
                                            continue;
                                        }
                                    case 11: {
                                            if (wireType !== 2)
                                                break;
                                            message.oLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.oLiteral);
                                            message.$object = "oLiteral";
                                            continue;
                                        }
                                    case 12: {
                                            if (wireType !== 2)
                                                break;
                                            message.oTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.decode(reader, reader.size(), $undefined, _depth + 1, message.oTripleTerm);
                                            message.$object = "oTripleTerm";
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfTripleTerm message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm & eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape} RdfTripleTerm
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfTripleTerm.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfTripleTerm;
                        })();

                        v1.RdfLookupEntryPacked = (function() {

                            /**
                             * Properties of a RdfLookupEntryPacked.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties
                             * @property {number|null} [id] RdfLookupEntryPacked id
                             * @property {Array.<string>|null} [values] RdfLookupEntryPacked values
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfLookupEntryPacked.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfLookupEntryPacked
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties instead.
                             */

                            /**
                             * Shape of a RdfLookupEntryPacked.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape
                             */

                            /**
                             * Constructs a new RdfLookupEntryPacked.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfLookupEntryPacked.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfLookupEntryPacked = function (properties) {
                                this.values = [];
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfLookupEntryPacked id.
                             * @member {number} id
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @instance
                             */
                            RdfLookupEntryPacked.prototype.id = 0;

                            /**
                             * RdfLookupEntryPacked values.
                             * @member {Array.<string>} values
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @instance
                             */
                            RdfLookupEntryPacked.prototype.values = $util.emptyArray;

                            /**
                             * Creates a new RdfLookupEntryPacked instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked} RdfLookupEntryPacked instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked;
                             * }}
                             */
                            RdfLookupEntryPacked.create = function(properties) {
                                return new RdfLookupEntryPacked(properties);
                            };

                            /**
                             * Encodes the specified RdfLookupEntryPacked message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties} message RdfLookupEntryPacked message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfLookupEntryPacked.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                                if (message.values != null && message.values.length)
                                    for (let i = 0; i < message.values.length; ++i)
                                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.values[i]);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfLookupEntryPacked message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties} message RdfLookupEntryPacked message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfLookupEntryPacked.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfLookupEntryPacked message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape} RdfLookupEntryPacked
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfLookupEntryPacked.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.id = value;
                                            else
                                                delete message.id;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.values && message.values.length))
                                                message.values = [];
                                            message.values.push(reader.stringVerify());
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfLookupEntryPacked message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked & eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape} RdfLookupEntryPacked
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfLookupEntryPacked.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfLookupEntryPacked;
                        })();

                        v1.RdfStreamOptions = (function() {

                            /**
                             * Properties of a RdfStreamOptions.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties
                             * @property {string|null} [streamName] RdfStreamOptions streamName
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.PhysicalStreamType|null} [physicalType] RdfStreamOptions physicalType
                             * @property {boolean|null} [generalizedStatements] RdfStreamOptions generalizedStatements
                             * @property {boolean|null} [rdfStar] RdfStreamOptions rdfStar
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamType|null} [streamType] RdfStreamOptions streamType
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfVersion|null} [rdfVersion] RdfStreamOptions rdfVersion
                             * @property {number|null} [maxNameTableSize] RdfStreamOptions maxNameTableSize
                             * @property {number|null} [maxPrefixTableSize] RdfStreamOptions maxPrefixTableSize
                             * @property {number|null} [maxDatatypeTableSize] RdfStreamOptions maxDatatypeTableSize
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.LogicalStreamType|null} [logicalType] RdfStreamOptions logicalType
                             * @property {number|null} [version] RdfStreamOptions version
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfStreamOptions.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfStreamOptions
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties instead.
                             */

                            /**
                             * Shape of a RdfStreamOptions.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape
                             */

                            /**
                             * Constructs a new RdfStreamOptions.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfStreamOptions.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfStreamOptions = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfStreamOptions streamName.
                             * @member {string} streamName
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.streamName = "";

                            /**
                             * RdfStreamOptions physicalType.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.PhysicalStreamType} physicalType
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.physicalType = 0;

                            /**
                             * RdfStreamOptions generalizedStatements.
                             * @member {boolean} generalizedStatements
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.generalizedStatements = false;

                            /**
                             * RdfStreamOptions rdfStar.
                             * @member {boolean} rdfStar
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.rdfStar = false;

                            /**
                             * RdfStreamOptions streamType.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamType} streamType
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.streamType = 0;

                            /**
                             * RdfStreamOptions rdfVersion.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfVersion} rdfVersion
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.rdfVersion = 0;

                            /**
                             * RdfStreamOptions maxNameTableSize.
                             * @member {number} maxNameTableSize
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.maxNameTableSize = 0;

                            /**
                             * RdfStreamOptions maxPrefixTableSize.
                             * @member {number} maxPrefixTableSize
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.maxPrefixTableSize = 0;

                            /**
                             * RdfStreamOptions maxDatatypeTableSize.
                             * @member {number} maxDatatypeTableSize
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.maxDatatypeTableSize = 0;

                            /**
                             * RdfStreamOptions logicalType.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.LogicalStreamType} logicalType
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.logicalType = 0;

                            /**
                             * RdfStreamOptions version.
                             * @member {number} version
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @instance
                             */
                            RdfStreamOptions.prototype.version = 0;

                            /**
                             * Creates a new RdfStreamOptions instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions} RdfStreamOptions instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions;
                             * }}
                             */
                            RdfStreamOptions.create = function(properties) {
                                return new RdfStreamOptions(properties);
                            };

                            /**
                             * Encodes the specified RdfStreamOptions message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties} message RdfStreamOptions message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfStreamOptions.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.streamName != null && $Object.hasOwnProperty.call(message, "streamName") && message.streamName !== "")
                                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.streamName);
                                if (message.physicalType != null && $Object.hasOwnProperty.call(message, "physicalType") && message.physicalType !== 0)
                                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.physicalType);
                                if (message.generalizedStatements != null && $Object.hasOwnProperty.call(message, "generalizedStatements") && message.generalizedStatements !== false)
                                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.generalizedStatements);
                                if (message.rdfStar != null && $Object.hasOwnProperty.call(message, "rdfStar") && message.rdfStar !== false)
                                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.rdfStar);
                                if (message.streamType != null && $Object.hasOwnProperty.call(message, "streamType") && message.streamType !== 0)
                                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.streamType);
                                if (message.rdfVersion != null && $Object.hasOwnProperty.call(message, "rdfVersion") && message.rdfVersion !== 0)
                                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.rdfVersion);
                                if (message.maxNameTableSize != null && $Object.hasOwnProperty.call(message, "maxNameTableSize") && message.maxNameTableSize !== 0)
                                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.maxNameTableSize);
                                if (message.maxPrefixTableSize != null && $Object.hasOwnProperty.call(message, "maxPrefixTableSize") && message.maxPrefixTableSize !== 0)
                                    writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.maxPrefixTableSize);
                                if (message.maxDatatypeTableSize != null && $Object.hasOwnProperty.call(message, "maxDatatypeTableSize") && message.maxDatatypeTableSize !== 0)
                                    writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.maxDatatypeTableSize);
                                if (message.logicalType != null && $Object.hasOwnProperty.call(message, "logicalType") && message.logicalType !== 0)
                                    writer.uint32(/* id 14, wireType 0 =*/112).int32(message.logicalType);
                                if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                                    writer.uint32(/* id 15, wireType 0 =*/120).uint32(message.version);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfStreamOptions message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties} message RdfStreamOptions message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfStreamOptions.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfStreamOptions message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape} RdfStreamOptions
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfStreamOptions.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.stringVerify()).length)
                                                message.streamName = value;
                                            else
                                                delete message.streamName;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.int32())
                                                message.physicalType = value;
                                            else
                                                delete message.physicalType;
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.bool())
                                                message.generalizedStatements = value;
                                            else
                                                delete message.generalizedStatements;
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.bool())
                                                message.rdfStar = value;
                                            else
                                                delete message.rdfStar;
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.int32())
                                                message.streamType = value;
                                            else
                                                delete message.streamType;
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.int32())
                                                message.rdfVersion = value;
                                            else
                                                delete message.rdfVersion;
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.maxNameTableSize = value;
                                            else
                                                delete message.maxNameTableSize;
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.maxPrefixTableSize = value;
                                            else
                                                delete message.maxPrefixTableSize;
                                            continue;
                                        }
                                    case 11: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.maxDatatypeTableSize = value;
                                            else
                                                delete message.maxDatatypeTableSize;
                                            continue;
                                        }
                                    case 14: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.int32())
                                                message.logicalType = value;
                                            else
                                                delete message.logicalType;
                                            continue;
                                        }
                                    case 15: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.version = value;
                                            else
                                                delete message.version;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfStreamOptions message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape} RdfStreamOptions
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfStreamOptions.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfStreamOptions;
                        })();

                        /**
                         * PhysicalStreamType enum.
                         * @name eu.ostrzyciel.jelly.core.proto.v1.PhysicalStreamType
                         * @enum {number}
                         * @property {number} PHYSICAL_STREAM_TYPE_UNSPECIFIED=0 PHYSICAL_STREAM_TYPE_UNSPECIFIED value
                         * @property {number} PHYSICAL_STREAM_TYPE_TRIPLES=1 PHYSICAL_STREAM_TYPE_TRIPLES value
                         * @property {number} PHYSICAL_STREAM_TYPE_QUADS=2 PHYSICAL_STREAM_TYPE_QUADS value
                         * @property {number} PHYSICAL_STREAM_TYPE_GRAPHS=3 PHYSICAL_STREAM_TYPE_GRAPHS value
                         */
                        v1.PhysicalStreamType = (function() {
                            const valuesById = $Object.create(null), values = $Object.create(valuesById);
                            values[valuesById[0] = "PHYSICAL_STREAM_TYPE_UNSPECIFIED"] = 0;
                            values[valuesById[1] = "PHYSICAL_STREAM_TYPE_TRIPLES"] = 1;
                            values[valuesById[2] = "PHYSICAL_STREAM_TYPE_QUADS"] = 2;
                            values[valuesById[3] = "PHYSICAL_STREAM_TYPE_GRAPHS"] = 3;
                            return values;
                        })();

                        /**
                         * RdfStreamType enum.
                         * @name eu.ostrzyciel.jelly.core.proto.v1.RdfStreamType
                         * @enum {number}
                         * @property {number} RDF_STREAM_TYPE_FLAT=0 RDF_STREAM_TYPE_FLAT value
                         * @property {number} RDF_STREAM_TYPE_MESSAGES=1 RDF_STREAM_TYPE_MESSAGES value
                         */
                        v1.RdfStreamType = (function() {
                            const valuesById = $Object.create(null), values = $Object.create(valuesById);
                            values[valuesById[0] = "RDF_STREAM_TYPE_FLAT"] = 0;
                            values[valuesById[1] = "RDF_STREAM_TYPE_MESSAGES"] = 1;
                            return values;
                        })();

                        v1.RdfStreamFrame = (function() {

                            /**
                             * Properties of a RdfStreamFrame.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties>|null} [rows] RdfStreamFrame rows
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties|null} [columns] RdfStreamFrame columns
                             * @property {Object.<string,Uint8Array>|null} [metadata] RdfStreamFrame metadata
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfStreamFrame.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfStreamFrame
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties instead.
                             */

                            /**
                             * Shape of a RdfStreamFrame.
                             * @typedef {{
                             *   rows?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape>|null;
                             *   columns?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape|null;
                             *   metadata?: Object.<string,Uint8Array>|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * }} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape
                             */

                            /**
                             * Constructs a new RdfStreamFrame.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfStreamFrame.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfStreamFrame = function (properties) {
                                this.rows = [];
                                this.metadata = {};
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfStreamFrame rows.
                             * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties>} rows
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @instance
                             */
                            RdfStreamFrame.prototype.rows = $util.emptyArray;

                            /**
                             * RdfStreamFrame columns.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties|null|undefined} columns
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @instance
                             */
                            RdfStreamFrame.prototype.columns = null;

                            /**
                             * RdfStreamFrame metadata.
                             * @member {Object.<string,Uint8Array>} metadata
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @instance
                             */
                            RdfStreamFrame.prototype.metadata = $util.emptyObject;

                            /**
                             * Creates a new RdfStreamFrame instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame} RdfStreamFrame instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
                             * }}
                             */
                            RdfStreamFrame.create = function(properties) {
                                return new RdfStreamFrame(properties);
                            };

                            /**
                             * Encodes the specified RdfStreamFrame message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties} message RdfStreamFrame message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfStreamFrame.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.rows != null && message.rows.length)
                                    for (let i = 0; i < message.rows.length; ++i)
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.encode(message.rows[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                if (message.columns != null && $Object.hasOwnProperty.call(message, "columns"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.encode(message.columns, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                                if (message.metadata != null && $Object.hasOwnProperty.call(message, "metadata"))
                                    for (let keys = $Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                                        writer.uint32(/* id 15, wireType 2 =*/122).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).bytes(message.metadata[keys[i]]).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfStreamFrame message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties} message RdfStreamFrame message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfStreamFrame.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfStreamFrame message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape} RdfStreamFrame
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfStreamFrame.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, key, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.rows && message.rows.length))
                                                message.rows = [];
                                            message.rows.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.decode(reader, reader.size(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.columns = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.decode(reader, reader.size(), $undefined, _depth + 1, message.columns);
                                            continue;
                                        }
                                    case 15: {
                                            if (wireType !== 2)
                                                break;
                                            if (message.metadata === $util.emptyObject)
                                                message.metadata = {};
                                            let end2 = reader.size() + reader.pos;
                                            if (end2 > reader.len)
                                                throw $RangeError("index out of range");
                                            reader.len = end2;
                                            key = "";
                                            value = [];
                                            while (reader.pos < end2) {
                                                let tag2 = reader.tag();
                                                wireType = tag2 & 7;
                                                switch (tag2 >>>= 3) {
                                                case 1:
                                                    if (wireType !== 2)
                                                        break;
                                                    key = reader.stringVerify();
                                                    continue;
                                                case 2:
                                                    if (wireType !== 2)
                                                        break;
                                                    value = reader.bytes();
                                                    continue;
                                                }
                                                reader.skipType(wireType, _depth, tag2);
                                            }
                                            if (reader.pos !== end2)
                                                throw $RangeError("index out of range");
                                            reader.len = end;
                                            if (key === "__proto__")
                                                $util.makeProp(message.metadata, key);
                                            message.metadata[key] = value;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfStreamFrame message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Shape} RdfStreamFrame
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfStreamFrame.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfStreamFrame;
                        })();

                        v1.RdfColumnBatch = (function() {

                            /**
                             * Properties of a RdfColumnBatch.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties
                             * @property {number|null} [rowCount] RdfColumnBatch rowCount
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>|null} [names] RdfColumnBatch names
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>|null} [prefixes] RdfColumnBatch prefixes
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>|null} [datatypes] RdfColumnBatch datatypes
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties>|null} [namespaces] RdfColumnBatch namespaces
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null} [subjects] RdfColumnBatch subjects
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null} [predicates] RdfColumnBatch predicates
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null} [objects] RdfColumnBatch objects
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null} [graphs] RdfColumnBatch graphs
                             * @property {Array.<number>|null} [messageLengths] RdfColumnBatch messageLengths
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfColumnBatch.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfColumnBatch
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties instead.
                             */

                            /**
                             * Shape of a RdfColumnBatch.
                             * @typedef {{
                             *   rowCount?: number|null;
                             *   names?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape>|null;
                             *   prefixes?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape>|null;
                             *   datatypes?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape>|null;
                             *   namespaces?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape>|null;
                             *   subjects?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                             *   predicates?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                             *   objects?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                             *   graphs?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape|null;
                             *   messageLengths?: Array.<number>|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * }} eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape
                             */

                            /**
                             * Constructs a new RdfColumnBatch.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfColumnBatch.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfColumnBatch = function (properties) {
                                this.names = [];
                                this.prefixes = [];
                                this.datatypes = [];
                                this.namespaces = [];
                                this.messageLengths = [];
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfColumnBatch rowCount.
                             * @member {number} rowCount
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.rowCount = 0;

                            /**
                             * RdfColumnBatch names.
                             * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>} names
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.names = $util.emptyArray;

                            /**
                             * RdfColumnBatch prefixes.
                             * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>} prefixes
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.prefixes = $util.emptyArray;

                            /**
                             * RdfColumnBatch datatypes.
                             * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>} datatypes
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.datatypes = $util.emptyArray;

                            /**
                             * RdfColumnBatch namespaces.
                             * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties>} namespaces
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.namespaces = $util.emptyArray;

                            /**
                             * RdfColumnBatch subjects.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null|undefined} subjects
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.subjects = null;

                            /**
                             * RdfColumnBatch predicates.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null|undefined} predicates
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.predicates = null;

                            /**
                             * RdfColumnBatch objects.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null|undefined} objects
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.objects = null;

                            /**
                             * RdfColumnBatch graphs.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties|null|undefined} graphs
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.graphs = null;

                            /**
                             * RdfColumnBatch messageLengths.
                             * @member {Array.<number>} messageLengths
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @instance
                             */
                            RdfColumnBatch.prototype.messageLengths = $util.emptyArray;

                            /**
                             * Creates a new RdfColumnBatch instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch} RdfColumnBatch instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch;
                             * }}
                             */
                            RdfColumnBatch.create = function(properties) {
                                return new RdfColumnBatch(properties);
                            };

                            /**
                             * Encodes the specified RdfColumnBatch message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties} message RdfColumnBatch message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfColumnBatch.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.rowCount != null && $Object.hasOwnProperty.call(message, "rowCount") && message.rowCount !== 0)
                                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.rowCount);
                                if (message.names != null && message.names.length)
                                    for (let i = 0; i < message.names.length; ++i)
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.names[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                                if (message.prefixes != null && message.prefixes.length)
                                    for (let i = 0; i < message.prefixes.length; ++i)
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.prefixes[i], writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                                if (message.datatypes != null && message.datatypes.length)
                                    for (let i = 0; i < message.datatypes.length; ++i)
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.datatypes[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                                if (message.namespaces != null && message.namespaces.length)
                                    for (let i = 0; i < message.namespaces.length; ++i)
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.encode(message.namespaces[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                                if (message.subjects != null && $Object.hasOwnProperty.call(message, "subjects"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.subjects, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                                if (message.predicates != null && $Object.hasOwnProperty.call(message, "predicates"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.predicates, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
                                if (message.objects != null && $Object.hasOwnProperty.call(message, "objects"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.objects, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
                                if (message.graphs != null && $Object.hasOwnProperty.call(message, "graphs"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.graphs, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                                if (message.messageLengths != null && message.messageLengths.length)
                                    writer.uint32(/* id 15, wireType 2 =*/122).uint32s(message.messageLengths);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfColumnBatch message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties} message RdfColumnBatch message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfColumnBatch.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfColumnBatch message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape} RdfColumnBatch
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfColumnBatch.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.rowCount = value;
                                            else
                                                delete message.rowCount;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.names && message.names.length))
                                                message.names = [];
                                            message.names.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.size(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.prefixes && message.prefixes.length))
                                                message.prefixes = [];
                                            message.prefixes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.size(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.datatypes && message.datatypes.length))
                                                message.datatypes = [];
                                            message.datatypes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.size(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.namespaces && message.namespaces.length))
                                                message.namespaces = [];
                                            message.namespaces.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.decode(reader, reader.size(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType !== 2)
                                                break;
                                            message.subjects = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.size(), $undefined, _depth + 1, message.subjects);
                                            continue;
                                        }
                                    case 7: {
                                            if (wireType !== 2)
                                                break;
                                            message.predicates = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.size(), $undefined, _depth + 1, message.predicates);
                                            continue;
                                        }
                                    case 8: {
                                            if (wireType !== 2)
                                                break;
                                            message.objects = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.size(), $undefined, _depth + 1, message.objects);
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.graphs = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.size(), $undefined, _depth + 1, message.graphs);
                                            continue;
                                        }
                                    case 15: {
                                            if (wireType === 2) {
                                                if (!(message.messageLengths && message.messageLengths.length))
                                                    message.messageLengths = [];
                                                reader.uint32s(message.messageLengths);
                                                continue;
                                            }
                                            if (wireType !== 0)
                                                break;
                                            if (!(message.messageLengths && message.messageLengths.length))
                                                message.messageLengths = [];
                                            message.messageLengths.push(reader.uint32());
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfColumnBatch message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch & eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Shape} RdfColumnBatch
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfColumnBatch.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfColumnBatch;
                        })();

                        v1.RdfNamespaceDeclaration = (function() {

                            /**
                             * Properties of a RdfNamespaceDeclaration.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties
                             * @property {string|null} [name] RdfNamespaceDeclaration name
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [value] RdfNamespaceDeclaration value
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfNamespaceDeclaration.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfNamespaceDeclaration
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties instead.
                             */

                            /**
                             * Shape of a RdfNamespaceDeclaration.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape
                             */

                            /**
                             * Constructs a new RdfNamespaceDeclaration.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfNamespaceDeclaration.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfNamespaceDeclaration = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfNamespaceDeclaration name.
                             * @member {string} name
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @instance
                             */
                            RdfNamespaceDeclaration.prototype.name = "";

                            /**
                             * RdfNamespaceDeclaration value.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} value
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @instance
                             */
                            RdfNamespaceDeclaration.prototype.value = null;

                            /**
                             * Creates a new RdfNamespaceDeclaration instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration} RdfNamespaceDeclaration instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration;
                             * }}
                             */
                            RdfNamespaceDeclaration.create = function(properties) {
                                return new RdfNamespaceDeclaration(properties);
                            };

                            /**
                             * Encodes the specified RdfNamespaceDeclaration message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties} message RdfNamespaceDeclaration message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfNamespaceDeclaration.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.name != null && $Object.hasOwnProperty.call(message, "name") && message.name !== "")
                                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfNamespaceDeclaration message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties} message RdfNamespaceDeclaration message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfNamespaceDeclaration.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfNamespaceDeclaration message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape} RdfNamespaceDeclaration
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfNamespaceDeclaration.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.stringVerify()).length)
                                                message.name = value;
                                            else
                                                delete message.name;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.value = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.value);
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfNamespaceDeclaration message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration & eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape} RdfNamespaceDeclaration
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfNamespaceDeclaration.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfNamespaceDeclaration;
                        })();

                        v1.RdfColumn = (function() {

                            /**
                             * Properties of a RdfColumn.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties
                             * @property {Uint8Array|null} [kinds] RdfColumn kinds
                             * @property {Array.<number>|null} [layouts] RdfColumn layouts
                             * @property {Array.<number>|null} [nameIds] RdfColumn nameIds
                             * @property {Array.<number>|null} [prefixIds] RdfColumn prefixIds
                             * @property {Array.<string>|null} [lexValues] RdfColumn lexValues
                             * @property {Array.<number>|null} [literalKinds] RdfColumn literalKinds
                             * @property {Array.<string>|null} [langtags] RdfColumn langtags
                             * @property {Array.<number>|null} [langtagDirections] RdfColumn langtagDirections
                             * @property {Array.<string>|null} [bnodes] RdfColumn bnodes
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties>|null} [tripleTerms] RdfColumn tripleTerms
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfColumn.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfColumn
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties instead.
                             */

                            /**
                             * Shape of a RdfColumn.
                             * @typedef {{
                             *   kinds?: Uint8Array|null;
                             *   layouts?: Array.<number>|null;
                             *   nameIds?: Array.<number>|null;
                             *   prefixIds?: Array.<number>|null;
                             *   lexValues?: Array.<string>|null;
                             *   literalKinds?: Array.<number>|null;
                             *   langtags?: Array.<string>|null;
                             *   langtagDirections?: Array.<number>|null;
                             *   bnodes?: Array.<string>|null;
                             *   tripleTerms?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Shape>|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * }} eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape
                             */

                            /**
                             * Constructs a new RdfColumn.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfColumn.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfColumn = function (properties) {
                                this.layouts = [];
                                this.nameIds = [];
                                this.prefixIds = [];
                                this.lexValues = [];
                                this.literalKinds = [];
                                this.langtags = [];
                                this.langtagDirections = [];
                                this.bnodes = [];
                                this.tripleTerms = [];
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfColumn kinds.
                             * @member {Uint8Array} kinds
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.kinds = $util.newBuffer([]);

                            /**
                             * RdfColumn layouts.
                             * @member {Array.<number>} layouts
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.layouts = $util.emptyArray;

                            /**
                             * RdfColumn nameIds.
                             * @member {Array.<number>} nameIds
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.nameIds = $util.emptyArray;

                            /**
                             * RdfColumn prefixIds.
                             * @member {Array.<number>} prefixIds
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.prefixIds = $util.emptyArray;

                            /**
                             * RdfColumn lexValues.
                             * @member {Array.<string>} lexValues
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.lexValues = $util.emptyArray;

                            /**
                             * RdfColumn literalKinds.
                             * @member {Array.<number>} literalKinds
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.literalKinds = $util.emptyArray;

                            /**
                             * RdfColumn langtags.
                             * @member {Array.<string>} langtags
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.langtags = $util.emptyArray;

                            /**
                             * RdfColumn langtagDirections.
                             * @member {Array.<number>} langtagDirections
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.langtagDirections = $util.emptyArray;

                            /**
                             * RdfColumn bnodes.
                             * @member {Array.<string>} bnodes
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.bnodes = $util.emptyArray;

                            /**
                             * RdfColumn tripleTerms.
                             * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties>} tripleTerms
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @instance
                             */
                            RdfColumn.prototype.tripleTerms = $util.emptyArray;

                            /**
                             * Creates a new RdfColumn instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn} RdfColumn instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
                             * }}
                             */
                            RdfColumn.create = function(properties) {
                                return new RdfColumn(properties);
                            };

                            /**
                             * Encodes the specified RdfColumn message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties} message RdfColumn message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfColumn.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.kinds != null && $Object.hasOwnProperty.call(message, "kinds") && message.kinds.length)
                                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.kinds);
                                if (message.layouts != null && message.layouts.length)
                                    writer.uint32(/* id 2, wireType 2 =*/18).uint32s(message.layouts);
                                if (message.nameIds != null && message.nameIds.length)
                                    writer.uint32(/* id 3, wireType 2 =*/26).uint32s(message.nameIds);
                                if (message.prefixIds != null && message.prefixIds.length)
                                    writer.uint32(/* id 4, wireType 2 =*/34).uint32s(message.prefixIds);
                                if (message.lexValues != null && message.lexValues.length)
                                    for (let i = 0; i < message.lexValues.length; ++i)
                                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.lexValues[i]);
                                if (message.literalKinds != null && message.literalKinds.length)
                                    writer.uint32(/* id 6, wireType 2 =*/50).uint32s(message.literalKinds);
                                if (message.langtags != null && message.langtags.length)
                                    for (let i = 0; i < message.langtags.length; ++i)
                                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.langtags[i]);
                                if (message.langtagDirections != null && message.langtagDirections.length)
                                    writer.uint32(/* id 8, wireType 2 =*/66).uint32s(message.langtagDirections);
                                if (message.bnodes != null && message.bnodes.length)
                                    for (let i = 0; i < message.bnodes.length; ++i)
                                        writer.uint32(/* id 9, wireType 2 =*/74).string(message.bnodes[i]);
                                if (message.tripleTerms != null && message.tripleTerms.length)
                                    for (let i = 0; i < message.tripleTerms.length; ++i)
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.encode(message.tripleTerms[i], writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfColumn message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties} message RdfColumn message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfColumn.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfColumn message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape} RdfColumn
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfColumn.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.bytes()).length)
                                                message.kinds = value;
                                            else
                                                delete message.kinds;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType === 2) {
                                                if (!(message.layouts && message.layouts.length))
                                                    message.layouts = [];
                                                reader.uint32s(message.layouts);
                                                continue;
                                            }
                                            if (wireType !== 0)
                                                break;
                                            if (!(message.layouts && message.layouts.length))
                                                message.layouts = [];
                                            message.layouts.push(reader.uint32());
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType === 2) {
                                                if (!(message.nameIds && message.nameIds.length))
                                                    message.nameIds = [];
                                                reader.uint32s(message.nameIds);
                                                continue;
                                            }
                                            if (wireType !== 0)
                                                break;
                                            if (!(message.nameIds && message.nameIds.length))
                                                message.nameIds = [];
                                            message.nameIds.push(reader.uint32());
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType === 2) {
                                                if (!(message.prefixIds && message.prefixIds.length))
                                                    message.prefixIds = [];
                                                reader.uint32s(message.prefixIds);
                                                continue;
                                            }
                                            if (wireType !== 0)
                                                break;
                                            if (!(message.prefixIds && message.prefixIds.length))
                                                message.prefixIds = [];
                                            message.prefixIds.push(reader.uint32());
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.lexValues && message.lexValues.length))
                                                message.lexValues = [];
                                            message.lexValues.push(reader.stringVerify());
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType === 2) {
                                                if (!(message.literalKinds && message.literalKinds.length))
                                                    message.literalKinds = [];
                                                reader.uint32s(message.literalKinds);
                                                continue;
                                            }
                                            if (wireType !== 0)
                                                break;
                                            if (!(message.literalKinds && message.literalKinds.length))
                                                message.literalKinds = [];
                                            message.literalKinds.push(reader.uint32());
                                            continue;
                                        }
                                    case 7: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.langtags && message.langtags.length))
                                                message.langtags = [];
                                            message.langtags.push(reader.stringVerify());
                                            continue;
                                        }
                                    case 8: {
                                            if (wireType === 2) {
                                                if (!(message.langtagDirections && message.langtagDirections.length))
                                                    message.langtagDirections = [];
                                                reader.uint32s(message.langtagDirections);
                                                continue;
                                            }
                                            if (wireType !== 0)
                                                break;
                                            if (!(message.langtagDirections && message.langtagDirections.length))
                                                message.langtagDirections = [];
                                            message.langtagDirections.push(reader.uint32());
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.bnodes && message.bnodes.length))
                                                message.bnodes = [];
                                            message.bnodes.push(reader.stringVerify());
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 2)
                                                break;
                                            if (!(message.tripleTerms && message.tripleTerms.length))
                                                message.tripleTerms = [];
                                            message.tripleTerms.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.decode(reader, reader.size(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfColumn message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfColumn
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfColumn & eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape} RdfColumn
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfColumn.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfColumn;
                        })();

                        v1.RdfDefaultGraph = (function() {

                            /**
                             * Properties of a RdfDefaultGraph.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfDefaultGraph.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfDefaultGraph
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties instead.
                             */

                            /**
                             * Shape of a RdfDefaultGraph.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape
                             */

                            /**
                             * Constructs a new RdfDefaultGraph.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfDefaultGraph.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfDefaultGraph = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * Creates a new RdfDefaultGraph instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph} RdfDefaultGraph instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph;
                             * }}
                             */
                            RdfDefaultGraph.create = function(properties) {
                                return new RdfDefaultGraph(properties);
                            };

                            /**
                             * Encodes the specified RdfDefaultGraph message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties} message RdfDefaultGraph message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfDefaultGraph.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfDefaultGraph message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties} message RdfDefaultGraph message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfDefaultGraph.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfDefaultGraph message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape} RdfDefaultGraph
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfDefaultGraph.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    reader.skipType(tag & 7, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfDefaultGraph message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph & eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape} RdfDefaultGraph
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfDefaultGraph.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfDefaultGraph;
                        })();

                        v1.RdfTriple = (function() {

                            /**
                             * Properties of a RdfTriple.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [sIri] RdfTriple sIri
                             * @property {string|null} [sBnode] RdfTriple sBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [sLiteral] RdfTriple sLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [sTripleTerm] RdfTriple sTripleTerm
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [pIri] RdfTriple pIri
                             * @property {string|null} [pBnode] RdfTriple pBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [pLiteral] RdfTriple pLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [pTripleTerm] RdfTriple pTripleTerm
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [oIri] RdfTriple oIri
                             * @property {string|null} [oBnode] RdfTriple oBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [oLiteral] RdfTriple oLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [oTripleTerm] RdfTriple oTripleTerm
                             * @property {"sIri"|"sBnode"|"sLiteral"|"sTripleTerm"} [subject] RdfTriple subject
                             * @property {"pIri"|"pBnode"|"pLiteral"|"pTripleTerm"} [predicate] RdfTriple predicate
                             * @property {"oIri"|"oBnode"|"oLiteral"|"oTripleTerm"} [object] RdfTriple object
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfTriple.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfTriple
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties instead.
                             */

                            /**
                             * Narrowed shape of a RdfTriple.
                             * @typedef {{
                             *   sIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   sBnode?: string|null;
                             *   sLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   sTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   pIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   pBnode?: string|null;
                             *   pLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   pTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   oIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   oBnode?: string|null;
                             *   oLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   oTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * } & (
                             *   ({ subject?: undefined; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sIri"; sIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sBnode"; sIri?: null; sBnode: string; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sLiteral"; sIri?: null; sBnode?: null; sLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; sTripleTerm?: null }|{ subject?: "sTripleTerm"; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                             * ) & (
                             *   ({ predicate?: undefined; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pIri"; pIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pBnode"; pIri?: null; pBnode: string; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pLiteral"; pIri?: null; pBnode?: null; pLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; pTripleTerm?: null }|{ predicate?: "pTripleTerm"; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                             * ) & (
                             *   ({ object?: undefined; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oIri"; oIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oBnode"; oIri?: null; oBnode: string; oLiteral?: null; oTripleTerm?: null }|{ object?: "oLiteral"; oIri?: null; oBnode?: null; oLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; oTripleTerm?: null }|{ object?: "oTripleTerm"; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                             * )} eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape
                             */

                            /**
                             * Constructs a new RdfTriple.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfTriple.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfTriple = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfTriple sIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} sIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.sIri = null;

                            /**
                             * RdfTriple sBnode.
                             * @member {string|null|undefined} sBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.sBnode = null;

                            /**
                             * RdfTriple sLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} sLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.sLiteral = null;

                            /**
                             * RdfTriple sTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} sTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.sTripleTerm = null;

                            /**
                             * RdfTriple pIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} pIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.pIri = null;

                            /**
                             * RdfTriple pBnode.
                             * @member {string|null|undefined} pBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.pBnode = null;

                            /**
                             * RdfTriple pLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} pLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.pLiteral = null;

                            /**
                             * RdfTriple pTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} pTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.pTripleTerm = null;

                            /**
                             * RdfTriple oIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} oIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.oIri = null;

                            /**
                             * RdfTriple oBnode.
                             * @member {string|null|undefined} oBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.oBnode = null;

                            /**
                             * RdfTriple oLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} oLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.oLiteral = null;

                            /**
                             * RdfTriple oTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} oTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            RdfTriple.prototype.oTripleTerm = null;

                            // OneOf field names bound to virtual getters and setters
                            let $oneOfFields;

                            /**
                             * RdfTriple subject.
                             * @member {"sIri"|"sBnode"|"sLiteral"|"sTripleTerm"|undefined} subject
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            $Object.defineProperty(RdfTriple.prototype, "subject", {
                                get: $util.oneOfGetter($oneOfFields = ["sIri", "sBnode", "sLiteral", "sTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * RdfTriple predicate.
                             * @member {"pIri"|"pBnode"|"pLiteral"|"pTripleTerm"|undefined} predicate
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            $Object.defineProperty(RdfTriple.prototype, "predicate", {
                                get: $util.oneOfGetter($oneOfFields = ["pIri", "pBnode", "pLiteral", "pTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * RdfTriple object.
                             * @member {"oIri"|"oBnode"|"oLiteral"|"oTripleTerm"|undefined} object
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @instance
                             */
                            $Object.defineProperty(RdfTriple.prototype, "object", {
                                get: $util.oneOfGetter($oneOfFields = ["oIri", "oBnode", "oLiteral", "oTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * Creates a new RdfTriple instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple} RdfTriple instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfTriple;
                             * }}
                             */
                            RdfTriple.create = function(properties) {
                                return new RdfTriple(properties);
                            };

                            /**
                             * Encodes the specified RdfTriple message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties} message RdfTriple message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfTriple.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.sIri != null && $Object.hasOwnProperty.call(message, "sIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.sIri, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                if (message.sBnode != null && $Object.hasOwnProperty.call(message, "sBnode"))
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.sBnode);
                                if (message.sLiteral != null && $Object.hasOwnProperty.call(message, "sLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.sLiteral, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                                if (message.sTripleTerm != null && $Object.hasOwnProperty.call(message, "sTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.sTripleTerm, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                                if (message.pIri != null && $Object.hasOwnProperty.call(message, "pIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.pIri, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                                if (message.pBnode != null && $Object.hasOwnProperty.call(message, "pBnode"))
                                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.pBnode);
                                if (message.pLiteral != null && $Object.hasOwnProperty.call(message, "pLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.pLiteral, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
                                if (message.pTripleTerm != null && $Object.hasOwnProperty.call(message, "pTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.pTripleTerm, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
                                if (message.oIri != null && $Object.hasOwnProperty.call(message, "oIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.oIri, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                                if (message.oBnode != null && $Object.hasOwnProperty.call(message, "oBnode"))
                                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.oBnode);
                                if (message.oLiteral != null && $Object.hasOwnProperty.call(message, "oLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.oLiteral, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                                if (message.oTripleTerm != null && $Object.hasOwnProperty.call(message, "oTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.oTripleTerm, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfTriple message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties} message RdfTriple message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfTriple.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfTriple message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape} RdfTriple
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfTriple.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            message.sIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.sIri);
                                            message.$subject = "sIri";
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.sBnode = reader.stringVerify();
                                            message.$subject = "sBnode";
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 2)
                                                break;
                                            message.sLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.sLiteral);
                                            message.$subject = "sLiteral";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.sTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.sTripleTerm);
                                            message.$subject = "sTripleTerm";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.pIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.pIri);
                                            message.$predicate = "pIri";
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType !== 2)
                                                break;
                                            message.pBnode = reader.stringVerify();
                                            message.$predicate = "pBnode";
                                            continue;
                                        }
                                    case 7: {
                                            if (wireType !== 2)
                                                break;
                                            message.pLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.pLiteral);
                                            message.$predicate = "pLiteral";
                                            continue;
                                        }
                                    case 8: {
                                            if (wireType !== 2)
                                                break;
                                            message.pTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.pTripleTerm);
                                            message.$predicate = "pTripleTerm";
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.oIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.oIri);
                                            message.$object = "oIri";
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 2)
                                                break;
                                            message.oBnode = reader.stringVerify();
                                            message.$object = "oBnode";
                                            continue;
                                        }
                                    case 11: {
                                            if (wireType !== 2)
                                                break;
                                            message.oLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.oLiteral);
                                            message.$object = "oLiteral";
                                            continue;
                                        }
                                    case 12: {
                                            if (wireType !== 2)
                                                break;
                                            message.oTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.oTripleTerm);
                                            message.$object = "oTripleTerm";
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfTriple message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfTriple
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple & eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape} RdfTriple
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfTriple.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfTriple;
                        })();

                        v1.RdfQuad = (function() {

                            /**
                             * Properties of a RdfQuad.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [sIri] RdfQuad sIri
                             * @property {string|null} [sBnode] RdfQuad sBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [sLiteral] RdfQuad sLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [sTripleTerm] RdfQuad sTripleTerm
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [pIri] RdfQuad pIri
                             * @property {string|null} [pBnode] RdfQuad pBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [pLiteral] RdfQuad pLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [pTripleTerm] RdfQuad pTripleTerm
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [oIri] RdfQuad oIri
                             * @property {string|null} [oBnode] RdfQuad oBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [oLiteral] RdfQuad oLiteral
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [oTripleTerm] RdfQuad oTripleTerm
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [gIri] RdfQuad gIri
                             * @property {string|null} [gBnode] RdfQuad gBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null} [gDefaultGraph] RdfQuad gDefaultGraph
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [gLiteral] RdfQuad gLiteral
                             * @property {"sIri"|"sBnode"|"sLiteral"|"sTripleTerm"} [subject] RdfQuad subject
                             * @property {"pIri"|"pBnode"|"pLiteral"|"pTripleTerm"} [predicate] RdfQuad predicate
                             * @property {"oIri"|"oBnode"|"oLiteral"|"oTripleTerm"} [object] RdfQuad object
                             * @property {"gIri"|"gBnode"|"gDefaultGraph"|"gLiteral"} [graph] RdfQuad graph
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfQuad.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfQuad
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties instead.
                             */

                            /**
                             * Narrowed shape of a RdfQuad.
                             * @typedef {{
                             *   sIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   sBnode?: string|null;
                             *   sLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   sTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   pIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   pBnode?: string|null;
                             *   pLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   pTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   oIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   oBnode?: string|null;
                             *   oLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   oTripleTerm?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   gIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   gBnode?: string|null;
                             *   gDefaultGraph?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape|null;
                             *   gLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * } & (
                             *   ({ subject?: undefined; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sIri"; sIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; sBnode?: null; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sBnode"; sIri?: null; sBnode: string; sLiteral?: null; sTripleTerm?: null }|{ subject?: "sLiteral"; sIri?: null; sBnode?: null; sLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; sTripleTerm?: null }|{ subject?: "sTripleTerm"; sIri?: null; sBnode?: null; sLiteral?: null; sTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                             * ) & (
                             *   ({ predicate?: undefined; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pIri"; pIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; pBnode?: null; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pBnode"; pIri?: null; pBnode: string; pLiteral?: null; pTripleTerm?: null }|{ predicate?: "pLiteral"; pIri?: null; pBnode?: null; pLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; pTripleTerm?: null }|{ predicate?: "pTripleTerm"; pIri?: null; pBnode?: null; pLiteral?: null; pTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                             * ) & (
                             *   ({ object?: undefined; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oIri"; oIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; oBnode?: null; oLiteral?: null; oTripleTerm?: null }|{ object?: "oBnode"; oIri?: null; oBnode: string; oLiteral?: null; oTripleTerm?: null }|{ object?: "oLiteral"; oIri?: null; oBnode?: null; oLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape; oTripleTerm?: null }|{ object?: "oTripleTerm"; oIri?: null; oBnode?: null; oLiteral?: null; oTripleTerm: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape })
                             * ) & (
                             *   ({ graph?: undefined; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gIri"; gIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gBnode"; gIri?: null; gBnode: string; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gDefaultGraph"; gIri?: null; gBnode?: null; gDefaultGraph: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape; gLiteral?: null }|{ graph?: "gLiteral"; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape })
                             * )} eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape
                             */

                            /**
                             * Constructs a new RdfQuad.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfQuad.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfQuad = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfQuad sIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} sIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.sIri = null;

                            /**
                             * RdfQuad sBnode.
                             * @member {string|null|undefined} sBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.sBnode = null;

                            /**
                             * RdfQuad sLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} sLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.sLiteral = null;

                            /**
                             * RdfQuad sTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} sTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.sTripleTerm = null;

                            /**
                             * RdfQuad pIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} pIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.pIri = null;

                            /**
                             * RdfQuad pBnode.
                             * @member {string|null|undefined} pBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.pBnode = null;

                            /**
                             * RdfQuad pLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} pLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.pLiteral = null;

                            /**
                             * RdfQuad pTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} pTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.pTripleTerm = null;

                            /**
                             * RdfQuad oIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} oIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.oIri = null;

                            /**
                             * RdfQuad oBnode.
                             * @member {string|null|undefined} oBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.oBnode = null;

                            /**
                             * RdfQuad oLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} oLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.oLiteral = null;

                            /**
                             * RdfQuad oTripleTerm.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} oTripleTerm
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.oTripleTerm = null;

                            /**
                             * RdfQuad gIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} gIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.gIri = null;

                            /**
                             * RdfQuad gBnode.
                             * @member {string|null|undefined} gBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.gBnode = null;

                            /**
                             * RdfQuad gDefaultGraph.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null|undefined} gDefaultGraph
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.gDefaultGraph = null;

                            /**
                             * RdfQuad gLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} gLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            RdfQuad.prototype.gLiteral = null;

                            // OneOf field names bound to virtual getters and setters
                            let $oneOfFields;

                            /**
                             * RdfQuad subject.
                             * @member {"sIri"|"sBnode"|"sLiteral"|"sTripleTerm"|undefined} subject
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            $Object.defineProperty(RdfQuad.prototype, "subject", {
                                get: $util.oneOfGetter($oneOfFields = ["sIri", "sBnode", "sLiteral", "sTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * RdfQuad predicate.
                             * @member {"pIri"|"pBnode"|"pLiteral"|"pTripleTerm"|undefined} predicate
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            $Object.defineProperty(RdfQuad.prototype, "predicate", {
                                get: $util.oneOfGetter($oneOfFields = ["pIri", "pBnode", "pLiteral", "pTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * RdfQuad object.
                             * @member {"oIri"|"oBnode"|"oLiteral"|"oTripleTerm"|undefined} object
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            $Object.defineProperty(RdfQuad.prototype, "object", {
                                get: $util.oneOfGetter($oneOfFields = ["oIri", "oBnode", "oLiteral", "oTripleTerm"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * RdfQuad graph.
                             * @member {"gIri"|"gBnode"|"gDefaultGraph"|"gLiteral"|undefined} graph
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @instance
                             */
                            $Object.defineProperty(RdfQuad.prototype, "graph", {
                                get: $util.oneOfGetter($oneOfFields = ["gIri", "gBnode", "gDefaultGraph", "gLiteral"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * Creates a new RdfQuad instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad} RdfQuad instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfQuad;
                             * }}
                             */
                            RdfQuad.create = function(properties) {
                                return new RdfQuad(properties);
                            };

                            /**
                             * Encodes the specified RdfQuad message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties} message RdfQuad message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfQuad.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.sIri != null && $Object.hasOwnProperty.call(message, "sIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.sIri, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                if (message.sBnode != null && $Object.hasOwnProperty.call(message, "sBnode"))
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.sBnode);
                                if (message.sLiteral != null && $Object.hasOwnProperty.call(message, "sLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.sLiteral, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                                if (message.sTripleTerm != null && $Object.hasOwnProperty.call(message, "sTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.sTripleTerm, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                                if (message.pIri != null && $Object.hasOwnProperty.call(message, "pIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.pIri, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                                if (message.pBnode != null && $Object.hasOwnProperty.call(message, "pBnode"))
                                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.pBnode);
                                if (message.pLiteral != null && $Object.hasOwnProperty.call(message, "pLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.pLiteral, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
                                if (message.pTripleTerm != null && $Object.hasOwnProperty.call(message, "pTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.pTripleTerm, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
                                if (message.oIri != null && $Object.hasOwnProperty.call(message, "oIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.oIri, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                                if (message.oBnode != null && $Object.hasOwnProperty.call(message, "oBnode"))
                                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.oBnode);
                                if (message.oLiteral != null && $Object.hasOwnProperty.call(message, "oLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.oLiteral, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                                if (message.oTripleTerm != null && $Object.hasOwnProperty.call(message, "oTripleTerm"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.oTripleTerm, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
                                if (message.gIri != null && $Object.hasOwnProperty.call(message, "gIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.gIri, writer.uint32(/* id 13, wireType 2 =*/106).fork(), _depth + 1).ldelim();
                                if (message.gBnode != null && $Object.hasOwnProperty.call(message, "gBnode"))
                                    writer.uint32(/* id 14, wireType 2 =*/114).string(message.gBnode);
                                if (message.gDefaultGraph != null && $Object.hasOwnProperty.call(message, "gDefaultGraph"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.encode(message.gDefaultGraph, writer.uint32(/* id 15, wireType 2 =*/122).fork(), _depth + 1).ldelim();
                                if (message.gLiteral != null && $Object.hasOwnProperty.call(message, "gLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.gLiteral, writer.uint32(/* id 16, wireType 2 =*/130).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfQuad message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties} message RdfQuad message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfQuad.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfQuad message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape} RdfQuad
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfQuad.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfQuad();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            message.sIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.sIri);
                                            message.$subject = "sIri";
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.sBnode = reader.stringVerify();
                                            message.$subject = "sBnode";
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 2)
                                                break;
                                            message.sLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.sLiteral);
                                            message.$subject = "sLiteral";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.sTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.sTripleTerm);
                                            message.$subject = "sTripleTerm";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.pIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.pIri);
                                            message.$predicate = "pIri";
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType !== 2)
                                                break;
                                            message.pBnode = reader.stringVerify();
                                            message.$predicate = "pBnode";
                                            continue;
                                        }
                                    case 7: {
                                            if (wireType !== 2)
                                                break;
                                            message.pLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.pLiteral);
                                            message.$predicate = "pLiteral";
                                            continue;
                                        }
                                    case 8: {
                                            if (wireType !== 2)
                                                break;
                                            message.pTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.pTripleTerm);
                                            message.$predicate = "pTripleTerm";
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.oIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.oIri);
                                            message.$object = "oIri";
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 2)
                                                break;
                                            message.oBnode = reader.stringVerify();
                                            message.$object = "oBnode";
                                            continue;
                                        }
                                    case 11: {
                                            if (wireType !== 2)
                                                break;
                                            message.oLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.oLiteral);
                                            message.$object = "oLiteral";
                                            continue;
                                        }
                                    case 12: {
                                            if (wireType !== 2)
                                                break;
                                            message.oTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.oTripleTerm);
                                            message.$object = "oTripleTerm";
                                            continue;
                                        }
                                    case 13: {
                                            if (wireType !== 2)
                                                break;
                                            message.gIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.gIri);
                                            message.$graph = "gIri";
                                            continue;
                                        }
                                    case 14: {
                                            if (wireType !== 2)
                                                break;
                                            message.gBnode = reader.stringVerify();
                                            message.$graph = "gBnode";
                                            continue;
                                        }
                                    case 15: {
                                            if (wireType !== 2)
                                                break;
                                            message.gDefaultGraph = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.decode(reader, reader.size(), $undefined, _depth + 1, message.gDefaultGraph);
                                            message.$graph = "gDefaultGraph";
                                            continue;
                                        }
                                    case 16: {
                                            if (wireType !== 2)
                                                break;
                                            message.gLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.gLiteral);
                                            message.$graph = "gLiteral";
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfQuad message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfQuad
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad & eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape} RdfQuad
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfQuad.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfQuad;
                        })();

                        v1.RdfGraphStart = (function() {

                            /**
                             * Properties of a RdfGraphStart.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null} [gIri] RdfGraphStart gIri
                             * @property {string|null} [gBnode] RdfGraphStart gBnode
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null} [gDefaultGraph] RdfGraphStart gDefaultGraph
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null} [gLiteral] RdfGraphStart gLiteral
                             * @property {"gIri"|"gBnode"|"gDefaultGraph"|"gLiteral"} [graph] RdfGraphStart graph
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfGraphStart.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfGraphStart
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties instead.
                             */

                            /**
                             * Narrowed shape of a RdfGraphStart.
                             * @typedef {{
                             *   gIri?: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape|null;
                             *   gBnode?: string|null;
                             *   gDefaultGraph?: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape|null;
                             *   gLiteral?: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * } & (
                             *   ({ graph?: undefined; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gIri"; gIri: eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Shape; gBnode?: null; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gBnode"; gIri?: null; gBnode: string; gDefaultGraph?: null; gLiteral?: null }|{ graph?: "gDefaultGraph"; gIri?: null; gBnode?: null; gDefaultGraph: eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Shape; gLiteral?: null }|{ graph?: "gLiteral"; gIri?: null; gBnode?: null; gDefaultGraph?: null; gLiteral: eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Shape })
                             * )} eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape
                             */

                            /**
                             * Constructs a new RdfGraphStart.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfGraphStart.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfGraphStart = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfGraphStart gIri.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfIri.$Properties|null|undefined} gIri
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @instance
                             */
                            RdfGraphStart.prototype.gIri = null;

                            /**
                             * RdfGraphStart gBnode.
                             * @member {string|null|undefined} gBnode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @instance
                             */
                            RdfGraphStart.prototype.gBnode = null;

                            /**
                             * RdfGraphStart gDefaultGraph.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.$Properties|null|undefined} gDefaultGraph
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @instance
                             */
                            RdfGraphStart.prototype.gDefaultGraph = null;

                            /**
                             * RdfGraphStart gLiteral.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties|null|undefined} gLiteral
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @instance
                             */
                            RdfGraphStart.prototype.gLiteral = null;

                            // OneOf field names bound to virtual getters and setters
                            let $oneOfFields;

                            /**
                             * RdfGraphStart graph.
                             * @member {"gIri"|"gBnode"|"gDefaultGraph"|"gLiteral"|undefined} graph
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @instance
                             */
                            $Object.defineProperty(RdfGraphStart.prototype, "graph", {
                                get: $util.oneOfGetter($oneOfFields = ["gIri", "gBnode", "gDefaultGraph", "gLiteral"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * Creates a new RdfGraphStart instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart} RdfGraphStart instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart;
                             * }}
                             */
                            RdfGraphStart.create = function(properties) {
                                return new RdfGraphStart(properties);
                            };

                            /**
                             * Encodes the specified RdfGraphStart message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties} message RdfGraphStart message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfGraphStart.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.gIri != null && $Object.hasOwnProperty.call(message, "gIri"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.gIri, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                if (message.gBnode != null && $Object.hasOwnProperty.call(message, "gBnode"))
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.gBnode);
                                if (message.gDefaultGraph != null && $Object.hasOwnProperty.call(message, "gDefaultGraph"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.encode(message.gDefaultGraph, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                                if (message.gLiteral != null && $Object.hasOwnProperty.call(message, "gLiteral"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.gLiteral, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfGraphStart message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties} message RdfGraphStart message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfGraphStart.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfGraphStart message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape} RdfGraphStart
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfGraphStart.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            message.gIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.size(), $undefined, _depth + 1, message.gIri);
                                            message.$graph = "gIri";
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.gBnode = reader.stringVerify();
                                            message.$graph = "gBnode";
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 2)
                                                break;
                                            message.gDefaultGraph = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.decode(reader, reader.size(), $undefined, _depth + 1, message.gDefaultGraph);
                                            message.$graph = "gDefaultGraph";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.gLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.size(), $undefined, _depth + 1, message.gLiteral);
                                            message.$graph = "gLiteral";
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfGraphStart message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape} RdfGraphStart
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfGraphStart.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfGraphStart;
                        })();

                        v1.RdfGraphEnd = (function() {

                            /**
                             * Properties of a RdfGraphEnd.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfGraphEnd.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfGraphEnd
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties instead.
                             */

                            /**
                             * Shape of a RdfGraphEnd.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape
                             */

                            /**
                             * Constructs a new RdfGraphEnd.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfGraphEnd.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfGraphEnd = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * Creates a new RdfGraphEnd instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd} RdfGraphEnd instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd;
                             * }}
                             */
                            RdfGraphEnd.create = function(properties) {
                                return new RdfGraphEnd(properties);
                            };

                            /**
                             * Encodes the specified RdfGraphEnd message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties} message RdfGraphEnd message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfGraphEnd.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfGraphEnd message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties} message RdfGraphEnd message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfGraphEnd.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfGraphEnd message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape} RdfGraphEnd
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfGraphEnd.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    reader.skipType(tag & 7, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfGraphEnd message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd & eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape} RdfGraphEnd
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfGraphEnd.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfGraphEnd;
                        })();

                        v1.RdfNameEntry = (function() {

                            /**
                             * Properties of a RdfNameEntry.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties
                             * @property {number|null} [id] RdfNameEntry id
                             * @property {string|null} [value] RdfNameEntry value
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfNameEntry.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfNameEntry
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties instead.
                             */

                            /**
                             * Shape of a RdfNameEntry.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape
                             */

                            /**
                             * Constructs a new RdfNameEntry.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfNameEntry.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfNameEntry = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfNameEntry id.
                             * @member {number} id
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @instance
                             */
                            RdfNameEntry.prototype.id = 0;

                            /**
                             * RdfNameEntry value.
                             * @member {string} value
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @instance
                             */
                            RdfNameEntry.prototype.value = "";

                            /**
                             * Creates a new RdfNameEntry instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry} RdfNameEntry instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry;
                             * }}
                             */
                            RdfNameEntry.create = function(properties) {
                                return new RdfNameEntry(properties);
                            };

                            /**
                             * Encodes the specified RdfNameEntry message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties} message RdfNameEntry message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfNameEntry.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                                if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== "")
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfNameEntry message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties} message RdfNameEntry message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfNameEntry.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfNameEntry message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape} RdfNameEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfNameEntry.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.id = value;
                                            else
                                                delete message.id;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.stringVerify()).length)
                                                message.value = value;
                                            else
                                                delete message.value;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfNameEntry message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape} RdfNameEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfNameEntry.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfNameEntry;
                        })();

                        v1.RdfPrefixEntry = (function() {

                            /**
                             * Properties of a RdfPrefixEntry.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties
                             * @property {number|null} [id] RdfPrefixEntry id
                             * @property {string|null} [value] RdfPrefixEntry value
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfPrefixEntry.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfPrefixEntry
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties instead.
                             */

                            /**
                             * Shape of a RdfPrefixEntry.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape
                             */

                            /**
                             * Constructs a new RdfPrefixEntry.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfPrefixEntry.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfPrefixEntry = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfPrefixEntry id.
                             * @member {number} id
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @instance
                             */
                            RdfPrefixEntry.prototype.id = 0;

                            /**
                             * RdfPrefixEntry value.
                             * @member {string} value
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @instance
                             */
                            RdfPrefixEntry.prototype.value = "";

                            /**
                             * Creates a new RdfPrefixEntry instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry} RdfPrefixEntry instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry;
                             * }}
                             */
                            RdfPrefixEntry.create = function(properties) {
                                return new RdfPrefixEntry(properties);
                            };

                            /**
                             * Encodes the specified RdfPrefixEntry message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties} message RdfPrefixEntry message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfPrefixEntry.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                                if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== "")
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfPrefixEntry message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties} message RdfPrefixEntry message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfPrefixEntry.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfPrefixEntry message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape} RdfPrefixEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfPrefixEntry.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.id = value;
                                            else
                                                delete message.id;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.stringVerify()).length)
                                                message.value = value;
                                            else
                                                delete message.value;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfPrefixEntry message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape} RdfPrefixEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfPrefixEntry.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfPrefixEntry;
                        })();

                        v1.RdfDatatypeEntry = (function() {

                            /**
                             * Properties of a RdfDatatypeEntry.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties
                             * @property {number|null} [id] RdfDatatypeEntry id
                             * @property {string|null} [value] RdfDatatypeEntry value
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfDatatypeEntry.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfDatatypeEntry
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties instead.
                             */

                            /**
                             * Shape of a RdfDatatypeEntry.
                             * @typedef {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties} eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape
                             */

                            /**
                             * Constructs a new RdfDatatypeEntry.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfDatatypeEntry.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfDatatypeEntry = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfDatatypeEntry id.
                             * @member {number} id
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @instance
                             */
                            RdfDatatypeEntry.prototype.id = 0;

                            /**
                             * RdfDatatypeEntry value.
                             * @member {string} value
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @instance
                             */
                            RdfDatatypeEntry.prototype.value = "";

                            /**
                             * Creates a new RdfDatatypeEntry instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry} RdfDatatypeEntry instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry;
                             * }}
                             */
                            RdfDatatypeEntry.create = function(properties) {
                                return new RdfDatatypeEntry(properties);
                            };

                            /**
                             * Encodes the specified RdfDatatypeEntry message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties} message RdfDatatypeEntry message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfDatatypeEntry.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                                if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== "")
                                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfDatatypeEntry message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties} message RdfDatatypeEntry message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfDatatypeEntry.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfDatatypeEntry message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape} RdfDatatypeEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfDatatypeEntry.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message, value;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 0)
                                                break;
                                            if (value = reader.uint32())
                                                message.id = value;
                                            else
                                                delete message.id;
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            if ((value = reader.stringVerify()).length)
                                                message.value = value;
                                            else
                                                delete message.value;
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfDatatypeEntry message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry & eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape} RdfDatatypeEntry
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfDatatypeEntry.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfDatatypeEntry;
                        })();

                        /**
                         * LogicalStreamType enum.
                         * @name eu.ostrzyciel.jelly.core.proto.v1.LogicalStreamType
                         * @enum {number}
                         * @property {number} LOGICAL_STREAM_TYPE_UNSPECIFIED=0 LOGICAL_STREAM_TYPE_UNSPECIFIED value
                         * @property {number} LOGICAL_STREAM_TYPE_FLAT_TRIPLES=1 LOGICAL_STREAM_TYPE_FLAT_TRIPLES value
                         * @property {number} LOGICAL_STREAM_TYPE_FLAT_QUADS=2 LOGICAL_STREAM_TYPE_FLAT_QUADS value
                         * @property {number} LOGICAL_STREAM_TYPE_GRAPHS=3 LOGICAL_STREAM_TYPE_GRAPHS value
                         * @property {number} LOGICAL_STREAM_TYPE_DATASETS=4 LOGICAL_STREAM_TYPE_DATASETS value
                         * @property {number} LOGICAL_STREAM_TYPE_SUBJECT_GRAPHS=13 LOGICAL_STREAM_TYPE_SUBJECT_GRAPHS value
                         * @property {number} LOGICAL_STREAM_TYPE_NAMED_GRAPHS=14 LOGICAL_STREAM_TYPE_NAMED_GRAPHS value
                         * @property {number} LOGICAL_STREAM_TYPE_TIMESTAMPED_NAMED_GRAPHS=114 LOGICAL_STREAM_TYPE_TIMESTAMPED_NAMED_GRAPHS value
                         */
                        v1.LogicalStreamType = (function() {
                            const valuesById = $Object.create(null), values = $Object.create(valuesById);
                            values[valuesById[0] = "LOGICAL_STREAM_TYPE_UNSPECIFIED"] = 0;
                            values[valuesById[1] = "LOGICAL_STREAM_TYPE_FLAT_TRIPLES"] = 1;
                            values[valuesById[2] = "LOGICAL_STREAM_TYPE_FLAT_QUADS"] = 2;
                            values[valuesById[3] = "LOGICAL_STREAM_TYPE_GRAPHS"] = 3;
                            values[valuesById[4] = "LOGICAL_STREAM_TYPE_DATASETS"] = 4;
                            values[valuesById[13] = "LOGICAL_STREAM_TYPE_SUBJECT_GRAPHS"] = 13;
                            values[valuesById[14] = "LOGICAL_STREAM_TYPE_NAMED_GRAPHS"] = 14;
                            values[valuesById[114] = "LOGICAL_STREAM_TYPE_TIMESTAMPED_NAMED_GRAPHS"] = 114;
                            return values;
                        })();

                        v1.RdfStreamRow = (function() {

                            /**
                             * Properties of a RdfStreamRow.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties|null} [options] RdfStreamRow options
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null} [triple] RdfStreamRow triple
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties|null} [quad] RdfStreamRow quad
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties|null} [graphStart] RdfStreamRow graphStart
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties|null} [graphEnd] RdfStreamRow graphEnd
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties|null} [namespace] RdfStreamRow namespace
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties|null} [name] RdfStreamRow name
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties|null} [prefix] RdfStreamRow prefix
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties|null} [datatype] RdfStreamRow datatype
                             * @property {"options"|"triple"|"quad"|"graphStart"|"graphEnd"|"namespace"|"name"|"prefix"|"datatype"} [row] RdfStreamRow row
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */

                            /**
                             * Properties of a RdfStreamRow.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @interface IRdfStreamRow
                             * @augments eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties
                             * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties instead.
                             */

                            /**
                             * Narrowed shape of a RdfStreamRow.
                             * @typedef {{
                             *   options?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape|null;
                             *   triple?: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape|null;
                             *   quad?: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape|null;
                             *   graphStart?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape|null;
                             *   graphEnd?: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape|null;
                             *   namespace?: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape|null;
                             *   name?: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape|null;
                             *   prefix?: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape|null;
                             *   datatype?: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape|null;
                             *   $unknowns?: Array.<Uint8Array>;
                             * } & (
                             *   ({ row?: undefined; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "options"; options: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Shape; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "triple"; options?: null; triple: eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Shape; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "quad"; options?: null; triple?: null; quad: eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Shape; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "graphStart"; options?: null; triple?: null; quad?: null; graphStart: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Shape; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "graphEnd"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd: eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Shape; namespace?: null; name?: null; prefix?: null; datatype?: null }|{ row?: "namespace"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace: eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Shape; name?: null; prefix?: null; datatype?: null }|{ row?: "name"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name: eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Shape; prefix?: null; datatype?: null }|{ row?: "prefix"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix: eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Shape; datatype?: null }|{ row?: "datatype"; options?: null; triple?: null; quad?: null; graphStart?: null; graphEnd?: null; namespace?: null; name?: null; prefix?: null; datatype: eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Shape })
                             * )} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape
                             */

                            /**
                             * Constructs a new RdfStreamRow.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @classdesc Represents a RdfStreamRow.
                             * @constructor
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties=} [properties] Properties to set
                             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                             */
                            const RdfStreamRow = function (properties) {
                                if (properties)
                                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                            this[keys[i]] = properties[keys[i]];
                            };

                            /**
                             * RdfStreamRow options.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties|null|undefined} options
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.options = null;

                            /**
                             * RdfStreamRow triple.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.$Properties|null|undefined} triple
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.triple = null;

                            /**
                             * RdfStreamRow quad.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.$Properties|null|undefined} quad
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.quad = null;

                            /**
                             * RdfStreamRow graphStart.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.$Properties|null|undefined} graphStart
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.graphStart = null;

                            /**
                             * RdfStreamRow graphEnd.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.$Properties|null|undefined} graphEnd
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.graphEnd = null;

                            /**
                             * RdfStreamRow namespace.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.$Properties|null|undefined} namespace
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.namespace = null;

                            /**
                             * RdfStreamRow name.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.$Properties|null|undefined} name
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.name = null;

                            /**
                             * RdfStreamRow prefix.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.$Properties|null|undefined} prefix
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.prefix = null;

                            /**
                             * RdfStreamRow datatype.
                             * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.$Properties|null|undefined} datatype
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            RdfStreamRow.prototype.datatype = null;

                            // OneOf field names bound to virtual getters and setters
                            let $oneOfFields;

                            /**
                             * RdfStreamRow row.
                             * @member {"options"|"triple"|"quad"|"graphStart"|"graphEnd"|"namespace"|"name"|"prefix"|"datatype"|undefined} row
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @instance
                             */
                            $Object.defineProperty(RdfStreamRow.prototype, "row", {
                                get: $util.oneOfGetter($oneOfFields = ["options", "triple", "quad", "graphStart", "graphEnd", "namespace", "name", "prefix", "datatype"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            /**
                             * Creates a new RdfStreamRow instance using the specified properties.
                             * @function create
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties=} [properties] Properties to set
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow} RdfStreamRow instance
                             * @type {{
                             *   (properties: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape;
                             *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties): eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow;
                             * }}
                             */
                            RdfStreamRow.create = function(properties) {
                                return new RdfStreamRow(properties);
                            };

                            /**
                             * Encodes the specified RdfStreamRow message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.verify|verify} messages.
                             * @function encode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties} message RdfStreamRow message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfStreamRow.encode = function (message, writer, _depth) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $util.recursionLimit)
                                    throw $Error("max depth exceeded");
                                if (message.options != null && $Object.hasOwnProperty.call(message, "options"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.encode(message.options, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                if (message.triple != null && $Object.hasOwnProperty.call(message, "triple"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.triple, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                                if (message.quad != null && $Object.hasOwnProperty.call(message, "quad"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.encode(message.quad, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                                if (message.graphStart != null && $Object.hasOwnProperty.call(message, "graphStart"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.encode(message.graphStart, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                                if (message.graphEnd != null && $Object.hasOwnProperty.call(message, "graphEnd"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.encode(message.graphEnd, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                                if (message.namespace != null && $Object.hasOwnProperty.call(message, "namespace"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.encode(message.namespace, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                                if (message.name != null && $Object.hasOwnProperty.call(message, "name"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.encode(message.name, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                                if (message.prefix != null && $Object.hasOwnProperty.call(message, "prefix"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.encode(message.prefix, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
                                if (message.datatype != null && $Object.hasOwnProperty.call(message, "datatype"))
                                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.encode(message.datatype, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                    for (let i = 0; i < message.$unknowns.length; ++i)
                                        writer.raw(message.$unknowns[i]);
                                return writer;
                            };

                            /**
                             * Encodes the specified RdfStreamRow message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @static
                             * @param {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties} message RdfStreamRow message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            RdfStreamRow.encodeDelimited = function(message, writer) {
                                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                            };

                            /**
                             * Decodes a RdfStreamRow message from the specified reader or buffer.
                             * @function decode
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape} RdfStreamRow
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfStreamRow.decode = function (reader, length, _end, _depth, _target) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                if (_depth === $undefined)
                                    _depth = 0;
                                if (_depth > $Reader.recursionLimit)
                                    throw $Error("max depth exceeded");
                                let end, message;
                                if (length === $undefined)
                                    end = reader.len;
                                else {
                                    end = reader.pos + length;
                                    if (end > reader.len)
                                        throw $RangeError("index out of range");
                                    length = reader.len;
                                    reader.len = end;
                                }
                                message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow();
                                while (reader.pos < end) {
                                    let start = reader.pos;
                                    let tag = reader.tag();
                                    if (tag === _end) {
                                        _end = $undefined;
                                        break;
                                    }
                                    let wireType = tag & 7;
                                    switch (tag >>>= 3) {
                                    case 1: {
                                            if (wireType !== 2)
                                                break;
                                            message.options = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.decode(reader, reader.size(), $undefined, _depth + 1, message.options);
                                            message.$row = "options";
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.triple = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.size(), $undefined, _depth + 1, message.triple);
                                            message.$row = "triple";
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 2)
                                                break;
                                            message.quad = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.decode(reader, reader.size(), $undefined, _depth + 1, message.quad);
                                            message.$row = "quad";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.graphStart = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.decode(reader, reader.size(), $undefined, _depth + 1, message.graphStart);
                                            message.$row = "graphStart";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.graphEnd = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.decode(reader, reader.size(), $undefined, _depth + 1, message.graphEnd);
                                            message.$row = "graphEnd";
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType !== 2)
                                                break;
                                            message.namespace = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.decode(reader, reader.size(), $undefined, _depth + 1, message.namespace);
                                            message.$row = "namespace";
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.name = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.decode(reader, reader.size(), $undefined, _depth + 1, message.name);
                                            message.$row = "name";
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 2)
                                                break;
                                            message.prefix = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.decode(reader, reader.size(), $undefined, _depth + 1, message.prefix);
                                            message.$row = "prefix";
                                            continue;
                                        }
                                    case 11: {
                                            if (wireType !== 2)
                                                break;
                                            message.datatype = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.decode(reader, reader.size(), $undefined, _depth + 1, message.datatype);
                                            message.$row = "datatype";
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
                                }
                                if (length !== $undefined) {
                                    if (reader.pos !== end)
                                        throw $RangeError("index out of range");
                                    reader.len = length;
                                }
                                if (_end !== $undefined)
                                    throw $Error("missing end group");
                                return message;
                            };

                            /**
                             * Decodes a RdfStreamRow message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow & eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Shape} RdfStreamRow
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            RdfStreamRow.decodeDelimited = function(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.size());
                            };

                            return RdfStreamRow;
                        })();

                        v1.sparql = (function() {

                            /**
                             * Namespace sparql.
                             * @memberof eu.ostrzyciel.jelly.core.proto.v1
                             * @namespace
                             */
                            const sparql = {};

                            sparql.SparqlResultsOptions = (function() {

                                /**
                                 * Properties of a SparqlResultsOptions.
                                 * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties
                                 * @property {string|null} [streamName] SparqlResultsOptions streamName
                                 * @property {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlStreamType|null} [streamType] SparqlResultsOptions streamType
                                 * @property {eu.ostrzyciel.jelly.core.proto.v1.RdfVersion|null} [rdfVersion] SparqlResultsOptions rdfVersion
                                 * @property {number|null} [maxNameTableSize] SparqlResultsOptions maxNameTableSize
                                 * @property {number|null} [maxPrefixTableSize] SparqlResultsOptions maxPrefixTableSize
                                 * @property {number|null} [maxDatatypeTableSize] SparqlResultsOptions maxDatatypeTableSize
                                 * @property {number|null} [version] SparqlResultsOptions version
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */

                                /**
                                 * Properties of a SparqlResultsOptions.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @interface ISparqlResultsOptions
                                 * @augments eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties
                                 * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties instead.
                                 */

                                /**
                                 * Shape of a SparqlResultsOptions.
                                 * @typedef {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape
                                 */

                                /**
                                 * Constructs a new SparqlResultsOptions.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @classdesc Represents a SparqlResultsOptions.
                                 * @constructor
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties=} [properties] Properties to set
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */
                                const SparqlResultsOptions = function (properties) {
                                    if (properties)
                                        for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                                this[keys[i]] = properties[keys[i]];
                                };

                                /**
                                 * SparqlResultsOptions streamName.
                                 * @member {string} streamName
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.streamName = "";

                                /**
                                 * SparqlResultsOptions streamType.
                                 * @member {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlStreamType} streamType
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.streamType = 0;

                                /**
                                 * SparqlResultsOptions rdfVersion.
                                 * @member {eu.ostrzyciel.jelly.core.proto.v1.RdfVersion} rdfVersion
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.rdfVersion = 0;

                                /**
                                 * SparqlResultsOptions maxNameTableSize.
                                 * @member {number} maxNameTableSize
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.maxNameTableSize = 0;

                                /**
                                 * SparqlResultsOptions maxPrefixTableSize.
                                 * @member {number} maxPrefixTableSize
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.maxPrefixTableSize = 0;

                                /**
                                 * SparqlResultsOptions maxDatatypeTableSize.
                                 * @member {number} maxDatatypeTableSize
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.maxDatatypeTableSize = 0;

                                /**
                                 * SparqlResultsOptions version.
                                 * @member {number} version
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @instance
                                 */
                                SparqlResultsOptions.prototype.version = 0;

                                /**
                                 * Creates a new SparqlResultsOptions instance using the specified properties.
                                 * @function create
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties=} [properties] Properties to set
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions} SparqlResultsOptions instance
                                 * @type {{
                                 *   (properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape;
                                 *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions;
                                 * }}
                                 */
                                SparqlResultsOptions.create = function(properties) {
                                    return new SparqlResultsOptions(properties);
                                };

                                /**
                                 * Encodes the specified SparqlResultsOptions message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.verify|verify} messages.
                                 * @function encode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties} message SparqlResultsOptions message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlResultsOptions.encode = function (message, writer, _depth) {
                                    if (!writer)
                                        writer = $Writer.create();
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $util.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    if (message.streamName != null && $Object.hasOwnProperty.call(message, "streamName") && message.streamName !== "")
                                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.streamName);
                                    if (message.streamType != null && $Object.hasOwnProperty.call(message, "streamType") && message.streamType !== 0)
                                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.streamType);
                                    if (message.rdfVersion != null && $Object.hasOwnProperty.call(message, "rdfVersion") && message.rdfVersion !== 0)
                                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.rdfVersion);
                                    if (message.maxNameTableSize != null && $Object.hasOwnProperty.call(message, "maxNameTableSize") && message.maxNameTableSize !== 0)
                                        writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.maxNameTableSize);
                                    if (message.maxPrefixTableSize != null && $Object.hasOwnProperty.call(message, "maxPrefixTableSize") && message.maxPrefixTableSize !== 0)
                                        writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.maxPrefixTableSize);
                                    if (message.maxDatatypeTableSize != null && $Object.hasOwnProperty.call(message, "maxDatatypeTableSize") && message.maxDatatypeTableSize !== 0)
                                        writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.maxDatatypeTableSize);
                                    if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                                        writer.uint32(/* id 15, wireType 0 =*/120).uint32(message.version);
                                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                        for (let i = 0; i < message.$unknowns.length; ++i)
                                            writer.raw(message.$unknowns[i]);
                                    return writer;
                                };

                                /**
                                 * Encodes the specified SparqlResultsOptions message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.verify|verify} messages.
                                 * @function encodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties} message SparqlResultsOptions message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlResultsOptions.encodeDelimited = function(message, writer) {
                                    return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                                };

                                /**
                                 * Decodes a SparqlResultsOptions message from the specified reader or buffer.
                                 * @function decode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @param {number} [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape} SparqlResultsOptions
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlResultsOptions.decode = function (reader, length, _end, _depth, _target) {
                                    if (!(reader instanceof $Reader))
                                        reader = $Reader.create(reader);
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $Reader.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    let end, message, value;
                                    if (length === $undefined)
                                        end = reader.len;
                                    else {
                                        end = reader.pos + length;
                                        if (end > reader.len)
                                            throw $RangeError("index out of range");
                                        length = reader.len;
                                        reader.len = end;
                                    }
                                    message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions();
                                    while (reader.pos < end) {
                                        let start = reader.pos;
                                        let tag = reader.tag();
                                        if (tag === _end) {
                                            _end = $undefined;
                                            break;
                                        }
                                        let wireType = tag & 7;
                                        switch (tag >>>= 3) {
                                        case 1: {
                                                if (wireType !== 2)
                                                    break;
                                                if ((value = reader.stringVerify()).length)
                                                    message.streamName = value;
                                                else
                                                    delete message.streamName;
                                                continue;
                                            }
                                        case 2: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.int32())
                                                    message.streamType = value;
                                                else
                                                    delete message.streamType;
                                                continue;
                                            }
                                        case 5: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.int32())
                                                    message.rdfVersion = value;
                                                else
                                                    delete message.rdfVersion;
                                                continue;
                                            }
                                        case 9: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.uint32())
                                                    message.maxNameTableSize = value;
                                                else
                                                    delete message.maxNameTableSize;
                                                continue;
                                            }
                                        case 10: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.uint32())
                                                    message.maxPrefixTableSize = value;
                                                else
                                                    delete message.maxPrefixTableSize;
                                                continue;
                                            }
                                        case 11: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.uint32())
                                                    message.maxDatatypeTableSize = value;
                                                else
                                                    delete message.maxDatatypeTableSize;
                                                continue;
                                            }
                                        case 15: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.uint32())
                                                    message.version = value;
                                                else
                                                    delete message.version;
                                                continue;
                                            }
                                        }
                                        reader.skipType(wireType, _depth, tag);
                                        if (!reader.discardUnknown) {
                                            $util.makeProp(message, "$unknowns", false);
                                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                        }
                                    }
                                    if (length !== $undefined) {
                                        if (reader.pos !== end)
                                            throw $RangeError("index out of range");
                                        reader.len = length;
                                    }
                                    if (_end !== $undefined)
                                        throw $Error("missing end group");
                                    return message;
                                };

                                /**
                                 * Decodes a SparqlResultsOptions message from the specified reader or buffer, length delimited.
                                 * @function decodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape} SparqlResultsOptions
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlResultsOptions.decodeDelimited = function(reader) {
                                    if (!(reader instanceof $Reader))
                                        reader = new $Reader(reader);
                                    return this.decode(reader, reader.size());
                                };

                                return SparqlResultsOptions;
                            })();

                            /**
                             * SparqlStreamType enum.
                             * @name eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlStreamType
                             * @enum {number}
                             * @property {number} SPARQL_STREAM_TYPE_FLAT=0 SPARQL_STREAM_TYPE_FLAT value
                             * @property {number} SPARQL_STREAM_TYPE_PUNCTUATED=1 SPARQL_STREAM_TYPE_PUNCTUATED value
                             */
                            sparql.SparqlStreamType = (function() {
                                const valuesById = $Object.create(null), values = $Object.create(valuesById);
                                values[valuesById[0] = "SPARQL_STREAM_TYPE_FLAT"] = 0;
                                values[valuesById[1] = "SPARQL_STREAM_TYPE_PUNCTUATED"] = 1;
                                return values;
                            })();

                            sparql.SparqlAskResult = (function() {

                                /**
                                 * Properties of a SparqlAskResult.
                                 * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties
                                 * @property {boolean|null} [value] SparqlAskResult value
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */

                                /**
                                 * Properties of a SparqlAskResult.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @interface ISparqlAskResult
                                 * @augments eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties
                                 * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties instead.
                                 */

                                /**
                                 * Shape of a SparqlAskResult.
                                 * @typedef {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape
                                 */

                                /**
                                 * Constructs a new SparqlAskResult.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @classdesc Represents a SparqlAskResult.
                                 * @constructor
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties=} [properties] Properties to set
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */
                                const SparqlAskResult = function (properties) {
                                    if (properties)
                                        for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                                this[keys[i]] = properties[keys[i]];
                                };

                                /**
                                 * SparqlAskResult value.
                                 * @member {boolean} value
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult
                                 * @instance
                                 */
                                SparqlAskResult.prototype.value = false;

                                /**
                                 * Creates a new SparqlAskResult instance using the specified properties.
                                 * @function create
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties=} [properties] Properties to set
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult} SparqlAskResult instance
                                 * @type {{
                                 *   (properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape;
                                 *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult;
                                 * }}
                                 */
                                SparqlAskResult.create = function(properties) {
                                    return new SparqlAskResult(properties);
                                };

                                /**
                                 * Encodes the specified SparqlAskResult message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.verify|verify} messages.
                                 * @function encode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties} message SparqlAskResult message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlAskResult.encode = function (message, writer, _depth) {
                                    if (!writer)
                                        writer = $Writer.create();
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $util.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== false)
                                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
                                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                        for (let i = 0; i < message.$unknowns.length; ++i)
                                            writer.raw(message.$unknowns[i]);
                                    return writer;
                                };

                                /**
                                 * Encodes the specified SparqlAskResult message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.verify|verify} messages.
                                 * @function encodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties} message SparqlAskResult message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlAskResult.encodeDelimited = function(message, writer) {
                                    return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                                };

                                /**
                                 * Decodes a SparqlAskResult message from the specified reader or buffer.
                                 * @function decode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @param {number} [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape} SparqlAskResult
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlAskResult.decode = function (reader, length, _end, _depth, _target) {
                                    if (!(reader instanceof $Reader))
                                        reader = $Reader.create(reader);
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $Reader.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    let end, message, value;
                                    if (length === $undefined)
                                        end = reader.len;
                                    else {
                                        end = reader.pos + length;
                                        if (end > reader.len)
                                            throw $RangeError("index out of range");
                                        length = reader.len;
                                        reader.len = end;
                                    }
                                    message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult();
                                    while (reader.pos < end) {
                                        let start = reader.pos;
                                        let tag = reader.tag();
                                        if (tag === _end) {
                                            _end = $undefined;
                                            break;
                                        }
                                        let wireType = tag & 7;
                                        switch (tag >>>= 3) {
                                        case 1: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.bool())
                                                    message.value = value;
                                                else
                                                    delete message.value;
                                                continue;
                                            }
                                        }
                                        reader.skipType(wireType, _depth, tag);
                                        if (!reader.discardUnknown) {
                                            $util.makeProp(message, "$unknowns", false);
                                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                        }
                                    }
                                    if (length !== $undefined) {
                                        if (reader.pos !== end)
                                            throw $RangeError("index out of range");
                                        reader.len = length;
                                    }
                                    if (_end !== $undefined)
                                        throw $Error("missing end group");
                                    return message;
                                };

                                /**
                                 * Decodes a SparqlAskResult message from the specified reader or buffer, length delimited.
                                 * @function decodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape} SparqlAskResult
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlAskResult.decodeDelimited = function(reader) {
                                    if (!(reader instanceof $Reader))
                                        reader = new $Reader(reader);
                                    return this.decode(reader, reader.size());
                                };

                                return SparqlAskResult;
                            })();

                            sparql.SparqlResultsTrailer = (function() {

                                /**
                                 * Properties of a SparqlResultsTrailer.
                                 * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties
                                 * @property {string|null} [error] SparqlResultsTrailer error
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */

                                /**
                                 * Properties of a SparqlResultsTrailer.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @interface ISparqlResultsTrailer
                                 * @augments eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties
                                 * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties instead.
                                 */

                                /**
                                 * Shape of a SparqlResultsTrailer.
                                 * @typedef {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape
                                 */

                                /**
                                 * Constructs a new SparqlResultsTrailer.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @classdesc Represents a SparqlResultsTrailer.
                                 * @constructor
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties=} [properties] Properties to set
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */
                                const SparqlResultsTrailer = function (properties) {
                                    if (properties)
                                        for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                                this[keys[i]] = properties[keys[i]];
                                };

                                /**
                                 * SparqlResultsTrailer error.
                                 * @member {string} error
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer
                                 * @instance
                                 */
                                SparqlResultsTrailer.prototype.error = "";

                                /**
                                 * Creates a new SparqlResultsTrailer instance using the specified properties.
                                 * @function create
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties=} [properties] Properties to set
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer} SparqlResultsTrailer instance
                                 * @type {{
                                 *   (properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape;
                                 *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer;
                                 * }}
                                 */
                                SparqlResultsTrailer.create = function(properties) {
                                    return new SparqlResultsTrailer(properties);
                                };

                                /**
                                 * Encodes the specified SparqlResultsTrailer message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.verify|verify} messages.
                                 * @function encode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties} message SparqlResultsTrailer message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlResultsTrailer.encode = function (message, writer, _depth) {
                                    if (!writer)
                                        writer = $Writer.create();
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $util.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    if (message.error != null && $Object.hasOwnProperty.call(message, "error") && message.error !== "")
                                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.error);
                                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                        for (let i = 0; i < message.$unknowns.length; ++i)
                                            writer.raw(message.$unknowns[i]);
                                    return writer;
                                };

                                /**
                                 * Encodes the specified SparqlResultsTrailer message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.verify|verify} messages.
                                 * @function encodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties} message SparqlResultsTrailer message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlResultsTrailer.encodeDelimited = function(message, writer) {
                                    return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                                };

                                /**
                                 * Decodes a SparqlResultsTrailer message from the specified reader or buffer.
                                 * @function decode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @param {number} [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape} SparqlResultsTrailer
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlResultsTrailer.decode = function (reader, length, _end, _depth, _target) {
                                    if (!(reader instanceof $Reader))
                                        reader = $Reader.create(reader);
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $Reader.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    let end, message, value;
                                    if (length === $undefined)
                                        end = reader.len;
                                    else {
                                        end = reader.pos + length;
                                        if (end > reader.len)
                                            throw $RangeError("index out of range");
                                        length = reader.len;
                                        reader.len = end;
                                    }
                                    message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer();
                                    while (reader.pos < end) {
                                        let start = reader.pos;
                                        let tag = reader.tag();
                                        if (tag === _end) {
                                            _end = $undefined;
                                            break;
                                        }
                                        let wireType = tag & 7;
                                        switch (tag >>>= 3) {
                                        case 1: {
                                                if (wireType !== 2)
                                                    break;
                                                if ((value = reader.stringVerify()).length)
                                                    message.error = value;
                                                else
                                                    delete message.error;
                                                continue;
                                            }
                                        }
                                        reader.skipType(wireType, _depth, tag);
                                        if (!reader.discardUnknown) {
                                            $util.makeProp(message, "$unknowns", false);
                                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                        }
                                    }
                                    if (length !== $undefined) {
                                        if (reader.pos !== end)
                                            throw $RangeError("index out of range");
                                        reader.len = length;
                                    }
                                    if (_end !== $undefined)
                                        throw $Error("missing end group");
                                    return message;
                                };

                                /**
                                 * Decodes a SparqlResultsTrailer message from the specified reader or buffer, length delimited.
                                 * @function decodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape} SparqlResultsTrailer
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlResultsTrailer.decodeDelimited = function(reader) {
                                    if (!(reader instanceof $Reader))
                                        reader = new $Reader(reader);
                                    return this.decode(reader, reader.size());
                                };

                                return SparqlResultsTrailer;
                            })();

                            sparql.SparqlResultsFrame = (function() {

                                /**
                                 * Properties of a SparqlResultsFrame.
                                 * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties
                                 * @property {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties|null} [options] SparqlResultsFrame options
                                 * @property {Array.<string>|null} [variables] SparqlResultsFrame variables
                                 * @property {number|null} [rowCount] SparqlResultsFrame rowCount
                                 * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>|null} [names] SparqlResultsFrame names
                                 * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>|null} [prefixes] SparqlResultsFrame prefixes
                                 * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>|null} [datatypes] SparqlResultsFrame datatypes
                                 * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties>|null} [columns] SparqlResultsFrame columns
                                 * @property {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties|null} [askResult] SparqlResultsFrame askResult
                                 * @property {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties|null} [trailer] SparqlResultsFrame trailer
                                 * @property {Object.<string,Uint8Array>|null} [metadata] SparqlResultsFrame metadata
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */

                                /**
                                 * Properties of a SparqlResultsFrame.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @interface ISparqlResultsFrame
                                 * @augments eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties
                                 * @deprecated Use eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties instead.
                                 */

                                /**
                                 * Shape of a SparqlResultsFrame.
                                 * @typedef {{
                                 *   options?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Shape|null;
                                 *   variables?: Array.<string>|null;
                                 *   rowCount?: number|null;
                                 *   names?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape>|null;
                                 *   prefixes?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape>|null;
                                 *   datatypes?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Shape>|null;
                                 *   columns?: Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Shape>|null;
                                 *   askResult?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Shape|null;
                                 *   trailer?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Shape|null;
                                 *   metadata?: Object.<string,Uint8Array>|null;
                                 *   $unknowns?: Array.<Uint8Array>;
                                 * }} eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape
                                 */

                                /**
                                 * Constructs a new SparqlResultsFrame.
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql
                                 * @classdesc Represents a SparqlResultsFrame.
                                 * @constructor
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties=} [properties] Properties to set
                                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                                 */
                                const SparqlResultsFrame = function (properties) {
                                    this.variables = [];
                                    this.names = [];
                                    this.prefixes = [];
                                    this.datatypes = [];
                                    this.columns = [];
                                    this.metadata = {};
                                    if (properties)
                                        for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                                this[keys[i]] = properties[keys[i]];
                                };

                                /**
                                 * SparqlResultsFrame options.
                                 * @member {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.$Properties|null|undefined} options
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.options = null;

                                /**
                                 * SparqlResultsFrame variables.
                                 * @member {Array.<string>} variables
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.variables = $util.emptyArray;

                                /**
                                 * SparqlResultsFrame rowCount.
                                 * @member {number} rowCount
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.rowCount = 0;

                                /**
                                 * SparqlResultsFrame names.
                                 * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>} names
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.names = $util.emptyArray;

                                /**
                                 * SparqlResultsFrame prefixes.
                                 * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>} prefixes
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.prefixes = $util.emptyArray;

                                /**
                                 * SparqlResultsFrame datatypes.
                                 * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties>} datatypes
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.datatypes = $util.emptyArray;

                                /**
                                 * SparqlResultsFrame columns.
                                 * @member {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties>} columns
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.columns = $util.emptyArray;

                                /**
                                 * SparqlResultsFrame askResult.
                                 * @member {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.$Properties|null|undefined} askResult
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.askResult = null;

                                /**
                                 * SparqlResultsFrame trailer.
                                 * @member {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.$Properties|null|undefined} trailer
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.trailer = null;

                                /**
                                 * SparqlResultsFrame metadata.
                                 * @member {Object.<string,Uint8Array>} metadata
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @instance
                                 */
                                SparqlResultsFrame.prototype.metadata = $util.emptyObject;

                                /**
                                 * Creates a new SparqlResultsFrame instance using the specified properties.
                                 * @function create
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties=} [properties] Properties to set
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame} SparqlResultsFrame instance
                                 * @type {{
                                 *   (properties: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape;
                                 *   (properties?: eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties): eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame;
                                 * }}
                                 */
                                SparqlResultsFrame.create = function(properties) {
                                    return new SparqlResultsFrame(properties);
                                };

                                /**
                                 * Encodes the specified SparqlResultsFrame message. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.verify|verify} messages.
                                 * @function encode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties} message SparqlResultsFrame message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlResultsFrame.encode = function (message, writer, _depth) {
                                    if (!writer)
                                        writer = $Writer.create();
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $util.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    if (message.options != null && $Object.hasOwnProperty.call(message, "options"))
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.encode(message.options, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                                    if (message.variables != null && message.variables.length)
                                        for (let i = 0; i < message.variables.length; ++i)
                                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.variables[i]);
                                    if (message.rowCount != null && $Object.hasOwnProperty.call(message, "rowCount") && message.rowCount !== 0)
                                        writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.rowCount);
                                    if (message.names != null && message.names.length)
                                        for (let i = 0; i < message.names.length; ++i)
                                            $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.names[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                                    if (message.prefixes != null && message.prefixes.length)
                                        for (let i = 0; i < message.prefixes.length; ++i)
                                            $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.prefixes[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                                    if (message.datatypes != null && message.datatypes.length)
                                        for (let i = 0; i < message.datatypes.length; ++i)
                                            $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.datatypes[i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                                    if (message.columns != null && message.columns.length)
                                        for (let i = 0; i < message.columns.length; ++i)
                                            $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.columns[i], writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
                                    if (message.askResult != null && $Object.hasOwnProperty.call(message, "askResult"))
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.encode(message.askResult, writer.uint32(/* id 8, wireType 2 =*/66).fork(), _depth + 1).ldelim();
                                    if (message.trailer != null && $Object.hasOwnProperty.call(message, "trailer"))
                                        $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.encode(message.trailer, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                                    if (message.metadata != null && $Object.hasOwnProperty.call(message, "metadata"))
                                        for (let keys = $Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                                            writer.uint32(/* id 15, wireType 2 =*/122).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).bytes(message.metadata[keys[i]]).ldelim();
                                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                                        for (let i = 0; i < message.$unknowns.length; ++i)
                                            writer.raw(message.$unknowns[i]);
                                    return writer;
                                };

                                /**
                                 * Encodes the specified SparqlResultsFrame message, length delimited. Does not implicitly {@link eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.verify|verify} messages.
                                 * @function encodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @static
                                 * @param {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties} message SparqlResultsFrame message or plain object to encode
                                 * @param {$protobuf.Writer} [writer] Writer to encode to
                                 * @returns {$protobuf.Writer} Writer
                                 */
                                SparqlResultsFrame.encodeDelimited = function(message, writer) {
                                    return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
                                };

                                /**
                                 * Decodes a SparqlResultsFrame message from the specified reader or buffer.
                                 * @function decode
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @param {number} [length] Message length if known beforehand
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape} SparqlResultsFrame
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlResultsFrame.decode = function (reader, length, _end, _depth, _target) {
                                    if (!(reader instanceof $Reader))
                                        reader = $Reader.create(reader);
                                    if (_depth === $undefined)
                                        _depth = 0;
                                    if (_depth > $Reader.recursionLimit)
                                        throw $Error("max depth exceeded");
                                    let end, message, key, value;
                                    if (length === $undefined)
                                        end = reader.len;
                                    else {
                                        end = reader.pos + length;
                                        if (end > reader.len)
                                            throw $RangeError("index out of range");
                                        length = reader.len;
                                        reader.len = end;
                                    }
                                    message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame();
                                    while (reader.pos < end) {
                                        let start = reader.pos;
                                        let tag = reader.tag();
                                        if (tag === _end) {
                                            _end = $undefined;
                                            break;
                                        }
                                        let wireType = tag & 7;
                                        switch (tag >>>= 3) {
                                        case 1: {
                                                if (wireType !== 2)
                                                    break;
                                                message.options = $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.decode(reader, reader.size(), $undefined, _depth + 1, message.options);
                                                continue;
                                            }
                                        case 2: {
                                                if (wireType !== 2)
                                                    break;
                                                if (!(message.variables && message.variables.length))
                                                    message.variables = [];
                                                message.variables.push(reader.stringVerify());
                                                continue;
                                            }
                                        case 3: {
                                                if (wireType !== 0)
                                                    break;
                                                if (value = reader.uint32())
                                                    message.rowCount = value;
                                                else
                                                    delete message.rowCount;
                                                continue;
                                            }
                                        case 4: {
                                                if (wireType !== 2)
                                                    break;
                                                if (!(message.names && message.names.length))
                                                    message.names = [];
                                                message.names.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.size(), $undefined, _depth + 1));
                                                continue;
                                            }
                                        case 5: {
                                                if (wireType !== 2)
                                                    break;
                                                if (!(message.prefixes && message.prefixes.length))
                                                    message.prefixes = [];
                                                message.prefixes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.size(), $undefined, _depth + 1));
                                                continue;
                                            }
                                        case 6: {
                                                if (wireType !== 2)
                                                    break;
                                                if (!(message.datatypes && message.datatypes.length))
                                                    message.datatypes = [];
                                                message.datatypes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.size(), $undefined, _depth + 1));
                                                continue;
                                            }
                                        case 7: {
                                                if (wireType !== 2)
                                                    break;
                                                if (!(message.columns && message.columns.length))
                                                    message.columns = [];
                                                message.columns.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.size(), $undefined, _depth + 1));
                                                continue;
                                            }
                                        case 8: {
                                                if (wireType !== 2)
                                                    break;
                                                message.askResult = $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.decode(reader, reader.size(), $undefined, _depth + 1, message.askResult);
                                                continue;
                                            }
                                        case 9: {
                                                if (wireType !== 2)
                                                    break;
                                                message.trailer = $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.decode(reader, reader.size(), $undefined, _depth + 1, message.trailer);
                                                continue;
                                            }
                                        case 15: {
                                                if (wireType !== 2)
                                                    break;
                                                if (message.metadata === $util.emptyObject)
                                                    message.metadata = {};
                                                let end2 = reader.size() + reader.pos;
                                                if (end2 > reader.len)
                                                    throw $RangeError("index out of range");
                                                reader.len = end2;
                                                key = "";
                                                value = [];
                                                while (reader.pos < end2) {
                                                    let tag2 = reader.tag();
                                                    wireType = tag2 & 7;
                                                    switch (tag2 >>>= 3) {
                                                    case 1:
                                                        if (wireType !== 2)
                                                            break;
                                                        key = reader.stringVerify();
                                                        continue;
                                                    case 2:
                                                        if (wireType !== 2)
                                                            break;
                                                        value = reader.bytes();
                                                        continue;
                                                    }
                                                    reader.skipType(wireType, _depth, tag2);
                                                }
                                                if (reader.pos !== end2)
                                                    throw $RangeError("index out of range");
                                                reader.len = end;
                                                if (key === "__proto__")
                                                    $util.makeProp(message.metadata, key);
                                                message.metadata[key] = value;
                                                continue;
                                            }
                                        }
                                        reader.skipType(wireType, _depth, tag);
                                        if (!reader.discardUnknown) {
                                            $util.makeProp(message, "$unknowns", false);
                                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                        }
                                    }
                                    if (length !== $undefined) {
                                        if (reader.pos !== end)
                                            throw $RangeError("index out of range");
                                        reader.len = length;
                                    }
                                    if (_end !== $undefined)
                                        throw $Error("missing end group");
                                    return message;
                                };

                                /**
                                 * Decodes a SparqlResultsFrame message from the specified reader or buffer, length delimited.
                                 * @function decodeDelimited
                                 * @memberof eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame
                                 * @static
                                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                                 * @returns {eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame & eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Shape} SparqlResultsFrame
                                 * @throws {Error} If the payload is not a reader or valid buffer
                                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                                 */
                                SparqlResultsFrame.decodeDelimited = function(reader) {
                                    if (!(reader instanceof $Reader))
                                        reader = new $Reader(reader);
                                    return this.decode(reader, reader.size());
                                };

                                return SparqlResultsFrame;
                            })();

                            return sparql;
                        })();

                        return v1;
                    })();

                    return proto;
                })();

                return core;
            })();

            return jelly;
        })();

        return ostrzyciel;
    })();

    return eu;
})();

export {
  $root as default
};
