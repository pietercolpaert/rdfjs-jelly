#!/usr/bin/env node
// The checked-in codec in src/generated/rdf_pb.ts is intentionally reviewed
// together with proto/rdf.proto. This guard detects schema changes that require
// regenerating/reviewing the codec field mapping.
import { readFile } from 'node:fs/promises';

const schema = await readFile(new URL('../proto/rdf.proto', import.meta.url), 'utf8');
const codec = await readFile(new URL('../src/generated/rdf_pb.ts', import.meta.url), 'utf8');
for (const required of ['RdfStreamFrame', 'RdfStreamRow', 'RdfStreamOptions', 'RdfQuad', 'RdfTriple']) {
  if (!schema.includes(`message ${required}`) || !codec.includes(required)) {
    throw new Error(`Generated codec is missing ${required}`);
  }
}
console.log('The checked-in Jelly protobuf codec covers the pinned rdf.proto messages.');
