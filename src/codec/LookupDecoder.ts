import { JellyConformanceError } from '../errors';
import { MAX_DECODED_LOOKUP_SIZE } from '../options';

/** Unique across every table, so a cached verdict can never match a replaced table. */
let nextStamp = 1;

export class LookupDecoder {
  /**
   * Grown on demand rather than allocated at the declared size, so a stream may
   * declare a large table without the parser paying for entries it never fills.
   */
  private readonly data: Array<string | undefined> = [];
  /** Version of each slot, changed by every assignment; zero while unassigned. */
  private readonly stamps: number[] = [];
  private lastAssignedIndex = 0;
  private lastReusedIndex = 0;
  /** Called with the index of an assigned entry just before it is overwritten, the only way a value derived from an entry can go stale. */
  public onReplace?: (index: number) => void;
  /** Entries `1..contiguous` are all assigned, so a reference up to it needs no further check. */
  public contiguous = 0;

  public constructor(public readonly size: number, limit: number = MAX_DECODED_LOOKUP_SIZE) {
    if (!Number.isInteger(size) || size < 0 || size > limit) {
      throw new JellyConformanceError(`Lookup size must be between 0 and ${limit}`);
    }
  }

  public assign(index: number, value: string): void {
    const resolved = index === 0 ? this.lastAssignedIndex + 1 : index;
    if (resolved < 1 || resolved > this.size) {
      throw new JellyConformanceError(`Lookup entry index ${resolved} is outside table size ${this.size}`);
    }
    if (resolved > this.data.length) this.reserve(resolved);
    if (this.stamps[resolved - 1]) this.onReplace?.(resolved);
    this.data[resolved - 1] = value;
    this.stamps[resolved - 1] = nextStamp++;
    this.lastAssignedIndex = resolved;
    if (resolved === this.contiguous + 1) {
      let next = resolved;
      while (this.stamps[next]) next++;
      this.contiguous = next;
    }
  }

  /** Version of the entry at `index`, or 0 when it is outside the table or unassigned. */
  public stamp(index: number): number {
    return index >= 1 && index <= this.stamps.length ? this.stamps[index - 1]! : 0;
  }

  /** Extend the backing array by doubling, staying packed and capped at the table size. */
  private reserve(required: number): void {
    let capacity = this.data.length || 16;
    while (capacity < required) capacity *= 2;
    if (capacity > this.size) capacity = this.size;
    for (let index = this.data.length; index < capacity; index++) { this.data.push(undefined); this.stamps.push(0); }
  }

  private at(index: number): string {
    if (index < 1 || index > this.size) throw new JellyConformanceError(`Invalid lookup index ${index}`);
    const value = index <= this.data.length ? this.data[index - 1] : undefined;
    if (value === undefined) throw new JellyConformanceError(`Lookup index ${index} has not been assigned`);
    this.lastReusedIndex = index;
    return value;
  }

  public prefix(index: number): string {
    const resolved = index || this.lastReusedIndex;
    return resolved === 0 ? '' : this.at(resolved);
  }

  public name(index: number): string {
    const resolved = index || this.lastReusedIndex + 1;
    if (resolved === 0) throw new JellyConformanceError('Zero is not a valid resolved name index');
    return this.at(resolved);
  }

  public datatype(index: number): string {
    if (index === 0) throw new JellyConformanceError('Zero is not a valid datatype index');
    return this.at(index);
  }
}
