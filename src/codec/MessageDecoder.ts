import { Reader } from 'protobufjs/minimal.js';
import type { Decoder } from './Decoder';
import { JellyConformanceError } from '../errors';
import {
  decodeProtoRdfStreamFrame,
  decodeProtoRdfStreamFrameReader,
  decodeRdfStreamFrame,
  type ProtoFrame,
  type RdfStreamFrame,
} from '../generated/rdf_pb';
import type { BinaryInput, ParserOptions } from '../types';
import type { Message } from '../types';
import { asUint8Array } from './bytes';

const DEFAULT_MAX_MESSAGE_SIZE = 64 * 1024 * 1024;
const INITIAL_CAPACITY = 8192;
const EMPTY_BYTES = new Uint8Array();

function delimitedHint(first: number, second: number, third: number): boolean {
  return first !== 0x0a || (second === 0x0a && third !== 0x0a);
}

export function delimitedJellyHint(input: Uint8Array): boolean {
  return input.byteLength > 0 && (input[0] === 0 || (input.byteLength >= 3 && delimitedHint(input[0]!, input[1]!, input[2]!)));
}

type FrameDecoder<Frame> = (input: Uint8Array) => Frame;
type ReaderFrameDecoder<Frame> = (reader: Reader, length: number) => Frame;

/**
 * Receives one decoded frame. Returning `false` means "accepted, but stop
 * delivering" — the remaining bytes stay buffered until `resumeEach()`, which is
 * how a slow consumer applies backpressure without the decoder running ahead.
 */
type FrameConsumer<Frame> = (frame: Frame) => boolean | void;

/**
 * Incomplete frames accumulate in one amortised-growth buffer rather than being
 * re-concatenated per chunk. Bytes already consumed are skipped with an offset,
 * and the live region is only moved when the buffer has to grow or make room, so
 * total copying is linear in the input rather than quadratic in the frame size.
 */
export class FramedMessageDecoder<Frame> {
  private buffer: Uint8Array<ArrayBufferLike> = EMPTY_BYTES;
  private start = 0;
  private filled = 0;
  private delimited: boolean | undefined;
  private readonly mode: boolean | 'auto';
  private readonly maxMessageSize: number;
  private finalising = false;
  private stopped = false;
  private delivered = false;

  public constructor(
    options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>,
    private readonly decodeFrame: FrameDecoder<Frame>,
    private readonly decodeReader?: ReaderFrameDecoder<Frame>,
  ) {
    this.mode = options.delimited ?? 'auto';
    this.delimited = typeof this.mode === 'boolean' ? this.mode : undefined;
    this.maxMessageSize = options.maxMessageSize ?? DEFAULT_MAX_MESSAGE_SIZE;
  }

  private get retained(): number {
    return this.filled - this.start;
  }

  /** Bytes held back because a consumer paused or a frame is still incomplete. */
  public get bufferedBytes(): number {
    return this.retained;
  }

  public get paused(): boolean {
    return this.stopped;
  }

  public write(chunk: BinaryInput): Frame[] {
    const frames: Frame[] = [];
    this.writeEach(chunk, frame => { frames.push(frame); });
    return frames;
  }

  public end(chunk?: BinaryInput): Frame[] {
    const frames: Frame[] = [];
    this.endEach(frame => { frames.push(frame); }, chunk);
    return frames;
  }

  public decode(input: BinaryInput): Frame[] {
    const frames: Frame[] = [];
    this.decodeEach(input, frame => { frames.push(frame); });
    return frames;
  }

  /** Returns false when the consumer paused delivery; call resumeEach() to continue. */
  public writeEach(chunk: BinaryInput, consume: FrameConsumer<Frame>): boolean {
    const bytes = asUint8Array(chunk);
    this.detect(bytes);
    if (this.delimited === true && this.retained === 0 && !this.stopped) {
      // Nothing is held back, so complete frames are read out of the caller's
      // chunk without copying it first; only an unread tail is retained.
      const offset = this.readFrames(bytes, 0, bytes.byteLength, false, consume);
      if (offset < bytes.byteLength) this.append(bytes, offset);
      return !this.stopped;
    }
    this.append(bytes, 0);
    return this.pump(false, consume);
  }

  public endEach(consume: FrameConsumer<Frame>, chunk?: BinaryInput): boolean {
    // End of input is the last chance to drain, so a consumer that paused
    // earlier is resumed here rather than left holding buffered frames.
    this.stopped = false;
    if (chunk !== undefined && !this.writeEach(chunk, consume)) {
      this.finalising = true;
      return false;
    }
    this.finalising = true;
    return this.pump(true, consume);
  }

  /** Continue after a consumer paused delivery by returning false. */
  public resumeEach(consume: FrameConsumer<Frame>): boolean {
    this.stopped = false;
    return this.pump(this.finalising, consume);
  }

  public decodeEach(input: BinaryInput, consume: FrameConsumer<Frame>): void {
    this.writeEach(input, consume);
    this.endEach(consume);
  }

  /** Framing is decided from the first three bytes, wherever they happen to sit. */
  private detect(bytes: Uint8Array): void {
    if (this.delimited !== undefined) return;
    const retained = this.retained;
    if (retained + bytes.byteLength < 3) return;
    const at = (index: number): number => index < retained
      ? this.buffer[this.start + index]!
      : bytes[index - retained]!;
    this.delimited = delimitedHint(at(0), at(1), at(2));
  }

  private pump(final: boolean, consume: FrameConsumer<Frame>): boolean {
    if (this.stopped) return false;
    if (this.delimited === undefined) {
      if (!final) return true;
      this.delimited = this.mode === 'auto'
        ? this.retained > 0 && delimitedJellyHint(this.buffer.subarray(this.start, this.filled))
        : this.mode;
    }
    if (this.delimited) {
      this.start = this.readFrames(this.buffer, this.start, this.filled, final, consume);
      if (this.start === this.filled) {
        this.start = 0;
        this.filled = 0;
      }
      if (this.stopped) return false;
      if (final && this.retained !== 0) throw new JellyConformanceError('Truncated delimited Jelly message');
      return true;
    }
    if (!final || this.delivered) return true;
    if (this.retained === 0) return true;
    const frame = this.decodeFrame(this.buffer.subarray(this.start, this.filled));
    this.delivered = true;
    this.buffer = EMPTY_BYTES;
    this.start = 0;
    this.filled = 0;
    if (consume(frame) === false) {
      this.stopped = true;
      return false;
    }
    return true;
  }

  /** Returns the offset after the last frame handed to the consumer. */
  private readFrames(
    buffer: Uint8Array,
    from: number,
    end: number,
    final: boolean,
    consume: FrameConsumer<Frame>,
  ): number {
    let offset = from;
    // One reader serves every frame: allocating a buffer view and reader per
    // frame is measurable when frames hold only a handful of rows.
    const reader = Reader.create(buffer.subarray(from, end));
    while (offset < end) {
      let size: number;
      let prefixSize: number;
      try {
        reader.pos = offset - from;
        reader.len = end - from;
        size = reader.uint32();
        prefixSize = reader.pos - (offset - from);
      } catch (error) {
        if (!final) break;
        throw new JellyConformanceError('Invalid Jelly message length prefix', {
          cause: error instanceof Error ? error : undefined,
        });
      }
      if (size > this.maxMessageSize) throw new JellyConformanceError('Jelly message exceeds configured size limit');
      const payloadOffset = offset + prefixSize;
      const frameEnd = payloadOffset + size;
      if (frameEnd > end) break;
      const frame = this.decodeReader
        ? this.decodeReader(reader, size)
        : this.decodeFrame(buffer.subarray(payloadOffset, frameEnd));
      // Advance before delivering, so pausing here resumes at the next frame.
      offset = frameEnd;
      if (consume(frame) === false) {
        this.stopped = true;
        break;
      }
    }
    return offset;
  }

  private append(bytes: Uint8Array, from: number): void {
    const addition = bytes.byteLength - from;
    if (addition <= 0) return;
    const live = this.retained;
    const required = live + addition;
    if (required > this.buffer.byteLength) {
      let capacity = this.buffer.byteLength || INITIAL_CAPACITY;
      while (capacity < required) capacity *= 2;
      const grown = new Uint8Array(capacity);
      if (live > 0) grown.set(this.buffer.subarray(this.start, this.filled));
      this.buffer = grown;
      this.start = 0;
      this.filled = live;
    } else if (this.filled + addition > this.buffer.byteLength) {
      this.buffer.copyWithin(0, this.start, this.filled);
      this.start = 0;
      this.filled = live;
    }
    this.buffer.set(from === 0 ? bytes : bytes.subarray(from), this.filled);
    this.filled += addition;
    // Non-delimited input has no length prefix to check, so the limit is
    // enforced as the payload accumulates rather than only at end of input.
    if (this.delimited === false && this.retained > this.maxMessageSize) {
      throw new JellyConformanceError('Jelly message exceeds configured size limit');
    }
  }
}

export class MessageDecoder extends FramedMessageDecoder<RdfStreamFrame> {
  public constructor(options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'> = {}) {
    super(options, decodeRdfStreamFrame);
  }
}

export class ProtoMessageDecoder extends FramedMessageDecoder<ProtoFrame> {
  public constructor(options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'> = {}) {
    super(options, decodeProtoRdfStreamFrame, decodeProtoRdfStreamFrameReader);
  }
}

export class DirectMessageDecoder extends FramedMessageDecoder<Message[]> {
  public constructor(
    options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>,
    decoder: Decoder,
  ) {
    super(
      options,
      input => decoder.decodePayloadMessages(Reader.create(input), input.byteLength),
      (reader, length) => decoder.decodePayloadMessages(reader, length),
    );
  }
}

export class DirectQuadDecoder extends FramedMessageDecoder<void> {
  public constructor(
    options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>,
    decoder: Decoder,
    output: import('@rdfjs/types').Quad[],
  ) {
    super(
      options,
      input => decoder.decodeProtoPayloadTo(Reader.create(input), input.byteLength, output),
      (reader, length) => decoder.decodeProtoPayloadTo(reader, length, output),
    );
  }
}
