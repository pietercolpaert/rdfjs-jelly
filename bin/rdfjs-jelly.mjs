#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'node:fs';
import { basename } from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { parseArgs } from 'node:util';
import { constants, createGunzip, createGzip, createZstdCompress, createZstdDecompress } from 'node:zlib';
import { IncrementalParser as RdfTextIncrementalParser, isMessageQuad as isRdfTextMessageQuad } from 'rdf-parser-ts';
import { DataFactory, Parser, RdfStreamType, Writer } from '../dist/index.mjs';

const HELP = `Usage:
  rdfjs-jelly inspect <URL|file|->
  rdfjs-jelly convert <URL|file|-> [options]

Aliases:
  read                            Alias for inspect

Convert options:
  -o, --output <file|->            Output path, or - for stdout (default: derived from input)
  --version <2|3>                 Protocol tag: 2 = Jelly 1.1 (default), 3 = Jelly 1.2
  --message-size <integer>        Rows per 1.1 frame / statements per 1.2 batch (default: 250)
  --[no-]pack-messages            Share batches across 1.2 messages (default: enabled)
  --[no-]persistent-lookups       Retain 1.2 dictionaries across batches (default: enabled)
  --max-names <integer>           Name dictionary capacity (default: 4000)
  --max-prefixes <integer>        Prefix dictionary capacity; 0 disables splitting (default: 150)
  --max-datatypes <integer>       Datatype dictionary capacity (default: 32)
  --compression <zstd|gzip|none>   Output compression (default: zstd)
  --compression-level <integer>   Codec level (default: zstd 3, gzip 6)

Input may be plain, gzip-compressed, or zstd-compressed. A dash reads stdin.
Inspect writes RDF Messages as N-Quads to stdout. Convert writes delimited Jelly;
version 3 preserves RDF 1.2 terms and explicit logical message boundaries.
Packing and persistent-lookup switches require --version 3.`;

async function main(args) {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(HELP);
    return;
  }

  const operation = args.shift();
  if (operation !== 'inspect' && operation !== 'read' && operation !== 'convert') {
    throw new Error(`Unknown operation: ${operation}\n\n${HELP}`);
  }

  const { input, output, writerOptions, compression, compressionLevel } = parseArguments(args, operation === 'convert');
  // Validate writer and compressor settings before opening input or output files.
  const converter = operation === 'convert' ? new MessageLogToJelly(writerOptions) : undefined;
  const compressor = operation === 'convert' ? outputCompression(compression, compressionLevel) : undefined;
  const source = await openInput(input);
  const decoded = await decompress(source.body);

  if (operation === 'convert') {
    const outputPath = output ?? outputFilename(source.name, compression);
    const destination = outputPath === '-' ? process.stdout : createWriteStream(outputPath);
    await pipeline(...[decoded, converter, compressor, destination].filter(Boolean));
    console.error(`Saved ${outputPath === '-' ? 'stdout' : outputPath} (${converter.messageCount.toLocaleString()} messages, ${converter.quadCount.toLocaleString()} quads).`);
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

function parseArguments(args, convert) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    allowNegative: true,
    options: {
      output: { type: 'string', short: 'o' },
      version: { type: 'string' },
      'message-size': { type: 'string' },
      'pack-messages': { type: 'boolean' },
      'persistent-lookups': { type: 'boolean' },
      'max-names': { type: 'string' },
      'max-prefixes': { type: 'string' },
      'max-datatypes': { type: 'string' },
      compression: { type: 'string' },
      'compression-level': { type: 'string' },
    },
  });
  if (!convert && Object.keys(values).length) throw new Error(`--${Object.keys(values)[0]} is only valid for convert.`);
  if (positionals.length !== 1) throw new Error(`Exactly one input URL, file path, or - is required.\n\n${HELP}`);
  if (values.output === '') throw new Error('--output requires a file path or -.');
  const version = integerOption('version', values.version ?? '2');
  if (version !== 2 && version !== 3) throw new Error('--version must be 2 (Jelly 1.1) or 3 (Jelly 1.2).');
  const writerOptions = { version };
  if (version === 3) writerOptions.streamType = RdfStreamType.MESSAGES;
  for (const [option, property] of [['pack-messages', 'packMessages'], ['persistent-lookups', 'persistentLookups']]) {
    if (values[option] === undefined) continue;
    if (version !== 3) throw new Error(`--${option} requires --version 3.`);
    writerOptions[property] = values[option];
  }
  if (values['message-size'] !== undefined) writerOptions.messageSize = integerOption('message-size', values['message-size']);
  const lookup = {};
  for (const [option, property] of [['max-names', 'maxNames'], ['max-prefixes', 'maxPrefixes'], ['max-datatypes', 'maxDatatypes']]) {
    if (values[option] !== undefined) lookup[property] = integerOption(option, values[option]);
  }
  if (Object.keys(lookup).length) writerOptions.lookup = lookup;
  const compression = values.compression ?? 'zstd';
  if (!['zstd', 'gzip', 'none'].includes(compression)) throw new Error('--compression must be zstd, gzip, or none.');
  const compressionLevel = values['compression-level'] === undefined ? undefined : integerOption('compression-level', values['compression-level']);
  if (compression === 'none' && compressionLevel !== undefined) throw new Error('--compression-level requires gzip or zstd compression.');
  return { input: positionals[0], output: values.output, writerOptions, compression, compressionLevel };
}

function integerOption(name, value) {
  if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value))) throw new Error(`--${name} requires an integer.`);
  return Number(value);
}

function outputCompression(codec, level) {
  if (codec === 'none') return undefined;
  if (codec === 'gzip') return createGzip({ level: level ?? 6 });
  return createZstdCompress({ params: { [constants.ZSTD_c_compressionLevel]: level ?? 3 } });
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
  parser = new RdfTextIncrementalParser({ rdfMessages: true, factory: DataFactory });
  decoder = new TextDecoder('utf-8', { fatal: true });
  writer;
  messageCount = 0;
  quadCount = 0;

  constructor(options) {
    super({ readableObjectMode: false, writableObjectMode: false });
    this.writer = new Writer({
      write: chunk => this.push(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)),
      end: callback => callback?.(null),
    }, options);
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

function outputFilename(inputName, compression) {
  const base = inputName.replace(/\.(?:gz|zst|zstd)$/i, '').replace(/\.(?:ttl|trig|nt|nq|rdf|log)$/i, '') || 'messages';
  return `${base}.jelly${compression === 'zstd' ? '.zst' : compression === 'gzip' ? '.gz' : ''}`;
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
    if (term.language) return `${value}@${term.language}${term.direction ? `--${term.direction}` : ''}`;
    if (term.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') return value;
    return `${value}^^<${term.datatype.value}>`;
  }
  return `<<( ${formatTerm(term.subject)} ${formatTerm(term.predicate)} ${formatTerm(term.object)} )>>`;
}

function formatBytes(value) {
  const preview = [...value.subarray(0, 24)].map(byte => byte.toString(16).padStart(2, '0')).join(' ');
  return `${value.byteLength.toLocaleString()} B${preview ? ` [${preview}${value.byteLength > 24 ? ' …' : ''}]` : ''}`;
}

main(process.argv.slice(2)).catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
