#!/usr/bin/env node
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = process.argv[2];
if (!root) throw new Error('Usage: node scripts/import-sparql-fixtures.mjs <jelly-protobuf-v1.2.0-checkout>');
for (const direction of ['from_jelly', 'to_jelly']) {
  const dir = join(root, 'test/sparql', direction);
  const fixtures = [];
  for (const category of (await readdir(dir, { withFileTypes: true })).filter(e => e.isDirectory())) {
    for (const name of (await readdir(join(dir, category.name))).sort()) {
      if (!/^(pos|neg)_/.test(name)) continue;
      const path = join(dir, category.name, name);
      const files = await readdir(path);
      const textNames = files.filter(f => /^(in|out)(?:_.*)?\.srj$/.test(f)).sort();
      const texts = await Promise.all(textNames.map(async f => JSON.parse(await readFile(join(path, f), 'utf8'))));
      const binaryName = direction === 'from_jelly' ? 'in.jellys' : 'out.jellys';
      fixtures.push({ name: `${category.name}/${name}`, data: files.includes(binaryName) ? (await readFile(join(path, binaryName))).toString('base64') : null,
        results: texts, ...(direction === 'to_jelly' ? { options: (await readFile(join(path, 'stream_options.jellys'))).toString('base64') } : {}) });
    }
  }
  await writeFile(new URL(`../test/fixtures/conformance/sparql-${direction}.json`, import.meta.url), JSON.stringify(fixtures, null, 2) + '\n');
  console.log(`Imported ${fixtures.length} ${direction} fixtures from Jelly-SPARQL in v1.2.0`);
}
