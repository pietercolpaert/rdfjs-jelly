import { performance } from 'node:perf_hooks';
import {
  DataFactory,
  Encoder,
  MessageEncoder,
  PhysicalStreamType,
  Writer,
} from '../dist/index.mjs';

const count = Number(process.argv[2] ?? 100_000);
const runs = Number(process.argv[3] ?? 7);
const { namedNode, literal, quad } = DataFactory;
const quads = Array.from({ length: count }, (_, index) => quad(
  namedNode(`https://example.org/s/${index}`),
  namedNode('https://example.org/p'),
  literal(String(index)),
));
const options = { physicalType: PhysicalStreamType.TRIPLES };

function constructFrames() {
  const encoder = new Encoder(options);
  for (const value of quads) encoder.addQuad(value);
  return encoder.finish();
}

const frames = constructFrames();

function serializeFrames() {
  return new MessageEncoder().encodeAll(frames);
}

function write() {
  const writer = new Writer(options);
  writer.addQuads(quads);
  let error;
  let output;
  writer.end((actualError, actualOutput) => { error = actualError; output = actualOutput; });
  if (error) throw error;
  if (!output) throw new Error('Writer did not produce output');
  return output;
}

function median(values) {
  return [...values].sort((left, right) => left - right)[Math.floor(values.length / 2)];
}

function measure(name, operation, verify) {
  for (let index = 0; index < 2; index++) verify(operation());
  const samples = [];
  for (let index = 0; index < runs; index++) {
    globalThis.gc?.();
    const start = performance.now();
    const output = operation();
    samples.push(performance.now() - start);
    verify(output);
  }
  const milliseconds = median(samples);
  return { name, milliseconds, statementsPerSecond: count / (milliseconds / 1000), samples };
}

const expectedFrames = frames.length;
const expectedBytes = serializeFrames().byteLength;
const results = [
  measure('lookup and frame construction', constructFrames, output => {
    if (output.length !== expectedFrames) throw new Error('Frame count mismatch');
  }),
  measure('protobuf serialization', serializeFrames, output => {
    if (output.byteLength !== expectedBytes) throw new Error('Output size mismatch');
  }),
  measure('complete Writer', write, output => {
    if (output.byteLength !== expectedBytes) throw new Error('Output size mismatch');
  }),
];

console.log(JSON.stringify({ statements: count, frames: expectedFrames, bytes: expectedBytes, results }, null, 2));
