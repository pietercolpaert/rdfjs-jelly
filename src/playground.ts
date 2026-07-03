import type * as RDF from '@rdfjs/types';
import { Zstd } from '@hpcc-js/wasm-zstd';
import {
  IncrementalParser as RdfTextIncrementalParser,
  Parser as RdfTextParser,
  isMessageQuad as isRdfTextMessageQuad,
  type ParserOutputItem as RdfTextParserOutputItem,
} from 'rdf-parser-ts/browser';
import { Writer } from './api/Writer';

let zstdPromise: Promise<Zstd> | undefined;

function loadZstd(): Promise<Zstd> {
  return zstdPromise ??= Zstd.load();
}

/** Compress a complete buffer as one standard Zstandard frame. */
export async function compressZstd(input: Uint8Array, level = 3): Promise<Uint8Array> {
  return (await loadZstd()).compress(input, level);
}

/** Decompress one or more standard Zstandard frames. */
export async function decompressZstd(input: Uint8Array): Promise<Uint8Array> {
  return (await loadZstd()).decompress(input);
}

export interface MessageLogConversionResult {
  jelly: Uint8Array;
  messageCount: number;
  quadCount: number;
}

export interface MessageLogConversionProgress {
  messageCount: number;
  quadCount: number;
  jellyByteCount: number;
}

export interface MessageLogStreamConversion {
  readable: ReadableStream<Uint8Array>;
  result: Promise<MessageLogConversionProgress>;
}

type IncrementalParserState = {
  parserState: {
    messageCountHint: number;
    messageCounter: number;
    namedNodeCache: Map<string, unknown>;
  };
};

/** Parse an RDF 1.2 Message Stream Log and encode its messages as Jelly v2. */
export function convertMessageLogToJelly(input: string): MessageLogConversionResult {
  const messages = new RdfTextParser({ rdfMessages: true }).parseMessages(input);
  const writer = new Writer({ version: 2 });
  let quadCount = 0;

  for (const message of messages) {
    quadCount += message.length;
    writer.addMessage(message as unknown as Iterable<RDF.Quad>);
  }

  let jelly: Uint8Array | undefined;
  let failure: Error | undefined;
  writer.end((error, output) => {
    if (error) failure = error;
    else jelly = output;
  });
  if (failure) throw failure;
  if (!jelly) throw new Error('The Jelly writer did not produce output.');

  return { jelly, messageCount: messages.length, quadCount };
}

/** Parse an RDF Message Stream Log and emit bounded Jelly frames as they become available. */
export function convertMessageLogStreamToJelly(
  input: ReadableStream<Uint8Array | ArrayBuffer | string>,
  onProgress?: (progress: MessageLogConversionProgress) => void,
): MessageLogStreamConversion {
  const parser = new RdfTextIncrementalParser({ rdfMessages: true });
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let outputController: TransformStreamDefaultController<Uint8Array>;
  let lastMessageCounter = -1;
  let quadCount = 0;
  let jellyByteCount = 0;
  let resolveResult!: (result: MessageLogConversionProgress) => void;
  const result = new Promise<MessageLogConversionProgress>(resolve => { resolveResult = resolve; });
  const writer = new Writer({
    write: chunk => {
      jellyByteCount += chunk.byteLength;
      outputController.enqueue(chunk);
    },
    end: callback => callback?.(null),
  }, { version: 2 });

  const report = (messageCount: number): MessageLogConversionProgress => {
    const progress = { messageCount, quadCount, jellyByteCount };
    onProgress?.(progress);
    return progress;
  };
  const addItems = (items: RdfTextParserOutputItem[]): void => {
    for (const item of items) {
      if (!isRdfTextMessageQuad(item)) throw new Error('The RDF text parser did not enable RDF Messages mode.');
      writer.addQuad(item as unknown as { quad: RDF.Quad; messageCounter: number });
      lastMessageCounter = item.messageCounter;
      quadCount++;
    }
  };
  const parse = (text: string, final = false): void => {
    addItems(final ? parser.end(text) : parser.write(text));
    const state = (parser as unknown as IncrementalParserState).parserState;
    writer.finishMessages(final ? state.messageCountHint : state.messageCounter);
    // Object identity is not part of RDF term equality. Keeping this parser
    // optimization across a multi-gigabyte stream would retain every unique IRI.
    state.namedNodeCache.clear();
    report(final ? state.messageCountHint : Math.max(state.messageCounter, lastMessageCounter + 1));
  };
  const decode = (chunk: Uint8Array | ArrayBuffer | string): string => {
    if (typeof chunk === 'string') return chunk;
    const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
    return decoder.decode(bytes, { stream: true });
  };

  const transform = new TransformStream<Uint8Array | ArrayBuffer | string, Uint8Array>({
    start: controller => { outputController = controller; },
    transform: chunk => parse(decode(chunk)),
    flush: () => {
      parse(decoder.decode(), true);
      // rdf-parser-ts keeps the count on its incremental state because an empty
      // trailing message has no quad that could carry its counter.
      const messageCount = (parser as unknown as IncrementalParserState).parserState.messageCountHint;
      let failure: Error | undefined;
      writer.end(error => { failure = error ?? undefined; });
      if (failure) throw failure;
      const finalResult = report(messageCount);
      resolveResult(finalResult);
    },
  });

  return { readable: input.pipeThrough(transform), result };
}

/** Create a bounded-memory zstd compression stream backed by the WASM codec. */
export async function createZstdCompressionStream(level = 3, chunkSize = 256 * 1024): Promise<TransformStream<Uint8Array, Uint8Array>> {
  if (!Number.isInteger(chunkSize) || chunkSize < 1) throw new RangeError('chunkSize must be a positive integer.');
  const zstd = await loadZstd();
  zstd.reset();
  zstd.setCompressionLevel(level);
  let chunks: Uint8Array[] = [];
  let byteLength = 0;

  const compressPending = (controller: TransformStreamDefaultController<Uint8Array>): void => {
    if (byteLength === 0) return;
    let input: Uint8Array;
    if (chunks.length === 1) input = chunks[0]!;
    else {
      input = new Uint8Array(byteLength);
      let offset = 0;
      for (const chunk of chunks) {
        input.set(chunk, offset);
        offset += chunk.byteLength;
      }
    }
    chunks = [];
    byteLength = 0;
    const output = zstd.compressChunk(input);
    if (output.byteLength > 0) controller.enqueue(output);
  };

  return new TransformStream<Uint8Array, Uint8Array>({
    transform: (chunk, controller) => {
      if (byteLength > 0 && byteLength + chunk.byteLength > chunkSize) compressPending(controller);
      chunks.push(chunk);
      byteLength += chunk.byteLength;
      if (byteLength >= chunkSize) compressPending(controller);
    },
    flush: controller => {
      compressPending(controller);
      const output = zstd.compressEnd();
      if (output.byteLength > 0) controller.enqueue(output);
    },
  });
}
