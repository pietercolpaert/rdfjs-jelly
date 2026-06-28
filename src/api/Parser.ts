import type * as RDF from '@rdfjs/types';
import { Decoder, type DecoderEvents } from '../codec/Decoder';
import { MessageDecoder } from '../codec/MessageDecoder';
import { DataFactory } from '../rdfjs/adapter';
import { Message, type BinaryInput, type MessageQuadArray, type ParseCallback, type ParserOptions, type ParserOutput } from '../types';

export class Parser {
  public readonly options: ParserOptions;
  public _factory: RDF.DataFactory;

  public constructor(options: ParserOptions = {}) {
    this.options = options;
    this._factory = options.factory ?? DataFactory;
  }

  public parse(input: BinaryInput, callback?: ParseCallback): ParserOutput | undefined {
    try {
      const { messages, decoder } = this.decode(input);
      const messageMode = this.options.messages === true || this.options.rdfMessages === true;
      const output: ParserOutput = messageMode ? this.flattenMessageQuads(messages) : messages.flatMap(message => [...message]);
      if (callback) {
        if (messageMode) {
          for (const entry of output as MessageQuadArray) callback(null, entry.quad, decoder.namespaces, entry.messageCounter);
        } else {
          for (const quad of output as RDF.Quad[]) callback(null, quad, decoder.namespaces);
        }
        callback(null, null, decoder.namespaces);
        return undefined;
      }
      return output;
    } catch (error) {
      if (callback) {
        callback(error instanceof Error ? error : new Error(String(error)));
        return undefined;
      }
      throw error;
    }
  }

  public parseMessages(input: BinaryInput): Message[] {
    return this.decode(input).messages;
  }

  private decode(input: BinaryInput, events: DecoderEvents = {}): { messages: Message[]; decoder: Decoder } {
    const frames = new MessageDecoder(this.options).decode(input);
    const decoder = new Decoder(this.options, events);
    const messages = frames.map(frame => decoder.decode(frame));
    decoder.finish();
    return { messages, decoder };
  }

  private flattenMessageQuads(messages: readonly Message[]): MessageQuadArray {
    const output = [] as unknown as MessageQuadArray;
    output.messageCount = messages.length;
    for (const message of messages) {
      for (const quad of message) output.push({ quad, messageCounter: message.messageCounter });
    }
    return output;
  }
}
