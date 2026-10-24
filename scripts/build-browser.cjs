#!/usr/bin/env node
'use strict';

const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outdir = path.join(root, 'dist', 'browser');

async function build() {
  fs.mkdirSync(outdir, { recursive: true });
  const common = {
    entryPoints: [path.join(root, 'src', 'browser.ts')],
    bundle: true,
    minify: true,
    platform: 'browser',
    target: ['es2020'],
    legalComments: 'none',
    logLevel: 'info',
  };
  await Promise.all([
    esbuild.build({ ...common, format: 'esm', outfile: path.join(outdir, 'index.mjs') }),
    esbuild.build({ ...common, format: 'iife', globalName: 'RDFJSJelly', outfile: path.join(outdir, 'index.global.js') }),
  ]);
  const generatedTypes = path.join(root, 'dist', 'browser-types', 'browser.d.mts');
  const declarations = fs.readFileSync(generatedTypes, 'utf8');
  fs.writeFileSync(path.join(outdir, 'index.d.ts'), declarations);
  fs.writeFileSync(path.join(outdir, 'index.d.mts'), declarations);
  fs.rmSync(path.dirname(generatedTypes), { recursive: true, force: true });
}

build().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
