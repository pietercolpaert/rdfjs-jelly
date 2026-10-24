// Validate our writer bytes using the upstream Python reference decoders.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import protobuf from 'protobufjs';
import { Parser as TextParser } from 'rdf-parser-ts';
import { DataFactory as f, Writer, SparqlWriter, MessageDecoder } from '../dist/index.mjs';

assert.ok(process.argv[2], 'Usage: npm run test:interop -- /path/to/jelly-protobuf-v1.2.0');
const upstream = resolve(process.argv[2]);
const temporary = mkdtempSync(join(tmpdir(), 'jelly-interop-'));
const fixture = name => JSON.parse(readFileSync(new URL(`../test/fixtures/conformance/${name}.json`, import.meta.url), 'utf8'));
const factory = { ...f, literal(value, language) {
  if (typeof language === 'string' && /--(ltr|rtl)$/u.test(language)) {
    const position = language.lastIndexOf('--');
    return f.literal(value, { language: language.slice(0, position), direction: language.slice(position + 2) });
  }
  return f.literal(value, language);
} };
function term(value) {
  if (value.type === 'uri') return f.namedNode(value.value);
  if (value.type === 'bnode') return f.blankNode(value.value);
  if (value.type === 'triple') return f.quad(term(value.value.subject), term(value.value.predicate), term(value.value.object));
  return f.literal(value.value, value['its:dir'] ? { language: value['xml:lang'], direction: value['its:dir'] } : value['xml:lang'] || (value.datatype ? f.namedNode(value.datatype) : undefined));
}
try {
  const rdf = fixture('rdf12-writer').filter(value => value.expected).flatMap(value => {
    const options = new MessageDecoder({ delimited: true }).decode(Buffer.from(value.options, 'base64'))[0].rows[0].value;
    return (options.streamType === 1 ? [false, true] : [false]).map(packMessages => {
      const writer = new Writer({ version: 3, physicalType: options.physicalType, streamType: options.streamType, rdfVersion: options.rdfVersion, lookup: { maxNames: options.maxNameTableSize, maxPrefixes: options.maxPrefixTableSize, maxDatatypes: options.maxDatatypeTableSize }, messageSize: 7, packMessages });
      for (const text of value.input) {
        const quads = new TextParser({ format: 'N-Quads', factory }).parse(text);
        if (options.streamType === 1) writer.addMessage(quads); else writer.addQuads(quads);
      }
      let actual;
      writer.end((error, bytes) => { if (error) throw error; actual = Buffer.from(bytes).toString('base64'); });
      return { name: value.name + (packMessages ? ' (packed)' : ''), actual, expected: value.expected };
    });
  });
  const frame = protobuf.loadSync(fileURLToPath(new URL('../proto/sparql.proto', import.meta.url))).lookupType('eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame');
  const sparql = fixture('sparql-to_jelly').filter(value => value.data).map(value => {
    const options = frame.decodeDelimited(Buffer.from(value.options, 'base64')).options;
    const writer = new SparqlWriter({ streamType: options.streamType, rdfVersion: options.rdfVersion, frameSize: 7, lookup: { maxNames: options.maxNameTableSize, maxPrefixes: options.maxPrefixTableSize, maxDatatypes: options.maxDatatypeTableSize } });
    for (const result of value.results) {
      if ('boolean' in result) writer.addAsk(result.boolean);
      else {
        writer.startSelect(result.head.vars, { links: result.head.link });
        for (const row of result.results.bindings) writer.addBinding(new Map(Object.entries(row).map(([key, value]) => [key, term(value)])));
        writer.endResult();
      }
    }
    return { name: value.name, actual: Buffer.from(writer.end()).toString('base64'), expected: value.data };
  });
  for (const [kind, cases] of [['rdf', rdf], ['sparql', sparql]]) {
    assert.ok(cases.length > 0);
    const output = join(temporary, `${kind}.json`);
    writeFileSync(output, JSON.stringify(cases));
    const child = spawnSync(process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'), [fileURLToPath(new URL('verify-writer-interop.py', import.meta.url)), upstream, kind, output], { stdio: 'inherit', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
    if (child.error) throw child.error;
    assert.equal(child.status, 0, `${kind} reference decoder verification failed`);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
