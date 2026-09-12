import { performance } from 'node:perf_hooks';
import {
  brotliCompressSync, brotliDecompressSync, gzipSync, gunzipSync, zstdCompressSync, zstdDecompressSync,
} from 'node:zlib';
import { DataFactory, Parser as JellyParser, PhysicalStreamType, Writer as JellyWriter } from '../dist/index.mjs';
import { loadRdfParserTs } from './rdf-parser-ts.mjs';

const count = Number(process.argv[2] ?? 100_000);
const runs = Number(process.argv[3] ?? 7);
const { Parser: TextParser, Writer: TextWriter } = await loadRdfParserTs();
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
const CODECS = [
  { name: '', compress: input => input, decompress: input => input },
  { name: ' + gzip', compress: gzipSync, decompress: gunzipSync },
  { name: ' + zstd', compress: zstdCompressSync, decompress: zstdDecompressSync },
  { name: ' + Brotli', compress: brotliCompressSync, decompress: brotliDecompressSync },
];
const encoded = CODECS.map(codec => ({
  codec,
  jelly: codec.compress(jelly),
  ntriples: codec.compress(Buffer.from(ntriples)),
}));

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

const parsingCases = [];
for (const entry of encoded) {
  parsingCases.push({
    name: `rdfjs-jelly|Jelly${entry.codec.name}`,
    bytes: entry.jelly.byteLength,
    operation: () => new JellyParser().parse(entry.codec.decompress(entry.jelly)),
    verify: verifyStatements,
  });
  parsingCases.push({
    name: `rdf-parser-ts|N-Triples${entry.codec.name}`,
    bytes: entry.ntriples.byteLength,
    operation: () => new TextParser({ format: 'N-Triples' }).parse(entry.codec.decompress(entry.ntriples).toString()),
    verify: verifyStatements,
  });
}
// Full ordered validation before timing, rather than statement counts alone.
for (const testCase of parsingCases) {
  const output = testCase.operation();
  verifyStatements(output);
  for (let i = 0; i < count; i++) {
    if (!output[i].equals(quads[i])) throw new Error(`${testCase.name}: statement mismatch at ${i}`);
  }
}
const parsing = measureSuite(parsingCases);
const writing = measureSuite([
  { name: 'rdfjsJelly', operation: writeJelly, verify: verifyJelly },
  { name: 'rdfParserTs', operation: writeNTriples, verify: verifyNTriples },
]);
const { rdfjsJelly: jellyWriteResult, rdfParserTs: textWriteResult } = writing;
const result = {
  statements: count,
  runs,
  input: Object.fromEntries(parsingCases.map(testCase => [testCase.name, testCase.bytes])),
  parsing,
  writing,
};

console.log(JSON.stringify(result, null, 2));
console.log('\nParsing');
console.log('| Parser | Format | Input size | Median | Throughput |');
console.log('| --- | --- | ---: | ---: | ---: |');
for (const testCase of parsingCases) {
  const [parser, format] = testCase.name.split('|');
  const measured = parsing[testCase.name];
  console.log(`| ${parser} | ${format} | ${testCase.bytes} B | ${measured.milliseconds.toFixed(1)} ms | ${(measured.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
}
console.log('\nWriting');
console.log('| Writer | Format | Output size | Median | Throughput |');
console.log('| --- | --- | ---: | ---: | ---: |');
console.log(`| rdfjs-jelly | Jelly | ${jelly.byteLength} B | ${jellyWriteResult.milliseconds.toFixed(1)} ms | ${(jellyWriteResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
console.log(`| rdf-parser-ts | N-Triples | ${Buffer.byteLength(ntriples)} B | ${textWriteResult.milliseconds.toFixed(1)} ms | ${(textWriteResult.statementsPerSecond / 1e6).toFixed(2)} M statements/s |`);
