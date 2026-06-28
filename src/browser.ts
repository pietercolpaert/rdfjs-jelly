export * from './shared';

import type * as RDF from '@rdfjs/types';
import { Decoder } from './codec/Decoder';
import { MessageDecoder } from './codec/MessageDecoder';
import { Writer } from './api/Writer';
import type { Message, MessageQuad, ParserOutputItem, StreamOptions, WriterOptions } from './types';
import type { ParserOptions } from './types';

export type BrowserStreamChunk = Uint8Array | ArrayBuffer;
type BrowserParserEvent = 'options' | 'namespace' | 'message' | 'messageCounter';
type Listener = (...args: any[]) => void;

export class StreamParser {
  public readonly readable: ReadableStream<ParserOutputItem>;
  public readonly writable: WritableStream<BrowserStreamChunk>;
  private readonly listeners: Partial<Record<BrowserParserEvent, Listener[]>> = {};

  public constructor(options: ParserOptions = {}) {
    const reader = new MessageDecoder(options);
    const messageMode = options.messages === true || options.rdfMessages === true;
    const decoder = new Decoder(options, {
      options: value => this.emit('options', value),
      namespace: (prefix, iri) => this.emit('namespace', prefix, iri),
    });
    const push = (message: Message, controller: TransformStreamDefaultController<ParserOutputItem>): void => {
      this.emit('message', message);
      for (const quad of message) {
        if (messageMode) {
          const entry: MessageQuad = { quad, messageCounter: message.messageCounter };
          this.emit('messageCounter', message.messageCounter, quad);
          controller.enqueue(entry);
        } else controller.enqueue(quad);
      }
    };
    const transform = new TransformStream<BrowserStreamChunk, ParserOutputItem>({
      transform: (chunk, controller) => {
        for (const frame of reader.write(chunk)) push(decoder.decode(frame), controller);
      },
      flush: controller => {
        for (const frame of reader.end()) push(decoder.decode(frame), controller);
        decoder.finish();
      },
    });
    this.readable = transform.readable;
    this.writable = transform.writable;
  }

  public import(stream: ReadableStream<BrowserStreamChunk>): ReadableStream<ParserOutputItem> {
    return stream.pipeThrough(this);
  }

  public on(event: BrowserParserEvent, listener: Listener): this {
    (this.listeners[event] ??= []).push(listener);
    return this;
  }

  public addEventListener(event: BrowserParserEvent, listener: Listener): this { return this.on(event, listener); }

  private emit(event: 'options', options: StreamOptions): void;
  private emit(event: 'namespace', prefix: string, iri: RDF.NamedNode): void;
  private emit(event: 'message', message: Message): void;
  private emit(event: 'messageCounter', counter: number, quad: RDF.Quad): void;
  private emit(event: BrowserParserEvent, ...args: unknown[]): void {
    for (const listener of this.listeners[event] ?? []) listener(...args);
  }
}

export class StreamWriter {
  public readonly readable: ReadableStream<Uint8Array>;
  public readonly writable: WritableStream<RDF.Quad | MessageQuad>;

  public constructor(options: WriterOptions = {}) {
    const writer = new Writer(options);
    const transform = new TransformStream<RDF.Quad | MessageQuad, Uint8Array>({
      transform: value => writer.addQuad(value),
      flush: controller => writer.end((error, output) => {
        if (error) throw error;
        if (output) controller.enqueue(output);
      }),
    });
    this.readable = transform.readable;
    this.writable = transform.writable;
  }

  public import(stream: ReadableStream<RDF.Quad | MessageQuad>): ReadableStream<Uint8Array> {
    return stream.pipeThrough(this);
  }
}
