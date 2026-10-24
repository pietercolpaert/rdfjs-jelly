// Build a Git baseline in a temporary directory without modifying the checkout.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, symlinkSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'jelly-perf-'));
const base = process.env.PERF_BASE_REF || 'HEAD';
const threshold = Number(process.env.PERF_THRESHOLD ?? 20);
assert.ok(Number.isFinite(threshold) && threshold > 0 && threshold < 100);
function run(command, args, options = {}) {
  const child = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, ...options });
  if (child.error) throw child.error;
  assert.equal(child.status, 0, child.stderr || child.stdout);
  return child.stdout;
}
try {
  const baseline = join(directory, 'baseline');
  mkdirSync(baseline);
  run('git', ['archive', '--format=tar', '--output', join(directory, 'baseline.tar'), base]);
  run('tar', ['-xf', join(directory, 'baseline.tar'), '-C', baseline]);
  symlinkSync(join(root, 'node_modules'), join(baseline, 'node_modules'), 'dir');
  // Deliberately use the same dependencies and compiler for both revisions.
  run(process.execPath, [join(root, 'node_modules/tsup/dist/cli-default.js'), 'src/index.ts', '--format', 'esm', '--target', 'node24', '--platform', 'node', '--splitting', 'false', '--out-dir', 'dist'], { cwd: baseline });
  const reports = {};
  for (const [name, module] of [['baseline', join(baseline, 'dist/index.mjs')], ['current', join(root, 'dist/index.mjs')]]) {
    const output = join(directory, `${name}.json`);
    run(process.execPath, ['--expose-gc', join(root, 'perf/quality.mjs')], { env: { ...process.env, JELLY_BENCH_MODULE: module, PERF_OUTPUT: output } });
    reports[name] = JSON.parse(readFileSync(output, 'utf8'));
  }
  const comparisons = [];
  for (const [name, value] of Object.entries(reports.current.results)) {
    if (!name.includes('write')) assert.equal(value.count, reports.baseline.results[name].count, `${name}: baseline and current output counts differ`);
    const slowdown = (value.medianMs / reports.baseline.results[name].medianMs - 1) * 100;
    comparisons.push({ name, baselineMs: reports.baseline.results[name].medianMs, currentMs: value.medianMs, slowdownPercent: slowdown });
    console.log(`${name}: ${slowdown.toFixed(1)}% time change`);
    if (slowdown > threshold) console.warn(`::warning title=Performance regression::${name} takes ${slowdown.toFixed(1)}% longer than ${base}`);
  }
  mkdirSync(join(root, 'coverage'), { recursive: true });
  writeFileSync(join(root, 'coverage/performance-regression.json'), JSON.stringify({ base, threshold, reports, comparisons }, null, 2) + '\n');
} finally {
  rmSync(directory, { recursive: true, force: true });
}
