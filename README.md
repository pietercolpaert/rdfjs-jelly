# rdfjs-jelly

[![npm](https://img.shields.io/npm/v/rdfjs-jelly.svg)](https://www.npmjs.com/package/rdfjs-jelly)
[![CI](https://github.com/pietercolpaert/rdfjs-jelly/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/pietercolpaert/rdfjs-jelly/actions/workflows/ci.yml)
[![Performance reports](https://github.com/pietercolpaert/rdfjs-jelly/actions/workflows/performance.yml/badge.svg?branch=main)](https://github.com/pietercolpaert/rdfjs-jelly/actions/workflows/performance.yml)
[![npm downloads](https://img.shields.io/npm/dm/rdfjs-jelly.svg)](https://www.npmjs.com/package/rdfjs-jelly)
[![Node.js](https://img.shields.io/node/v/rdfjs-jelly.svg)](https://github.com/pietercolpaert/rdfjs-jelly/blob/main/package.json)
[![TypeScript types](https://img.shields.io/npm/types/rdfjs-jelly.svg)](https://www.npmjs.com/package/rdfjs-jelly)
[![License](https://img.shields.io/github/license/pietercolpaert/rdfjs-jelly.svg)](LICENSE)

Jelly-RDF and Jelly-SPARQL binary parsers and writers using RDF/JS terms, for Node.js and browsers.

## Support

- Reads Jelly-RDF 1.0, 1.1, and 1.2 (protocol tags 1, 2, and 3).
- Writes packed Jelly-RDF 1.2 by default; use `version: 2` for Jelly 1.1.
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
npx rdfjs-jelly convert messages.log --version 3 --output messages.jelly.zst
npx rdfjs-jelly convert messages.log --version 3 --message-size 1024 --compression gzip
```

Both commands accept a URL, local file path, or `-` for stdin. Plain, gzip, and
zstd-compressed input is detected from its bytes. `read` is an alias for
`inspect`; run `npx rdfjs-jelly --help` for the complete usage. Inspection preserves
RDF 1.2 literal directions and nested triple terms in its N-Quads output.

Conversion defaults to Jelly 1.1 (protocol tag 2) with zstd level 3. Use
`--version 3` for Jelly 1.2, including directional literals, triple terms and
explicit logical message boundaries. Tag-3 output uses `MESSAGES` and enables
packing and persistent dictionaries by default.

| Convert option | Meaning and default |
| --- | --- |
| `--version 2\|3` | Protocol tag: Jelly 1.1 or 1.2; default `2` |
| `--message-size N` | Frame row budget for tag 2, statement budget per batch for tag 3; default `250` |
| `--pack-messages`, `--no-pack-messages` | Share batches across tag-3 messages; enabled by default |
| `--persistent-lookups`, `--no-persistent-lookups` | Retain tag-3 dictionaries across batches; enabled by default |
| `--max-names N` | Name dictionary capacity; default `4000`, minimum `8` for tag 2 or `128` for tag 3 |
| `--max-prefixes N` | Prefix dictionary capacity; default `150`; `0` disables prefix splitting |
| `--max-datatypes N` | Datatype dictionary capacity; default `32` |
| `--compression zstd\|gzip\|none` | Output codec; default `zstd` |
| `--compression-level N` | Native codec level; default `3` for zstd or `6` for gzip; unavailable with `none` |
| `--output PATH`, `-o PATH` | Output file, or `-` for stdout; default filename follows the selected codec |

The default suffix is `.jelly.zst`, `.jelly.gz` or `.jelly` for zstd, gzip or no
compression. An explicit output path does not select the codec; use
`--compression` for that. Packing and persistent-lookup switches require
`--version 3`; other writer limits follow the API's validation rules. All CLI
output uses delimited frames. Diagnostics go to stderr, leaving stdout available
for piping binary output:

```sh
cat messages.log | npx rdfjs-jelly convert - --version 3 --compression none -o - > messages.jelly
```

Conversion streams the input, RDF Message parser, Jelly writer, compressor and
output without loading the complete file. Memory use includes the current
logical message. `--no-pack-messages` finalizes each message's last frame at its
boundary; messages can still span batches when they exceed `--message-size`.

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

`Writer`, Node `StreamWriter`, and browser `StreamWriter` emit delimited Jelly 1.2
streams (protocol tag 3) with message packing enabled by default. Use `version: 2`
for Jelly 1.1 compatibility. Set
`delimited: false` for one bare protobuf frame. All output must fit in that frame;
a Jelly 1.2 frame can contain several logical messages when packing is enabled.

## Jelly-RDF 1.2

[Jelly-RDF 1.2.0](https://w3id.org/jelly/1.2.0/specification/serialization/)
introduces a column layout (protocol tag **3**), packed lookup entries, repeat
runs, RDF 1.2 terms, explicit RDF Message boundaries, and concatenable streams.
The parser selects the layout from the stream options. Existing 1.0/1.1 streams
remain readable; pass `version: 2` to write Jelly 1.1 for older consumers.

```ts
import { DataFactory, Parser, Writer, RdfStreamType, RdfVersion } from 'rdfjs-jelly';

const { namedNode, literal, quad } = DataFactory;
const messageWriter = new Writer({
  version: 3,
  streamType: RdfStreamType.MESSAGES,
  rdfVersion: RdfVersion.RDF_1_2,
});
messageWriter.addMessage([
  quad(namedNode('urn:sensor'), namedNode('urn:value'), literal('21')),
]);
messageWriter.addMessage([]);
messageWriter.flush(); // Finalizes this batch; the writer stays open.
messageWriter.addMessage([
  quad(namedNode('urn:sensor'), namedNode('urn:value'), literal('22')),
]);
messageWriter.end((error, bytes) => {
  if (error) throw error;
  console.log(new Parser().parseMessages(bytes!).map(message => message.length));
  // [1, 0, 1]
});
```

With `version: 3`, `streamType` defaults to `FLAT`; use `MESSAGES` for explicit
logical boundaries as above. `messageSize` defaults to 250 statements per batch;
a message may span batches. Lookup capacity can also end a batch early. The
writer splits IRIs after the last `#`, or the last `/` when no `#` is present, into a prefix and a name
(disable with `lookup: { maxPrefixes: 0 }`),
and uses packed entries and repeat runs. Bounded prefix, name and datatype tables remain
available across batches. Eviction favors colder entries and protects entries
used by the current batch. Values can be resent after eviction. Pass
`persistentLookups: false` for batch-local dictionaries. In 0.2.0,
`packMessages` defaults to `true`: small messages share frames. Set
`packMessages: false` to finalize each message's last frame immediately.
A statement that cannot fit an empty batch raises an error. The name table must hold at least 128 entries.

Call `writer.flush()` to emit a partially filled batch without ending the writer.
With a delimited output sink, `flush()` writes buffered frames to that sink.
Without a sink, it finalizes the batch and leaves the bytes available through
`end()`. It preserves lookup dictionaries. Counter-based input completes its
current logical message on flush; subsequent input must use a higher counter.
`flush(callback)` reports serialization errors through the callback; without a
callback it throws. Flushing requires delimited output. Packing has no timer:
use explicit flushes or `packMessages: false` for latency-sensitive delivery.

The 1.2 layout supports `TRIPLES` and `QUADS`. Use `QUADS` for named graphs;
`GRAPHS`, `addGraph()`, and `logicalType` require `version: 2`. Use
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
import { DataFactory, Parser, Writer, RdfStreamType } from 'rdfjs-jelly';

const statement = DataFactory.quad(
  DataFactory.blankNode('sensor'),
  DataFactory.namedNode('urn:value'),
  DataFactory.literal('21'),
);
const writer = new Writer({ version: 3, streamType: RdfStreamType.MESSAGES });
writer.addMessage([statement], { source: new TextEncoder().encode('sensor-a') });
writer.addMessage([]); // Empty messages are preserved.
writer.addMessage([statement]); // The blank node has a separate message-local identity.

writer.end((error, bytes) => {
  if (error) throw error;
  const messages = new Parser().parseMessages(bytes!);
  console.log(messages.map(message => message.messageCounter)); // [0, 1, 2]
});
```

For compatibility with `rdf-parser-ts`, use `new Parser({ messages: true })` to
receive `{ quad, messageCounter }` entries. The returned array has a `messageCount`
property. `isMessageQuad()` identifies wrapped entries; `toMessages()` groups them
by counter and uses `messageCount` (or its explicit second argument) to preserve
trailing empty messages. Wrapped entries carry no metadata; use `parseMessages()`
to retain message metadata. `Writer.addQuads()` honors the returned array's
`messageCount`. For incremental wrapped input, call
`writer.finishMessages(totalMessageCount)` before `end()` to record trailing
empty messages.

Stream parsers emit a `message` event for every message, including empty ones.
With `messages: true`, output items are wrapped entries and a `messageCounter`
event accompanies each quad. Quad-only output cannot represent empty messages;
retain the `message` events if forwarding a message stream.

## Quad-pattern filtering

Since 0.2.1, `Parser`, Node `StreamParser`, and browser `StreamParser` accept
`quadPatterns`:

```ts
import { DataFactory, Parser } from 'rdfjs-jelly';

const parser = new Parser({
  quadPatterns: [
    { predicate: DataFactory.namedNode('http://example.org/name') },
    { predicate: DataFactory.namedNode('http://example.org/knows') },
  ],
});
const selectedQuads = parser.parse(bytes);
```

Patterns are combined with OR; positions within a pattern are combined with AND.
An omitted or `null` position is a wildcard. Omit `quadPatterns` to select all
quads; `[]` selects none, and `[{}]` selects all. Matching preserves input order
and duplicates, without duplicating quads that match several patterns.
`QuadPattern` is exported as a TypeScript type.

Jelly 1.2 matches column values before constructing RDF/JS terms or quads. When
every pattern pins the same position (subject, object, predicate or graph) to an
IRI, that column alone chooses the rows: each distinct IRI is judged once, and the
other columns, including literal text, are built only for the selected rows. Only
selected values reach your data factory. Patterns that also constrain other
positions are checked on those few candidates. Patterns that share no IRI-pinned
position (for example a literal-only object, or an OR of patterns on different
positions) use a slower path that, in our measurements, is not faster than
parsing everything and filtering afterwards.
Lookup updates and validation still run for rejected statements, so malformed
input is still rejected. Errors that depend on your data factory, such as a
directional literal it cannot build, surface only for selected statements. The
filter does not skip bytes, files or decompression.
Jelly 1.0/1.1 also support filtering, after term decoding and before quad creation.
Namespaces remain available regardless of the filter. See
[PERFORMANCE.md](PERFORMANCE.md#pushing-down-a-filter-to-the-parser) for measurements.

Filtering keeps empty messages, message counters and metadata. A message with no
matching quads becomes empty; use `parseMessages()` or stream `message` events to
retain its boundary. Plain quad output contains only selected statements.

Terms match by kind and value. Literal equality includes datatype, language
(case-insensitive) and direction; plain strings equal explicit `xsd:string`
literals. Triple terms match recursively. Graph patterns distinguish named,
blank-node and default graphs. Blank-node patterns use the labels in parser
output, including the opaque message scope in Jelly 1.2; raw labels from the
input are not identifiers across independent messages.

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
if (result?.type === 'select') {
  console.log(result.variables, result.bindings[0]?.get('item'), result.complete);
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
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { SparqlStreamParser, SparqlStreamWriter } from 'rdfjs-jelly';

await pipeline(
  createReadStream('results.jellys'),
  new SparqlStreamParser(),
  new SparqlStreamWriter(),
  createWriteStream('results-copy.jellys'),
);
```

For browser `ReadableStream.pipeThrough()`, import the stream classes from
`rdfjs-jelly/browser`. Set `streamType: SparqlStreamType.PUNCTUATED` on the stream
writer when forwarding multiple result sets. Stream parsers apply backpressure
between frames and retain at most one decoded frame of events. Binary metadata is copied, and invalid UTF-8
in the well-known `link` key is ignored. Unknown metadata keys remain binary.

## Node streams

```ts
import { createReadStream } from 'node:fs';
import { StreamParser } from 'rdfjs-jelly';

for await (const quad of createReadStream('data.jelly').pipe(new StreamParser())) {
  console.log(quad);
}
```

`StreamWriter` accepts RDF/JS quads or `{ quad, messageCounter }` entries in
object mode and emits binary chunks. To write Jelly 1.2 messages, configure it
with `version: 3` and `streamType: RdfStreamType.MESSAGES`, and supply wrapped
entries. Both Node stream classes expose `import(readable)`.

Call the Node writer's `flush(callback)` to serialize buffered input after all
preceding writes, including corked writes, without ending the stream. Its return
value follows Node's writable backpressure convention. The callback signals that
bytes have entered the readable side; downstream delivery may still be pending.

## Browser streams

```ts
import { StreamParser } from 'rdfjs-jelly/browser';

const response = await fetch('/data.jelly');
for await (const quad of response.body!.pipeThrough(new StreamParser())) {
  console.log(quad);
}
```

The browser parser accepts `Uint8Array` and `ArrayBuffer` chunks. Browser and Node
parsers emit `options`, `namespace` and `message` events, plus `messageCounter`
events when `messages: true`. Browser listeners use `on()` or `addEventListener()`.

The browser parser resumes buffered decoding as its reader consumes output, even
while input stays open. It queues at most 256 output items, including during
closure; decoded data and unread input bytes occupy additional memory. When
using the writable side directly, consume the readable side concurrently: writes
and closure can wait for reader demand. Cancelling the reader stops pending
writes and propagates cancellation upstream when piping.

RDF stream parsers assemble complete logical messages before emitting their
quads. A message spanning many frames can therefore retain more than one frame's
worth of RDF data; `maxRowsPerBatch` limits individual batches, not total message
length. The browser `StreamWriter` exposes `readable`, `writable` and `import()`;
its underlying `Writer` flushes on batch boundaries or stream closure. The public
stream-level `flush(callback)` described above belongs to the Node wrapper.

## Compression

Transport compression is separate from Jelly framing. The supported Node.js
versions expose `createZstdCompress()` and `createZstdDecompress()` in `node:zlib`,
alongside gzip and Brotli transforms:

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
statements, Jelly 1.2 reads downloaded archives at **2.26–2.84 million statements/s**
and locally packed message streams at **3.89–4.22 million/s** across separate runs.
These are geometric means of per-dataset rates, measured on 2026-10-25 with
Node v25.9.0 / V8 14.1 on an Intel Core i7-1265U with 30.8 GiB RAM.
For `assist-iot-weather`, locally written Jelly 1.1 (tag 2) parses at
**3.08 million statements/s**, versus
**4.92 million/s** for packed Jelly 1.2:
**1.59×** the throughput, or
**59% faster**. These uncompressed reads contain the same 1,150,000 statements
and 10,000 messages; framing and dictionary contents differ. This example uses a
separate sequential batch with two warmups and seven timed iterations per format.
The ranges above span measurement batches, rather than confidence intervals;
the tables below retain the primary archive and packed measurements.

| Retained-message parsing | Million statements/s |
| --- | ---: |
| Turtle source logs, N3 message parser | 0.85 |
| Legacy Jelly archives, row layout, tag 1 (1.0) | 2.28 |
| Jelly 1.2 archives, column layout, tag 3 | 2.26 |
| Jelly 1.2 archives + gzip, including decompression | 2.00 |
| Jelly 1.2 archives + zstd, including decompression | 2.10 |
| Locally written per-message-framed Jelly 1.2 | 2.88 |
| Locally packed Jelly 1.2 messages | 3.89 |

Downloaded Jelly 1.2 reads **2.64×** as fast as source Turtle logs and
**0.99×** as fast as the legacy archives. Packed-file reading reaches
**1.70×** the legacy archive throughput, but changes framing and dictionary
contents as well as the parser's input. This is not a format-only comparison.

The downloaded 1.2 encodings use **26.8% fewer raw bytes**, **16.4% fewer gzip
bytes**, and **10.7% fewer zstd bytes** than the legacy archives by geometric
mean. Compressed Turtle is smaller on several datasets; the ranking depends on
data, representation and codec settings.

| Writing the same source messages | Million statements/s |
| --- | ---: |
| Turtle with shared prefixes | 1.46 |
| Jelly 1.1, tag 2 | 1.28 |
| Jelly 1.2, per-message framing | 1.22 |
| Jelly 1.2, packed messages | 1.76 |

Writer timing includes collecting serialized bytes and excludes compression.
Per-message framing completes a message's last batch at its boundary. Both Jelly 1.2 configurations
retain bounded lookup dictionaries across batches. Jelly 1.2 message streams
pack by default. The local writer and packed-read benchmarks explicitly use
`messageSize: 1024`, rather than the API default of 250:

```js
import { Writer, PhysicalStreamType, RdfStreamType } from 'rdfjs-jelly';

const writer = new Writer({
  version: 3,
  physicalType: PhysicalStreamType.TRIPLES,
  streamType: RdfStreamType.MESSAGES,
  messageSize: 1024,
  packMessages: true,
});
```

Set `packMessages: false` for per-message framing. Packing buffers output until
a batch fills, `flush()` is called, or the writer ends, while keeping
message boundaries and blank-node scopes separate. Metadata-bearing messages
are isolated. Weather output uses **9.04 raw bytes/statement** when packed and
**9.35** with per-message framing, close to **9.33** in the downloaded archive.
The current writer uses prefix/name splitting, inferred IDs and persistent
dictionaries. Smaller encoded files need not parse faster: prefix reconstruction,
lookups and RDF term creation still cost CPU time. Per-message-framed local reads
were measured in a later sequential batch than the archive/packed table. A
separate packed-read batch measured 4.22 million statements/s. Packed reads and
writes use the same source RDF and timing policy in separate sequential batches.

Gzip file streaming into a discard sink delivers **0.53–3.55 million statements/s**
for Jelly 1.2, with **82–129 MiB** whole-process peak RSS across these datasets.
RSS includes startup, input buffers and warmups; it is not parser-only memory.

Retained reads keep complete RDF/JS message arrays in memory. Each case runs in
a fresh process with two warmups and seven timed iterations; explicit GC precedes
each operation and medians are reported. Inputs are reused byte buffers. File I/O
is excluded, UTF-8 decoding is included for Turtle, and compressed reads include
decompression. gzip uses level 6 and zstd level 3. Every output message is checked
for RDF equivalence and blank-node scope outside timing. The six datasets contain
triples; these results do not measure browser, named-graph, RDF 1.2 term, SPARQL
result, network or slow-consumer performance.

Independent archive-read repetitions give 2.84 million statements/s for Jelly
1.2 and 2.81 million/s for the legacy archives. The main tables retain the
primary measurements. Scheduling, thermal state and heap behavior are not
controlled; the repetitions do not identify the cause of the variation.

### Comparison with the JVM

The [JVM benchmark](https://jelly-rdf.github.io/1.2.x/performance/rdf/) reports
about 19–20 million statements/s for writing and 28–31 million/s for reading.
It uses flat streams, 100,000 statements per dataset, a discard sink for reads,
a null output stream for writes, GraalVM and different hardware. Optional
validation and blank-node relabeling are disabled where configurable. Our
message benchmark retains RDF objects and applies message-local scopes. The
archive reader comparison is also against Jelly 1.0; the JVM version comparison
uses 1.1 and 1.2. These are different workloads and APIs.

Local CPU profiles show work in message construction, string decoding, RDF
materialization and garbage collection. Packing amortizes frame setup across
small messages. Those approximate inclusive profiles are not additive phase
timings and do not profile the current prefix-compressing writer. A discard sink
avoids retaining final results but can still allocate RDF objects. Factory-call
instrumentation also shows that prefix/name encodings can cause more named-node
construction on some datasets even while they use fewer wire bytes. The JavaScript
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

Coverage excludes generated protobuf code and enforces minimum thresholds of
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
