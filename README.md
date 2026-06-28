# rdfjs-jelly

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

## Compression

Transport compression is intentionally separate from Jelly framing. Compose the Node streams with `createGzip()`/`createGunzip()`, or browser streams with `CompressionStream`/`DecompressionStream`.

## Performance

These are local microbenchmarks, not universal rankings. They measure 100,000
generated RDF triples with unique subjects and literals and one repeated
predicate. Each result is the median of seven measured runs after two warm-up
runs. Parsing includes constructing the result RDF objects; serialization starts
with already constructed objects. Gzip rows include synchronous decompression
and use Node.js's default gzip level; compression itself is performed before the
timed section.

Snapshot recorded on 2026-06-28 with Node.js 25.9.0 and Python 3.12 on Linux,
using an Intel Core i7-1265U and 30 GiB RAM.

### Compared with rdf-parser.ts

This compares equivalent RDF data, but not identical input formats:
`rdfjs-jelly` parses Jelly while `rdf-parser.ts` 0.2.6 (`ce8846b`) parses
N-Triples. It therefore reflects the end-user format choice as well as parser
implementation performance.

| Parser | Format | Input size | Median | Throughput |
| --- | --- | ---: | ---: | ---: |
| rdfjs-jelly | Jelly | 2,579,568 B | 134.7 ms | 0.74 M statements/s |
| rdf-parser.ts | N-Triples | 6,377,780 B | 37.7 ms | 2.65 M statements/s |
| rdfjs-jelly | Jelly + gzip | 496,581 B | 133.3 ms | 0.75 M statements/s |
| rdf-parser.ts | N-Triples + gzip | 490,694 B | 45.9 ms | 2.18 M statements/s |

For this dataset, `rdf-parser.ts` parsed uncompressed N-Triples about 3.6 times
faster and gzipped N-Triples about 2.9 times faster, including decompression.
Uncompressed Jelly was about 60% smaller (2.47 times less data). After gzip,
the highly repetitive N-Triples input was about 1.2% smaller than Jelly. This
compressed-size result is dataset-dependent and should not be extrapolated to
less repetitive RDF.

Reproduce it from this repository, with `../rdf-parser.ts` built:

```sh
npm run perf:compare:rdf-parser -- 100000 7
```

Set `RDF_PARSER_TS_PATH` to compare against a different build.

## Development

```sh
npm install
npm run lint
npm test
npm run build
npm run check
npm run proto:generate
```

The checked-in schema is Jelly-RDF `rdf.proto` 1.1.1. Its TypeScript message
types and schema descriptors are generated with Protobuf-ES and Buf. The
Protobuf-ES runtime handles both protobuf wire encoding and size-delimited
message framing; `src/generated/rdf_pb.ts` only maps between those generated
messages and the codec's internal model.

Tests include pinned official Jelly conformance fixtures and pyjelly-compatible
version-2 writer behavior.

## License

Apache 2
