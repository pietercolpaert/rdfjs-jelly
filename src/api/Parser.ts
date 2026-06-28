import type * as RDF from '@rdfjs/types';
import { Decoder, type DecoderEvents } from '../codec/Decoder';
import { ProtoMessageDecoder } from '../codec/MessageDecoder';
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
      const messageMode = this.options.messages === true || this.options.rdfMessages === true;
      if (callback) {
        const { messages, decoder } = this.decode(input);
        const output: ParserOutput = messageMode ? this.flattenMessageQuads(messages) : this.flattenQuads(messages);
        if (messageMode) {
          for (const entry of output as MessageQuadArray) callback(null, entry.quad, decoder.namespaces, entry.messageCounter);
        } else {
          for (const quad of output as RDF.Quad[]) callback(null, quad, decoder.namespaces);
        }
        callback(null, null, decoder.namespaces);
        return undefined;
      }
      const output: ParserOutput = messageMode ? [] as unknown as MessageQuadArray : [];
      const { messageCount } = this.decode(input, {}, message => {
        if (messageMode) {
          for (const quad of message) (output as MessageQuadArray).push({ quad, messageCounter: message.messageCounter });
        } else {
          for (const quad of message) (output as RDF.Quad[]).push(quad);
        }
      });
      if (messageMode) (output as MessageQuadArray).messageCount = messageCount;
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

  private decode(
    input: BinaryInput,
    events: DecoderEvents = {},
    consume?: (message: Message) => void,
  ): { messages: Message[]; decoder: Decoder; messageCount: number } {
    const reader = new ProtoMessageDecoder(this.options);
    const decoder = new Decoder(this.options, events);
    const messages: Message[] = [];
    let messageCount = 0;
    reader.decodeEach(input, frame => {
      const message = decoder.decodeProto(frame);
      messageCount++;
      if (consume) consume(message); else messages.push(message);
    });
    decoder.finish();
    return { messages, decoder, messageCount };
  }

  private flattenQuads(messages: readonly Message[]): RDF.Quad[] {
    const output: RDF.Quad[] = [];
    for (const message of messages) for (const quad of message) output.push(quad);
    return output;
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
