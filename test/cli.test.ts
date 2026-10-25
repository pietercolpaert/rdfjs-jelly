import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, gunzipSync, zstdCompressSync, zstdDecompressSync } from 'node:zlib';
import { Parser as TextParser } from 'rdf-parser-ts';
import { DataFactory, MessageDecoder, Parser } from '../src';

const cli = fileURLToPath(new URL('../bin/rdfjs-jelly.mjs', import.meta.url));
const log = 'VERSION "1.2-messages"\n_:sensor <urn:p> "21" .\nMESSAGE\nMESSAGE\n_:sensor <urn:p> "22" .\nMESSAGE\nMESSAGE\n';
let directory: string;
beforeEach(() => { directory = mkdtempSync(join(tmpdir(), 'jelly-cli-test-')); });
afterEach(() => { rmSync(directory, { recursive: true, force: true }); });
function run(args: string[], input?: string | Uint8Array) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: directory, input, timeout: 10000 });
}
function convert(options: string[] = [], text = log): Buffer {
  const result = run(['convert', '-', '--output', '-', ...options], text);
  expect(result.status, result.stderr.toString()).toBe(0);
  expect(result.stderr.toString()).toMatch(/[\d,]+ messages, [\d,]+ quads/);
  return result.stdout;
}
function raw(options: string[] = [], text = log): Buffer {
  return convert(['--compression', 'none', ...options], text);
}

describe('CLI conversion settings', () => {
  it('retains the tag-2 and zstd defaults', () => {
    const bytes = zstdDecompressSync(convert());
    expect(new MessageDecoder().decode(bytes)[0]!.rows[0]).toMatchObject({ case: 'options', value: { version: 2 } });
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([1, 0, 1, 0]);
  });

  it('writes packed tag-3 messages with empty boundaries and separate blank-node scopes', () => {
    const bytes = raw(['--version', '3']);
    const frames = new MessageDecoder().decode(bytes);
    expect(frames).toHaveLength(1);
    expect(frames[0]!.rows[0]).toMatchObject({ case: 'options', value: { version: 3, streamType: 1 } });
    const messages = new Parser().parseMessages(bytes);
    expect(messages.map(m => m.length)).toEqual([1, 0, 1, 0]);
    expect(messages[0]![0]!.subject.equals(messages[2]![0]!.subject)).toBe(false);
  });

  it('disables packing without dropping empty messages', () => {
    const bytes = raw(['--version=3', '--no-pack-messages']);
    expect(new MessageDecoder().decode(bytes)).toHaveLength(4);
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([1, 0, 1, 0]);
  });

  it('honors the statement budget without splitting logical messages', () => {
    const text = '<urn:s> <urn:p> "a", "b", "c" .\nMESSAGE\nMESSAGE\n';
    const bytes = raw(['--version', '3', '--message-size', '1'], text);
    expect(new MessageDecoder().decode(bytes).every(frame => (frame.columns?.rowCount ?? 0) <= 1)).toBe(true);
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([3, 0]);
  });

  it('sets lookup capacities in the options header', () => {
    const bytes = raw(['--version', '3', '--max-names', '128', '--max-prefixes', '0', '--max-datatypes', '1']);
    expect(new MessageDecoder().decode(bytes)[0]!.rows[0]).toMatchObject({ case: 'options', value: {
      maxNameTableSize: 128, maxPrefixTableSize: 0, maxDatatypeTableSize: 1,
    } });
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([1, 0, 1, 0]);
  });

  it('can use batch-local dictionaries', () => {
    const options = ['--version', '3', '--no-pack-messages'];
    const persistent = raw([...options, '--persistent-lookups']);
    const local = raw([...options, '--no-persistent-lookups']);
    const values = (bytes: Uint8Array) => new MessageDecoder().decode(bytes).flatMap(frame => frame.columns?.names?.flatMap(entry => entry.values) ?? []);
    expect(values(local).length).toBeGreaterThan(values(persistent).length);
    expect(new Parser().parseMessages(local).map(m => m.length)).toEqual([1, 0, 1, 0]);
  });

  it.each(['zstd', 'gzip', 'none'])('uses a matching default extension for %s output', compression => {
    writeFileSync(join(directory, 'input.log'), log);
    const result = run(['convert', 'input.log', '--version', '3', '--compression', compression]);
    expect(result.status, result.stderr.toString()).toBe(0);
    const suffix = compression === 'zstd' ? '.zst' : compression === 'gzip' ? '.gz' : '';
    const output = readFileSync(join(directory, 'input.jelly' + suffix));
    const bytes = compression === 'zstd' ? zstdDecompressSync(output) : compression === 'gzip' ? gunzipSync(output) : output;
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([1, 0, 1, 0]);
    expect(run(['inspect', 'input.jelly' + suffix]).status).toBe(0);
  });

  it('accepts an explicit Zstd compression level', () => {
    const bytes = zstdDecompressSync(convert(['--version', '3', '--compression-level', '1']));
    expect(new Parser().parseMessages(bytes).map(m => m.length)).toEqual([1, 0, 1, 0]);
  });

  it('applies gzip compression levels', () => {
    const text = '<urn:s> <urn:p> "' + 'abc'.repeat(2000) + '" .\n';
    const stored = convert(['--compression', 'gzip', '--compression-level', '0'], text);
    const compressed = convert(['--compression', 'gzip', '--compression-level', '9'], text);
    expect(compressed.length).toBeLessThan(stored.length / 2);
    expect(gunzipSync(compressed)).toEqual(gunzipSync(stored));
  });

  it.each(['plain', 'gzip', 'zstd'])('detects %s input compression on stdin', codec => {
    const input = codec === 'gzip' ? gzipSync(log) : codec === 'zstd' ? zstdCompressSync(log) : Buffer.from(log);
    const result = run(['convert', '-', '--version', '3', '-o', '-', '--compression', 'none'], input);
    expect(result.status, result.stderr.toString()).toBe(0);
    expect(new Parser().parseMessages(result.stdout).map(m => m.length)).toEqual([1, 0, 1, 0]);
  });

  it('preserves directional literals and nested triple terms in conversion and inspection', () => {
    const text = 'VERSION "1.2"\n<urn:s> <urn:p> "hello"@en--ltr .\n<urn:s> <urn:q> <<( <urn:a> <urn:b> <<( <urn:c> <urn:d> "مرحبا"@ar--rtl )>> )>> .\n';
    const bytes = raw(['--version', '3'], text);
    const quads = new Parser().parse(bytes);
    const inspected = run(['read', '-'], bytes);
    expect(inspected.status, inspected.stderr.toString()).toBe(0);
    expect(inspected.stdout.toString()).toContain('@en--ltr');
    expect(inspected.stdout.toString()).toContain('@ar--rtl');
    expect(inspected.stdout.toString()).toContain('<<( <urn:a>');
    const reparsed = new TextParser({ factory: DataFactory }).parse(inspected.stdout.toString());
    expect(reparsed).toEqual(quads);
  });

  it('rejects RDF 1.2 terms when writing tag 2', () => {
    const result = run(['convert', '-', '--version', '2', '-o', '-'], 'VERSION "1.2"\n<urn:s> <urn:p> "hello"@en--ltr .\n');
    expect(result.status).toBe(1);
    expect(result.stderr.toString()).toMatch(/Directional language literals/);
  });

  it.each([
    ['--version', '4'], ['--version', '1.2'], ['--message-size', '0'], ['--message-size', '1.5'],
    ['--pack-messages'], ['--no-pack-messages'], ['--persistent-lookups'],
    ['--version', '3', '--max-names', '127'], ['--max-prefixes=-1'],
    ['--compression', 'brotli'], ['--compression', 'none', '--compression-level', '3'],
    ['--compression', 'gzip', '--compression-level', '10'], ['--compression-level', 'fast'],
    ['--unknown-option'], ['--version'],
  ])('rejects invalid conversion settings before opening files: %j', (...options) => {
    const result = run(['convert', 'missing.log', '-o', 'output.jelly', ...options]);
    expect(result.status).toBe(1);
    expect(result.stderr.toString()).not.toMatch(/ENOENT/);
    expect(existsSync(join(directory, 'output.jelly'))).toBe(false);
  });

  it('rejects conversion-only options for inspection', () => {
    const result = run(['inspect', 'missing.jelly', '--version', '3']);
    expect(result.status).toBe(1);
    expect(result.stderr.toString()).toMatch(/only valid for convert/);
  });
});
