import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { brotliCompressSync, brotliDecompressSync, gzipSync, gunzipSync } from 'node:zlib';
import { DataFactory, Parser as JellyParser, PhysicalStreamType, Writer as JellyWriter } from '../dist/index.mjs';

const count = Number(process.argv[2] ?? 100_000);
const runs = Number(process.argv[3] ?? 7);
const rdfParserEntry = resolve(process.env.RDF_PARSER_TS_PATH ?? '../rdf-parser.ts/dist/index.mjs');
const { Parser: TextParser, Writer: TextWriter } = await import(pathToFileURL(rdfParserEntry).href);
const { namedNode, literal, quad } = DataFactory;

const quads = Array.from({ length: count }, (_, index) => quad(
  namedNode(`https://example.org/s/${index}`),
  namedNode('https://example.org/p'),
  literal(String(index)),
));
function writeJelly() {
  const writer = new JellyWriter({ physicalType: PhysicalStreamType.TRIPLES });
  writer.addQuads(quads);
  let error;
  let output;
  writer.end((actualError, actualOutput) => { error = actualError; output = actualOutput; });
  if (error) throw error;
  if (!output) throw new Error('Jelly writer did not produce output');
  return output;
}

function writeNTriples() {
  const writer = new TextWriter({ format: 'N-Triples' });
  writer.addQuads(quads);
  let error;
  let output;
  writer.end((actualError, actualOutput) => { error = actualError; output = actualOutput; });
  if (error) throw error;
  if (output === undefined) throw new Error('N-Triples writer did not produce output');
  return output;
}

const jelly = writeJelly();
const ntriples = writeNTriples();
const jellyGzip = gzipSync(jelly);
const ntriplesGzip = gzipSync(ntriples);
const jellyBrotli = brotliCompressSync(jelly);
const ntriplesBrotli = brotliCompressSync(ntriples);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measureSuite(cases) {
  const samples = Object.fromEntries(cases.map(testCase => [testCase.name, []]));
  for (let warmup = 0; warmup < 2; warmup++) {
    for (const testCase of cases) testCase.verify(testCase.operation());
  }
  for (let round = 0; round < runs; round++) {
    const order = round % 2 === 0 ? cases : [...cases].reverse();
    const offset = round % cases.length;
    for (let index = 0; index < order.length; index++) {
      const testCase = order[(index + offset) % order.length];
      globalThis.gc?.();
      const start = performance.now();
      const output = testCase.operation();
      const elapsed = performance.now() - start;
      testCase.verify(output);
      samples[testCase.name].push(elapsed);
    }
  }
  return Object.fromEntries(cases.map(testCase => {
    const caseSamples = samples[testCase.name];
    const milliseconds = median(caseSamples);
    return [testCase.name, {
      milliseconds,
      statementsPerSecond: count / (milliseconds / 1000),
      samples: caseSamples,
    }];
  }));
}

const verifyStatements = output => {
  if (output.length !== count) throw new Error(`Expected ${count} statements, got ${output.length}`);
};
const verifyJelly = output => {
  if (output.byteLength !== jelly.byteLength) throw new Error(`Expected ${jelly.byteLength} Jelly bytes, got ${output.byteLength}`);
};
const verifyNTriples = output => {
  if (Buffer.byteLength(output) !== Buffer.byteLength(ntriples)) throw new Error('N-Triples output size mismatch');
};

const parsing = measureSuite([
  { name: 'rdfjsJelly', operation: () => new JellyParser().parse(jelly), verify: verifyStatements },
  { name: 'rdfParserTs', operation: () => new TextParser({ format: 'N-Triples' }).parse(ntriples), verify: verifyStatements },
  { name: 'rdfjsJellyGzip', operation: () => new JellyParser().parse(gunzipSync(jellyGzip)), verify: verifyStatements },
  {
    name: 'rdfParserTsGzip',
    operation: () => new TextParser({ format: 'N-Triples' }).parse(gunzipSync(ntriplesGzip).toString()),
    verify: verifyStatements,
  },
  { name: 'rdfjsJellyBrotli', operation: () => new JellyParser().parse(brotliDecompressSync(jellyBrotli)), verify: verifyStatements },
  {
    name: 'rdfParserTsBrotli',
    operation: () => new TextParser({ format: 'N-Triples' }).parse(brotliDecompressSync(ntriplesBrotli).toString()),
    verify: verifyStatements,
  },
]);
const writing = measureSuite([
  { name: 'rdfjsJelly', operation: writeJelly, verify: verifyJelly },
  { name: 'rdfParserTs', operation: writeNTriples, verify: verifyNTriples },
]);
const { rdfjsJelly: jellyResult, rdfParserTs: textResult, rdfjsJellyGzip: jellyGzipResult,
  rdfParserTsGzip: textGzipResult, rdfjsJellyBrotli: jellyBrotliResult,
  rdfParserTsBrotli: textBrotliResult } = parsing;
const { rdfjsJelly: jellyWriteResult, rdfParserTs: textWriteResult } = writing;
const result = {
  statements: count,
  runs,
  input: {
    jellyBytes: jelly.byteLength,
    ntriplesBytes: Buffer.byteLength(ntriples),
    jellyGzipBytes: jellyGzip.byteLength,
    ntriplesGzipBytes: ntriplesGzip.byteLength,
    jellyBrotliBytes: jellyBrotli.byteLength,
    ntriplesBrotliBytes: ntriplesBrotli.byteLength,
  },
  parsing,
  writing,
};

console.log(JSON.stringify(result, null, 2));
console.log('\nParsing');
console.log('| Parser | Format | Input size | Median | Throughput |');
console.log('| --- | --- | ---: | ---: | ---: |');
console.log(`| rdfjs-jelly | Jelly | ${jelly.byteLength} B | ${jellyResult.milliseconds.toFixed(1)} ms | ${(jellyResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser.ts | N-Triples | ${Buffer.byteLength(ntriples)} B | ${textResult.milliseconds.toFixed(1)} ms | ${(textResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdfjs-jelly | Jelly + gzip | ${jellyGzip.byteLength} B | ${jellyGzipResult.milliseconds.toFixed(1)} ms | ${(jellyGzipResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser.ts | N-Triples + gzip | ${ntriplesGzip.byteLength} B | ${textGzipResult.milliseconds.toFixed(1)} ms | ${(textGzipResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdfjs-jelly | Jelly + Brotli | ${jellyBrotli.byteLength} B | ${jellyBrotliResult.milliseconds.toFixed(1)} ms | ${(jellyBrotliResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser.ts | N-Triples + Brotli | ${ntriplesBrotli.byteLength} B | ${textBrotliResult.milliseconds.toFixed(1)} ms | ${(textBrotliResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log('\nWriting');
console.log('| Writer | Format | Output size | Median | Throughput |');
console.log('| --- | --- | ---: | ---: | ---: |');
console.log(`| rdfjs-jelly | Jelly | ${jelly.byteLength} B | ${jellyWriteResult.milliseconds.toFixed(1)} ms | ${(jellyWriteResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser.ts | N-Triples | ${Buffer.byteLength(ntriples)} B | ${textWriteResult.milliseconds.toFixed(1)} ms | ${(textWriteResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
