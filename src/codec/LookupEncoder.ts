import { JellyConformanceError } from '../errors';

export interface EncodedLookupEntry {
  id: number;
  value: string;
}

export class LookupEncoder {
  private readonly data = new Map<string, number>();
  private readonly values: Array<string | undefined>;
  private readonly older: Int32Array;
  private readonly newer: Int32Array;
  private count = 0;
  private oldestIndex = 0;
  private newestIndex = 0;
  private lastAssignedIndex = 0;
  private lastEnsuredIndex = 0;
  private lastReusedIndex = 0;

  public constructor(public readonly size: number) {
    this.values = new Array(size + 1);
    this.older = new Int32Array(size + 1);
    this.newer = new Int32Array(size + 1);
  }

  public ensure(value: string): EncodedLookupEntry | undefined {
    const id = this.ensureId(value);
    return id < 0 ? undefined : { id, value };
  }

  public ensureId(value: string): number {
    const existing = this.data.get(value);
    if (existing !== undefined) {
      this.touch(existing);
      this.lastEnsuredIndex = existing;
      return -1;
    }
    if (this.size === 0) throw new JellyConformanceError('Cannot insert into a disabled lookup table');
    let index: number;
    if (this.count === this.size) {
      index = this.oldestIndex;
      const oldest = this.values[index];
      if (oldest === undefined) throw new JellyConformanceError('Lookup eviction state is inconsistent');
      this.data.delete(oldest);
      this.unlink(index);
    } else {
      index = ++this.count;
    }
    this.data.set(value, index);
    this.values[index] = value;
    this.append(index);
    this.lastEnsuredIndex = index;
    const previous = this.lastAssignedIndex;
    this.lastAssignedIndex = index;
    return index === previous + 1 ? 0 : index;
  }

  private touch(index: number): void {
    if (index === this.newestIndex) return;
    this.unlink(index);
    this.append(index);
  }

  private unlink(index: number): void {
    const older = this.older[index]!;
    const newer = this.newer[index]!;
    if (older === 0) this.oldestIndex = newer;
    else this.newer[older] = newer;
    if (newer === 0) this.newestIndex = older;
    else this.older[newer] = older;
  }

  private append(index: number): void {
    this.older[index] = this.newestIndex;
    this.newer[index] = 0;
    if (this.newestIndex === 0) this.oldestIndex = index;
    else this.newer[this.newestIndex] = index;
    this.newestIndex = index;
  }

  private use(value: string): number {
    const index = this.data.get(value);
    if (index === undefined) throw new JellyConformanceError(`Lookup value was not inserted: ${value}`);
    this.touch(index);
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

  public ensuredPrefix(): number {
    const previous = this.lastReusedIndex;
    const current = this.lastEnsuredIndex;
    this.lastReusedIndex = current;
    return previous !== 0 && current === previous ? 0 : current;
  }

  public ensuredName(): number {
    const previous = this.lastReusedIndex;
    const current = this.lastEnsuredIndex;
    this.lastReusedIndex = current;
    return current === previous + 1 ? 0 : current;
  }

  public ensuredDatatype(): number {
    this.lastReusedIndex = this.lastEnsuredIndex;
    return this.lastEnsuredIndex;
  }
}
