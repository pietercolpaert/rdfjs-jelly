// Small, deterministic workloads for CI. Fixture generation is outside timing.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { Session } from 'node:inspector';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { setImmediate, setTimeout } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.JELLY_BENCH_MODULE;
const api = await import(modulePath ? pathToFileURL(modulePath).href : new URL('../dist/index.mjs', import.meta.url).href);
const { DataFactory: f, Writer, Parser, SparqlWriter, SparqlParser } = api;
// Only a historical baseline may lack features. Do not turn codec failures into
// skips: advertised capabilities must successfully construct and run workloads.
const allowLegacy = process.env.JELLY_BENCH_ALLOW_LEGACY === '1';
const supportsRdf12 = typeof api.ColumnEncoder === 'function';
const supportsSparql = typeof SparqlWriter === 'function' && typeof SparqlParser === 'function';
assert.ok(allowLegacy || supportsRdf12, 'Current build must support Jelly-RDF 1.2');
assert.ok(allowLegacy || supportsSparql, 'Current build must support Jelly-SPARQL');
const count = Number(process.env.PERF_QUADS ?? 10000);
const samples = Number(process.env.PERF_SAMPLES ?? 5);
assert.ok(Number.isInteger(count) && count > 0);
assert.ok(Number.isInteger(samples) && samples >= 3);
assert.ok(globalThis.gc, 'Run with --expose-gc');
const quads = Array.from({ length: count }, (_, i) => f.quad(f.namedNode(`urn:s${i}`), f.namedNode(`urn:p${i % 17}`), i % 2 ? f.literal(`value-${i}`) : f.blankNode(`b${i}`)));
function rdfWrite(version, messageSize, lookup) {
  const writer = new Writer({ version, messageSize, lookup });
  writer.addQuads(quads);
  let output;
  writer.end((error, bytes) => { if (error) throw error; output = bytes; });
  return output;
}
function sparqlWrite(frameSize, lookup) {
  const writer = new SparqlWriter({ frameSize, lookup });
  writer.startSelect(['s', 'o']);
  for (const quad of quads) writer.addBinding({ s: quad.subject, o: quad.object });
  return writer.end();
}
function messageWrite() {
  const writer = new Writer({ version: 3, streamType: 1 });
  for (let i = 0; i < quads.length; i += 7) writer.addMessage(quads.slice(i, i + 7));
  let output;
  writer.end((error, bytes) => { if (error) throw error; output = bytes; });
  return output;
}
const rdf2 = rdfWrite(2, 250);
const cases = {
  'rdf-1.1-read': () => new Parser().parse(rdf2).length,
  'rdf-1.1-write': () => rdfWrite(2, 250).length,
};
const skipped = {};
function register(supported, reason, workloads) {
  for (const [name, operation] of Object.entries(workloads)) {
    if (supported) cases[name] = operation;
    else skipped[name] = reason;
  }
}
// Generate inputs lazily so legacy baselines never instantiate newer writers.
let messages, rdf3, sparql;
if (supportsRdf12) { messages = messageWrite(); rdf3 = rdfWrite(3, 250); }
if (supportsSparql) sparql = sparqlWrite(250);
register(supportsRdf12, 'Baseline predates Jelly-RDF 1.2 support', {
  'rdf-1.2-read': () => new Parser().parse(rdf3).length,
  'rdf-1.2-messages': () => new Parser().parseMessages(messages).reduce((sum, message) => sum + message.length, 0),
  'rdf-1.2-write-messages': () => messageWrite().length,
  'rdf-1.2-write': () => rdfWrite(3, 250).length,
  'rdf-1.2-write-small-lookup': () => rdfWrite(3, 4000, { maxNames: 128, maxDatatypes: 8 }).length,
});
register(supportsSparql, 'Baseline predates Jelly-SPARQL support', {
  'sparql-read': () => new SparqlParser().parse(sparql)[0].bindings.length,
  'sparql-write': () => sparqlWrite(250).length,
  'sparql-write-small-lookup': () => sparqlWrite(4000, { maxNames: 128, maxDatatypes: 8 }).length,
});
const results = {};
for (const [name, operation] of Object.entries(cases)) {
  const expected = operation();
  assert.ok(expected > 0);
  if (!name.includes('write')) assert.equal(expected, count);
  operation();
  const timings = [];
  globalThis.gc();
  const heapBefore = process.memoryUsage().heapUsed;
  for (let i = 0; i < samples; i++) {
    globalThis.gc();
    const start = performance.now();
    assert.equal(operation(), expected);
    timings.push(performance.now() - start);
  }
  globalThis.gc();
  const retainedHeapDeltaBytes = process.memoryUsage().heapUsed - heapBefore;
  results[name] = { retainedHeapDeltaBytes, medianMs: timings.sort((a, b) => a - b)[Math.floor(samples / 2)], count: expected };
  if (process.argv.includes('--profile')) {
    const entries = [];
    const observer = new PerformanceObserver(list => entries.push(...list.getEntries()));
    observer.observe({ entryTypes: ['gc'] });
    globalThis.gc();
    await setImmediate();
    const session = new Session();
    session.connect();
    const post = (method, parameters = {}) => new Promise((resolve, reject) => session.post(method, parameters, (error, response) => error ? reject(error) : resolve(response)));
    try {
      await post('HeapProfiler.startSampling', { samplingInterval: 32768, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
      const start = performance.now();
      for (let i = 0; i < samples; i++) assert.equal(operation(), expected);
      const end = performance.now();
      const { profile } = await post('HeapProfiler.stopSampling');
      await setTimeout(30);
      const sum = node => node.selfSize + node.children.reduce((total, child) => total + sum(child), 0);
      globalThis.gc();
      await setImmediate();
      results[name].estimatedAllocatedBytesPerRun = sum(profile.head) / samples;
      results[name].gcMs = entries.filter(entry => entry.startTime >= start && entry.startTime < end).reduce((total, entry) => total + entry.duration, 0);
    } finally {
      observer.disconnect();
      session.disconnect();
    }
  }
}
const report = { node: process.version, count, samples, results, skipped };
if (process.env.PERF_OUTPUT) writeFileSync(process.env.PERF_OUTPUT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
