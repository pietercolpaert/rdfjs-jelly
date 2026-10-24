# RiverBench performance comparison

Measured 2026-10-24. This is a small, executable JavaScript comparison of
Turtle RDF Message Logs using `n3.js-messages`, RiverBench Jelly 1.1 archives,
and RiverBench Jelly 1.2 archives. It covers 6 datasets, 60,000 messages,
and 2,103,143 statements.

The size finding reproduces: the downloaded Jelly 1.2 streams use **26.8% fewer
uncompressed bytes** than 1.1 by geometric mean. The read-throughput finding does
**not** reproduce in this implementation: 1.2 achieves **0.88×** the 1.1 throughput
in the retained-message benchmark. Against the source-preserving Turtle log,
Jelly 1.1 achieves **2.56×** and Jelly 1.2 **2.26×** throughput.
These are geometric means of per-dataset ratios, rather than a pooled throughput.

The [implementation and packing follow-up](docs/column-optimization-2026-10-24.md) measures the
reader improvements against the saved baseline and the optional packed writer.
The tables here use the unchanged downloaded encodings and default writer framing.

## Relationship to the upstream report

The [Jelly-RDF 1.1 vs 1.2 report](https://jelly-rdf.github.io/dev/performance/rdf-1-1-vs-1-2/)
compares Jelly-JVM 3.7.3 and 4.0.0 on 13 datasets, using six runs per dataset.
Within JVM 4.0.0, it reports a 1.79×–1.94× geometric-mean read-throughput gain
for 1.2, and uncompressed size falling from 32.13 to 21.04 bytes/statement.
Its 4.0 configurations use a frame size of 1,024. The [RDF benchmark](https://jelly-rdf.github.io/1.2.x/performance/rdf/) uses flat streams, 100,000 statements per dataset and a discard sink. Those JVM results are context,
not measurements made here.

This experiment keeps one JavaScript implementation revision fixed and reads
the two **downloaded** archive encodings. Both archive types contain 10,000
frames per dataset, one frame per source message. This differs materially from
the upstream framing and execution environment. The RDF content is RDF 1.1
throughout; “1.2” here denotes the Jelly serialization version, not RDF 1.2-only data.

## Inputs and semantic checks

Each dataset uses its `dev` distributions `stream_10K.tar.gz`,
`jelly_10K.jelly.gz`, and `jelly_10K.2.jelly.gz`. Dataset pages below describe
the data and its license. All compressed-source URLs and SHA-256 hashes,
prepared-input hashes, stream options, and individual samples are in the
[primary results](perf/riverbench-comparison-optimized-2026-10-24.json). Writer outputs and the Turtle sensitivity
experiment are in the [follow-up results](perf/riverbench-comparison-optimized-followup-2026-10-24.json).

RiverBench's plain streaming package contains separate Turtle documents, not
a preassembled RDF Message Log. The preparation script sorts their zero-padded
numeric filenames, prepends `VERSION "1.2-messages"`, and places `MESSAGE`
between documents. It preserves the Turtle document bytes, including repeated
prefix declarations and whitespace, and adds no trailing empty message.
No tar headers are fed into any RDF parser.

The source log is a reproducible baseline, not an optimized Turtle serializer.
A second, **N3-reserialized log with shared prefixes**, uses `writeMessages`
with prefixes collected from the original text. This also changes whitespace,
grouping, and potentially statement order. Its timings are reported separately
to show sensitivity to Turtle representation.

| Dataset (10K messages each) | Statements | Blank nodes | Messages with blank nodes | Max statements/message |
| --- | --- | --- | --- | --- |
| [assist-iot-weather](https://riverbench.github.io/v/dev/datasets/assist-iot-weather/) | 1,150,000 | 0 | 0 | 115 |
| [citypulse-traffic](https://riverbench.github.io/v/dev/datasets/citypulse-traffic/) | 360,000 | 50,000 | 10,000 | 36 |
| [digital-agenda-indicators](https://riverbench.github.io/v/dev/datasets/digital-agenda-indicators/) | 82,424 | 0 | 0 | 9 |
| [linked-spending](https://riverbench.github.io/v/dev/datasets/linked-spending/) | 158,342 | 9,907 | 9,907 | 23 |
| [muziekweb](https://riverbench.github.io/v/dev/datasets/muziekweb/) | 51,721 | 0 | 0 | 11 |
| [osm2rdf-denmark](https://riverbench.github.io/v/dev/datasets/osm2rdf-denmark/) | 300,656 | 1,500 | 146 | 8,899 |

Before timing, every corresponding message must have equal statement counts
and isomorphic RDF, allowing statement reordering and bijective blank-node
renaming. Blank-node identifiers must remain unique across messages; both
implementations must have the same per-stream blank-node and affected-message
counts. Jelly message counters must follow stream order. Each timed read also
checks total message and statement counts, after stopping the clock. These are
graph-equivalence checks, not a claim of byte or statement-order equality.
Writer outputs undergo the same per-message RDF and blank-node-scope checks.

## Read throughput

Rates are **million statements/second**, derived from median wall-clock time.
Each entry reads an in-memory byte buffer into retained arrays of complete
messages: `MessageParser.parse` for Turtle and `Parser.parseMessages` for Jelly,
using each library's default RDF/JS data factory.
UTF-8 decoding is included for Turtle. Input-buffer copying and file I/O are
excluded. The uncompressed case reuses its input bytes; compressed cases must
allocate decompressed bytes as part of decoding.

| Dataset | Turtle source log | Turtle reserialized | Jelly 1.1 | Jelly 1.2 | 1.2 / 1.1 |
| --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 1.14 | 1.30 | 2.71 | 4.45 | 1.64× |
| citypulse-traffic | 1.04 | 1.27 | 3.01 | 3.04 | 1.01× |
| digital-agenda-indicators | 0.61 | 1.16 | 2.29 | 1.52 | 0.66× |
| linked-spending | 1.10 | 1.26 | 2.65 | 1.95 | 0.74× |
| muziekweb | 0.95 | 1.06 | 1.49 | 0.96 | 0.64× |
| osm2rdf-denmark | 0.96 | 1.32 | 2.76 | 2.50 | 0.90× |

Compression/decompression uses gzip level 6 and zstd level 3 for **all** formats,
recompressed from the prepared uncompressed inputs. Compression happens outside
the read clock; decompression happens inside it. These compressed-input cases
do not use the original archive gzip settings. The following rates and ratios
are geometric means across datasets; per-dataset compressed timings are in JSON.

| Input encoding | Turtle source log | Turtle reserialized | Jelly 1.1 | Jelly 1.2 | 1.2 / 1.1 |
| --- | --- | --- | --- | --- | --- |
| none | 0.95 | 1.23 | 2.42 | 2.14 | 0.88× |
| gzip | 0.91 | 1.12 | 2.26 | 1.99 | 0.88× |
| zstd | 0.93 | 1.15 | 2.31 | 2.07 | 0.89× |

## Serialized size

Sizes below are **bytes/statement**, including message framing. The Jelly columns
are the unmodified RiverBench encodings after decompression. “Turtle reserialized”
is the separate locally written shared-prefix log.

| Dataset | Turtle source log | Turtle reserialized | Jelly 1.1 | Jelly 1.2 | 1.2 reduction vs 1.1 |
| --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 93.97 | 75.33 | 19.53 | 9.33 | 52.3% |
| citypulse-traffic | 110.55 | 91.16 | 33.15 | 25.03 | 24.5% |
| digital-agenda-indicators | 137.89 | 57.80 | 23.14 | 16.27 | 29.7% |
| linked-spending | 125.32 | 108.07 | 37.41 | 31.67 | 15.3% |
| muziekweb | 110.90 | 91.07 | 44.20 | 40.22 | 9.0% |
| osm2rdf-denmark | 81.02 | 65.00 | 32.59 | 25.69 | 21.2% |

Compressed sizes use the same gzip/zstd settings as the read experiment.
The Turtle columns here refer to the **source-preserving** log.

| Dataset | Turtle gzip | 1.1 gzip | 1.2 gzip | Turtle zstd | 1.1 zstd | 1.2 zstd |
| --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 1.84 | 1.21 | 0.51 | 1.25 | 0.80 | 0.51 |
| citypulse-traffic | 5.42 | 7.87 | 7.23 | 5.67 | 7.56 | 6.98 |
| digital-agenda-indicators | 2.70 | 2.52 | 2.37 | 2.59 | 2.55 | 2.34 |
| linked-spending | 7.52 | 7.99 | 7.80 | 5.97 | 7.13 | 6.99 |
| muziekweb | 13.31 | 14.96 | 15.03 | 12.77 | 14.07 | 14.36 |
| osm2rdf-denmark | 8.78 | 8.17 | 7.81 | 9.64 | 7.89 | 7.50 |

By geometric mean, 1.2 saves **16.4% with gzip** and
**10.7% with zstd** relative to 1.1. Compression changes the ranking:
Turtle is smaller than both Jelly versions on traffic, spending, and music in
these compressed cases. On muziekweb, 1.2 is slightly larger than 1.1 after
compression. The raw-size advantage does not imply a compressed-size win for
every dataset. Shared-prefix Turtle sizes for all three codecs are in the
follow-up JSON.

For download/storage planning, the **original** RiverBench archive sizes in MiB
are below. The Turtle download includes tar headers and padding and is therefore
a different artifact from the assembled compressed log above.

| Dataset | Turtle tar.gz | Jelly 1.1 gzip | Jelly 1.2 gzip |
| --- | --- | --- | --- |
| assist-iot-weather | 2.06 | 1.22 | 0.54 |
| citypulse-traffic | 1.89 | 2.73 | 2.53 |
| digital-agenda-indicators | 0.30 | 0.19 | 0.19 |
| linked-spending | 1.26 | 1.22 | 1.19 |
| muziekweb | 0.84 | 0.74 | 0.75 |
| osm2rdf-denmark | 2.68 | 2.35 | 2.25 |

## File streaming

This separate experiment reads the original Jelly gzip archives from disk and
the assembled source Turtle log compressed with gzip level 6. It includes
`createReadStream`, gunzip, parsing, and a discard sink. Each case has one warmup
and three timed passes; the filesystem cache is warm. Turtle's stream emits
message arrays, while Jelly's emits quads and also emits a message event used
for counting. Their downstream stream overhead therefore differs.

| Dataset | Turtle M/s | Jelly 1.1 M/s | Jelly 1.2 M/s | Peak RSS MiB: Turtle / 1.1 / 1.2 |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 1.01 | 2.96 | 3.75 | 122 / 129 / 126 |
| citypulse-traffic | 0.81 | 1.73 | 1.56 | 109 / 130 / 137 |
| digital-agenda-indicators | 0.52 | 1.23 | 0.99 | 89 / 73 / 78 |
| linked-spending | 0.95 | 1.33 | 1.25 | 92 / 100 / 100 |
| muziekweb | 0.79 | 0.71 | 0.61 | 86 / 95 / 99 |
| osm2rdf-denmark | 0.93 | 1.69 | 1.68 | 110 / 100 / 128 |

The streaming measurements exercise file I/O, decompression, event delivery,
and a discard sink, unlike the retained-message results above. Peak RSS
is the operating system's **whole-process high-water mark**, including startup,
inputs and warmups, not parser-only memory or cumulative allocated bytes.
Retained-array cases have much higher memory requirements; their process RSS
and post-parse heap samples are recorded separately in the primary JSON.

## Local writer comparison

This is a separate serialization experiment, **not a regeneration of the
RiverBench archives**. All writers consume the same decoded source messages.
Turtle uses `writeMessages` with shared prefixes; Jelly uses `Writer.addMessage`
with protocol tag 2 (1.1) or 3 (1.2), triples, and `messageSize: 1024`.
1.1 uses logical type GRAPHS; 1.2 uses stream type MESSAGES. The same option
does not mean identical framing: 1.1 budgets rows and lookup entries, while
1.2 budgets statements, and message completion also affects framing.

The clock includes serialization and collecting output bytes, including UTF-8
encoding of Turtle output, and excludes source parsing and compression. Rates
are M statements/s. The two size columns describe **locally generated** Jelly,
not the downloaded archives used for read timings.

| Dataset | Turtle M/s | 1.1 M/s | 1.2 M/s | 1.2 / 1.1 | Written 1.1 B/stmt | Written 1.2 B/stmt |
| --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 1.34 | 1.79 | 2.10 | 1.17× | 19.53 | 44.42 |
| citypulse-traffic | 1.60 | 1.62 | 1.52 | 0.94× | 34.78 | 67.80 |
| digital-agenda-indicators | 1.73 | 1.19 | 0.80 | 0.67× | 23.13 | 141.62 |
| linked-spending | 1.64 | 1.26 | 1.00 | 0.79× | 37.78 | 108.28 |
| muziekweb | 1.55 | 0.82 | 0.68 | 0.82× | 44.25 | 101.01 |
| osm2rdf-denmark | 1.49 | 1.65 | 1.28 | 0.78× | 33.80 | 77.25 |

The local 1.2 writer's compression behavior differs substantially from
RiverBench's producer. For example, its current [column encoder](src/codec/ColumnEncoder.ts)
clears its name/datatype tables after each batch with default options. The optional
`packMessages: true` mode shares batches and retains bounded dictionaries;
its measurements are reported separately below. Default output sizes must not be
used to characterize the Jelly 1.2 format's achievable compression. The archive
read experiment and writer experiment answer different questions.

## Environment and timing method

- Node v25.9.0, V8 14.1.146.11-node.25; linux 6.8.0-146-generic.
- CPU: 12th Gen Intel(R) Core(TM) i7-1265U; 12 logical CPUs; 30.8 GiB RAM.
- Packages: `n3@2.13.12`, `n3.js-messages@0.2.0`, `rdf-isomorphic@2.0.1`, `protobufjs@8.8.1`, `rdfjs-jelly@0.1.6`.
- Compression libraries: zlib 1.3.1-e00f703, zstd 1.5.7.
- Source base revision (with local implementation changes): `5eec1e4d2a051133b6531163f4c64a14ab5be3a0`.
- Measured ESM bundle SHA-256: `d551cc756e85a2d61c8e89d4ffa65b09771eda14ada0781e2544446dcf4c10f0`.
- Retained reads and writes: two warmups, 7 timed iterations,
  one fresh child process per dataset/format/codec case, explicit GC before
  each operation. GC that occurs during an operation remains inside its clock.
- Workers run sequentially. Primary read-case order rotates across datasets;
  streaming and writer format order alternates. Samples within one case share
  a worker. The primary and sensitivity experiments are separate batches.
- Medians are used; no outliers are removed. All samples and min/max values are
  retained. No confidence intervals, process-level repetitions, CPU affinity,
  or thermal controls were used. Treat small differences as inconclusive.

These results support a size improvement in the available 1.2 archives and a
performance gap worth investigating in the JavaScript implementation. They do
not reproduce the JVM reader speedup or isolate its causes. Small per-message
frames, object materialization, lookup handling, and implementation differences
are plausible contributors; attributing the slowdown requires profiling and
controlled experiments. This sample excludes named-graph datasets, RDF-star,
RDF 1.2-only terms, network transfer, browser execution, and slow consumers.

## Validation for this recorded run

| Check | Result |
| --- | --- |
| npm run check | Passed: types, lint, generated protobuf, Node/browser builds, 4 performance harness tests, 578 unit tests with coverage, package checks |
| node --test perf/message-workload.test.mjs | 5 tests passed |
| npm run test:interop -- /tmp/jelly-v1.2.0 | 32 RDF and 25 SPARQL writer fixtures verified by upstream Python decoders |
| Original archive checksum comparison | 18/18 matched |

All six primary inputs and all 18 local writer outputs passed the per-message
RDF equivalence checks. All 18 downloaded archive hashes also match the recorded
sources. Both runtime and declaration builds pass in this run.

## Reproduce

Use Node with zstd support (this run used v25.9.0), Python 3, curl, and enough
memory for retained RDF arrays. Downloaded and generated datasets stay outside
the repository.

```sh
npm ci --ignore-scripts
npm run build

node perf/riverbench-compare.mjs download /tmp/rdfjs-jelly-performance/data
# Confirm that RiverBench dev still contains the exact inputs measured here.
node perf/riverbench-compare.mjs check /tmp/rdfjs-jelly-performance/data \
  perf/riverbench-comparison-optimized-2026-10-24.json
node perf/riverbench-compare.mjs prepare /tmp/rdfjs-jelly-performance/data
node perf/riverbench-compare.mjs run /tmp/rdfjs-jelly-performance/data \
  /tmp/riverbench-read-results.json 7
node perf/riverbench-compare.mjs followup /tmp/rdfjs-jelly-performance/data \
  /tmp/riverbench-followup-results.json 7
node perf/riverbench-report.mjs /tmp/riverbench-read-results.json \
  /tmp/riverbench-followup-results.json /tmp/PERFORMANCE.md
```

The `dev` distributions can change. The `check` command fails when any downloaded
archive differs from the saved SHA-256. Recover the recorded input bytes for an
exact historical rerun; omitting that check produces a new experiment whose
new hashes must be reported. Existing downloads are reused, and partial downloads
are renamed only after curl succeeds.

For a smoke run, append `assist-iot-weather` to `download` and `prepare`, and
append `3 assist-iot-weather` after the output filename in `run` and `followup`.
The historical `check` command expects every dataset present in its saved report.

The runtime and declaration builds use the installed TypeScript configuration.
Run `npm run check` to validate types, lint, generated protobuf code, builds,
regressions, coverage and package entrypoints.
