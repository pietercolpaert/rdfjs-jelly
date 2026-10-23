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
var JellySparqlResultError = class extends JellyError {
  constructor(resultIndex, message) {
    super(message);
    this.resultIndex = resultIndex;
  }
};

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
var RdfStreamType = /* @__PURE__ */ ((RdfStreamType2) => {
  RdfStreamType2[RdfStreamType2["FLAT"] = 0] = "FLAT";
  RdfStreamType2[RdfStreamType2["MESSAGES"] = 1] = "MESSAGES";
  return RdfStreamType2;
})(RdfStreamType || {});
var RdfVersion = /* @__PURE__ */ ((RdfVersion2) => {
  RdfVersion2[RdfVersion2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
  RdfVersion2[RdfVersion2["RDF_1_1"] = 1] = "RDF_1_1";
  RdfVersion2[RdfVersion2["RDF_1_2_BASIC"] = 2] = "RDF_1_2_BASIC";
  RdfVersion2[RdfVersion2["RDF_1_2"] = 3] = "RDF_1_2";
  return RdfVersion2;
})(RdfVersion || {});
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

// src/options.ts
var MIN_NAME_LOOKUP_SIZE = 8;
var MIN_PREFIX_LOOKUP_SIZE = 4;
var MAX_LOOKUP_SIZE = 4096;
var MAX_DECODED_LOOKUP_SIZE = 1048576;
var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
var RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";
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
function normalizeColumnLookupPreset(value = {}) {
  const preset = normalizeLookupPreset({ ...value, maxPrefixes: 0 });
  const maxPrefixes = value.maxPrefixes ?? DEFAULT_LOOKUP_PRESET.maxPrefixes;
  if (!Number.isInteger(maxPrefixes) || maxPrefixes < 0 || maxPrefixes > MAX_LOOKUP_SIZE) {
    throw new JellyConformanceError(`Prefix lookup size must be between 0 and ${MAX_LOOKUP_SIZE}`);
  }
  if (preset.maxNames < 128) throw new JellyConformanceError("Column streams require a name lookup size of at least 128");
  return { ...preset, maxPrefixes };
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
        new NamedNode(languageOrDatatype.direction ? RDF_DIR_LANG_STRING : RDF_LANG_STRING),
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

// src/codec/ColumnTermDecoder.ts
function fail(message) {
  throw new JellyConformanceError(message);
}
var ColumnTermDecoder = class {
  constructor(options = {}) {
    this.options = options;
    this.factory = options.factory ?? DataFactory;
    if (options.maxRowsPerBatch !== void 0 && (!Number.isInteger(options.maxRowsPerBatch) || options.maxRowsPerBatch < 0)) fail("maxRowsPerBatch must be a nonnegative integer");
  }
  factory;
  names;
  prefixes;
  datatypes;
  resetLookups(raw) {
    const limit = this.options.maxLookupTableSize ?? MAX_DECODED_LOOKUP_SIZE;
    if (raw.maxNameTableSize < 128) fail("Column streams require a name lookup size of at least 128");
    this.names = new LookupDecoder(raw.maxNameTableSize, limit);
    this.prefixes = new LookupDecoder(raw.maxPrefixTableSize, limit);
    this.datatypes = new LookupDecoder(raw.maxDatatypeTableSize, limit);
  }
  applyLookups(groups) {
    for (const [entries, table] of groups) for (const entry of entries) {
      const values = entry.values ?? [];
      for (let j = 0; j < values.length; j++) table.assign(j === 0 ? entry.id ?? 0 : 0, values[j]);
    }
  }
  checkRowCount(n) {
    if (n > 134217727 || n > (this.options.maxRowsPerBatch ?? 1048576)) fail("Column row_count exceeds configured size limit");
  }
  iri(value, state) {
    state[0] = value.prefixId || state[0];
    state[1] = value.nameId || state[1] + 1;
    return this.resolve(state[0], state[1]);
  }
  resolve(prefix, name) {
    return this.factory.namedNode((prefix ? this.prefixes.datatype(prefix) : "") + this.names.datatype(name));
  }
  datatype(id) {
    const value = this.datatypes.datatype(id);
    if (value === RDF_LANG_STRING || value === RDF_DIR_LANG_STRING) fail("Language datatypes require a language tag");
    return this.factory.namedNode(value);
  }
  literal(lex, language, direction = 0, datatype) {
    if (direction < 0 || direction > 2) fail(`Unknown base direction ${direction}`);
    if (direction && language === void 0) fail("Base direction requires a language tag");
    const term = datatype !== void 0 ? this.factory.literal(lex, this.datatype(datatype)) : direction ? this.factory.literal(lex, { language, direction: direction === 1 ? "ltr" : "rtl" }) : this.factory.literal(lex, language);
    if (direction && (term.direction !== (direction === 1 ? "ltr" : "rtl") || term.datatype.value !== RDF_DIR_LANG_STRING)) {
      throw new JellyUnsupportedFeatureError("The RDF data factory does not support directional language literals");
    }
    return term;
  }
  triple(t, state, depth = 1) {
    if (depth > 64) fail("Triple terms nested too deeply");
    const marked = t;
    const sk = marked.$subject ?? t.subject;
    const ok = marked.$object ?? t.object;
    const s = sk === "sIri" ? this.iri(t.sIri, state) : sk === "sBnode" ? this.factory.blankNode(t.sBnode) : fail("Missing triple term subject");
    if (!t.pIri) fail("Missing triple term predicate");
    const p = this.iri(t.pIri, state);
    let o;
    if (ok === "oIri") o = this.iri(t.oIri, state);
    else if (ok === "oBnode") o = this.factory.blankNode(t.oBnode);
    else if (ok === "oTripleTerm") o = this.triple(t.oTripleTerm, state, depth + 1);
    else if (ok === "oLiteral") {
      const l = t.oLiteral;
      const k = l.$literalKind ?? l.literalKind;
      o = this.literal(l.lex, k === "langtag" ? l.langtag : void 0, l.direction, k === "datatype" ? l.datatype : void 0);
    } else return fail("Missing triple term object");
    return this.factory.quad(s, p, o);
  }
  column(c, n) {
    if (!c) return new Array(n);
    const { nameIds, prefixIds, lexValues, literalKinds, langtags, langtagDirections } = c;
    if (![0, 1, nameIds.length].includes(prefixIds.length)) fail("Invalid prefix_ids length");
    if (![0, 1, lexValues.length].includes(literalKinds.length)) fail("Invalid literal_kinds length");
    if (langtagDirections.length && langtagDirections.length !== langtags.length) fail("Invalid langtag_directions length");
    const state = [0, 0];
    const iris = nameIds.map((name, j) => {
      state[1] = name || state[1] + 1;
      state[0] = prefixIds.length === 1 ? prefixIds[0] : prefixIds[j] || state[0];
      return this.resolve(state[0], state[1]);
    });
    const literals = lexValues.map((lex, j) => {
      const kind = literalKinds.length === 1 ? literalKinds[0] : literalKinds[j] ?? 0;
      if (kind === 0) return this.literal(lex);
      if (kind % 2) return this.literal(lex, void 0, 0, (kind + 1) / 2);
      const index = kind / 2 - 1;
      if (index >= langtags.length) fail("Invalid language tag index");
      return this.literal(lex, langtags[index], langtagDirections[index] ?? 0);
    });
    const tripleState = [0, 0];
    const lists = [iris, literals, c.bnodes.map((v) => this.factory.blankNode(v)), c.tripleTerms.map((t) => this.triple(t, tripleState))];
    const total = lists.reduce((sum, list) => sum + list.length, 0);
    const used = lists.filter((list) => list.length);
    const values = [];
    if (!c.kinds.length && used.length <= 1) {
      for (const value of used[0] ?? []) values.push(value);
    } else {
      if (c.kinds.length !== Math.ceil(total / 4)) fail("Invalid kinds length");
      if (total % 4 && c.kinds[c.kinds.length - 1] >>> 2 * (total % 4)) fail("Nonzero unused kinds bits");
      const indices = [0, 0, 0, 0];
      for (let j = 0; j < total; j++) {
        const kind = c.kinds[j >> 2] >> 2 * (j & 3) & 3;
        const value = lists[kind][indices[kind]];
        indices[kind]++;
        if (!value) fail("Kinds references missing run value");
        values.push(value);
      }
    }
    const cells = [];
    let i = 0;
    for (let k = 0; k < c.layouts.length; k++) {
      const token = c.layouts[k];
      const skip = token >>> 5;
      const kind = token >>> 4 & 1;
      let length = token & 15;
      if (length === 15) {
        if (++k >= c.layouts.length) fail("Layout escape without extension");
        length += c.layouts[k];
      }
      const count = length + (kind ? 1 : 2);
      if (i + skip > values.length || cells.length + skip + count > n) fail("Column layout exceeds bounds");
      for (let j = 0; j < skip; j++) cells.push(values[i++]);
      const value = kind ? void 0 : values[i++];
      if (!kind && !value) fail("Repeat run without a value");
      for (let j = 0; j < count; j++) cells.push(value);
    }
    if (cells.length + values.length - i > n) fail("Too many column values");
    while (i < values.length) cells.push(values[i++]);
    cells.length = n;
    return cells;
  }
};

// src/codec/ColumnDecoder.ts
function fail2(message) {
  throw new JellyConformanceError(message);
}
var ColumnDecoder = class extends ColumnTermDecoder {
  constructor(options, events) {
    super(options);
    this.events = events;
  }
  streamOptions;
  namespaces = /* @__PURE__ */ Object.create(null);
  current = [];
  counter = 0;
  blankNodes = /* @__PURE__ */ new Map();
  usedBlankLabels = /* @__PURE__ */ new Set();
  decode(frame) {
    const out = [];
    const metadata = new Map(Object.entries(frame.metadata).map(([k, v]) => [k, new Uint8Array(v)]));
    const endMessage = () => {
      out.push(new Message(this.counter++, this.current, metadata));
      this.current = [];
    };
    if (frame.rows.length > 1) fail2("Column layout permits only one options row per frame");
    for (const row of frame.rows) {
      const kind = row.$row ?? row.row;
      if (kind !== "options") fail2("Row layout data is invalid in a column stream");
      const raw = row.options;
      const old = this.streamOptions;
      if (raw.version !== 3) fail2("Cannot change Jelly layout within a stream");
      if (raw.generalizedStatements || raw.rdfStar || raw.logicalType) fail2("Row layout options are invalid in a column stream");
      if (raw.physicalType !== 1 && raw.physicalType !== 2) fail2("Column streams require physical type TRIPLES or QUADS");
      if (raw.streamType !== 0 && raw.streamType !== 1) fail2(`Unknown RDF stream type ${raw.streamType}`);
      if (raw.rdfVersion < 0 || raw.rdfVersion > 3) fail2(`Unknown RDF version ${raw.rdfVersion}`);
      if (old && (raw.physicalType !== old.physicalType || raw.streamType !== old.streamType)) fail2("Restated options must preserve physical type, stream type, and version");
      if (old?.streamType === 1) {
        if (this.current.length) endMessage();
        this.blankNodes.clear();
      }
      this.resetLookups(raw);
      this.streamOptions = {
        streamName: raw.streamName,
        physicalType: raw.physicalType,
        logicalType: 0,
        generalizedStatements: false,
        rdfStar: false,
        maxNameTableSize: raw.maxNameTableSize,
        maxPrefixTableSize: raw.maxPrefixTableSize,
        maxDatatypeTableSize: raw.maxDatatypeTableSize,
        version: 3,
        streamType: raw.streamType,
        rdfVersion: raw.rdfVersion
      };
      this.events.options?.(this.streamOptions);
    }
    const b = frame.columns;
    if (!b) return out;
    if (!this.streamOptions) fail2("Column batch before stream options");
    const n = b.rowCount;
    this.checkRowCount(n);
    this.applyLookups([[b.names, this.names], [b.prefixes, this.prefixes], [b.datatypes, this.datatypes]]);
    const nsState = [0, 0];
    for (const rawNs of b.namespaces) {
      const ns = rawNs;
      const term = this.iri(ns.value ?? {}, nsState);
      this.namespaces[ns.name] = term;
      this.events.namespace?.(ns.name, term);
    }
    if (this.streamOptions.physicalType === 1 && b.graphs) fail2("Graphs column in a TRIPLES stream");
    const columns = [b.subjects, b.predicates, b.objects, b.graphs].map((c) => this.column(c, n));
    const lengths = b.messageLengths;
    if (this.streamOptions.streamType === 0 && lengths.length) fail2("Message boundaries in a FLAT stream");
    if (lengths.reduce((sum, v) => sum + v, 0) > n) fail2("Message lengths exceed row_count");
    let pos = 0;
    const append = (count) => {
      for (const end = pos + count; pos < end; pos++) {
        const [s, p, o, g] = columns.map((c) => c[pos]);
        if (!s || s.termType !== "NamedNode" && s.termType !== "BlankNode") fail2("Invalid or unbound subject in column");
        if (!p || p.termType !== "NamedNode") fail2("Invalid or unbound predicate in column");
        if (!o) fail2("Unbound object in column");
        if (g && g.termType !== "NamedNode" && g.termType !== "BlankNode") fail2("Invalid graph in column");
        this.current.push(this.factory.quad(this.scoped(s), p, this.scoped(o), g ? this.scoped(g) : this.factory.defaultGraph()));
      }
    };
    for (const length of lengths) {
      append(length);
      endMessage();
      this.blankNodes.clear();
    }
    append(n - pos);
    if (this.streamOptions.streamType === 0) endMessage();
    return out;
  }
  finish() {
    if (!this.streamOptions) fail2("No Jelly stream options row was found");
    if (!this.current.length) return [];
    const out = new Message(this.counter++, this.current);
    this.current = [];
    return [out];
  }
  scoped(term) {
    if (this.streamOptions.streamType !== 1) return term;
    if (term.termType === "Quad") return this.factory.quad(this.scoped(term.subject), term.predicate, this.scoped(term.object));
    if (term.termType !== "BlankNode") return term;
    let node = this.blankNodes.get(term.value);
    if (!node) {
      let label = term.value;
      while (this.usedBlankLabels.has(label)) label = `jelly${this.counter}_${label}`;
      this.usedBlankLabels.add(label);
      node = this.factory.blankNode(label);
      this.blankNodes.set(term.value, node);
    }
    return node;
  }
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
var $RangeError = $util.global.RangeError;
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
          const proto3 = {};
          proto3.v1 = (function() {
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
              RdfIri.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfIri;
            })();
            v1.RdfVersion = (function() {
              const valuesById = {}, values = $Object.create(valuesById);
              values[valuesById[0] = "RDF_VERSION_UNSPECIFIED"] = 0;
              values[valuesById[1] = "RDF_VERSION_1_1"] = 1;
              values[valuesById[2] = "RDF_VERSION_1_2_BASIC"] = 2;
              values[valuesById[3] = "RDF_VERSION_1_2"] = 3;
              return values;
            })();
            v1.RdfBaseDirection = (function() {
              const valuesById = {}, values = $Object.create(valuesById);
              values[valuesById[0] = "RDF_BASE_DIRECTION_UNSPECIFIED"] = 0;
              values[valuesById[1] = "RDF_BASE_DIRECTION_LTR"] = 1;
              values[valuesById[2] = "RDF_BASE_DIRECTION_RTL"] = 2;
              return values;
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
              RdfLiteral.prototype.direction = 0;
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
                if (message.direction != null && $Object.hasOwnProperty.call(message, "direction") && message.direction !== 0)
                  writer.uint32(
                    /* id 4, wireType 0 =*/
                    32
                  ).int32(message.direction);
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
              RdfLiteral.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfLiteral;
            })();
            v1.RdfTripleTerm = (function() {
              const RdfTripleTerm = function(properties) {
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfTripleTerm.prototype.sIri = null;
              RdfTripleTerm.prototype.sBnode = null;
              RdfTripleTerm.prototype.pIri = null;
              RdfTripleTerm.prototype.oIri = null;
              RdfTripleTerm.prototype.oBnode = null;
              RdfTripleTerm.prototype.oLiteral = null;
              RdfTripleTerm.prototype.oTripleTerm = null;
              let $oneOfFields;
              $Object.defineProperty(RdfTripleTerm.prototype, "subject", {
                get: $util.oneOfGetter($oneOfFields = ["sIri", "sBnode"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              $Object.defineProperty(RdfTripleTerm.prototype, "object", {
                get: $util.oneOfGetter($oneOfFields = ["oIri", "oBnode", "oLiteral", "oTripleTerm"]),
                set: $util.oneOfSetter($oneOfFields)
              });
              RdfTripleTerm.create = function(properties) {
                return new RdfTripleTerm(properties);
              };
              RdfTripleTerm.encode = function(message, writer, _depth) {
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
                if (message.pIri != null && $Object.hasOwnProperty.call(message, "pIri"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.encode(message.pIri, writer.uint32(
                    /* id 5, wireType 2 =*/
                    42
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
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.encode(message.oTripleTerm, writer.uint32(
                    /* id 12, wireType 2 =*/
                    98
                  ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfTripleTerm.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfTripleTerm.decode = function(reader, length, _end, _depth, _target) {
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
                    case 5: {
                      if (wireType !== 2)
                        break;
                      message.pIri = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfIri.decode(reader, reader.uint32(), $undefined, _depth + 1, message.pIri);
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
                      message.oTripleTerm = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.decode(reader, reader.uint32(), $undefined, _depth + 1, message.oTripleTerm);
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
              RdfTripleTerm.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfTripleTerm;
            })();
            v1.RdfLookupEntryPacked = (function() {
              const RdfLookupEntryPacked = function(properties) {
                this.values = [];
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfLookupEntryPacked.prototype.id = 0;
              RdfLookupEntryPacked.prototype.values = $util.emptyArray;
              RdfLookupEntryPacked.create = function(properties) {
                return new RdfLookupEntryPacked(properties);
              };
              RdfLookupEntryPacked.encode = function(message, writer, _depth) {
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
                if (message.values != null && message.values.length)
                  for (let i = 0; i < message.values.length; ++i)
                    writer.uint32(
                      /* id 2, wireType 2 =*/
                      18
                    ).string(message.values[i]);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfLookupEntryPacked.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfLookupEntryPacked.decode = function(reader, length, _end, _depth, _target) {
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
              RdfLookupEntryPacked.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfLookupEntryPacked;
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
              RdfStreamOptions.prototype.streamType = 0;
              RdfStreamOptions.prototype.rdfVersion = 0;
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
                if (message.streamType != null && $Object.hasOwnProperty.call(message, "streamType") && message.streamType !== 0)
                  writer.uint32(
                    /* id 5, wireType 0 =*/
                    40
                  ).int32(message.streamType);
                if (message.rdfVersion != null && $Object.hasOwnProperty.call(message, "rdfVersion") && message.rdfVersion !== 0)
                  writer.uint32(
                    /* id 6, wireType 0 =*/
                    48
                  ).int32(message.rdfVersion);
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
            v1.RdfStreamType = (function() {
              const valuesById = {}, values = $Object.create(valuesById);
              values[valuesById[0] = "RDF_STREAM_TYPE_FLAT"] = 0;
              values[valuesById[1] = "RDF_STREAM_TYPE_MESSAGES"] = 1;
              return values;
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
              RdfStreamFrame.prototype.columns = null;
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
                if (message.columns != null && $Object.hasOwnProperty.call(message, "columns"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.encode(message.columns, writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
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
                      message.rows.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfStreamRow.decode(reader, reader.uint32(), $undefined, _depth + 1));
                      continue;
                    }
                    case 2: {
                      if (wireType !== 2)
                        break;
                      message.columns = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.decode(reader, reader.uint32(), $undefined, _depth + 1, message.columns);
                      continue;
                    }
                    case 15: {
                      if (wireType !== 2)
                        break;
                      if (message.metadata === $util.emptyObject)
                        message.metadata = {};
                      let end2 = reader.uint32() + reader.pos;
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
              RdfStreamFrame.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfStreamFrame;
            })();
            v1.RdfColumnBatch = (function() {
              const RdfColumnBatch = function(properties) {
                this.names = [];
                this.prefixes = [];
                this.datatypes = [];
                this.namespaces = [];
                this.messageLengths = [];
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfColumnBatch.prototype.rowCount = 0;
              RdfColumnBatch.prototype.names = $util.emptyArray;
              RdfColumnBatch.prototype.prefixes = $util.emptyArray;
              RdfColumnBatch.prototype.datatypes = $util.emptyArray;
              RdfColumnBatch.prototype.namespaces = $util.emptyArray;
              RdfColumnBatch.prototype.subjects = null;
              RdfColumnBatch.prototype.predicates = null;
              RdfColumnBatch.prototype.objects = null;
              RdfColumnBatch.prototype.graphs = null;
              RdfColumnBatch.prototype.messageLengths = $util.emptyArray;
              RdfColumnBatch.create = function(properties) {
                return new RdfColumnBatch(properties);
              };
              RdfColumnBatch.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.rowCount != null && $Object.hasOwnProperty.call(message, "rowCount") && message.rowCount !== 0)
                  writer.uint32(
                    /* id 1, wireType 0 =*/
                    8
                  ).uint32(message.rowCount);
                if (message.names != null && message.names.length)
                  for (let i = 0; i < message.names.length; ++i)
                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.names[i], writer.uint32(
                      /* id 2, wireType 2 =*/
                      18
                    ).fork(), _depth + 1).ldelim();
                if (message.prefixes != null && message.prefixes.length)
                  for (let i = 0; i < message.prefixes.length; ++i)
                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.prefixes[i], writer.uint32(
                      /* id 3, wireType 2 =*/
                      26
                    ).fork(), _depth + 1).ldelim();
                if (message.datatypes != null && message.datatypes.length)
                  for (let i = 0; i < message.datatypes.length; ++i)
                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.datatypes[i], writer.uint32(
                      /* id 4, wireType 2 =*/
                      34
                    ).fork(), _depth + 1).ldelim();
                if (message.namespaces != null && message.namespaces.length)
                  for (let i = 0; i < message.namespaces.length; ++i)
                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.encode(message.namespaces[i], writer.uint32(
                      /* id 5, wireType 2 =*/
                      42
                    ).fork(), _depth + 1).ldelim();
                if (message.subjects != null && $Object.hasOwnProperty.call(message, "subjects"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.subjects, writer.uint32(
                    /* id 6, wireType 2 =*/
                    50
                  ).fork(), _depth + 1).ldelim();
                if (message.predicates != null && $Object.hasOwnProperty.call(message, "predicates"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.predicates, writer.uint32(
                    /* id 7, wireType 2 =*/
                    58
                  ).fork(), _depth + 1).ldelim();
                if (message.objects != null && $Object.hasOwnProperty.call(message, "objects"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.objects, writer.uint32(
                    /* id 8, wireType 2 =*/
                    66
                  ).fork(), _depth + 1).ldelim();
                if (message.graphs != null && $Object.hasOwnProperty.call(message, "graphs"))
                  $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.graphs, writer.uint32(
                    /* id 9, wireType 2 =*/
                    74
                  ).fork(), _depth + 1).ldelim();
                if (message.messageLengths != null && message.messageLengths.length)
                  writer.uint32(
                    /* id 15, wireType 2 =*/
                    122
                  ).uint32s(message.messageLengths);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfColumnBatch.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfColumnBatch.decode = function(reader, length, _end, _depth, _target) {
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
                      message.names.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.uint32(), $undefined, _depth + 1));
                      continue;
                    }
                    case 3: {
                      if (wireType !== 2)
                        break;
                      if (!(message.prefixes && message.prefixes.length))
                        message.prefixes = [];
                      message.prefixes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.uint32(), $undefined, _depth + 1));
                      continue;
                    }
                    case 4: {
                      if (wireType !== 2)
                        break;
                      if (!(message.datatypes && message.datatypes.length))
                        message.datatypes = [];
                      message.datatypes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.uint32(), $undefined, _depth + 1));
                      continue;
                    }
                    case 5: {
                      if (wireType !== 2)
                        break;
                      if (!(message.namespaces && message.namespaces.length))
                        message.namespaces = [];
                      message.namespaces.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration.decode(reader, reader.uint32(), $undefined, _depth + 1));
                      continue;
                    }
                    case 6: {
                      if (wireType !== 2)
                        break;
                      message.subjects = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.uint32(), $undefined, _depth + 1, message.subjects);
                      continue;
                    }
                    case 7: {
                      if (wireType !== 2)
                        break;
                      message.predicates = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.uint32(), $undefined, _depth + 1, message.predicates);
                      continue;
                    }
                    case 8: {
                      if (wireType !== 2)
                        break;
                      message.objects = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.uint32(), $undefined, _depth + 1, message.objects);
                      continue;
                    }
                    case 9: {
                      if (wireType !== 2)
                        break;
                      message.graphs = $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.uint32(), $undefined, _depth + 1, message.graphs);
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
              RdfColumnBatch.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfColumnBatch;
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
                if (length !== $undefined) {
                  if (reader.pos !== end)
                    throw $RangeError("index out of range");
                  reader.len = length;
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
            v1.RdfColumn = (function() {
              const RdfColumn = function(properties) {
                this.layouts = [];
                this.nameIds = [];
                this.prefixIds = [];
                this.lexValues = [];
                this.literalKinds = [];
                this.langtags = [];
                this.langtagDirections = [];
                this.bnodes = [];
                this.tripleTerms = [];
                if (properties) {
                  for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                      this[keys[i]] = properties[keys[i]];
                }
              };
              RdfColumn.prototype.kinds = $util.newBuffer([]);
              RdfColumn.prototype.layouts = $util.emptyArray;
              RdfColumn.prototype.nameIds = $util.emptyArray;
              RdfColumn.prototype.prefixIds = $util.emptyArray;
              RdfColumn.prototype.lexValues = $util.emptyArray;
              RdfColumn.prototype.literalKinds = $util.emptyArray;
              RdfColumn.prototype.langtags = $util.emptyArray;
              RdfColumn.prototype.langtagDirections = $util.emptyArray;
              RdfColumn.prototype.bnodes = $util.emptyArray;
              RdfColumn.prototype.tripleTerms = $util.emptyArray;
              RdfColumn.create = function(properties) {
                return new RdfColumn(properties);
              };
              RdfColumn.encode = function(message, writer, _depth) {
                if (!writer)
                  writer = $Writer.create();
                if (_depth === $undefined)
                  _depth = 0;
                if (_depth > $util.recursionLimit)
                  throw $Error("max depth exceeded");
                if (message.kinds != null && $Object.hasOwnProperty.call(message, "kinds") && message.kinds.length)
                  writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).bytes(message.kinds);
                if (message.layouts != null && message.layouts.length)
                  writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).uint32s(message.layouts);
                if (message.nameIds != null && message.nameIds.length)
                  writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).uint32s(message.nameIds);
                if (message.prefixIds != null && message.prefixIds.length)
                  writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).uint32s(message.prefixIds);
                if (message.lexValues != null && message.lexValues.length)
                  for (let i = 0; i < message.lexValues.length; ++i)
                    writer.uint32(
                      /* id 5, wireType 2 =*/
                      42
                    ).string(message.lexValues[i]);
                if (message.literalKinds != null && message.literalKinds.length)
                  writer.uint32(
                    /* id 6, wireType 2 =*/
                    50
                  ).uint32s(message.literalKinds);
                if (message.langtags != null && message.langtags.length)
                  for (let i = 0; i < message.langtags.length; ++i)
                    writer.uint32(
                      /* id 7, wireType 2 =*/
                      58
                    ).string(message.langtags[i]);
                if (message.langtagDirections != null && message.langtagDirections.length)
                  writer.uint32(
                    /* id 8, wireType 2 =*/
                    66
                  ).uint32s(message.langtagDirections);
                if (message.bnodes != null && message.bnodes.length)
                  for (let i = 0; i < message.bnodes.length; ++i)
                    writer.uint32(
                      /* id 9, wireType 2 =*/
                      74
                    ).string(message.bnodes[i]);
                if (message.tripleTerms != null && message.tripleTerms.length)
                  for (let i = 0; i < message.tripleTerms.length; ++i)
                    $root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.encode(message.tripleTerms[i], writer.uint32(
                      /* id 10, wireType 2 =*/
                      82
                    ).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                  for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
                return writer;
              };
              RdfColumn.encodeDelimited = function(message, writer) {
                return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
              };
              RdfColumn.decode = function(reader, length, _end, _depth, _target) {
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
                      message.tripleTerms.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.decode(reader, reader.uint32(), $undefined, _depth + 1));
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
              RdfColumn.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfColumn;
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
                if (length !== $undefined) {
                  if (reader.pos !== end)
                    throw $RangeError("index out of range");
                  reader.len = length;
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
                if (length !== $undefined) {
                  if (reader.pos !== end)
                    throw $RangeError("index out of range");
                  reader.len = length;
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
                if (length !== $undefined) {
                  if (reader.pos !== end)
                    throw $RangeError("index out of range");
                  reader.len = length;
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
              RdfGraphEnd.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfGraphEnd;
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
              RdfDatatypeEntry.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                  reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
              };
              return RdfDatatypeEntry;
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
                if (length !== $undefined) {
                  if (reader.pos !== end)
                    throw $RangeError("index out of range");
                  reader.len = length;
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
            v1.sparql = (function() {
              const sparql = {};
              sparql.SparqlResultsOptions = (function() {
                const SparqlResultsOptions = function(properties) {
                  if (properties) {
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
                  }
                };
                SparqlResultsOptions.prototype.streamName = "";
                SparqlResultsOptions.prototype.streamType = 0;
                SparqlResultsOptions.prototype.rdfVersion = 0;
                SparqlResultsOptions.prototype.maxNameTableSize = 0;
                SparqlResultsOptions.prototype.maxPrefixTableSize = 0;
                SparqlResultsOptions.prototype.maxDatatypeTableSize = 0;
                SparqlResultsOptions.prototype.version = 0;
                SparqlResultsOptions.create = function(properties) {
                  return new SparqlResultsOptions(properties);
                };
                SparqlResultsOptions.encode = function(message, writer, _depth) {
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
                  if (message.streamType != null && $Object.hasOwnProperty.call(message, "streamType") && message.streamType !== 0)
                    writer.uint32(
                      /* id 2, wireType 0 =*/
                      16
                    ).int32(message.streamType);
                  if (message.rdfVersion != null && $Object.hasOwnProperty.call(message, "rdfVersion") && message.rdfVersion !== 0)
                    writer.uint32(
                      /* id 5, wireType 0 =*/
                      40
                    ).int32(message.rdfVersion);
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
                SparqlResultsOptions.encodeDelimited = function(message, writer) {
                  return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };
                SparqlResultsOptions.decode = function(reader, length, _end, _depth, _target) {
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
                SparqlResultsOptions.decodeDelimited = function(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                return SparqlResultsOptions;
              })();
              sparql.SparqlStreamType = (function() {
                const valuesById = {}, values = $Object.create(valuesById);
                values[valuesById[0] = "SPARQL_STREAM_TYPE_FLAT"] = 0;
                values[valuesById[1] = "SPARQL_STREAM_TYPE_PUNCTUATED"] = 1;
                return values;
              })();
              sparql.SparqlAskResult = (function() {
                const SparqlAskResult = function(properties) {
                  if (properties) {
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
                  }
                };
                SparqlAskResult.prototype.value = false;
                SparqlAskResult.create = function(properties) {
                  return new SparqlAskResult(properties);
                };
                SparqlAskResult.encode = function(message, writer, _depth) {
                  if (!writer)
                    writer = $Writer.create();
                  if (_depth === $undefined)
                    _depth = 0;
                  if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                  if (message.value != null && $Object.hasOwnProperty.call(message, "value") && message.value !== false)
                    writer.uint32(
                      /* id 1, wireType 0 =*/
                      8
                    ).bool(message.value);
                  if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                      writer.raw(message.$unknowns[i]);
                  return writer;
                };
                SparqlAskResult.encodeDelimited = function(message, writer) {
                  return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };
                SparqlAskResult.decode = function(reader, length, _end, _depth, _target) {
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
                SparqlAskResult.decodeDelimited = function(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                return SparqlAskResult;
              })();
              sparql.SparqlResultsTrailer = (function() {
                const SparqlResultsTrailer = function(properties) {
                  if (properties) {
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
                  }
                };
                SparqlResultsTrailer.prototype.error = "";
                SparqlResultsTrailer.create = function(properties) {
                  return new SparqlResultsTrailer(properties);
                };
                SparqlResultsTrailer.encode = function(message, writer, _depth) {
                  if (!writer)
                    writer = $Writer.create();
                  if (_depth === $undefined)
                    _depth = 0;
                  if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                  if (message.error != null && $Object.hasOwnProperty.call(message, "error") && message.error !== "")
                    writer.uint32(
                      /* id 1, wireType 2 =*/
                      10
                    ).string(message.error);
                  if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                      writer.raw(message.$unknowns[i]);
                  return writer;
                };
                SparqlResultsTrailer.encodeDelimited = function(message, writer) {
                  return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };
                SparqlResultsTrailer.decode = function(reader, length, _end, _depth, _target) {
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
                SparqlResultsTrailer.decodeDelimited = function(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                return SparqlResultsTrailer;
              })();
              sparql.SparqlResultsFrame = (function() {
                const SparqlResultsFrame = function(properties) {
                  this.variables = [];
                  this.names = [];
                  this.prefixes = [];
                  this.datatypes = [];
                  this.columns = [];
                  this.metadata = {};
                  if (properties) {
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                      if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
                  }
                };
                SparqlResultsFrame.prototype.options = null;
                SparqlResultsFrame.prototype.variables = $util.emptyArray;
                SparqlResultsFrame.prototype.rowCount = 0;
                SparqlResultsFrame.prototype.names = $util.emptyArray;
                SparqlResultsFrame.prototype.prefixes = $util.emptyArray;
                SparqlResultsFrame.prototype.datatypes = $util.emptyArray;
                SparqlResultsFrame.prototype.columns = $util.emptyArray;
                SparqlResultsFrame.prototype.askResult = null;
                SparqlResultsFrame.prototype.trailer = null;
                SparqlResultsFrame.prototype.metadata = $util.emptyObject;
                SparqlResultsFrame.create = function(properties) {
                  return new SparqlResultsFrame(properties);
                };
                SparqlResultsFrame.encode = function(message, writer, _depth) {
                  if (!writer)
                    writer = $Writer.create();
                  if (_depth === $undefined)
                    _depth = 0;
                  if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                  if (message.options != null && $Object.hasOwnProperty.call(message, "options"))
                    $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.encode(message.options, writer.uint32(
                      /* id 1, wireType 2 =*/
                      10
                    ).fork(), _depth + 1).ldelim();
                  if (message.variables != null && message.variables.length)
                    for (let i = 0; i < message.variables.length; ++i)
                      writer.uint32(
                        /* id 2, wireType 2 =*/
                        18
                      ).string(message.variables[i]);
                  if (message.rowCount != null && $Object.hasOwnProperty.call(message, "rowCount") && message.rowCount !== 0)
                    writer.uint32(
                      /* id 3, wireType 0 =*/
                      24
                    ).uint32(message.rowCount);
                  if (message.names != null && message.names.length)
                    for (let i = 0; i < message.names.length; ++i)
                      $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.names[i], writer.uint32(
                        /* id 4, wireType 2 =*/
                        34
                      ).fork(), _depth + 1).ldelim();
                  if (message.prefixes != null && message.prefixes.length)
                    for (let i = 0; i < message.prefixes.length; ++i)
                      $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.prefixes[i], writer.uint32(
                        /* id 5, wireType 2 =*/
                        42
                      ).fork(), _depth + 1).ldelim();
                  if (message.datatypes != null && message.datatypes.length)
                    for (let i = 0; i < message.datatypes.length; ++i)
                      $root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.encode(message.datatypes[i], writer.uint32(
                        /* id 6, wireType 2 =*/
                        50
                      ).fork(), _depth + 1).ldelim();
                  if (message.columns != null && message.columns.length)
                    for (let i = 0; i < message.columns.length; ++i)
                      $root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.encode(message.columns[i], writer.uint32(
                        /* id 7, wireType 2 =*/
                        58
                      ).fork(), _depth + 1).ldelim();
                  if (message.askResult != null && $Object.hasOwnProperty.call(message, "askResult"))
                    $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.encode(message.askResult, writer.uint32(
                      /* id 8, wireType 2 =*/
                      66
                    ).fork(), _depth + 1).ldelim();
                  if (message.trailer != null && $Object.hasOwnProperty.call(message, "trailer"))
                    $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.encode(message.trailer, writer.uint32(
                      /* id 9, wireType 2 =*/
                      74
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
                SparqlResultsFrame.encodeDelimited = function(message, writer) {
                  return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };
                SparqlResultsFrame.decode = function(reader, length, _end, _depth, _target) {
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
                        message.options = $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsOptions.decode(reader, reader.uint32(), $undefined, _depth + 1, message.options);
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
                        message.names.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                      }
                      case 5: {
                        if (wireType !== 2)
                          break;
                        if (!(message.prefixes && message.prefixes.length))
                          message.prefixes = [];
                        message.prefixes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                      }
                      case 6: {
                        if (wireType !== 2)
                          break;
                        if (!(message.datatypes && message.datatypes.length))
                          message.datatypes = [];
                        message.datatypes.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                      }
                      case 7: {
                        if (wireType !== 2)
                          break;
                        if (!(message.columns && message.columns.length))
                          message.columns = [];
                        message.columns.push($root.eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                      }
                      case 8: {
                        if (wireType !== 2)
                          break;
                        message.askResult = $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlAskResult.decode(reader, reader.uint32(), $undefined, _depth + 1, message.askResult);
                        continue;
                      }
                      case 9: {
                        if (wireType !== 2)
                          break;
                        message.trailer = $root.eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsTrailer.decode(reader, reader.uint32(), $undefined, _depth + 1, message.trailer);
                        continue;
                      }
                      case 15: {
                        if (wireType !== 2)
                          break;
                        if (message.metadata === $util.emptyObject)
                          message.metadata = {};
                        let end2 = reader.uint32() + reader.pos;
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
                SparqlResultsFrame.decodeDelimited = function(reader) {
                  if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                  return this.decode(reader, reader.uint32());
                };
                return SparqlResultsFrame;
              })();
              return sparql;
            })();
            return v1;
          })();
          return proto3;
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
    version: value.version,
    streamType: value.streamType,
    rdfVersion: value.rdfVersion
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
  if (value.streamType) writer.uint32(40).int32(value.streamType);
  if (value.rdfVersion) writer.uint32(48).int32(value.rdfVersion);
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
  if (frame.columns) proto.RdfColumnBatch.encode(frame.columns, writer.uint32(18).fork()).ldelim();
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
    return { rows: frame.rows.map((row) => fromRow(row)), columns: frame.columns ?? void 0, metadata };
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
function decodeProtoRdfStreamFrameReader(reader, length) {
  try {
    return proto.RdfStreamFrame.decode(reader, length);
  } catch (error) {
    throw new JellyConformanceError("Invalid Jelly protobuf frame", {
      cause: error instanceof Error ? error : void 0
    });
  }
}

// src/codec/Decoder.ts
import { Reader as Reader2 } from "protobufjs/minimal.js";
var EMPTY_METADATA = /* @__PURE__ */ new Map();
var Decoder = class {
  columns;
  parserOptions;
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
    this.parserOptions = options;
    this.factory = options.factory ?? DataFactory;
    this.strict = options.strict ?? true;
    this.maxSupportedVersion = options.maxSupportedVersion ?? 3;
    this.maxLookupTableSize = options.maxLookupTableSize ?? MAX_DECODED_LOOKUP_SIZE;
    this.events = events;
    this.defaultGraph = this.factory.defaultGraph();
  }
  /** Decodes logical messages, which may cross or share column frames. */
  decodePayloadMessages(reader, length) {
    const start = reader.pos;
    if (!this.streamOptions || this.columns) {
      const frame = decodeProtoRdfStreamFrameReader(reader, length);
      if (!frame.rows.length && !frame.columns && !this.columns) return [];
      const version = frame.rows[0]?.options?.version;
      if (this.columns || version === 3) {
        if (3 > this.maxSupportedVersion) throw new JellyUnsupportedFeatureError("Unsupported Jelly protocol version 3");
        this.columns ??= new ColumnDecoder(this.parserOptions, this.events);
        const messages = this.columns.decode(frame);
        this.streamOptions = this.columns.streamOptions;
        Object.assign(this.namespaces, this.columns.namespaces);
        return messages;
      }
      if (frame.columns) throw new JellyConformanceError("Column batch before version 3 stream options");
      reader.pos = start;
    }
    return [this.decodeRowPayload(reader, length)];
  }
  finishMessages() {
    if (this.columns) return this.columns.finish();
    this.finish();
    return [];
  }
  decode(frame) {
    if (this.columns || frame.columns || frame.rows.some((r) => r.case === "options" && r.value.version === 3)) {
      return this.decodeEncodedFrame(encodeRdfStreamFrame(frame));
    }
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
    if (this.columns || protoFrame.columns || protoFrame.rows.some((r) => r.options?.version === 3)) {
      return this.decodeEncodedFrame(proto.RdfStreamFrame.encode(protoFrame).finish());
    }
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
  decodeEncodedFrame(bytes) {
    return this.decodeProtoPayload(Reader2.create(bytes), bytes.length);
  }
  /** Frame-oriented compatibility API; use decodePayloadMessages for logical boundaries. */
  decodeProtoPayload(rawReader, length) {
    const messages = this.decodePayloadMessages(rawReader, length);
    return new Message(messages[0]?.messageCounter ?? this.messageCounter, messages.flat(), messages[0]?.metadata);
  }
  decodeRowPayload(rawReader, length) {
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
    if (!this.streamOptions || this.columns) {
      for (const message of this.decodePayloadMessages(rawReader, length)) for (const quad of message) output.push(quad);
      return;
    }
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
    if (this.columns) return;
    if (!this.streamOptions && this.sawAnyRow) throw new JellyConformanceError("No Jelly stream options row was found");
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
    if (raw.version === 3) throw new JellyConformanceError("Cannot change Jelly layout within a stream");
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
import { Reader as Reader3 } from "protobufjs/minimal.js";

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
  return input.byteLength > 0 && (input[0] === 0 || input.byteLength >= 3 && delimitedHint(input[0], input[1], input[2]));
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
    if (this.retained === 0) return true;
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
        reader = Reader3.create(buffer.subarray(offset, end));
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
      (input) => decoder.decodePayloadMessages(Reader3.create(input), input.byteLength),
      (reader, length) => decoder.decodePayloadMessages(reader, length)
    );
  }
};
var DirectQuadDecoder = class extends FramedMessageDecoder {
  constructor(options, decoder, output) {
    super(
      options,
      (input) => decoder.decodeProtoPayloadTo(Reader3.create(input), input.byteLength, output),
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
    const accept = (batch) => {
      for (const message of batch) {
        messageCount++;
        if (consume) consume(message);
        else messages.push(message);
      }
    };
    reader.decodeEach(optimizedBinaryInput(input), accept);
    accept(decoder.finishMessages());
    return { messages, decoder, messageCount };
  }
  decodeQuads(input) {
    const output = [];
    const decoder = new Decoder(this.options);
    const reader = new DirectQuadDecoder(this.options, decoder, output);
    reader.decodeEach(optimizedBinaryInput(input), () => void 0);
    for (const message of decoder.finishMessages()) for (const quad of message) output.push(quad);
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

// src/codec/ColumnTermEncoder.ts
var proto2 = eu.ostrzyciel.jelly.core.proto.v1;
var ColumnTermEncoder = class {
  constructor(rdfVersion) {
    this.rdfVersion = rdfVersion;
  }
  tables = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
  keys(term, names, datatypes, depth = 0) {
    if (term.termType === "NamedNode") names.push(term.value);
    else if (term.termType === "Literal") {
      if (term.direction && (!term.language || !["ltr", "rtl"].includes(term.direction))) throw new JellyConformanceError("Invalid directional language literal");
      if (term.direction && this.rdfVersion === 1) throw new JellyConformanceError("RDF 1.1 does not allow base directions");
      if (!term.language && term.datatype.value !== XSD_STRING) {
        if ([RDF_LANG_STRING, RDF_DIR_LANG_STRING].includes(term.datatype.value)) throw new JellyConformanceError("Language datatypes require a language tag");
        datatypes.push(term.datatype.value);
      }
    } else if (term.termType === "Quad") {
      if (this.rdfVersion === 1 || this.rdfVersion === 2) throw new JellyConformanceError("Declared RDF version does not allow triple terms");
      if (depth >= 64) throw new JellyConformanceError("Triple terms nested too deeply");
      if (!["NamedNode", "BlankNode", "Literal", "Quad"].includes(term.object.termType)) throw new JellyConformanceError("Invalid triple term object");
      if (!["NamedNode", "BlankNode"].includes(term.subject.termType) || term.predicate.termType !== "NamedNode" || term.graph.termType !== "DefaultGraph") throw new JellyConformanceError("Invalid RDF 1.2 triple term");
      for (const value of [term.subject, term.predicate, term.object]) this.keys(value, names, datatypes, depth + 1);
    } else if (!["BlankNode", "DefaultGraph"].includes(term.termType)) throw new JellyConformanceError(`Invalid RDF term ${term.termType}`);
  }
  literal(term) {
    if (term.language) return { lex: term.value, langtag: term.language, direction: term.direction === "ltr" ? 1 : term.direction === "rtl" ? 2 : 0 };
    return term.datatype.value === XSD_STRING ? { lex: term.value } : { lex: term.value, datatype: this.tables[1].get(term.datatype.value) };
  }
  triple(term) {
    const out = { pIri: { nameId: this.tables[0].get(term.predicate.value) } };
    if (term.subject.termType === "NamedNode") out.sIri = { nameId: this.tables[0].get(term.subject.value) };
    else out.sBnode = term.subject.value;
    const o = term.object;
    if (o.termType === "NamedNode") out.oIri = { nameId: this.tables[0].get(o.value) };
    else if (o.termType === "BlankNode") out.oBnode = o.value;
    else if (o.termType === "Literal") out.oLiteral = this.literal(o);
    else if (o.termType === "Quad") out.oTripleTerm = this.triple(o);
    return out;
  }
  column(terms) {
    const c = new proto2.RdfColumn();
    const kinds = [];
    let skip = 0;
    for (let i = 0; i < terms.length; ) {
      const term = terms[i];
      let end = i + 1;
      while (end < terms.length && term.equals(terms[end])) end++;
      const count = end - i;
      const unbound = term.termType === "DefaultGraph";
      if (unbound || count > 1) {
        const length = count - (unbound ? 1 : 2);
        c.layouts.push(skip * 32 + (unbound ? 16 : 0) + Math.min(length, 15));
        if (length >= 15) c.layouts.push(length - 15);
        skip = 0;
      } else skip++;
      if (!unbound) {
        if (term.termType === "NamedNode") {
          kinds.push(0);
          c.nameIds.push(this.tables[0].get(term.value));
        } else if (term.termType === "BlankNode") {
          kinds.push(2);
          c.bnodes.push(term.value);
        } else if (term.termType === "Quad") {
          kinds.push(3);
          c.tripleTerms.push(this.triple(term));
        } else if (term.termType === "Literal") {
          kinds.push(1);
          c.lexValues.push(term.value);
          if (term.language) {
            const dir = term.direction === "ltr" ? 1 : term.direction === "rtl" ? 2 : 0;
            let index = c.langtags.findIndex((tag, j) => tag === term.language && c.langtagDirections[j] === dir);
            if (index < 0) {
              index = c.langtags.length;
              c.langtags.push(term.language);
              c.langtagDirections.push(dir);
            }
            c.literalKinds.push((index + 1) * 2);
          } else c.literalKinds.push(term.datatype.value === XSD_STRING ? 0 : this.tables[1].get(term.datatype.value) * 2 - 1);
        }
      }
      i = end;
    }
    if (new Set(kinds).size > 1) {
      c.kinds = new Uint8Array(Math.ceil(kinds.length / 4));
      kinds.forEach((kind, i) => {
        c.kinds[i >> 2] |= kind << 2 * (i & 3);
      });
    }
    if (c.literalKinds.every((v) => v === 0)) c.literalKinds = [];
    else if (new Set(c.literalKinds).size === 1) c.literalKinds = [c.literalKinds[0]];
    if (c.langtagDirections.every((v) => v === 0)) c.langtagDirections = [];
    return c;
  }
};

// src/codec/ColumnEncoder.ts
var ColumnEncoder = class extends ColumnTermEncoder {
  constructor(options, sink) {
    super(options.rdfVersion ?? 3 /* RDF_1_2 */);
    this.options = options;
    this.sink = sink;
    this.physicalType = options.physicalType ?? 2 /* QUADS */;
    if (this.physicalType !== 1 && this.physicalType !== 2) throw new JellyConformanceError("Jelly 1.2 requires TRIPLES or QUADS; use QUADS for named graphs");
    if (options.logicalType) throw new JellyConformanceError("Jelly 1.2 uses streamType instead of logicalType");
    this.streamType = options.streamType ?? 0 /* FLAT */;
    if (![0, 1].includes(this.streamType) || ![0, 1, 2, 3].includes(this.rdfVersion)) throw new JellyConformanceError("Invalid streamType or rdfVersion");
    this.lookup = normalizeColumnLookupPreset(options.lookup);
    if (this.lookup.maxNames < 128) throw new JellyConformanceError("Jelly 1.2 requires a name lookup size of at least 128");
    this.size = options.messageSize ?? 250;
    if (!Number.isInteger(this.size) || this.size < 1 || this.size > 134217727) throw new JellyConformanceError("messageSize must be between 1 and 2^27 - 1");
  }
  frames = [];
  physicalType;
  lookup;
  size;
  streamType;
  quads = [];
  namespaces = [];
  first = true;
  finished = false;
  inMessage = false;
  assertOpen() {
    if (this.finished) throw new JellyConformanceError("Jelly encoder has already ended");
  }
  addNamespace(name, iri) {
    this.assertOpen();
    this.fit([iri], []);
    this.tables[0].set(iri, this.tables[0].get(iri) ?? this.tables[0].size + 1);
    this.namespaces.push([name, iri]);
  }
  addQuad(quad) {
    this.assertOpen();
    if (this.streamType === 1 && !this.inMessage) throw new JellyConformanceError("Use addMessage() or message counters with streamType MESSAGES");
    if (this.physicalType === 1 && quad.graph.termType !== "DefaultGraph") throw new JellyConformanceError("TRIPLES streams cannot contain named graph quads");
    if (!["NamedNode", "BlankNode", "Literal", "Quad"].includes(quad.object.termType)) throw new JellyConformanceError("Invalid RDF object");
    if (!["NamedNode", "BlankNode"].includes(quad.subject.termType) || quad.predicate.termType !== "NamedNode" || !["DefaultGraph", "NamedNode", "BlankNode"].includes(quad.graph.termType)) throw new JellyConformanceError("Invalid RDF statement");
    const names = [], datatypes = [];
    for (const term of [quad.subject, quad.predicate, quad.object, quad.graph]) this.keys(term, names, datatypes);
    if (this.quads.length >= this.size) this.flush();
    this.fit(names, datatypes);
    for (const [values, table] of [[names, this.tables[0]], [datatypes, this.tables[1]]]) for (const value of values) if (!table.has(value)) table.set(value, table.size + 1);
    this.quads.push(quad);
  }
  addMessage(quads, metadata) {
    this.assertOpen();
    if (this.streamType !== 1) throw new JellyConformanceError("Jelly 1.2 addMessage() requires streamType MESSAGES");
    this.inMessage = true;
    try {
      for (const quad of quads) this.addQuad(quad);
      this.flush(metadata, true);
    } finally {
      this.inMessage = false;
    }
  }
  addGraph(_graph, _quads, _metadata) {
    throw new JellyUnsupportedFeatureError("Jelly 1.2 has no GRAPHS layout; use QUADS and addMessage()");
  }
  finish() {
    this.assertOpen();
    if (this.first || this.quads.length || this.namespaces.length) this.flush();
    this.finished = true;
    return this.frames;
  }
  fit(names, datatypes) {
    const fits = () => [names, datatypes].every((values, i) => (/* @__PURE__ */ new Set([...this.tables[i].keys(), ...values])).size <= (i === 0 ? this.lookup.maxNames : this.lookup.maxDatatypes));
    if (!fits()) this.flush();
    if (!fits()) throw new JellyConformanceError("A single statement does not fit in the configured lookup tables");
  }
  flush(metadata, boundary = false) {
    const columns = {
      rowCount: this.quads.length,
      names: this.tables[0].size ? [{ id: 1, values: [...this.tables[0].keys()] }] : [],
      datatypes: this.tables[1].size ? [{ id: 1, values: [...this.tables[1].keys()] }] : [],
      namespaces: this.namespaces.map(([name, iri]) => ({ name, value: { nameId: this.tables[0].get(iri) } })),
      subjects: this.column(this.quads.map((q) => q.subject)),
      predicates: this.column(this.quads.map((q) => q.predicate)),
      objects: this.column(this.quads.map((q) => q.object)),
      ...this.physicalType === 2 ? { graphs: this.column(this.quads.map((q) => q.graph)) } : {},
      messageLengths: boundary ? [this.quads.length] : []
    };
    const frame = { rows: this.first ? [{ case: "options", value: {
      streamName: this.options.streamName ?? "",
      physicalType: this.physicalType,
      generalizedStatements: false,
      rdfStar: false,
      logicalType: 0,
      streamType: this.streamType,
      rdfVersion: this.rdfVersion,
      maxNameTableSize: this.lookup.maxNames,
      maxPrefixTableSize: this.lookup.maxPrefixes,
      maxDatatypeTableSize: this.lookup.maxDatatypes,
      version: 3
    } }] : [], columns, metadata: metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata ?? {})) };
    if (this.sink) this.sink(frame);
    else this.frames.push(frame);
    this.first = false;
    this.quads = [];
    this.namespaces = [];
    for (const table of this.tables) table.clear();
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
    const EncoderClass = options.version === 3 ? ColumnEncoder : Encoder;
    this.encoder = new EncoderClass(options, this.streaming ? (frame) => this.writeFrame(frame) : buffered ? (frame) => this.chunks.push(this.messageEncoder.encode(frame)) : void 0);
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

// src/sparql/SparqlDecoder.ts
function fail3(message) {
  throw new JellyConformanceError(message);
}
var SparqlDecoder = class extends ColumnTermDecoder {
  constructor(config = {}) {
    super(config);
    this.config = config;
    if (config.maxCellsPerBatch !== void 0 && (!Number.isInteger(config.maxCellsPerBatch) || config.maxCellsPerBatch < 0)) fail3("maxCellsPerBatch must be a nonnegative integer");
  }
  streamType;
  first = true;
  seenFrame = false;
  kind;
  header;
  trailer = false;
  resultIndex = 0;
  resultError;
  bnodes = /* @__PURE__ */ new Map();
  usedLabels = /* @__PURE__ */ new Set();
  ended = false;
  decode(frame) {
    if (this.ended) fail3("Jelly-SPARQL decoder has already ended");
    const events = [];
    const first = this.first;
    if (!first && this.kind === "ask") fail3("A frame follows an ASK result without starting a new result set");
    if (this.streamType === 0 && this.trailer && !frame.options) fail3("A frame without stream options follows a trailer");
    if (this.streamType === 1 && frame.options && !first) fail3("Stream options occur inside a punctuated result set");
    if (frame.options) {
      const o = frame.options;
      if (o.version !== 1) throw new JellyUnsupportedFeatureError(`Unsupported Jelly-SPARQL protocol version ${o.version}`);
      if (o.streamType !== 0 && o.streamType !== 1) fail3(`Unknown SPARQL stream type ${o.streamType}`);
      if (this.streamType !== void 0 && this.streamType !== Number(o.streamType)) fail3("SPARQL stream type cannot change");
      if (o.rdfVersion < 0 || o.rdfVersion > 3) fail3(`Unknown RDF version ${o.rdfVersion}`);
      this.resetLookups(o);
      this.streamType = Number(o.streamType);
      this.trailer = false;
    } else if (!this.seenFrame) fail3("The first Jelly-SPARQL frame must have stream options");
    this.seenFrame = true;
    this.first = false;
    this.checkRowCount(frame.rowCount);
    const entries = frame.names;
    this.applyLookups([[entries, this.names], [frame.prefixes, this.prefixes], [frame.datatypes, this.datatypes]]);
    if (frame.askResult) {
      if (!first) fail3("ASK result must be in the first frame of its result set");
      if (frame.variables.length || frame.columns.length || frame.rowCount) fail3("ASK frame cannot contain variables, columns, or rows");
      this.kind = "ask";
      events.push({ type: "boolean", resultIndex: this.resultIndex, value: frame.askResult.value ?? false });
    } else {
      if (first) this.kind = "select";
      if (first || frame.options) {
        if (frame.variables.some((v) => !v) || new Set(frame.variables).size !== frame.variables.length) fail3("Variable names must be nonempty and unique");
        if (this.header && (this.header.length !== frame.variables.length || this.header.some((v, i) => v !== frame.variables[i]))) fail3("Restated header must declare the same variables in the same order");
        this.header = [...frame.variables];
        if (first) events.push({ type: "header", resultIndex: this.resultIndex, variables: [...this.header] });
      } else if (frame.variables.length) fail3("Header is only allowed at the start or with stream options");
      const variables = this.header;
      const count = frame.rowCount;
      if (count * Math.max(1, variables.length) > (this.config.maxCellsPerBatch ?? 1048576)) fail3("Column cell count exceeds configured size limit");
      if (frame.columns.length && frame.columns.length !== variables.length) fail3("Column count differs from variable count");
      if (!frame.columns.length && variables.length && count) fail3("Rows with variables require columns");
      const columns = frame.columns.map((c) => this.column(c, count));
      for (let r = 0; r < count; r++) {
        const bindings = /* @__PURE__ */ new Map();
        for (let v = 0; v < variables.length; v++) {
          const term = columns[v][r];
          if (term) bindings.set(variables[v], this.scoped(term));
        }
        events.push({ type: "binding", resultIndex: this.resultIndex, bindings });
      }
    }
    const metadata = new Map(Object.entries(frame.metadata).map(([k, v]) => [k, new Uint8Array(v)]));
    if (metadata.size) {
      let links;
      if (metadata.has("link")) {
        try {
          const text = new TextDecoder("utf-8", { fatal: true }).decode(metadata.get("link"));
          links = text ? text.split("\n") : [];
        } catch {
          metadata.delete("link");
        }
      }
      events.push({ type: "metadata", resultIndex: this.resultIndex, metadata, ...links ? { links } : {} });
    }
    if (frame.trailer) {
      this.trailer = true;
      const error = frame.trailer.error ?? "";
      if (error) {
        this.resultError ??= error;
        const failure = new JellySparqlResultError(this.resultIndex, error);
        if (this.config.onResultError) this.config.onResultError(failure);
        else throw failure;
      }
      if (this.streamType === 1) {
        events.push(this.endEvent());
        this.resultIndex++;
        this.first = true;
        this.kind = void 0;
        this.header = void 0;
        this.resultError = void 0;
        this.trailer = false;
        this.bnodes.clear();
      }
    }
    return events;
  }
  finish() {
    if (this.ended) fail3("Jelly-SPARQL decoder has already ended");
    this.ended = true;
    if (!this.seenFrame) fail3("Jelly-SPARQL input contains no frames");
    return this.first ? [] : [this.endEvent()];
  }
  endEvent() {
    return { type: "end", resultIndex: this.resultIndex, complete: this.trailer && !this.resultError, ...this.resultError ? { error: this.resultError } : {} };
  }
  scoped(term) {
    if (this.streamType === 0) return term;
    if (term.termType === "Quad") return this.factory.quad(this.scoped(term.subject), term.predicate, this.scoped(term.object));
    if (term.termType !== "BlankNode") return term;
    let node = this.bnodes.get(term.value);
    if (!node) {
      let label = term.value;
      while (this.usedLabels.has(label)) label = `sparql${this.resultIndex}_${label}`;
      this.usedLabels.add(label);
      node = this.factory.blankNode(label);
      this.bnodes.set(term.value, node);
    }
    return node;
  }
};

// src/sparql/framing.ts
var sparqlProto = eu.ostrzyciel.jelly.core.proto.v1.sparql;
function decode(input, length) {
  try {
    return sparqlProto.SparqlResultsFrame.decode(input, length);
  } catch (cause) {
    throw new JellyConformanceError("Invalid Jelly-SPARQL protobuf frame", { cause });
  }
}
var SparqlFrameDecoder = class extends FramedMessageDecoder {
  constructor(options = {}) {
    super({ ...options, delimited: options.delimited ?? true }, (input) => decode(input), (reader, length) => decode(reader, length));
  }
};
function encodeSparqlFrame(frame, delimited = true) {
  return delimited ? sparqlProto.SparqlResultsFrame.encodeDelimited(frame).finish() : sparqlProto.SparqlResultsFrame.encode(frame).finish();
}

// src/sparql/SparqlParser.ts
var SparqlParser = class {
  constructor(options = {}) {
    this.options = options;
  }
  /** Returns result sets in stream order (one for a FLAT stream). */
  parse(input) {
    const decoder = new SparqlDecoder(this.options);
    const framing = new SparqlFrameDecoder(this.options);
    const results = [];
    const accept = (events) => {
      for (const event of events) {
        if (event.type === "header" || event.type === "boolean") {
          const info = { complete: false, links: [], metadata: /* @__PURE__ */ new Map() };
          results.push(event.type === "header" ? { ...info, type: "select", variables: event.variables, bindings: [] } : { ...info, type: "ask", boolean: event.value });
          continue;
        }
        const result = results[event.resultIndex];
        if (event.type === "binding" && result.type === "select") result.bindings.push(event.bindings);
        else if (event.type === "metadata") {
          for (const [key, value] of event.metadata) result.metadata.set(key, value);
          if (event.links) result.links = event.links;
        } else if (event.type === "end") {
          result.complete = event.complete;
          if (event.error) result.error = event.error;
        }
      }
    };
    framing.decodeEach(input, (frame) => accept(decoder.decode(frame)));
    accept(decoder.finish());
    return results;
  }
};

// src/sparql-types.ts
var SparqlStreamType = /* @__PURE__ */ ((SparqlStreamType2) => {
  SparqlStreamType2[SparqlStreamType2["FLAT"] = 0] = "FLAT";
  SparqlStreamType2[SparqlStreamType2["PUNCTUATED"] = 1] = "PUNCTUATED";
  return SparqlStreamType2;
})(SparqlStreamType || {});

// src/sparql/SparqlWriter.ts
function fail4(message) {
  throw new JellyConformanceError(message);
}
var SparqlWriter = class extends ColumnTermEncoder {
  constructor(config = {}, frameSink) {
    super(config.rdfVersion ?? 3 /* RDF_1_2 */);
    this.config = config;
    this.frameSink = frameSink;
    this.lookup = normalizeColumnLookupPreset(config.lookup);
    this.streamType = config.streamType ?? 0 /* FLAT */;
    if (![0, 1].includes(this.streamType)) fail4("Unknown SPARQL streamType");
    if (![0, 1, 2, 3].includes(this.rdfVersion)) fail4("Unknown RDF version");
    this.frameSize = config.frameSize ?? 250;
    if (!Number.isInteger(this.frameSize) || this.frameSize < 1 || this.frameSize > 134217727) fail4("frameSize must be between 1 and 2^27 - 1");
  }
  lookup;
  frameSize;
  streamType;
  chunks = [];
  rows = [];
  metadata = /* @__PURE__ */ new Map();
  variables = [];
  active;
  askValue = false;
  firstFrame = true;
  firstResultFrame = true;
  resultCount = 0;
  frameCount = 0;
  ended = false;
  startSelect(variables, info = {}) {
    if (variables.some((v) => !v || v.startsWith("?") || v.startsWith("$")) || new Set(variables).size !== variables.length) fail4("Variables must be unique, nonempty names without ? or $");
    this.start("select");
    this.variables = [...variables];
    this.addMetadata(info);
  }
  startAsk(value, info = {}) {
    if (typeof value !== "boolean") fail4("ASK result must be a boolean");
    this.start("ask");
    this.askValue = value;
    this.addMetadata(info);
  }
  addBinding(binding) {
    this.assertOpen();
    if (this.active !== "select") fail4("Start a SELECT result before adding bindings");
    const row = new Map(Symbol.iterator in binding ? binding : Object.entries(binding));
    const names = [], datatypes = [];
    for (const [name, term] of row) {
      if (!this.variables.includes(name)) fail4(`Undeclared variable ${name}`);
      if (term === void 0) {
        row.delete(name);
        continue;
      }
      if (!["NamedNode", "BlankNode", "Literal", "Quad"].includes(term.termType)) fail4(`Invalid SPARQL binding term ${term.termType}`);
      this.keys(term, names, datatypes);
    }
    const fits = () => [names, datatypes].every((values, i) => (/* @__PURE__ */ new Set([...this.tables[i].keys(), ...values])).size <= (i === 0 ? this.lookup.maxNames : this.lookup.maxDatatypes));
    if (this.rows.length >= this.frameSize || !fits()) this.flush();
    if (!fits()) fail4("A single solution does not fit in the configured lookup tables");
    for (const [values, table] of [[names, this.tables[0]], [datatypes, this.tables[1]]]) for (const value of values) if (!table.has(value)) table.set(value, table.size + 1);
    this.rows.push(row);
  }
  addMetadata(info) {
    this.assertOpen();
    if (!this.active) fail4("Start a result before adding metadata");
    const entries = info.metadata instanceof Map ? info.metadata : Object.entries(info.metadata ?? {});
    for (const [key, value] of entries) {
      if (key === "link") {
        try {
          new TextDecoder("utf-8", { fatal: true }).decode(value);
        } catch {
          fail4("The link metadata must be valid UTF-8");
        }
      }
      this.metadata.set(key, new Uint8Array(value));
    }
    if (info.links) {
      if (info.links.some((link) => typeof link !== "string" || link.includes("\n"))) fail4("Links must be strings without LF characters");
      this.metadata.set("link", new TextEncoder().encode(info.links.join("\n")));
    }
  }
  endResult(error = "") {
    this.assertOpen();
    if (!this.active) fail4("No SPARQL result set is open");
    this.flush(error);
    this.active = void 0;
    this.resultCount++;
  }
  addAsk(value, info = {}) {
    this.startAsk(value, info);
    this.endResult();
  }
  addResult(result) {
    if (result.type === "ask") this.startAsk(result.boolean, result);
    else {
      this.startSelect(result.variables, result);
      for (const binding of result.bindings) this.addBinding(binding);
    }
    this.endResult(result.error || (result.complete === false ? "Result set incomplete" : ""));
  }
  /** Accepts the events emitted by SparqlStreamParser. */
  write(event) {
    if (event.type === "header") this.startSelect(event.variables);
    else if (event.type === "boolean") this.startAsk(event.value);
    else if (event.type === "binding") this.addBinding(event.bindings);
    else if (event.type === "metadata") this.addMetadata(event);
    else this.endResult(event.error || (event.complete ? "" : "Result set incomplete"));
  }
  /** Finalizes the open result (if any) and returns bytes, or empty bytes with a frame sink. */
  end() {
    this.assertOpen();
    if (this.active) this.endResult();
    if (!this.resultCount) {
      this.startSelect([]);
      this.endResult();
    }
    this.ended = true;
    const bytes = concatBytes(this.chunks);
    this.chunks.length = 0;
    return bytes;
  }
  start(kind) {
    this.assertOpen();
    if (this.active) fail4("End the current result set before starting another");
    if (this.streamType === 0 && this.resultCount) fail4("Use PUNCTUATED to write more than one result set");
    this.active = kind;
    this.firstResultFrame = true;
    this.variables = [];
  }
  assertOpen() {
    if (this.ended) fail4("Jelly-SPARQL writer has already ended");
  }
  flush(error) {
    if (this.active === "ask" && error === void 0) fail4("An ASK result must fit in one frame with its trailer");
    if (this.config.delimited === false && this.frameCount) fail4("Non-delimited Jelly-SPARQL output must contain exactly one frame");
    const frame = {
      ...this.firstFrame ? { options: {
        streamName: this.config.streamName ?? "",
        streamType: Number(this.streamType),
        rdfVersion: Number(this.rdfVersion),
        maxNameTableSize: this.lookup.maxNames,
        maxPrefixTableSize: this.lookup.maxPrefixes,
        maxDatatypeTableSize: this.lookup.maxDatatypes,
        version: 1
      } } : {},
      ...this.active === "ask" ? { askResult: { value: this.askValue } } : {
        variables: this.firstResultFrame ? this.variables : [],
        rowCount: this.rows.length,
        names: this.tables[0].size ? [{ id: 1, values: [...this.tables[0].keys()] }] : [],
        datatypes: this.tables[1].size ? [{ id: 1, values: [...this.tables[1].keys()] }] : [],
        columns: this.rows.length ? this.variables.map((v) => this.column(this.rows.map((row) => row.get(v) ?? UNBOUND))) : []
      },
      metadata: Object.fromEntries(this.metadata),
      ...error !== void 0 ? { trailer: { error } } : {}
    };
    const bytes = encodeSparqlFrame(frame, this.config.delimited ?? true);
    if (this.frameSink) this.frameSink(bytes);
    else this.chunks.push(bytes);
    this.frameCount++;
    this.firstFrame = false;
    this.firstResultFrame = false;
    this.rows = [];
    this.metadata = /* @__PURE__ */ new Map();
    for (const table of this.tables) table.clear();
  }
};
var UNBOUND = { termType: "DefaultGraph", value: "", equals: (other) => other?.termType === "DefaultGraph" };

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
        for (const item of message) this.enqueue(item);
        this.drainPending();
        return true;
      });
      for (const message of this.decoder.finishMessages()) this.enqueue(message);
      this.drainPending();
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
  accept(messages) {
    for (const message of messages) this.enqueue(message);
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

// src/sparql/nodeStreams.ts
import { Transform as Transform3 } from "stream";
var SparqlStreamParser = class extends Transform3 {
  reader;
  decoder;
  pending = [];
  index = 0;
  busy = false;
  constructor(options = {}) {
    super({ ...options, readableObjectMode: true, writableObjectMode: false });
    this.reader = new SparqlFrameDecoder(options);
    this.decoder = new SparqlDecoder(options);
  }
  import(stream) {
    stream.on("error", (error) => this.destroy(error));
    stream.pipe(this);
    return this;
  }
  _transform(chunk, _encoding, callback) {
    this.busy = true;
    try {
      if (this.drain() && this.reader.paused) this.reader.resumeEach((frame) => this.accept(frame));
      this.reader.writeEach(chunk, (frame) => this.accept(frame));
      this.busy = false;
      callback();
    } catch (error) {
      this.busy = false;
      callback(error);
    }
  }
  _read(size) {
    if (this.busy) return;
    this.busy = true;
    try {
      if (this.drain() && this.reader.paused) this.reader.resumeEach((frame) => this.accept(frame));
    } catch (error) {
      this.busy = false;
      this.destroy(error);
      return;
    }
    this.busy = false;
    if (!this.reader.paused && this.index >= this.pending.length) super._read(size);
  }
  _flush(callback) {
    this.busy = true;
    try {
      this.drain(true);
      this.reader.endEach((frame) => {
        this.pending = this.decoder.decode(frame);
        this.index = 0;
        this.drain(true);
      });
      this.pending = this.decoder.finish();
      this.index = 0;
      this.drain(true);
      this.busy = false;
      callback();
    } catch (error) {
      this.busy = false;
      callback(error);
    }
  }
  accept(frame) {
    this.pending = this.decoder.decode(frame);
    this.index = 0;
    return this.drain();
  }
  drain(force = false) {
    while (this.index < this.pending.length) {
      const accepted = this.push(this.pending[this.index++]);
      if (!accepted && !force) return false;
    }
    this.pending = [];
    this.index = 0;
    return true;
  }
};
var SparqlStreamWriter = class extends Transform3 {
  writer;
  constructor(options = {}) {
    super({ writableObjectMode: true, readableObjectMode: false });
    this.writer = new SparqlWriter(options, (bytes) => {
      this.push(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength));
    });
  }
  import(stream) {
    stream.on("error", (error) => this.destroy(error));
    stream.pipe(this);
    return this;
  }
  _transform(event, _encoding, callback) {
    try {
      this.writer.write(event);
      callback();
    } catch (error) {
      callback(error);
    }
  }
  _flush(callback) {
    try {
      this.writer.end();
      callback();
    } catch (error) {
      callback(error);
    }
  }
};
export {
  BlankNode,
  ColumnEncoder,
  DEFAULT_LOOKUP_PRESET,
  DataFactory,
  Decoder,
  DefaultGraph,
  Encoder,
  JellyConformanceError,
  JellyError,
  JellySparqlResultError,
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
  RDF_DIR_LANG_STRING,
  RDF_LANG_STRING,
  RdfStreamType,
  RdfVersion,
  SMALL_LOOKUP_PRESET,
  SparqlParser,
  SparqlStreamParser,
  SparqlStreamType,
  SparqlStreamWriter,
  SparqlWriter,
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
