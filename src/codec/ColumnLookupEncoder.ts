import { JellyConformanceError } from '../errors';

/** A bounded cross-batch dictionary. Slots referenced by the current batch are
 * pinned, so an update can never invalidate an earlier statement in that batch.
 * The batch working-set check guarantees that an unpinned slot is available.
 */
export class ColumnLookupEncoder {
  private readonly ids = new Map<string, number>();
  private readonly values: Array<string | undefined>;
  private readonly pinned: Uint8Array;
  private nextSlot = 1;
  private lastWrittenSlot = 0;
  public entries: Array<{ id: number; values: string[] }> = [];

  public constructor(private readonly capacity: number) {
    this.values = new Array(capacity + 1);
    this.pinned = new Uint8Array(capacity + 1);
  }

  public ensure(value: string): number {
    const cached = this.ids.get(value);
    if (cached !== undefined) {
      this.pinned[cached] = 1;
      return cached;
    }
    if (!this.capacity) throw new JellyConformanceError('Cannot insert into a disabled column lookup');
    let examined = 0;
    while (this.pinned[this.nextSlot]) {
      if (++examined >= this.capacity) throw new JellyConformanceError('Column batch exceeds lookup capacity');
      this.advance();
    }
    const slot = this.nextSlot, old = this.values[slot];
    if (old !== undefined) this.ids.delete(old);
    this.values[slot] = value;
    this.ids.set(value, slot);
    this.pinned[slot] = 1;
    const previous = this.entries[this.entries.length - 1];
    if (previous && slot === this.lastWrittenSlot + 1) previous.values.push(value);
    else this.entries.push({ id: slot, values: [value] });
    this.lastWrittenSlot = slot;
    this.advance();
    return slot;
  }

  public endBatch(): void {
    this.entries = [];
    this.pinned.fill(0);
  }

  private advance(): void { this.nextSlot = this.nextSlot === this.capacity ? 1 : this.nextSlot + 1; }
}
