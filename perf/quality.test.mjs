import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const api = new URL('../dist/index.mjs', import.meta.url).href;
function benchmark(overrides, allowLegacy = false) {
  const directory = mkdtempSync(join(tmpdir(), 'jelly-quality-test-'));
  try {
    const module = join(directory, 'index.mjs');
    writeFileSync(module, `export * from ${JSON.stringify(api)};\n${overrides}`);
    return spawnSync(process.execPath, ['--expose-gc', fileURLToPath(new URL('quality.mjs', import.meta.url))], {
      encoding: 'utf8',
      env: { ...process.env, JELLY_BENCH_MODULE: module, JELLY_BENCH_ALLOW_LEGACY: allowLegacy ? '1' : '0', PERF_QUADS: '20', PERF_SAMPLES: '3', PERF_OUTPUT: '' },
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
const legacy = `
import { Writer as CurrentWriter } from ${JSON.stringify(api)};
export const ColumnEncoder = undefined, SparqlWriter = undefined, SparqlParser = undefined;
export class Writer extends CurrentWriter {
  constructor(options) {
    if (options.version !== 2) throw new Error('Legacy writer only supports version 2');
    super(options);
  }
}`;

test('legacy baseline runs shared workloads and records unsupported features', () => {
  const child = benchmark(legacy, true);
  assert.ifError(child.error);
  assert.equal(child.status, 0, child.stderr);
  const report = JSON.parse(child.stdout);
  assert.deepEqual(Object.keys(report.results), ['rdf-1.1-read', 'rdf-1.1-write']);
  assert.equal(Object.keys(report.skipped).length, 8);
  assert.match(report.skipped['rdf-1.2-read'], /Jelly-RDF 1.2/u);
  assert.match(report.skipped['sparql-read'], /Jelly-SPARQL/u);
});

test('missing features are errors for the current build', () => {
  const child = benchmark(legacy);
  assert.ifError(child.error);
  assert.notEqual(child.status, 0);
  assert.match(child.stderr, /Current build must support Jelly-RDF 1.2/u);
});

test('advertised feature failures are never treated as unsupported baselines', () => {
  const child = benchmark(`export class SparqlWriter { constructor() { throw new Error('Broken SPARQL writer'); } }`, true);
  assert.ifError(child.error);
  assert.notEqual(child.status, 0);
  assert.match(child.stderr, /Broken SPARQL writer/u);
});

test('modern baseline runs every workload without skips', () => {
  const child = benchmark('', true);
  assert.ifError(child.error);
  assert.equal(child.status, 0, child.stderr);
  const report = JSON.parse(child.stdout);
  assert.equal(Object.keys(report.results).length, 10);
  assert.deepEqual(report.skipped, {});
});
