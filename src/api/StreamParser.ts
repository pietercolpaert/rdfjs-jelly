import { Transform, type Readable, type TransformCallback } from 'node:stream';
import { Decoder } from '../codec/Decoder';
import { DirectMessageDecoder } from '../codec/MessageDecoder';
import type { Message, ParserOutputItem, StreamParserOptions } from '../types';

/**
 * Node's Transform already stops accepting chunks once the readable side is
 * full. What it cannot do is stop one chunk from being expanded into every quad
 * it contains, so this parser also pauses inside a chunk: when `push()` reports
 * a full queue, frame decoding stops and the undecoded bytes stay in the message
 * reader until `_read()` asks for more. Quads held in memory are therefore
 * bounded by one Jelly message rather than by the input chunk size.
 *
 * The write callback is always invoked, so Transform's own accounting stays
 * intact; more input is requested only once the decoder's own backlog is gone.
 */
export class StreamParser extends Transform {
  private readonly messageReader: DirectMessageDecoder;
  private readonly decoder: Decoder;
  private readonly messageMode: boolean;
  private readonly pending: ParserOutputItem[] = [];
  private pendingIndex = 0;
  private busy = false;

  public constructor(options: StreamParserOptions = {}) {
    super({ ...options, readableObjectMode: true, writableObjectMode: false });
    this.messageMode = options.messages === true || options.rdfMessages === true;
    this.decoder = new Decoder(options, {
      options: value => this.emit('options', value),
      namespace: (prefix, iri) => this.emit('namespace', prefix, iri),
    });
    this.messageReader = new DirectMessageDecoder(options, this.decoder);
  }

  public import(stream: Readable): this {
    stream.on('error', error => this.destroy(error));
    stream.pipe(this);
    return this;
  }

  public override _transform(chunk: Buffer | Uint8Array, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.busy = true;
    try {
      if (this.flushPending() && this.messageReader.paused) {
        this.messageReader.resumeEach(message => this.accept(message));
      }
      this.messageReader.writeEach(chunk, message => this.accept(message));
    } catch (error) {
      this.busy = false;
      callback(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    this.busy = false;
    callback();
  }

  public override _flush(callback: TransformCallback): void {
    this.busy = true;
    try {
      // End of input: deliver everything that is left, backpressure or not.
      this.drainPending();
      this.messageReader.endEach(message => {
        for (const item of message) this.enqueue(item);
        this.drainPending();
        return true;
      });
      for (const message of this.decoder.finishMessages()) this.enqueue(message);
      this.drainPending();
    } catch (error) {
      this.busy = false;
      callback(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    this.busy = false;
    callback();
  }

  public override _read(size: number): void {
    // push() re-enters _read; the outer pass is already delivering.
    if (this.busy) return;
    this.busy = true;
    try {
      if (this.flushPending() && this.messageReader.paused) {
        this.messageReader.resumeEach(message => this.accept(message));
      }
    } catch (error) {
      this.busy = false;
      this.destroy(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    this.busy = false;
    // Ask the writable side for more only once our own backlog is delivered.
    if (!this.messageReader.paused && this.pendingIndex >= this.pending.length) super._read(size);
  }

  /** Returns false when the readable side is full and decoding should pause. */
  private accept(messages: Message[]): boolean {
    for (const message of messages) this.enqueue(message);
    return this.flushPending();
  }

  private enqueue(message: Message): void {
    this.emit('message', message);
    for (const quad of message) {
      if (this.messageMode) {
        this.emit('messageCounter', message.messageCounter, quad);
        this.pending.push({ quad, messageCounter: message.messageCounter });
      } else this.pending.push(quad);
    }
  }

  private flushPending(): boolean {
    while (this.pendingIndex < this.pending.length) {
      if (!this.push(this.pending[this.pendingIndex++]!)) return false;
    }
    this.pending.length = 0;
    this.pendingIndex = 0;
    return true;
  }

  private drainPending(): void {
    while (this.pendingIndex < this.pending.length) this.push(this.pending[this.pendingIndex++]!);
    this.pending.length = 0;
    this.pendingIndex = 0;
  }
}
