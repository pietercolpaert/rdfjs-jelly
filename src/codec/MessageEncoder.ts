import { JellyConformanceError } from '../errors';
import { encodeRdfStreamFrame, type RdfStreamFrame } from '../generated/rdf_pb';
import { concatBytes, encodeVarint } from './varint';

export class MessageEncoder {
  public constructor(public readonly delimited = true) {}

  public encode(frame: RdfStreamFrame): Uint8Array {
    const payload = encodeRdfStreamFrame(frame);
    return this.delimited ? concatBytes([encodeVarint(payload.byteLength), payload]) : payload;
  }

  public encodeAll(frames: readonly RdfStreamFrame[]): Uint8Array {
    if (!this.delimited && frames.length !== 1) {
      throw new JellyConformanceError('Non-delimited Jelly output must contain exactly one message');
    }
    return concatBytes(frames.map(frame => this.encode(frame)));
  }
}
