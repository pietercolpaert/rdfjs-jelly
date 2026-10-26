# Performance

Unless stated otherwise, measured 2026-10-25 with rdfjs-jelly 0.2.0. The filter-pushdown section adds separate 0.2.1 measurements from 2026-10-26. Across 6 RiverBench datasets (60,000 messages and 2,103,143 statements), Jelly 1.2 reads at **2.26 million statements/s**, compared with **2.28 million/s** for legacy Jelly row-layout archives (protocol tag 1) and **0.85 million/s** for source-preserving Turtle message logs. For `assist-iot-weather`, locally written Jelly 1.1 (tag 2) parses at **3.08 million statements/s**, versus **4.92 million/s** for packed Jelly 1.2: **1.59×** the throughput, or **59% faster**. These uncompressed reads contain the same 1,150,000 statements and 10,000 messages; framing and dictionary contents differ.

Jelly 1.2 achieves **0.99×** the legacy read throughput and **2.64×** the Turtle throughput. Its downloaded encodings use **26.8% fewer raw bytes**, **16.4% fewer gzip bytes**, and **10.7% fewer zstd bytes** than the legacy archives. All aggregate rates and ratios are geometric means across datasets; they are not pooled throughputs or averages across individual statements.

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

Each retained read/write case runs in a fresh process with 2 warmups and 7 timed iterations. Explicit GC runs before each operation; any GC during the operation stays inside its timing. Medians are reported, without outlier removal. Workers run sequentially; read-case order rotates across datasets and streaming/writer format order alternates. Cases within a worker share a process. There is no CPU affinity, thermal control or confidence interval, so small differences are inconclusive. Listed uncompressed Jelly cases also have an independent process repetition, shown separately below; other cases have one worker process.

All formats are recompressed with gzip level 6 and zstd level 3. Compression is outside read timing; decompression is inside it. These settings differ from the original downloads' gzip settings.

## Retained-message read throughput

All rates are **million statements/s**. These measurements include RDF term, quad and message materialization.

| Dataset | Turtle source | Turtle shared prefixes | Legacy tag 1 | Jelly 1.2 | 1.2 / legacy |
| --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 1.04 | 1.19 | 2.59 | 4.26 | 1.65× |
| citypulse-traffic | 0.93 | 1.28 | 2.68 | 3.05 | 1.14× |
| digital-agenda-indicators | 0.53 | 1.40 | 2.32 | 1.62 | 0.70× |
| linked-spending | 1.01 | 1.26 | 2.46 | 2.34 | 0.95× |
| muziekweb | 0.88 | 1.10 | 1.43 | 1.04 | 0.73× |
| osm2rdf-denmark | 0.84 | 1.09 | 2.51 | 2.61 | 1.04× |

| Input compression | Turtle source | Turtle shared prefixes | Legacy tag 1 | Jelly 1.2 | 1.2 / legacy |
| --- | --- | --- | --- | --- | --- |
| none | 0.85 | 1.21 | 2.28 | 2.26 | 0.99× |
| gzip | 0.82 | 1.08 | 2.00 | 2.00 | 1.00× |
| zstd | 0.84 | 1.02 | 2.22 | 2.10 | 0.95× |

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
| assist-iot-weather | 0.94 | 2.48 | 3.55 | 110 / 101 / 103 |
| citypulse-traffic | 0.70 | 1.86 | 1.67 | 116 / 128 / 129 |
| digital-agenda-indicators | 0.48 | 1.19 | 1.01 | 89 / 73 / 82 |
| linked-spending | 0.87 | 1.31 | 0.99 | 92 / 101 / 107 |
| muziekweb | 0.50 | 0.49 | 0.53 | 86 / 97 / 99 |
| osm2rdf-denmark | 0.87 | 1.57 | 1.49 | 107 / 99 / 129 |

Peak RSS is the operating system's whole-process high-water mark, including startup, imports, input buffers and warmups. It is not parser-only memory or cumulative allocation. Retaining complete RDF arrays is a different memory workload from consuming and discarding a stream. These measurements do not establish a memory bound for arbitrary blank-node-heavy messages, nested triple terms or slow consumers.

## Writer throughput and output size

All writers consume the same decoded source messages. Turtle uses shared prefixes. Jelly uses `Writer.addMessage`, TRIPLES, protocol tag 2 for 1.1 or tag 3 for 1.2, and `messageSize: 1024`. Jelly 1.1 uses logical type GRAPHS; 1.2 uses stream type MESSAGES. The 1.1 size budget includes lookup rows, while the 1.2 budget counts statements, so the same setting does not mean identical physical framing.

This table uses persistent dictionaries and explicitly sets packMessages: false, overriding the 0.2.0 default of true for Jelly 1.2 message streams. Both configurations use messageSize: 1024. Timing includes serialization and collecting the returned output bytes, including UTF-8 encoding for Turtle. It excludes source parsing and compression. Rates are **million statements/s**.

| Dataset | Turtle | Jelly 1.1 | Jelly 1.2 | 1.2 / 1.1 |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 1.19 | 1.57 | 2.40 | 1.53× |
| citypulse-traffic | 1.52 | 1.58 | 1.68 | 1.06× |
| digital-agenda-indicators | 1.52 | 1.01 | 0.91 | 0.90× |
| linked-spending | 1.61 | 1.26 | 1.13 | 0.90× |
| muziekweb | 1.62 | 0.86 | 0.60 | 0.70× |
| osm2rdf-denmark | 1.35 | 1.61 | 1.30 | 0.80× |

| Raw written bytes/statement: dataset | Turtle shared prefixes | Jelly 1.1 | Jelly 1.2 |
| --- | --- | --- | --- |
| assist-iot-weather | 75.33 | 19.53 | 9.35 |
| citypulse-traffic | 91.16 | 34.78 | 26.75 |
| digital-agenda-indicators | 57.80 | 23.13 | 16.36 |
| linked-spending | 108.07 | 37.78 | 32.23 |
| muziekweb | 91.07 | 44.25 | 40.79 |
| osm2rdf-denmark | 65.00 | 33.80 | 25.97 |

| gzip written bytes/statement: dataset | Turtle shared prefixes | Jelly 1.1 | Jelly 1.2 |
| --- | --- | --- | --- |
| assist-iot-weather | 1.61 | 1.21 | 0.53 |
| citypulse-traffic | 8.29 | 8.04 | 7.53 |
| digital-agenda-indicators | 2.29 | 2.50 | 2.49 |
| linked-spending | 8.59 | 8.12 | 8.16 |
| muziekweb | 13.19 | 15.10 | 15.57 |
| osm2rdf-denmark | 7.77 | 9.43 | 7.94 |

| zstd written bytes/statement: dataset | Turtle shared prefixes | Jelly 1.1 | Jelly 1.2 |
| --- | --- | --- | --- |
| assist-iot-weather | 1.28 | 0.80 | 0.53 |
| citypulse-traffic | 8.09 | 7.94 | 7.40 |
| digital-agenda-indicators | 2.41 | 2.54 | 2.41 |
| linked-spending | 7.35 | 7.30 | 7.39 |
| muziekweb | 12.92 | 14.20 | 15.03 |
| osm2rdf-denmark | 7.98 | 9.01 | 7.64 |

The current Jelly 1.2 writer splits IRIs into prefixes and names, uses inferred IDs and repeat runs, and keeps bounded prefix/name/datatype dictionaries across batches by default (persistentLookups: true), including with one frame per message. Entries can be resent after eviction; the recency-aware policy never evicts slots used by the current batch. Setting persistentLookups: false uses batch-local tables; setting lookup.maxPrefixes to 0 disables prefix splitting. Neither alternative is timed here. Message packing is enabled by default in 0.2.0; set packMessages: false for per-message framing. Its encoding and framing choices can differ from the downloaded Jelly 1.2 streams. For example, weather is 9.35 raw bytes/statement locally versus 9.33 in the archive. The archive read/size results and local writer results describe different byte encodings.

## Packed-message configuration

With `packMessages: true` (the default in 0.2.0) and `messageSize: 1024`, messages share column batches and bounded dictionaries remain available across batches. Read throughput on these locally encoded files is **3.89 million statements/s**; writer throughput is **1.76 million/s**, by geometric mean. These are measurements of a current writer configuration, separate from the unchanged archive encodings above.

The following table shows uncompressed read/write throughput and locally written bytes/statement, including framing. gzip uses level 6 and zstd level 3. Compression is excluded from writer timing. Packed reading/writing were measured in separate sequential batches with two warmups and 7 timed iterations per case. They use the same retained-message API, GC policy and source RDF. Output checks cover every message, statement count, RDF equivalence and blank-node scope.

| Dataset | Packed read M/s | Packed write M/s | Raw B/stmt | gzip B/stmt | zstd B/stmt | Frames |
| --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 4.71 | 2.58 | 9.04 | 0.61 | 0.59 | 1,124 |
| citypulse-traffic | 4.70 | 2.22 | 25.55 | 7.58 | 7.14 | 352 |
| digital-agenda-indicators | 3.31 | 1.55 | 12.27 | 1.93 | 1.78 | 81 |
| linked-spending | 3.91 | 1.75 | 29.65 | 7.43 | 6.69 | 155 |
| muziekweb | 2.44 | 1.10 | 32.39 | 13.52 | 13.51 | 51 |
| osm2rdf-denmark | 4.94 | 1.74 | 24.63 | 7.41 | 7.44 | 294 |

| Packed input compression | Read million statements/s |
| --- | --- |
| none | 3.89 |
| gzip | 3.45 |
| zstd | 3.60 |

Packed-file reading achieves 1.70× the downloaded legacy tag-1 archive throughput. The files differ in framing and dictionary contents, so this ratio combines encoding and parser effects. It is not a format-only comparison with the JVM.

Packing buffers output until a batch fills, flush() is called, or the writer ends. Message boundaries and blank-node scopes remain separate; metadata-bearing messages are isolated. Small batches may suit low-latency delivery, whereas larger shared batches amortize setup work. Both configurations use prefix compression and persistent dictionaries; frame packing changes how many messages share a batch.

```js
const writer = new Writer({
  version: 3,
  physicalType: PhysicalStreamType.TRIPLES,
  streamType: RdfStreamType.MESSAGES,
  messageSize: 1024,
  packMessages: true,
});
```

## Parsing locally written output

These cases read the current writer's uncompressed files, rather than the downloaded archives. Both configurations use the same current parser, default RDF/JS factory and retained-message API. Each case has two warmups and seven timed operations in its own fresh process, with GC before each operation. These timings come from a later sequential batch than the main archive/packed tables.

| Dataset | Per-message output read M/s | Packed output read M/s |
| --- | --- | --- |
| assist-iot-weather | 4.84 | 5.58 |
| citypulse-traffic | 4.06 | 4.84 |
| digital-agenda-indicators | 2.25 | 3.64 |
| linked-spending | 2.84 | 4.08 |
| muziekweb | 1.25 | 2.72 |
| osm2rdf-denmark | 3.62 | 5.21 |

Geometric means: 2.88 million statements/s for per-message-framed output and 4.22 million/s for packed output. A writer's encoding choices can change parsing time without a change to parser code. The archive measurements above continue to use their original bytes.

## Pushing down a filter to the parser

Since rdfjs-jelly 0.2.1, `quadPatterns` lets the parser return selected statements:

```ts
import { DataFactory, Parser } from 'rdfjs-jelly';

const parser = new Parser({
  quadPatterns: [{
    predicate: DataFactory.namedNode(
      'http://www.ontology-of-units-of-measure.org/resource/om-2/hasNumericalValue',
    ),
  }],
});
const messages = parser.parseMessages(bytes);
```

Patterns use OR semantics; unspecified positions are wildcards. Jelly 1.1
(protocol tag 2) decodes the terms of every statement, then checks the pattern
before creating its quad. Jelly 1.2 (tag 3) works on the column layout, before
any RDF/JS term or quad exists. Both preserve message counters, metadata and
empty messages, including messages whose statements are all rejected.

This is a selective **full scan**: all input bytes are read, lookup tables are
updated and every value is validated, including in rejected statements. It does
not provide random access, skip file ranges or avoid decompression.

With a predicate filter that keeps about 10% of the statements, the Jelly 1.2
parser filter runs **2.3× faster** than fully parsing and then filtering
(geometric mean over six datasets, steady state; range 1.8–3.6×), **1.9× faster** than a full parse with no filter, and
**2.7× faster** than the Jelly 1.1 parser filter. Filters on a single subject or object IRI
are **2.5× faster** than fully parsing and then filtering. Measurements follow.

### How Jelly 1.2 selects rows

When every pattern pins the same position to an IRI, that column alone chooses
the rows. The positions are tried in the order subject, object, predicate,
graph: subjects and objects have the most distinct values, so they usually
reject the most rows. Per batch the parser then makes these passes:

1. **Scan.** Each column's lists are validated in tight loops, and its IRIs are
   resolved to final lookup ids. No term is built and no literal text is decoded.
   Inferred name and prefix ids make this a sequential pass, but over integers only.
2. **Select.** The selecting column's layout is walked once. Whether an IRI is
   selected is decided once per lookup slot and cached; a cached verdict is
   dropped only when the lookup table reports that its entry was overwritten, so
   a replaced name or prefix cannot leave a stale match. A repeat run is one
   verdict for all of its rows. The result is the ascending list of selected rows.
3. **Gather.** The other columns' layouts are walked against that list. A run
   containing no selected row costs its layout token; values are built only for
   selected rows, and literal text is decoded from the input bytes on demand
   (the frame reader records byte ranges instead of strings).
4. **Assemble.** Quads are built for the selected rows. A message without any
   selected row is constructed directly as an empty `Message`, which is several
   times cheaper than converting an accumulated array (about 0.1 against 0.9 ms per 10,000
   empty messages in a microbenchmark). Patterns that also pin
   other positions check those on the few candidates before the data factory is
   called.

Patterns that share no IRI-pinned position (a literal-only object, or an OR of
patterns on different positions) use a value-based path that builds a lightweight
value for every row. Measured below, it is slower than parsing everything and
filtering afterwards.

### Experiment

The following experiment uses the same six RiverBench datasets as above, with
10,000 messages each, measured on 2026-10-26 with 0.2.1. Each dataset is locally
encoded as actual Jelly 1.1 (tag 2) and packed Jelly 1.2 (tag 3), using TRIPLES,
`messageSize: 1024` and default dictionaries. The 1.1 writer uses logical type
GRAPHS; 1.2 uses stream type MESSAGES and `packMessages: true`. The downloaded
legacy tag-1 archives are not used as the 1.1 baseline.

For each dataset, a single predicate is chosen whose frequency is closest to
10% of its statements; the actual selected fraction is shown below. Parser
filters and the postfilter return the same RDF in each message, checked for
isomorphism outside timing, and the full parse is checked for the complete
statement count. Exact predicates and input hashes are recorded in the
[measurement data](perf/quad-filter-2026-10-26-column-selection.json).

Rates are **million input statements scanned per second**, including rejected
statements. They are not the rate of returned statements. “1.2 postfilter” fully
materializes 1.2 messages, then removes nonmatching quads in place; its timing
includes both parsing and filtering. “1.2 full parse” is the same input parsed
with no filter. All cases retain their selected message arrays until the
operation completes.

Two timing regimes are reported, because they answer different questions:

- **Steady state** measures consecutive parses with no forced GC, five warmups
  and nine timed iterations. The heap stays warm, as in a consumer that parses
  continuously.
- **Forced GC** is the method of the other tables: an explicit GC precedes every
  timed operation, with two warmups.

**Steady state**

| Dataset | Selected | 1.1 parser filter M/s | 1.2 parser filter M/s | 1.2 / 1.1 | 1.2 postfilter M/s | 1.2 filter / postfilter | 1.2 full parse M/s | 1.2 filter / full parse |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 7.83% | 6.37 | 20.79 | 3.26× | 5.78 | 3.60× | 7.40 | 2.81× |
| citypulse-traffic | 11.11% | 4.70 | 10.80 | 2.30× | 5.04 | 2.14× | 6.37 | 1.69× |
| digital-agenda-indicators | 8.63% | 6.03 | 15.81 | 2.62× | 9.03 | 1.75× | 10.41 | 1.52× |
| linked-spending | 6.50% | 4.28 | 15.07 | 3.52× | 6.31 | 2.39× | 6.10 | 2.47× |
| muziekweb | 9.81% | 3.62 | 7.98 | 2.21× | 4.06 | 1.96× | 5.12 | 1.56× |
| osm2rdf-denmark | 6.63% | 4.62 | 12.35 | 2.67× | 5.28 | 2.34× | 6.81 | 1.81× |

Geometric means of the ratios: **2.72×** the 1.1 filter,
**2.30×** the postfilter and **1.92×** a full parse in this run
(2.83×, 2.34× and 1.96× in an
[independent process repetition](perf/quad-filter-2026-10-26-column-selection-repeat.json)).

**Forced GC before every operation**

| Dataset | Selected | 1.1 parser filter M/s | 1.2 parser filter M/s | 1.2 / 1.1 | 1.2 postfilter M/s | 1.2 filter / postfilter | 1.2 full parse M/s | 1.2 filter / full parse |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | 7.83% | 5.84 | 13.20 | 2.26× | 5.92 | 2.23× | 6.33 | 2.09× |
| citypulse-traffic | 11.11% | 3.83 | 6.62 | 1.73× | 3.93 | 1.68× | 4.32 | 1.53× |
| digital-agenda-indicators | 8.63% | 2.36 | 4.27 | 1.81× | 3.16 | 1.35× | 3.74 | 1.14× |
| linked-spending | 6.50% | 3.01 | 4.56 | 1.51× | 3.48 | 1.31× | 3.83 | 1.19× |
| muziekweb | 9.81% | 1.72 | 2.26 | 1.31× | 1.95 | 1.16× | 2.10 | 1.07× |
| osm2rdf-denmark | 6.63% | 3.91 | 5.71 | 1.46× | 4.19 | 1.36× | 4.47 | 1.28× |

Geometric means: **1.65×** the 1.1 filter, **1.48×** the postfilter and
**1.35×** a full parse (1.61×, 1.47× and 1.36× in the repetition).
### Why the two regimes differ

A full garbage collection before an operation makes the **first** parse after it
much slower than the parses that follow, by a fixed amount that does not depend
on how much work the parse does:

| Dataset | Steady-state parse | First parse after a full GC | Second | Fourth |
| --- | --- | --- | --- | --- |
| muziekweb | 6.0 ms | 21.4 ms | 10.0 ms | 7.2 ms |
| linked-spending | 9.4 ms | 30.5 ms | 14.0 ms | 12.0 ms |
| assist-iot-weather | 63.1 ms | 83.6 ms | 57.9 ms | 64.6 ms |

(The 1.2 parser filter with the ~10% predicate. Medians of ten steady parses, and of
five collections each followed by four parses; [raw data](perf/gc-recovery-2026-10-26.json).)
The cause was not isolated. The pattern is consistent with the collector
shrinking the heap and the next parse paying to grow and fault it back in. It
adds about 15–20 ms to the forced-GC timings of these three datasets. That is a large share of
a 10–20 ms parse of a small dataset and a small share of a 100 ms one, which
is why in the forced-GC table the filter's advantage over the postfilter tends to grow with dataset
size (muziekweb, 51,721 statements, gains least; assist-iot-weather,
1,150,000, gains most). The forced-GC regime stays in this report because
it matches the other tables. Steady state is the better guide for a long-running
consumer.

### Filters on other positions

Subject and object patterns use the same column selection. The table
below measures steady-state parsing of the packed Jelly 1.2 input with one IRI
pinned: the subject, or the object, whose frequency is closest to 5% of the
statements (often far lower, since few subjects repeat that much), and that
object together with the predicate it most often appears with. Each dataset
runs in its own process, with five warmups and nine timed iterations
([measurement data](perf/quad-filter-2026-10-26-positions.json)).

| Dataset | Pattern | Selected | Parser filter M/s | Postfilter M/s | Filter / postfilter | Full parse M/s |
| --- | --- | --- | --- | --- | --- | --- |
| assist-iot-weather | subject IRI | 2.61% | 19.38 | 6.02 | 3.22× | 7.57 |
| assist-iot-weather | object IRI | 7.83% | 18.60 | 5.98 | 3.11× | 7.48 |
| assist-iot-weather | predicate + object IRI | 7.83% | 12.85 | 5.59 | 2.30× | 7.42 |
| citypulse-traffic | subject IRI | 0.77% | 9.95 | 4.11 | 2.42× | 6.00 |
| citypulse-traffic | object IRI | 5.56% | 8.56 | 3.62 | 2.37× | 5.70 |
| citypulse-traffic | predicate + object IRI | 5.56% | 6.80 | 4.03 | 1.69× | 5.65 |
| digital-agenda-indicators | subject IRI | 0.01% | 17.68 | 6.52 | 2.71× | 8.90 |
| digital-agenda-indicators | object IRI | 4.55% | 14.52 | 6.72 | 2.16× | 8.94 |
| digital-agenda-indicators | predicate + object IRI | 4.55% | 12.34 | 7.09 | 1.74× | 8.01 |
| linked-spending | subject IRI | 0.06% | 19.47 | 4.22 | 4.62× | 5.22 |
| linked-spending | object IRI | 6.26% | 16.68 | 4.83 | 3.45× | 6.13 |
| linked-spending | predicate + object IRI | 6.26% | 13.31 | 4.89 | 2.72× | 6.29 |
| muziekweb | subject IRI | 0.02% | 9.96 | 3.98 | 2.50× | 4.80 |
| muziekweb | object IRI | 6.44% | 9.77 | 4.67 | 2.09× | 5.47 |
| muziekweb | predicate + object IRI | 6.44% | 8.10 | 4.02 | 2.01× | 5.43 |
| osm2rdf-denmark | subject IRI | 2.96% | 12.39 | 4.28 | 2.89× | 6.79 |
| osm2rdf-denmark | object IRI | 3.16% | 9.43 | 3.88 | 2.43× | 6.45 |
| osm2rdf-denmark | predicate + object IRI | 3.15% | 8.37 | 3.84 | 2.18× | 6.18 |

The geometric mean of filter / postfilter is **2.51×** in this run and
**2.44×** in an [independent repetition](perf/quad-filter-2026-10-26-positions-repeat.json).

Patterns that share no IRI-pinned position take the value-based path described
above, which builds a lightweight value for every row. In a quick steady-state
check on muziekweb, linked-spending and assist-iot-weather (not saved as a data
file), a literal-only object pattern and a subject-OR-object pattern ran at
0.78–0.94× the speed of fully parsing and then filtering, so they are not worth
using for speed.

### Where the time goes

Short CPU profiles of the 1.2 filter on three datasets, and of a full parse for
comparison, sampled every 200 µs over 60 steady-state parses
([profiles](perf/quad-filter-profile-2026-10-26-assist-iot-weather-filter.json),
[muziekweb](perf/quad-filter-profile-2026-10-26-muziekweb-filter.json),
[osm2rdf](perf/quad-filter-profile-2026-10-26-osm2rdf-denmark-filter.json),
[full parse](perf/quad-filter-profile-2026-10-26-muziekweb-plain.json)). Self-time
shares of named functions; they locate costs and are not wall-clock phases.
Sampling inflates the per-parse time.

| Profile | ms per parse | Largest self-time shares among the labelled functions |
| --- | --- | --- |
| assist-iot-weather, filter | 54.9 | packed-list reading 20%; IRI scan 18%; layout walks 15%; statement assembly 6%; UTF-8 decoding 5%; kind scan 4% |
| muziekweb, filter | 7.1 | statement assembly 12%; verdict computation 8%; UTF-8 decoding 7%; layout walks 7%; packed-list reading 7%; IRI scan 5% |
| osm2rdf-denmark, filter | 23.6 | IRI scan 12%; UTF-8 decoding 12%; packed-list reading 11%; statement assembly 8%; layout walks 7%; lookup updates 5% |
| muziekweb, full parse | 11.0 | UTF-8 decoding 19%; message finalization 11%; statement assembly (unfiltered) 8%; packed-list reading 4%; lookup updates 2% |

What remains is largely work the format requires: reading the packed lists
(layouts, name ids, prefix ids), resolving and validating every IRI reference,
and walking layouts. Lookup-name decoding (up to 12% on osm2rdf) is not
deferred, and rejected statements are still validated, so a filtered parse costs
more than the selected fraction alone would suggest.

### Factory calls

The materialization savings are visible independently of the timings. For
assist-iot-weather, selecting 90,000 of 1,150,000 statements makes these calls to
the supplied factory, counted in a separate untimed pass:

| Factory method | 1.1 parser filter | 1.2 parser filter | 1.2 postfilter |
| --- | --- | --- | --- |
| `namedNode` | 2,290,005 | 90,002 | 270,287 |
| `literal` | 210,000 | 90,000 | 210,000 |
| `quad` | 90,000 | 90,000 | 1,150,000 |

These are explicit factory-call counts, not total object allocations, allocated
bytes or peak memory. For example, a factory may create datatype nodes inside
`literal()` without calling its public `namedNode()` method. Both parser filters
avoid creating rejected quads; 1.2 additionally avoids materializing their terms.

### Method

Each dataset runs in a fresh process; the four cases rotate within each
iteration. Timings exclude encoding, file I/O and decompression: both encodings
are reused as raw in-memory buffers. Message and statement counts are checked after
every operation. There is no CPU affinity, thermal control or confidence
interval; the machine was shared with a desktop session, so differences of a
few percent are inconclusive, and the two repetitions above show how far runs
differ. Runtime: Node v25.9.0 / V8 14.1.146.11-node.25 on the Intel i7-1265U
listed below; the 0.2.1 ESM bundle SHA-256 is
`4dde8ac42b922654c9e1beff8449bc8f1fe047bd83c5edafcbe48f3da427201f`.

## Independent read repetition

Each listed uncompressed Jelly case was measured again in a fresh worker, with two warmups and seven timed iterations. This measures process-to-process variation for the same runtime bundle and input bytes. The main tables use the primary run; these repetitions are reported separately. Rates are million statements/s.

| Dataset | Legacy primary | Legacy repetition | Archive 1.2 primary | Archive 1.2 repetition |
| --- | --- | --- | --- | --- |
| assist-iot-weather | 2.59 | 3.14 | 4.26 | 4.66 |
| citypulse-traffic | 2.68 | 3.32 | 3.05 | 4.02 |
| digital-agenda-indicators | 2.32 | 2.93 | 1.62 | 2.35 |
| linked-spending | 2.46 | 3.09 | 2.34 | 2.54 |
| muziekweb | 1.43 | 1.75 | 1.04 | 1.28 |
| osm2rdf-denmark | 2.51 | 2.96 | 2.61 | 3.66 |

Legacy geometric-mean throughput is 2.28 million statements/s in the primary run and 2.81 million/s in the repetition.

Archive 1.2 geometric-mean throughput is 2.26 million statements/s in the primary run and 2.84 million/s in the repetition.

Scheduling, heap behavior and thermal state are not controlled; these measurements do not identify which source of variation dominates.

## Comparison with the JVM measurements

The [Jelly-RDF JVM benchmark](https://jelly-rdf.github.io/1.2.x/performance/rdf/) reports geometric means of about 19–20 million statements/s for Jelly writing and 28–31 million/s for reading across 13 datasets. Its [1.1/1.2 comparison](https://jelly-rdf.github.io/dev/performance/rdf-1-1-vs-1-2/) reports 1.79×–1.94× read throughput and 1.48×–1.54× write throughput for Jelly 1.2 relative to 1.1 within JVM 4.0.0. With per-message framing, JavaScript 1.2 writer throughput is 0.95× the 1.1 writer throughput. With message packing, it is 1.37×; that configuration is timed in a separate batch. The JavaScript archive reader comparison uses legacy tag 1 rather than 1.1, so it does not measure the same format-version ratio as the JVM report.

These are different experiments. The JVM benchmark uses flat triple/quad streams, the first 100,000 statements of each dataset, three JVM forks with timed warmup/measurement periods, a discard sink for reading and a null output stream for writing. The version comparison uses 1,024-row frames. It runs GraalVM on an NVIDIA DGX Spark with CPU affinity. Optional validation, blank-node relabeling and pretty-printing are disabled where configurable. This JavaScript benchmark uses six message streams, up to 1.15 million statements per case, Node/V8 on an Intel laptop CPU, retained arrays, message-local blank-node scopes and collected writer bytes.

### Where the time goes

Three CPU profiles of the current runtime bundle use the same input bytes and default RDF/JS factory as the throughput tables: the muziekweb archive, locally packed muziekweb and locally packed linked-spending. Each profile follows two warmups and an explicit GC, then samples 20 retained-message parses at 500 µs intervals. They contain 888, 449 and 847 samples respectively. These short profiles indicate where to investigate; they are not precise wall-clock phase measurements. Function shares below are inclusive and can overlap, so they must not be added together. No JVM profile was taken.

**Frame and message costs.** The downloaded archives hold one message per frame: 5.2 statements per frame on muziekweb, 8.2 on digital-agenda-indicators and 15.8 on linked-spending. Packing lets several messages share a frame and amortizes frame setup, but every logical message still needs its own RDF/JS array, counter, metadata and blank-node scope. On packed muziekweb and linked-spending, finalizing the message container accounts for approximately 12% and 6% of samples. At explicit message boundaries, the accumulated quad array becomes the returned message array without copying its quads. The profile does not isolate prototype assignment from the other work in message finalization.

**Wire decoding and RDF materialization.** Across the three profiles, protobuf frame reading accounts for roughly 32–40% of samples and column-to-term decoding for 21–26%. Statement assembly accounts for 7–18%, and UTF-8 string decoding for approximately 10–19%. These categories overlap: string decoding occurs within protobuf reading, for example. Lookup resolution, factory calls, validation and blank-node scoping contribute to the remaining work. The row and column readers use different code paths, so their relative speed also reflects implementation choices.

**Allocation and retention.** Garbage collection accounts for about 5–6% of these sampled runs, including allocations from earlier parses in the same profile. The retained-message API keeps every result alive until a parse completes. A discard sink changes object lifetimes and avoids retaining final result arrays, but can still allocate RDF terms and quads. These profiles do not measure allocated bytes per term or establish an upper bound on parser throughput. The built-in terms and quads store their public fields as own properties; prototype-based alternatives would change enumeration and structural comparisons for callers, and their memory savings have not been measured here.

**Encoding and term construction.** Prefix/name splitting and inferred IDs reduce wire bytes but still require dictionary lookups, string reconstruction and RDF term creation. A separate diagnostic with the current factory counted 270,051 named-node calls for per-message-framed weather and 270,287 when packed; muziekweb required 25,939 and 25,841 respectively. These are factory-call counts, not allocated-byte or CPU measurements. The reader caches one named node per name slot and prefix value. Prefix/name sharing and dictionary replacement affect reuse, so a smaller encoding need not require fewer factory calls or parse faster. Quad counts and RDF content are checked independently.

**Writing.** The current writer splits IRIs into prefixes and names, retains bounded dictionaries across batches, infers IDs and encodes repeated terms. This trades string volume against lookup probes, prefix splitting and dictionary bookkeeping. Per-message framing finishes each message's batch; packing amortizes batch assembly across small messages. The writer tables include collecting serialized bytes and exclude compression. The reader profiles above do not attribute writer costs.

**JavaScript versus JVM.** V8 and GraalVM can differ in inlining, call specialization, object representation, escape analysis and garbage collection. RDF factories, message retention, validation, scope handling, hardware and benchmark setup also differ here. Those are possible explanations for the absolute throughput gap, not measured causes or evidence of an inherent JavaScript speed limit. A controlled explanation would require matching input bytes, factory semantics, validation, scope handling, frame sizes and output retention, with separate wire-decoding, RDF-materialization and allocation measurements.

## Environment and scope

- Node v25.9.0, V8 14.1.146.11-node.25; linux 6.8.0-146-generic.
- CPU: 12th Gen Intel(R) Core(TM) i7-1265U; 12 logical CPUs; 30.8 GiB RAM.
- Packages at measurement: `n3@2.13.12`, `n3.js-messages@0.2.0`, `rdf-isomorphic@2.0.1`, `protobufjs@8.8.1`, `rdfjs-jelly@0.2.0`.
- Compression libraries: zlib 1.3.1-e00f703, zstd 1.5.7.
- Source base revision: `d73c5d6977cedd0acfd89eadb23b89fbd63749bd` (working tree for 0.2.0 with prefix-compressing writer, column message-array ownership, default message packing and public flush APIs).
- Measured ESM bundle SHA-256: `929e01a1a69e303431ceeaddf5f168a53541fb5659a5b1d144bc2b7e575083f4`.

The recorded bundle identifies the 0.2.0 measurements; the filter-pushdown section records its separate 0.2.1 bundle. All six datasets contain triples; they do not measure named-graph, RDF-star, RDF 1.2 term, SPARQL result, browser, network or slow-consumer throughput. The measurements characterize these dataset/library/API combinations, not universal format rankings.

## Validation

| Check | Result |
| --- | --- |
| npm run check | Passed: types, lint, protobuf reproducibility, Node/browser builds and declarations, 603 unit tests with coverage, 4 performance harness tests, package checks |
| node --test perf/message-workload.test.mjs | 5 tests passed |
| npm run test:interop | 32 RDF and 25 SPARQL writer fixtures verified by independent upstream Python decoders |
| npm run test:browser | Passed with installed Chromium: packaged ESM and global browser bundles, RDF/SPARQL and Web Streams round trips |
| Current-parser RiverBench semantic checks | All 6 datasets passed: 60,000 messages, 2,103,143 statements, RDF equivalence and blank-node scopes |
| Original archive checksums | 18/18 matched |
| Local writer checks | All 18 format/dataset combinations and all 6 packed cases passed RDF equivalence and blank-node-scope checks; all 90 raw/gzip/zstd output hashes verified against saved writer outputs |

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

The opening dataset comparison uses locally written Jelly 1.1 (protocol tag 2), not the downloaded tag-1 archive. It was measured in a separate sequential batch with 2 warmups and 7 timed iterations per format, using the same runtime bundle and default retained-message API. The files passed the writer RDF-equivalence and blank-node-scope checks. After recheck, reproduce this case with:

```sh
node --expose-gc perf/riverbench-compare.mjs bench \
  /tmp/rdfjs-jelly-data/assist-iot-weather currentRow11 none 7
node --expose-gc perf/riverbench-compare.mjs bench \
  /tmp/rdfjs-jelly-data/assist-iot-weather jelly12Packed none 7
```


After the recheck has written the local files, measure their retained-message parsing directly. For example, these commands measure default and packed muziekweb output, then profile the packed input. Repeat with each dataset name for the local-read table. Run throughput measurements and profiles sequentially, since profiling perturbs timing.

```sh
node --expose-gc perf/riverbench-compare.mjs bench \
  /tmp/rdfjs-jelly-data/muziekweb currentDefault none 7
node --expose-gc perf/riverbench-compare.mjs bench \
  /tmp/rdfjs-jelly-data/muziekweb jelly12Packed none 7
node --expose-gc perf/column-optimization.mjs --profile dist/index.mjs \
  /tmp/rdfjs-jelly-data/muziekweb /tmp/jelly-profile.json jelly12Packed
```

The profile command performs two warmups and samples 20 parses at 500 µs intervals, recording the runtime and input SHA-256 values. Use `jelly12` for the downloaded column archive or change the dataset directory to profile packed linked-spending.
