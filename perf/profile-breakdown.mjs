import { performance } from 'node:perf_hooks';
import { Reader } from 'protobufjs/minimal.js';
import { eu } from '../src/generated/proto/rdf_pb.mjs';
import {
  DataFactory,
  Decoder,
  MessageDecoder,
  Parser,
  PhysicalStreamType,
  Writer,
} from '../dist/index.mjs';

const count = Number(process.argv[2] ?? 100_000);
const runs = Number(process.argv[3] ?? 7);
const messageSize = Number(process.argv[4] ?? 250);
const { namedNode, literal, quad } = DataFactory;

const quads = Array.from({ length: count }, (_, index) => quad(
  namedNode(`https://example.org/s/${index}`),
  namedNode('https://example.org/p'),
  literal(String(index)),
));
const writer = new Writer({ physicalType: PhysicalStreamType.TRIPLES, messageSize });
writer.addQuads(quads);
const jelly = await new Promise((resolve, reject) => writer.end((error, output) =>
  error ? reject(error) : resolve(output)));
const frames = new MessageDecoder().decode(jelly);
const RdfStreamFrame = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;

function decodeRawProtobuf() {
  const reader = Reader.create(jelly);
  const output = [];
  while (reader.pos < reader.len) output.push(RdfStreamFrame.decode(reader, reader.uint32()));
  return output;
}

function materialize() {
  const decoder = new Decoder();
  const messages = frames.map(frame => decoder.decode(frame));
  decoder.finish();
  return messages;
}

function median(values) {
  return [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
}

function measure(name, operation, outputSize) {
  for (let index = 0; index < 2; index++) operation();
  const samples = [];
  for (let index = 0; index < runs; index++) {
    globalThis.gc?.();
    const start = performance.now();
    const output = operation();
    samples.push(performance.now() - start);
    outputSize(output);
  }
  const milliseconds = median(samples);
  return { name, milliseconds, samples };
}

const results = [
  measure('raw static protobuf', decodeRawProtobuf, output => {
    if (output.length !== frames.length) throw new Error('Frame count mismatch');
  }),
  measure('protobuf and framing', () => new MessageDecoder().decode(jelly), output => {
    if (output.length !== frames.length) throw new Error('Frame count mismatch');
  }),
  measure('RDF/JS materialization', materialize, output => {
    if (output.reduce((sum, message) => sum + message.length, 0) !== count) throw new Error('Quad count mismatch');
  }),
  measure('complete Parser.parse', () => new Parser().parse(jelly), output => {
    if (output.length !== count) throw new Error('Quad count mismatch');
  }),
];

console.log(JSON.stringify({ statements: count, messages: frames.length, bytes: jelly.byteLength, results }, null, 2));
