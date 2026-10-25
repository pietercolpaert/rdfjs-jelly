import { finished } from 'node:stream/promises';
import {
  DataFactory as f, MessageDecoder, Parser, PhysicalStreamType, RdfStreamType,
  StreamWriter, Writer, type WriterOptions,
} from '../src';

const statement = f.quad(f.namedNode('urn:s'), f.namedNode('urn:p'), f.literal('value'));
const options: WriterOptions = { version: 3, physicalType: PhysicalStreamType.TRIPLES, streamType: RdfStreamType.MESSAGES };
const end = (writer: Writer): Uint8Array => {
  let bytes!: Uint8Array;
  writer.end((error, output) => { if (error) throw error; bytes = output!; });
  return bytes;
};
function sink(options: WriterOptions): { writer: Writer; chunks: Uint8Array[]; bytes: () => Uint8Array } {
  const chunks: Uint8Array[] = [];
  const writer = new Writer({ write: chunk => chunks.push(chunk), end: cb => cb?.(null) }, options);
  return { writer, chunks, bytes: () => Buffer.concat(chunks) };
}

describe('message packing and explicit flush', () => {
  it('packs messages by default and publishes them before end on flush', () => {
    const { writer, chunks, bytes } = sink(options);
    writer.addMessage([statement]);
    writer.addMessage([]);
    writer.addMessage([statement]);
    expect(chunks).toHaveLength(0);
    writer.flush();
    expect(chunks).toHaveLength(1);
    expect(new MessageDecoder().decode(bytes())[0]!.columns!.messageLengths).toEqual([1, 0, 1]);
    expect(new Parser().parseMessages(bytes()).map(m => m.length)).toEqual([1, 0, 1]);
    writer.flush();
    expect(chunks).toHaveLength(1);
    writer.addMessage([statement]);
    writer.flush();
    end(writer);
    expect(chunks).toHaveLength(2);
    expect(new Parser().parseMessages(bytes()).map(m => m.messageCounter)).toEqual([0, 1, 2, 3]);
  });

  it('can emit each message immediately with packMessages false', () => {
    const { writer, chunks } = sink({ ...options, packMessages: false });
    writer.addMessage([statement]);
    expect(chunks).toHaveLength(1);
    writer.addMessage([]);
    expect(chunks).toHaveLength(2);
    end(writer);
    expect(chunks).toHaveLength(2);
  });

  it('isolates metadata-bearing messages from packed neighbors', () => {
    const { writer, chunks, bytes } = sink(options);
    writer.addMessage([statement]);
    writer.addMessage([], { source: Uint8Array.of(42) });
    expect(chunks).toHaveLength(2);
    writer.addMessage([statement]);
    writer.flush();
    const messages = new Parser().parseMessages(bytes());
    expect(messages.map(m => m.length)).toEqual([1, 0, 1]);
    expect(messages.map(m => [...m.metadata.keys()])).toEqual([[], ['source'], []]);
    expect(messages[1]!.metadata.get('source')).toEqual(Uint8Array.of(42));
    end(writer);
  });

  it('closes counter-based input on flush and keeps gaps and blank-node scopes', () => {
    const { writer, bytes } = sink(options);
    const quad = f.quad(f.blankNode('same'), statement.predicate, statement.object);
    writer.addQuad({ quad, messageCounter: 2 });
    writer.flush();
    expect(() => writer.addQuad({ quad, messageCounter: 2 })).toThrow(/counters must increase/);
    writer.addQuad({ quad, messageCounter: 3 });
    writer.flush();
    const messages = new Parser().parseMessages(bytes());
    expect(messages.map(m => m.length)).toEqual([0, 0, 1, 1]);
    expect(messages[2]![0]!.subject.equals(messages[3]![0]!.subject)).toBe(false);
    end(writer);
  });

  it('keeps a message intact across size-limited frames and an explicit flush', () => {
    const { writer, bytes } = sink({ ...options, messageSize: 2 });
    writer.addMessage([statement, statement, statement]);
    writer.flush();
    expect(new Parser().parseMessages(bytes()).map(m => m.length)).toEqual([3]);
    writer.addMessage([]);
    writer.flush();
    expect(new Parser().parseMessages(bytes()).map(m => m.length)).toEqual([3, 0]);
    end(writer);
  });

  it.each([2, 3] as const)('flushes plain version %i output without closing or resetting lookups', version => {
    const { writer, chunks, bytes } = sink({ version });
    writer.flush(); // Publishes options even on an empty stream.
    writer.flush();
    expect(chunks).toHaveLength(1);
    writer.addQuad(statement);
    writer.flush();
    writer.addQuad(statement);
    writer.flush();
    end(writer);
    expect(new Parser().parse(bytes())).toHaveLength(2);
    const frames = new MessageDecoder().decode(bytes());
    const names = version === 3 ? frames.flatMap(frame => frame.columns?.names?.flatMap(entry => entry.values) ?? [])
      : frames.flatMap(frame => frame.rows.filter(row => row.case === 'name'));
    expect(names).toHaveLength(2);
  });

  it('retains flushed bytes for end when there is no output sink', () => {
    const writer = new Writer(options);
    writer.addMessage([statement]);
    writer.flush();
    writer.addMessage([statement]);
    const output = end(writer);
    expect(new MessageDecoder().decode(output)).toHaveLength(2);
    expect(new Parser().parseMessages(output).map(m => m.length)).toEqual([1, 1]);
  });

  it('rejects flush on non-delimited output without changing the pending message', () => {
    const writer = new Writer({ ...options, delimited: false });
    writer.addQuad({ quad: statement, messageCounter: 0 });
    expect(() => writer.flush()).toThrow(/requires delimited/);
    const messages = new Parser({ delimited: false }).parseMessages(end(writer));
    expect(messages.map(m => m.length)).toEqual([1]);
  });

  it('reports flush errors through callbacks and rejects flush after end', () => {
    const writer = new Writer(options);
    let error: Error | null | undefined;
    writer.flush(actual => { error = actual; });
    expect(error).toBeNull();
    end(writer);
    expect(() => writer.flush()).toThrow(/already ended/);
    writer.flush(actual => { error = actual; });
    expect(error).toBeInstanceOf(Error);
  });

  it('queues a Node stream flush after writes even while corked', async () => {
    const stream = new StreamWriter(options);
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk as Buffer));
    stream.cork();
    stream.write({ quad: statement, messageCounter: 0 });
    const flushed = new Promise<void>((resolve, reject) => stream.flush(error => error ? reject(error) : resolve()));
    expect(chunks).toHaveLength(0);
    stream.uncork();
    await flushed;
    expect(new Parser().parseMessages(Buffer.concat(chunks)).map(m => m.length)).toEqual([1]);
    stream.write({ quad: statement, messageCounter: 1 });
    stream.end();
    await finished(stream);
    expect(new Parser().parseMessages(Buffer.concat(chunks)).map(m => m.length)).toEqual([1, 1]);
  });
});
