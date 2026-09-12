// Message-based parsing: Jelly against the RDF 1.2 Message Stream Log text
// formats that rdf-parser-ts reads. Every case parses the same RDF data in
// message mode, so message boundaries are preserved on both sides.
//
//   npm run build && node perf/compare-message-formats.mjs [rounds]
//
// Each case runs in its own child process. Sharing one process is not viable
// here: the text cases allocate 28-47 MB strings, and co-residency alone made
// the Jelly case measure nearly twice its isolated cost. Cross-process drift on
// this hardware is a few percent, far below the differences being reported.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { cpus } from 'node:os';
import { performance } from 'node:perf_hooks';
import { brotliCompressSync, brotliDecompressSync, gzipSync, gunzipSync, zstdCompressSync, zstdDecompressSync } from 'node:zlib';
import { LogicalStreamType, Parser as JellyParser, Writer as JellyWriter } from '../dist/index.mjs';
import { loadRdfParserTs } from './rdf-parser-ts.mjs';
import { describeMessages, verifyMessageOutput } from './message-workload.mjs';

const { Parser: TextParser, Writer: TextWriter } = await loadRdfParserTs();

// The source declares SUBJECT_GRAPHS and already carries 10,000 messages.
// Preserve their boundaries; arbitrary batching split 1,186 blank-node identities.
const messages = new JellyParser().parseMessages(gunzipSync(readFileSync(new URL('../example/osm-dk-10k.jelly.gz', import.meta.url))));
const workload = describeMessages(messages);

function writeJelly() {
  // Each source graph becomes a dataset with that graph as its default graph.
  const writer = new JellyWriter({ logicalType: LogicalStreamType.DATASETS });
  for (const message of messages) writer.addMessage(message);
  let bytes;
  writer.end((error, output) => {
    if (error) throw error;
    bytes = output;
  });
  return bytes;
}

function writeText(format) {
  const writer = new TextWriter({ format, messages: true });
  for (const message of messages) writer.addMessage(message);
  let text;
  writer.end((error, output) => {
    if (error) throw error;
    text = output;
  });
  return Buffer.from(text);
}

const encode = {
  Jelly: writeJelly,
  'N-Quads': () => writeText('N-Quads'),
  TriG: () => writeText('TriG'),
};

const CODECS = {
  none: { compress: input => input, decompress: input => Buffer.from(input) },
  gzip: { compress: gzipSync, decompress: gunzipSync },
  zstd: { compress: zstdCompressSync, decompress: zstdDecompressSync },
  brotli: { compress: brotliCompressSync, decompress: brotliDecompressSync },
};

const CASES = [];
for (const format of ['Jelly', 'N-Quads', 'TriG']) {
  for (const codec of ['none', 'gzip', 'zstd', 'brotli']) {
    CASES.push({ name: codec === 'none' ? format : `${format} + ${codec}`, format, codec });
  }
}

// Every case receives a freshly allocated input buffer inside the timed region.
// Decompression inherently produces one, so reusing a long-lived buffer for the
// uncompressed cases would credit them with allocation work a real reader still
// has to do, and on the 28 MB TriG input that difference alone is ~450 ms.
function parserFor(format, codec) {
  const decode = CODECS[codec].decompress;
  if (format === 'Jelly') return input => new JellyParser({ messages: true }).parse(decode(input));
  return input => new TextParser({ format, messages: true }).parse(decode(input).toString('utf8'));
}

function runCase(name, rounds) {
  const testCase = CASES.find(entry => entry.name === name);
  assert.ok(testCase, `unknown case ${name}`);
  const plain = encode[testCase.format]();
  const bytes = CODECS[testCase.codec].compress(plain);
  const parse = parserFor(testCase.format, testCase.codec);

  const verified = verifyMessageOutput(messages, parse(bytes));
  assert.deepEqual(verified, { statements: workload.statements, messages: workload.messages, blankNodes: workload.blankNodes });

  const samples = [];
  for (let round = 0; round < rounds + 1; round++) {
    globalThis.gc?.();
    globalThis.gc?.();
    const start = performance.now();
    const output = parse(bytes);
    const elapsed = performance.now() - start;
    assert.equal(output.length, workload.statements);
    if (round > 0) samples.push(elapsed);
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const medianMs = sorted[Math.floor(sorted.length / 2)];
  return {
    name,
    format: testCase.format,
    codec: testCase.codec,
    bytes: bytes.byteLength,
    medianMs: Number(medianMs.toFixed(2)),
    minMs: Number(sorted[0].toFixed(2)),
    statementsPerSecond: Math.round(workload.statements / (medianMs / 1000)),
    samplesMs: samples,
    verified,
  };
}

const requested = process.argv[3];
if (requested) {
  console.log(JSON.stringify(runCase(requested, Number(process.argv[2] ?? 11))));
} else {
  const rounds = Number(process.argv[2] ?? 11);
  const cases = [];
  for (const testCase of CASES) {
    const stdout = execFileSync(process.execPath,
      ['--expose-gc', new URL(import.meta.url).pathname, String(rounds), testCase.name],
      { encoding: 'utf8', maxBuffer: 1 << 24 });
    cases.push(JSON.parse(stdout));
    process.stderr.write(`Verified and measured ${testCase.name}\n`);
  }
  console.log(JSON.stringify({
    node: process.version,
    cpu: cpus()[0].model,
    rounds,
    ...workload,
    boundaries: 'original source frames (SUBJECT_GRAPHS); no source blank node crosses a boundary',
    verification: 'every ordered term and message counter; bijective blank-node renaming per message',
    isolation: 'one child process per case',
    cases,
  }, null, 2));
}
