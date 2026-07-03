import type * as RDF from '@rdfjs/types';
import { Zstd } from '@hpcc-js/wasm-zstd';
import { Parser as RdfTextParser } from 'rdf-parser-ts/browser';
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
