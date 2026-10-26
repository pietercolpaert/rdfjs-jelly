import type * as RDF from '@rdfjs/types';
import { concatBytes } from '../codec/bytes';
import { ColumnEncoder } from '../codec/ColumnEncoder';
import { Encoder } from '../codec/Encoder';
import { MessageEncoder } from '../codec/MessageEncoder';
import { JellyConformanceError } from '../errors';
import {
  Message,
  isMessageQuad,
  type BinaryOutput,
  type MessageMetadata,
  type MessageQuad,
  type MessageQuadArray,
  type WriterEndCallback,
  type WriterOptions,
} from '../types';

function isOutput(value: unknown): value is BinaryOutput {
  return Boolean(value && typeof value === 'object' && 'write' in value && 'end' in value);
}

export class Writer {
  private readonly encoder: Encoder | ColumnEncoder;
  private readonly messageEncoder: MessageEncoder;
  private readonly output?: BinaryOutput;
  private pendingCounter: number | undefined;
  private pendingQuads: RDF.Quad[] = [];
  private lastCompletedCounter = -1;
  private mode: 'plain' | 'messages' | undefined;
  private ended = false;
  private readonly streaming: boolean;
  /**
   * Delimited output with no sink is serialised frame by frame as each one
   * completes, so finished rows and terms become garbage immediately instead of
   * being retained until end().
   */
  private readonly chunks?: Uint8Array[];

  public constructor(options?: WriterOptions);
  public constructor(output: BinaryOutput, options?: WriterOptions);
  public constructor(outputOrOptions: BinaryOutput | WriterOptions = {}, maybeOptions: WriterOptions = {}) {
    const options = isOutput(outputOrOptions) ? maybeOptions : outputOrOptions;
    this.output = isOutput(outputOrOptions) ? outputOrOptions : undefined;
    this.messageEncoder = new MessageEncoder(options.delimited ?? true);
    this.streaming = Boolean(this.output && this.messageEncoder.delimited);
    const buffered = !this.output && this.messageEncoder.delimited;
    if (buffered) this.chunks = [];
    const EncoderClass = (options.version ?? 3) === 3 ? ColumnEncoder : Encoder;
    this.encoder = new EncoderClass(options, this.streaming
      ? frame => this.writeFrame(frame)
      : buffered ? frame => this.chunks!.push(this.messageEncoder.encode(frame)) : undefined);
    for (const [prefix, iri] of Object.entries(options.namespaces ?? {})) {
      this.encoder.addNamespace(prefix, typeof iri === 'string' ? iri : iri.value);
    }
  }

  public addQuad(value: RDF.Quad | MessageQuad, done?: (error?: Error | null) => void): void {
    try {
      if (isMessageQuad(value)) this.addMessageQuad(value);
      else {
        this.requireMode('plain');
        this.encoder.addQuad(value);
      }
      done?.(null);
    } catch (error) {
      const actual = error instanceof Error ? error : new Error(String(error));
      if (done) done(actual); else throw actual;
    }
  }

  public addQuads(values: Iterable<RDF.Quad | MessageQuad>): void {
    for (const value of values) this.addQuad(value);
    if (Array.isArray(values) && 'messageCount' in values) {
      this.flushPending();
      const count = (values as Partial<MessageQuadArray>).messageCount;
      if (typeof count === 'number') {
        while (this.lastCompletedCounter + 1 < count) {
          this.encoder.addMessage([]);
          this.lastCompletedCounter++;
        }
      }
    }
  }

  public addNamespace(prefix: string, iri: string | RDF.NamedNode): void {
    this.encoder.addNamespace(prefix, typeof iri === 'string' ? iri : iri.value);
  }

  public addMessage(message: Iterable<RDF.Quad> | Message, metadata?: MessageMetadata): void {
    this.requireMode('messages');
    this.flushPending();
    if (message instanceof Message) {
      while (this.lastCompletedCounter + 1 < message.messageCounter) {
        this.encoder.addMessage([]);
        this.lastCompletedCounter++;
      }
      if (message.messageCounter <= this.lastCompletedCounter) throw new JellyConformanceError('Message counters must increase');
      this.encoder.addMessage(message, metadata ?? message.metadata);
      this.lastCompletedCounter = message.messageCounter;
    } else {
      this.encoder.addMessage(message, metadata);
      this.lastCompletedCounter++;
    }
  }

  /** Complete all RDF Messages below messageCount, adding any empty messages. */
  public finishMessages(messageCount: number): void {
    this.requireMode('messages');
    if (!Number.isInteger(messageCount) || messageCount < 0) throw new JellyConformanceError('Invalid messageCount');
    if (this.pendingCounter !== undefined && this.pendingCounter < messageCount) this.flushPending();
    if (messageCount < this.lastCompletedCounter + 1) throw new JellyConformanceError('Message count cannot decrease');
    while (this.lastCompletedCounter + 1 < messageCount) {
      this.encoder.addMessage([]);
      this.lastCompletedCounter++;
    }
  }

  public addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.requireMode('messages');
    this.flushPending();
    this.encoder.addGraph(graph, quads, metadata);
    this.lastCompletedCounter++;
  }

  /** Emit buffered delimited frames without ending the writer. Counter-based
   * input completes its current logical message. Without a sink, bytes remain
   * buffered for end(). */
  public flush(done?: (error?: Error | null) => void): void {
    try {
      if (this.ended) throw new JellyConformanceError('Writer has already ended');
      if (!this.messageEncoder.delimited) throw new JellyConformanceError('flush() requires delimited output');
      this.flushPending();
      this.encoder.flush();
      done?.(null);
    } catch (error) {
      const actual = error instanceof Error ? error : new Error(String(error));
      if (done) done(actual); else throw actual;
    }
  }

  public end(done?: WriterEndCallback): void {
    try {
      if (this.ended) throw new JellyConformanceError('Writer has already ended');
      this.ended = true;
      this.flushPending();
      const frames = this.encoder.finish();
      if (this.streaming) {
        this.output!.end(error => done?.(error ?? null));
        return;
      }
      const bytes = this.chunks ? this.collectChunks() : this.messageEncoder.encodeAll(frames);
      if (this.output) {
        this.output.write(bytes);
        this.output.end(error => done?.(error ?? null, error ? undefined : bytes));
      } else done?.(null, bytes);
    } catch (error) {
      const actual = error instanceof Error ? error : new Error(String(error));
      if (done) done(actual); else throw actual;
    }
  }

  private collectChunks(): Uint8Array {
    const chunks = this.chunks!;
    const output = chunks.length === 1 ? chunks[0]! : concatBytes(chunks);
    chunks.length = 0;
    return output;
  }

  private writeFrame(frame: Parameters<MessageEncoder['encode']>[0]): void {
    this.output!.write(this.messageEncoder.encode(frame));
  }

  private addMessageQuad(entry: MessageQuad): void {
    this.requireMode('messages');
    if (!Number.isInteger(entry.messageCounter) || entry.messageCounter < 0) throw new JellyConformanceError('Invalid messageCounter');
    if (this.pendingCounter === undefined) {
      if (entry.messageCounter <= this.lastCompletedCounter) throw new JellyConformanceError('Message counters must increase');
      while (this.lastCompletedCounter + 1 < entry.messageCounter) {
        this.encoder.addMessage([]);
        this.lastCompletedCounter++;
      }
      this.pendingCounter = entry.messageCounter;
    } else if (entry.messageCounter !== this.pendingCounter) {
      if (entry.messageCounter < this.pendingCounter) throw new JellyConformanceError('Message counters must be ordered');
      this.flushPending();
      while (this.lastCompletedCounter + 1 < entry.messageCounter) {
        this.encoder.addMessage([]);
        this.lastCompletedCounter++;
      }
      this.pendingCounter = entry.messageCounter;
    }
    this.pendingQuads.push(entry.quad);
  }

  private flushPending(): void {
    if (this.pendingCounter === undefined) return;
    this.encoder.addMessage(this.pendingQuads);
    this.lastCompletedCounter = this.pendingCounter;
    this.pendingCounter = undefined;
    this.pendingQuads = [];
  }

  private requireMode(mode: 'plain' | 'messages'): void {
    if (this.mode && this.mode !== mode) throw new JellyConformanceError('Cannot mix plain quad and explicit message writer calls');
    this.mode = mode;
  }
}
