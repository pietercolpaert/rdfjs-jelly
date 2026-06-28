# rdfjs-jelly implementation plan

## 1. Goal

Build a TypeScript implementation of the Jelly RDF binary format and streaming protocol, using RDF/JS quads as its public data model. The package should follow the adjacent `rdf-parser.ts` project's developer experience:

- `Parser` and `Writer` APIs for in-memory conversion;
- Node.js `StreamParser` and `StreamWriter` transforms;
- browser entry points using Web Streams;
- CommonJS, ESM, type declarations, and minified browser bundles;
- strict TypeScript, Vitest, CI, conformance tests, and performance checks.

The first release targets Jelly-RDF 1.0/1.1 wire compatibility for standard RDF 1.1 triples and quads. It must not support RDF-star.

## 2. Scope decisions

### Included

- Jelly protocol versions 1 and 2 as defined by the current `rdf.proto` schema (Jelly-RDF 1.0.x and 1.1.x).
- Delimited streams (varint-length-prefixed `RdfStreamFrame` wire values) and single-message, non-delimited payloads. Each protobuf frame is exposed as one public `Message`.
- Physical stream types `TRIPLES`, `QUADS`, and `GRAPHS`.
- Logical stream types `FLAT_TRIPLES`, `FLAT_QUADS`, `GRAPHS`, `DATASETS`, and the currently defined graph/dataset subtypes.
- RDF/JS `NamedNode`, `BlankNode`, `Literal`, `DefaultGraph`, and `Quad` values supplied by an injectable `DataFactory`.
- Repeated-term compression, prefix/name/datatype lookup tables, LRU replacement, namespace declarations, message metadata, and graph boundaries.
- Protocol validation with actionable errors for malformed or unsupported streams.
- Node.js and browser streaming.

### Explicitly excluded

- RDF-star encoding and decoding. A writer must reject any RDF/JS term with `termType === 'Quad'`. A parser must reject a stream whose options set `rdf_star = true` or whose rows contain a nested triple term, before emitting that unsupported value.
- Jelly-Patch (`patch.proto`), gRPC (`grpc.proto`), Kafka, and RDF library integrations other than RDF/JS.
- Transparent gzip handling in the core codec. Compression composes with `node:zlib`, `CompressionStream`, or `DecompressionStream`; examples will show this. This keeps Jelly framing independent of transport compression.
- A bundled RDF text parser. CLI text conversion, if added later, should use a separate RDF/JS parser dependency.

### Standard RDF versus generalized RDF

The initial RDF/JS API will emit `generalized_statements = false` and reject streams that enable generalized statements. Generalized RDF allows terms in positions that the RDF/JS TypeScript model intentionally does not permit. This is separate from RDF-star and can be added later through an explicit generalized-data adapter without weakening the default RDF/JS types.

## 3. Public API

Keep the high-level names and callback/stream shape familiar to users of `rdf-parser-ts`, but use binary inputs and outputs.

```ts
type BinaryInput = Uint8Array | ArrayBuffer;
type MessageMetadata = ReadonlyMap<string, Uint8Array>;

interface MessageQuad {
  quad: RDF.Quad;
  messageCounter: number;
}

interface MessageQuadArray extends Array<MessageQuad> {
  messageCount: number;
}

class Message extends Array<RDF.Quad> {
  constructor(
    public readonly messageCounter: number,
    quads?: Iterable<RDF.Quad>,
    public readonly metadata?: ReadonlyMap<string, Uint8Array>,
  );
}

type ParserOutput = RDF.Quad[] | MessageQuadArray;
type ParserOutputItem = RDF.Quad | MessageQuad;
type ParseCallback = (
  error: Error | null,
  quad?: RDF.Quad | null,
  namespaces?: Record<string, RDF.NamedNode>,
  messageCounter?: number,
) => void;

interface ParserOptions {
  factory?: RDF.DataFactory;
  delimited?: boolean | 'auto';
  strict?: boolean;
  maxSupportedVersion?: 1 | 2;
}

class Parser {
  constructor(options?: ParserOptions);
  parse(input: BinaryInput): ParserOutput;
  parse(input: BinaryInput, callback: ParseCallback): void;
  parseMessages(input: BinaryInput): Message[];
}

interface WriterOptions {
  physicalType?: PhysicalStreamType; // default: QUADS
  logicalType?: LogicalStreamType;   // inferred when omitted
  delimited?: boolean;               // default: true
  messageSize?: number;              // default: 250 rows
  streamName?: string;
  namespaces?: Record<string, string | RDF.NamedNode>;
  lookup?: Partial<LookupPreset>;
  version?: 2;                       // writers emit version 2 only
}

class Writer {
  constructor(options?: WriterOptions);
  constructor(output: BinaryOutput, options?: WriterOptions);
  addQuad(quad: RDF.Quad | MessageQuad, done?: ErrorCallback): void;
  addQuads(quads: Iterable<RDF.Quad | MessageQuad>): void;
  addNamespace(prefix: string, iri: string | RDF.NamedNode): void;
  addMessage(message: Iterable<RDF.Quad> | Message, metadata?: MessageMetadata): void;
  addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void;
  end(done?: (error: Error | null, output?: Uint8Array) => void): void;
}
```

API behavior:

- `Parser.parse()` flattens all valid physical stream types into ordered RDF/JS quads by default. Triple streams use the default graph; graph streams use the active graph from graph boundary rows.
- With `messages: true`, `Parser.parse()` follows `rdf-parser.ts`: it returns `MessageQuadArray`, each item contains `{ quad, messageCounter }`, the array has `messageCount`, and the callback overload receives `messageCounter` as its fourth argument.
- `Parser.parseMessages()` always returns `Message[]`. Each protobuf `RdfStreamFrame` becomes one `Message`, including a message containing no quads, and its zero-based position becomes `messageCounter`. The `Message` carries the wire value's metadata in addition to behaving as an array of quads.
- Export `isMessageQuad()` and `toMessages()` with the same semantics as `rdf-parser.ts`, including preservation of empty messages using `MessageQuadArray.messageCount`.
- Namespace declarations are exposed through a `namespace` event/callback because they are not part of the RDF/JS dataset model.
- `Writer` defaults to a flat physical `QUADS` stream. `TRIPLES` rejects non-default graph terms. `GRAPHS` is written through `addGraph()` so boundaries are explicit rather than inferred from quad ordering.
- `addMessage()` makes dataset/flat-stream message boundaries and per-message metadata explicit and preserves empty messages. Ordinary `addQuad()` calls are automatically split into messages according to `messageSize`.
- As in `rdf-parser.ts`, `Writer.addQuad()` also accepts `MessageQuad`; changes and gaps in `messageCounter` create message boundaries and preserve empty messages.
- `Writer.addQuads()` honors `MessageQuadArray.messageCount`, so trailing empty messages are preserved as well as leading and intermediate ones.
- Errors use exported `JellyError`, `JellyConformanceError`, and `JellyUnsupportedFeatureError` classes.

Node.js streaming:

- `StreamParser extends Transform`: accepts `Buffer`/`Uint8Array` chunks and emits RDF/JS quads in object mode, or `MessageQuad` values when `messages: true`. It incrementally handles delimited protobuf messages split across arbitrary chunk boundaries. It emits `options`, `namespace`, `message`, and `messageCounter` events; the `message` event receives the completed `Message` instance.
- `StreamWriter extends Transform`: accepts RDF/JS quads or `MessageQuad` values in object mode and emits binary Jelly chunks. It honors backpressure and flushes the final partial message in `_flush`.
- Both expose `import(readable)` like the sibling package.

Browser streaming:

- `rdfjs-jelly/browser` exports the same `Parser` and `Writer` plus Web Streams versions of `StreamParser` and `StreamWriter`.
- Browser stream chunks are `Uint8Array` or `ArrayBuffer`; output chunks are `Uint8Array`.
- Browser code must not import `node:stream`, `Buffer`, or `node:zlib`.

Also export the protocol enums, option/result types, `LookupPreset`, and lower-level `MessageDecoder`/`MessageEncoder` APIs. `RdfStreamFrame` remains the name only at the protobuf wire boundary; package-facing APIs call this unit a message. Do not expose generated protobuf implementation details as the primary API.

## 4. Proposed repository layout

```text
.
├── .github/workflows/ci.yml
├── proto/rdf.proto
├── scripts/
│   ├── build-browser.cjs
│   ├── generate-proto.mjs
│   └── sync-conformance-fixtures.mjs
├── src/
│   ├── browser.ts
│   ├── index.ts
│   ├── api/
│   │   ├── Parser.ts
│   │   ├── Writer.ts
│   │   ├── StreamParser.ts
│   │   └── StreamWriter.ts
│   ├── codec/
│   │   ├── Decoder.ts
│   │   ├── Encoder.ts
│   │   ├── MessageDecoder.ts
│   │   ├── MessageEncoder.ts
│   │   ├── LookupDecoder.ts
│   │   ├── LookupEncoder.ts
│   │   └── varint.ts
│   ├── generated/rdf_pb.ts
│   ├── rdfjs/adapter.ts
│   ├── errors.ts
│   ├── options.ts
│   └── types.ts
├── test/
│   ├── conformance/
│   ├── fixtures/
│   ├── parser.test.ts
│   ├── writer.test.ts
│   ├── streams.test.ts
│   ├── browser.test.ts
│   ├── lookup.test.ts
│   └── messages.test.ts
├── perf/bench.mjs
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

The authoritative `rdf.proto` file should be copied at a pinned Jelly protocol release and carry its upstream license/header. Generated TypeScript is committed so package consumers and normal builds do not need `protoc` or network access. Add a script that regenerates it reproducibly with a pinned Protobuf-ES generator.

## 5. Core implementation

### 5.1 Project scaffold

1. Initialize package metadata as `rdfjs-jelly`, with Apache-2.0 licensing to remain compatible with the upstream schema and pyjelly port.
2. Copy the sibling project's strict TypeScript, Vitest, tsup/esbuild, export-map, browser-bundle, formatting, and CI conventions where they apply.
3. Build CJS, ESM, declarations, and browser ESM/global bundles. Mark the package side-effect-free.
4. Depend on `@rdfjs/types` and a browser-compatible protobuf runtime. Use Protobuf-ES generated types/codecs rather than maintaining a handwritten protobuf implementation.
5. Keep generated protobuf code isolated under `src/generated` and verify regeneration is clean in CI.

### 5.2 Message boundaries and protobuf layer

1. Generate only `rdf.proto`; do not generate Patch or gRPC code.
2. Implement unsigned protobuf varint encode/decode with incremental state, overflow/truncation checks, and limits on message size.
3. Implement delimited messages on the wire as `varint byte length + serialized RdfStreamFrame`.
4. Implement non-delimited parsing as one message containing one `RdfStreamFrame`, buffered until end-of-input.
5. Match pyjelly's auto-detection behavior for the initial bytes, while allowing callers to force `delimited` to resolve ambiguous payloads.
6. Preserve `Map<string, Uint8Array>` message metadata exactly.

### 5.3 Lookup tables and compression

Port pyjelly's behavior rather than redesigning it:

- 1-based lookup indices with zero reserved for delta/repetition encoding;
- minimum name table size of 8, maximum supported table size of 4096;
- defaults of 4000 names, 150 prefixes, and 32 datatypes;
- LRU eviction with index reuse after a table fills;
- prefix/name IRI splitting at the final `#` or `/`;
- the protocol's implicit previous prefix and next name rules;
- datatype lookup handling and `xsd:string` omission;
- statement-position repeated terms across rows.

Unit-test every zero-index and eviction transition independently. These state machines are the highest-risk interoperability code.

### 5.4 Decoder

1. Locate and validate the first options row, including compatible physical/logical types, version, lookup limits, and placement.
2. Reject `rdf_star`, generalized RDF, custom protocol versions, unsupported row types, illegal term positions, missing first terms, invalid lookup references, and graph-boundary errors.
3. Decode lookup-entry rows before consuming dependent terms.
4. Reconstruct RDF/JS terms through the configured data factory; do not instantiate a private competing data model.
5. Decode triples as default-graph quads, quads directly, and graph-stream triples using the active graph.
6. Preserve input order and namespace declarations. Reset only state that the Jelly specification says is scoped to a stream, not at message boundaries.
7. Use defensive limits for message bytes, rows per message, lookup sizes, and nesting. Nesting remains disallowed because RDF-star is excluded.

### 5.5 Encoder

1. Validate RDF/JS term kinds and statement positions before mutating lookup/repetition state.
2. Emit the stream-options row exactly once, before all other non-empty rows. Emit `rdf_star = false` and `generalized_statements = false` unconditionally.
3. Encode IRIs, blank nodes, simple/language/datatype literals, and default graphs.
4. Emit lookup entries before the rows that reference them and apply repeated-term compression per slot.
5. Write protocol version 2 unconditionally and reject any explicitly requested writer version other than 2; version 2 includes namespace declarations.
6. Split flat streams into messages by row count, not quad count, because lookup rows consume message capacity.
7. Support explicit graph start/end rows and dataset/graph message boundaries.
8. Serialize deterministically for fixed input and options so byte-level golden tests are useful.

## 6. RDF-star exclusion tests

Treat the exclusion as a tested contract rather than a documentation note:

- Type-level APIs accept RDF/JS RDF 1.1 positional types.
- `Writer.addQuad()` rejects a quoted triple in subject, predicate, or object at runtime, including values cast around TypeScript checks.
- Parser rejects `rdf_star = true` even if no quoted triple later occurs.
- Parser rejects nested triple fields even if stream options falsely claim `rdf_star = false`.
- The RDF-star positive conformance groups are excluded with an explicit reason.
- Applicable negative conformance cases for illegal RDF-star flags/terms remain enabled.
- README and package keywords do not claim RDF 1.2 or RDF-star support.

## 7. Testing and interoperability

### Unit and integration tests

- Binary input variants: `Uint8Array`, sliced buffers with non-zero offsets, and `ArrayBuffer`.
- Every RDF term kind, Unicode strings, empty strings, language tags, and datatype literals.
- All lookup sizes/presets, disabled optional tables, eviction, and implicit indices.
- Repeated terms in each statement slot and across message boundaries.
- Delimited/non-delimited input, empty messages, truncated varints, truncated messages, oversized messages, and arbitrary stream chunk splits.
- All supported physical/logical stream combinations and rejected incompatible combinations.
- Namespace declarations, stream names, and message metadata.
- Custom RDF/JS data factories.
- Node Transform backpressure/error propagation and browser Web Stream behavior.
- Writer-to-parser round trips across message sizes 1, 4, 250, and 10,000.
- `parseMessages()`, `Message`, `MessageQuad`, `MessageQuadArray.messageCount`, `isMessageQuad()`, and `toMessages()` behavior aligned with `rdf-parser.ts`, including leading, intermediate, and trailing empty messages.

### Official Jelly conformance suite

Pin the `Jelly-RDF/jelly-protobuf` RDF conformance fixtures to the same protocol release as `proto/rdf.proto`. Run:

- `from_jelly/{triples,quads,graphs}_rdf_1_1` positive and negative cases against the parser;
- `to_jelly/{triples,quads,graphs}_rdf_1_1` cases against the writer, comparing decoded semantics and required stream options rather than assuming only one valid compressed byte sequence;
- no generalized or RDF-star positive groups in this release;
- relevant negative cases from excluded feature groups where they assert rejection behavior.

The fixture sync script records the upstream tag/commit and checksum. CI uses committed fixtures and never fetches mutable network content.

### Cross-implementation tests

- Decode representative `.jelly` and `.jelly.gz` fixtures produced by pyjelly and jelly-jvm (decompress gzip before parsing).
- Encode with TypeScript and decode with pyjelly in CI or a separately invokable interoperability job.
- Encode with pyjelly and decode with TypeScript.
- Compare datasets using RDF term equality while preserving stream/message ordering where the logical type requires it.

### Performance

Add a benchmark patterned after `rdf-parser.ts/perf` for 10^4, 10^5, and 10^6 triples/quads. Measure encode/decode statements per second, bytes per statement, peak memory, streaming first-output latency, and browser bundle size. CI should initially report results; introduce a regression threshold only after a stable baseline exists.

## 8. Documentation and examples

Replace the empty README with:

- support matrix and explicit RDF-star/generalized-RDF exclusions;
- installation and Node/browser requirements;
- in-memory `Parser`/`Writer` examples;
- Node pipeline and browser Web Streams examples;
- custom RDF/JS data factory example;
- message metadata and namespace event examples;
- delimited versus non-delimited explanation;
- gzip composition examples;
- protocol/schema version and conformance status.

Provide small runnable examples instead of porting pyjelly's RDFLib/NetworkX-specific examples.

## 9. Delivery phases and acceptance gates

### Phase 1: package and protobuf foundation

- Scaffold builds, exports, linting, tests, and CI.
- Pin `rdf.proto`, generate TypeScript codecs, and implement binary/framing utilities.
- Gate: CJS/ESM/browser imports work and protobuf `RdfStreamFrame` wire values round-trip byte-for-byte.

### Phase 2: flat triples and quads

- Implement options, lookup tables, RDF/JS adapter, encoder, decoder, `Parser`, and `Writer`.
- Gate: official RDF 1.1 triples/quads conformance groups pass, all RDF-star rejection tests pass, and pyjelly cross-round-trips work.

### Phase 3: streaming

- Implement incremental message decoding, Node transforms, Web Streams, events, and backpressure.
- Gate: every possible chunk boundary in representative fixtures produces the same output as in-memory parsing; browser bundle has no Node built-ins.

### Phase 4: graph/dataset streams and metadata

- Implement `GRAPHS`, graph boundaries, grouped APIs, logical types, namespace declarations, and metadata.
- Gate: official graph conformance cases and grouped pyjelly interoperability tests pass.

### Phase 5: release hardening

- Complete README/examples, API docs, security limits, fuzz/property tests, benchmarks, package-content checks, and provenance/license notices.
- Gate: `npm run check`, conformance, interoperability, browser smoke tests, and package tarball smoke tests all pass from a clean checkout.

## 10. Definition of done for the first release

The first release is complete when it can read and write standards-compliant, non-generalized RDF 1.1 Jelly streams for all three physical stream types in Node.js and browsers; uses RDF/JS terms and custom factories; passes the selected official conformance suite and pyjelly interoperability tests; rejects RDF-star deterministically; ships CJS/ESM/types/browser artifacts; and documents all deliberate exclusions.
