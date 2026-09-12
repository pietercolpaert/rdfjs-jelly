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

One Jelly `RdfStreamFrame` is exposed as one `Message`. `Message` extends `Array<RDF.Quad>` and carries `messageCounter` and binary `metadata`.

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

On the 300,656-statement dataset measured below, zstd is the best trade of the
three for Jelly: 2.71 MB against gzip's 2.82 MB, and 8 ms cheaper to decompress.
Brotli is 36% smaller again at 1.73 MB but the slowest to decompress, costing
Jelly 26% in end-to-end parse time against 12% for zstd. Pick on wire size and
CPU budget; none of the three changes which format parses fastest.

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
compressed; compression itself happens before the timed section. Every case is
verified to reproduce the source statements, in order, before it is timed.

### Message-based parsing, compared with rdf-parser-ts

The same 300,656 real statements (the bundled `example/osm-dk-10k.jelly.gz`
OpenStreetMap extract) split into 1,203 messages of 250 statements, parsed in
message mode on both sides so message boundaries are preserved. `rdfjs-jelly`
reads Jelly; `rdf-parser-ts` reads the N-Quads and TriG serialisations of the RDF
1.2 Message Stream Log. This reflects the format choice as much as the parser
implementation.

```
Parsing speed - thousand statements per second (higher is better)

Jelly             ████████████████████████████████████████████  2640
Jelly + gzip      █████████████████████████████████████         2234
Jelly + zstd      ███████████████████████████████████████       2366
Jelly + Brotli    ███████████████████████████████████           2095
N-Quads           █████████████████                             1018
N-Quads + gzip    ████████████████                               933
N-Quads + zstd    ███████████████                                924
N-Quads + Brotli  ███████████████                                894
TriG              █████                                          282
TriG + gzip       █████                                          275
TriG + zstd       █████                                          276
TriG + Brotli     █████                                          276
```

```
Encoded size - megabytes (lower is better)

N-Quads           ████████████████████████████████████████████  47.27
TriG              ██████████████████████████                    27.87
Jelly             █████████                                     10.13
N-Quads + zstd    ███                                            3.51
N-Quads + gzip    ███                                            3.31
Jelly + gzip      ███                                            2.82
Jelly + zstd      ███                                            2.71
TriG + zstd       ██                                             2.56
TriG + gzip       ██                                             2.45
N-Quads + Brotli  ██                                             2.04
Jelly + Brotli    ██                                             1.73
TriG + Brotli     █                                              1.49
```

Put side by side, the two charts are the whole argument. Compression reorders the
size chart completely and barely moves the speed chart: within each format the
four bars are the same length, while between formats they differ by 9×.

| Format | Size | Median | Throughput | Relative |
| --- | ---: | ---: | ---: | ---: |
| Jelly | 10.13 MB | 114 ms | 2.64 M statements/s | 1.00× |
| Jelly + gzip | 2.82 MB | 135 ms | 2.23 M statements/s | 1.18× |
| Jelly + zstd | 2.71 MB | 127 ms | 2.37 M statements/s | 1.12× |
| Jelly + Brotli | 1.73 MB | 144 ms | 2.09 M statements/s | 1.26× |
| N-Quads | 47.27 MB | 295 ms | 1.02 M statements/s | 2.59× |
| N-Quads + gzip | 3.31 MB | 322 ms | 0.93 M statements/s | 2.83× |
| N-Quads + zstd | 3.51 MB | 325 ms | 0.92 M statements/s | 2.86× |
| N-Quads + Brotli | 2.04 MB | 336 ms | 0.89 M statements/s | 2.95× |
| TriG | 27.87 MB | 1065 ms | 0.28 M statements/s | 9.35× |
| TriG + gzip | 2.45 MB | 1094 ms | 0.27 M statements/s | 9.61× |
| TriG + zstd | 2.56 MB | 1089 ms | 0.28 M statements/s | 9.56× |
| TriG + Brotli | 1.49 MB | 1089 ms | 0.28 M statements/s | 9.56× |

Caveats worth knowing before reusing these numbers. This dataset is entirely in
the default graph, so its N-Quads output is also valid N-Triples and its TriG
output is also valid Turtle; a dataset with many named graphs would shift both
text formats. Each case runs in its own process, because the text cases allocate
28-47 MB strings and co-residency alone inflated the Jelly case by nearly 2×.
Every case is handed a freshly allocated input buffer inside the timed region,
since decompression inherently produces one and reusing a long-lived buffer would
credit the uncompressed cases with allocation work a real reader still performs.

### Why the binary format beats compressed text

Compressed N-Quads is within 18% of compressed Jelly on the wire, and gzipped
TriG is 13% smaller than it. They are still 2.4× and 8.1× slower to parse. The
reason is that **compression removes bytes from the network, not work from the
parser.**

1. **Decompression restores every byte before parsing starts.** A 3.3 MB gzipped
   N-Quads file still becomes 47.3 MB of text that has to be scanned character by
   character. Compression is undone precisely so the parser can see the
   redundancy again. Jelly's compactness instead survives into parsing: what is
   removed from the encoding is never reconstructed.

2. **Redundancy is eliminated at the term level, not the byte level.** Jelly
   keeps prefix, name, and datatype lookup tables, so a repeated IRI travels as
   two varints and resolves to a string the decoder already holds. gzip finds the
   same repetition in the byte stream, but its decompressor must materialise all
   47 MB again, and the parser must then re-tokenise and re-allocate each
   occurrence.

3. **Repeated terms are omitted structurally.** When a statement's subject,
   predicate, object, or graph equals the previous statement's in the same slot,
   Jelly omits it entirely and the decoder reuses the RDF/JS term object it
   already built. A run of statements about one subject carries that subject once
   and allocates it once. Together the two mechanisms mean only **9.5% of the
   779,490 IRI positions in this dataset are ever written out as text**: 53.0%
   are dropped as repeated terms, and 79.7% of what is left resolves against the
   lookup tables. N-Quads spells out all 779,490, and compression does not change
   that — it only makes them cheaper to transmit.

4. **Structure is framed, not inferred.** Protobuf fields are tag-plus-length, so
   the decoder jumps over a term whose slot it does not need and never looks for
   token boundaries. A text parser must find them: quoting, `\u` escapes,
   language tags, datatype suffixes, and, in Turtle-family syntaxes, deciding
   whether `1.` is an integer or the start of a decimal.

5. **Decompression is a small constant; the format is not.** Across all nine
   compressed cases above, decompressing costs between 13 ms and 41 ms. Choosing
   TriG over Jelly costs 950 ms. Compression buys a 3.6-23× reduction on the wire
   and changes parse time by between 2% and 26%, so it cannot rescue a format
   that is expensive to read — and it is not what makes Jelly fast either, since
   uncompressed Jelly is the fastest case in the table.

6. **What remains is object construction, which every format pays.** Garbage
   collection is about 31% of Jelly's own parse time; the rest is materialising
   300,656 RDF/JS quads and their terms, not reading bytes. That floor is shared,
   so a text format pays it *plus* the string and tokenisation work above. It is
   also why Jelly's advantage is much larger on data with repetition than on the
   synthetic workload below.

7. **Message boundaries cost nothing to find.** A Jelly message is a
   length-prefixed frame, so a consumer can split a stream into messages without
   parsing their content. In the text formats the `MESSAGE` and `@message .`
   markers are tokens the parser has to reach in document order.

Point 4 also explains the shape of the table: TriG is 41% smaller than N-Quads
and 3.6× slower to parse. Predicate-object lists, `;` and `,` continuations,
prefixed names, graph blocks, and numeric shorthands buy bytes at the cost of a
much larger grammar. Fewer bytes is not the same as less work — which is exactly
the trade Jelly avoids by being both smaller than N-Quads and faster than either.

### Flat parsing, compared with rdf-parser-ts

A contrasting workload: 100,000 generated triples with unique subjects and
literals and one repeated predicate, parsed flat rather than in message mode.
Unique subjects mean repeated-term omission and the lookup tables have almost
nothing to exploit, which is close to the worst case for Jelly.

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

Parsing is within about 3% across all four transport variants here, with
`rdf-parser-ts` marginally ahead, while uncompressed Jelly is 60% smaller. This
is the honest complement to the message-based table: Jelly's advantage comes from
exploiting repetition, and a dataset engineered to have none reduces it to
parity. Note also how well this workload compresses — zstd takes N-Triples to
41,638 B — which is a property of the synthetic data, not of either format.

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
npm run perf:compare:messages        # message-based Jelly vs N-Quads vs TriG
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
