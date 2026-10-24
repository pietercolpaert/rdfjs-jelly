import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { MAX_DECODED_LOOKUP_SIZE, RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING } from '../options';
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
  protected readonly defaultGraph: RDF.DefaultGraph;
  protected names!: LookupDecoder;
  protected prefixes!: LookupDecoder;
  protected datatypes!: LookupDecoder;
  private readonly iriNodes: Array<RDF.NamedNode | undefined> = [];
  private readonly iriNames: string[] = [];
  private readonly iriPrefixes: string[] = [];
  private readonly datatypeNodes: Array<RDF.NamedNode | undefined> = [];
  private lastNameAssignment = 0;
  private simpleDatatype?: RDF.NamedNode;
  private readonly scopedBlankNodes = new Map<string, RDF.BlankNode>();
  public constructor(protected readonly options: ParserOptions = {}) {
    this.factory = options.factory ?? DataFactory;
    this.defaultGraph = this.factory.defaultGraph();
    if (options.maxRowsPerBatch !== undefined && (!Number.isInteger(options.maxRowsPerBatch) || options.maxRowsPerBatch < 0)) fail('maxRowsPerBatch must be a nonnegative integer');
  }
  protected resetLookups(raw: { maxNameTableSize: number; maxPrefixTableSize: number; maxDatatypeTableSize: number }): void {
    const limit = this.options.maxLookupTableSize ?? MAX_DECODED_LOOKUP_SIZE;
    if (raw.maxNameTableSize < 128) fail('Column streams require a name lookup size of at least 128');
    this.names = new LookupDecoder(raw.maxNameTableSize, limit);
    this.prefixes = new LookupDecoder(raw.maxPrefixTableSize, limit);
    this.datatypes = new LookupDecoder(raw.maxDatatypeTableSize, limit);
    this.iriNodes.length = this.iriNames.length = this.iriPrefixes.length = this.datatypeNodes.length = 0;
    this.lastNameAssignment = 0;
  }
  protected applyLookups(groups: ReadonlyArray<readonly [readonly eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[], LookupDecoder]>): void {
    for (const [entries, table] of groups) for (const entry of entries) {
      const values = entry.values ?? [];
      for (let j = 0; j < values.length; j++) {
        const id = j === 0 ? entry.id ?? 0 : 0;
        table.assign(id, values[j]!);
        if (table === this.names) {
          const slot = id || this.lastNameAssignment + 1;
          this.lastNameAssignment = slot;
          if (this.iriNames[slot] !== values[j]) this.iriNodes[slot] = undefined;
        }
      }
    }
  }
  protected checkRowCount(n: number): void {
    if (n > 0x7ffffff || n > (this.options.maxRowsPerBatch ?? 1_048_576)) fail('Column row_count exceeds configured size limit');
  }
  protected resetBlankNodeScope(): void { this.scopedBlankNodes.clear(); }
  protected scopeTerm(term: RDF.Term, scope: number): RDF.Term {
    if (term.termType === 'Quad') return this.factory.quad(
      this.scopeTerm(term.subject, scope) as RDF.Quad_Subject,
      term.predicate as RDF.Quad_Predicate,
      this.scopeTerm(term.object, scope) as RDF.Quad_Object,
      this.defaultGraph,
    );
    if (term.termType !== 'BlankNode') return term;
    let node = this.scopedBlankNodes.get(term.value);
    if (!node) {
      // Prefix every label, including the first scope. The canonical numeric
      // scope and delimiter make this injective without retaining past labels.
      node = this.factory.blankNode(`b${scope}_${term.value}`);
      this.scopedBlankNodes.set(term.value, node);
    }
    return node;
  }
  protected iri(value: I, state: number[]): RDF.NamedNode {
    state[0] = value.prefixId || state[0]!;
    state[1] = value.nameId || state[1]! + 1;
    return this.resolve(state[0]!, state[1]!);
  }
  protected resolve(prefix: number, name: number): RDF.NamedNode {
    // Bounded by name slots. Name updates invalidate their slot; prefix values
    // are checked on use because either lookup may have been overwritten.
    const prefixValue = prefix ? this.prefixes.datatype(prefix) : '';
    const cached = this.iriNodes[name];
    if (cached && this.iriPrefixes[name] === prefixValue) return cached;
    const nameValue = this.names.datatype(name);
    const node = this.factory.namedNode(prefixValue + nameValue);
    this.iriNames[name] = nameValue;
    this.iriPrefixes[name] = prefixValue;
    this.iriNodes[name] = node;
    return node;
  }
  protected datatype(id: number): RDF.NamedNode {
    const value = this.datatypes.datatype(id);
    if (value === RDF_LANG_STRING || value === RDF_DIR_LANG_STRING) fail('Language datatypes require a language tag');
    const cached = this.datatypeNodes[id];
    if (cached?.value === value) return cached;
    const node = this.factory.namedNode(value);
    this.datatypeNodes[id] = node;
    return node;
  }
  protected literal(lex: string, language?: string, direction = 0, datatype?: number): RDF.Literal {
    if (direction < 0 || direction > 2) fail(`Unknown base direction ${direction}`);
    if (direction && language === undefined) fail('Base direction requires a language tag');
    const term = datatype !== undefined ? this.factory.literal(lex, this.datatype(datatype))
      : direction ? this.factory.literal(lex, { language: language!, direction: direction === 1 ? 'ltr' : 'rtl' })
      : language ? this.factory.literal(lex, language)
      : this.factory.literal(lex, this.simpleDatatype ??= this.factory.namedNode(XSD_STRING));
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

  protected column(c: C | null | undefined, n: number, target?: Array<RDF.Term | undefined>): ReadonlyArray<RDF.Term | undefined> {
    const cells = target ?? [];
    if (!c) {
      for (let j = 0; j < n; j++) cells[j] = undefined;
      cells.length = n;
      return cells;
    }
    const { nameIds, prefixIds, lexValues, literalKinds, langtags, langtagDirections } = c;
    if (prefixIds.length !== 0 && prefixIds.length !== 1 && prefixIds.length !== nameIds.length) fail('Invalid prefix_ids length');
    if (literalKinds.length !== 0 && literalKinds.length !== 1 && literalKinds.length !== lexValues.length) fail('Invalid literal_kinds length');
    if (langtagDirections.length && langtagDirections.length !== langtags.length) fail('Invalid langtag_directions length');
    const total = nameIds.length + lexValues.length + c.bnodes.length + c.tripleTerms.length;
    let uniform = -1, populated = 0;
    if (nameIds.length) { uniform = 0; populated++; }
    if (lexValues.length) { uniform = 1; populated++; }
    if (c.bnodes.length) { uniform = 2; populated++; }
    if (c.tripleTerms.length) { uniform = 3; populated++; }
    const mixed = c.kinds.length !== 0 || populated > 1;
    if (mixed) {
      if (c.kinds.length !== Math.ceil(total / 4)) fail('Invalid kinds length');
      if (total % 4 && c.kinds[c.kinds.length - 1]! >>> (2 * (total % 4))) fail('Nonzero unused kinds bits');
    }
    let next = 0, iriIndex = 0, literalIndex = 0, blankIndex = 0, tripleIndex = 0;
    let prefixId = 0, nameId = 0;
    const tripleState = [0, 0];
    // Consume each run directly into its final cells. There are no per-kind
    // term arrays or mixed-value array, and a repeat run decodes its node once.
    const read = (): RDF.Term => {
      if (next >= total) return fail('Column layout references missing run value');
      const kind = mixed ? (c.kinds[next >> 2]! >> (2 * (next & 3))) & 3 : uniform;
      next++;
      if (kind === 0) {
        if (iriIndex >= nameIds.length) return fail('Kinds references missing run value');
        nameId = nameIds[iriIndex] || nameId + 1;
        prefixId = prefixIds.length === 1 ? prefixIds[0]! : prefixIds[iriIndex] || prefixId;
        iriIndex++;
        return this.resolve(prefixId, nameId);
      }
      if (kind === 1) {
        if (literalIndex >= lexValues.length) return fail('Kinds references missing run value');
        const j = literalIndex++;
        const literalKind = literalKinds.length === 1 ? literalKinds[0]! : literalKinds[j] ?? 0;
        if (literalKind === 0) return this.literal(lexValues[j]!);
        if (literalKind % 2) return this.literal(lexValues[j]!, undefined, 0, (literalKind + 1) / 2);
        const index = literalKind / 2 - 1;
        if (index >= langtags.length) return fail('Invalid language tag index');
        return this.literal(lexValues[j]!, langtags[index]!, langtagDirections[index] ?? 0);
      }
      if (kind === 2) {
        if (blankIndex >= c.bnodes.length) return fail('Kinds references missing run value');
        return this.factory.blankNode(c.bnodes[blankIndex++]!);
      }
      if (tripleIndex >= c.tripleTerms.length) return fail('Kinds references missing run value');
      return this.triple(c.tripleTerms[tripleIndex++] as T, tripleState);
    };
    let pos = 0;
    for (let k = 0; k < c.layouts.length; k++) {
      const token = c.layouts[k]!, skip = token >>> 5, unbound = (token >>> 4) & 1;
      let length = token & 15;
      if (length === 15) {
        if (++k >= c.layouts.length) fail('Layout escape without extension');
        length += c.layouts[k]!;
      }
      const count = length + (unbound ? 1 : 2);
      if (next + skip > total || pos + skip + count > n) fail('Column layout exceeds bounds');
      for (let j = 0; j < skip; j++) cells[pos++] = read();
      const value = unbound ? undefined : read();
      for (let j = 0; j < count; j++) cells[pos++] = value;
    }
    if (pos + total - next > n) fail('Too many column values');
    while (next < total) cells[pos++] = read();
    // Overwrite all padding and truncate the tail so reused buffers retain no
    // terms from previous frames, including after a very large batch.
    while (pos < n) cells[pos++] = undefined;
    cells.length = n;
    return cells;
  }
}
