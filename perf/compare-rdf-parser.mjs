import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { DataFactory, Parser as JellyParser, PhysicalStreamType, Writer } from '../dist/index.mjs';

const count = Number(process.argv[2] ?? 100_000);
const runs = Number(process.argv[3] ?? 7);
const rdfParserEntry = resolve(process.env.RDF_PARSER_TS_PATH ?? '../rdf-parser.ts/dist/index.mjs');
const { Parser: TextParser } = await import(pathToFileURL(rdfParserEntry).href);
const { namedNode, literal, quad } = DataFactory;

const quads = Array.from({ length: count }, (_, index) => quad(
  namedNode(`https://example.org/s/${index}`),
  namedNode('https://example.org/p'),
  literal(String(index)),
));
const ntriples = quads.map((_, index) =>
  `<https://example.org/s/${index}> <https://example.org/p> "${index}" .\n`).join('');

const writer = new Writer({ physicalType: PhysicalStreamType.TRIPLES });
writer.addQuads(quads);
const jelly = await new Promise((resolveBytes, reject) => writer.end((error, output) =>
  error ? reject(error) : resolveBytes(output)));
const jellyGzip = gzipSync(jelly);
const ntriplesGzip = gzipSync(ntriples);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(operation, expectedCount) {
  for (let index = 0; index < 2; index++) operation();
  const samples = [];
  for (let index = 0; index < runs; index++) {
    globalThis.gc?.();
    const start = performance.now();
    const output = operation();
    const elapsed = performance.now() - start;
    if (output.length !== expectedCount) throw new Error(`Expected ${expectedCount} statements, got ${output.length}`);
    samples.push(elapsed);
  }
  const milliseconds = median(samples);
  return { milliseconds, statementsPerSecond: count / (milliseconds / 1000), samples };
}

const jellyResult = measure(() => new JellyParser().parse(jelly), count);
const textResult = measure(() => new TextParser({ format: 'N-Triples' }).parse(ntriples), count);
const jellyGzipResult = measure(() => new JellyParser().parse(gunzipSync(jellyGzip)), count);
const textGzipResult = measure(() => new TextParser({ format: 'N-Triples' }).parse(gunzipSync(ntriplesGzip).toString()), count);
const result = {
  statements: count,
  runs,
  input: {
    jellyBytes: jelly.byteLength,
    ntriplesBytes: Buffer.byteLength(ntriples),
    jellyGzipBytes: jellyGzip.byteLength,
    ntriplesGzipBytes: ntriplesGzip.byteLength,
  },
  rdfjsJelly: jellyResult,
  rdfParserTs: textResult,
  rdfjsJellyGzip: jellyGzipResult,
  rdfParserTsGzip: textGzipResult,
  speedup: jellyResult.statementsPerSecond / textResult.statementsPerSecond,
  gzipSpeedup: jellyGzipResult.statementsPerSecond / textGzipResult.statementsPerSecond,
};

console.log(JSON.stringify(result, null, 2));
console.log('\n| Parser | Format | Input size | Median | Throughput |');
console.log('| --- | --- | ---: | ---: | ---: |');
console.log(`| rdfjs-jelly | Jelly | ${jelly.byteLength} B | ${jellyResult.milliseconds.toFixed(1)} ms | ${(jellyResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser.ts | N-Triples | ${Buffer.byteLength(ntriples)} B | ${textResult.milliseconds.toFixed(1)} ms | ${(textResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdfjs-jelly | Jelly + gzip | ${jellyGzip.byteLength} B | ${jellyGzipResult.milliseconds.toFixed(1)} ms | ${(jellyGzipResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser.ts | N-Triples + gzip | ${ntriplesGzip.byteLength} B | ${textGzipResult.milliseconds.toFixed(1)} ms | ${(textGzipResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
