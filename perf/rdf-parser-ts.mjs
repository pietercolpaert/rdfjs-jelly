// Loading rdf-parser-ts for benchmarks.
//
// 0.3.x dropped `Writer` and `StreamWriter` from the Node entry point; the
// browser entry still exports `Writer` and is plain ESM, so it runs unchanged in
// Node. Parsing always comes from whichever entry the caller asked for, because
// that is what is being measured; only the serialiser falls back.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export async function loadRdfParserTs(entry = process.env.RDF_PARSER_TS_PATH) {
  const parsers = entry
    ? await import(pathToFileURL(resolve(entry)).href)
    : await import('rdf-parser-ts');
  if (typeof parsers.Parser !== 'function') {
    throw new Error(`rdf-parser-ts entry ${entry ?? '(package)'} exports no Parser`);
  }
  if (typeof parsers.Writer === 'function') return { Parser: parsers.Parser, Writer: parsers.Writer, writerSource: 'same entry' };
  const browser = await import('rdf-parser-ts/browser');
  if (typeof browser.Writer !== 'function') {
    throw new Error('rdf-parser-ts exports no Writer from either entry point');
  }
  return { Parser: parsers.Parser, Writer: browser.Writer, writerSource: 'rdf-parser-ts/browser' };
}
