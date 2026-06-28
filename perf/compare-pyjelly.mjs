import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';
import { DataFactory, Parser, PhysicalStreamType, Writer } from '../dist/index.mjs';

const count = Number(process.argv[2] ?? 100_000);
const runs = Number(process.argv[3] ?? 7);
const python = process.env.PYJELLY_PYTHON ?? 'python3';
const { namedNode, literal, quad } = DataFactory;
const quads = Array.from({ length: count }, (_, index) => quad(
  namedNode(`https://example.org/s/${index}`),
  namedNode('https://example.org/p'),
  literal(String(index)),
));

function encode() {
  const writer = new Writer({ physicalType: PhysicalStreamType.TRIPLES });
  writer.addQuads(quads);
  let bytes;
  writer.end((error, output) => {
    if (error) throw error;
    bytes = output;
  });
  return bytes;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(operation, outputLength) {
  for (let index = 0; index < 2; index++) operation();
  const samples = [];
  let bytes;
  for (let index = 0; index < runs; index++) {
    globalThis.gc?.();
    const start = performance.now();
    const output = operation();
    samples.push(performance.now() - start);
    if (outputLength(output) !== count) throw new Error('Unexpected statement count');
    if (output instanceof Uint8Array) bytes = output.byteLength;
  }
  const milliseconds = median(samples);
  return { milliseconds, statementsPerSecond: count / (milliseconds / 1000), bytes, samples };
}

const jelly = encode();
const decodeResult = measure(() => new Parser().parse(jelly), output => output.length);
const encodeResult = measure(encode, () => count);

const directory = mkdtempSync(join(tmpdir(), 'rdfjs-jelly-bench-'));
const input = join(directory, 'input.jelly');
writeFileSync(input, jelly);
const processResult = spawnSync(python, [
  resolve('perf/bench_pyjelly.py'),
  '--input', input,
  '--count', String(count),
  '--runs', String(runs),
], { encoding: 'utf8' });
rmSync(directory, { recursive: true, force: true });
if (processResult.status !== 0) {
  throw new Error(`pyjelly benchmark failed:\n${processResult.stderr || processResult.stdout}`);
}
const pyjelly = JSON.parse(processResult.stdout);
const result = {
  statements: count,
  runs,
  sharedDecodeInputBytes: jelly.byteLength,
  rdfjsJelly: { decode: decodeResult, encode: encodeResult },
  pyjelly,
  decodeSpeedup: decodeResult.statementsPerSecond / pyjelly.decode.statementsPerSecond,
  encodeSpeedup: encodeResult.statementsPerSecond / pyjelly.encode.statementsPerSecond,
};
console.log(JSON.stringify(result, null, 2));
console.log('\n| Implementation | Decode | Encode | Encoded size |');
console.log('| --- | ---: | ---: | ---: |');
console.log(`| rdfjs-jelly | ${(decodeResult.statementsPerSecond / 1e6).toFixed(2)} M/s | ${(encodeResult.statementsPerSecond / 1e6).toFixed(2)} M/s | ${encodeResult.bytes} B |`);
console.log(`| pyjelly ${pyjelly.version} | ${(pyjelly.decode.statementsPerSecond / 1e6).toFixed(2)} M/s | ${(pyjelly.encode.statementsPerSecond / 1e6).toFixed(2)} M/s | ${pyjelly.encode.bytes} B |`);

