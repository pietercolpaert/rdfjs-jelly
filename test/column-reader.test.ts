import { Reader, Writer as WireWriter } from 'protobufjs/minimal.js';
import type * as RDF from '@rdfjs/types';
import { ColumnFrameReader } from '../src/codec/ColumnFrameReader';
import { proto } from '../src/generated/rdf_pb';
import { DataFactory, Message, Parser } from '../src';

type Frame = InstanceType<typeof proto.RdfStreamFrame>;
type Column = InstanceType<typeof proto.RdfColumn>;
const bytes = (frame: Parameters<typeof proto.RdfStreamFrame.encode>[0]): Uint8Array => proto.RdfStreamFrame.encode(frame).finish();
const frame = (batch: Uint8Array): Uint8Array => WireWriter.create().uint32(18).bytes(batch).finish();
const concat = (...inputs: Uint8Array[]): Uint8Array => Buffer.concat(inputs);
const encodeBatch = (batch: Parameters<typeof proto.RdfColumnBatch.encode>[0]): Uint8Array => proto.RdfColumnBatch.encode(batch).finish();
function normalized(value: Frame): unknown {
  const column = (c: Column | null | undefined): unknown => c ? {
    kinds: [...c.kinds], layouts: c.layouts, names: c.nameIds, prefixes: c.prefixIds,
    lex: c.lexValues, literalKinds: c.literalKinds, langtags: c.langtags,
    directions: c.langtagDirections, blanks: c.bnodes,
    triples: c.tripleTerms.map(t => [...proto.RdfTripleTerm.encode(t).finish()]),
  } : null;
  const b = value.columns as InstanceType<typeof proto.RdfColumnBatch> | null;
  return JSON.parse(JSON.stringify({
    rows: value.rows.map(r => [...proto.RdfStreamRow.encode(r).finish()]),
    metadata: Object.fromEntries(Object.entries(value.metadata).map(([k, v]) => [k, [...v]])),
    columns: b ? { rows: b.rowCount, lengths: b.messageLengths,
      names: b.names.map(e => [e.id, e.values]), prefixes: b.prefixes.map(e => [e.id, e.values]),
      datatypes: b.datatypes.map(e => [e.id, e.values]),
      namespaces: b.namespaces.map(ns => [...proto.RdfNamespaceDeclaration.encode(ns).finish()]),
      subjects: column(b.subjects as Column), predicates: column(b.predicates as Column),
      objects: column(b.objects as Column), graphs: column(b.graphs as Column),
    } : null,
  }));
}
const options = { physicalType: 1, streamType: 1, version: 3, rdfVersion: 1,
  maxNameTableSize: 128, maxPrefixTableSize: 16, maxDatatypeTableSize: 16 };
const delimited = (frames: Parameters<typeof bytes>[0][]): Uint8Array => concat(...frames.map(f => proto.RdfStreamFrame.encodeDelimited(f).finish()));

describe('reusable column protobuf reader', () => {
  it('matches generated protobuf semantics through mixed fast and fallback frames', () => {
    const reader = new ColumnFrameReader();
    const inputs = [
      bytes({ columns: { rowCount: 2, names: [{ id: 1, values: ['urn:a', 'urn:p'] }],
        subjects: { nameIds: [1] }, predicates: { nameIds: [2] }, objects: { lexValues: ['a', 'b'] }, messageLengths: [2] } }),
      bytes({}),
      bytes({ rows: [{ options }], columns: { rowCount: 0 }, metadata: { test: Uint8Array.of(7) } }),
      // Merge repeated singular messages, including multiple column batches.
      concat(bytes({ columns: { rowCount: 2, subjects: { nameIds: [1] } } }), bytes({ columns: { subjects: { nameIds: [2] } } })),
      frame(concat(encodeBatch({ rowCount: 2, subjects: { nameIds: [1] } }), encodeBatch({ subjects: { nameIds: [2] } }))),
      bytes({ columns: { namespaces: [{ name: 'x', value: { nameId: 1 } }] } }),
      bytes({ columns: { objects: { tripleTerms: [{ sIri: { nameId: 1 }, pIri: { nameId: 2 }, oBnode: 'b' }] } } }),
      // Unknown fields inside a column, a batch, and after the frame batch.
      bytes({ columns: { subjects: { nameIds: [1], $unknowns: [Uint8Array.of(0xa0, 6, 1)] } } }),
      frame(concat(encodeBatch({ subjects: { nameIds: [1] } }), Uint8Array.of(0xa0, 6, 1))),
      concat(bytes({ columns: { subjects: { nameIds: [1] } } }), Uint8Array.of(0xa0, 6, 1)),
      // Unpacked numbers interspersed with packed occurrences.
      frame(WireWriter.create().uint32(8).uint32(2).uint32(122).bytes(Uint8Array.of(1)).uint32(120).uint32(1).finish()),
    ];
    for (const input of [...inputs, ...inputs.toReversed()]) {
      const wire = Reader.create(input), limit = wire.len;
      expect(normalized(reader.read(wire, input.length))).toEqual(normalized(proto.RdfStreamFrame.decode(input)));
      expect(wire.pos).toBe(input.length);
      expect(wire.len).toBe(limit);
    }
  });

  it('agrees with the generated reader on deterministic byte mutations and truncations', () => {
    const input = bytes({ columns: { rowCount: 2, names: [{ id: 1, values: ['urn:a', 'urn:p'] }],
      subjects: { nameIds: [1, 2] }, predicates: { nameIds: [2], layouts: [0] },
      objects: { lexValues: ['hello', 'world'], literalKinds: [1] }, datatypes: [{ id: 1, values: ['urn:type'] }], messageLengths: [1, 1] } });
    const optimized = new ColumnFrameReader();
    const compare = (b: Uint8Array): void => {
      let expected: unknown, actual: unknown, rejected = false;
      try { expected = normalized(proto.RdfStreamFrame.decode(b)); } catch { rejected = true; }
      const wire = Reader.create(b);
      try { actual = normalized(optimized.read(wire, b.length)); }
      catch { expect(rejected).toBe(true); expect(wire.len).toBe(b.length); return; }
      expect(rejected).toBe(false);
      expect(actual).toEqual(expected);
      expect(wire.pos).toBe(b.length);
    };
    for (let n = 0; n <= input.length; n++) compare(input.subarray(0, n));
    let seed = 8417;
    for (let n = 0; n < 1000; n++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const changed = input.slice();
      const index = seed % changed.length;
      changed[index] = changed[index]! ^ ((seed >>> 16) & 255);
      compare(changed);
    }
  });

  it('rejects overflowing nested length prefixes without wrapping them to zero', () => {
    const overflow = Uint8Array.of(0x80, 0x80, 0x80, 0x80, 0x10);
    const inputs = [
      concat(Uint8Array.of(18), overflow),
      frame(concat(Uint8Array.of(18), overflow)),
      frame(concat(Uint8Array.of(50), overflow)),
    ];
    const optimized = new ColumnFrameReader();
    for (const input of inputs) {
      expect(() => proto.RdfStreamFrame.decode(input)).toThrow();
      const reader = Reader.create(input);
      expect(() => optimized.read(reader, input.length)).toThrow();
      expect(reader.len).toBe(input.length);
    }
  });
});

describe('column node caches and buffer ownership', () => {
  it('keeps retained packed messages separate and assigns metadata at their terminating boundary', () => {
    const input = delimited([{ rows: [{ options }] }, { columns: {
      rowCount: 3, names: [{ id: 1, values: ['urn:s', 'urn:p'] }],
      subjects: { nameIds: [1], layouts: [1] }, predicates: { nameIds: [2], layouts: [1] },
      objects: { lexValues: ['a', 'b', 'c'] }, messageLengths: [1, 1],
    }, metadata: { first: Uint8Array.of(1) } }, { columns: {
      rowCount: 2, subjects: { nameIds: [1], layouts: [0] }, predicates: { nameIds: [2], layouts: [0] },
      objects: { lexValues: ['d', 'e'] }, messageLengths: [1, 1],
    }, metadata: { last: Uint8Array.of(2) } }]);
    const messages = new Parser().parseMessages(input);
    input.fill(0);
    expect(messages.map(m => m.length)).toEqual([1, 1, 2, 1]);
    expect(messages.map(m => m.messageCounter)).toEqual([0, 1, 2, 3]);
    expect(messages.every(m => m instanceof Message)).toBe(true);
    expect(messages.map(m => m.map(q => q.object.value))).toEqual([['a'], ['b'], ['c', 'd'], ['e']]);
    expect(messages.map(m => [...m.metadata.keys()])).toEqual([['first'], ['first'], ['last'], ['last']]);
    expect([...messages[0]!.metadata.get('first')!]).toEqual([1]);
    expect([...messages[2]!.metadata.get('last')!]).toEqual([2]);
    expect(messages[0]!.map(q => q)).not.toBeInstanceOf(Message);
    messages[0]!.push(messages[3]![0]!);
    expect(messages.slice(1).map(m => m.length)).toEqual([1, 2, 1]);
  });

  it('returns independent Message arrays for flat batches, including an empty batch', () => {
    const messages = new Parser().parseMessages(delimited([
      { rows: [{ options: { ...options, streamType: 0 } }] },
      { columns: { rowCount: 1, names: [{ id: 1, values: ['urn:s', 'urn:p'] }],
        subjects: { nameIds: [1] }, predicates: { nameIds: [2] }, objects: { lexValues: ['first'] } } },
      { columns: { rowCount: 0 } },
      { columns: { rowCount: 1, subjects: { nameIds: [1] }, predicates: { nameIds: [2] }, objects: { lexValues: ['last'] } } },
    ]));
    expect(messages.every(m => m instanceof Message)).toBe(true);
    expect(messages.map(m => m.messageCounter)).toEqual([0, 1, 2]);
    expect(messages.map(m => m.length)).toEqual([1, 0, 1]);
    messages[1]!.push(messages[2]![0]!);
    expect(messages[0]![0]!.object.value).toBe('first');
    expect(messages[2]).toHaveLength(1);
  });

  it('invalidates cached nodes on name, prefix, datatype and options replacement', () => {
    const make = (prefix: string, name: string, datatype: string): Parameters<typeof bytes>[0] => ({ columns: {
      rowCount: 1, names: [{ id: 1, values: [name, 'p'] }], prefixes: [{ id: 1, values: [prefix] }],
      datatypes: [{ id: 1, values: [datatype] }], subjects: { nameIds: [1], prefixIds: [1] },
      predicates: { nameIds: [2], prefixIds: [1] }, objects: { lexValues: ['v'], literalKinds: [1] }, messageLengths: [1],
    } });
    const output = new Parser().parseMessages(delimited([{ rows: [{ options }] },
      make('urn:a:', 's', 'urn:t1'), make('urn:a:', 's', 'urn:t1'),
      make('urn:b:', 's', 'urn:t1'), make('urn:b:', 'new', 'urn:t2'),
      { rows: [{ options }] }, make('urn:c:', 's', 'urn:t3')]));
    expect(output.map(m => m[0]!.subject.value)).toEqual(['urn:a:s', 'urn:a:s', 'urn:b:s', 'urn:b:new', 'urn:c:s']);
    expect(output.map(m => (m[0]!.object as RDF.Literal).datatype.value)).toEqual(['urn:t1', 'urn:t1', 'urn:t1', 'urn:t2', 'urn:t3']);
    expect(output.every(m => m instanceof Message)).toBe(true);
  });

  it('preserves retained output and scopes with a custom factory and reused buffers', () => {
    let created = 0;
    const factory = { ...DataFactory, namedNode<Iri extends string>(value: Iri) { created++; return DataFactory.namedNode(value); } };
    const frames = [{ rows: [{ options }] }, ...Array.from({ length: 40 }, (_, i) => ({ columns: {
      rowCount: 1, names: [{ id: 1, values: [`urn:p${i}`, `urn:o${i}`] }],
      subjects: { bnodes: ['same'] }, predicates: { nameIds: [1] }, objects: { nameIds: [2] }, messageLengths: [1],
    } }))];
    const messages = new Parser({ factory }).parseMessages(delimited(frames));
    expect(created).toBeGreaterThan(0);
    expect(messages.map(m => m[0]!.predicate.value)).toEqual(Array.from({ length: 40 }, (_, i) => `urn:p${i}`));
    expect(messages.map(m => m[0]!.object.value)).toEqual(Array.from({ length: 40 }, (_, i) => `urn:o${i}`));
    expect(new Set(messages.map(m => m[0]!.subject.value)).size).toBe(40);
  });
});
