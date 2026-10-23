import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { MAX_DECODED_LOOKUP_SIZE, RDF_DIR_LANG_STRING, RDF_LANG_STRING } from '../options';
import type { ParserOptions } from '../types';
import { DataFactory } from '../rdfjs/adapter';
import { LookupDecoder } from './LookupDecoder';

type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type T = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
type L = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;
function fail(message: string): never { throw new JellyConformanceError(message); }

/** Shared lookup and term-column decoding for Jelly-RDF and Jelly-SPARQL. */
export class ColumnTermDecoder {
  protected readonly factory: RDF.DataFactory;
  protected names!: LookupDecoder;
  protected prefixes!: LookupDecoder;
  protected datatypes!: LookupDecoder;
  public constructor(protected readonly options: ParserOptions = {}) {
    this.factory = options.factory ?? DataFactory;
    if (options.maxRowsPerBatch !== undefined && (!Number.isInteger(options.maxRowsPerBatch) || options.maxRowsPerBatch < 0)) fail('maxRowsPerBatch must be a nonnegative integer');
  }
  protected resetLookups(raw: { maxNameTableSize: number; maxPrefixTableSize: number; maxDatatypeTableSize: number }): void {
    const limit = this.options.maxLookupTableSize ?? MAX_DECODED_LOOKUP_SIZE;
    if (raw.maxNameTableSize < 128) fail('Column streams require a name lookup size of at least 128');
    this.names = new LookupDecoder(raw.maxNameTableSize, limit);
    this.prefixes = new LookupDecoder(raw.maxPrefixTableSize, limit);
    this.datatypes = new LookupDecoder(raw.maxDatatypeTableSize, limit);
  }
  protected applyLookups(groups: ReadonlyArray<readonly [readonly eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[], LookupDecoder]>): void {
    for (const [entries, table] of groups) for (const entry of entries) {
      const values = entry.values ?? [];
      for (let j = 0; j < values.length; j++) table.assign(j === 0 ? entry.id ?? 0 : 0, values[j]!);
    }
  }
  protected checkRowCount(n: number): void {
    if (n > 0x7ffffff || n > (this.options.maxRowsPerBatch ?? 1_048_576)) fail('Column row_count exceeds configured size limit');
  }
  protected iri(value: I, state: number[]): RDF.NamedNode {
    state[0] = value.prefixId || state[0]!;
    state[1] = value.nameId || state[1]! + 1;
    return this.resolve(state[0]!, state[1]!);
  }
  protected resolve(prefix: number, name: number): RDF.NamedNode {
    return this.factory.namedNode((prefix ? this.prefixes.datatype(prefix) : '') + this.names.datatype(name));
  }
  protected datatype(id: number): RDF.NamedNode {
    const value = this.datatypes.datatype(id);
    if (value === RDF_LANG_STRING || value === RDF_DIR_LANG_STRING) fail('Language datatypes require a language tag');
    return this.factory.namedNode(value);
  }
  protected literal(lex: string, language?: string, direction = 0, datatype?: number): RDF.Literal {
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
  protected triple(t: T, state: number[], depth = 1): RDF.Quad {
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

  protected column(c: C | null | undefined, n: number): Array<RDF.Term | undefined> {
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
