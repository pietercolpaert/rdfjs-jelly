import { Transform, type Readable, type TransformCallback, type TransformOptions } from 'node:stream';
import type { SparqlEvent, SparqlParserOptions, SparqlWriterOptions } from '../sparql-types';
import { SparqlFrameDecoder, type SparqlFrame } from './framing';
import { SparqlDecoder } from './SparqlDecoder';
import { SparqlWriter } from './SparqlWriter';

export type SparqlStreamParserOptions = SparqlParserOptions & TransformOptions;
/** Emits header/binding/boolean/metadata/end events without buffering a result set. */
export class SparqlStreamParser extends Transform {
  private readonly reader: SparqlFrameDecoder;
  private readonly decoder: SparqlDecoder;
  private pending: SparqlEvent[] = [];
  private index = 0;
  private busy = false;
  public constructor(options: SparqlStreamParserOptions = {}) {
    super({ ...options, readableObjectMode: true, writableObjectMode: false });
    this.reader = new SparqlFrameDecoder(options);
    this.decoder = new SparqlDecoder(options);
  }
  public import(stream: Readable): this { stream.on('error', error => this.destroy(error)); stream.pipe(this); return this; }
  public override _transform(chunk: Buffer | Uint8Array, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.busy = true;
    try {
      if (this.drain() && this.reader.paused) this.reader.resumeEach(frame => this.accept(frame));
      this.reader.writeEach(chunk, frame => this.accept(frame));
      this.busy = false; callback();
    } catch (error) { this.busy = false; callback(error as Error); }
  }
  public override _read(size: number): void {
    if (this.busy) return;
    this.busy = true;
    try { if (this.drain() && this.reader.paused) this.reader.resumeEach(frame => this.accept(frame)); }
    catch (error) { this.busy = false; this.destroy(error as Error); return; }
    this.busy = false;
    if (!this.reader.paused && this.index >= this.pending.length) super._read(size);
  }
  public override _flush(callback: TransformCallback): void {
    this.busy = true;
    try {
      this.drain(true);
      this.reader.endEach(frame => { this.pending = this.decoder.decode(frame); this.index = 0; this.drain(true); });
      this.pending = this.decoder.finish(); this.index = 0; this.drain(true);
      this.busy = false; callback();
    } catch (error) { this.busy = false; callback(error as Error); }
  }
  private accept(frame: SparqlFrame): boolean {
    this.pending = this.decoder.decode(frame); this.index = 0;
    return this.drain();
  }
  private drain(force = false): boolean {
    while (this.index < this.pending.length) {
      const accepted = this.push(this.pending[this.index++]!);
      if (!accepted && !force) return false;
    }
    this.pending = []; this.index = 0;
    return true;
  }
}
/** Consumes the event stream produced by SparqlStreamParser. */
export class SparqlStreamWriter extends Transform {
  private readonly writer: SparqlWriter;
  public constructor(options: SparqlWriterOptions = {}) {
    super({ writableObjectMode: true, readableObjectMode: false });
    this.writer = new SparqlWriter(options, bytes => { this.push(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)); });
  }
  public import(stream: Readable): this { stream.on('error', error => this.destroy(error)); stream.pipe(this); return this; }
  public override _transform(event: SparqlEvent, _encoding: BufferEncoding, callback: TransformCallback): void {
    try { this.writer.write(event); callback(); } catch (error) { callback(error as Error); }
  }
  public override _flush(callback: TransformCallback): void {
    try { this.writer.end(); callback(); } catch (error) { callback(error as Error); }
  }
}
