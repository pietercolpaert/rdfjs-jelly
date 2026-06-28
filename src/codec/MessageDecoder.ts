import { Reader } from 'protobufjs/minimal.js';
import { JellyConformanceError } from '../errors';
import {
  decodeProtoRdfStreamFrame,
  decodeProtoRdfStreamFrameReader,
  decodeRdfStreamFrame,
  type ProtoFrame,
  type RdfStreamFrame,
} from '../generated/rdf_pb';
import type { BinaryInput, ParserOptions } from '../types';
import { asUint8Array, concatBytes } from './bytes';

const DEFAULT_MAX_MESSAGE_SIZE = 64 * 1024 * 1024;

export function delimitedJellyHint(input: Uint8Array): boolean {
  return input.byteLength >= 3 && (input[0] !== 0x0a || (input[1] === 0x0a && input[2] !== 0x0a));
}

type FrameDecoder<Frame> = (input: Uint8Array) => Frame;
type ReaderFrameDecoder<Frame> = (reader: Reader, length: number) => Frame;
type FrameConsumer<Frame> = (frame: Frame) => void;

class FramedMessageDecoder<Frame> {
  private buffer: Uint8Array<ArrayBufferLike> = new Uint8Array();
  private delimited: boolean | undefined;
  private readonly mode: boolean | 'auto';
  private readonly maxMessageSize: number;

  public constructor(
    options: Pick<ParserOptions, 'delimited' | 'maxMessageSize'>,
    private readonly decodeFrame: FrameDecoder<Frame>,
    private readonly decodeReader?: ReaderFrameDecoder<Frame>,
  ) {
    this.mode = options.delimited ?? 'auto';
    this.delimited = typeof this.mode === 'boolean' ? this.mode : undefined;
    this.maxMessageSize = options.maxMessageSize ?? DEFAULT_MAX_MESSAGE_SIZE;
  }

  public write(chunk: BinaryInput): Frame[] {
    const frames: Frame[] = [];
    this.writeEach(chunk, frame => frames.push(frame));
    return frames;
  }

  public end(chunk?: BinaryInput): Frame[] {
    const frames: Frame[] = [];
    this.endEach(frame => frames.push(frame), chunk);
    return frames;
  }

  public decode(input: BinaryInput): Frame[] {
    const frames: Frame[] = [];
    this.decodeEach(input, frame => frames.push(frame));
    return frames;
  }

  public writeEach(chunk: BinaryInput, consume: FrameConsumer<Frame>): void {
    const bytes = asUint8Array(chunk);
    this.buffer = this.buffer.byteLength === 0 ? bytes : concatBytes([this.buffer, bytes]);
    if (this.delimited === undefined && this.buffer.byteLength >= 3) this.delimited = delimitedJellyHint(this.buffer);
    if (this.delimited) this.readDelimited(false, consume);
  }

  public endEach(consume: FrameConsumer<Frame>, chunk?: BinaryInput): void {
    if (chunk) this.writeEach(chunk, consume);
    if (this.delimited === undefined) {
      if (this.mode === 'auto') this.delimited = this.buffer.byteLength > 0 && delimitedJellyHint(this.buffer);
      else this.delimited = this.mode;
    }
    if (this.delimited) this.readDelimited(true, consume);
    else {
      if (this.buffer.byteLength > this.maxMessageSize) throw new JellyConformanceError('Jelly message exceeds configured size limit');
      if (this.buffer.byteLength === 0) throw new JellyConformanceError('Jelly input is empty');
      consume(this.decodeFrame(this.buffer));
      this.buffer = new Uint8Array();
    }
  }

  public decodeEach(input: BinaryInput, consume: FrameConsumer<Frame>): void {
    this.writeEach(input, consume);
    this.endEach(consume);
  }

  private readDelimited(final: boolean, consume: FrameConsumer<Frame>): void {
    let offset = 0;
    while (offset < this.buffer.byteLength) {
      let size: number;
      let prefixSize: number;
      let reader: Reader;
      try {
        reader = Reader.create(this.buffer.subarray(offset));
        size = reader.uint32();
        prefixSize = reader.pos;
      } catch (error) {
        if (!final) break;
        throw new JellyConformanceError('Invalid Jelly message length prefix', {
          cause: error instanceof Error ? error : undefined,
        });
      }
      if (size > this.maxMessageSize) throw new JellyConformanceError('Jelly message exceeds configured size limit');
      const payloadOffset = offset + prefixSize;
      const end = payloadOffset + size;
      if (end > this.buffer.byteLength) break;
      consume(this.decodeReader
        ? this.decodeReader(reader, size)
        : this.decodeFrame(this.buffer.subarray(payloadOffset, end)));
      offset = end;
    }
    this.buffer = this.buffer.slice(offset);
    if (final && this.buffer.byteLength !== 0) throw new JellyConformanceError('Truncated delimited Jelly message');
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
