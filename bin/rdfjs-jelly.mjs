#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { Zstd } from '@hpcc-js/wasm-zstd';
import { Parser as RdfTextParser } from 'rdf-parser-ts';
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
  const source = await readInput(input);
  const bytes = await decompress(source.bytes);

  if (operation === 'convert') {
    const result = convertMessageLog(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    const compressed = (await Zstd.load()).compress(result.jelly, 3);
    const outputPath = output ?? outputFilename(source.name);
    await writeFile(outputPath, compressed);
    console.error(`Saved ${outputPath} (${result.messageCount.toLocaleString()} messages, ${result.quadCount.toLocaleString()} quads).`);
    return;
  }

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

async function readInput(input) {
  if (input === '-') return { bytes: await readStdin(), name: 'messages' };
  if (/^https?:\/\//i.test(input)) {
    const response = await fetch(input);
    if (!response.ok) throw new Error(`Fetch failed with HTTP ${response.status}.`);
    const name = new URL(input).pathname.split('/').filter(Boolean).at(-1) || 'stream';
    return { bytes: new Uint8Array(await response.arrayBuffer()), name };
  }
  if (/^file:\/\//i.test(input)) {
    return { bytes: new Uint8Array(await readFile(new URL(input))), name: basename(new URL(input).pathname) };
  }
  return { bytes: new Uint8Array(await readFile(input)), name: basename(input) };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return new Uint8Array(Buffer.concat(chunks));
}

async function decompress(bytes) {
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) return new Uint8Array(gunzipSync(bytes));
  if (isZstd(bytes)) return (await Zstd.load()).decompress(bytes);
  return bytes;
}

function isZstd(bytes) {
  const standard = bytes[0] === 0x28 && bytes[1] === 0xb5 && bytes[2] === 0x2f && bytes[3] === 0xfd;
  const skippable = (bytes[0] & 0xf0) === 0x50 && bytes[1] === 0x2a && bytes[2] === 0x4d && bytes[3] === 0x18;
  return standard || skippable;
}

function convertMessageLog(input) {
  const messages = new RdfTextParser({ rdfMessages: true }).parseMessages(input);
  const writer = new Writer({ version: 2 });
  let quadCount = 0;
  for (const message of messages) {
    quadCount += message.length;
    writer.addMessage(message);
  }
  let jelly;
  let failure;
  writer.end((error, output) => {
    failure = error ?? undefined;
    jelly = output;
  });
  if (failure) throw failure;
  if (!jelly) throw new Error('The Jelly writer did not produce output.');
  return { jelly, messageCount: messages.length, quadCount };
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
