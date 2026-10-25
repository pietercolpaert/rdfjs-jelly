import { JellyConformanceError } from '../errors';

/** What a batch needs from a dictionary, whether it outlives the batch or not. */
export interface ColumnLookup {
  readonly capacity: number;
  /** Distinct keys the current batch uses so far. */
  readonly pinnedCount: number;
  /** New dictionary entries to send with the current batch. */
  readonly entries: Array<{ id: number; values: string[] }>;
  /** The id of a key, adding it if needed; the key is then used by the current batch. */
  ensure(value: string): number;
  /** The id of a key the current batch already uses. */
  idOf(value: string): number;
  /** Whether the current batch already uses this key. */
  inBatch(value: string): boolean;
  endBatch(): void;
}

/** A dictionary that lasts one batch: ids are assigned in order and sent in full each time. */
export class BatchLookup implements ColumnLookup {
  private readonly ids = new Map<string, number>();
  public constructor(public readonly capacity: number) {}
  public get pinnedCount(): number { return this.ids.size; }
  public get entries(): Array<{ id: number; values: string[] }> {
    return this.ids.size ? [{ id: 1, values: [...this.ids.keys()] }] : [];
  }
  public ensure(value: string): number {
    let id = this.ids.get(value);
    if (id === undefined) { id = this.ids.size + 1; this.ids.set(value, id); }
    return id;
  }
  public idOf(value: string): number { return this.ids.get(value)!; }
  public inBatch(value: string): boolean { return this.ids.has(value); }
  public endBatch(): void { this.ids.clear(); }
}

/** Candidate ids examined for the least recently used one when the next id is not cold. */
const SAMPLES = 4;

/** A bounded cross-batch dictionary. Slots referenced by the current batch are
 * pinned, so an update can never invalidate an earlier statement in that batch.
 * The batch working-set check guarantees that an unpinned slot is available.
 *
 * A full table evicts in id order, skipping slots used recently, as the JVM
 * implementation does. New entries then mostly take the previous id + 1, which
 * keeps ids small and lets whole runs of entries share one id. Recently used
 * names survive even when they are old, unlike with plain round-robin eviction.
 */
export class ColumnLookupEncoder implements ColumnLookup {
  private readonly ids = new Map<string, number>();
  private readonly values: Array<string | undefined>;
  /** Accesses counted so far when each slot was last used. A double: it never wraps. */
  private readonly lastUse: Float64Array;
  private readonly coldAge: number;
  private used = 0;
  private now = 0;
  /** `now` when the current batch began: slots used after it are pinned. */
  private epochStart = 0;
  private lastSetSlot = 0;
  private lastWrittenSlot = 0;
  public entries: Array<{ id: number; values: string[] }> = [];
  public pinnedCount = 0;

  public constructor(public readonly capacity: number) {
    this.values = new Array(capacity + 1);
    this.lastUse = new Float64Array(capacity + 1);
    this.coldAge = capacity >> 1;
  }

  public ensure(value: string): number {
    const cached = this.ids.get(value);
    if (cached !== undefined) {
      if (this.lastUse[cached]! <= this.epochStart) this.pinnedCount++;
      this.lastUse[cached] = ++this.now;
      return cached;
    }
    if (!this.capacity) throw new JellyConformanceError('Cannot insert into a disabled column lookup');
    let slot: number;
    if (this.used < this.capacity) slot = ++this.used;
    else {
      slot = this.victim();
      const old = this.values[slot];
      if (old !== undefined) this.ids.delete(old);
      this.lastSetSlot = slot;
    }
    this.values[slot] = value;
    this.ids.set(value, slot);
    this.lastUse[slot] = ++this.now;
    this.pinnedCount++;
    const previous = this.entries[this.entries.length - 1];
    if (previous && slot === this.lastWrittenSlot + 1) previous.values.push(value);
    else this.entries.push({ id: slot, values: [value] });
    this.lastWrittenSlot = slot;
    return slot;
  }

  public idOf(value: string): number { return this.ids.get(value)!; }

  public inBatch(value: string): boolean {
    const slot = this.ids.get(value);
    return slot !== undefined && this.lastUse[slot]! > this.epochStart;
  }

  public endBatch(): void {
    this.entries = [];
    this.epochStart = this.now;
    this.pinnedCount = 0;
  }

  /** The slot to overwrite in a full table: never one the current batch uses. */
  private victim(): number {
    const { capacity, lastUse, epochStart } = this;
    let slot = this.lastSetSlot >= 1 && this.lastSetSlot < capacity ? this.lastSetSlot + 1 : 1;
    const next = lastUse[slot]!;
    if (this.now - next >= this.coldAge && next <= epochStart) return slot;
    let best = 0, bestUse = Infinity;
    const step = Math.max(1, Math.floor(capacity / SAMPLES));
    for (let n = Math.min(SAMPLES, capacity); n > 0; n--) {
      const last = lastUse[slot]!;
      if (last < bestUse && last <= epochStart) { best = slot; bestUse = last; }
      slot += step;
      if (slot > capacity) slot -= capacity;
    }
    if (best) return best;
    // The batch pins every sampled slot: take the first one it does not pin.
    for (let n = capacity; n > 0; n--) {
      if (lastUse[slot]! <= epochStart) return slot;
      slot = slot === capacity ? 1 : slot + 1;
    }
    throw new JellyConformanceError('Column batch exceeds lookup capacity');
  }
}
