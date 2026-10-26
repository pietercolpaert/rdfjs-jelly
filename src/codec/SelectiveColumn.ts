import type { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { RDF_DIR_LANG_STRING, RDF_LANG_STRING } from '../options';
import { ColumnCursor, type ColumnValueReader } from './ColumnTermDecoder';
import type { ColumnValueDecoder } from './ColumnValueDecoder';
import type { LookupDecoder } from './LookupDecoder';
import type { ColumnSelection } from './ColumnSelection';

type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type T = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;
export type ColumnPosition = 'subject' | 'predicate' | 'object' | 'graph';
function fail(message: string): never { throw new JellyConformanceError(message); }

/**
 * Reads a column in two passes so that a filter touches only the rows it keeps.
 *
 * `scan` validates every value of the column in tight loops over its lists and
 * resolves every IRI to final lookup ids. It never builds a term, and it never
 * decodes literal text. Then the layout is walked once: `select` turns the
 * predicate column into the ascending list of selected rows, and `gather`
 * builds values for just those rows in the other columns. Skipping a run costs
 * a token and an index increment, however many rows it covers.
 *
 * Everything the unfiltered reader rejects is rejected here, including in rows
 * that are not selected, because every value is consumed by `scan`.
 */
export class SelectiveColumn {
  /** Ascending rows chosen by `select`; only the first `rowCount` are live. */
  public rows = new Int32Array(0);
  public rowCount = 0;
  private readonly cursor = new ColumnCursor();
  private kindOf = new Uint8Array(0);
  private indexOf = new Int32Array(0);
  private nameOf = new Int32Array(0);
  private prefixOf = new Int32Array(0);
  private verdict = new Uint8Array(0);
  private tripleStates: number[] = [];
  private readonly datatypeStamps: number[] = [];
  private bound = false;
  private total = 0;
  private mixed = false;
  private uniform = -1;

  public constructor(
    private readonly names: LookupDecoder, private readonly prefixes: LookupDecoder,
    private readonly datatypes: LookupDecoder, private readonly validator: ColumnValueDecoder,
  ) {}

  /** Select the rows whose IRI in this column is chosen by `selection`, writing each selected row's IRI into `out`. */
  public select<V>(c: C | null | undefined, n: number, position: ColumnPosition, selection: ColumnSelection, reader: ColumnValueReader<V>, out: Array<V | undefined>): number {
    selection.begin(this.names, this.prefixes);
    this.scan(c, n, position, selection);
    if (this.rows.length < n) this.rows = new Int32Array(Math.max(n, 2 * this.rows.length));
    const rows = this.rows, verdict = this.verdict, nameOf = this.nameOf, prefixOf = this.prefixOf, total = this.total;
    const mixed = this.mixed, uniform = this.uniform, kindOf = this.kindOf, indexOf = this.indexOf;
    const { layouts, layoutCount } = this.cursor;
    const required = position !== 'graph';
    let count = 0, pos = 0, next = 0;
    // Only an IRI can be selected; every other kind of value is skipped.
    const take = (length: number): void => {
      if ((mixed ? kindOf[next] : uniform) === 0) {
        const index = mixed ? indexOf[next]! : next;
        if (verdict[index]) {
          const value = reader.iri(prefixOf[index]!, nameOf[index]!);
          for (let i = 0; i < length; i++) { rows[count] = pos + i; out[count++] = value; }
        }
      }
      next++;
      pos += length;
    };
    for (let k = 0; k < layoutCount; k++) {
      const token = layouts[k]!, skip = token >>> 5, unbound = (token >>> 4) & 1;
      let length = token & 15;
      if (length === 15) {
        if (++k >= layoutCount) fail('Layout escape without extension');
        length += layouts[k]!;
      }
      const runLength = length + (unbound ? 1 : 2);
      if (next + skip > total || pos + skip + runLength > n) fail('Column layout exceeds bounds');
      for (let i = 0; i < skip; i++) take(1);
      if (unbound) {
        if (required) fail(`Unbound ${position} in column`);
        pos += runLength;
        continue;
      }
      if (next >= total) fail('Column layout references missing run value');
      take(runLength);
    }
    if (pos + total - next > n) fail('Too many column values');
    while (next < total) take(1);
    if (required && pos < n) fail(`Unbound ${position} in column`);
    out.length = count;
    this.rowCount = count;
    return count;
  }

  /** Build the value of this column for each selected row, in order, into `out`. */
  public gather<V>(c: C | null | undefined, n: number, position: ColumnPosition, reader: ColumnValueReader<V>, out: Array<V | undefined>): void {
    this.scan(c, n, position);
    const count = this.rowCount, rows = this.rows;
    out.length = count;
    for (let i = 0; i < count; i++) out[i] = undefined;
    if (!this.bound) return;
    const total = this.total, { layouts, layoutCount } = this.cursor;
    const required = position !== 'graph';
    let j = 0, pos = 0, next = 0;
    // `j` is the first selected row at or after `pos`; a run only costs a value when it holds one.
    const take = (length: number): void => {
      const end = pos + length;
      if (j < count && rows[j]! < end) {
        const value = this.valueAt(next, reader);
        do out[j++] = value; while (j < count && rows[j]! < end);
      }
      next++;
      pos = end;
    };
    for (let k = 0; k < layoutCount; k++) {
      const token = layouts[k]!, skip = token >>> 5, unbound = (token >>> 4) & 1;
      let length = token & 15;
      if (length === 15) {
        if (++k >= layoutCount) fail('Layout escape without extension');
        length += layouts[k]!;
      }
      const runLength = length + (unbound ? 1 : 2);
      if (next + skip > total || pos + skip + runLength > n) fail('Column layout exceeds bounds');
      for (let i = 0; i < skip; i++) take(1);
      if (unbound) {
        if (required) fail(`Unbound ${position} in column`);
        pos += runLength;
        while (j < count && rows[j]! < pos) j++;
        continue;
      }
      if (next >= total) fail('Column layout references missing run value');
      take(runLength);
    }
    if (pos + total - next > n) fail('Too many column values');
    while (next < total) take(1);
    if (required && pos < n) fail(`Unbound ${position} in column`);
  }

  private valueAt<V>(value: number, reader: ColumnValueReader<V>): V | undefined {
    const cursor = this.cursor;
    const kind = this.mixed ? this.kindOf[value]! : this.uniform;
    const index = this.mixed ? this.indexOf[value]! : value;
    if (kind === 0) return reader.iri(this.prefixOf[index]!, this.nameOf[index]!);
    if (kind === 1) {
      const kinds = cursor.literalKinds, count = cursor.literalKindCount;
      const literalKind = count === 1 ? kinds[0]! : index < count ? kinds[index]! : 0;
      if (literalKind === 0) return reader.literal(cursor.lex(index));
      if (literalKind % 2) return reader.literal(cursor.lex(index), undefined, 0, (literalKind + 1) / 2);
      const language = literalKind / 2 - 1;
      return reader.literal(cursor.lex(index), cursor.langtags[language]!, language < cursor.directionCount ? cursor.directions[language]! : 0);
    }
    if (kind === 2) return reader.blank(cursor.bnodes[index]!);
    return reader.triple(cursor.tripleTerms[index] as T, [this.tripleStates[2 * index]!, this.tripleStates[2 * index + 1]!]);
  }

  /** Validate the whole column and resolve its values; with `selection`, also judge each predicate. */
  private scan(c: C | null | undefined, n: number, position: ColumnPosition, selection?: ColumnSelection): void {
    const required = position !== 'graph';
    this.bound = !!c;
    this.total = 0;
    this.cursor.layoutCount = 0;
    if (!c) {
      if (required && n) fail(`Unbound ${position} in column`);
      return;
    }
    const cursor = this.cursor;
    cursor.load(c);
    const { nameCount, lexCount, bnodeCount, tripleCount, kindsLength } = cursor;
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
    // Every value is consumed by the layout, so a value of the wrong kind is invalid wherever it sits.
    if (position === 'predicate' ? lexCount || bnodeCount || tripleCount : position !== 'object' && (lexCount || tripleCount)) {
      fail(`Invalid ${position} in column`);
    }
    this.total = total;
    this.mixed = mixed;
    this.uniform = uniform;
    if (mixed) this.scanKinds(total);
    if (nameCount) this.scanIris(nameCount, selection);
    if (lexCount) this.scanLiterals(lexCount);
    if (tripleCount) this.scanTriples(tripleCount);
  }

  private scanKinds(total: number): void {
    const cursor = this.cursor, { kinds, kindsOffset, kindsLength } = cursor;
    if (kindsLength !== Math.ceil(total / 4)) fail('Invalid kinds length');
    if (total % 4 && kinds[kindsOffset + kindsLength - 1]! >>> (2 * (total % 4))) fail('Nonzero unused kinds bits');
    if (this.kindOf.length < total) {
      const capacity = Math.max(total, 2 * this.kindOf.length);
      this.kindOf = new Uint8Array(capacity);
      this.indexOf = new Int32Array(capacity);
    }
    const kindOf = this.kindOf, indexOf = this.indexOf;
    let iris = 0, literals = 0, blanks = 0, triples = 0;
    for (let value = 0; value < total; value++) {
      const kind = (kinds[kindsOffset + (value >> 2)]! >> (2 * (value & 3))) & 3;
      kindOf[value] = kind;
      indexOf[value] = kind === 0 ? iris++ : kind === 1 ? literals++ : kind === 2 ? blanks++ : triples++;
    }
    if (iris !== cursor.nameCount || literals !== cursor.lexCount || blanks !== cursor.bnodeCount || triples !== cursor.tripleCount) {
      fail('Kinds references missing run value');
    }
  }

  private scanIris(count: number, selection: ColumnSelection | undefined): void {
    const { nameIds, prefixIds, prefixCount } = this.cursor, names = this.names, prefixes = this.prefixes;
    if (this.nameOf.length < count) {
      const capacity = Math.max(count, 2 * this.nameOf.length);
      this.nameOf = new Int32Array(capacity);
      this.prefixOf = new Int32Array(capacity);
      this.verdict = new Uint8Array(capacity);
    }
    const nameOf = this.nameOf, prefixOf = this.prefixOf, verdict = this.verdict;
    const namesAssigned = names.contiguous, prefixesAssigned = prefixes.contiguous;
    let nameId = 0, prefixId = 0;
    for (let i = 0; i < count; i++) {
      nameId = nameIds[i]! || nameId + 1;
      prefixId = prefixCount === 1 ? prefixIds[0]! : prefixCount === 0 ? 0 : prefixIds[i]! || prefixId;
      nameOf[i] = nameId;
      prefixOf[i] = prefixId;
      if (selection) verdict[i] = selection.test(nameId, prefixId);
      // Entries up to `contiguous` are known to be assigned; anything above is checked, throwing the precise error.
      else if (nameId > namesAssigned && names.stamp(nameId) === 0) names.datatype(nameId);
      if (prefixId > prefixesAssigned && prefixes.stamp(prefixId) === 0) prefixes.datatype(prefixId);
    }
  }

  private scanLiterals(count: number): void {
    const { literalKinds, literalKindCount } = this.cursor;
    // A single kind applies to every literal of the column.
    if (literalKindCount === 1) { this.checkLiteralKind(literalKinds[0]!); return; }
    for (let j = 0; j < count; j++) this.checkLiteralKind(j < literalKindCount ? literalKinds[j]! : 0);
  }

  private checkLiteralKind(kind: number): void {
    if (kind === 0) return;
    if (kind % 2) { this.checkDatatype((kind + 1) / 2); return; }
    const language = kind / 2 - 1, { langtagCount, directions, directionCount } = this.cursor;
    if (language >= langtagCount) fail('Invalid language tag index');
    const direction = language < directionCount ? directions[language]! : 0;
    if (direction < 0 || direction > 2) fail(`Unknown base direction ${direction}`);
  }

  private checkDatatype(id: number): void {
    const stamp = this.datatypes.stamp(id);
    if (stamp === 0) this.datatypes.datatype(id);
    if (this.datatypeStamps[id] === stamp) return;
    const value = this.datatypes.datatype(id);
    if (value === RDF_LANG_STRING || value === RDF_DIR_LANG_STRING) fail('Language datatypes require a language tag');
    this.datatypeStamps[id] = stamp;
  }

  /** Triple-term references are inferred from the previous term, so every term is walked in order. */
  private scanTriples(count: number): void {
    const state = [0, 0], terms = this.cursor.tripleTerms;
    for (let t = 0; t < count; t++) {
      this.tripleStates[2 * t] = state[0]!;
      this.tripleStates[2 * t + 1] = state[1]!;
      this.validator.triple(terms[t]!, state, 1, false);
    }
  }
}
