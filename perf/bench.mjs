import { performance } from 'node:perf_hooks';
import { DataFactory, Parser, Writer } from '../dist/index.mjs';

const count = Number(process.argv[2] ?? 100_000);
const { namedNode, literal, quad } = DataFactory;
const quads = Array.from({ length: count }, (_, index) => quad(
  namedNode(`https://example.org/s/${index}`),
  namedNode('https://example.org/p'),
  literal(String(index)),
));

const encodeStart = performance.now();
const writer = new Writer();
writer.addQuads(quads);
const bytes = await new Promise((resolve, reject) => writer.end((error, output) => error ? reject(error) : resolve(output)));
const encodeMs = performance.now() - encodeStart;

const decodeStart = performance.now();
const output = new Parser().parse(bytes);
const decodeMs = performance.now() - decodeStart;

console.log(JSON.stringify({
  statements: output.length,
  bytes: bytes.byteLength,
  bytesPerStatement: bytes.byteLength / count,
  encodeStatementsPerSecond: count / (encodeMs / 1000),
  decodeStatementsPerSecond: count / (decodeMs / 1000),
}, null, 2));
