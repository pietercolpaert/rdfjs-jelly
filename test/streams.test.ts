import { Readable } from 'node:stream';
import type * as RDF from '@rdfjs/types';
import { DataFactory, StreamParser, StreamWriter, Writer } from '../src';

const statement = DataFactory.quad(DataFactory.namedNode('urn:s'), DataFactory.namedNode('urn:p'), DataFactory.literal('value'));

function end(writer: Writer): Promise<Uint8Array> {
  return new Promise((resolve, reject) => writer.end((error, output) => error ? reject(error) : resolve(output!)));
}

describe('Node streams', () => {
  it('parses every byte chunk boundary incrementally', async () => {
    const writer = new Writer({ messageSize: 1 });
    writer.addQuads([statement, statement, statement]);
    const bytes = await end(writer);
    const chunks = Array.from(bytes, byte => Uint8Array.of(byte));
    const parser = new StreamParser();
    const messages: number[] = [];
    parser.on('message', message => messages.push(message.messageCounter));
    const output: RDF.Quad[] = [];
    for await (const quad of Readable.from(chunks).pipe(parser)) output.push(quad as RDF.Quad);
    expect(output).toHaveLength(3);
    expect(messages.length).toBeGreaterThan(1);
  });

  it('serializes an object stream', async () => {
    const chunks: Buffer[] = [];
    for await (const chunk of Readable.from([statement, statement]).pipe(new StreamWriter())) chunks.push(chunk as Buffer);
    const output = Buffer.concat(chunks);
    expect(output.byteLength).toBeGreaterThan(0);
    expect((await import('../src')).Parser.prototype.parse.call(new (await import('../src')).Parser(), output)).toHaveLength(2);
  });
});
