import { JellyConformanceError } from '../errors';
import { encodeDelimitedRdfStreamFrame, encodeRdfStreamFrame, type RdfStreamFrame } from '../generated/rdf_pb';
import { concatBytes } from './bytes';

export class MessageEncoder {
  public constructor(public readonly delimited = true) {}

  public encode(frame: RdfStreamFrame): Uint8Array {
    return this.delimited ? encodeDelimitedRdfStreamFrame(frame) : encodeRdfStreamFrame(frame);
  }

  public encodeAll(frames: readonly RdfStreamFrame[]): Uint8Array {
    if (!this.delimited && frames.length !== 1) {
      throw new JellyConformanceError('Non-delimited Jelly output must contain exactly one message');
    }
    return concatBytes(frames.map(frame => this.encode(frame)));
  }
}
