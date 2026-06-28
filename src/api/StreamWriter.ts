import { Transform, type Readable, type TransformCallback } from 'node:stream';
import type * as RDF from '@rdfjs/types';
import { Writer } from './Writer';
import type { MessageQuad, WriterOptions } from '../types';

export class StreamWriter extends Transform {
  private readonly writer: Writer;

  public constructor(options: WriterOptions = {}) {
    super({ writableObjectMode: true, readableObjectMode: false });
    this.writer = new Writer(options);
  }

  public import(stream: Readable): this {
    stream.on('error', error => this.destroy(error));
    stream.pipe(this);
    return this;
  }

  public override _transform(value: RDF.Quad | MessageQuad, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.writer.addQuad(value, error => callback(error ?? undefined));
  }

  public override _flush(callback: TransformCallback): void {
    this.writer.end((error, output) => {
      if (error) callback(error);
      else {
        if (output) this.push(Buffer.from(output.buffer, output.byteOffset, output.byteLength));
        callback();
      }
    });
  }
}

