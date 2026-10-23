import type { BinaryInput } from '../types';
import type { SparqlEvent, SparqlParserOptions, SparqlResult } from '../sparql-types';
import { SparqlDecoder } from './SparqlDecoder';
import { SparqlFrameDecoder } from './framing';

/** Reads complete result streams. For row delivery use a SparqlStreamParser. */
export class SparqlParser {
  public constructor(public readonly options: SparqlParserOptions = {}) {}
  /** Returns result sets in stream order (one for a FLAT stream). */
  public parse(input: BinaryInput): SparqlResult[] {
    const decoder = new SparqlDecoder(this.options);
    const framing = new SparqlFrameDecoder(this.options);
    const results: SparqlResult[] = [];
    const accept = (events: SparqlEvent[]): void => {
      for (const event of events) {
        if (event.type === 'header' || event.type === 'boolean') {
          const info = { complete: false, links: [] as string[], metadata: new Map<string, Uint8Array>() };
          results.push(event.type === 'header' ? { ...info, type: 'select', variables: event.variables, bindings: [] } : { ...info, type: 'ask', boolean: event.value });
          continue;
        }
        const result = results[event.resultIndex]!;
        if (event.type === 'binding' && result.type === 'select') result.bindings.push(event.bindings);
        else if (event.type === 'metadata') {
          for (const [key, value] of event.metadata) (result.metadata as Map<string, Uint8Array>).set(key, value);
          if (event.links) result.links = event.links;
        } else if (event.type === 'end') { result.complete = event.complete; if (event.error) result.error = event.error; }
      }
    };
    framing.decodeEach(input, frame => accept(decoder.decode(frame)));
    accept(decoder.finish());
    return results;
  }
}
