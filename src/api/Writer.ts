import type * as RDF from '@rdfjs/types';
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
  private readonly encoder: Encoder;
  private readonly messageEncoder: MessageEncoder;
  private readonly output?: BinaryOutput;
  private pendingCounter: number | undefined;
  private pendingQuads: RDF.Quad[] = [];
  private lastCompletedCounter = -1;
  private mode: 'plain' | 'messages' | undefined;
  private ended = false;

  public constructor(options?: WriterOptions);
  public constructor(output: BinaryOutput, options?: WriterOptions);
  public constructor(outputOrOptions: BinaryOutput | WriterOptions = {}, maybeOptions: WriterOptions = {}) {
    const options = isOutput(outputOrOptions) ? maybeOptions : outputOrOptions;
    this.output = isOutput(outputOrOptions) ? outputOrOptions : undefined;
    this.encoder = new Encoder(options);
    this.messageEncoder = new MessageEncoder(options.delimited ?? true);
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

  public addGraph(graph: RDF.Quad_Graph, quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.requireMode('messages');
    this.flushPending();
    this.encoder.addGraph(graph, quads, metadata);
    this.lastCompletedCounter++;
  }

  public end(done?: WriterEndCallback): void {
    try {
      if (this.ended) throw new JellyConformanceError('Writer has already ended');
      this.ended = true;
      this.flushPending();
      const bytes = this.messageEncoder.encodeAll(this.encoder.finish());
      if (this.output) {
        this.output.write(bytes);
        this.output.end(error => done?.(error ?? null, error ? undefined : bytes));
      } else done?.(null, bytes);
    } catch (error) {
      const actual = error instanceof Error ? error : new Error(String(error));
      if (done) done(actual); else throw actual;
    }
  }

  private addMessageQuad(entry: MessageQuad): void {
    this.requireMode('messages');
    if (!Number.isInteger(entry.messageCounter) || entry.messageCounter < 0) throw new JellyConformanceError('Invalid messageCounter');
    if (this.pendingCounter === undefined) {
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
