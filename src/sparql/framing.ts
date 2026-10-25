import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { FramedMessageDecoder } from '../codec/MessageDecoder';
import type { SparqlParserOptions } from '../sparql-types';
import type { Reader } from 'protobufjs/minimal.js';

export const sparqlProto = eu.ostrzyciel.jelly.core.proto.v1.sparql;
export type SparqlFrame = eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame;
export type SparqlFrameProperties = eu.ostrzyciel.jelly.core.proto.v1.sparql.SparqlResultsFrame.$Properties;
function decode(input: Reader | Uint8Array, length?: number): SparqlFrame {
  try { return sparqlProto.SparqlResultsFrame.decode(input, length); }
  catch (cause) { throw new JellyConformanceError('Invalid Jelly-SPARQL protobuf frame', { cause }); }
}
export class SparqlFrameDecoder extends FramedMessageDecoder<SparqlFrame> {
  public constructor(options: SparqlParserOptions = {}) {
    super({ ...options, delimited: options.delimited ?? true }, input => decode(input), (reader, length) => decode(reader, length));
  }
}
export function encodeSparqlFrame(frame: SparqlFrameProperties, delimited = true): Uint8Array {
  return delimited ? sparqlProto.SparqlResultsFrame.encodeDelimited(frame).finish() : sparqlProto.SparqlResultsFrame.encode(frame).finish();
}
