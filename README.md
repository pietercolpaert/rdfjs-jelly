# rdfjs-jelly

[![npm](https://img.shields.io/npm/v/rdfjs-jelly.svg)](https://www.npmjs.com/package/rdfjs-jelly)

Jelly-RDF binary parser and writer for RDF/JS, for Node.js and browsers.

## Support

- Reads Jelly protocol versions 1 and 2.
- Writes Jelly protocol version 2 only.
- Supports physical triple, quad, and graph streams; delimited and non-delimited encoding; lookup/repeated-term compression; namespaces; and message metadata.
- Uses RDF/JS quads and accepts a custom RDF/JS data factory.
- Does not support RDF-star, generalized RDF, Jelly-Patch, or gRPC.

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

## Messages

The API exposes one Jelly `RdfStreamFrame` as one `Message` container.
`Message` extends `Array<RDF.Quad>` and carries `messageCounter` and binary
`metadata`. This API mapping does not make every frame an independent RDF Message.

A Jelly frame is a serialization boundary. Frames in a flat stream can share
blank-node scope. An RDF Message is a semantic boundary: blank-node identifiers
are local to that message. Equal labels in different RDF Messages do not identify
the same blank node. See the [Jelly blank-node rules](https://jelly-rdf.github.io/1.1.x/specification/serialization/#blank-nodes)
and [RDF Messages specification](https://w3c-cg.github.io/rsp/spec/messages).

Currently, `parseMessages()` and `messages: true` expose frame boundaries and
preserve the decoded blank-node labels; they do not assign fresh identities per
frame. Consumers must distinguish transport frames from independent RDF Messages
and retain the appropriate scope when interpreting those labels.

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

## Browser playground

Build the browser bundle, serve the repository, and open `/index.html`:

```sh
npm run build:browser
python3 -m http.server 8000
```

The bundled `example/osm-dk-10k.jelly.gz` dataset is selected by default. The
playground accepts URLs and uploaded files, and detects plain, gzip, and zstd
input from its magic bytes rather than the filename. It steps through one Jelly
RDF Message at a time, can fast-forward to the end, and retains a rolling
history of 20 messages.

The conversion mode parses an RDF 1.2 Message Stream Log with `rdf-parser-ts`,
preserves empty message boundaries, writes Jelly protocol version 2, compresses
the result as a standard zstd frame, and saves a `.jelly.zst` file. Conversion
streams through the parser, Jelly encoder, and zstd WASM codec into a file chosen
with the File System Access API. Browsers without that API cannot provide a
bounded-memory download and should use the CLI. Browser zstd input is streamed
when the browser exposes a native zstd `DecompressionStream`; otherwise the
WASM fallback still requires a complete compressed input buffer. Gzip and
uncompressed input remain streaming.

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

Browser `CompressionStream` and `DecompressionStream` do not currently expose
zstd. The playground therefore uses `@hpcc-js/wasm-zstd` for incremental zstd
output compression and buffered zstd input decompression, while retaining the
native browser stream API for gzip. The WASM codec is confined to the playground
bundle, which is a development page and is not part of the published package, so
it affects neither the `dist/browser/index.mjs` parser bundle nor what consumers
install.

## Performance

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
npm run lint
npm test
npm run build
npm run check
npm run proto:generate
```

The checked-in schema is Jelly-RDF `rdf.proto` 1.1.1. Static JavaScript codecs
and TypeScript declarations are generated with protobuf.js. The generation
step replaces generic oneof setter calls with cheap discriminator markers;
`src/generated/rdf_pb.ts` consumes those markers while preserving protobuf's
last-one-wins semantics.

Tests include pinned official Jelly conformance fixtures and pyjelly-compatible
version-2 writer behavior.

## License

Apache 2
