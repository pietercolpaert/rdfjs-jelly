# Jelly conformance fixtures

These Base64-encoded binary fixtures are from `Jelly-RDF/jelly-protobuf` commit
`1a467179c41ce5224cf3cc1245a8ff80fe6ee37c`, `test/rdf/from_jelly`, protocol
schema 1.1.1. They are distributed under the
upstream Apache-2.0 license. Base64 keeps the fixtures reviewable as text; tests
decode them before parsing.

- `triples-pos-001`: valid RDF 1.1 triples
- `quads-pos-001`: valid RDF 1.1 quads
- `graphs-pos-001`: valid RDF 1.1 physical graph encoding
- `triples-neg-001`: invalid oversized name lookup table

`rdf12.json` and `rdf12-writer.json` contain every parser (226) and writer (31)
fixture from the official [v1.2.0 release](https://github.com/Jelly-RDF/jelly-protobuf/releases/tag/v1.2.0),
commit `7c3773f`, under `test/rdf/v1_2/from_jelly` and `to_jelly`.
Binary data is Base64; expected/input RDF text is preserved verbatim.
These fixtures also carry the upstream Apache-2.0 license.
Reimport with `node scripts/import-rdf12-fixtures.mjs /path/to/v1.2.0-checkout`.
The tests compare decoded RDF and logical message boundaries, allowing different
valid batching and compression choices. The text fixture parser uses an adapter
for the RDF 1.2 `@lang--direction` notation.

`sparql-from_jelly.json` and `sparql-to_jelly.json` contain all 201 parser and
29 writer fixtures from `test/sparql` in the same v1.2.0 release (Jelly-SPARQL
1.0.0). Binary streams/options are Base64; the SPARQL Results JSON structures
are preserved. The upstream Apache-2.0 license applies. Reimport with
`node scripts/import-sparql-fixtures.mjs /path/to/v1.2.0-checkout`.
Tests compare variable order, row order, unbound cells, terms, links, and result-set
boundaries while allowing different valid compression and frame sizes. Blank-node
labels are compared up to renaming within each result set. Additional tests check
completion flags, error trailers, and blank-node identity across result sets.
