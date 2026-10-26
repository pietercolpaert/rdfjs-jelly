import type { QuadPattern } from '../types';
import type { LookupDecoder } from './LookupDecoder';
import { POSITIONS, type SelectionPosition } from './QuadFilter';

/** Decides whether the IRI at one position is selected, once per lookup slot
 * rather than once per row. A verdict stays valid until an assigned name or
 * prefix entry is overwritten: the tables report that, and the affected verdicts
 * are dropped and refilled on demand, so a replaced entry can never leave a
 * stale match. Only IRIs can be selected: other terms never match. */
export class ColumnSelection {
  /** Every pattern constrains only this position, so a selected row needs no further matching. */
  public readonly selectorOnly: boolean;
  /** Column index of the position: 0 subject, 1 predicate, 2 object, 3 graph. */
  public readonly index: number;
  private readonly allowed = new Set<string>();
  /** Per name slot: 0 when unknown, otherwise `1 + (prefixId << 1 | verdict)`. */
  private entries = new Int32Array(0);
  private names?: LookupDecoder;
  private prefixes?: LookupDecoder;

  public constructor(patterns: readonly QuadPattern[], public readonly position: SelectionPosition) {
    this.index = POSITIONS.indexOf(position);
    this.selectorOnly = patterns.every(p => POSITIONS.every(other => other === position || !p[other]));
    for (const pattern of patterns) this.allowed.add(pattern[position]!.value);
  }

  /** Bind the tables a batch is read with. They are replaced when the stream options are restated. */
  public begin(names: LookupDecoder, prefixes: LookupDecoder): void {
    if (names === this.names && prefixes === this.prefixes) return;
    this.entries.fill(0);
    this.names = names;
    this.prefixes = prefixes;
    // A verdict names one name slot and one prefix slot: replacing the name drops that slot, replacing a prefix any verdict.
    names.onReplace = index => { if (index < this.entries.length) this.entries[index] = 0; };
    prefixes.onReplace = () => this.entries.fill(0);
  }

  /** 1 when the IRI is selected. Both lookup references must be assigned even for rejected rows. */
  public test(nameId: number, prefixId: number): number {
    const entry = nameId < this.entries.length ? this.entries[nameId]! : 0;
    if (entry !== 0 && (entry - 1) >> 1 === prefixId) return (entry - 1) & 1;
    return this.compute(nameId, prefixId);
  }

  private compute(nameId: number, prefixId: number): number {
    const names = this.names!, prefixes = this.prefixes!;
    const name = names.datatype(nameId), prefix = prefixId ? prefixes.datatype(prefixId) : '';
    const matches = this.allowed.has(prefix + name) ? 1 : 0;
    if (nameId >= this.entries.length) {
      let capacity = this.entries.length || 256;
      while (capacity <= nameId) capacity *= 2;
      const grown = new Int32Array(capacity);
      grown.set(this.entries);
      this.entries = grown;
    }
    this.entries[nameId] = 1 + (prefixId << 1 | matches);
    return matches;
  }
}
