// src/errors.ts
var JellyError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = new.target.name;
  }
};
var JellyConformanceError = class extends JellyError {
};
var JellyUnsupportedFeatureError = class extends JellyError {
};

// src/generated/rdf_pb.ts
import { Writer as ProtobufWriter } from "protobufjs/minimal.js";

// src/generated/proto/rdf_pb.mjs
import $protobuf from "protobufjs/minimal.js";
var $Reader = $protobuf.Reader;
var $Writer = $protobuf.Writer;
var $util = $protobuf.util;
var $Object = $util.global.Object;
var $undefined = $util.global.undefined;
var $Error = $util.global.Error;
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
var eu = $root.eu = (() => {
  const eu2 = {};
  eu2.ostrzyciel = (function() {
    const ostrzyciel = {};
    ostrzyciel.jelly = (function() {
      const jelly = {};
      jelly.core = (function() {
        const core = {};
        core.proto = (function() {
          const proto2 = {};
          proto2.v1 = (function() {
            const v1 = {};
            v1.RdfIri = (function() {
              const RdfIri = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfIri.prototype.prefixId = 0;
              RdfIri.prototype.nameId = 0;
              RdfIri.create = function(properties) {
                return new RdfIri(properties);
              };
              RdfIri.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.prefixId != null && $Object.hasOwnProperty.call(message, "prefixId") && message.prefixId !== 0)
                  writer.uint32(
                    /* id 1, wireType 0 =*/
                    8
                  ).uint32(message.prefixId);
                if (message.nameId != null && $Object.hasOwnProperty.call(message, "nameId") && message.nameId !== 0)
                  writer.uint32(
                    /* id 2, wireType 0 =*/
                    16
                  ).uint32(message.nameId);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfIri.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfIri.decode = function(reader, length, _end, _depth, _target) {
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
              RdfIri.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfIri;
            })();
            v1.RdfLiteral = (function() {
              const RdfLiteral = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfLiteral.prototype.lex = "";
              RdfLiteral.prototype.langtag = null;
              RdfLiteral.prototype.datatype = null;
              let $oneOfFields;
              $Object.defineProperty(RdfLiteral.prototype, "literalKind", {
                get: $util.oneOfGetter($oneOfFields = ["langtag", "datatype"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              RdfLiteral.create = function(properties) {
                return new RdfLiteral(properties);
              };
              RdfLiteral.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.lex != null && $Object.hasOwnProperty.call(message, "lex") && message.lex !== "")
                  writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).string(message.lex);
                if (message.langtag != null && $Object.hasOwnProperty.call(message, "langtag"))
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.langtag);
                if (message.datatype != null && $Object.hasOwnProperty.call(message, "datatype"))
                  writer.uint32(
                    /* id 3, wireType 0 =*/
                    24
                  ).uint32(message.datatype);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfLiteral.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfLiteral.decode = function(reader, length, _end, _depth, _target) {
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
              RdfLiteral.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfLiteral;
            })();
            v1.RdfDefaultGraph = (function() {
              const RdfDefaultGraph = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfDefaultGraph.create = function(properties) {
                return new RdfDefaultGraph(properties);
              };
              RdfDefaultGraph.encode = function(message, writer, _depth) {
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
              RdfDefaultGraph.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfDefaultGraph.decode = function(reader, length, _end, _depth, _target) {
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
              RdfDefaultGraph.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfDefaultGraph;
            })();
            v1.RdfTriple = (function() {
              const RdfTriple = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfTriple.prototype.sIri = null;
              RdfTriple.prototype.sBnode = null;
              RdfTriple.prototype.sLiteral = null;
              RdfTriple.prototype.sTripleTerm = null;
              RdfTriple.prototype.pIri = null;
              RdfTriple.prototype.pBnode = null;
              RdfTriple.prototype.pLiteral = null;
              RdfTriple.prototype.pTripleTerm = null;
              RdfTriple.prototype.oIri = null;
              RdfTriple.prototype.oBnode = null;
              RdfTriple.prototype.oLiteral = null;
              RdfTriple.prototype.oTripleTerm = null;
              let $oneOfFields;
              $Object.defineProperty(RdfTriple.prototype, "subject", {
                get: $util.oneOfGetter($oneOfFields = ["sIri", "sBnode", "sLiteral", "sTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              $Object.defineProperty(RdfTriple.prototype, "predicate", {
                get: $util.oneOfGetter($oneOfFields = ["pIri", "pBnode", "pLiteral", "pTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              $Object.defineProperty(RdfTriple.prototype, "object", {
                get: $util.oneOfGetter($oneOfFields = ["oIri", "oBnode", "oLiteral", "oTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              RdfTriple.create = function(properties) {
                return new RdfTriple(properties);
              };
              RdfTriple.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.sIri != null && $Object.hasOwnProperty.call(message, "sIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.sIri, writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), _depth + 1).ldelim();
                if (message.sBnode != null && $Object.hasOwnProperty.call(message, "sBnode"))
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.sBnode);
                if (message.sLiteral != null && $Object.hasOwnProperty.call(message, "sLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.sLiteral, writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), _depth + 1).ldelim();
                if (message.sTripleTerm != null && $Object.hasOwnProperty.call(message, "sTripleTerm"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.sTripleTerm, writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).fork(), _depth + 1).ldelim();
                if (message.pIri != null && $Object.hasOwnProperty.call(message, "pIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.pIri, writer.uint32(
                    /* id 5, wireType 2 =*/
                    42
                  ).fork(), _depth + 1).ldelim();
                if (message.pBnode != null && $Object.hasOwnProperty.call(message, "pBnode"))
                  writer.uint32(
                    /* id 6, wireType 2 =*/
                    50
                  ).string(message.pBnode);
                if (message.pLiteral != null && $Object.hasOwnProperty.call(message, "pLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.pLiteral, writer.uint32(
                    /* id 7, wireType 2 =*/
                    58
                  ).fork(), _depth + 1).ldelim();
                if (message.pTripleTerm != null && $Object.hasOwnProperty.call(message, "pTripleTerm"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.pTripleTerm, writer.uint32(
                    /* id 8, wireType 2 =*/
                    66
                  ).fork(), _depth + 1).ldelim();
                if (message.oIri != null && $Object.hasOwnProperty.call(message, "oIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.oIri, writer.uint32(
                    /* id 9, wireType 2 =*/
                    74
                  ).fork(), _depth + 1).ldelim();
                if (message.oBnode != null && $Object.hasOwnProperty.call(message, "oBnode"))
                  writer.uint32(
                    /* id 10, wireType 2 =*/
                    82
                  ).string(message.oBnode);
                if (message.oLiteral != null && $Object.hasOwnProperty.call(message, "oLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.oLiteral, writer.uint32(
                    /* id 11, wireType 2 =*/
                    90
                  ).fork(), _depth + 1).ldelim();
                if (message.oTripleTerm != null && $Object.hasOwnProperty.call(message, "oTripleTerm"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.oTripleTerm, writer.uint32(
                    /* id 12, wireType 2 =*/
                    98
                  ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfTriple.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfTriple.decode = function(reader, length, _end, _depth, _target) {
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
              RdfTriple.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfTriple;
            })();
            v1.RdfQuad = (function() {
              const RdfQuad = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfQuad.prototype.sIri = null;
              RdfQuad.prototype.sBnode = null;
              RdfQuad.prototype.sLiteral = null;
              RdfQuad.prototype.sTripleTerm = null;
              RdfQuad.prototype.pIri = null;
              RdfQuad.prototype.pBnode = null;
              RdfQuad.prototype.pLiteral = null;
              RdfQuad.prototype.pTripleTerm = null;
              RdfQuad.prototype.oIri = null;
              RdfQuad.prototype.oBnode = null;
              RdfQuad.prototype.oLiteral = null;
              RdfQuad.prototype.oTripleTerm = null;
              RdfQuad.prototype.gIri = null;
              RdfQuad.prototype.gBnode = null;
              RdfQuad.prototype.gDefaultGraph = null;
              RdfQuad.prototype.gLiteral = null;
              let $oneOfFields;
              $Object.defineProperty(RdfQuad.prototype, "subject", {
                get: $util.oneOfGetter($oneOfFields = ["sIri", "sBnode", "sLiteral", "sTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              $Object.defineProperty(RdfQuad.prototype, "predicate", {
                get: $util.oneOfGetter($oneOfFields = ["pIri", "pBnode", "pLiteral", "pTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              $Object.defineProperty(RdfQuad.prototype, "object", {
                get: $util.oneOfGetter($oneOfFields = ["oIri", "oBnode", "oLiteral", "oTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              $Object.defineProperty(RdfQuad.prototype, "graph", {
                get: $util.oneOfGetter($oneOfFields = ["gIri", "gBnode", "gDefaultGraph", "gLiteral"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              RdfQuad.create = function(properties) {
                return new RdfQuad(properties);
              };
              RdfQuad.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.sIri != null && $Object.hasOwnProperty.call(message, "sIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.sIri, writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), _depth + 1).ldelim();
                if (message.sBnode != null && $Object.hasOwnProperty.call(message, "sBnode"))
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.sBnode);
                if (message.sLiteral != null && $Object.hasOwnProperty.call(message, "sLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.sLiteral, writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), _depth + 1).ldelim();
                if (message.sTripleTerm != null && $Object.hasOwnProperty.call(message, "sTripleTerm"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.sTripleTerm, writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).fork(), _depth + 1).ldelim();
                if (message.pIri != null && $Object.hasOwnProperty.call(message, "pIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.pIri, writer.uint32(
                    /* id 5, wireType 2 =*/
                    42
                  ).fork(), _depth + 1).ldelim();
                if (message.pBnode != null && $Object.hasOwnProperty.call(message, "pBnode"))
                  writer.uint32(
                    /* id 6, wireType 2 =*/
                    50
                  ).string(message.pBnode);
                if (message.pLiteral != null && $Object.hasOwnProperty.call(message, "pLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.pLiteral, writer.uint32(
                    /* id 7, wireType 2 =*/
                    58
                  ).fork(), _depth + 1).ldelim();
                if (message.pTripleTerm != null && $Object.hasOwnProperty.call(message, "pTripleTerm"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.pTripleTerm, writer.uint32(
                    /* id 8, wireType 2 =*/
                    66
                  ).fork(), _depth + 1).ldelim();
                if (message.oIri != null && $Object.hasOwnProperty.call(message, "oIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.oIri, writer.uint32(
                    /* id 9, wireType 2 =*/
                    74
                  ).fork(), _depth + 1).ldelim();
                if (message.oBnode != null && $Object.hasOwnProperty.call(message, "oBnode"))
                  writer.uint32(
                    /* id 10, wireType 2 =*/
                    82
                  ).string(message.oBnode);
                if (message.oLiteral != null && $Object.hasOwnProperty.call(message, "oLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.oLiteral, writer.uint32(
                    /* id 11, wireType 2 =*/
                    90
                  ).fork(), _depth + 1).ldelim();
                if (message.oTripleTerm != null && $Object.hasOwnProperty.call(message, "oTripleTerm"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.oTripleTerm, writer.uint32(
                    /* id 12, wireType 2 =*/
                    98
                  ).fork(), _depth + 1).ldelim();
                if (message.gIri != null && $Object.hasOwnProperty.call(message, "gIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.gIri, writer.uint32(
                    /* id 13, wireType 2 =*/
                    106
                  ).fork(), _depth + 1).ldelim();
                if (message.gBnode != null && $Object.hasOwnProperty.call(message, "gBnode"))
                  writer.uint32(
                    /* id 14, wireType 2 =*/
                    114
                  ).string(message.gBnode);
                if (message.gDefaultGraph != null && $Object.hasOwnProperty.call(message, "gDefaultGraph"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.encode(message.gDefaultGraph, writer.uint32(
                    /* id 15, wireType 2 =*/
                    122
                  ).fork(), _depth + 1).ldelim();
                if (message.gLiteral != null && $Object.hasOwnProperty.call(message, "gLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.gLiteral, writer.uint32(
                    /* id 16, wireType 2 =*/
                    130
                  ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfQuad.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfQuad.decode = function(reader, length, _end, _depth, _target) {
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
              RdfQuad.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfQuad;
            })();
            v1.RdfGraphStart = (function() {
              const RdfGraphStart = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfGraphStart.prototype.gIri = null;
              RdfGraphStart.prototype.gBnode = null;
              RdfGraphStart.prototype.gDefaultGraph = null;
              RdfGraphStart.prototype.gLiteral = null;
              let $oneOfFields;
              $Object.defineProperty(RdfGraphStart.prototype, "graph", {
                get: $util.oneOfGetter($oneOfFields = ["gIri", "gBnode", "gDefaultGraph", "gLiteral"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              RdfGraphStart.create = function(properties) {
                return new RdfGraphStart(properties);
              };
              RdfGraphStart.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.gIri != null && $Object.hasOwnProperty.call(message, "gIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.gIri, writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), _depth + 1).ldelim();
                if (message.gBnode != null && $Object.hasOwnProperty.call(message, "gBnode"))
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.gBnode);
                if (message.gDefaultGraph != null && $Object.hasOwnProperty.call(message, "gDefaultGraph"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDefaultGraph.encode(message.gDefaultGraph, writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), _depth + 1).ldelim();
                if (message.gLiteral != null && $Object.hasOwnProperty.call(message, "gLiteral"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.encode(message.gLiteral, writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfGraphStart.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfGraphStart.decode = function(reader, length, _end, _depth, _target) {
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
              RdfGraphStart.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfGraphStart;
            })();
            v1.RdfGraphEnd = (function() {
              const RdfGraphEnd = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfGraphEnd.create = function(properties) {
                return new RdfGraphEnd(properties);
              };
              RdfGraphEnd.encode = function(message, writer, _depth) {
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
              RdfGraphEnd.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfGraphEnd.decode = function(reader, length, _end, _depth, _target) {
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
              RdfGraphEnd.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfGraphEnd;
            })();
            v1.RdfNamespaceDeclaration = (function() {
              const RdfNamespaceDeclaration = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfNamespaceDeclaration.prototype.name = "";
              RdfNamespaceDeclaration.prototype.value = null;
              RdfNamespaceDeclaration.create = function(properties) {
                return new RdfNamespaceDeclaration(properties);
              };
              RdfNamespaceDeclaration.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.name != null && $Object.hasOwnProperty.call(message, "name") && message.name !== "")
                  writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).string(message.name);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.value, writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfNamespaceDeclaration.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfNamespaceDeclaration.decode = function(reader, length, _end, _depth, _target) {
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
              RdfNamespaceDeclaration.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfNamespaceDeclaration;
            })();
            v1.RdfNameEntry = (function() {
              const RdfNameEntry = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfNameEntry.prototype.id = 0;
              RdfNameEntry.prototype.value = "";
              RdfNameEntry.create = function(properties) {
                return new RdfNameEntry(properties);
              };
              RdfNameEntry.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                  writer.uint32(
                    /* id 1, wireType 0 =*/
                    8
                  ).uint32(message.id);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== "")
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.value);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfNameEntry.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfNameEntry.decode = function(reader, length, _end, _depth, _target) {
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
              RdfNameEntry.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfNameEntry;
            })();
            v1.RdfPrefixEntry = (function() {
              const RdfPrefixEntry = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfPrefixEntry.prototype.id = 0;
              RdfPrefixEntry.prototype.value = "";
              RdfPrefixEntry.create = function(properties) {
                return new RdfPrefixEntry(properties);
              };
              RdfPrefixEntry.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                  writer.uint32(
                    /* id 1, wireType 0 =*/
                    8
                  ).uint32(message.id);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== "")
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.value);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfPrefixEntry.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfPrefixEntry.decode = function(reader, length, _end, _depth, _target) {
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
              RdfPrefixEntry.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfPrefixEntry;
            })();
            v1.RdfDatatypeEntry = (function() {
              const RdfDatatypeEntry = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfDatatypeEntry.prototype.id = 0;
              RdfDatatypeEntry.prototype.value = "";
              RdfDatatypeEntry.create = function(properties) {
                return new RdfDatatypeEntry(properties);
              };
              RdfDatatypeEntry.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id") && message.id !== 0)
                  writer.uint32(
                    /* id 1, wireType 0 =*/
                    8
                  ).uint32(message.id);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== "")
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).string(message.value);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfDatatypeEntry.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfDatatypeEntry.decode = function(reader, length, _end, _depth, _target) {
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
              RdfDatatypeEntry.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfDatatypeEntry;
            })();
            v1.RdfStreamOptions = (function() {
              const RdfStreamOptions = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfStreamOptions.prototype.streamName = "";
              RdfStreamOptions.prototype.physicalType = 0;
              RdfStreamOptions.prototype.generalizedStatements = false;
              RdfStreamOptions.prototype.rdfStar = false;
              RdfStreamOptions.prototype.maxNameTableSize = 0;
              RdfStreamOptions.prototype.maxPrefixTableSize = 0;
              RdfStreamOptions.prototype.maxDatatypeTableSize = 0;
              RdfStreamOptions.prototype.logicalType = 0;
              RdfStreamOptions.prototype.version = 0;
              RdfStreamOptions.create = function(properties) {
                return new RdfStreamOptions(properties);
              };
              RdfStreamOptions.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.streamName != null && $Object.hasOwnProperty.call(message, "streamName") && message.streamName !== "")
                  writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).string(message.streamName);
                if (message.physicalType != null && $Object.hasOwnProperty.call(message, "physicalType") && message.physicalType !== 0)
                  writer.uint32(
                    /* id 2, wireType 0 =*/
                    16
                  ).int32(message.physicalType);
                if (message.generalizedStatements != null && $Object.hasOwnProperty.call(message, "generalizedStatements") && message.generalizedStatements !== false)
                  writer.uint32(
                    /* id 3, wireType 0 =*/
                    24
                  ).bool(message.generalizedStatements);
                if (message.rdfStar != null && $Object.hasOwnProperty.call(message, "rdfStar") && message.rdfStar !== false)
                  writer.uint32(
                    /* id 4, wireType 0 =*/
                    32
                  ).bool(message.rdfStar);
                if (message.maxNameTableSize != null && $Object.hasOwnProperty.call(message, "maxNameTableSize") && message.maxNameTableSize !== 0)
                  writer.uint32(
                    /* id 9, wireType 0 =*/
                    72
                  ).uint32(message.maxNameTableSize);
                if (message.maxPrefixTableSize != null && $Object.hasOwnProperty.call(message, "maxPrefixTableSize") && message.maxPrefixTableSize !== 0)
                  writer.uint32(
                    /* id 10, wireType 0 =*/
                    80
                  ).uint32(message.maxPrefixTableSize);
                if (message.maxDatatypeTableSize != null && $Object.hasOwnProperty.call(message, "maxDatatypeTableSize") && message.maxDatatypeTableSize !== 0)
                  writer.uint32(
                    /* id 11, wireType 0 =*/
                    88
                  ).uint32(message.maxDatatypeTableSize);
                if (message.logicalType != null && $Object.hasOwnProperty.call(message, "logicalType") && message.logicalType !== 0)
                  writer.uint32(
                    /* id 14, wireType 0 =*/
                    112
                  ).int32(message.logicalType);
                if (message.version != null && $Object.hasOwnProperty.call(message, "version") && message.version !== 0)
                  writer.uint32(
                    /* id 15, wireType 0 =*/
                    120
                  ).uint32(message.version);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfStreamOptions.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfStreamOptions.decode = function(reader, length, _end, _depth, _target) {
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
              RdfStreamOptions.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfStreamOptions;
            })();
            v1.PhysicalStreamType = (function() {
              const valuesById = {}, values = $Object.create(valuesById);
              values[valuesById[0] = "PHYSICAL_STREAM_TYPE_UNSPECIFIED"] = 0;
              values[valuesById[1] = "PHYSICAL_STREAM_TYPE_TRIPLES"] = 1;
              values[valuesById[2] = "PHYSICAL_STREAM_TYPE_QUADS"] = 2;
              values[valuesById[3] = "PHYSICAL_STREAM_TYPE_GRAPHS"] = 3;
              return values;
            })();
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
              const RdfStreamRow = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfStreamRow.prototype.options = null;
              RdfStreamRow.prototype.triple = null;
              RdfStreamRow.prototype.quad = null;
              RdfStreamRow.prototype.graphStart = null;
              RdfStreamRow.prototype.graphEnd = null;
              RdfStreamRow.prototype.namespace = null;
              RdfStreamRow.prototype.name = null;
              RdfStreamRow.prototype.prefix = null;
              RdfStreamRow.prototype.datatype = null;
              let $oneOfFields;
              $Object.defineProperty(RdfStreamRow.prototype, "row", {
                get: $util.oneOfGetter($oneOfFields = ["options", "triple", "quad", "graphStart", "graphEnd", "namespace", "name", "prefix", "datatype"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              RdfStreamRow.create = function(properties) {
                return new RdfStreamRow(properties);
              };
              RdfStreamRow.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.options != null && $Object.hasOwnProperty.call(message, "options"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamOptions.encode(message.options, writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), _depth + 1).ldelim();
                if (message.triple != null && $Object.hasOwnProperty.call(message, "triple"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTriple.encode(message.triple, writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), _depth + 1).ldelim();
                if (message.quad != null && $Object.hasOwnProperty.call(message, "quad"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfQuad.encode(message.quad, writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), _depth + 1).ldelim();
                if (message.graphStart != null && $Object.hasOwnProperty.call(message, "graphStart"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphStart.encode(message.graphStart, writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).fork(), _depth + 1).ldelim();
                if (message.graphEnd != null && $Object.hasOwnProperty.call(message, "graphEnd"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfGraphEnd.encode(message.graphEnd, writer.uint32(
                    /* id 5, wireType 2 =*/
                    42
                  ).fork(), _depth + 1).ldelim();
                if (message.namespace != null && $Object.hasOwnProperty.call(message, "namespace"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.encode(message.namespace, writer.uint32(
                    /* id 6, wireType 2 =*/
                    50
                  ).fork(), _depth + 1).ldelim();
                if (message.name != null && $Object.hasOwnProperty.call(message, "name"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNameEntry.encode(message.name, writer.uint32(
                    /* id 9, wireType 2 =*/
                    74
                  ).fork(), _depth + 1).ldelim();
                if (message.prefix != null && $Object.hasOwnProperty.call(message, "prefix"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfPrefixEntry.encode(message.prefix, writer.uint32(
                    /* id 10, wireType 2 =*/
                    82
                  ).fork(), _depth + 1).ldelim();
                if (message.datatype != null && $Object.hasOwnProperty.call(message, "datatype"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfDatatypeEntry.encode(message.datatype, writer.uint32(
                    /* id 11, wireType 2 =*/
                    90
                  ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfStreamRow.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfStreamRow.decode = function(reader, length, _end, _depth, _target) {
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
              RdfStreamRow.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfStreamRow;
            })();
            v1.RdfStreamFrame = (function() {
              const RdfStreamFrame = function(properties) {
                this.rows = [];
                this.metadata = {};
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfStreamFrame.prototype.rows = $util.emptyArray;
              RdfStreamFrame.prototype.metadata = $util.emptyObject;
              RdfStreamFrame.create = function(properties) {
                return new RdfStreamFrame(properties);
              };
              RdfStreamFrame.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.rows != null && message.rows.length)
                  for (let i = 0; i < message.rows.length; ++i)
                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.encode(message.rows[i], writer.uint32(
                      /* id 1, wireType 2 =*/
                      10
                    ).fork(), _depth + 1).ldelim();
                if (message.metadata != null && $Object.hasOwnProperty.call(message, "metadata"))
                  for (let keys = $Object.keys(message.metadata), i = 0; i < keys.length; ++i)
                    writer.uint32(
                      /* id 15, wireType 2 =*/
                      122
                    ).fork().uint32(
                      /* id 1, wireType 2 =*/
                      10
                    ).string(keys[i]).uint32(
                      /* id 2, wireType 2 =*/
                      18
                    ).bytes(message.metadata[keys[i]]).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfStreamFrame.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfStreamFrame.decode = function(reader, length, _end, _depth, _target) {
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
              RdfStreamFrame.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfStreamFrame;
            })();
            return v1;
          })();
          return proto2;
        })();
        return core;
      })();
      return jelly;
    })();
    return ostrzyciel;
  })();
  return eu2;
})();

// src/generated/rdf_pb.ts
var proto = eu.ostrzyciel.jelly.core.proto.v1;
var decodeOptions = proto.RdfStreamOptions.decode;
var decodeTriple = proto.RdfTriple.decode;
var decodeQuad = proto.RdfQuad.decode;
var decodeGraphStart = proto.RdfGraphStart.decode;
var decodeGraphEnd = proto.RdfGraphEnd.decode;
var decodeNamespace = proto.RdfNamespaceDeclaration.decode;
var decodeName = proto.RdfNameEntry.decode;
var decodePrefix = proto.RdfPrefixEntry.decode;
var decodeDatatype = proto.RdfDatatypeEntry.decode;
function decodeProtoTripleWire(reader, length) {
  return decodeTriple(reader, length, void 0, 2, void 0);
}
function decodeProtoQuadWire(reader, length) {
  return decodeQuad(reader, length, void 0, 2, void 0);
}
function decodeRowField(field, reader, length, target) {
  switch (field) {
    case 1 /* OPTIONS */:
      return decodeOptions(reader, length, void 0, 2, target);
    case 2 /* TRIPLE */:
      return decodeTriple(reader, length, void 0, 2, target);
    case 3 /* QUAD */:
      return decodeQuad(reader, length, void 0, 2, target);
    case 4 /* GRAPH_START */:
      return decodeGraphStart(reader, length, void 0, 2, target);
    case 5 /* GRAPH_END */:
      return decodeGraphEnd(reader, length, void 0, 2, target);
    case 6 /* NAMESPACE */:
      return decodeNamespace(reader, length, void 0, 2, target);
    case 9 /* NAME */:
      return decodeName(reader, length, void 0, 2, target);
    case 10 /* PREFIX */:
      return decodePrefix(reader, length, void 0, 2, target);
    case 11 /* DATATYPE */:
      return decodeDatatype(reader, length, void 0, 2, target);
    default:
      return void 0;
  }
}
function decodeProtoRow(reader, length, consume) {
  const end = reader.pos + length;
  if (end > reader.len) throw new RangeError("Truncated Jelly protobuf row");
  if (length === 0) {
    consume(0 /* UNKNOWN */, void 0);
    return;
  }
  const firstTag = reader.uint32();
  const firstField = firstTag >>> 3;
  const firstWireType = firstTag & 7;
  if (firstWireType === 2 && (firstField === 2 /* TRIPLE */ || firstField === 3 /* QUAD */ || firstField === 9 /* NAME */ || firstField === 10 /* PREFIX */ || firstField === 11 /* DATATYPE */)) {
    const nestedLength = reader.uint32();
    if (reader.pos + nestedLength === end) {
      consume(firstField, void 0, reader, nestedLength);
      if (reader.pos !== end) throw new RangeError("Invalid Jelly protobuf row payload length");
      return;
    }
  }
  reader.pos = end - length;
  let kind;
  let value;
  while (reader.pos < end) {
    const tag = reader.uint32();
    const field = tag >>> 3;
    const wireType = tag & 7;
    if (wireType === 2 && (field === 1 /* OPTIONS */ || field === 2 /* TRIPLE */ || field === 3 /* QUAD */ || field === 4 /* GRAPH_START */ || field === 5 /* GRAPH_END */ || field === 6 /* NAMESPACE */ || field === 9 /* NAME */ || field === 10 /* PREFIX */ || field === 11 /* DATATYPE */)) {
      const nestedLength = reader.uint32();
      const target = kind === field ? value : void 0;
      value = decodeRowField(field, reader, nestedLength, target);
      kind = field;
      continue;
    }
    reader.skipType(wireType);
  }
  if (reader.pos !== end) throw new RangeError("Invalid Jelly protobuf row length");
  consume(kind ?? 0 /* UNKNOWN */, value);
}
function decodeMetadataEntry(reader, length, metadata) {
  const end = reader.pos + length;
  if (end > reader.len) throw new RangeError("Truncated Jelly metadata entry");
  let key = "";
  let value = new Uint8Array();
  while (reader.pos < end) {
    const tag = reader.uint32();
    const field = tag >>> 3;
    const wireType = tag & 7;
    if (field === 1 && wireType === 2) key = reader.string();
    else if (field === 2 && wireType === 2) value = new Uint8Array(reader.bytes());
    else reader.skipType(wireType);
  }
  if (reader.pos !== end) throw new RangeError("Invalid Jelly metadata entry length");
  metadata.set(key, value);
}
function decodeProtoRdfStreamFrameRows(reader, length, consume, metadata) {
  let consumerError;
  const guardedConsume = (kind, value, wireReader, wireLength) => {
    try {
      consume(kind, value, wireReader, wireLength);
    } catch (error) {
      consumerError = error;
      throw error;
    }
  };
  try {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError("Truncated Jelly protobuf frame");
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 2) decodeProtoRow(reader, reader.uint32(), guardedConsume);
      else if (field === 15 && wireType === 2) decodeMetadataEntry(reader, reader.uint32(), metadata);
      else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError("Invalid Jelly protobuf frame length");
  } catch (error) {
    if (error === consumerError) throw error;
    throw new JellyConformanceError("Invalid Jelly protobuf frame", {
      cause: error instanceof Error ? error : void 0
    });
  }
}
function fromIri(value) {
  return { prefixId: value.prefixId, nameId: value.nameId };
}
function fromLiteral(value) {
  const field = value.$literalKind ?? value.literalKind;
  if (field === "langtag") return { lex: value.lex, kind: { case: "langtag", value: value.langtag } };
  if (field === "datatype") return { lex: value.lex, kind: { case: "datatype", value: value.datatype } };
  return { lex: value.lex };
}
function fromSubject(value) {
  const field = value.$subject ?? value.subject;
  if (field === "sIri") return { case: "iri", value: fromIri(value.sIri) };
  if (field === "sBnode") return { case: "bnode", value: value.sBnode };
  if (field === "sLiteral") return { case: "literal", value: fromLiteral(value.sLiteral) };
  if (field === "sTripleTerm") return { case: "triple", value: fromTriple(value.sTripleTerm) };
  return void 0;
}
function fromPredicate(value) {
  const field = value.$predicate ?? value.predicate;
  if (field === "pIri") return { case: "iri", value: fromIri(value.pIri) };
  if (field === "pBnode") return { case: "bnode", value: value.pBnode };
  if (field === "pLiteral") return { case: "literal", value: fromLiteral(value.pLiteral) };
  if (field === "pTripleTerm") return { case: "triple", value: fromTriple(value.pTripleTerm) };
  return void 0;
}
function fromObject(value) {
  const field = value.$object ?? value.object;
  if (field === "oIri") return { case: "iri", value: fromIri(value.oIri) };
  if (field === "oBnode") return { case: "bnode", value: value.oBnode };
  if (field === "oLiteral") return { case: "literal", value: fromLiteral(value.oLiteral) };
  if (field === "oTripleTerm") return { case: "triple", value: fromTriple(value.oTripleTerm) };
  return void 0;
}
function fromGraph(value) {
  const field = value.$graph ?? value.graph;
  if (field === "gIri") return { case: "iri", value: fromIri(value.gIri) };
  if (field === "gBnode") return { case: "bnode", value: value.gBnode };
  if (field === "gLiteral") return { case: "literal", value: fromLiteral(value.gLiteral) };
  if (field === "gDefaultGraph") return { case: "defaultGraph", value: {} };
  return void 0;
}
function fromTriple(value) {
  return { subject: fromSubject(value), predicate: fromPredicate(value), object: fromObject(value) };
}
function fromQuad(value) {
  return {
    subject: fromSubject(value),
    predicate: fromPredicate(value),
    object: fromObject(value),
    graph: fromGraph(value)
  };
}
function fromOptions(value) {
  return {
    streamName: value.streamName,
    physicalType: value.physicalType,
    generalizedStatements: value.generalizedStatements,
    rdfStar: value.rdfStar,
    maxNameTableSize: value.maxNameTableSize,
    maxPrefixTableSize: value.maxPrefixTableSize,
    maxDatatypeTableSize: value.maxDatatypeTableSize,
    logicalType: value.logicalType,
    version: value.version
  };
}
function fromRow(row) {
  const field = row.$row ?? row.row;
  if (field === "options") return { case: "options", value: fromOptions(row.options) };
  if (field === "triple") return { case: "triple", value: fromTriple(row.triple) };
  if (field === "quad") return { case: "quad", value: fromQuad(row.quad) };
  if (field === "graphStart") return { case: "graphStart", value: { graph: fromGraph(row.graphStart) } };
  if (field === "graphEnd") return { case: "graphEnd", value: {} };
  if (field === "namespace") {
    const value = row.namespace;
    return { case: "namespace", value: { name: value.name ?? "", value: fromIri(value.value) } };
  }
  if (field === "name") return { case: "name", value: { id: row.name.id ?? 0, value: row.name.value ?? "" } };
  if (field === "prefix") return { case: "prefix", value: { id: row.prefix.id ?? 0, value: row.prefix.value ?? "" } };
  if (field === "datatype") return { case: "datatype", value: { id: row.datatype.id ?? 0, value: row.datatype.value ?? "" } };
  return { case: "unknown", fieldNumber: 0 };
}
function encodeIriWire(writer, value) {
  if (value.prefixId !== 0) writer.uint32(8).uint32(value.prefixId);
  if (value.nameId !== 0) writer.uint32(16).uint32(value.nameId);
}
function encodeLiteralWire(writer, value) {
  if (value.lex !== "") writer.uint32(10).string(value.lex);
  if (value.kind?.case === "langtag") writer.uint32(18).string(value.kind.value);
  else if (value.kind?.case === "datatype") writer.uint32(24).uint32(value.kind.value);
}
function encodeStatementTermWire(writer, field, term) {
  const tag = field << 3 | 2;
  if (term.case === "iri") {
    writer.uint32(tag).fork();
    encodeIriWire(writer, term.value);
    writer.ldelim();
  } else if (term.case === "bnode") writer.uint32(tag + 8).string(term.value);
  else if (term.case === "literal") {
    writer.uint32(tag + 16).fork();
    encodeLiteralWire(writer, term.value);
    writer.ldelim();
  } else if (term.case === "triple") {
    writer.uint32(tag + 24).fork();
    encodeTripleWire(writer, term.value);
    writer.ldelim();
  }
}
function encodeTripleWire(writer, value) {
  if (value.subject) encodeStatementTermWire(writer, 1, value.subject);
  if (value.predicate) encodeStatementTermWire(writer, 5, value.predicate);
  if (value.object) encodeStatementTermWire(writer, 9, value.object);
}
function encodeGraphTermWire(writer, field, term) {
  const tag = field << 3 | 2;
  if (term.case === "iri") {
    writer.uint32(tag).fork();
    encodeIriWire(writer, term.value);
    writer.ldelim();
  } else if (term.case === "bnode") writer.uint32(tag + 8).string(term.value);
  else if (term.case === "defaultGraph") writer.uint32(tag + 16).fork().ldelim();
  else if (term.case === "literal") {
    writer.uint32(tag + 24).fork();
    encodeLiteralWire(writer, term.value);
    writer.ldelim();
  }
}
function encodeQuadWire(writer, value) {
  encodeTripleWire(writer, value);
  if (value.graph) encodeGraphTermWire(writer, 13, value.graph);
}
function encodeOptionsWire(writer, value) {
  if (value.streamName !== "") writer.uint32(10).string(value.streamName);
  if (value.physicalType !== 0) writer.uint32(16).int32(value.physicalType);
  if (value.generalizedStatements) writer.uint32(24).bool(value.generalizedStatements);
  if (value.rdfStar) writer.uint32(32).bool(value.rdfStar);
  if (value.maxNameTableSize !== 0) writer.uint32(72).uint32(value.maxNameTableSize);
  if (value.maxPrefixTableSize !== 0) writer.uint32(80).uint32(value.maxPrefixTableSize);
  if (value.maxDatatypeTableSize !== 0) writer.uint32(88).uint32(value.maxDatatypeTableSize);
  if (value.logicalType !== 0) writer.uint32(112).int32(value.logicalType);
  if (value.version !== 0) writer.uint32(120).uint32(value.version);
}
function encodeLookupEntryWire(writer, value) {
  if (value.id !== 0) writer.uint32(8).uint32(value.id);
  if (value.value !== "") writer.uint32(18).string(value.value);
}
function encodeRowWire(writer, row) {
  if (row.case === "options") {
    writer.uint32(10).fork();
    encodeOptionsWire(writer, row.value);
    writer.ldelim();
  } else if (row.case === "triple") {
    writer.uint32(18).fork();
    encodeTripleWire(writer, row.value);
    writer.ldelim();
  } else if (row.case === "quad") {
    writer.uint32(26).fork();
    encodeQuadWire(writer, row.value);
    writer.ldelim();
  } else if (row.case === "graphStart") {
    writer.uint32(34).fork();
    if (row.value.graph) encodeGraphTermWire(writer, 1, row.value.graph);
    writer.ldelim();
  } else if (row.case === "graphEnd") writer.uint32(42).fork().ldelim();
  else if (row.case === "namespace") {
    writer.uint32(50).fork();
    if (row.value.name !== "") writer.uint32(10).string(row.value.name);
    writer.uint32(18).fork();
    encodeIriWire(writer, row.value.value);
    writer.ldelim().ldelim();
  } else if (row.case === "name") {
    writer.uint32(74).fork();
    encodeLookupEntryWire(writer, row.value);
    writer.ldelim();
  } else if (row.case === "prefix") {
    writer.uint32(82).fork();
    encodeLookupEntryWire(writer, row.value);
    writer.ldelim();
  } else if (row.case === "datatype") {
    writer.uint32(90).fork();
    encodeLookupEntryWire(writer, row.value);
    writer.ldelim();
  }
}
function encodeFrameWire(writer, frame) {
  for (const row of frame.rows) {
    writer.uint32(10).fork();
    encodeRowWire(writer, row);
    writer.ldelim();
  }
  for (const [key, value] of frame.metadata) {
    writer.uint32(122).fork().uint32(10).string(key).uint32(18).bytes(value).ldelim();
  }
}
function encodeRdfStreamFrames(frames, delimited) {
  const chunks = [];
  let totalLength = 0;
  for (const frame of frames) {
    const writer = ProtobufWriter.create();
    if (delimited) writer.fork();
    encodeFrameWire(writer, frame);
    if (delimited) writer.ldelim();
    const chunk = writer.finish();
    chunks.push(chunk);
    totalLength += chunk.byteLength;
  }
  if (chunks.length === 1) return chunks[0];
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}
function encodeRdfStreamFrame(frame) {
  return encodeRdfStreamFrames([frame], false);
}
function encodeDelimitedRdfStreamFrame(frame) {
  return encodeRdfStreamFrames([frame], true);
}
function decodeRdfStreamFrame(input) {
  try {
    const frame = decodeProtoRdfStreamFrame(input);
    const metadata = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(frame.metadata)) metadata.set(key, new Uint8Array(value));
    return { rows: frame.rows.map((row) => fromRow(row)), metadata };
  } catch (error) {
    throw new JellyConformanceError("Invalid Jelly protobuf frame", {
      cause: error instanceof Error ? error : void 0
    });
  }
}
function decodeProtoRdfStreamFrame(input) {
  try {
    return proto.RdfStreamFrame.decode(input);
  } catch (error) {
    throw new JellyConformanceError("Invalid Jelly protobuf frame", {
      cause: error instanceof Error ? error : void 0
    });
  }
}

// src/options.ts
var MIN_NAME_LOOKUP_SIZE = 8;
var MIN_PREFIX_LOOKUP_SIZE = 4;
var MAX_LOOKUP_SIZE = 4096;
var MAX_DECODED_LOOKUP_SIZE = 1048576;
var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
var RDF_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
var DEFAULT_LOOKUP_PRESET = Object.freeze({
  maxNames: 4e3,
  maxPrefixes: 150,
  maxDatatypes: 32
});
var SMALL_LOOKUP_PRESET = Object.freeze({
  maxNames: 128,
  maxPrefixes: 32,
  maxDatatypes: 32
});
function normalizeLookupPreset(value = {}) {
  const preset = { ...DEFAULT_LOOKUP_PRESET, ...value };
  if (!Number.isInteger(preset.maxNames) || preset.maxNames < MIN_NAME_LOOKUP_SIZE || preset.maxNames > MAX_LOOKUP_SIZE) {
    throw new JellyConformanceError(`Name lookup size must be between ${MIN_NAME_LOOKUP_SIZE} and ${MAX_LOOKUP_SIZE}`);
  }
  for (const [name, size] of [["Prefix", preset.maxPrefixes], ["Datatype", preset.maxDatatypes]]) {
    if (!Number.isInteger(size) || size < 0 || size > MAX_LOOKUP_SIZE) {
      throw new JellyConformanceError(`${name} lookup size must be between 0 and ${MAX_LOOKUP_SIZE}`);
    }
  }
  if (preset.maxPrefixes > 0 && preset.maxPrefixes < MIN_PREFIX_LOOKUP_SIZE) {
    throw new JellyConformanceError(
      `Prefix lookup size ${preset.maxPrefixes} cannot encode a statement whose terms use more prefixes than the table holds; use 0 to disable the prefix lookup or at least ${MIN_PREFIX_LOOKUP_SIZE}`
    );
  }
  return preset;
}

// src/rdfjs/adapter.ts
function sameTerm(term, other) {
  if (!other || term.termType !== other.termType || term.value !== other.value) return false;
  if (term.termType === "Literal" && other.termType === "Literal") {
    return term.language === other.language && term.direction === other.direction && term.datatype.equals(other.datatype);
  }
  if (term.termType === "Quad" && other.termType === "Quad") {
    return term.subject.equals(other.subject) && term.predicate.equals(other.predicate) && term.object.equals(other.object) && term.graph.equals(other.graph);
  }
  return true;
}
var NamedNode = class {
  constructor(value) {
    this.value = value;
  }
  termType = "NamedNode";
  equals(other) {
    return sameTerm(this, other);
  }
};
var BlankNode = class {
  constructor(value) {
    this.value = value;
  }
  termType = "BlankNode";
  equals(other) {
    return sameTerm(this, other);
  }
};
var Variable = class {
  constructor(value) {
    this.value = value;
  }
  termType = "Variable";
  equals(other) {
    return sameTerm(this, other);
  }
};
var DefaultGraph = class {
  termType = "DefaultGraph";
  value = "";
  equals(other) {
    return sameTerm(this, other);
  }
};
var Literal = class {
  constructor(value, language = "", datatype = new NamedNode(language ? RDF_LANG_STRING : XSD_STRING), direction) {
    this.value = value;
    this.language = language;
    this.datatype = datatype;
    this.direction = direction;
  }
  termType = "Literal";
  equals(other) {
    return sameTerm(this, other);
  }
};
var Quad = class {
  constructor(subject, predicate, object, graph = defaultGraphSingleton) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.graph = graph;
  }
  termType = "Quad";
  value = "";
  equals(other) {
    return sameTerm(this, other);
  }
};
var defaultGraphSingleton = new DefaultGraph();
var blankNodeCounter = 0;
var dataFactory = {
  namedNode: (value) => new NamedNode(value),
  blankNode: (value) => new BlankNode(value ?? `b${blankNodeCounter++}`),
  literal: (value, languageOrDatatype) => {
    if (typeof languageOrDatatype === "string") {
      const language = languageOrDatatype.toLowerCase();
      return new Literal(value, language, new NamedNode(language ? RDF_LANG_STRING : XSD_STRING));
    }
    if (languageOrDatatype && !("termType" in languageOrDatatype)) {
      return new Literal(
        value,
        languageOrDatatype.language.toLowerCase(),
        new NamedNode(RDF_LANG_STRING),
        languageOrDatatype.direction
      );
    }
    return new Literal(value, "", languageOrDatatype ?? new NamedNode(XSD_STRING));
  },
  variable: (value) => new Variable(value),
  defaultGraph: () => defaultGraphSingleton,
  quad: (subject, predicate, object, graph = defaultGraphSingleton) => new Quad(subject, predicate, object, graph),
  fromTerm: (original) => {
    if (original.termType === "NamedNode") return new NamedNode(original.value);
    if (original.termType === "BlankNode") return new BlankNode(original.value);
    if (original.termType === "Variable") return new Variable(original.value);
    if (original.termType === "DefaultGraph") return defaultGraphSingleton;
    if (original.termType === "Literal") return new Literal(
      original.value,
      original.language,
      new NamedNode(original.datatype.value),
      original.direction
    );
    return new Quad(
      dataFactory.fromTerm(original.subject),
      dataFactory.fromTerm(original.predicate),
      dataFactory.fromTerm(original.object),
      dataFactory.fromTerm(original.graph)
    );
  },
  fromQuad: (original) => new Quad(
    dataFactory.fromTerm(original.subject),
    dataFactory.fromTerm(original.predicate),
    dataFactory.fromTerm(original.object),
    dataFactory.fromTerm(original.graph)
  )
};
var DataFactory = dataFactory;

// src/types.ts
var PhysicalStreamType = /* @__PURE__ */ ((PhysicalStreamType2) => {
  PhysicalStreamType2[PhysicalStreamType2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
  PhysicalStreamType2[PhysicalStreamType2["TRIPLES"] = 1] = "TRIPLES";
  PhysicalStreamType2[PhysicalStreamType2["QUADS"] = 2] = "QUADS";
  PhysicalStreamType2[PhysicalStreamType2["GRAPHS"] = 3] = "GRAPHS";
  return PhysicalStreamType2;
})(PhysicalStreamType || {});
var LogicalStreamType = /* @__PURE__ */ ((LogicalStreamType2) => {
  LogicalStreamType2[LogicalStreamType2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
  LogicalStreamType2[LogicalStreamType2["FLAT_TRIPLES"] = 1] = "FLAT_TRIPLES";
  LogicalStreamType2[LogicalStreamType2["FLAT_QUADS"] = 2] = "FLAT_QUADS";
  LogicalStreamType2[LogicalStreamType2["GRAPHS"] = 3] = "GRAPHS";
  LogicalStreamType2[LogicalStreamType2["DATASETS"] = 4] = "DATASETS";
  LogicalStreamType2[LogicalStreamType2["SUBJECT_GRAPHS"] = 13] = "SUBJECT_GRAPHS";
  LogicalStreamType2[LogicalStreamType2["NAMED_GRAPHS"] = 14] = "NAMED_GRAPHS";
  LogicalStreamType2[LogicalStreamType2["TIMESTAMPED_NAMED_GRAPHS"] = 114] = "TIMESTAMPED_NAMED_GRAPHS";
  return LogicalStreamType2;
})(LogicalStreamType || {});
var Message = class _Message extends Array {
  constructor(messageCounter, quads = [], metadata = /* @__PURE__ */ new Map()) {
    super();
    this.messageCounter = messageCounter;
    Object.setPrototypeOf(this, _Message.prototype);
    for (const quad of quads) this.push(quad);
    this.metadata = metadata instanceof Map ? metadata : new Map(Object.entries(metadata));
  }
  static get [Symbol.species]() {
    return Array;
  }
  metadata;
};
function isMessageQuad(value) {
  return Boolean(value && typeof value === "object" && "quad" in value && "messageCounter" in value);
}
function toMessages(output, messageCount) {
  const messages = [];
  const inferredCount = messageCount ?? (Array.isArray(output) && "messageCount" in output ? output.messageCount : void 0);
  let wrapped = false;
  for (const item of output) {
    const entry = isMessageQuad(item) ? item : { quad: item, messageCounter: 0 };
    wrapped ||= isMessageQuad(item);
    while (messages.length <= entry.messageCounter) messages.push(new Message(messages.length));
    messages[entry.messageCounter].push(entry.quad);
  }
  if (inferredCount !== void 0) {
    while (messages.length < inferredCount) messages.push(new Message(messages.length));
  } else if (!wrapped && messages.length === 0) {
    return [];
  }
  return messages;
}

// src/codec/LookupDecoder.ts
var LookupDecoder = class {
  constructor(size, limit = MAX_DECODED_LOOKUP_SIZE) {
    this.size = size;
    if (!Number.isInteger(size) || size < 0 || size > limit) {
      throw new JellyConformanceError(`Lookup size must be between 0 and ${limit}`);
    }
  }
  /**
   * Grown on demand rather than allocated at the declared size, so a stream may
   * declare a large table without the parser paying for entries it never fills.
   */
  data = [];
  lastAssignedIndex = 0;
  lastReusedIndex = 0;
  assign(index, value) {
    const resolved = index === 0 ? this.lastAssignedIndex + 1 : index;
    if (resolved < 1 || resolved > this.size) {
      throw new JellyConformanceError(`Lookup entry index ${resolved} is outside table size ${this.size}`);
    }
    if (resolved > this.data.length) this.reserve(resolved);
    this.data[resolved - 1] = value;
    this.lastAssignedIndex = resolved;
  }
  /** Extend the backing array by doubling, staying packed and capped at the table size. */
  reserve(required) {
    let capacity = this.data.length || 16;
    while (capacity < required) capacity *= 2;
    if (capacity > this.size) capacity = this.size;
    for (let index = this.data.length; index < capacity; index++) this.data.push(void 0);
  }
  at(index) {
    if (index < 1 || index > this.size) throw new JellyConformanceError(`Invalid lookup index ${index}`);
    const value = index <= this.data.length ? this.data[index - 1] : void 0;
    if (value === void 0) throw new JellyConformanceError(`Lookup index ${index} has not been assigned`);
    this.lastReusedIndex = index;
    return value;
  }
  prefix(index) {
    const resolved = index || this.lastReusedIndex;
    return resolved === 0 ? "" : this.at(resolved);
  }
  name(index) {
    const resolved = index || this.lastReusedIndex + 1;
    if (resolved === 0) throw new JellyConformanceError("Zero is not a valid resolved name index");
    return this.at(resolved);
  }
  datatype(index) {
    if (index === 0) throw new JellyConformanceError("Zero is not a valid datatype index");
    return this.at(index);
  }
};

// src/codec/Decoder.ts
var EMPTY_METADATA = /* @__PURE__ */ new Map();
var Decoder = class {
  factory;
  strict;
  maxSupportedVersion;
  maxLookupTableSize;
  names;
  prefixes;
  datatypes;
  repeated = new Array(4);
  graph;
  sawAnyRow = false;
  messageCounter = 0;
  events;
  defaultGraph;
  datatypeNodes = [];
  xsdString;
  streamOptions;
  namespaces = /* @__PURE__ */ Object.create(null);
  constructor(options = {}, events = {}) {
    this.factory = options.factory ?? DataFactory;
    this.strict = options.strict ?? true;
    this.maxSupportedVersion = options.maxSupportedVersion ?? 2;
    this.maxLookupTableSize = options.maxLookupTableSize ?? MAX_DECODED_LOOKUP_SIZE;
    this.events = events;
    this.defaultGraph = this.factory.defaultGraph();
  }
  decode(frame) {
    const message = new Message(this.messageCounter++, [], frame.metadata);
    for (const row of frame.rows) {
      if (row.case === "options") {
        this.ingestOptions(row.value);
        continue;
      }
      if (!this.streamOptions) throw new JellyConformanceError("Stream options must occur before all other Jelly rows");
      this.sawAnyRow = true;
      if (row.case === "name") this.names.assign(row.value.id, row.value.value);
      else if (row.case === "prefix") this.prefixes.assign(row.value.id, row.value.value);
      else if (row.case === "datatype") this.datatypes.assign(row.value.id, row.value.value);
      else if (row.case === "namespace") this.decodeNamespace(row.value.name, row.value.value);
      else if (row.case === "triple") message.push(this.decodeTriple(row.value));
      else if (row.case === "quad") message.push(this.decodeQuad(row.value));
      else if (row.case === "graphStart") this.startGraph(row.value.graph);
      else if (row.case === "graphEnd") this.endGraph();
      else throw new JellyConformanceError(`Unsupported or empty Jelly row field ${row.fieldNumber}`);
    }
    return message;
  }
  decodeProto(frame) {
    const protoFrame = frame;
    let metadata;
    for (const key in protoFrame.metadata) {
      if (Object.hasOwn(protoFrame.metadata, key)) (metadata ??= /* @__PURE__ */ new Map()).set(key, protoFrame.metadata[key]);
    }
    const message = new Message(this.messageCounter++, [], metadata ?? EMPTY_METADATA);
    for (const rawRow of protoFrame.rows) {
      const row = rawRow;
      const field = row.$row ?? row.row;
      if (field === "options") {
        this.ingestOptions(row.options);
        continue;
      }
      if (!this.streamOptions) throw new JellyConformanceError("Stream options must occur before all other Jelly rows");
      this.sawAnyRow = true;
      if (field === "name") this.names.assign(row.name.id ?? 0, row.name.value ?? "");
      else if (field === "prefix") this.prefixes.assign(row.prefix.id ?? 0, row.prefix.value ?? "");
      else if (field === "datatype") this.datatypes.assign(row.datatype.id ?? 0, row.datatype.value ?? "");
      else if (field === "namespace") {
        const value = row.namespace;
        this.decodeProtoNamespace(value.name ?? "", value.value);
      } else if (field === "triple") message.push(this.decodeProtoTriple(row.triple));
      else if (field === "quad") message.push(this.decodeProtoQuad(row.quad));
      else if (field === "graphStart") this.startProtoGraph(row.graphStart);
      else if (field === "graphEnd") this.endGraph();
      else throw new JellyConformanceError("Unsupported or empty Jelly row field 0");
    }
    return message;
  }
  decodeProtoPayload(rawReader, length) {
    const metadata = /* @__PURE__ */ new Map();
    const message = new Message(this.messageCounter++, [], metadata);
    decodeProtoRdfStreamFrameRows(
      rawReader,
      length,
      (kind, value, wireReader, wireLength) => this.consumeProtoRow(
        kind,
        value,
        message,
        void 0,
        wireReader,
        wireLength
      ),
      metadata
    );
    return message;
  }
  decodeProtoPayloadTo(rawReader, length, output) {
    this.messageCounter++;
    decodeProtoRdfStreamFrameRows(
      rawReader,
      length,
      (kind, value, wireReader, wireLength) => this.consumeProtoRow(
        kind,
        value,
        void 0,
        output,
        wireReader,
        wireLength
      ),
      /* @__PURE__ */ new Map()
    );
  }
  consumeProtoRow(kind, value, message, output, wireReader, wireLength) {
    if (kind === 1 /* OPTIONS */) {
      this.ingestOptions(value);
      return;
    }
    if (!this.streamOptions) throw new JellyConformanceError("Stream options must occur before all other Jelly rows");
    this.sawAnyRow = true;
    if (wireReader && wireLength !== void 0) {
      try {
        if (kind === 2 /* TRIPLE */) {
          this.emitQuad(this.decodeWireTriple(wireReader, wireLength), message, output);
          return;
        }
        if (kind === 3 /* QUAD */) {
          this.emitQuad(this.decodeWireQuad(wireReader, wireLength), message, output);
          return;
        }
        if (kind === 9 /* NAME */) this.decodeWireLookupEntry(wireReader, wireLength, this.names);
        else if (kind === 10 /* PREFIX */) this.decodeWireLookupEntry(wireReader, wireLength, this.prefixes);
        else this.decodeWireLookupEntry(wireReader, wireLength, this.datatypes);
        return;
      } catch (error) {
        if (error instanceof JellyConformanceError || error instanceof JellyUnsupportedFeatureError) throw error;
        throw new JellyConformanceError("Invalid Jelly protobuf row", {
          cause: error instanceof Error ? error : void 0
        });
      }
    }
    if (kind === 9 /* NAME */) {
      const entry = value;
      this.names.assign(entry.id, entry.value);
    } else if (kind === 10 /* PREFIX */) {
      const entry = value;
      this.prefixes.assign(entry.id, entry.value);
    } else if (kind === 11 /* DATATYPE */) {
      const entry = value;
      this.datatypes.assign(entry.id, entry.value);
    } else if (kind === 6 /* NAMESPACE */) {
      const declaration = value;
      this.decodeProtoNamespace(declaration.name, declaration.value);
    } else if (kind === 2 /* TRIPLE */) this.emitQuad(this.decodeProtoTriple(value), message, output);
    else if (kind === 3 /* QUAD */) this.emitQuad(this.decodeProtoQuad(value), message, output);
    else if (kind === 4 /* GRAPH_START */) this.startProtoGraph(value);
    else if (kind === 5 /* GRAPH_END */) this.endGraph();
    else throw new JellyConformanceError("Unsupported or empty Jelly row field 0");
  }
  emitQuad(quad, message, output) {
    if (message) message.push(quad);
    else output.push(quad);
  }
  decodeWireLookupEntry(reader, length, lookup) {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError("Truncated Jelly lookup entry");
    let id = 0;
    let value = "";
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 0) id = reader.uint32();
      else if (field === 2 && wireType === 2) value = reader.string();
      else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError("Invalid Jelly lookup entry length");
    lookup.assign(id, value);
  }
  decodeWireTriple(reader, length) {
    const physical = this.streamOptions.physicalType;
    if (physical !== 1 /* TRIPLES */ && physical !== 3 /* GRAPHS */) {
      throw new JellyConformanceError("Triple row is invalid in this physical stream type");
    }
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError("Truncated Jelly triple");
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
        if (reader.pos > end) throw new RangeError("Invalid Jelly triple term length");
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
        if (reader.pos > end) throw new RangeError("Invalid Jelly triple field length");
      }
    }
    if (reader.pos !== end) throw new RangeError("Invalid Jelly triple length");
    if (duplicateField) {
      reader.pos = end - length;
      return this.decodeProtoTriple(decodeProtoTripleWire(reader, length));
    }
    const subject = subjectField ? this.decodeWireTerm(reader, subjectField, subjectPosition) : this.repeated[0];
    if (!subject) throw new JellyConformanceError("First Jelly statement must set slot 0");
    if (subject.termType !== "NamedNode" && subject.termType !== "BlankNode") {
      throw new JellyConformanceError("Invalid RDF subject term");
    }
    const predicate = predicateField ? this.decodeWireTerm(reader, predicateField, predicatePosition) : this.repeated[1];
    if (!predicate) throw new JellyConformanceError("First Jelly statement must set slot 1");
    if (predicate.termType !== "NamedNode") throw new JellyConformanceError("Invalid RDF predicate term");
    const object = objectField ? this.decodeWireTerm(reader, objectField, objectPosition) : this.repeated[2];
    if (!object) throw new JellyConformanceError("First Jelly statement must set slot 2");
    if (object.termType !== "NamedNode" && object.termType !== "BlankNode" && object.termType !== "Literal") {
      throw new JellyConformanceError("Invalid RDF object term");
    }
    reader.pos = end;
    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    if (physical === 3 /* GRAPHS */ && this.graph === void 0) {
      throw new JellyConformanceError("Triple row occurred outside a graph in a GRAPHS stream");
    }
    return this.factory.quad(subject, predicate, object, this.graph ?? this.defaultGraph);
  }
  /**
   * Quad rows read straight off the wire, mirroring decodeWireTriple with the
   * graph slot (fields 13-16) added. Falls back to the generated protobuf
   * decoder when a slot repeats, which is where merge semantics matter.
   */
  decodeWireQuad(reader, length) {
    if (this.streamOptions.physicalType !== 2 /* QUADS */) {
      throw new JellyConformanceError("Quad row is invalid in this physical stream type");
    }
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError("Truncated Jelly quad");
    let subjectField = 0;
    let subjectPosition = 0;
    let predicateField = 0;
    let predicatePosition = 0;
    let objectField = 0;
    let objectPosition = 0;
    let graphField = 0;
    let graphPosition = 0;
    let duplicateField = false;
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field >= 1 && field <= 16 && wireType === 2) {
        const position = reader.pos;
        const termLength = reader.uint32();
        reader.pos += termLength;
        if (reader.pos > end) throw new RangeError("Invalid Jelly quad term length");
        if (field <= 4) {
          duplicateField ||= subjectField === field;
          subjectField = field;
          subjectPosition = position;
        } else if (field <= 8) {
          duplicateField ||= predicateField === field;
          predicateField = field;
          predicatePosition = position;
        } else if (field <= 12) {
          duplicateField ||= objectField === field;
          objectField = field;
          objectPosition = position;
        } else {
          duplicateField ||= graphField === field;
          graphField = field;
          graphPosition = position;
        }
      } else {
        reader.skipType(wireType);
        if (reader.pos > end) throw new RangeError("Invalid Jelly quad field length");
      }
    }
    if (reader.pos !== end) throw new RangeError("Invalid Jelly quad length");
    if (duplicateField) {
      reader.pos = end - length;
      return this.decodeProtoQuad(decodeProtoQuadWire(reader, length));
    }
    const subject = subjectField ? this.decodeWireTerm(reader, subjectField, subjectPosition) : this.repeated[0];
    if (!subject) throw new JellyConformanceError("First Jelly statement must set slot 0");
    if (subject.termType !== "NamedNode" && subject.termType !== "BlankNode") {
      throw new JellyConformanceError("Invalid RDF subject term");
    }
    const predicate = predicateField ? this.decodeWireTerm(reader, predicateField, predicatePosition) : this.repeated[1];
    if (!predicate) throw new JellyConformanceError("First Jelly statement must set slot 1");
    if (predicate.termType !== "NamedNode") throw new JellyConformanceError("Invalid RDF predicate term");
    const object = objectField ? this.decodeWireTerm(reader, objectField, objectPosition) : this.repeated[2];
    if (!object) throw new JellyConformanceError("First Jelly statement must set slot 2");
    if (object.termType !== "NamedNode" && object.termType !== "BlankNode" && object.termType !== "Literal") {
      throw new JellyConformanceError("Invalid RDF object term");
    }
    const graph = graphField ? this.decodeWireGraphTerm(reader, graphField, graphPosition) : this.repeated[3];
    if (!graph) throw new JellyConformanceError("First Jelly quad must set its graph");
    if (graph.termType !== "NamedNode" && graph.termType !== "BlankNode" && graph.termType !== "DefaultGraph") {
      throw new JellyConformanceError("Invalid RDF graph term");
    }
    reader.pos = end;
    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    this.repeated[3] = graph;
    return this.factory.quad(subject, predicate, object, graph);
  }
  decodeWireGraphTerm(reader, field, position) {
    const kind = field - 13;
    reader.pos = position;
    if (kind === 0) return this.decodeWireIri(reader, reader.uint32());
    if (kind === 1) return this.factory.blankNode(reader.string());
    if (kind === 2) {
      reader.pos += reader.uint32();
      return this.defaultGraph;
    }
    return this.decodeWireLiteral(reader, reader.uint32());
  }
  decodeWireTerm(reader, field, position) {
    const kind = field - 1 & 3;
    reader.pos = position;
    if (kind === 0) return this.decodeWireIri(reader, reader.uint32());
    if (kind === 1) return this.factory.blankNode(reader.string());
    if (kind === 2) return this.decodeWireLiteral(reader, reader.uint32());
    throw new JellyUnsupportedFeatureError("RDF-star quoted triple terms are not supported");
  }
  decodeWireIri(reader, length) {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError("Truncated Jelly IRI");
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
    if (reader.pos !== end) throw new RangeError("Invalid Jelly IRI length");
    return this.factory.namedNode(this.prefixes.prefix(prefixId) + this.names.name(nameId));
  }
  decodeWireLiteral(reader, length) {
    const end = reader.pos + length;
    if (end > reader.len) throw new RangeError("Truncated Jelly literal");
    let lex = "";
    let kind = 0;
    let langtag = "";
    let datatype = 0;
    while (reader.pos < end) {
      const tag = reader.uint32();
      const field = tag >>> 3;
      const wireType = tag & 7;
      if (field === 1 && wireType === 2) lex = reader.string();
      else if (field === 2 && wireType === 2) {
        langtag = reader.string();
        kind = 2;
      } else if (field === 3 && wireType === 0) {
        datatype = reader.uint32();
        kind = 3;
      } else reader.skipType(wireType);
    }
    if (reader.pos !== end) throw new RangeError("Invalid Jelly literal length");
    if (kind === 2) return this.factory.literal(lex, langtag);
    if (kind === 3) return this.factory.literal(lex, this.datatypeNode(datatype));
    return this.factory.literal(lex, this.xsdString ??= this.factory.namedNode(XSD_STRING));
  }
  finish() {
    if (!this.streamOptions) throw new JellyConformanceError("No Jelly stream options row was found");
    if (this.graph !== void 0) throw new JellyConformanceError("Jelly graph stream ended before graph_end");
  }
  ingestOptions(raw) {
    if (this.streamOptions) {
      const current = this.streamOptions;
      const identical = current.streamName === raw.streamName && current.physicalType === raw.physicalType && current.logicalType === raw.logicalType && current.generalizedStatements === raw.generalizedStatements && current.rdfStar === raw.rdfStar && current.maxNameTableSize === raw.maxNameTableSize && current.maxPrefixTableSize === raw.maxPrefixTableSize && current.maxDatatypeTableSize === raw.maxDatatypeTableSize && current.version === raw.version;
      if (!identical) throw new JellyConformanceError("Repeated Jelly stream options must be identical");
      return;
    }
    if (this.sawAnyRow) throw new JellyConformanceError("Stream options must occur before all other rows");
    if (raw.version < 1 || raw.version > this.maxSupportedVersion) {
      throw new JellyUnsupportedFeatureError(`Unsupported Jelly protocol version ${raw.version}`);
    }
    if (raw.rdfStar) throw new JellyUnsupportedFeatureError("RDF-star Jelly streams are not supported");
    if (raw.generalizedStatements) throw new JellyUnsupportedFeatureError("Generalized RDF Jelly streams are not supported");
    if (raw.maxNameTableSize < MIN_NAME_LOOKUP_SIZE || raw.maxNameTableSize > this.maxLookupTableSize) {
      throw new JellyConformanceError(`Invalid name lookup size ${raw.maxNameTableSize}`);
    }
    if (raw.maxPrefixTableSize > this.maxLookupTableSize || raw.maxDatatypeTableSize > this.maxLookupTableSize) {
      throw new JellyConformanceError("Jelly lookup size exceeds the configured maximum");
    }
    if (![1 /* TRIPLES */, 2 /* QUADS */, 3 /* GRAPHS */].includes(raw.physicalType)) {
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
      version: raw.version
    };
    this.names = new LookupDecoder(raw.maxNameTableSize, this.maxLookupTableSize);
    this.prefixes = new LookupDecoder(raw.maxPrefixTableSize, this.maxLookupTableSize);
    this.datatypes = new LookupDecoder(raw.maxDatatypeTableSize, this.maxLookupTableSize);
    this.events.options?.(this.streamOptions);
  }
  validateLogicalType(physical, logical) {
    if (logical === 0 /* UNSPECIFIED */) return;
    const base = logical % 10;
    const tripleOrientedPhysical = physical === 1 /* TRIPLES */;
    const tripleOrientedLogical = base === 1 /* FLAT_TRIPLES */ || base === 3 /* GRAPHS */;
    const valid = tripleOrientedPhysical === tripleOrientedLogical;
    if (!valid && this.strict) throw new JellyConformanceError(`Physical stream type ${physical} is incompatible with logical type ${logical}`);
  }
  decodeNamespace(name, iri) {
    if (this.streamOptions.version < 2) throw new JellyConformanceError("Namespace declarations require Jelly protocol version 2");
    const term = this.decodeIri(iri);
    this.namespaces[name] = term;
    this.events.namespace?.(name, term);
  }
  decodeIri(value) {
    const name = this.names.name(value.nameId);
    const prefix = this.prefixes.prefix(value.prefixId);
    return this.factory.namedNode(prefix + name);
  }
  datatypeNode(index) {
    const value = this.datatypes.datatype(index);
    const cached = this.datatypeNodes[index];
    if (cached?.value === value) return cached;
    const term = this.factory.namedNode(value);
    this.datatypeNodes[index] = term;
    return term;
  }
  decodeLiteral(value) {
    if (value.kind?.case === "langtag") return this.factory.literal(value.lex, value.kind.value);
    if (value.kind?.case === "datatype") return this.factory.literal(value.lex, this.datatypeNode(value.kind.value));
    return this.factory.literal(value.lex, this.xsdString ??= this.factory.namedNode(XSD_STRING));
  }
  decodeTerm(value, slot, allowDefaultGraph = false) {
    if (value.case === "triple") throw new JellyUnsupportedFeatureError("RDF-star quoted triple terms are not supported");
    if (value.case === "iri") return this.decodeIri(value.value);
    if (value.case === "bnode") return this.factory.blankNode(value.value);
    if (value.case === "literal") return this.decodeLiteral(value.value);
    if (value.case === "defaultGraph" && allowDefaultGraph) return this.factory.defaultGraph();
    throw new JellyConformanceError(`Invalid term in Jelly statement slot ${slot}`);
  }
  statementTerms(value) {
    const subject = value.subject ? this.decodeTerm(value.subject, 0) : this.repeated[0];
    if (!subject) throw new JellyConformanceError("First Jelly statement must set slot 0");
    if (subject.termType !== "NamedNode" && subject.termType !== "BlankNode") throw new JellyConformanceError("Invalid RDF subject term");
    const predicate = value.predicate ? this.decodeTerm(value.predicate, 1) : this.repeated[1];
    if (!predicate) throw new JellyConformanceError("First Jelly statement must set slot 1");
    if (predicate.termType !== "NamedNode") throw new JellyConformanceError("Invalid RDF predicate term");
    const object = value.object ? this.decodeTerm(value.object, 2) : this.repeated[2];
    if (!object) throw new JellyConformanceError("First Jelly statement must set slot 2");
    if (object.termType !== "NamedNode" && object.termType !== "BlankNode" && object.termType !== "Literal") {
      throw new JellyConformanceError("Invalid RDF object term");
    }
    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    return [subject, predicate, object];
  }
  decodeTriple(value) {
    const physical = this.streamOptions.physicalType;
    if (physical !== 1 /* TRIPLES */ && physical !== 3 /* GRAPHS */) {
      throw new JellyConformanceError("Triple row is invalid in this physical stream type");
    }
    const [subject, predicate, object] = this.statementTerms(value);
    if (physical === 3 /* GRAPHS */ && this.graph === void 0) {
      throw new JellyConformanceError("Triple row occurred outside a graph in a GRAPHS stream");
    }
    return this.factory.quad(subject, predicate, object, this.graph ?? this.defaultGraph);
  }
  decodeQuad(value) {
    if (this.streamOptions.physicalType !== 2 /* QUADS */) {
      throw new JellyConformanceError("Quad row is invalid in this physical stream type");
    }
    const [subject, predicate, object] = this.statementTerms(value);
    const graph = value.graph ? this.decodeTerm(value.graph, 3, true) : this.repeated[3];
    if (!graph) throw new JellyConformanceError("First Jelly quad must set its graph");
    if (!["NamedNode", "BlankNode", "DefaultGraph"].includes(graph.termType)) throw new JellyConformanceError("Invalid RDF graph term");
    this.repeated[3] = graph;
    return this.factory.quad(subject, predicate, object, graph);
  }
  decodeProtoNamespace(name, iri) {
    if (this.streamOptions.version < 2) throw new JellyConformanceError("Namespace declarations require Jelly protocol version 2");
    const term = this.decodeProtoIri(iri);
    this.namespaces[name] = term;
    this.events.namespace?.(name, term);
  }
  decodeProtoIri(value) {
    return this.factory.namedNode(this.prefixes.prefix(value.prefixId) + this.names.name(value.nameId));
  }
  decodeProtoLiteral(value) {
    const kind = value.$literalKind ?? value.literalKind;
    if (kind === "langtag") return this.factory.literal(value.lex, value.langtag);
    if (kind === "datatype") return this.factory.literal(value.lex, this.datatypeNode(value.datatype));
    return this.factory.literal(value.lex, this.xsdString ??= this.factory.namedNode(XSD_STRING));
  }
  protoStatementTerms(value) {
    const marked = value;
    let subject;
    if (marked.$subject === "sIri") subject = this.decodeProtoIri(value.sIri);
    else if (marked.$subject === "sBnode") subject = this.factory.blankNode(value.sBnode);
    else if (marked.$subject === "sLiteral") subject = this.decodeProtoLiteral(value.sLiteral);
    else if (marked.$subject === "sTripleTerm") throw new JellyUnsupportedFeatureError("RDF-star quoted triple terms are not supported");
    else subject = this.repeated[0];
    if (!subject) throw new JellyConformanceError("First Jelly statement must set slot 0");
    if (subject.termType !== "NamedNode" && subject.termType !== "BlankNode") throw new JellyConformanceError("Invalid RDF subject term");
    let predicate;
    if (marked.$predicate === "pIri") predicate = this.decodeProtoIri(value.pIri);
    else if (marked.$predicate === "pBnode") predicate = this.factory.blankNode(value.pBnode);
    else if (marked.$predicate === "pLiteral") predicate = this.decodeProtoLiteral(value.pLiteral);
    else if (marked.$predicate === "pTripleTerm") throw new JellyUnsupportedFeatureError("RDF-star quoted triple terms are not supported");
    else predicate = this.repeated[1];
    if (!predicate) throw new JellyConformanceError("First Jelly statement must set slot 1");
    if (predicate.termType !== "NamedNode") throw new JellyConformanceError("Invalid RDF predicate term");
    let object;
    if (marked.$object === "oIri") object = this.decodeProtoIri(value.oIri);
    else if (marked.$object === "oBnode") object = this.factory.blankNode(value.oBnode);
    else if (marked.$object === "oLiteral") object = this.decodeProtoLiteral(value.oLiteral);
    else if (marked.$object === "oTripleTerm") throw new JellyUnsupportedFeatureError("RDF-star quoted triple terms are not supported");
    else object = this.repeated[2];
    if (!object) throw new JellyConformanceError("First Jelly statement must set slot 2");
    if (object.termType !== "NamedNode" && object.termType !== "BlankNode" && object.termType !== "Literal") {
      throw new JellyConformanceError("Invalid RDF object term");
    }
    this.repeated[0] = subject;
    this.repeated[1] = predicate;
    this.repeated[2] = object;
    return [subject, predicate, object];
  }
  decodeProtoTriple(value) {
    const physical = this.streamOptions.physicalType;
    if (physical !== 1 /* TRIPLES */ && physical !== 3 /* GRAPHS */) {
      throw new JellyConformanceError("Triple row is invalid in this physical stream type");
    }
    const [subject, predicate, object] = this.protoStatementTerms(value);
    if (physical === 3 /* GRAPHS */ && this.graph === void 0) {
      throw new JellyConformanceError("Triple row occurred outside a graph in a GRAPHS stream");
    }
    return this.factory.quad(subject, predicate, object, this.graph ?? this.defaultGraph);
  }
  decodeProtoGraphTerm(value) {
    const kind = value.$graph;
    if (kind === "gIri") return this.decodeProtoIri(value.gIri);
    if (kind === "gBnode") return this.factory.blankNode(value.gBnode);
    if (kind === "gLiteral") return this.decodeProtoLiteral(value.gLiteral);
    if (kind === "gDefaultGraph") return this.defaultGraph;
    return void 0;
  }
  decodeProtoQuad(value) {
    if (this.streamOptions.physicalType !== 2 /* QUADS */) {
      throw new JellyConformanceError("Quad row is invalid in this physical stream type");
    }
    const [subject, predicate, object] = this.protoStatementTerms(value);
    const graph = this.decodeProtoGraphTerm(value) ?? this.repeated[3];
    if (!graph) throw new JellyConformanceError("First Jelly quad must set its graph");
    if (graph.termType !== "NamedNode" && graph.termType !== "BlankNode" && graph.termType !== "DefaultGraph") {
      throw new JellyConformanceError("Invalid RDF graph term");
    }
    this.repeated[3] = graph;
    return this.factory.quad(subject, predicate, object, graph);
  }
  startProtoGraph(value) {
    if (this.streamOptions.physicalType !== 3 /* GRAPHS */) throw new JellyConformanceError("graph_start outside a GRAPHS stream");
    if (this.graph !== void 0) throw new JellyConformanceError("Nested graph_start is invalid");
    const graph = this.decodeProtoGraphTerm(value);
    if (!graph) throw new JellyConformanceError("graph_start must identify a graph");
    if (graph.termType !== "NamedNode" && graph.termType !== "BlankNode" && graph.termType !== "DefaultGraph") {
      throw new JellyConformanceError("Invalid RDF graph name");
    }
    this.graph = graph;
  }
  startGraph(encoded) {
    if (this.streamOptions.physicalType !== 3 /* GRAPHS */) throw new JellyConformanceError("graph_start outside a GRAPHS stream");
    if (this.graph !== void 0) throw new JellyConformanceError("Nested graph_start is invalid");
    if (!encoded) throw new JellyConformanceError("graph_start must identify a graph");
    const graph = this.decodeTerm(encoded, 3, true);
    if (!["NamedNode", "BlankNode", "DefaultGraph"].includes(graph.termType)) throw new JellyConformanceError("Invalid RDF graph name");
    this.graph = graph;
  }
  endGraph() {
    if (this.streamOptions.physicalType !== 3 /* GRAPHS */ || this.graph === void 0) {
      throw new JellyConformanceError("graph_end occurred without an open graph");
    }
    this.graph = void 0;
  }
};

// src/codec/MessageDecoder.ts
import { Reader as Reader2 } from "protobufjs/minimal.js";

// src/codec/bytes.ts
function concatBytes(chunks) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}
function asUint8Array(input) {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

// src/codec/MessageDecoder.ts
var DEFAULT_MAX_MESSAGE_SIZE = 64 * 1024 * 1024;
var INITIAL_CAPACITY = 8192;
var EMPTY_BYTES = new Uint8Array();
function delimitedHint(first, second, third) {
  return first !== 10 || second === 10 && third !== 10;
}
function delimitedJellyHint(input) {
  return input.byteLength >= 3 && delimitedHint(input[0], input[1], input[2]);
}
var FramedMessageDecoder = class {
  constructor(options, decodeFrame, decodeReader) {
    this.decodeFrame = decodeFrame;
    this.decodeReader = decodeReader;
    this.mode = options.delimited ?? "auto";
    this.delimited = typeof this.mode === "boolean" ? this.mode : void 0;
    this.maxMessageSize = options.maxMessageSize ?? DEFAULT_MAX_MESSAGE_SIZE;
  }
  buffer = EMPTY_BYTES;
  start = 0;
  filled = 0;
  delimited;
  mode;
  maxMessageSize;
  finalising = false;
  stopped = false;
  delivered = false;
  get retained() {
    return this.filled - this.start;
  }
  /** Bytes held back because a consumer paused or a frame is still incomplete. */
  get bufferedBytes() {
    return this.retained;
  }
  get paused() {
    return this.stopped;
  }
  write(chunk) {
    const frames = [];
    this.writeEach(chunk, (frame) => {
      frames.push(frame);
    });
    return frames;
  }
  end(chunk) {
    const frames = [];
    this.endEach((frame) => {
      frames.push(frame);
    }, chunk);
    return frames;
  }
  decode(input) {
    const frames = [];
    this.decodeEach(input, (frame) => {
      frames.push(frame);
    });
    return frames;
  }
  /** Returns false when the consumer paused delivery; call resumeEach() to continue. */
  writeEach(chunk, consume) {
    const bytes = asUint8Array(chunk);
    this.detect(bytes);
    if (this.delimited === true && this.retained === 0 && !this.stopped) {
      const offset = this.readFrames(bytes, 0, bytes.byteLength, false, consume);
      if (offset < bytes.byteLength) this.append(bytes, offset);
      return !this.stopped;
    }
    this.append(bytes, 0);
    return this.pump(false, consume);
  }
  endEach(consume, chunk) {
    this.stopped = false;
    if (chunk !== void 0 && !this.writeEach(chunk, consume)) {
      this.finalising = true;
      return false;
    }
    this.finalising = true;
    return this.pump(true, consume);
  }
  /** Continue after a consumer paused delivery by returning false. */
  resumeEach(consume) {
    this.stopped = false;
    return this.pump(this.finalising, consume);
  }
  decodeEach(input, consume) {
    this.writeEach(input, consume);
    this.endEach(consume);
  }
  /** Framing is decided from the first three bytes, wherever they happen to sit. */
  detect(bytes) {
    if (this.delimited !== void 0) return;
    const retained = this.retained;
    if (retained + bytes.byteLength < 3) return;
    const at = (index) => index < retained ? this.buffer[this.start + index] : bytes[index - retained];
    this.delimited = delimitedHint(at(0), at(1), at(2));
  }
  pump(final, consume) {
    if (this.stopped) return false;
    if (this.delimited === void 0) {
      if (!final) return true;
      this.delimited = this.mode === "auto" ? this.retained > 0 && delimitedJellyHint(this.buffer.subarray(this.start, this.filled)) : this.mode;
    }
    if (this.delimited) {
      this.start = this.readFrames(this.buffer, this.start, this.filled, final, consume);
      if (this.start === this.filled) {
        this.start = 0;
        this.filled = 0;
      }
      if (this.stopped) return false;
      if (final && this.retained !== 0) throw new JellyConformanceError("Truncated delimited Jelly message");
      return true;
    }
    if (!final || this.delivered) return true;
    if (this.retained === 0) throw new JellyConformanceError("Jelly input is empty");
    const frame = this.decodeFrame(this.buffer.subarray(this.start, this.filled));
    this.delivered = true;
    this.buffer = EMPTY_BYTES;
    this.start = 0;
    this.filled = 0;
    if (consume(frame) === false) {
      this.stopped = true;
      return false;
    }
    return true;
  }
  /** Returns the offset after the last frame handed to the consumer. */
  readFrames(buffer, from, end, final, consume) {
    let offset = from;
    while (offset < end) {
      let size;
      let prefixSize;
      let reader;
      try {
        reader = Reader2.create(buffer.subarray(offset, end));
        size = reader.uint32();
        prefixSize = reader.pos;
      } catch (error) {
        if (!final) break;
        throw new JellyConformanceError("Invalid Jelly message length prefix", {
          cause: error instanceof Error ? error : void 0
        });
      }
      if (size > this.maxMessageSize) throw new JellyConformanceError("Jelly message exceeds configured size limit");
      const payloadOffset = offset + prefixSize;
      const frameEnd = payloadOffset + size;
      if (frameEnd > end) break;
      const frame = this.decodeReader ? this.decodeReader(reader, size) : this.decodeFrame(buffer.subarray(payloadOffset, frameEnd));
      offset = frameEnd;
      if (consume(frame) === false) {
        this.stopped = true;
        break;
      }
    }
    return offset;
  }
  append(bytes, from) {
    const addition = bytes.byteLength - from;
    if (addition <= 0) return;
    const live = this.retained;
    const required = live + addition;
    if (required > this.buffer.byteLength) {
      let capacity = this.buffer.byteLength || INITIAL_CAPACITY;
      while (capacity < required) capacity *= 2;
      const grown = new Uint8Array(capacity);
      if (live > 0) grown.set(this.buffer.subarray(this.start, this.filled));
      this.buffer = grown;
      this.start = 0;
      this.filled = live;
    } else if (this.filled + addition > this.buffer.byteLength) {
      this.buffer.copyWithin(0, this.start, this.filled);
      this.start = 0;
      this.filled = live;
    }
    this.buffer.set(from === 0 ? bytes : bytes.subarray(from), this.filled);
    this.filled += addition;
    if (this.delimited === false && this.retained > this.maxMessageSize) {
      throw new JellyConformanceError("Jelly message exceeds configured size limit");
    }
  }
};
var MessageDecoder = class extends FramedMessageDecoder {
  constructor(options = {}) {
    super(options, decodeRdfStreamFrame);
  }
};
var DirectMessageDecoder = class extends FramedMessageDecoder {
  constructor(options, decoder) {
    super(
      options,
      (input) => decoder.decodeProtoPayload(Reader2.create(input), input.byteLength),
      (reader, length) => decoder.decodeProtoPayload(reader, length)
    );
  }
};
var DirectQuadDecoder = class extends FramedMessageDecoder {
  constructor(options, decoder, output) {
    super(
      options,
      (input) => decoder.decodeProtoPayloadTo(Reader2.create(input), input.byteLength, output),
      (reader, length) => decoder.decodeProtoPayloadTo(reader, length, output)
    );
  }
};

// src/api/Parser.ts
function optimizedBinaryInput(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const BufferConstructor = globalThis.Buffer;
  return BufferConstructor && !BufferConstructor.isBuffer(bytes) ? BufferConstructor.from(bytes.buffer, bytes.byteOffset, bytes.byteLength) : bytes;
}
var Parser = class {
  options;
  _factory;
  constructor(options = {}) {
    this.options = options;
    this._factory = options.factory ?? DataFactory;
  }
  parse(input, callback) {
    try {
      const messageMode = this.options.messages === true || this.options.rdfMessages === true;
      if (!callback && !messageMode) return this.decodeQuads(input);
      if (callback) {
        const { messages, decoder } = this.decode(input);
        const output2 = messageMode ? this.flattenMessageQuads(messages) : this.flattenQuads(messages);
        if (messageMode) {
          for (const entry of output2) callback(null, entry.quad, decoder.namespaces, entry.messageCounter);
        } else {
          for (const quad of output2) callback(null, quad, decoder.namespaces);
        }
        callback(null, null, decoder.namespaces);
        return void 0;
      }
      const output = messageMode ? [] : [];
      const { messageCount } = this.decode(input, {}, (message) => {
        if (messageMode) {
          for (const quad of message) output.push({ quad, messageCounter: message.messageCounter });
        } else {
          for (const quad of message) output.push(quad);
        }
      });
      if (messageMode) output.messageCount = messageCount;
      return output;
    } catch (error) {
      if (callback) {
        callback(error instanceof Error ? error : new Error(String(error)));
        return void 0;
      }
      throw error;
    }
  }
  parseMessages(input) {
    return this.decode(input).messages;
  }
  decode(input, events = {}, consume) {
    const decoder = new Decoder(this.options, events);
    const reader = new DirectMessageDecoder(this.options, decoder);
    const messages = [];
    let messageCount = 0;
    reader.decodeEach(optimizedBinaryInput(input), (message) => {
      messageCount++;
      if (consume) consume(message);
      else messages.push(message);
    });
    decoder.finish();
    return { messages, decoder, messageCount };
  }
  decodeQuads(input) {
    const output = [];
    const decoder = new Decoder(this.options);
    const reader = new DirectQuadDecoder(this.options, decoder, output);
    reader.decodeEach(optimizedBinaryInput(input), () => void 0);
    decoder.finish();
    return output;
  }
  flattenQuads(messages) {
    const output = [];
    for (const message of messages) for (const quad of message) output.push(quad);
    return output;
  }
  flattenMessageQuads(messages) {
    const output = [];
    output.messageCount = messages.length;
    for (const message of messages) {
      for (const quad of message) output.push({ quad, messageCounter: message.messageCounter });
    }
    return output;
  }
};

// src/codec/LookupEncoder.ts
var LookupEncoder = class {
  constructor(size) {
    this.size = size;
    this.values = new Array(size + 1);
    this.older = new Int32Array(size + 1);
    this.newer = new Int32Array(size + 1);
  }
  data = /* @__PURE__ */ new Map();
  values;
  older;
  newer;
  count = 0;
  oldestIndex = 0;
  newestIndex = 0;
  lastAssignedIndex = 0;
  lastEnsuredIndex = 0;
  lastReusedIndex = 0;
  ensure(value) {
    const id = this.ensureId(value);
    return id < 0 ? void 0 : { id, value };
  }
  ensureId(value) {
    const existing = this.data.get(value);
    if (existing !== void 0) {
      this.touch(existing);
      this.lastEnsuredIndex = existing;
      return -1;
    }
    if (this.size === 0) throw new JellyConformanceError("Cannot insert into a disabled lookup table");
    let index;
    if (this.count === this.size) {
      index = this.oldestIndex;
      const oldest = this.values[index];
      if (oldest === void 0) throw new JellyConformanceError("Lookup eviction state is inconsistent");
      this.data.delete(oldest);
      this.unlink(index);
    } else {
      index = ++this.count;
    }
    this.data.set(value, index);
    this.values[index] = value;
    this.append(index);
    this.lastEnsuredIndex = index;
    const previous = this.lastAssignedIndex;
    this.lastAssignedIndex = index;
    return index === previous + 1 ? 0 : index;
  }
  touch(index) {
    if (index === this.newestIndex) return;
    this.unlink(index);
    this.append(index);
  }
  unlink(index) {
    const older = this.older[index];
    const newer = this.newer[index];
    if (older === 0) this.oldestIndex = newer;
    else this.newer[older] = newer;
    if (newer === 0) this.newestIndex = older;
    else this.older[newer] = older;
  }
  append(index) {
    this.older[index] = this.newestIndex;
    this.newer[index] = 0;
    if (this.newestIndex === 0) this.oldestIndex = index;
    else this.newer[this.newestIndex] = index;
    this.newestIndex = index;
  }
  use(value) {
    const index = this.data.get(value);
    if (index === void 0) throw new JellyConformanceError(`Lookup value was not inserted: ${value}`);
    this.touch(index);
    this.lastReusedIndex = index;
    return index;
  }
  prefix(value) {
    if (this.size === 0) return 0;
    const previous = this.lastReusedIndex;
    if (!value && previous === 0) return 0;
    const current = this.use(value);
    return previous !== 0 && current === previous ? 0 : current;
  }
  name(value) {
    const previous = this.lastReusedIndex;
    const current = this.use(value);
    return current === previous + 1 ? 0 : current;
  }
  datatype(value) {
    return this.use(value);
  }
  ensuredPrefix() {
    const previous = this.lastReusedIndex;
    const current = this.lastEnsuredIndex;
    this.lastReusedIndex = current;
    return previous !== 0 && current === previous ? 0 : current;
  }
  ensuredName() {
    const previous = this.lastReusedIndex;
    const current = this.lastEnsuredIndex;
    this.lastReusedIndex = current;
    return current === previous + 1 ? 0 : current;
  }
  ensuredDatatype() {
    this.lastReusedIndex = this.lastEnsuredIndex;
    return this.lastEnsuredIndex;
  }
};

// src/codec/Encoder.ts
function metadataMap(metadata) {
  if (!metadata) return /* @__PURE__ */ new Map();
  return metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata));
}
function sameTerm2(left, right) {
  if (left === right) return true;
  if (!left || left.termType !== right.termType || left.value !== right.value) return false;
  if (left.termType === "Literal" && right.termType === "Literal") {
    return left.language === right.language && left.direction === right.direction && left.datatype.value === right.datatype.value;
  }
  return left.termType !== "Quad";
}
var Encoder = class {
  physicalType;
  logicalType;
  lookup;
  messageSize;
  frames = [];
  frameSink;
  names;
  prefixes;
  datatypes;
  repeated = new Array(4);
  rows;
  scratchRows = [];
  frameCount = 0;
  hasStatements = false;
  finished = false;
  constructor(options = {}, frameSink) {
    this.frameSink = frameSink;
    if (options.version !== void 0 && options.version !== 2) {
      throw new JellyUnsupportedFeatureError("Writing is supported only for Jelly protocol version 2");
    }
    this.physicalType = options.physicalType ?? 2 /* QUADS */;
    if (![1 /* TRIPLES */, 2 /* QUADS */, 3 /* GRAPHS */].includes(this.physicalType)) {
      throw new JellyConformanceError(`Invalid physical stream type ${this.physicalType}`);
    }
    this.logicalType = options.logicalType ?? (this.physicalType === 1 /* TRIPLES */ ? 1 /* FLAT_TRIPLES */ : 2 /* FLAT_QUADS */);
    this.validateLogicalType();
    this.lookup = normalizeLookupPreset(options.lookup);
    this.messageSize = options.messageSize ?? 250;
    if (!Number.isInteger(this.messageSize) || this.messageSize < 1) throw new JellyConformanceError("messageSize must be a positive integer");
    this.names = new LookupEncoder(this.lookup.maxNames);
    this.prefixes = new LookupEncoder(this.lookup.maxPrefixes);
    this.datatypes = new LookupEncoder(this.lookup.maxDatatypes);
    this.rows = [{
      case: "options",
      value: {
        streamName: options.streamName ?? "",
        physicalType: this.physicalType,
        generalizedStatements: false,
        rdfStar: false,
        maxNameTableSize: this.lookup.maxNames,
        maxPrefixTableSize: this.lookup.maxPrefixes,
        maxDatatypeTableSize: this.lookup.maxDatatypes,
        logicalType: this.logicalType,
        version: 2
      }
    }];
  }
  validateLogicalType() {
    const base = this.logicalType % 10;
    const tripleOrientedPhysical = this.physicalType === 1 /* TRIPLES */;
    const tripleOrientedLogical = base === 1 /* FLAT_TRIPLES */ || base === 3 /* GRAPHS */;
    const valid = this.logicalType === 0 /* UNSPECIFIED */ || tripleOrientedPhysical === tripleOrientedLogical;
    if (!valid) throw new JellyConformanceError(`Physical stream type ${this.physicalType} is incompatible with logical type ${this.logicalType}`);
  }
  addNamespace(name, iri) {
    this.assertOpen();
    const rows = this.scratchRows;
    rows.length = 0;
    const value = this.encodeIri(iri, rows);
    rows.push({ case: "namespace", value: { name, value } });
    this.appendRows(rows, false);
    rows.length = 0;
  }
  addQuad(quad) {
    this.assertOpen();
    if (this.physicalType === 3 /* GRAPHS */) {
      throw new JellyConformanceError("Use addGraph() when writing a GRAPHS physical stream");
    }
    if (this.physicalType === 1 /* TRIPLES */ && quad.graph.termType !== "DefaultGraph") {
      throw new JellyConformanceError("TRIPLES streams cannot contain named graph quads");
    }
    const rows = this.scratchRows;
    rows.length = 0;
    if (this.physicalType === 1 /* TRIPLES */) this.encodeTriple(quad, rows);
    else this.encodeQuad(quad, rows);
    this.appendRows(rows, true);
    rows.length = 0;
  }
  addMessage(quads, metadata) {
    this.assertOpen();
    if (this.hasStatements) this.flush(void 0, true);
    for (const quad of quads) {
      if (this.physicalType === 3 /* GRAPHS */) throw new JellyConformanceError("Use addGraph() for GRAPHS streams");
      if (this.physicalType === 1 /* TRIPLES */ && quad.graph.termType !== "DefaultGraph") {
        throw new JellyConformanceError("TRIPLES streams cannot contain named graph quads");
      }
      if (this.physicalType === 1 /* TRIPLES */) this.encodeTriple(quad, this.rows);
      else this.encodeQuad(quad, this.rows);
      this.hasStatements = true;
    }
    this.flush(metadata, true);
  }
  addGraph(graph, quads, metadata) {
    this.assertOpen();
    if (this.physicalType !== 3 /* GRAPHS */) throw new JellyConformanceError("addGraph() requires a GRAPHS physical stream");
    if (this.hasStatements) this.flush(void 0, true);
    const encodedGraph = this.encodeTerm(graph, 3, this.rows, true);
    this.rows.push({ case: "graphStart", value: { graph: encodedGraph } });
    for (const quad of quads) {
      if (!quad.graph.equals(graph)) throw new JellyConformanceError("Every quad passed to addGraph() must use the graph argument");
      this.encodeTriple(quad, this.rows);
      this.hasStatements = true;
    }
    this.rows.push({ case: "graphEnd", value: {} });
    this.flush(metadata, true);
  }
  finish() {
    this.assertOpen();
    this.finished = true;
    if (this.rows.length > 0 || this.frameCount === 0) this.flush(void 0, true);
    return this.frames;
  }
  appendRows(rows, statement) {
    if (statement && this.hasStatements && this.rows.length + rows.length > this.messageSize) this.flush(void 0, true);
    this.rows.push(...rows);
    this.hasStatements ||= statement;
  }
  flush(metadata, force = false) {
    if (force || this.rows.length > 0) {
      const frame = { rows: this.rows, metadata: metadataMap(metadata) };
      this.frameCount++;
      if (this.frameSink) this.frameSink(frame);
      else this.frames.push(frame);
    }
    this.rows = [];
    this.hasStatements = false;
  }
  encodeIri(iri, rows) {
    const hashIndex = iri.lastIndexOf("#");
    const separatorIndex = hashIndex >= 0 ? hashIndex : iri.lastIndexOf("/");
    let prefix = separatorIndex >= 0 ? iri.slice(0, separatorIndex + 1) : "";
    let name = separatorIndex >= 0 ? iri.slice(separatorIndex + 1) : iri;
    if (this.lookup.maxPrefixes === 0) {
      prefix = "";
      name = iri;
    } else {
      const id = this.prefixes.ensureId(prefix);
      if (id >= 0) rows.push({ case: "prefix", value: { id, value: prefix } });
    }
    const nameId = this.names.ensureId(name);
    if (nameId >= 0) rows.push({ case: "name", value: { id: nameId, value: name } });
    return {
      prefixId: this.lookup.maxPrefixes === 0 ? 0 : this.prefixes.ensuredPrefix(),
      nameId: this.names.ensuredName()
    };
  }
  encodeLiteral(term, rows) {
    if (term.direction) throw new JellyUnsupportedFeatureError("Directional language literals are not supported by Jelly-RDF 1.1");
    if (term.language) return { lex: term.value, kind: { case: "langtag", value: term.language } };
    if (term.datatype.value === XSD_STRING) return { lex: term.value };
    if (this.lookup.maxDatatypes === 0) throw new JellyConformanceError("Datatype lookup is disabled but a typed literal was provided");
    const id = this.datatypes.ensureId(term.datatype.value);
    if (id >= 0) rows.push({ case: "datatype", value: { id, value: term.datatype.value } });
    return { lex: term.value, kind: { case: "datatype", value: this.datatypes.ensuredDatatype() } };
  }
  encodeTerm(term, slot, rows, graph = false) {
    if (term.termType === "Quad") throw new JellyUnsupportedFeatureError("RDF-star quoted triple terms are not supported");
    if (term.termType === "Variable") throw new JellyConformanceError("RDF variables cannot be serialized as RDF statements");
    if (term.termType === "NamedNode") {
      return { case: "iri", value: this.encodeIri(term.value, rows) };
    }
    if (term.termType === "BlankNode") return { case: "bnode", value: term.value };
    if (term.termType === "Literal" && !graph) return { case: "literal", value: this.encodeLiteral(term, rows) };
    if (term.termType === "DefaultGraph" && graph) return { case: "defaultGraph", value: {} };
    throw new JellyConformanceError(`Invalid RDF term ${term.termType} in statement slot ${slot}`);
  }
  encodeSpo(quad, target, rows) {
    const subject = quad.subject;
    if (!sameTerm2(this.repeated[0], subject)) {
      target.subject = this.encodeTerm(subject, 0, rows);
      this.repeated[0] = subject;
    }
    const predicate = quad.predicate;
    if (!sameTerm2(this.repeated[1], predicate)) {
      target.predicate = this.encodeTerm(predicate, 1, rows);
      this.repeated[1] = predicate;
    }
    const object = quad.object;
    if (!sameTerm2(this.repeated[2], object)) {
      target.object = this.encodeTerm(object, 2, rows);
      this.repeated[2] = object;
    }
  }
  encodeTriple(quad, rows) {
    const value = {};
    this.encodeSpo(quad, value, rows);
    rows.push({ case: "triple", value });
  }
  encodeQuad(quad, rows) {
    const value = {};
    this.encodeSpo(quad, value, rows);
    if (!sameTerm2(this.repeated[3], quad.graph)) {
      value.graph = this.encodeTerm(quad.graph, 3, rows, true);
      this.repeated[3] = quad.graph;
    }
    rows.push({ case: "quad", value });
  }
  assertOpen() {
    if (this.finished) throw new JellyConformanceError("Jelly encoder has already ended");
  }
};

// src/codec/MessageEncoder.ts
var MessageEncoder = class {
  constructor(delimited = true) {
    this.delimited = delimited;
  }
  encode(frame) {
    return this.delimited ? encodeDelimitedRdfStreamFrame(frame) : encodeRdfStreamFrame(frame);
  }
  encodeAll(frames) {
    if (!this.delimited && frames.length !== 1) {
      throw new JellyConformanceError("Non-delimited Jelly output must contain exactly one message");
    }
    return encodeRdfStreamFrames(frames, this.delimited);
  }
};

// src/api/Writer.ts
function isOutput(value) {
  return Boolean(value && typeof value === "object" && "write" in value && "end" in value);
}
var Writer = class {
  encoder;
  messageEncoder;
  output;
  pendingCounter;
  pendingQuads = [];
  lastCompletedCounter = -1;
  mode;
  ended = false;
  streaming;
  /**
   * Delimited output with no sink is serialised frame by frame as each one
   * completes, so finished rows and terms become garbage immediately instead of
   * being retained until end().
   */
  chunks;
  constructor(outputOrOptions = {}, maybeOptions = {}) {
    const options = isOutput(outputOrOptions) ? maybeOptions : outputOrOptions;
    this.output = isOutput(outputOrOptions) ? outputOrOptions : void 0;
    this.messageEncoder = new MessageEncoder(options.delimited ?? true);
    this.streaming = Boolean(this.output && this.messageEncoder.delimited);
    const buffered = !this.output && this.messageEncoder.delimited;
    if (buffered) this.chunks = [];
    this.encoder = new Encoder(options, this.streaming ? (frame) => this.writeFrame(frame) : buffered ? (frame) => this.chunks.push(this.messageEncoder.encode(frame)) : void 0);
    for (const [prefix, iri] of Object.entries(options.namespaces ?? {})) {
      this.encoder.addNamespace(prefix, typeof iri === "string" ? iri : iri.value);
    }
  }
  addQuad(value, done) {
    try {
      if (isMessageQuad(value)) this.addMessageQuad(value);
      else {
        this.requireMode("plain");
        this.encoder.addQuad(value);
      }
      done?.(null);
    } catch (error) {
      const actual = error instanceof Error ? error : new Error(String(error));
      if (done) done(actual);
      else throw actual;
    }
  }
  addQuads(values) {
    for (const value of values) this.addQuad(value);
    if (Array.isArray(values) && "messageCount" in values) {
      this.flushPending();
      const count = values.messageCount;
      if (typeof count === "number") {
        while (this.lastCompletedCounter + 1 < count) {
          this.encoder.addMessage([]);
          this.lastCompletedCounter++;
        }
      }
    }
  }
  addNamespace(prefix, iri) {
    this.encoder.addNamespace(prefix, typeof iri === "string" ? iri : iri.value);
  }
  addMessage(message, metadata) {
    this.requireMode("messages");
    this.flushPending();
    if (message instanceof Message) {
      while (this.lastCompletedCounter + 1 < message.messageCounter) {
        this.encoder.addMessage([]);
        this.lastCompletedCounter++;
      }
      if (message.messageCounter <= this.lastCompletedCounter) throw new JellyConformanceError("Message counters must increase");
      this.encoder.addMessage(message, metadata ?? message.metadata);
      this.lastCompletedCounter = message.messageCounter;
    } else {
      this.encoder.addMessage(message, metadata);
      this.lastCompletedCounter++;
    }
  }
  /** Complete all RDF Messages below messageCount, adding any empty messages. */
  finishMessages(messageCount) {
    this.requireMode("messages");
    if (!Number.isInteger(messageCount) || messageCount < 0) throw new JellyConformanceError("Invalid messageCount");
    if (this.pendingCounter !== void 0 && this.pendingCounter < messageCount) this.flushPending();
    if (messageCount < this.lastCompletedCounter + 1) throw new JellyConformanceError("Message count cannot decrease");
    while (this.lastCompletedCounter + 1 < messageCount) {
      this.encoder.addMessage([]);
      this.lastCompletedCounter++;
    }
  }
  addGraph(graph, quads, metadata) {
    this.requireMode("messages");
    this.flushPending();
    this.encoder.addGraph(graph, quads, metadata);
    this.lastCompletedCounter++;
  }
  end(done) {
    try {
      if (this.ended) throw new JellyConformanceError("Writer has already ended");
      this.ended = true;
      this.flushPending();
      const frames = this.encoder.finish();
      if (this.streaming) {
        this.output.end((error) => done?.(error ?? null));
        return;
      }
      const bytes = this.chunks ? this.collectChunks() : this.messageEncoder.encodeAll(frames);
      if (this.output) {
        this.output.write(bytes);
        this.output.end((error) => done?.(error ?? null, error ? void 0 : bytes));
      } else done?.(null, bytes);
    } catch (error) {
      const actual = error instanceof Error ? error : new Error(String(error));
      if (done) done(actual);
      else throw actual;
    }
  }
  collectChunks() {
    const chunks = this.chunks;
    const output = chunks.length === 1 ? chunks[0] : concatBytes(chunks);
    chunks.length = 0;
    return output;
  }
  writeFrame(frame) {
    this.output.write(this.messageEncoder.encode(frame));
  }
  addMessageQuad(entry) {
    this.requireMode("messages");
    if (!Number.isInteger(entry.messageCounter) || entry.messageCounter < 0) throw new JellyConformanceError("Invalid messageCounter");
    if (this.pendingCounter === void 0) {
      while (this.lastCompletedCounter + 1 < entry.messageCounter) {
        this.encoder.addMessage([]);
        this.lastCompletedCounter++;
      }
      this.pendingCounter = entry.messageCounter;
    } else if (entry.messageCounter !== this.pendingCounter) {
      if (entry.messageCounter < this.pendingCounter) throw new JellyConformanceError("Message counters must be ordered");
      this.flushPending();
      while (this.lastCompletedCounter + 1 < entry.messageCounter) {
        this.encoder.addMessage([]);
        this.lastCompletedCounter++;
      }
      this.pendingCounter = entry.messageCounter;
    }
    this.pendingQuads.push(entry.quad);
  }
  flushPending() {
    if (this.pendingCounter === void 0) return;
    this.encoder.addMessage(this.pendingQuads);
    this.lastCompletedCounter = this.pendingCounter;
    this.pendingCounter = void 0;
    this.pendingQuads = [];
  }
  requireMode(mode) {
    if (this.mode && this.mode !== mode) throw new JellyConformanceError("Cannot mix plain quad and explicit message writer calls");
    this.mode = mode;
  }
};

// src/api/StreamParser.ts
import { Transform } from "stream";
var StreamParser = class extends Transform {
  messageReader;
  decoder;
  messageMode;
  pending = [];
  pendingIndex = 0;
  busy = false;
  constructor(options = {}) {
    super({ ...options, readableObjectMode: true, writableObjectMode: false });
    this.messageMode = options.messages === true || options.rdfMessages === true;
    this.decoder = new Decoder(options, {
      options: (value) => this.emit("options", value),
      namespace: (prefix, iri) => this.emit("namespace", prefix, iri)
    });
    this.messageReader = new DirectMessageDecoder(options, this.decoder);
  }
  import(stream) {
    stream.on("error", (error) => this.destroy(error));
    stream.pipe(this);
    return this;
  }
  _transform(chunk, _encoding, callback) {
    this.busy = true;
    try {
      if (this.flushPending() && this.messageReader.paused) {
        this.messageReader.resumeEach((message) => this.accept(message));
      }
      this.messageReader.writeEach(chunk, (message) => this.accept(message));
    } catch (error) {
      this.busy = false;
      callback(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    this.busy = false;
    callback();
  }
  _flush(callback) {
    this.busy = true;
    try {
      this.drainPending();
      this.messageReader.endEach((message) => {
        this.enqueue(message);
        this.drainPending();
        return true;
      });
      this.decoder.finish();
    } catch (error) {
      this.busy = false;
      callback(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    this.busy = false;
    callback();
  }
  _read(size) {
    if (this.busy) return;
    this.busy = true;
    try {
      if (this.flushPending() && this.messageReader.paused) {
        this.messageReader.resumeEach((message) => this.accept(message));
      }
    } catch (error) {
      this.busy = false;
      this.destroy(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    this.busy = false;
    if (!this.messageReader.paused && this.pendingIndex >= this.pending.length) super._read(size);
  }
  /** Returns false when the readable side is full and decoding should pause. */
  accept(message) {
    this.enqueue(message);
    return this.flushPending();
  }
  enqueue(message) {
    this.emit("message", message);
    for (const quad of message) {
      if (this.messageMode) {
        this.emit("messageCounter", message.messageCounter, quad);
        this.pending.push({ quad, messageCounter: message.messageCounter });
      } else this.pending.push(quad);
    }
  }
  flushPending() {
    while (this.pendingIndex < this.pending.length) {
      if (!this.push(this.pending[this.pendingIndex++])) return false;
    }
    this.pending.length = 0;
    this.pendingIndex = 0;
    return true;
  }
  drainPending() {
    while (this.pendingIndex < this.pending.length) this.push(this.pending[this.pendingIndex++]);
    this.pending.length = 0;
    this.pendingIndex = 0;
  }
};

// src/api/StreamWriter.ts
import { Transform as Transform2 } from "stream";
var StreamWriter = class extends Transform2 {
  writer;
  constructor(options = {}) {
    super({ writableObjectMode: true, readableObjectMode: false });
    this.writer = new Writer({
      write: (chunk) => this.push(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)),
      end: (callback) => callback?.(null)
    }, options);
  }
  import(stream) {
    stream.on("error", (error) => this.destroy(error));
    stream.pipe(this);
    return this;
  }
  _transform(value, _encoding, callback) {
    this.writer.addQuad(value, (error) => callback(error ?? void 0));
  }
  _flush(callback) {
    this.writer.end((error) => callback(error ?? void 0));
  }
};
export {
  BlankNode,
  DEFAULT_LOOKUP_PRESET,
  DataFactory,
  Decoder,
  DefaultGraph,
  Encoder,
  JellyConformanceError,
  JellyError,
  JellyUnsupportedFeatureError,
  Literal,
  LogicalStreamType,
  LookupDecoder,
  LookupEncoder,
  MAX_LOOKUP_SIZE,
  MIN_NAME_LOOKUP_SIZE,
  Message,
  MessageDecoder,
  MessageEncoder,
  NamedNode,
  Parser,
  PhysicalStreamType,
  Quad,
  RDF_LANG_STRING,
  SMALL_LOOKUP_PRESET,
  StreamParser,
  StreamWriter,
  Variable,
  Writer,
  XSD_STRING,
  delimitedJellyHint,
  isMessageQuad,
  normalizeLookupPreset,
  toMessages
};
