import { JellyConformanceError } from '../errors';
import { MAX_LOOKUP_SIZE } from '../options';

export class LookupDecoder {
  private readonly data: Array<string | undefined>;
  private lastAssignedIndex = 0;
  private lastReusedIndex = 0;

  public constructor(public readonly size: number) {
    if (!Number.isInteger(size) || size < 0 || size > MAX_LOOKUP_SIZE) {
      throw new JellyConformanceError(`Lookup size must be between 0 and ${MAX_LOOKUP_SIZE}`);
    }
    this.data = new Array<string | undefined>(size);
  }

  public assign(index: number, value: string): void {
    const resolved = index === 0 ? this.lastAssignedIndex + 1 : index;
    if (resolved < 1 || resolved > this.size) {
      throw new JellyConformanceError(`Lookup entry index ${resolved} is outside table size ${this.size}`);
    }
    this.data[resolved - 1] = value;
    this.lastAssignedIndex = resolved;
  }

  private at(index: number): string {
    if (index < 1 || index > this.size) throw new JellyConformanceError(`Invalid lookup index ${index}`);
    const value = this.data[index - 1];
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

