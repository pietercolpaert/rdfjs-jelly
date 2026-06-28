import { Transform, type Readable, type TransformCallback } from 'node:stream';
import { Decoder } from '../codec/Decoder';
import { MessageDecoder } from '../codec/MessageDecoder';
import type { Message, MessageQuad, StreamParserOptions } from '../types';

export class StreamParser extends Transform {
  private readonly messageReader: MessageDecoder;
  private readonly decoder: Decoder;
  private readonly messageMode: boolean;

  public constructor(options: StreamParserOptions = {}) {
    super({ ...options, readableObjectMode: true, writableObjectMode: false });
    this.messageReader = new MessageDecoder(options);
    this.messageMode = options.messages === true || options.rdfMessages === true;
    this.decoder = new Decoder(options, {
      options: value => this.emit('options', value),
      namespace: (prefix, iri) => this.emit('namespace', prefix, iri),
    });
  }

  public import(stream: Readable): this {
    stream.on('error', error => this.destroy(error));
    stream.pipe(this);
    return this;
  }

  public override _transform(chunk: Buffer | Uint8Array, _encoding: BufferEncoding, callback: TransformCallback): void {
    try {
      for (const frame of this.messageReader.write(chunk)) this.pushMessage(this.decoder.decode(frame));
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public override _flush(callback: TransformCallback): void {
    try {
      for (const frame of this.messageReader.end()) this.pushMessage(this.decoder.decode(frame));
      this.decoder.finish();
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private pushMessage(message: Message): void {
    this.emit('message', message);
    for (const quad of message) {
      if (this.messageMode) {
        const entry: MessageQuad = { quad, messageCounter: message.messageCounter };
        this.emit('messageCounter', message.messageCounter, quad);
        this.push(entry);
      } else this.push(quad);
    }
  }
}
