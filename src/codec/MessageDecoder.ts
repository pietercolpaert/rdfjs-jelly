import { JellyConformanceError } from '../errors';
import { decodeRdfStreamFrame, type RdfStreamFrame } from '../generated/rdf_pb';
import type { BinaryInput, ParserOptions } from '../types';
import { asUint8Array, concatBytes, decodeVarint } from './varint';

const DEFAULT_MAX_MESSAGE_SIZE = 64 * 1024 * 1024;

export function delimitedJellyHint(input: Uint8Array): boolean {
  return input.byteLength >= 3 && (input[0] !== 0x0a || (input[1] === 0x0a && input[2] !== 0x0a));
}

export class MessageDecoder {
  private buffer: Uint8Array<ArrayBufferLike> = new Uint8Array();
  private delimited: boolean | undefined;
  private readonly mode: boolean | 'auto';
  private readonly maxMessageSize: number;

  public constructor(options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'> = {}) {
    this.mode = options.delimited ?? 'auto';
    this.delimited = typeof this.mode === 'boolean' ? this.mode : undefined;
    this.maxMessageSize = options.maxMessageSize ?? DEFAULT_MAX_MESSAGE_SIZE;
  }

  public write(chunk: BinaryInput): RdfStreamFrame[] {
    const bytes = asUint8Array(chunk);
    this.buffer = concatBytes([this.buffer, bytes]);
    if (this.delimited === undefined && this.buffer.byteLength >= 3) this.delimited = delimitedJellyHint(this.buffer);
    return this.delimited ? this.readDelimited(false) : [];
  }

  public end(chunk?: BinaryInput): RdfStreamFrame[] {
    const frames = chunk ? this.write(chunk) : [];
    if (this.delimited === undefined) {
      if (this.mode === 'auto') this.delimited = this.buffer.byteLength > 0 && delimitedJellyHint(this.buffer);
      else this.delimited = this.mode;
    }
    if (this.delimited) frames.push(...this.readDelimited(true));
    else {
      if (this.buffer.byteLength > this.maxMessageSize) throw new JellyConformanceError('Jelly message exceeds configured size limit');
      if (this.buffer.byteLength === 0) throw new JellyConformanceError('Jelly input is empty');
      frames.push(decodeRdfStreamFrame(this.buffer));
      this.buffer = new Uint8Array();
    }
    return frames;
  }

  public decode(input: BinaryInput): RdfStreamFrame[] {
    const frames = this.write(input);
    frames.push(...this.end());
    return frames;
  }

  private readDelimited(final: boolean): RdfStreamFrame[] {
    const frames: RdfStreamFrame[] = [];
    let offset = 0;
    while (offset < this.buffer.byteLength) {
      const length = decodeVarint(this.buffer, offset);
      if (!length) break;
      if (length.value > this.maxMessageSize) throw new JellyConformanceError('Jelly message exceeds configured size limit');
      const end = length.offset + length.value;
      if (end > this.buffer.byteLength) break;
      frames.push(decodeRdfStreamFrame(this.buffer.subarray(length.offset, end)));
      offset = end;
    }
    this.buffer = this.buffer.slice(offset);
    if (final && this.buffer.byteLength !== 0) throw new JellyConformanceError('Truncated delimited Jelly message');
    return frames;
  }
}
