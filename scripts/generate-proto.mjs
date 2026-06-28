#!/usr/bin/env node
import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname);
const bin = join(root, 'node_modules', '.bin');
const executable = join(bin, process.platform === 'win32' ? 'buf.cmd' : 'buf');
const cache = process.env.XDG_CACHE_HOME ?? join(tmpdir(), 'rdfjs-jelly-buf-cache');
mkdirSync(cache, { recursive: true });
const result = spawnSync(executable, ['generate'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: `${bin}${delimiter}${process.env.PATH ?? ''}`,
    XDG_CACHE_HOME: cache,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, `--localstorage-file=${join(cache, 'node-localstorage')}`]
      .filter(Boolean)
      .join(' '),
  },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync(join(root, 'src', 'generated', 'proto', 'rdf_pb.ts'))) {
  throw new Error('Protobuf-ES did not generate src/generated/proto/rdf_pb.ts');
}
