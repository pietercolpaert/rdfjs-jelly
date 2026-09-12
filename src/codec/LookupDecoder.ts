import { JellyConformanceError } from '../errors';
import { MAX_DECODED_LOOKUP_SIZE } from '../options';

export class LookupDecoder {
  /**
   * Grown on demand rather than allocated at the declared size, so a stream may
   * declare a large table without the parser paying for entries it never fills.
   */
  private readonly data: Array<string | undefined> = [];
  private lastAssignedIndex = 0;
  private lastReusedIndex = 0;

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
    this.data[resolved - 1] = value;
    this.lastAssignedIndex = resolved;
  }

  /** Extend the backing array by doubling, staying packed and capped at the table size. */
  private reserve(required: number): void {
    let capacity = this.data.length || 16;
    while (capacity < required) capacity *= 2;
    if (capacity > this.size) capacity = this.size;
    for (let index = this.data.length; index < capacity; index++) this.data.push(undefined);
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
