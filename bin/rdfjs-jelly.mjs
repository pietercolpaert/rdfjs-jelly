#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'node:fs';
import { basename } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { constants, createGunzip, createZstdCompress, createZstdDecompress } from 'node:zlib';
import { IncrementalParser as RdfTextIncrementalParser, isMessageQuad as isRdfTextMessageQuad } from 'rdf-parser-ts';
import { Parser, Writer } from '../dist/index.mjs';

const HELP = `Usage:
  rdfjs-jelly inspect <URL|file|->
  rdfjs-jelly convert <URL|file|-> [--output <file>]

Aliases:
  read                    Alias for inspect

Input may be plain, gzip-compressed, or zstd-compressed. A dash reads stdin.
Inspect writes RDF Messages as N-Quads to stdout. Convert writes a
zstd-compressed Jelly v2 file.`;

async function main(args) {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(HELP);
    return;
  }

  const operation = args.shift();
  if (operation !== 'inspect' && operation !== 'read' && operation !== 'convert') {
    throw new Error(`Unknown operation: ${operation}\n\n${HELP}`);
  }

  const { input, output } = parseArguments(args, operation === 'convert');
  const source = await openInput(input);
  const decoded = await decompress(source.body);

  if (operation === 'convert') {
    const outputPath = output ?? outputFilename(source.name);
    const converter = new MessageLogToJelly();
    const compressor = createZstdCompress({ params: { [constants.ZSTD_c_compressionLevel]: 3 } });
    await pipeline(decoded, converter, compressor, createWriteStream(outputPath));
    console.error(`Saved ${outputPath} (${converter.messageCount.toLocaleString()} messages, ${converter.quadCount.toLocaleString()} quads).`);
    return;
  }

  const bytes = await collect(decoded);
  const messages = new Parser().parseMessages(bytes);
  for (const message of messages) {
    console.log(`# RDF Message ${message.messageCounter}`);
    for (const [key, value] of message.metadata) console.log(`# ${key}: ${formatBytes(value)}`);
    for (const quad of message) console.log(formatQuad(quad));
    console.log();
  }
}

function parseArguments(args, allowOutput) {
  let input;
  let output;
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--output' || argument === '-o') {
      if (!allowOutput) throw new Error(`${argument} is only valid for convert.`);
      output = args[++index];
      if (!output) throw new Error(`${argument} requires a file path.`);
    } else if (argument.startsWith('-') && argument !== '-') {
      throw new Error(`Unknown option: ${argument}`);
    } else if (input === undefined) input = argument;
    else throw new Error(`Unexpected argument: ${argument}`);
  }
  if (input === undefined) throw new Error(`An input URL, file path, or - is required.\n\n${HELP}`);
  return { input, output };
}

async function openInput(input) {
  if (input === '-') return { body: process.stdin, name: 'messages' };
  if (/^https?:\/\//i.test(input)) {
    const response = await fetch(input);
    if (!response.ok) throw new Error(`Fetch failed with HTTP ${response.status}.`);
    if (!response.body) throw new Error('The HTTP response does not expose a readable body.');
    const name = new URL(input).pathname.split('/').filter(Boolean).at(-1) || 'stream';
    return { body: Readable.fromWeb(response.body), name };
  }
  if (/^file:\/\//i.test(input)) {
    return { body: createReadStream(new URL(input)), name: basename(new URL(input).pathname) };
  }
  return { body: createReadStream(input), name: basename(input) };
}

async function collect(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return new Uint8Array(Buffer.concat(chunks));
}

async function decompress(body) {
  const { prefix, replay } = await peek(body, 4);
  if (prefix[0] === 0x1f && prefix[1] === 0x8b) return replay.pipe(createGunzip());
  if (isZstd(prefix)) return replay.pipe(createZstdDecompress());
  return replay;
}

async function peek(body, size) {
  const iterator = body[Symbol.asyncIterator]();
  const chunks = [];
  let byteLength = 0;
  while (byteLength < size) {
    const result = await iterator.next();
    if (result.done) break;
    const chunk = Buffer.isBuffer(result.value) ? result.value : Buffer.from(result.value);
    chunks.push(chunk);
    byteLength += chunk.byteLength;
  }
  const prefix = Buffer.concat(chunks, byteLength).subarray(0, size);
  const replay = Readable.from((async function* () {
    try {
      yield* chunks;
      while (true) {
        const result = await iterator.next();
        if (result.done) return;
        yield result.value;
      }
    } finally {
      await iterator.return?.();
    }
  })());
  return { prefix, replay };
}

function isZstd(bytes) {
  const standard = bytes[0] === 0x28 && bytes[1] === 0xb5 && bytes[2] === 0x2f && bytes[3] === 0xfd;
  const skippable = (bytes[0] & 0xf0) === 0x50 && bytes[1] === 0x2a && bytes[2] === 0x4d && bytes[3] === 0x18;
  return standard || skippable;
}

class MessageLogToJelly extends Transform {
  parser = new RdfTextIncrementalParser({ rdfMessages: true });
  decoder = new TextDecoder('utf-8', { fatal: true });
  writer;
  messageCount = 0;
  quadCount = 0;

  constructor() {
    super({ readableObjectMode: false, writableObjectMode: false });
    this.writer = new Writer({
      write: chunk => this.push(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)),
      end: callback => callback?.(null),
    }, { version: 2 });
  }

  _transform(chunk, encoding, callback) {
    try {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
      this.addItems(this.parser.write(this.decoder.decode(bytes, { stream: true })));
      this.writer.finishMessages(this.parser.parserState.messageCounter);
      this.parser.parserState.namedNodeCache.clear();
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  _flush(callback) {
    try {
      this.addItems(this.parser.end(this.decoder.decode()));
      this.parser.parserState.namedNodeCache.clear();
      this.messageCount = this.parser.parserState.messageCountHint;
      this.writer.finishMessages(this.messageCount);
      this.writer.end(error => callback(error ?? undefined));
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  addItems(items) {
    for (const item of items) {
      if (!isRdfTextMessageQuad(item)) throw new Error('The RDF text parser did not enable RDF Messages mode.');
      this.writer.addQuad(item);
      this.quadCount++;
    }
  }
}

function outputFilename(inputName) {
  const base = inputName.replace(/\.(?:gz|zst|zstd)$/i, '').replace(/\.(?:ttl|trig|nt|nq|rdf|log)$/i, '') || 'messages';
  return `${base}.jelly.zst`;
}

function formatQuad(quad) {
  const graph = quad.graph.termType === 'DefaultGraph' ? '' : ` ${formatTerm(quad.graph)}`;
  return `${formatTerm(quad.subject)} ${formatTerm(quad.predicate)} ${formatTerm(quad.object)}${graph} .`;
}

function formatTerm(term) {
  if (term.termType === 'NamedNode') return `<${term.value.replaceAll('\\', '\\\\').replaceAll('>', '\\>')}>`;
  if (term.termType === 'BlankNode') return `_:${term.value}`;
  if (term.termType === 'DefaultGraph') return '';
  if (term.termType === 'Literal') {
    const value = JSON.stringify(term.value);
    if (term.language) return `${value}@${term.language}`;
    if (term.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') return value;
    return `${value}^^<${term.datatype.value}>`;
  }
  return `<< ${formatQuad(term)} >>`;
}

function formatBytes(value) {
  const preview = [...value.subarray(0, 24)].map(byte => byte.toString(16).padStart(2, '0')).join(' ');
  return `${value.byteLength.toLocaleString()} B${preview ? ` [${preview}${value.byteLength > 24 ? ' …' : ''}]` : ''}`;
}

main(process.argv.slice(2)).catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
