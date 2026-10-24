import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { MAX_DECODED_LOOKUP_SIZE, RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING } from '../options';
import type { ParserOptions } from '../types';
import { DataFactory } from '../rdfjs/adapter';
import { LookupDecoder } from './LookupDecoder';
import { ReusableColumn } from './ColumnFrameReader';

type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type T = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
type L = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;
function fail(message: string): never { throw new JellyConformanceError(message); }

/**
 * Reusable view of one column plus the position state while decoding it. Lists
 * may be longer than their counts when they come from a `ReusableColumn`.
 */
class ColumnCursor {
  layouts: ArrayLike<number> = []; layoutCount = 0;
  nameIds: ArrayLike<number> = []; nameCount = 0;
  prefixIds: ArrayLike<number> = []; prefixCount = 0;
  lexValues: ArrayLike<string> = []; lexCount = 0;
  literalKinds: ArrayLike<number> = []; literalKindCount = 0;
  langtags: ArrayLike<string> = []; langtagCount = 0;
  directions: ArrayLike<number> = []; directionCount = 0;
  bnodes: ArrayLike<string> = []; bnodeCount = 0;
  tripleTerms: ArrayLike<T> = []; tripleCount = 0;
  kinds: Uint8Array = new Uint8Array(); kindsOffset = 0; kindsLength = 0;
  next = 0; iriIndex = 0; literalIndex = 0; blankIndex = 0; tripleIndex = 0;
  prefixId = 0; nameId = 0; total = 0; mixed = false; uniform = -1;
  readonly tripleState = [0, 0];

  load(c: C): void {
    this.layouts = c.layouts; this.nameIds = c.nameIds; this.prefixIds = c.prefixIds; this.lexValues = c.lexValues;
    this.literalKinds = c.literalKinds; this.langtags = c.langtags; this.directions = c.langtagDirections; this.bnodes = c.bnodes;
    this.tripleTerms = c.tripleTerms as T[];
    if (c instanceof ReusableColumn) {
      this.layoutCount = c.layoutCount; this.nameCount = c.nameIdCount; this.prefixCount = c.prefixIdCount; this.lexCount = c.lexCount;
      this.literalKindCount = c.literalKindCount; this.langtagCount = c.langtagCount; this.directionCount = c.directionCount;
      this.bnodeCount = c.bnodeCount; this.tripleCount = 0;
      this.kinds = c.kinds; this.kindsOffset = c.kindsOffset; this.kindsLength = c.kindsLength;
    } else {
      this.layoutCount = c.layouts.length; this.nameCount = c.nameIds.length; this.prefixCount = c.prefixIds.length; this.lexCount = c.lexValues.length;
      this.literalKindCount = c.literalKinds.length; this.langtagCount = c.langtags.length; this.directionCount = c.langtagDirections.length;
      this.bnodeCount = c.bnodes.length; this.tripleCount = c.tripleTerms.length;
      this.kinds = c.kinds; this.kindsOffset = 0; this.kindsLength = c.kinds.length;
    }
    this.next = this.iriIndex = this.literalIndex = this.blankIndex = this.tripleIndex = 0;
    this.prefixId = this.nameId = this.tripleState[0] = this.tripleState[1] = 0;
  }
}

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
  private readonly cursor = new ColumnCursor();
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
  protected applyLookups(entries: readonly eu.ostrzyciel.jelly.core.proto.v1.RdfLookupEntryPacked.$Properties[], table: LookupDecoder): void {
    const isNames = table === this.names;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]!, values = entry.values ?? [];
      for (let j = 0; j < values.length; j++) {
        const id = j === 0 ? entry.id ?? 0 : 0;
        table.assign(id, values[j]!);
        if (isNames) {
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
    const cursor = this.cursor;
    cursor.load(c);
    const { layouts, layoutCount, nameCount, lexCount, bnodeCount, tripleCount, kindsLength } = cursor;
    if (cursor.prefixCount !== 0 && cursor.prefixCount !== 1 && cursor.prefixCount !== nameCount) fail('Invalid prefix_ids length');
    if (cursor.literalKindCount !== 0 && cursor.literalKindCount !== 1 && cursor.literalKindCount !== lexCount) fail('Invalid literal_kinds length');
    if (cursor.directionCount && cursor.directionCount !== cursor.langtagCount) fail('Invalid langtag_directions length');
    const total = nameCount + lexCount + bnodeCount + tripleCount;
    let uniform = -1, populated = 0;
    if (nameCount) { uniform = 0; populated++; }
    if (lexCount) { uniform = 1; populated++; }
    if (bnodeCount) { uniform = 2; populated++; }
    if (tripleCount) { uniform = 3; populated++; }
    const mixed = kindsLength !== 0 || populated > 1;
    if (mixed) {
      if (kindsLength !== Math.ceil(total / 4)) fail('Invalid kinds length');
      if (total % 4 && cursor.kinds[cursor.kindsOffset + kindsLength - 1]! >>> (2 * (total % 4))) fail('Nonzero unused kinds bits');
    }
    const { nameIds, prefixIds, lexValues, literalKinds, langtags, directions, bnodes, tripleTerms, kinds, kindsOffset } = cursor;
    const { prefixCount, literalKindCount, langtagCount, directionCount } = cursor;
    let next = 0, iriIndex = 0, literalIndex = 0, blankIndex = 0, tripleIndex = 0, prefixId = 0, nameId = 0;
    const tripleState = [0, 0];
    // Consume each run directly into its final cells; a repeat run decodes its node once.
    const read = (): RDF.Term => {
      if (next >= total) return fail('Column layout references missing run value');
      const kind = mixed ? (kinds[kindsOffset + (next >> 2)]! >> (2 * (next & 3))) & 3 : uniform;
      next++;
      if (kind === 0) {
        if (iriIndex >= nameCount) return fail('Kinds references missing run value');
        nameId = nameIds[iriIndex] || nameId + 1;
        prefixId = prefixCount === 1 ? prefixIds[0]! : prefixIds[iriIndex] || prefixId;
        iriIndex++;
        return this.resolve(prefixId, nameId);
      }
      if (kind === 1) {
        if (literalIndex >= lexCount) return fail('Kinds references missing run value');
        const j = literalIndex++;
        const literalKind = literalKindCount === 1 ? literalKinds[0]! : j < literalKindCount ? literalKinds[j]! : 0;
        if (literalKind === 0) return this.literal(lexValues[j]!);
        if (literalKind % 2) return this.literal(lexValues[j]!, undefined, 0, (literalKind + 1) / 2);
        const index = literalKind / 2 - 1;
        if (index >= langtagCount) return fail('Invalid language tag index');
        return this.literal(lexValues[j]!, langtags[index]!, index < directionCount ? directions[index]! : 0);
      }
      if (kind === 2) {
        if (blankIndex >= bnodeCount) return fail('Kinds references missing run value');
        return this.factory.blankNode(bnodes[blankIndex++]!);
      }
      if (tripleIndex >= tripleCount) return fail('Kinds references missing run value');
      return this.triple(tripleTerms[tripleIndex++]!, tripleState);
    };
    let pos = 0;
    for (let k = 0; k < layoutCount; k++) {
      const token = layouts[k]!, skip = token >>> 5, unbound = (token >>> 4) & 1;
      let length = token & 15;
      if (length === 15) {
        if (++k >= layoutCount) fail('Layout escape without extension');
        length += layouts[k]!;
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
