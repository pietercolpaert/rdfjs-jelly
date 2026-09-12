export * from './shared';

import type * as RDF from '@rdfjs/types';
import { Decoder } from './codec/Decoder';
import { DirectMessageDecoder } from './codec/MessageDecoder';
import { Writer } from './api/Writer';
import type { Message, MessageQuad, ParserOutputItem, StreamOptions, WriterOptions } from './types';
import type { ParserOptions } from './types';

export type BrowserStreamChunk = Uint8Array | ArrayBuffer;

/**
 * Maximum number of output items queued on the readable side. A decoded frame
 * and unread input bytes are retained separately while consumer demand pauses.
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
    let decoder: Decoder | undefined = new Decoder(options, {
      options: value => this.emit('options', value),
      namespace: (prefix, iri) => this.emit('namespace', prefix, iri),
    });
    let reader: DirectMessageDecoder | undefined = new DirectMessageDecoder(options, decoder);
    let output: ReadableStreamDefaultController<ParserOutputItem>;
    let input: WritableStreamDefaultController;
    let pending: Message | undefined;
    let index = 0;
    let stopped = false;
    let failure: unknown;
    let wake: (() => void) | undefined;
    const release = (): void => {
      pending = undefined;
      reader = undefined;
      decoder = undefined;
    };
    const fail = (reason: unknown, errorInput = true): void => {
      if (stopped) return;
      stopped = true;
      failure = reason;
      release();
      output.error(reason);
      if (errorInput) input.error(reason);
      wake?.();
      wake = undefined;
    };
    const accept = (message: Message): false => {
      pending = message;
      index = 0;
      this.emit('message', message);
      return false;
    };
    // Stop after each frame so a large frame can also be delivered a quad at a
    // time. A pending write owns the drain; pull only wakes it when space opens.
    const drain = async (): Promise<void> => {
      while (true) {
        if (stopped) throw failure;
        if (pending && index < pending.length) {
          if (output.desiredSize! <= 0) {
            await new Promise<void>(resolve => { wake = resolve; });
            continue;
          }
          const quad = pending[index++]!;
          if (messageMode) {
            const entry: MessageQuad = { quad, messageCounter: pending.messageCounter };
            this.emit('messageCounter', pending.messageCounter, quad);
            if (stopped) throw failure;
            output.enqueue(entry);
          } else output.enqueue(quad);
        } else {
          pending = undefined;
          if (!reader!.paused) return;
          // Do not decode another frame while the output queue is full.
          if (output.desiredSize! <= 0) {
            await new Promise<void>(resolve => { wake = resolve; });
            continue;
          }
          reader!.resumeEach(accept);
        }
      }
    };
    this.readable = new ReadableStream<ParserOutputItem>({
      start: controller => { output = controller; },
      pull: () => {
        wake?.();
        wake = undefined;
      },
      cancel: reason => { fail(reason); },
    }, { highWaterMark: READABLE_QUEUE });
    this.writable = new WritableStream<BrowserStreamChunk>({
      start: controller => {
        input = controller;
        // abort() waits for an in-flight write; its signal must wake that write
        // immediately if it is waiting for a reader that will never consume.
        controller.signal.addEventListener('abort', () => fail(controller.signal.reason, false), { once: true });
      },
      write: async chunk => {
        try {
          reader!.writeEach(chunk, accept);
          await drain();
        } catch (error) {
          fail(error);
          throw error;
        }
      },
      close: async () => {
        try {
          reader!.endEach(accept);
          await drain();
          decoder!.finish();
          output.close();
          stopped = true;
          release();
        } catch (error) {
          fail(error);
          throw error;
        }
      },
      abort: reason => { fail(reason); },
    });
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
