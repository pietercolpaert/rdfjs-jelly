// Compare regenerated files with their existing bytes, including uncommitted edits.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const directory = fileURLToPath(new URL('../src/generated/proto/', import.meta.url));
const snapshot = path => Object.fromEntries(readdirSync(path).sort().map(name => [name, readFileSync(join(path, name))]));
const temporary = mkdtempSync(join(tmpdir(), 'jelly-proto-check-'));
try {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('generate-proto.mjs', import.meta.url)), temporary], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  else {
    assert.deepStrictEqual(snapshot(temporary), snapshot(directory), 'Generated protobuf files are stale. Run npm run proto:generate and commit the output.');
    console.log('Generated protobuf files are reproducible.');
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
