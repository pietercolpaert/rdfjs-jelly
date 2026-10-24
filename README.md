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
full-IRI name entries and repeat runs. With `packMessages: true`, bounded lookup
tables remain available across batches; default framing uses batch-local tables.
A statement that cannot fit an empty batch raises an error. The name table must hold at least 128 entries.

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
can also end a frame early. Columns use packed full-IRI name entries and repeat
runs, with separate name/datatype dictionaries for each frame. Parser limits include `maxMessageSize`,
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

The RiverBench measurements below use gzip level 6 and zstd level 3.
Compressed parsing includes decompression; compression and network transfer time
are outside the measured region. The size/speed tradeoff depends on the workload
and codec settings.

Browser users can wrap the parser with native `DecompressionStream` support or
a separate compression library, depending on the compression format.

## Performance

Across six RiverBench datasets containing 60,000 messages and 2.10 million
statements, the current Jelly 1.2 reader achieves **1.97 million statements/s**
on downloaded archives. Locally packed message streams read at **3.14 million/s**.
These are geometric means of per-dataset rates, measured on 2026-10-24 with
Node v25.9.0 / V8 14.1 on an Intel Core i7-1265U with 30.8 GiB RAM.

| Retained-message parsing | Million statements/s |
| --- | ---: |
| Turtle source logs, N3 message parser | 0.94 |
| Legacy Jelly archives, row layout, tag 1 (1.0) | 2.25 |
| Jelly 1.2 archives, column layout, tag 3 | 1.97 |
| Jelly 1.2 archives + gzip, including decompression | 1.90 |
| Jelly 1.2 archives + zstd, including decompression | 1.96 |
| Locally packed Jelly 1.2 messages | 3.14 |

Downloaded Jelly 1.2 reads **2.10×** as fast as source Turtle logs and
**0.87×** as fast as the legacy archives. Packed-file reading reaches
**1.39×** the legacy archive throughput, but changes framing and dictionary
contents as well as the parser's input. This is not a format-only comparison.

The downloaded 1.2 encodings use **26.8% fewer raw bytes**, **16.4% fewer gzip
bytes**, and **10.7% fewer zstd bytes** than the legacy archives by geometric
mean. Compressed Turtle is smaller on several datasets; the ranking depends on
data, representation and codec settings.

| Writing the same source messages | Million statements/s |
| --- | ---: |
| Turtle with shared prefixes | 1.52 |
| Jelly 1.1, tag 2 | 1.34 |
| Jelly 1.2, default message framing | 1.12 |
| Jelly 1.2, packed messages | 1.82 |

Writer timing includes collecting serialized bytes and excludes compression.
Default framing completes a batch at each message boundary. Packing lets small
messages share batches and retains bounded dictionaries across batches:

```js
const writer = new Writer({
  version: 3,
  physicalType: PhysicalStreamType.TRIPLES,
  streamType: RdfStreamType.MESSAGES,
  messageSize: 1024,
  packMessages: true,
});
```

Packing buffers output until a batch fills or the writer ends, while keeping
message boundaries and blank-node scopes separate. Metadata-bearing messages
are isolated. Packed weather output uses **20.43 raw bytes/statement**, versus
**44.42** with default framing and **9.33** in the downloaded archive. The local
writer uses full IRI names without prefix compression, so its output sizes differ
from RiverBench's encodings. Packed reads and writes were measured in separate
sequential batches using the same source RDF and timing policy.

Gzip file streaming into a discard sink delivers **0.49–3.83 million statements/s**
for Jelly 1.2, with **77–133 MiB** whole-process peak RSS across these datasets.
RSS includes startup, input buffers and warmups; it is not parser-only memory.

Retained reads keep complete RDF/JS message arrays in memory. Each case runs in
a fresh process with two warmups and seven timed iterations; explicit GC precedes
each operation and medians are reported. Inputs are reused byte buffers. File I/O
is excluded, UTF-8 decoding is included for Turtle, and compressed reads include
decompression. gzip uses level 6 and zstd level 3. Every output message is checked
for RDF equivalence and blank-node scope outside timing. The six datasets contain
triples; these results do not measure browser, named-graph, RDF 1.2 term, SPARQL
result, network or slow-consumer performance.

An independent repetition of the uncompressed Jelly reads, using new worker
processes, gives 2.11 million statements/s for Jelly 1.2. The main tables
use the primary run; the repetition and per-dataset rates in PERFORMANCE.md
show the observed process-to-process variation.

### Comparison with the JVM

The [JVM benchmark](https://jelly-rdf.github.io/1.2.x/performance/rdf/) reports
about 19–20 million statements/s for writing and 28–31 million/s for reading.
It uses flat streams, 100,000 statements per dataset, a discard sink for reads,
a null output stream for writes, GraalVM and different hardware. Optional
validation and blank-node relabeling are disabled where configurable. Our
message benchmark retains RDF objects and applies message-local scopes. The
archive reader comparison is also against Jelly 1.0; the JVM version comparison
uses 1.1 and 1.2. These are different workloads and APIs.

Possible contributors include RDF/JS object and array allocation, garbage
collection under retained output, packed-column decoding and term materialization,
factory-call costs, and fixed overhead per small frame or message. The JavaScript
row and column decoders use different paths. V8 and GraalVM can specialize calls,
represent objects and eliminate temporary allocations differently. These are
possible explanations, not measured causes of the gap: the timings do not
separate runtime effects from implementation, API, workload or hardware effects,
and do not establish an inherent JavaScript speed limit.

[PERFORMANCE.md](PERFORMANCE.md) includes per-dataset read/write rates for both
message configurations, raw and compressed sizes, streaming memory figures,
input checksums, reproduction commands and the complete measurement method.

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
and TypeScript declarations are generated with protobuf.js. The generated
decoders record the last oneof field using discriminator markers;
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
