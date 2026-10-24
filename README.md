# rdfjs-jelly

[![npm](https://img.shields.io/npm/v/rdfjs-jelly.svg)](https://www.npmjs.com/package/rdfjs-jelly)

Jelly-RDF and Jelly-SPARQL binary parsers and writers using RDF/JS terms, for Node.js and browsers.

## Support

- Reads Jelly-RDF 1.0, 1.1, and 1.2 (protocol tags 1, 2, and 3).
- Writes Jelly-RDF 1.1 by default; opt into 1.2 with `version: 3`.
- Supports physical triple, quad, and graph streams; delimited and non-delimited encoding; lookup/repeated-term compression; namespaces; and message metadata.
- Reads and writes Jelly-SPARQL 1.0 SELECT and ASK result sets, including punctuated streams.
- Uses RDF/JS terms and accepts a custom RDF/JS data factory.
- Supports RDF 1.2 directional language literals and object triple terms in 1.2 streams. Legacy RDF-star, generalized RDF, Jelly-Patch, and gRPC are unsupported.

Node.js 24 or newer is required by the Node build. The browser bundle targets ES2020.

## Install

```sh
npm install rdfjs-jelly
```

## Command line

Use the package without installing it to inspect a Jelly stream or convert an
RDF 1.2 Message Stream Log:

```sh
npx rdfjs-jelly inspect 'https://example.org/data.jelly.zst'
npx rdfjs-jelly convert messages.log --output messages.jelly.zst
```

Both commands accept a URL, local file path, or `-` for stdin. Plain, gzip, and
zstd-compressed input is detected from its bytes. `read` is an alias for
`inspect`; run `npx rdfjs-jelly --help` for the complete usage. Conversion is a
bounded-memory pipeline: the input, RDF Message parser, Jelly writer, native
zstd compressor, and output file are all streamed.

## Parse and write

```ts
import { DataFactory, Parser, Writer } from 'rdfjs-jelly';

const { literal, namedNode, quad } = DataFactory;
const writer = new Writer({ namespaces: { ex: 'https://example.org/' } });

writer.addQuad(quad(
  namedNode('https://example.org/s'),
  namedNode('https://example.org/p'),
  literal('hello', 'en'),
));

writer.end((error, bytes) => {
  if (error) throw error;
  const quads = new Parser().parse(bytes!);
  console.log(quads);
});
```

`Writer` emits a delimited version-2 stream by default. Set `delimited: false` for a single-message protobuf payload. A non-delimited output cannot contain multiple messages.

## Jelly-RDF 1.2

[Jelly-RDF 1.2.0](https://w3id.org/jelly/1.2.0/specification/serialization/)
introduces a column layout (protocol tag **3**), packed lookup entries, repeat
runs, RDF 1.2 terms, explicit RDF Message boundaries, and concatenable streams.
The parser selects the layout from the stream options. Existing 1.0/1.1 streams
remain readable, and the default writer stays on 1.1 for older consumers.

```ts
import { Writer, RdfStreamType, RdfVersion } from 'rdfjs-jelly';

const flatWriter = new Writer({ version: 3 });
const messageWriter = new Writer({
  version: 3,
  streamType: RdfStreamType.MESSAGES,
  rdfVersion: RdfVersion.RDF_1_2,
});
messageWriter.addMessage([quad1, quad2]);
messageWriter.addMessage([]);
```

For version 3, `messageSize` limits statements per batch; a message may span
batches. Lookup capacity can also end a batch early. The writer uses packed
full-IRI name entries and repeat runs; prefix compression and lookup reuse
between batches are future optimizations. A statement that cannot fit an empty
batch raises an error. The name table must hold at least 128 entries.

The 1.2 layout supports `TRIPLES` and `QUADS`. Use `QUADS` for named graphs;
`GRAPHS`, `addGraph()`, and `logicalType` belong to the older layout. Use
`streamType` (`FLAT` or `MESSAGES`) instead. `rdfVersion` defaults to RDF 1.2;
writers reject terms that the declared version cannot represent. Custom factories
must preserve direction and `rdf:dirLangString` for directional literals.

Parsers support `maxSupportedVersion: 2` to require an older stream and
`maxRowsPerBatch` (default 1,048,576) to limit expanded column batches. Existing
lookup and frame-size limits still apply. Empty files and empty frames are valid.
For transport protocols that provide their own framing, `delimited: false` reads
or writes a single bare frame; `.jelly` files should use the default delimited mode.

## Messages

For Jelly 1.0/1.1 and flat 1.2 streams, the API exposes each data frame as a `Message` container.
`Message` extends `Array<RDF.Quad>` and carries `messageCounter` and binary
`metadata`. This API mapping does not make every frame an independent RDF Message.

A Jelly frame is a serialization boundary. Frames in a flat stream can share
blank-node scope. An RDF Message is a semantic boundary: blank-node identifiers
are local to that message. Equal labels in different RDF Messages do not identify
the same blank node. See the [Jelly blank-node rules](https://jelly-rdf.github.io/1.1.x/specification/serialization/#blank-nodes)
and [RDF Messages specification](https://w3c-cg.github.io/rsp/spec/messages).

For Jelly 1.0/1.1, `parseMessages()` and `messages: true` expose frame boundaries
and preserve blank-node labels; consumers must retain the appropriate scope.
For 1.2 streams with `streamType: MESSAGES`, these APIs expose the explicit
logical messages, including empty messages. Messages may span frames or share a
frame. Blank nodes are assigned distinct identities across messages; their scoped
labels are opaque and may be renamed. A final
unfinished message with statements is emitted at end of input. Restated options
reset lookup tables and close an unfinished message, while preserving namespaces.
Frame metadata is attached to messages that end in that frame; a message closed
only at end of input has no metadata. Metadata has no effect on RDF semantics.

When representing independent RDF Messages, supply their actual boundaries to
`addMessage()`. Do not divide a connected blank-node structure into independent
messages merely to meet a batch size: that can change the RDF's meaning.
Automatic framing of a flat stream can split such a structure because its
blank-node scope continues across frames.

```ts
const writer = new Writer();
writer.addMessage([quad1], { source: new TextEncoder().encode('sensor-a') });
writer.addMessage([]); // Empty messages are preserved.
writer.addMessage([quad2]);

writer.end((error, bytes) => {
  if (error) throw error;
  const messages = new Parser().parseMessages(bytes!);
  console.log(messages.map(message => message.messageCounter));
});
```

For compatibility with `rdf-parser-ts`, use `new Parser({ messages: true })` to receive `{ quad, messageCounter }` entries. The returned array has a `messageCount` property. `isMessageQuad()` and `toMessages()` convert between flat and grouped forms while preserving empty messages.

## SPARQL result sets

[Jelly-SPARQL 1.0.0](https://jelly-rdf.github.io/1.2.x/specification/sparql/)
is a separate format from Jelly-RDF, using its own protocol tag **1**, media type
`application/x-jelly-sparql`, and `.jellys` extension. Use `SparqlParser` and
`SparqlWriter` for result sets. The command-line tools currently handle Jelly-RDF.

```ts
import { DataFactory, SparqlParser, SparqlWriter } from 'rdfjs-jelly';

const writer = new SparqlWriter();
writer.startSelect(['item', 'label'], { links: ['https://example.org/query'] });
writer.addBinding({
  item: DataFactory.namedNode('https://example.org/item/1'),
  label: DataFactory.literal('hello', 'en'),
});
writer.addBinding({ item: DataFactory.namedNode('https://example.org/item/2') });
// Missing keys are unbound. Map<string, SparqlTerm> inputs are accepted too.
const bytes = writer.end(); // Synchronous; finalizes the result with a trailer.
const [result] = new SparqlParser().parse(bytes);
if (result.type === 'select') {
  console.log(result.variables, result.bindings[0].get('item'), result.complete);
}
```

`parse()` returns result sets in stream order. SELECT results have `variables`
in projection order and `bindings` as `Map<string, SparqlTerm>[]`, preserving row
order and duplicates. ASK results have `type: 'ask'` and `boolean`. Both carry
`complete`, `links`, and merged binary `metadata`. RDF 1.2 directional literals
and nested object triple terms use the same RDF/JS terms as Jelly-RDF 1.2.

For ASK, use `writer.addAsk(false)`. To write several independent SELECT/ASK
results, create a writer with `streamType: SparqlStreamType.PUNCTUATED`, then call
`startSelect()` / `addBinding()` / `endResult()` or `addAsk()` for each result.
`addResult()` accepts a complete result object, including those returned by the
parser. Blank nodes share scope within one result set, across frames and repeated
options, and get distinct identities across punctuated result sets. Scoped labels
are opaque and may be renamed.

A missing trailer returns the rows already read with `complete: false`. A producer
error trailer throws `JellySparqlResultError`, with its message and `resultIndex`.
Supply `onResultError` to receive those errors through a callback and continue
reading; affected results retain `complete: false` and an `error` string.
`writer.endResult('backend timeout')` writes an error trailer. An error remains
in effect after concatenating another FLAT stream with a successful trailer.

`frameSize` limits writer rows per frame (default 250). The lookup working set
can also end a frame early. As with the RDF 1.2 writer, columns use packed full-IRI
name entries and repeat runs; prefix compression and lookup reuse across frames
are future optimizations. Parser limits include `maxMessageSize`,
`maxLookupTableSize`, `maxRowsPerBatch` (default 1,048,576), and
`maxCellsPerBatch` (default 1,048,576 across all variables). Files use delimited
frames by default; use `delimited: false` only for a single bare transport frame.

For row delivery without buffering an entire result set, `SparqlStreamParser`
emits event objects:

| `type` | Data |
| --- | --- |
| `header` | `variables` in projection order |
| `binding` | `bindings`, a Map for one solution |
| `boolean` | `value`, an ASK result |
| `metadata` | Binary `metadata` and optional updated `links` |
| `end` | `complete` and optional `error` |

Every event has a `resultIndex`. FLAT completion is emitted at end of input,
because concatenated options can invalidate an earlier success trailer.
`SparqlStreamWriter` consumes these same events. Both Node Transform streams
and browser Web Streams are available through the corresponding package entry:

```ts
import { SparqlStreamParser, SparqlStreamWriter } from 'rdfjs-jelly';
// For browser ReadableStream.pipeThrough(), import from 'rdfjs-jelly/browser'.
input.pipe(new SparqlStreamParser()).pipe(new SparqlStreamWriter()).pipe(output);
```

Set `streamType: SparqlStreamType.PUNCTUATED` on the stream writer when forwarding
multiple result sets. Stream parsers apply backpressure between frames and retain
at most one decoded frame of events. Binary metadata is copied, and invalid UTF-8
in the well-known `link` key is ignored. Unknown metadata keys remain binary.

## Node streams

```ts
import { createReadStream } from 'node:fs';
import { StreamParser } from 'rdfjs-jelly';

for await (const quad of createReadStream('data.jelly').pipe(new StreamParser())) {
  console.log(quad);
}
```

`StreamWriter` accepts RDF/JS quads in object mode and emits binary chunks. Both Node stream classes expose `import(readable)`.

## Browser streams

```ts
import { StreamParser } from 'rdfjs-jelly/browser';

const response = await fetch('/data.jelly');
for await (const quad of response.body!.pipeThrough(new StreamParser())) {
  console.log(quad);
}
```

The browser parser accepts `Uint8Array` and `ArrayBuffer` chunks. Browser and Node parsers emit `options`, `namespace`, `message`, and `messageCounter` events.

The browser parser resumes buffered decoding as its reader consumes output, even
while input stays open. It queues at most 256 output items, including during
closure; a decoded frame and unread input bytes occupy additional memory. When
using the writable side directly, consume the readable side concurrently: writes
and closure can wait for reader demand. Cancelling the reader stops pending
writes and propagates cancellation upstream when piping.

## Compression

Transport compression is intentionally separate from Jelly framing. Node.js
22.15/23.8 and newer expose `createZstdCompress()` and
`createZstdDecompress()` in `node:zlib`, alongside gzip and Brotli transforms:

```ts
import { createReadStream } from 'node:fs';
import { createZstdDecompress } from 'node:zlib';
import { StreamParser } from 'rdfjs-jelly';

const quads = createReadStream('data.jelly.zst')
  .pipe(createZstdDecompress())
  .pipe(new StreamParser());
```

The benchmarks below use Node's default gzip, zstd, and Brotli settings.
Compressed parsing includes decompression; compression and network transfer time
are outside the measured region. The size/speed tradeoff depends on the workload
and codec settings.

Browser users can wrap the parser with native `DecompressionStream` support or
a separate compression library, depending on the compression format.

## Performance

See [PERFORMANCE.md](PERFORMANCE.md) for a reproducible six-dataset RiverBench
comparison of `n3.js-messages` Turtle Message Logs, Jelly 1.1, and Jelly 1.2,
including reading, writing, compressed size, and streaming.
The [column optimization follow-up](docs/column-optimization-2026-10-24.md)
compares the saved reader baseline with the current implementation and measures
optional message packing separately.

For Jelly 1.2 archive writing, `packMessages: true` lets messages share batches
and reuses bounded lookup tables between batches:

```js
const writer = new Writer({
  version: 3,
  streamType: RdfStreamType.MESSAGES,
  messageSize: 1024,
  packMessages: true,
});
```

This buffers output until a batch fills or the writer ends. Message boundaries
and blank-node scopes remain separate, and messages carrying metadata are
isolated. Default message framing remains unchanged.

The [RiverBench Jelly 1.2 audit](docs/riverbench-performance-audit-2026-10-24.md)
and [implementation follow-up](docs/riverbench-performance-followup-2026-10-24.md)
include full-dataset streaming, writer timings, and allocation/GC measurements for
Jelly-RDF and Jelly-SPARQL. The follow-up replaces whole-table writer capacity
checks and reduces reader temporary allocations.

These are local microbenchmarks, not universal rankings. Recorded on 2026-09-12
with Node.js 25.9.0 on Linux, using an Intel Core i7-1265U and 30 GiB RAM,
against `rdf-parser-ts` 0.3.2 and `protobufjs` 8.8.0. Parsing timings include
constructing the result RDF/JS objects and decompressing where the case is
compressed; compression itself happens before the timed section. Before timing,
the harness validates every statement in order. Message validation checks every
message counter and permits a bijective blank-node renaming within each message,
so a parser cannot pass by splitting or merging identities.

### Message-based parsing, compared with rdf-parser-ts

Medians of 13 measured runs after one warm-up run, with explicit garbage
collection before each run. [Recorded samples and validation summaries](perf/compare-message-formats.json)
include all 12 cases.

The bundled `example/osm-dk-10k.jelly.gz` OpenStreetMap extract declares a
subject-graph stream and contains 10,000 source frames. The benchmark preserves
those original message boundaries: 300,656 statements in messages of 4–8,899
statements. Each source graph is written as a dataset containing its default
graph; Jelly uses QUADS with logical type DATASETS. Both text formats receive
the same messages, in the same order.

All 1,500 source blank nodes are confined to one source message each. The
workload and each parser's output are checked for that property. Consequently,
message-local scoping preserves the same 1,500 distinct blank-node identities,
up to renaming, without changing production decoder behaviour.

This replaces the previous benchmark's arbitrary groups of 250 statements,
which split blank-node connections. The results below are from the corrected
workload. `rdfjs-jelly` reads Jelly; `rdf-parser-ts` reads the N-Quads and TriG
serializations of the RDF Message Stream Log. The comparison measures these
format/implementation combinations, rather than an intrinsic ranking of formats.

```
Parsing speed - thousand statements per second (higher is better)

Jelly             ████████████████████████████████████████████   2158
Jelly + gzip      ████████████████████████████████████████       1952
Jelly + zstd      ███████████████████████████████████████████    2124
Jelly + Brotli    ███████████████████████████████████████████    2102
N-Quads           ████████████████████                            978
N-Quads + gzip    ███████████████████                             914
N-Quads + zstd    ███████████████████                             924
N-Quads + Brotli  ██████████████████                              899
TriG              ██████                                          308
TriG + gzip       ██████                                          281
TriG + zstd       ██████                                          306
TriG + Brotli     ██████                                          315
```

```
Encoded size - megabytes (lower is better)

N-Quads           ████████████████████████████████████████████   47.34
TriG              ██████████████████████████                     27.89
Jelly             █████████                                      10.14
N-Quads + zstd    ███                                             3.49
N-Quads + gzip    ███                                             3.30
Jelly + gzip      ███                                             2.84
Jelly + zstd      ███                                             2.71
TriG + zstd       ██                                              2.53
TriG + gzip       ██                                              2.44
N-Quads + Brotli  ██                                              2.03
Jelly + Brotli    ██                                              1.75
TriG + Brotli     █                                               1.48
```

| Format | Size | Median | Throughput | Relative latency |
| --- | ---: | ---: | ---: | ---: |
| Jelly | 10.14 MB | 139.3 ms | 2.16 M statements/s | 1.00× |
| Jelly + gzip | 2.84 MB | 154.0 ms | 1.95 M statements/s | 1.11× |
| Jelly + zstd | 2.71 MB | 141.6 ms | 2.12 M statements/s | 1.02× |
| Jelly + Brotli | 1.75 MB | 143.0 ms | 2.10 M statements/s | 1.03× |
| N-Quads | 47.34 MB | 307.3 ms | 0.98 M statements/s | 2.21× |
| N-Quads + gzip | 3.30 MB | 328.9 ms | 0.91 M statements/s | 2.36× |
| N-Quads + zstd | 3.49 MB | 325.2 ms | 0.92 M statements/s | 2.33× |
| N-Quads + Brotli | 2.03 MB | 334.5 ms | 0.90 M statements/s | 2.40× |
| TriG | 27.89 MB | 975.8 ms | 0.31 M statements/s | 7.00× |
| TriG + gzip | 2.44 MB | 1070.2 ms | 0.28 M statements/s | 7.68× |
| TriG + zstd | 2.53 MB | 981.4 ms | 0.31 M statements/s | 7.04× |
| TriG + Brotli | 1.48 MB | 954.2 ms | 0.32 M statements/s | 6.85× |

Caveats worth knowing before reusing these numbers. This dataset is entirely in
the default graph. Its statement payloads use N-Triples/Turtle-compatible
syntax, but the complete logs also contain message delimiters. A dataset with
named graphs would exercise different paths in both text formats. Each case runs
in its own process to avoid retaining other formats' large intermediate strings.
Cases run sequentially; small timing differences can reflect runtime variation.
Every case is handed a freshly allocated input buffer inside the timed region,
since decompression inherently produces one and reusing a long-lived buffer would
credit the uncompressed cases with allocation work a real reader still performs.

### Interpreting the comparison

Jelly can omit repeated terms and resolve references through lookup tables while
parsing. Transport compression reduces transmitted bytes, but the receiver
still decodes the underlying format after decompression. These mechanisms help
explain the measurements; they do not isolate the cost of string decoding,
object construction, garbage collection, or decompression itself.

Length prefixes locate Jelly frame boundaries. They locate RDF Message
boundaries here because this benchmark explicitly writes one frame per source
message. That mapping is a workload choice, not a general property of Jelly.

These synchronous benchmarks do not measure network streaming, slow-consumer
backpressure, or browser performance. The retained flat-mode profile's GC
percentage is not a cost breakdown for the message benchmark, and subtracting
two end-to-end medians does not isolate decompression time.

### Flat parsing, compared with rdf-parser-ts

The earlier flat-mode snapshot uses a contrasting workload: 100,000 generated triples with unique subjects and
literals and one repeated predicate, parsed flat rather than in message mode.
Unique subjects reduce reuse, although the constant predicate and shared IRI
prefixes still benefit from Jelly compression.

| Parser | Format | Input size | Median | Throughput |
| --- | --- | ---: | ---: | ---: |
| rdfjs-jelly | Jelly | 2,579,568 B | 41.4 ms | 2.42 M statements/s |
| rdf-parser-ts | N-Triples | 6,377,780 B | 40.5 ms | 2.47 M statements/s |
| rdfjs-jelly | Jelly + gzip | 496,581 B | 43.9 ms | 2.28 M statements/s |
| rdf-parser-ts | N-Triples + gzip | 490,694 B | 41.4 ms | 2.41 M statements/s |
| rdfjs-jelly | Jelly + zstd | 93,175 B | 43.6 ms | 2.29 M statements/s |
| rdf-parser-ts | N-Triples + zstd | 41,638 B | 41.2 ms | 2.43 M statements/s |
| rdfjs-jelly | Jelly + Brotli | 128,277 B | 44.3 ms | 2.26 M statements/s |
| rdf-parser-ts | N-Triples + Brotli | 117,438 B | 41.2 ms | 2.43 M statements/s |

Parsing is within about 2–8% across the four transport variants here, with
`rdf-parser-ts` marginally ahead, while uncompressed Jelly is 60% smaller. This
shows a smaller gap than the message workload. Note also how well this workload
compresses — zstd takes N-Triples to 41,638 B — which is a property of the synthetic data, not of either format.

Writing remains the weaker side: Jelly writes this workload in 76.9 ms
(1.30 M statements/s) against 40.9 ms for N-Triples, because it maintains lookup
tables and builds protobuf frames rather than concatenating text.

### What makes it fast

Parsing decodes common triple, quad, IRI, literal, and lookup-entry payloads
straight from protobuf bytes into the RDF/JS factory, with schema-specific static
protobuf.js code and monomorphic call sites, avoiding intermediate protobuf
objects and frame/row object graphs. `Parser.parse()` writes quads directly to
its result array rather than building `Message` arrays, and Node inputs are
normalised to zero-copy `Buffer` views. Datatype terms are cached by their
bounded lookup IDs; a general string-keyed NamedNode cache was measured and
rejected, because repeated-term omission already covers the common reuse case.

Writing uses indexed O(1) LRU lookup links, shares one map probe between lookup
insertion and reference selection, reuses scratch row storage, and serialises
frames directly from Jelly rows without building a second protobuf object graph.

### Reproduce

```sh
npm run perf:compare:messages -- 13  # message-based Jelly vs N-Quads vs TriG
npm run perf:compare:rdf-parser      # flat Jelly vs N-Triples
npm run perf:profile -- 100000 7
npm run perf:profile:writer -- 100000 7
```

## Development

```sh
npm install
npm run typecheck       # TypeScript checks
npm run lint            # ESLint, including promise handling checks
npm test                # Fast source tests
npm run test:coverage   # Coverage with enforced thresholds
npm run build
npm run lint:package    # publint and Are the Types Wrong
npm run test:package    # Installed tarball, imports, declarations, and CLI
npm run check           # Complete local release gate
npm run proto:generate  # Regenerate checked-in protobuf codecs
npm run proto:check     # Check reproducibility without overwriting codecs
```

`dist/` is generated locally and ignored by Git. `npm install` and `npm ci`
build it through the `prepare` script; npm packages include the generated Node
and browser bundles through the `files` allowlist. Run `npm run build` after
source changes.

`npm run check` is also enforced by `prepublishOnly`. It requires development
dependencies and may fetch production dependencies while testing an isolated
consumer installation. The root export supports CJS and ESM with separate
matching declarations; `rdfjs-jelly/browser` is ESM-only (use dynamic import
from CJS). The legacy `browser` field remains for older bundlers.

Coverage excludes generated protobuf code and starts at the measured baseline:
79.34% statements, 74.89% branches, 83.10% functions, and 84.89% lines. Raise
these thresholds as tests improve. CI uploads LCOV and JSON coverage reports.
ESLint uses the maintained typescript-eslint recommended rules plus typed
promise checks, without imposing a new formatting style on the codec code.

CI checks the minimum supported Node 24.0.0, current Node 24 and Node 26, and a
Windows consumer installation. For actual browser bundle tests, install
Chromium with `npx playwright install chromium --only-shell`, then run
`npm run test:browser`. CI installs the required system libraries as well.
Both the ESM and global browser bundles must round-trip RDF and SPARQL data,
including RDF Web Streams.

The conformance job also checks writer output using the independent Python
reference decoders from Jelly's pinned v1.2.0 test suite. To run locally with
Python 3.10 or newer and a checkout of that release:

```sh
npm run build
npm run test:interop -- /path/to/jelly-protobuf-v1.2.0
```

`npm run perf:regression` compares synthetic RDF/SPARQL reads and writes against
`PERF_BASE_REF` (default `HEAD`), building both with the same installed tools.
It includes message boundaries and small lookup tables, takes the median of
five samples, and warns when elapsed time increases by more than 20%.
Historical baselines run only the features they export: new Jelly-RDF 1.2 or
SPARQL workloads are reported with current timings and a reason for the missing
comparison. Shared Jelly 1.1 read/write workloads still run. The current build
must support every workload, and failures in supported features are never skipped.
`npm run test:perf` tests these compatibility rules.
Correctness or build failures still fail the job. CI compares PRs against their
base branch and main commits against their parent. This check requires Git
and tar and runs separately from the release gate to avoid noisy timing failures.

`npm run perf:quality` reports sampled allocations, GC time, and retained heap
deltas for the same synthetic cases. Set `PERF_OUTPUT` to save JSON. Allocation
counts are sampling estimates and retained heap deltas are diagnostic, not
memory bounds. The weekly/manual performance workflow uploads these reports
and a full streaming RiverBench Jelly 1.2 parse report, recording the downloaded
file's checksum because the upstream `dev` dataset can change.

Renovate configuration requests weekly dependency updates and lockfile
maintenance; enable the Renovate GitHub App for this repository to activate it.
Local hooks are optional: `npm run hooks:install` enables a fast typecheck/lint
pre-commit hook. Hook installation is never part of dependency installation.

The checked-in schemas are Jelly-RDF `rdf.proto` 1.2.0 and Jelly-SPARQL
`sparql.proto` 1.0.0 from the same upstream release. Static JavaScript codecs
and TypeScript declarations are generated with protobuf.js. The generation
step replaces generic oneof setter calls with cheap discriminator markers;
`src/generated/rdf_pb.ts` consumes those markers while preserving protobuf's
last-one-wins semantics.

Tests include all 226 parser and 31 writer fixtures from the official v1.2.0
release, plus legacy 1.1 fixtures, Node/browser streaming, and version-2 writer
compatibility. Jelly-SPARQL adds all 201 parser and 29 writer fixtures from that
release, plus completion/error handling, blank-node scope, and streaming tests.
This is test coverage, not a published conformance report.
Regenerate the 1.2 fixture bundles from a v1.2.0 checkout with
`node scripts/import-rdf12-fixtures.mjs /path/to/jelly-protobuf`. For SPARQL, use
`node scripts/import-sparql-fixtures.mjs /path/to/jelly-protobuf`.
The low-level `Encoder` remains the row encoder; `ColumnEncoder` writes the new
layout. Low-level decoders should use `decodePayloadMessages()` and
`finishMessages()` to preserve logical messages across frames.

## License

Apache 2
