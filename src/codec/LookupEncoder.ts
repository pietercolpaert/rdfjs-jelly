import { JellyConformanceError } from '../errors';

export interface EncodedLookupEntry {
  id: number;
  value: string;
}

export class LookupEncoder {
  private readonly data = new Map<string, number>();
  private lastAssignedIndex = 0;
  private lastReusedIndex = 0;
  private evicting = false;

  public constructor(public readonly size: number) {}

  public ensure(value: string): EncodedLookupEntry | undefined {
    const existing = this.data.get(value);
    if (existing !== undefined) {
      this.touch(value, existing);
      return undefined;
    }
    if (this.size === 0) throw new JellyConformanceError('Cannot insert into a disabled lookup table');
    let index: number;
    if (this.evicting) {
      const oldest = this.data.entries().next().value as [string, number] | undefined;
      if (!oldest) throw new JellyConformanceError('Lookup eviction state is inconsistent');
      this.data.delete(oldest[0]);
      index = oldest[1];
    } else {
      index = this.data.size + 1;
      this.evicting = index === this.size;
    }
    this.data.set(value, index);
    const previous = this.lastAssignedIndex;
    this.lastAssignedIndex = index;
    return { id: index === previous + 1 ? 0 : index, value };
  }

  private touch(value: string, index: number): void {
    this.data.delete(value);
    this.data.set(value, index);
  }

  private use(value: string): number {
    const index = this.data.get(value);
    if (index === undefined) throw new JellyConformanceError(`Lookup value was not inserted: ${value}`);
    this.touch(value, index);
    this.lastReusedIndex = index;
    return index;
  }

  public prefix(value: string): number {
    if (this.size === 0) return 0;
    const previous = this.lastReusedIndex;
    if (!value && previous === 0) return 0;
    const current = this.use(value);
    return previous !== 0 && current === previous ? 0 : current;
  }

  public name(value: string): number {
    const previous = this.lastReusedIndex;
    const current = this.use(value);
    return current === previous + 1 ? 0 : current;
  }

  public datatype(value: string): number { return this.use(value); }
}

