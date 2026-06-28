#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { delimiter, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname);
const bin = join(root, 'node_modules', '.bin');
const executable = join(bin, process.platform === 'win32' ? 'pbjs.cmd' : 'pbjs');
const outputDirectory = join(root, 'src', 'generated', 'proto');
const output = join(outputDirectory, 'rdf_pb.mjs');
const declarations = join(outputDirectory, 'rdf_pb.d.ts');
const moduleDeclarations = join(outputDirectory, 'rdf_pb.d.mts');
rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
const result = spawnSync(executable, [
  '-t', 'static-module',
  '-w', 'esm',
  '--es6',
  '--no-verify',
  '--no-convert',
  '--no-service',
  '--no-typeurl',
  '--dts',
  '-o', output,
  join(root, 'proto', 'rdf.proto'),
], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: `${bin}${delimiter}${process.env.PATH ?? ''}`,
  },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync(output) || !existsSync(declarations)) {
  throw new Error('protobuf.js did not generate the static Jelly codec');
}

// protobuf.js implements oneofs with prototype setters that delete every
// alternative on every decoded field. Jelly has several hot oneofs (including
// nine row variants), so those generic deletion loops dominate V8 profiles.
// Record the last field in a plain own property instead. The adapter consumes
// these markers, retaining protobuf's last-one-wins behavior without deletes.
const oneofs = 'literalKind|subject|predicate|object|graph|row';
let oneofReplacements = 0;
const generated = readFileSync(output, 'utf8').replace(
  new RegExp(`^(\\s+)message\\.(${oneofs}) = ("[^"]+");$`, 'gm'),
  (_match, indentation, discriminator, value) => {
    oneofReplacements++;
    return `${indentation}message.$${discriminator} = ${value};`;
  },
);
if (oneofReplacements === 0 || new RegExp(`message\\.(${oneofs}) = "`).test(generated)) {
  throw new Error('protobuf.js oneof optimization did not match all generated decoder assignments');
}
writeFileSync(output, generated);
writeFileSync(declarations, readFileSync(declarations, 'utf8').replace('import Long = require("long");\n', ''));
renameSync(declarations, moduleDeclarations);
