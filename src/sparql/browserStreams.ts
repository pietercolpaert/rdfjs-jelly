import type { BinaryInput } from '../types';
import type { SparqlEvent, SparqlParserOptions, SparqlWriterOptions } from '../sparql-types';
import { SparqlFrameDecoder } from './framing';
import { SparqlDecoder } from './SparqlDecoder';
import { SparqlWriter } from './SparqlWriter';

/** Web Streams equivalent of the Node event parser, with frame-level backpressure. */
export class SparqlStreamParser {
  public readonly readable: ReadableStream<SparqlEvent>;
  public readonly writable: WritableStream<BinaryInput>;
  public constructor(options: SparqlParserOptions = {}) {
    let reader: SparqlFrameDecoder | undefined = new SparqlFrameDecoder(options);
    let decoder: SparqlDecoder | undefined = new SparqlDecoder(options);
    let output: ReadableStreamDefaultController<SparqlEvent>;
    let input: WritableStreamDefaultController;
    let pending: SparqlEvent[] = [];
    let index = 0;
    let stopped = false;
    let failure: unknown;
    let wake: (() => void) | undefined;
    const release = (): void => { pending = []; reader = undefined; decoder = undefined; };
    const fail = (reason: unknown, errorInput = true): void => {
      if (stopped) return;
      stopped = true; failure = reason; release(); output.error(reason);
      if (errorInput) input.error(reason);
      wake?.(); wake = undefined;
    };
    const accept = (frame: Parameters<SparqlDecoder['decode']>[0]): false => {
      pending = decoder!.decode(frame); index = 0; return false;
    };
    const drain = async (): Promise<void> => {
      while (true) {
        if (stopped) throw failure;
        if (index < pending.length) {
          if (output.desiredSize! <= 0) { await new Promise<void>(resolve => { wake = resolve; }); continue; }
          output.enqueue(pending[index++]!);
        } else {
          pending = []; index = 0;
          if (!reader!.paused) return;
          if (output.desiredSize! <= 0) { await new Promise<void>(resolve => { wake = resolve; }); continue; }
          reader!.resumeEach(accept);
        }
      }
    };
    this.readable = new ReadableStream<SparqlEvent>({
      start: controller => { output = controller; },
      pull: () => { wake?.(); wake = undefined; },
      cancel: reason => { fail(reason); },
    }, { highWaterMark: 256 });
    this.writable = new WritableStream<BinaryInput>({
      start: controller => {
        input = controller;
        controller.signal.addEventListener('abort', () => fail(controller.signal.reason, false), { once: true });
      },
      write: async chunk => {
        try { reader!.writeEach(chunk, accept); await drain(); }
        catch (error) { fail(error); throw error; }
      },
      close: async () => {
        try {
          reader!.endEach(accept); await drain();
          pending = decoder!.finish(); index = 0; await drain();
          output.close(); stopped = true; release();
        } catch (error) { fail(error); throw error; }
      },
      abort: reason => { fail(reason); },
    });
  }
  public import(stream: ReadableStream<BinaryInput>): ReadableStream<SparqlEvent> { return stream.pipeThrough(this); }
}
export class SparqlStreamWriter {
  public readonly readable: ReadableStream<Uint8Array>;
  public readonly writable: WritableStream<SparqlEvent>;
  public constructor(options: SparqlWriterOptions = {}) {
    let writer: SparqlWriter;
    const stream = new TransformStream<SparqlEvent, Uint8Array>({
      start: controller => { writer = new SparqlWriter(options, bytes => controller.enqueue(bytes)); },
      transform: event => { writer.write(event); },
      flush: () => { writer.end(); },
    });
    this.readable = stream.readable; this.writable = stream.writable;
  }
  public import(stream: ReadableStream<SparqlEvent>): ReadableStream<Uint8Array> { return stream.pipeThrough(this); }
}
