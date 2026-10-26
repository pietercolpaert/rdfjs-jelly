import type * as RDF from '@rdfjs/types';
import type { TransformOptions } from 'node:stream';
import type { LookupPreset } from './options';

export enum PhysicalStreamType {
  UNSPECIFIED = 0,
  TRIPLES = 1,
  QUADS = 2,
  GRAPHS = 3,
}

export enum LogicalStreamType {
  UNSPECIFIED = 0,
  FLAT_TRIPLES = 1,
  FLAT_QUADS = 2,
  GRAPHS = 3,
  DATASETS = 4,
  SUBJECT_GRAPHS = 13,
  NAMED_GRAPHS = 14,
  TIMESTAMPED_NAMED_GRAPHS = 114,
}

export enum RdfStreamType { FLAT = 0, MESSAGES = 1 }
export enum RdfVersion { UNSPECIFIED = 0, RDF_1_1 = 1, RDF_1_2_BASIC = 2, RDF_1_2 = 3 }

export type BinaryInput = Uint8Array | ArrayBuffer;
export type MessageMetadata = ReadonlyMap<string, Uint8Array> | Record<string, Uint8Array>;

export interface MessageQuad {
  quad: RDF.Quad;
  messageCounter: number;
}

export interface MessageQuadArray extends Array<MessageQuad> {
  messageCount: number;
}

export class Message extends Array<RDF.Quad> {
  public static override get [Symbol.species](): ArrayConstructor { return Array; }
  public readonly metadata: ReadonlyMap<string, Uint8Array>;

  public constructor(
    public readonly messageCounter: number,
    quads: Iterable<RDF.Quad> = [],
    metadata: MessageMetadata = new Map(),
  ) {
    super();
    if (Array.isArray(quads)) for (let i = 0; i < quads.length; i++) this.push(quads[i]!);
    else for (const quad of quads) this.push(quad);
    this.metadata = metadata instanceof Map ? metadata : new Map(Object.entries(metadata));
  }
}

export interface StreamOptions {
  streamName: string;
  physicalType: PhysicalStreamType;
  logicalType: LogicalStreamType;
  generalizedStatements: boolean;
  rdfStar: boolean;
  maxNameTableSize: number;
  maxPrefixTableSize: number;
  maxDatatypeTableSize: number;
  version: number;
  streamType?: RdfStreamType;
  rdfVersion?: RdfVersion;
}

/** Positions within a pattern are ANDed; patterns are ORed. Omitted or null
 * positions are wildcards. Blank-node labels refer to parser output labels. */
export interface QuadPattern {
  subject?: RDF.Term | null;
  predicate?: RDF.Term | null;
  object?: RDF.Term | null;
  graph?: RDF.Term | null;
}

export interface ParserOptions {
  /** Select quads before RDF/JS materialization in Jelly 1.2. An empty array
   * selects no quads. Message boundaries, counters and metadata are retained. */
  quadPatterns?: readonly QuadPattern[];
  factory?: RDF.DataFactory;
  delimited?: boolean | 'auto';
  strict?: boolean;
  maxSupportedVersion?: 1 | 2 | 3;
  /** Maximum statements per column batch (default 1,048,576). */
  maxRowsPerBatch?: number;
  messages?: boolean;
  rdfMessages?: boolean;
  maxMessageSize?: number;
  /**
   * Largest lookup table size this parser accepts from a stream's options row.
   * Defaults to `MAX_DECODED_LOOKUP_SIZE`. The specification sets no maximum, so
   * this only guards against a hostile stream declaring an absurd table.
   */
  maxLookupTableSize?: number;
}

export interface StreamParserOptions extends ParserOptions, TransformOptions {}

export interface WriterOptions {
  physicalType?: PhysicalStreamType;
  logicalType?: LogicalStreamType;
  delimited?: boolean;
  /** Row budget for 1.1, statement budget per column batch for 1.2. */
  messageSize?: number;
  /** Jelly 1.2: share batches across messages. Defaults to true. Output may be
   * buffered until a batch fills, flush() is called, or the writer ends. Set
   * false to emit each complete message. Metadata messages remain separate. */
  packMessages?: boolean;
  /** Jelly 1.2: keep bounded name and datatype tables across batches, so a name
   * is sent once per stream rather than once per batch. Defaults to true;
   * `false` makes every batch self-contained, at a large cost in output size. */
  persistentLookups?: boolean;
  streamName?: string;
  namespaces?: Record<string, string | RDF.NamedNode>;
  lookup?: Partial<LookupPreset>;
  /** Protocol tag: 2 = Jelly 1.1, 3 = Jelly 1.2 (default). */
  version?: 2 | 3;
  streamType?: RdfStreamType;
  rdfVersion?: RdfVersion;
}

export interface BinaryOutput {
  write(chunk: Uint8Array, callback?: (error?: Error | null) => void): unknown;
  end(callback?: (error?: Error | null) => void): unknown;
}

export type ParserOutput = RDF.Quad[] | MessageQuadArray;
export type ParserOutputItem = RDF.Quad | MessageQuad;
export type ParseCallback = (
  error: Error | null,
  quad?: RDF.Quad | null,
  namespaces?: Record<string, RDF.NamedNode>,
  messageCounter?: number,
) => void;

export type WriterEndCallback = (error: Error | null, output?: Uint8Array) => void;

export function isMessageQuad(value: unknown): value is MessageQuad {
  return Boolean(value && typeof value === 'object' && 'quad' in value && 'messageCounter' in value);
}

export function toMessages(output: Iterable<ParserOutputItem>, messageCount?: number): Message[] {
  const messages: Message[] = [];
  const inferredCount = messageCount ?? (Array.isArray(output) && 'messageCount' in output
    ? (output as Partial<MessageQuadArray>).messageCount
    : undefined);
  let wrapped = false;
  for (const item of output) {
    const entry = isMessageQuad(item) ? item : { quad: item, messageCounter: 0 };
    wrapped ||= isMessageQuad(item);
    while (messages.length <= entry.messageCounter) messages.push(new Message(messages.length));
    messages[entry.messageCounter]!.push(entry.quad);
  }
  if (inferredCount !== undefined) {
    while (messages.length < inferredCount) messages.push(new Message(messages.length));
  } else if (!wrapped && messages.length === 0) {
    return [];
  }
  return messages;
}
