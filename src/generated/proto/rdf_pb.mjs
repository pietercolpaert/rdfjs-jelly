/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error;

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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri(), value;
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfIri;
                        })();

                        v1.RdfLiteral = (function() {

                            /**
                             * Properties of a RdfLiteral.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties
                             * @property {string|null} [lex] RdfLiteral lex
                             * @property {string|null} [langtag] RdfLiteral langtag
                             * @property {number|null} [datatype] RdfLiteral datatype
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral(), value;
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
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfLiteral;
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph();
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
                                return this.decode(reader, reader.uint32());
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple();
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
                                            message.sIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sIri);
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
                                            message.sLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sLiteral);
                                            message.$subject = "sLiteral";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.sTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sTripleTerm);
                                            message.$subject = "sTripleTerm";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.pIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pIri);
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
                                            message.pLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pLiteral);
                                            message.$predicate = "pLiteral";
                                            continue;
                                        }
                                    case 8: {
                                            if (wireType !== 2)
                                                break;
                                            message.pTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pTripleTerm);
                                            message.$predicate = "pTripleTerm";
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.oIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oIri);
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
                                            message.oLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oLiteral);
                                            message.$object = "oLiteral";
                                            continue;
                                        }
                                    case 12: {
                                            if (wireType !== 2)
                                                break;
                                            message.oTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oTripleTerm);
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
                                return this.decode(reader, reader.uint32());
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfQuad();
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
                                            message.sIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sIri);
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
                                            message.sLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sLiteral);
                                            message.$subject = "sLiteral";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.sTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sTripleTerm);
                                            message.$subject = "sTripleTerm";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.pIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pIri);
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
                                            message.pLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pLiteral);
                                            message.$predicate = "pLiteral";
                                            continue;
                                        }
                                    case 8: {
                                            if (wireType !== 2)
                                                break;
                                            message.pTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pTripleTerm);
                                            message.$predicate = "pTripleTerm";
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.oIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oIri);
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
                                            message.oLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oLiteral);
                                            message.$object = "oLiteral";
                                            continue;
                                        }
                                    case 12: {
                                            if (wireType !== 2)
                                                break;
                                            message.oTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oTripleTerm);
                                            message.$object = "oTripleTerm";
                                            continue;
                                        }
                                    case 13: {
                                            if (wireType !== 2)
                                                break;
                                            message.gIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.gIri);
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
                                            message.gDefaultGraph = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.decode(reader, reader.uint32(), $undefined, _depth + 1, message.gDefaultGraph);
                                            message.$graph = "gDefaultGraph";
                                            continue;
                                        }
                                    case 16: {
                                            if (wireType !== 2)
                                                break;
                                            message.gLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.gLiteral);
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
                                return this.decode(reader, reader.uint32());
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart();
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
                                            message.gIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.gIri);
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
                                            message.gDefaultGraph = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.decode(reader, reader.uint32(), $undefined, _depth + 1, message.gDefaultGraph);
                                            message.$graph = "gDefaultGraph";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.gLiteral = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.decode(reader, reader.uint32(), $undefined, _depth + 1, message.gLiteral);
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
                                return this.decode(reader, reader.uint32());
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd();
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfGraphEnd;
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration(), value;
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
                                            message.value = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.value);
                                            continue;
                                        }
                                    }
                                    reader.skipType(wireType, _depth, tag);
                                    if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                                    }
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfNamespaceDeclaration;
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry(), value;
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
                                return this.decode(reader, reader.uint32());
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry(), value;
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
                                return this.decode(reader, reader.uint32());
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry(), value;
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfDatatypeEntry;
                        })();

                        v1.RdfStreamOptions = (function() {

                            /**
                             * Properties of a RdfStreamOptions.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.$Properties
                             * @property {string|null} [streamName] RdfStreamOptions streamName
                             * @property {eu.ostrzyciel.jelly.core.proto.v1.PhysicalStreamType|null} [physicalType] RdfStreamOptions physicalType
                             * @property {boolean|null} [generalizedStatements] RdfStreamOptions generalizedStatements
                             * @property {boolean|null} [rdfStar] RdfStreamOptions rdfStar
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions(), value;
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
                                return this.decode(reader, reader.uint32());
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
                            const valuesById = {}, values = $Object.create(valuesById);
                            values[valuesById[0] = "PHYSICAL_STREAM_TYPE_UNSPECIFIED"] = 0;
                            values[valuesById[1] = "PHYSICAL_STREAM_TYPE_TRIPLES"] = 1;
                            values[valuesById[2] = "PHYSICAL_STREAM_TYPE_QUADS"] = 2;
                            values[valuesById[3] = "PHYSICAL_STREAM_TYPE_GRAPHS"] = 3;
                            return values;
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
                            const valuesById = {}, values = $Object.create(valuesById);
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow();
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
                                            message.options = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.decode(reader, reader.uint32(), $undefined, _depth + 1, message.options);
                                            message.$row = "options";
                                            continue;
                                        }
                                    case 2: {
                                            if (wireType !== 2)
                                                break;
                                            message.triple = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.decode(reader, reader.uint32(), $undefined, _depth + 1, message.triple);
                                            message.$row = "triple";
                                            continue;
                                        }
                                    case 3: {
                                            if (wireType !== 2)
                                                break;
                                            message.quad = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.decode(reader, reader.uint32(), $undefined, _depth + 1, message.quad);
                                            message.$row = "quad";
                                            continue;
                                        }
                                    case 4: {
                                            if (wireType !== 2)
                                                break;
                                            message.graphStart = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.decode(reader, reader.uint32(), $undefined, _depth + 1, message.graphStart);
                                            message.$row = "graphStart";
                                            continue;
                                        }
                                    case 5: {
                                            if (wireType !== 2)
                                                break;
                                            message.graphEnd = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.decode(reader, reader.uint32(), $undefined, _depth + 1, message.graphEnd);
                                            message.$row = "graphEnd";
                                            continue;
                                        }
                                    case 6: {
                                            if (wireType !== 2)
                                                break;
                                            message.namespace = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.decode(reader, reader.uint32(), $undefined, _depth + 1, message.namespace);
                                            message.$row = "namespace";
                                            continue;
                                        }
                                    case 9: {
                                            if (wireType !== 2)
                                                break;
                                            message.name = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.decode(reader, reader.uint32(), $undefined, _depth + 1, message.name);
                                            message.$row = "name";
                                            continue;
                                        }
                                    case 10: {
                                            if (wireType !== 2)
                                                break;
                                            message.prefix = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.decode(reader, reader.uint32(), $undefined, _depth + 1, message.prefix);
                                            message.$row = "prefix";
                                            continue;
                                        }
                                    case 11: {
                                            if (wireType !== 2)
                                                break;
                                            message.datatype = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.decode(reader, reader.uint32(), $undefined, _depth + 1, message.datatype);
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfStreamRow;
                        })();

                        v1.RdfStreamFrame = (function() {

                            /**
                             * Properties of a RdfStreamFrame.
                             * @typedef {Object} eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame.$Properties
                             * @property {Array.<eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.$Properties>|null} [rows] RdfStreamFrame rows
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
                                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
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
                                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame(), key, value;
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
                                            message.rows.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.decode(reader, reader.uint32(), $undefined, _depth + 1));
                                            continue;
                                        }
                                    case 15: {
                                            if (wireType !== 2)
                                                break;
                                            if (message.metadata === $util.emptyObject)
                                                message.metadata = {};
                                            let end2 = reader.uint32() + reader.pos;
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
                                return this.decode(reader, reader.uint32());
                            };

                            return RdfStreamFrame;
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
