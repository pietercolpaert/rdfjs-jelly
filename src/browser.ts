export * from './shared';

import type * as RDF from '@rdfjs/types';
import { Decoder } from './codec/Decoder';
import { DirectMessageDecoder } from './codec/MessageDecoder';
import { Writer } from './api/Writer';
import type { Message, MessageQuad, ParserOutputItem, StreamOptions, WriterOptions } from './types';
import type { ParserOptions } from './types';

export type BrowserStreamChunk = Uint8Array | ArrayBuffer;

/**
 * Objects the readable side buffers before the parser stops decoding. A
 * TransformStream defaults to zero here, which would pause after every message;
 * a small queue keeps throughput up while still bounding memory.
 */
const READABLE_QUEUE = 256;
type BrowserParserEvent = 'options' | 'namespace' | 'message' | 'messageCounter';
type Listener = (...args: any[]) => void;

export class StreamParser {
  public readonly readable: ReadableStream<ParserOutputItem>;
  public readonly writable: WritableStream<BrowserStreamChunk>;
  private readonly listeners: Partial<Record<BrowserParserEvent, Listener[]>> = {};

  public constructor(options: ParserOptions = {}) {
    const messageMode = options.messages === true || options.rdfMessages === true;
    const decoder = new Decoder(options, {
      options: value => this.emit('options', value),
      namespace: (prefix, iri) => this.emit('namespace', prefix, iri),
    });
    const reader = new DirectMessageDecoder(options, decoder);
    // Returns false once the readable side is full, which stops frame decoding
    // until the next chunk or the final flush. Undecoded bytes stay in `reader`,
    // so what is held in memory is bounded by one Jelly message.
    const deliver = (
      message: Message,
      controller: TransformStreamDefaultController<ParserOutputItem>,
      always: boolean,
    ): boolean => {
      this.emit('message', message);
      for (const quad of message) {
        if (messageMode) {
          const entry: MessageQuad = { quad, messageCounter: message.messageCounter };
          this.emit('messageCounter', message.messageCounter, quad);
          controller.enqueue(entry);
        } else controller.enqueue(quad);
      }
      return always || controller.desiredSize === null || controller.desiredSize > 0;
    };
    const transform = new TransformStream<BrowserStreamChunk, ParserOutputItem>(
      {
        transform: (chunk, controller) => {
          const consume = (message: Message): boolean => deliver(message, controller, false);
          if (reader.paused) reader.resumeEach(consume);
          reader.writeEach(chunk, consume);
        },
        flush: controller => {
          reader.endEach(message => deliver(message, controller, true));
          decoder.finish();
        },
      },
      undefined,
      { highWaterMark: READABLE_QUEUE },
    );
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
    let controller: TransformStreamDefaultController<Uint8Array>;
    const writer = new Writer({
      write: chunk => controller.enqueue(chunk),
      end: callback => callback?.(null),
    }, options);
    const transform = new TransformStream<RDF.Quad | MessageQuad, Uint8Array>({
      start: value => { controller = value; },
      transform: value => writer.addQuad(value),
      flush: () => writer.end(error => {
        if (error) throw error;
      }),
    });
    this.readable = transform.readable;
    this.writable = transform.writable;
  }

  public import(stream: ReadableStream<RDF.Quad | MessageQuad>): ReadableStream<Uint8Array> {
    return stream.pipeThrough(this);
  }
}
