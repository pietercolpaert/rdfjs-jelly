# Performance

Measured 2026-10-24 with rdfjs-jelly 0.1.6. Across 6 RiverBench datasets (60,000 messages and 2,103,143 statements), Jelly 1.2 reads at **1.97 million statements/s**, compared with **2.25 million/s** for legacy Jelly row-layout archives (protocol tag 1) and **0.94 million/s** for source-preserving Turtle message logs.

Jelly 1.2 achieves **0.87×** the legacy read throughput and **2.10×** the Turtle throughput. Its downloaded encodings use **26.8% fewer raw bytes**, **16.4% fewer gzip bytes**, and **10.7% fewer zstd bytes** than the legacy archives. All aggregate rates and ratios are geometric means across datasets; they are not pooled throughputs or averages across individual statements.

## Workload and method

The inputs are RiverBench development distributions: `stream_10K.tar.gz` (separate Turtle documents), `jelly_10K.jelly.gz` (legacy Jelly row layout), and `jelly_10K.2.jelly.gz` (Jelly 1.2). Here, 1.2 denotes the Jelly serialization version; the RDF content uses RDF 1.1. The legacy archives declare protocol tag 1 (Jelly 1.0); the column archives declare tag 3 (Jelly 1.2). Both contain 10,000 frames, one per source message. The local writer experiment below emits tag 2 (Jelly 1.1) for its row-layout output. Archive reader results therefore do not constitute a 1.1-versus-1.2 reader comparison.

Turtle documents are sorted by their zero-padded numeric filenames and assembled into a message log with `VERSION "1.2-messages"` and `MESSAGE` delimiters. The source text, repeated prefix declarations and whitespace are preserved; tar headers are excluded. A separate shared-prefix Turtle variant is written with N3's `writeMessages` and prefixes collected from the source. It changes grouping, whitespace and possibly statement order, so both Turtle representations are shown.

Every corresponding message is checked for equal statement counts and isomorphic RDF, allowing bijective blank-node renaming and statement reordering. Blank-node identities must remain separate across messages, and Jelly message counters must follow stream order. Writer outputs receive the same checks. Every timed read checks message and statement counts after the clock stops.

| Dataset (10K messages each) | Statements | Blank nodes | Messages with blank nodes | Largest message |
| --- | --- | --- | --- | --- |
| [assist-iot-weather](https://riverbench.github.io/v/dev/datasets/assist-iot-weather/) | 1,150,000 | 0 | 0 | 115 |
| [citypulse-traffic](https://riverbench.github.io/v/dev/datasets/citypulse-traffic/) | 360,000 | 50,000 | 10,000 | 36 |
| [digital-agenda-indicators](https://riverbench.github.io/v/dev/datasets/digital-agenda-indicators/) | 82,424 | 0 | 0 | 9 |
| [linked-spending](https://riverbench.github.io/v/dev/datasets/linked-spending/) | 158,342 | 9,907 | 9,907 | 23 |
| [muziekweb](https://riverbench.github.io/v/dev/datasets/muziekweb/) | 51,721 | 0 | 0 | 11 |
| [osm2rdf-denmark](https://riverbench.github.io/v/dev/datasets/osm2rdf-denmark/) | 300,656 | 1,500 | 146 | 8,899 |

Retained reads use `Parser.parseMessages` for Jelly and N3's `MessageParser.parse` for Turtle, with the libraries' default RDF/JS factories. Complete message arrays remain live until each operation completes. Inputs are reused in-memory byte buffers; UTF-8 decoding is included for Turtle. Input copying and file I/O are excluded.

Each retained read/write case runs in a fresh process with 2 warmups and 7 timed iterations. Explicit GC runs before each operation; any GC during the operation stays inside its timing. Medians are reported, without outlier removal. Workers run sequentially; read-case order rotates across datasets and streaming/writer format order alternates. Cases within a worker share a process. There is no CPU affinity, thermal control or confidence interval, so small differences are inconclusive. Uncompressed Jelly reading also has an independent process repetition, shown separately below; compressed reads, streaming and writing have no process repetitions.

All formats are recompressed with gzip level 6 and zstd level 3. Compression is outside read timing; decompression is inside it. These settings differ from the original downloads' gzip settings.

## Retained-message read throughput

All rates are **million statements/s**. These measurements include RDF term, quad and message materialization.

| Dataset | Turtle source | Turtle shared prefixes | Legacy tag 1 | Jelly 1.2 | 1.2 / legacy |
| --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 1.15 | 1.22 | 2.59 | 3.67 | 1.42× |
| citypulse-traffic | 1.01 | 1.16 | 2.88 | 2.95 | 1.03× |
| digital-agenda-indicators | 0.58 | 1.30 | 1.98 | 1.47 | 0.74× |
| linked-spending | 1.03 | 1.26 | 2.57 | 1.95 | 0.76× |
| muziekweb | 1.00 | 1.04 | 1.37 | 0.81 | 0.59× |
| osm2rdf-denmark | 0.96 | 1.24 | 2.52 | 2.29 | 0.91× |

| Input compression | Turtle source | Turtle shared prefixes | Legacy tag 1 | Jelly 1.2 | 1.2 / legacy |
| --- | --- | --- | --- | --- | --- |
| none | 0.94 | 1.20 | 2.25 | 1.97 | 0.87× |
| gzip | 0.86 | 1.09 | 2.07 | 1.90 | 0.92× |
| zstd | 0.88 | 1.14 | 2.10 | 1.96 | 0.93× |

### Independent read repetition

Each uncompressed Jelly case was measured again in a fresh worker, with two warmups and seven timed iterations. This measures process-to-process variation for the same runtime bundle and input bytes. The main tables use the primary run; these repetitions are reported separately. Rates are million statements/s.

| Dataset | Legacy primary | Legacy repetition | 1.2 primary | 1.2 repetition |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 2.59 | 2.82 | 3.67 | 4.42 |
| citypulse-traffic | 2.88 | 2.95 | 2.95 | 2.90 |
| digital-agenda-indicators | 1.98 | 2.41 | 1.47 | 1.54 |
| linked-spending | 2.57 | 2.71 | 1.95 | 2.03 |
| muziekweb | 1.37 | 1.47 | 0.81 | 0.88 |
| osm2rdf-denmark | 2.52 | 2.75 | 2.29 | 2.51 |

The Jelly 1.2 geometric mean is 1.97 million statements/s in the primary run and 2.11 million/s in the repetition. Scheduling, heap behavior and thermal state are not controlled; these measurements do not identify which source of variation dominates.

## Serialized size

Sizes are **bytes/statement**, including message framing. Jelly sizes in this section describe the downloaded RiverBench encodings. Source and shared-prefix Turtle are the two assembled message-log representations.

| Dataset | Turtle source raw | Turtle shared raw | Legacy tag 1 raw | Jelly 1.2 raw |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 93.97 | 75.33 | 19.53 | 9.33 |
| citypulse-traffic | 110.55 | 91.16 | 33.15 | 25.03 |
| digital-agenda-indicators | 137.89 | 57.80 | 23.14 | 16.27 |
| linked-spending | 125.32 | 108.07 | 37.41 | 31.67 |
| muziekweb | 110.90 | 91.07 | 44.20 | 40.22 |
| osm2rdf-denmark | 81.02 | 65.00 | 32.59 | 25.69 |

| gzip: dataset | Turtle source | Turtle shared prefixes | Legacy tag 1 | Jelly 1.2 |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 1.84 | 1.61 | 1.21 | 0.51 |
| citypulse-traffic | 5.42 | 8.29 | 7.87 | 7.23 |
| digital-agenda-indicators | 2.70 | 2.29 | 2.52 | 2.37 |
| linked-spending | 7.52 | 8.59 | 7.99 | 7.80 |
| muziekweb | 13.31 | 13.19 | 14.96 | 15.03 |
| osm2rdf-denmark | 8.78 | 7.77 | 8.17 | 7.81 |

| zstd: dataset | Turtle source | Turtle shared prefixes | Legacy tag 1 | Jelly 1.2 |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 1.25 | 1.28 | 0.80 | 0.51 |
| citypulse-traffic | 5.67 | 8.09 | 7.56 | 6.98 |
| digital-agenda-indicators | 2.59 | 2.41 | 2.55 | 2.34 |
| linked-spending | 5.97 | 7.35 | 7.13 | 6.99 |
| muziekweb | 12.77 | 12.92 | 14.07 | 14.36 |
| osm2rdf-denmark | 9.64 | 7.98 | 7.89 | 7.50 |

Compressed size depends on the data and representation. Source Turtle is smaller than both Jelly versions on citypulse-traffic, linked-spending and muziekweb in these compressed cases. On muziekweb, compressed Jelly 1.2 is slightly larger than the legacy archives. Smaller raw output does not guarantee smaller compressed output.

Original download sizes in **MiB** are below. Turtle's tar.gz includes separate-document headers and padding; it is a different artifact from the assembled message log.

| Dataset | Turtle tar.gz | Legacy tag 1 gzip | Jelly 1.2 gzip |
| --- | --- | --- | --- |
| assist-iot-weather | 2.06 | 1.22 | 0.54 |
| citypulse-traffic | 1.89 | 2.73 | 2.53 |
| digital-agenda-indicators | 0.30 | 0.19 | 0.19 |
| linked-spending | 1.26 | 1.22 | 1.19 |
| muziekweb | 0.84 | 0.74 | 0.75 |
| osm2rdf-denmark | 2.68 | 2.35 | 2.25 |

## File streaming and memory

Streaming reads the original Jelly gzip downloads from disk, and the source Turtle message log compressed at gzip level 6. The clock includes file reads, gunzip, parsing and a discard sink. There is one warmup and 3 timed passes, with warm filesystem caches. Turtle emits message arrays; Jelly emits quads plus message events used for counting. Their stream/event overhead differs.

| Dataset | Turtle M/s | Legacy tag 1 M/s | Jelly 1.2 M/s | Peak RSS MiB: Turtle / legacy / 1.2 |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 0.89 | 2.72 | 3.83 | 119 / 119 / 119 |
| citypulse-traffic | 0.75 | 1.77 | 1.67 | 109 / 130 / 133 |
| digital-agenda-indicators | 0.49 | 1.32 | 1.10 | 94 / 74 / 77 |
| linked-spending | 0.98 | 1.29 | 1.22 | 88 / 101 / 103 |
| muziekweb | 0.55 | 0.85 | 0.49 | 86 / 96 / 101 |
| osm2rdf-denmark | 0.91 | 1.58 | 1.29 | 107 / 101 / 129 |

Peak RSS is the operating system's whole-process high-water mark, including startup, imports, input buffers and warmups. It is not parser-only memory or cumulative allocation. Retaining complete RDF arrays is a different memory workload from consuming and discarding a stream. These measurements do not establish a memory bound for arbitrary blank-node-heavy messages, nested triple terms or slow consumers.

## Writer throughput and output size

All writers consume the same decoded source messages. Turtle uses shared prefixes. Jelly uses `Writer.addMessage`, TRIPLES, protocol tag 2 for 1.1 or tag 3 for 1.2, and `messageSize: 1024`. Jelly 1.1 uses logical type GRAPHS; 1.2 uses stream type MESSAGES. The 1.1 size budget includes lookup rows, while the 1.2 budget counts statements, so the same setting does not mean identical physical framing.

Timing includes serialization and collecting the returned output bytes, including UTF-8 encoding for Turtle. It excludes source parsing and compression. Rates are **million statements/s**.

| Dataset | Turtle | Jelly 1.1 | Jelly 1.2 | 1.2 / 1.1 |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 1.29 | 1.86 | 2.08 | 1.12× |
| citypulse-traffic | 1.57 | 1.57 | 1.45 | 0.92× |
| digital-agenda-indicators | 1.69 | 1.18 | 0.75 | 0.64× |
| linked-spending | 1.56 | 1.24 | 1.01 | 0.82× |
| muziekweb | 1.57 | 0.83 | 0.66 | 0.80× |
| osm2rdf-denmark | 1.48 | 1.60 | 1.28 | 0.80× |

| Raw written bytes/statement: dataset | Turtle shared prefixes | Jelly 1.1 | Jelly 1.2 |
| --- | --- | --- | --- |
| assist-iot-weather | 75.33 | 19.53 | 44.42 |
| citypulse-traffic | 91.16 | 34.78 | 67.80 |
| digital-agenda-indicators | 57.80 | 23.13 | 141.62 |
| linked-spending | 108.07 | 37.78 | 108.28 |
| muziekweb | 91.07 | 44.25 | 101.01 |
| osm2rdf-denmark | 65.00 | 33.80 | 77.25 |

| gzip written bytes/statement: dataset | Turtle shared prefixes | Jelly 1.1 | Jelly 1.2 |
| --- | --- | --- | --- |
| assist-iot-weather | 1.61 | 1.21 | 0.97 |
| citypulse-traffic | 8.29 | 8.04 | 7.03 |
| digital-agenda-indicators | 2.29 | 2.50 | 2.96 |
| linked-spending | 8.59 | 8.12 | 9.38 |
| muziekweb | 13.19 | 15.10 | 15.98 |
| osm2rdf-denmark | 7.77 | 9.43 | 9.31 |

| zstd written bytes/statement: dataset | Turtle shared prefixes | Jelly 1.1 | Jelly 1.2 |
| --- | --- | --- | --- |
| assist-iot-weather | 1.28 | 0.80 | 0.74 |
| citypulse-traffic | 8.09 | 7.94 | 6.99 |
| digital-agenda-indicators | 2.41 | 2.54 | 2.68 |
| linked-spending | 7.35 | 7.30 | 7.67 |
| muziekweb | 12.92 | 14.20 | 14.17 |
| osm2rdf-denmark | 7.98 | 9.01 | 8.35 |

With default framing, the current Jelly 1.2 writer uses batch-local name/datatype tables and full IRI names without prefix compression. Message packing retains bounded dictionaries across batches, as measured separately below. Its encoding is valid but can be substantially larger than the downloaded Jelly 1.2 streams. For example, weather is 44.42 raw bytes/statement locally versus 9.33 in the archive. The archive read/size results and local writer results describe different byte encodings.

## Packed-message configuration

With `packMessages: true` and `messageSize: 1024`, messages share column batches and bounded dictionaries remain available across batches. Read throughput on these locally encoded files is **3.14 million statements/s**; writer throughput is **1.82 million/s**, by geometric mean. These are measurements of a current writer configuration, separate from the unchanged archive encodings above.

The following table shows uncompressed read/write throughput and locally written bytes/statement, including framing. gzip uses level 6 and zstd level 3. Compression is excluded from writer timing. Packed reading/writing were measured in separate sequential batches with two warmups and 7 timed iterations per case. They use the same retained-message API, GC policy and source RDF. Output checks cover every message, statement count, RDF equivalence and blank-node scope.

| Dataset | Packed read M/s | Packed write M/s | Raw B/stmt | gzip B/stmt | zstd B/stmt | Frames |
| --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 4.00 | 2.59 | 20.43 | 1.51 | 1.19 | 1,124 |
| citypulse-traffic | 3.44 | 2.19 | 36.34 | 7.96 | 7.74 | 352 |
| digital-agenda-indicators | 2.65 | 1.69 | 21.28 | 2.51 | 2.07 | 81 |
| linked-spending | 3.42 | 1.97 | 33.85 | 7.74 | 6.90 | 155 |
| muziekweb | 2.05 | 1.10 | 39.11 | 13.97 | 13.53 | 51 |
| osm2rdf-denmark | 3.77 | 1.76 | 33.62 | 8.02 | 7.77 | 294 |

| Packed input compression | Read million statements/s |
| --- | --- |
| none | 3.14 |
| gzip | 2.74 |
| zstd | 3.06 |

Packed-file reading achieves 1.39× the downloaded legacy tag-1 archive throughput. The files differ in framing and dictionary contents, so this ratio combines encoding and parser effects. It is not a format-only comparison with the JVM.

Packing buffers output until a batch fills or the writer ends. Message boundaries and blank-node scopes remain separate; metadata-bearing messages are isolated. Small batches may suit low-latency delivery, whereas larger shared batches amortize setup work. The current writer uses full IRI names without prefix compression in either configuration.

```js
const writer = new Writer({
  version: 3,
  physicalType: PhysicalStreamType.TRIPLES,
  streamType: RdfStreamType.MESSAGES,
  messageSize: 1024,
  packMessages: true,
});
```

## Comparison with the JVM measurements

The [Jelly-RDF JVM benchmark](https://jelly-rdf.github.io/1.2.x/performance/rdf/) reports geometric means of about 19–20 million statements/s for Jelly writing and 28–31 million/s for reading across 13 datasets. Its [1.1/1.2 comparison](https://jelly-rdf.github.io/dev/performance/rdf-1-1-vs-1-2/) reports 1.79×–1.94× read throughput and 1.48×–1.54× write throughput for Jelly 1.2 relative to 1.1 within JVM 4.0.0. With default framing, JavaScript 1.2 writer throughput is 0.84× the 1.1 writer throughput. With message packing, it is 1.36×; that configuration is timed in a separate batch. The JavaScript archive reader comparison uses legacy tag 1 rather than 1.1, so it does not measure the same format-version ratio as the JVM report.

These are different experiments. The JVM benchmark uses flat triple/quad streams, the first 100,000 statements of each dataset, three JVM forks with timed warmup/measurement periods, a discard sink for reading and a null output stream for writing. The version comparison uses 1,024-row frames. It runs GraalVM on an NVIDIA DGX Spark with CPU affinity. Optional validation, blank-node relabeling and pretty-printing are disabled where configurable. This JavaScript benchmark uses six message streams, up to 1.15 million statements per case, Node/V8 on an Intel laptop CPU, retained arrays, message-local blank-node scopes and collected writer bytes.

### Possible explanations

The following are hypotheses and observable implementation differences, not measured shares of the JavaScript/JVM gap:

- **Allocation and retention.** RDF/JS results include JavaScript term and quad objects, arrays and message containers. Keeping complete results alive can increase heap pressure and garbage collection. The JVM's discard sink has different object lifetimes; an exact allocation comparison needs matching APIs and output retention. [V8's GC documentation](https://github.com/v8/v8/blob/main/docs/heap/garbage-collection.md) describes how object lifetimes affect collection.
- **Wire decoding and object layout.** The JavaScript column reader consumes packed ID/layout arrays, resolves terms and materializes statement columns. Ordinary column-only frames use reusable wire-decoder storage; options, metadata, namespaces and other complex frames use the generated protobuf decoder. The row-layout reader has a different direct wire path. Their setup, lookup and materialization costs can differ even when one encoding has fewer bytes. The measurements do not isolate those costs.
- **Frame and message overhead.** Small per-message frames repeat decode/setup work. Message construction and blank-node scoping add work beyond flat-stream decoding. Workloads with many short messages can spend a larger fraction of time on these fixed costs.
- **JIT and runtime behavior.** V8 and GraalVM differ in inlining, specialization, escape analysis, object representation and GC. JavaScript's dynamic objects and factory calls may interact differently with these mechanisms than the JVM implementation's data structures. [GraalVM's compiler documentation](https://www.graalvm.org/latest/reference-manual/java/compiler/) describes inlining and partial escape analysis that can remove some allocations. These measurements do not isolate a language-level cost or show that V8 cannot achieve similar relative gains.
- **Writing and dictionary policy.** Lookup probes, dictionary policy, full IRI strings, protobuf assembly and collecting byte buffers all contribute to JavaScript serialization work. The JVM's writer and null-output API exercise different compression choices and allocation lifetimes.
- **Hardware and benchmark setup.** CPU architecture, frequency, memory behavior, affinity, data selection and warmup duration affect absolute rates. Ratios against text parsers also depend on which text libraries and configurations are compared.

A controlled explanation would require identical input bytes, factory semantics, validation, scope handling, frame sizes and output retention, with separate wire-decoding, RDF-materialization and allocation measurements. Neither a smaller file nor a difference between two end-to-end medians isolates one of those costs.

## Environment and scope

- Node v25.9.0, V8 14.1.146.11-node.25; linux 6.8.0-146-generic.
- CPU: 12th Gen Intel(R) Core(TM) i7-1265U; 12 logical CPUs; 30.8 GiB RAM.
- Packages at measurement: `n3@2.13.12`, `n3.js-messages@0.2.0`, `rdf-isomorphic@2.0.1`, `protobufjs@8.8.1`, `rdfjs-jelly@0.1.6`.
- Compression libraries: zlib 1.3.1-e00f703, zstd 1.5.7.
- Measured ESM bundle SHA-256: `d551cc756e85a2d61c8e89d4ffa65b09771eda14ada0781e2544446dcf4c10f0`.

The recorded bundle matches the current runtime build. All six datasets contain triples; they do not measure named-graph, RDF-star, RDF 1.2 term, SPARQL result, browser, network or slow-consumer throughput. The measurements characterize these dataset/library/API combinations, not universal format rankings.

## Validation

| Check | Result |
| --- | --- |
| npm run check | Passed: types, lint, protobuf reproducibility, Node/browser builds and declarations, 578 unit tests with coverage, 4 performance harness tests, package checks |
| node --test perf/message-workload.test.mjs | 5 tests passed |
| npm run test:interop | 32 RDF and 25 SPARQL writer fixtures verified by independent upstream Python decoders |
| npm run test:browser | Passed with installed Chromium: packaged ESM and global browser bundles, RDF/SPARQL and Web Streams round trips |
| Current-parser RiverBench semantic checks | All 6 datasets passed: 60,000 messages, 2,103,143 statements, RDF equivalence and blank-node scopes |
| Original archive checksums | 18/18 matched |
| Writer output repeatability | 72/72 hashes identical across runs: 54 default writer/codec outputs and 18 packed writer/codec outputs |

## Input provenance and reproduction

The RiverBench dataset links above describe the data and licensing. For each dataset, download the three filenames listed under Workload and method from `https://github.com/RiverBench/dataset-DATASET/releases/download/dev/`. Development distributions can change; the original gzip/tar.gz SHA-256 values are recorded here so input identity can be checked without another report.

| Dataset | Distribution | Download SHA-256 |
| --- | --- | --- |
| assist-iot-weather | `stream_10K.tar.gz` | `bd6c455b210fea9938acac269bce267ebde6d7c30ee78e341ea07d5389d4cab0` |
| assist-iot-weather | `jelly_10K.jelly.gz` | `9020ed3c43821f2d12faeb90f8308018a925a8770109de7b07a777976905837b` |
| assist-iot-weather | `jelly_10K.2.jelly.gz` | `91016bca4594445edb97ad67ec8e76a5f3c2213487671a676e67ec8ad7da8c41` |
| citypulse-traffic | `stream_10K.tar.gz` | `e896d851cb796c1334fc1155b38212a6ea9efe736d8c30a9c9d2a271afb4b9b1` |
| citypulse-traffic | `jelly_10K.jelly.gz` | `56cd04abf1d0c89f257a50863913329480f518524867d8e041fdff8ebd1d532a` |
| citypulse-traffic | `jelly_10K.2.jelly.gz` | `58f8f1fc65714f2977a05024c548b0c0d7dcb241e3861a4869c091c5a5a9b331` |
| digital-agenda-indicators | `stream_10K.tar.gz` | `c0e610ee1a33a13d820d0cf24a5fbddcb8b26878d5bc8f827caec1d9e3b1c3a9` |
| digital-agenda-indicators | `jelly_10K.jelly.gz` | `0fcc449efaaf580136d0d08230126604c4540236bf6ffe971876d7076f1fc1a1` |
| digital-agenda-indicators | `jelly_10K.2.jelly.gz` | `4ebfe110d4e2c752f38d054ca755e1920f4ad7e1bdae57abcd6de90c291523f1` |
| linked-spending | `stream_10K.tar.gz` | `b47ba5dd8a6b31f0d411866a2e1e610d2485f5bf2ff3c8fd9375381538a8c8e6` |
| linked-spending | `jelly_10K.jelly.gz` | `222c07007adf1c3be787221aa4fc54ee7824540e33783a80f5831914184db25c` |
| linked-spending | `jelly_10K.2.jelly.gz` | `e86018db2e3eb6431173ca7dd4d847fb2843bae1e45f98473b93f582e9ada3ec` |
| muziekweb | `stream_10K.tar.gz` | `fca1a4e575125328dcfa2643bcb9ed8fefa2e6060aef85714e23686c06c5e842` |
| muziekweb | `jelly_10K.jelly.gz` | `1789897eae3744f701ceaea1a88ab9e855575da7a6fa533971f56432cadff084` |
| muziekweb | `jelly_10K.2.jelly.gz` | `63ffb2dc28682bb5ae8393abfd11e907f48def4e18df2b85d536e850e9dbbb85` |
| osm2rdf-denmark | `stream_10K.tar.gz` | `dee12d55164466676951797c1bbb959ab4c5992371b5fa49b646844f9962b370` |
| osm2rdf-denmark | `jelly_10K.jelly.gz` | `d9dd6288758327848074af45f56d5aa0783b7a3d0fdc07d0c901015da67ed20e` |
| osm2rdf-denmark | `jelly_10K.2.jelly.gz` | `4a2b4d2f2456c49facc2e4cd75dae454c6433c79e529e60e4f76b52985beaf27` |

The message-comparison harness requires Node with zstd support, Python 3, curl and the locked development dependencies. Build and verify the package, prepare the inputs, then run the current implementation's readers, streaming parsers, writers and packed-message cases sequentially:

```sh
npm ci --ignore-scripts
npm run check
node perf/riverbench-compare.mjs download /tmp/rdfjs-jelly-data
node perf/riverbench-compare.mjs prepare /tmp/rdfjs-jelly-data
node perf/riverbench-recheck.mjs /tmp/rdfjs-jelly-data /tmp/jelly-results 7
node perf/riverbench-report.mjs /tmp/jelly-results-reads.json \
  /tmp/jelly-results-writers.json PERFORMANCE.md \
  /tmp/jelly-results-packing.json /tmp/jelly-results-packed-reads.json
```

Preparation checks RDF equivalence and message scopes. The recheck command verifies all six datasets again with the current parser, rechecks input hashes, measures all configurations and validates writer output outside timing. Use the checksum table above to verify downloaded bytes before preparing an exact rerun. Downloads and prepared datasets stay outside the repository. For a single-dataset smoke read/write run, append `assist-iot-weather` to download/prepare and use `run` and `followup` with `3 assist-iot-weather` after the output filename. A smoke run is a new measurement with fewer iterations, not the six-dataset result above.
