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

## Development

```sh
npm install
npm run lint
npm test
npm run build
npm run check
```

The checked-in schema is Jelly-RDF `rdf.proto` 1.1.1. Tests include pinned official Jelly conformance fixtures and pyjelly-compatible version-2 writer behavior.

## License

MIT
