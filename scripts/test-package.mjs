// Exercise the published artifact without access to the repository's sources.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'rdfjs-jelly-consumer-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
function run(command, args, cwd = directory) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' && command === npm });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const smoke = `
const { DataFactory: f, Writer, Parser, SparqlWriter, SparqlParser } = api;
const quad = f.quad(f.namedNode('urn:s'), f.namedNode('urn:p'), f.literal('hello'));
const writer = new Writer({ version: 3 });
writer.addQuad(quad);
let bytes;
writer.end((error, value) => { if (error) throw error; bytes = value; });
if (!new Parser().parse(bytes)[0].equals(quad)) throw new Error('RDF round trip failed');
if (new Parser({ quadPatterns: [{ predicate: f.namedNode('urn:absent') }] }).parse(bytes).length) throw new Error('Quad filter failed');
if (!new Parser({ quadPatterns: [{ predicate: quad.predicate }] }).parse(bytes)[0].equals(quad)) throw new Error('Quad selection failed');
const sparql = new SparqlWriter();
sparql.startSelect(['value']);
sparql.addBinding({ value: quad.object });
const results = new SparqlParser().parse(sparql.end());
if (results[0].bindings[0].get('value').value !== 'hello') throw new Error('SPARQL round trip failed');
`;
try {
  const packed = JSON.parse(run(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', directory], root))[0];
  const files = new Set(packed.files.map(file => file.path));
  for (const path of ['dist/index.js', 'dist/index.mjs', 'dist/index.d.ts', 'dist/index.d.mts', 'dist/browser/index.mjs', 'dist/browser/index.global.js', 'dist/browser/index.d.mts', 'bin/rdfjs-jelly.mjs', 'LICENSE', 'NOTICE']) assert.ok(files.has(path), `Missing package file: ${path}`);
  assert.ok(![...files].some(path => /^(test|perf|docs|node_modules)\//u.test(path)), 'Development artifacts leaked into the package');
  writeFileSync(join(directory, 'package.json'), JSON.stringify({ private: true }));
  run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--prefer-offline', join(directory, packed.filename)]);
  const installed = join(directory, 'node_modules', 'rdfjs-jelly');
  assert.ok(!existsSync(join(directory, 'node_modules', 'typescript')), 'Consumer must not need build tools');
  for (const [extension, statement] of [['cjs', "const api = require('rdfjs-jelly');"], ['mjs', "import * as api from 'rdfjs-jelly';"]]) {
    writeFileSync(join(directory, `smoke.${extension}`), statement + smoke);
    run(process.execPath, [`smoke.${extension}`]);
  }
  const types = `import { Parser, Writer, DataFactory, SparqlParser, SparqlWriter, type QuadPattern } from 'rdfjs-jelly';
import { StreamParser } from 'rdfjs-jelly/browser';
const q = DataFactory.quad(DataFactory.namedNode('urn:s'), DataFactory.namedNode('urn:p'), DataFactory.literal('o'));
new Writer().addQuad(q);
const patterns: QuadPattern[] = [{ predicate: DataFactory.namedNode('urn:p') }];
new Parser({ quadPatterns: patterns });
new Parser().parse(new Uint8Array());
new SparqlWriter().addAsk(true);
new SparqlParser().parse(new Uint8Array());
new StreamParser();\n`;
  const compiler = join(root, 'node_modules/typescript/bin/tsc');
  for (const resolution of ['NodeNext', 'Bundler']) {
    for (const extension of resolution === 'NodeNext' ? ['mts', 'cts'] : ['mts']) {
      const file = `consumer.${extension}`;
      // The browser subpath is ESM-only; CJS consumers use a dynamic import.
      writeFileSync(join(directory, file), extension === 'cts' ? types.replace("import { StreamParser } from 'rdfjs-jelly/browser';", '').replace('new StreamParser();', "void import('rdfjs-jelly/browser').then(api => new api.StreamParser());") : types);
      run(process.execPath, [compiler, '--noEmit', '--strict', '--target', 'ES2024', '--module', resolution === 'Bundler' ? 'ESNext' : 'NodeNext', '--moduleResolution', resolution, file]);
    }
  }
  writeFileSync(join(directory, 'browser-consumer.mts'), `import { StreamParser } from 'rdfjs-jelly';
const parser: { readable: ReadableStream; writable: WritableStream } = new StreamParser();
void parser;`);
  run(process.execPath, [compiler, '--noEmit', '--strict', '--target', 'ES2024', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--customConditions', 'browser', 'browser-consumer.mts']);
  const cli = join(installed, 'bin/rdfjs-jelly.mjs');
  assert.match(run(process.execPath, [cli, '--help']), /Usage:/u);
  writeFileSync(join(directory, 'input.nq'), '<urn:s> <urn:p> "hello" .\n');
  run(process.execPath, [cli, 'convert', 'input.nq', '--output', 'output.jelly.zst']);
  assert.match(run(process.execPath, [cli, 'inspect', 'output.jelly.zst']), /<urn:s> <urn:p> "hello"/u);
  writeFileSync(join(directory, 'rdf12.log'), 'VERSION "1.2-messages"\n<urn:s> <urn:p> "hello"@en--ltr .\nMESSAGE\nMESSAGE\n<urn:s> <urn:p> <<( <urn:a> <urn:b> <urn:c> )>> .\nMESSAGE\n');
  run(process.execPath, [cli, 'convert', 'rdf12.log', '--version', '3', '--message-size', '1', '--no-pack-messages', '--max-names', '128', '--max-prefixes', '0', '--compression', 'none', '--output', 'rdf12.jelly']);
  assert.match(run(process.execPath, [cli, 'inspect', 'rdf12.jelly']), /"hello"@en--ltr/u);
  writeFileSync(join(directory, 'cli-version3.mjs'), `import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MessageDecoder, Parser } from 'rdfjs-jelly';
const bytes = readFileSync('rdf12.jelly');
assert.equal(new MessageDecoder().decode(bytes)[0].rows[0].value.version, 3);
const messages = new Parser().parseMessages(bytes);
assert.deepEqual(messages.map(m => m.length), [1, 0, 1]);
assert.equal(messages[0][0].object.direction, 'ltr');
assert.equal(messages[2][0].object.termType, 'Quad');
`);
  run(process.execPath, ['cli-version3.mjs']);
  if (process.argv.includes('--browser')) {
    const { chromium } = await import('@playwright/test');
    const server = createServer((request, response) => {
      if (request.url === '/') { response.end('<!doctype html><title>Package consumer</title>'); return; }
      const path = request.url === '/index.mjs' ? 'index.mjs' : request.url === '/index.global.js' ? 'index.global.js' : undefined;
      if (!path) { response.writeHead(404).end(); return; }
      response.setHeader('Content-Type', 'text/javascript');
      response.end(readFileSync(join(installed, 'dist/browser', path)));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
      browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      const browserSmoke = `${smoke}
const source = new ReadableStream({ start(controller) { controller.enqueue(quad); controller.close(); } });
const reader = source.pipeThrough(new api.StreamWriter({ version: 3 })).pipeThrough(new api.StreamParser()).getReader();
const first = await reader.read();
if (first.done || !first.value.equals(quad) || !(await reader.read()).done) throw new Error('Browser stream round trip failed');
`;
      await page.evaluate(`(async () => { const api = await import('/index.mjs'); ${browserSmoke} })()`);
      await page.addScriptTag({ url: '/index.global.js' });
      await page.evaluate(`(async () => { const api = globalThis.RDFJSJelly; ${browserSmoke} })()`);
    } finally {
      await browser?.close();
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  }
  console.log(`Installed package checks passed${process.argv.includes('--browser') ? ', including Chromium ESM and global bundles' : ''}.`);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
