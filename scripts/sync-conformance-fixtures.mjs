#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';

const revision = '1a467179c41ce5224cf3cc1245a8ff80fe6ee37c';
const root = `https://raw.githubusercontent.com/Jelly-RDF/jelly-protobuf/${revision}/test/rdf/from_jelly`;
const fixtures = {
  'triples-pos-001': 'triples_rdf_1_1/pos_001/in.jelly',
  'quads-pos-001': 'quads_rdf_1_1/pos_001/in.jelly',
  'graphs-pos-001': 'graphs_rdf_1_1/pos_001/in.jelly',
  'triples-neg-001': 'triples_rdf_1_1/neg_001/in.jelly',
};

for (const [name, source] of Object.entries(fixtures)) {
  const response = await fetch(`${root}/${source}`);
  if (!response.ok) throw new Error(`Failed to fetch ${source}: ${response.status}`);
  const base64 = Buffer.from(await response.arrayBuffer()).toString('base64');
  await writeFile(new URL(`../test/fixtures/conformance/${name}.jelly.base64`, import.meta.url), `${base64}\n`);
  console.log(`Updated ${name}`);
}
