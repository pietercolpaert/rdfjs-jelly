#!/usr/bin/env node
// Import the official v1.2.0 release checkout without modifying upstream data.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = process.argv[2];
if (!root) throw new Error('Usage: node scripts/import-rdf12-fixtures.mjs <jelly-protobuf-v1.2.0-checkout>');
const dir = join(root, 'test/rdf/v1_2/from_jelly');
const fixtures = [];
for (const category of (await readdir(dir, { withFileTypes: true })).filter(e => e.isDirectory())) {
  for (const name of (await readdir(join(dir, category.name))).sort()) {
    if (!/^(pos|neg)_/.test(name)) continue;
    const path = join(dir, category.name, name);
    const outputs = (await readdir(path)).filter(f => /^out(?:_.*)?\.(nt|nq)$/.test(f)).sort();
    fixtures.push({ name: `${category.name}/${name}`, input: (await readFile(join(path, 'in.jelly'))).toString('base64'),
      expected: await Promise.all(outputs.map(f => readFile(join(path, f), 'utf8'))) });
  }
}
await writeFile(new URL('../test/fixtures/conformance/rdf12.json', import.meta.url), JSON.stringify(fixtures, null, 2) + '\n');
console.log(`Imported ${fixtures.length} fixtures from Jelly-RDF v1.2.0`);
const writerDir = join(root, 'test/rdf/v1_2/to_jelly');
const writerFixtures = [];
for (const category of (await readdir(writerDir, { withFileTypes: true })).filter(e => e.isDirectory())) {
  for (const name of (await readdir(join(writerDir, category.name))).sort()) {
    if (!/^(pos|neg)_/.test(name)) continue;
    const path = join(writerDir, category.name, name);
    const inputs = (await readdir(path)).filter(f => /^in(?:_.*)?\.(nt|nq)$/.test(f)).sort();
    writerFixtures.push({ name: `${category.name}/${name}`, options: (await readFile(join(path, 'stream_options.jelly'))).toString('base64'),
      input: await Promise.all(inputs.map(f => readFile(join(path, f), 'utf8'))),
      expected: name.startsWith('pos') ? (await readFile(join(path, 'out.jelly'))).toString('base64') : null });
  }
}
await writeFile(new URL('../test/fixtures/conformance/rdf12-writer.json', import.meta.url), JSON.stringify(writerFixtures, null, 2) + '\n');
console.log(`Imported ${writerFixtures.length} writer fixtures`);
