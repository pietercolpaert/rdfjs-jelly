import { Transform, type Readable, type TransformCallback } from 'node:stream';
import type * as RDF from '@rdfjs/types';
import { Writer } from './Writer';
import type { MessageQuad, WriterOptions } from '../types';

const FLUSH = Symbol('flush');

export class StreamWriter extends Transform {
  private readonly writer: Writer;

  public constructor(options: WriterOptions = {}) {
    super({ writableObjectMode: true, readableObjectMode: false });
    this.writer = new Writer({
      write: chunk => this.push(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)),
      end: callback => callback?.(null),
    }, options);
  }

  public import(stream: Readable): this {
    stream.on('error', error => this.destroy(error));
    stream.pipe(this);
    return this;
  }

  /** Flush after all preceding writes. The callback signals serialization into
   * the readable side, not delivery to a downstream consumer. */
  public flush(callback?: (error?: Error | null) => void): boolean {
    return this.write(FLUSH, callback);
  }

  public override _transform(value: RDF.Quad | MessageQuad | typeof FLUSH, _encoding: BufferEncoding, callback: TransformCallback): void {
    if (value === FLUSH) this.writer.flush(error => callback(error ?? undefined));
    else this.writer.addQuad(value, error => callback(error ?? undefined));
  }

  public override _flush(callback: TransformCallback): void {
    this.writer.end(error => callback(error ?? undefined));
  }
}
