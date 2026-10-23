import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { MAX_DECODED_LOOKUP_SIZE, RDF_DIR_LANG_STRING, RDF_LANG_STRING } from '../options';
import { Message, type ParserOptions, type StreamOptions } from '../types';
import type { DecoderEvents } from './Decoder';
import { DataFactory } from '../rdfjs/adapter';
import { LookupDecoder } from './LookupDecoder';

type P = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type T = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
type L = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;
function fail(message: string): never { throw new JellyConformanceError(message); }

/** The column layout has independent IRI inference sequences and message boundaries. */
export class ColumnDecoder {
  public streamOptions?: StreamOptions;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null);
  private readonly factory: RDF.DataFactory;
  private names!: LookupDecoder;
  private prefixes!: LookupDecoder;
  private datatypes!: LookupDecoder;
  private current: RDF.Quad[] = [];
  private counter = 0;
  private readonly blankNodes = new Map<string, RDF.BlankNode>();
  private readonly usedBlankLabels = new Set<string>();

  public constructor(private readonly options: ParserOptions, private readonly events: DecoderEvents) {
    this.factory = options.factory ?? DataFactory;
    if (options.maxRowsPerBatch !== undefined && (!Number.isInteger(options.maxRowsPerBatch) || options.maxRowsPerBatch < 0)) fail('maxRowsPerBatch must be a nonnegative integer');
  }

  public decode(frame: P): Message[] {
    const out: Message[] = [];
    const metadata = new Map(Object.entries(frame.metadata).map(([k, v]) => [k, new Uint8Array(v)]));
    const endMessage = (): void => {
      out.push(new Message(this.counter++, this.current, metadata));
      this.current = [];
    };
    if (frame.rows.length > 1) fail('Column layout permits only one options row per frame');
    for (const row of frame.rows) {
      const kind = (row as typeof row & { $row?: string }).$row ?? row.row;
      if (kind !== 'options') fail('Row layout data is invalid in a column stream');
      const raw = row.options as unknown as StreamOptions & { streamType: number; rdfVersion: number };
      const old = this.streamOptions;
      if (raw.version !== 3) fail('Cannot change Jelly layout within a stream');
      if (raw.generalizedStatements || raw.rdfStar || raw.logicalType) fail('Row layout options are invalid in a column stream');
      if (raw.physicalType !== 1 && raw.physicalType !== 2) fail('Column streams require physical type TRIPLES or QUADS');
      if (raw.streamType !== 0 && raw.streamType !== 1) fail(`Unknown RDF stream type ${raw.streamType}`);
      if (raw.rdfVersion < 0 || raw.rdfVersion > 3) fail(`Unknown RDF version ${raw.rdfVersion}`);
      if (old && (raw.physicalType !== old.physicalType || raw.streamType !== old.streamType)) fail('Restated options must preserve physical type, stream type, and version');
      if (old?.streamType === 1) {
        if (this.current.length) endMessage();
        this.blankNodes.clear();
      }
      const limit = this.options.maxLookupTableSize ?? MAX_DECODED_LOOKUP_SIZE;
      if (raw.maxNameTableSize < 128) fail('Column streams require a name lookup size of at least 128');
      this.names = new LookupDecoder(raw.maxNameTableSize, limit);
      this.prefixes = new LookupDecoder(raw.maxPrefixTableSize, limit);
      this.datatypes = new LookupDecoder(raw.maxDatatypeTableSize, limit);
      this.streamOptions = {
        streamName: raw.streamName, physicalType: raw.physicalType, logicalType: 0, generalizedStatements: false, rdfStar: false,
        maxNameTableSize: raw.maxNameTableSize, maxPrefixTableSize: raw.maxPrefixTableSize, maxDatatypeTableSize: raw.maxDatatypeTableSize,
        version: 3, streamType: raw.streamType, rdfVersion: raw.rdfVersion,
      };
      this.events.options?.(this.streamOptions);
    }
    const b = frame.columns as eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch | null;
    if (!b) return out;
    if (!this.streamOptions) fail('Column batch before stream options');
    const n = b.rowCount;
    const limit = this.options.maxRowsPerBatch ?? 1_048_576;
    if (n > 0x7ffffff || n > limit) fail('Column row_count exceeds configured size limit');
    for (const [entries, table] of [[b.names, this.names], [b.prefixes, this.prefixes], [b.datatypes, this.datatypes]] as const) {
      for (const rawEntry of entries) {
        const entry = rawEntry as eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked;
        for (let j = 0; j < entry.values.length; j++) table.assign(j === 0 ? entry.id : 0, entry.values[j]!);
      }
    }
    const nsState = [0, 0];
    for (const rawNs of b.namespaces) {
      const ns = rawNs as eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration;
      const term = this.iri((ns.value ?? {}) as I, nsState);
      this.namespaces[ns.name] = term;
      this.events.namespace?.(ns.name, term);
    }
    if (this.streamOptions.physicalType === 1 && b.graphs) fail('Graphs column in a TRIPLES stream');
    const columns = [b.subjects, b.predicates, b.objects, b.graphs].map(c => this.column(c as C | null, n));
    const lengths = b.messageLengths;
    if (this.streamOptions.streamType === 0 && lengths.length) fail('Message boundaries in a FLAT stream');
    if (lengths.reduce((sum, v) => sum + v, 0) > n) fail('Message lengths exceed row_count');
    let pos = 0;
    const append = (count: number): void => {
      for (const end = pos + count; pos < end; pos++) {
        // Remap blank nodes per logical message, including those in triple terms.
        const [s, p, o, g] = columns.map(c => c[pos]);
        if (!s || (s.termType !== 'NamedNode' && s.termType !== 'BlankNode')) fail('Invalid or unbound subject in column');
        if (!p || p.termType !== 'NamedNode') fail('Invalid or unbound predicate in column');
        if (!o) fail('Unbound object in column');
        if (g && g.termType !== 'NamedNode' && g.termType !== 'BlankNode') fail('Invalid graph in column');
        this.current.push(this.factory.quad(this.scoped(s) as RDF.Quad_Subject, p, this.scoped(o) as RDF.Quad_Object, g ? this.scoped(g) as RDF.Quad_Graph : this.factory.defaultGraph()));
      }
    };
    for (const length of lengths) {
      append(length);
      endMessage();
      this.blankNodes.clear();
    }
    append(n - pos);
    // FLAT streams expose batches through the existing message API; only
    // MESSAGES streams retain an unfinished message across frame boundaries.
    if (this.streamOptions.streamType === 0) endMessage();
    return out;
  }

  public finish(): Message[] {
    if (!this.streamOptions) fail('No Jelly stream options row was found');
    if (!this.current.length) return [];
    const out = new Message(this.counter++, this.current);
    this.current = [];
    return [out];
  }

  private scoped(term: RDF.Term): RDF.Term {
    if (this.streamOptions!.streamType !== 1) return term;
    if (term.termType === 'Quad') return this.factory.quad(this.scoped(term.subject) as RDF.Quad_Subject, term.predicate as RDF.Quad_Predicate, this.scoped(term.object) as RDF.Quad_Object);
    if (term.termType !== 'BlankNode') return term;
    let node = this.blankNodes.get(term.value);
    if (!node) {
      // Preserve labels in their first scope, and allocate unique labels later.
      let label = term.value;
      while (this.usedBlankLabels.has(label)) label = `jelly${this.counter}_${label}`;
      this.usedBlankLabels.add(label);
      node = this.factory.blankNode(label);
      this.blankNodes.set(term.value, node);
    }
    return node;
  }

  private iri(value: I, state: number[]): RDF.NamedNode {
    state[0] = value.prefixId || state[0]!;
    state[1] = value.nameId || state[1]! + 1;
    return this.resolve(state[0]!, state[1]!);
  }
  private resolve(prefix: number, name: number): RDF.NamedNode {
    return this.factory.namedNode((prefix ? this.prefixes.datatype(prefix) : '') + this.names.datatype(name));
  }
  private datatype(id: number): RDF.NamedNode {
    const value = this.datatypes.datatype(id);
    if (value === RDF_LANG_STRING || value === RDF_DIR_LANG_STRING) fail('Language datatypes require a language tag');
    return this.factory.namedNode(value);
  }
  private literal(lex: string, language?: string, direction = 0, datatype?: number): RDF.Literal {
    if (direction < 0 || direction > 2) fail(`Unknown base direction ${direction}`);
    if (direction && language === undefined) fail('Base direction requires a language tag');
    const term = datatype !== undefined ? this.factory.literal(lex, this.datatype(datatype))
      : direction ? this.factory.literal(lex, { language: language!, direction: direction === 1 ? 'ltr' : 'rtl' })
      : this.factory.literal(lex, language);
    if (direction && (term.direction !== (direction === 1 ? 'ltr' : 'rtl') || term.datatype.value !== RDF_DIR_LANG_STRING)) {
      throw new JellyUnsupportedFeatureError('The RDF data factory does not support directional language literals');
    }
    return term;
  }
  private triple(t: T, state: number[], depth = 1): RDF.Quad {
    if (depth > 64) fail('Triple terms nested too deeply');
    const marked = t as T & { $subject?: string; $object?: string };
    const sk = marked.$subject ?? t.subject;
    const ok = marked.$object ?? t.object;
    const s = sk === 'sIri' ? this.iri(t.sIri as I, state) : sk === 'sBnode' ? this.factory.blankNode(t.sBnode!) : fail('Missing triple term subject');
    if (!t.pIri) fail('Missing triple term predicate');
    const p = this.iri(t.pIri as I, state);
    let o: RDF.Quad_Object;
    if (ok === 'oIri') o = this.iri(t.oIri as I, state);
    else if (ok === 'oBnode') o = this.factory.blankNode(t.oBnode!);
    else if (ok === 'oTripleTerm') o = this.triple(t.oTripleTerm as T, state, depth + 1);
    else if (ok === 'oLiteral') {
      const l = t.oLiteral as L;
      const k = (l as L & { $literalKind?: string }).$literalKind ?? l.literalKind;
      o = this.literal(l.lex, k === 'langtag' ? l.langtag! : undefined, l.direction, k === 'datatype' ? l.datatype! : undefined);
    } else return fail('Missing triple term object');
    return this.factory.quad(s, p, o);
  }

  private column(c: C | null | undefined, n: number): Array<RDF.Term | undefined> {
    if (!c) return new Array(n);
    const { nameIds, prefixIds, lexValues, literalKinds, langtags, langtagDirections } = c;
    if (![0, 1, nameIds.length].includes(prefixIds.length)) fail('Invalid prefix_ids length');
    if (![0, 1, lexValues.length].includes(literalKinds.length)) fail('Invalid literal_kinds length');
    if (langtagDirections.length && langtagDirections.length !== langtags.length) fail('Invalid langtag_directions length');
    const state = [0, 0];
    const iris = nameIds.map((name, j) => {
      state[1] = name || state[1]! + 1;
      state[0] = prefixIds.length === 1 ? prefixIds[0]! : prefixIds[j] || state[0]!;
      return this.resolve(state[0]!, state[1]!);
    });
    const literals = lexValues.map((lex, j) => {
      const kind = literalKinds.length === 1 ? literalKinds[0]! : literalKinds[j] ?? 0;
      if (kind === 0) return this.literal(lex);
      if (kind % 2) return this.literal(lex, undefined, 0, (kind + 1) / 2);
      const index = kind / 2 - 1;
      if (index >= langtags.length) fail('Invalid language tag index');
      return this.literal(lex, langtags[index]!, langtagDirections[index] ?? 0);
    });
    const tripleState = [0, 0];
    const lists: RDF.Term[][] = [iris, literals, c.bnodes.map(v => this.factory.blankNode(v)), c.tripleTerms.map(t => this.triple(t as T, tripleState))];
    const total = lists.reduce((sum, list) => sum + list.length, 0);
    const used = lists.filter(list => list.length);
    const values: RDF.Term[] = [];
    if (!c.kinds.length && used.length <= 1) { for (const value of used[0] ?? []) values.push(value); }
    else {
      if (c.kinds.length !== Math.ceil(total / 4)) fail('Invalid kinds length');
      if (total % 4 && c.kinds[c.kinds.length - 1]! >>> (2 * (total % 4))) fail('Nonzero unused kinds bits');
      const indices = [0, 0, 0, 0];
      for (let j = 0; j < total; j++) {
        const kind = (c.kinds[j >> 2]! >> (2 * (j & 3))) & 3;
        const value = lists[kind]![indices[kind]!] ;
        indices[kind]!++;
        if (!value) fail('Kinds references missing run value');
        values.push(value);
      }
    }
    const cells: Array<RDF.Term | undefined> = [];
    let i = 0;
    for (let k = 0; k < c.layouts.length; k++) {
      const token = c.layouts[k]!;
      const skip = token >>> 5;
      const kind = (token >>> 4) & 1;
      let length = token & 15;
      if (length === 15) {
        if (++k >= c.layouts.length) fail('Layout escape without extension');
        length += c.layouts[k]!;
      }
      const count = length + (kind ? 1 : 2);
      if (i + skip > values.length || cells.length + skip + count > n) fail('Column layout exceeds bounds');
      for (let j = 0; j < skip; j++) cells.push(values[i++]);
      const value = kind ? undefined : values[i++];
      if (!kind && !value) fail('Repeat run without a value');
      for (let j = 0; j < count; j++) cells.push(value);
    }
    if (cells.length + values.length - i > n) fail('Too many column values');
    while (i < values.length) cells.push(values[i++]);
    cells.length = n;
    return cells;
  }
}
