// Stream the downloaded compressed dataset without retaining decoded quads.
import assert from 'node:assert/strict';
import { createReadStream, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Writable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { setImmediate } from 'node:timers/promises';
import { cpus } from 'node:os';
import { StreamParser } from '../dist/index.mjs';

assert.ok(process.argv[2], 'Usage: node --expose-gc perf/riverbench.mjs DATA.jelly.gz [REPORT.json]');
assert.ok(globalThis.gc, 'Run with --expose-gc');
globalThis.gc();
const before = process.memoryUsage();
const gc = [];
const observer = new PerformanceObserver(list => gc.push(...list.getEntries()));
observer.observe({ entryTypes: ['gc'] });
let quads = 0;
const hash = createHash('sha256');
const start = performance.now();
try {
  await pipeline(
    createReadStream(process.argv[2]),
    new Transform({ transform(chunk, _encoding, done) { hash.update(chunk); done(null, chunk); } }),
    createGunzip(),
    new StreamParser(),
    new Writable({ objectMode: true, write(_quad, _encoding, done) { quads++; done(); } }),
  );
  const elapsedMs = performance.now() - start;
  assert.ok(quads > 0, 'Dataset contained no statements');
  globalThis.gc();
  await setImmediate();
  const after = process.memoryUsage();
  const report = { date: new Date().toISOString(), source: 'https://w3id.org/riverbench/datasets/assist-iot-weather/dev/files/jelly_full.2.jelly.gz', sha256: hash.digest('hex'), node: process.version, cpu: cpus()[0]?.model, quads, elapsedMs, quadsPerSecond: quads / elapsedMs * 1000, gcMs: gc.filter(entry => entry.startTime >= start && entry.startTime < start + elapsedMs).reduce((sum, entry) => sum + entry.duration, 0), heapBefore: before.heapUsed, heapAfterGc: after.heapUsed, maxRssBytes: process.resourceUsage().maxRSS * 1024 };
  if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  observer.disconnect();
}
