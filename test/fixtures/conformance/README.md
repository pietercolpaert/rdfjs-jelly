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
