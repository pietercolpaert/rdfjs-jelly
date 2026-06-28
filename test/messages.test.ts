import type * as RDF from '@rdfjs/types';
import { DataFactory, Message, Parser, Writer, isMessageQuad, toMessages, type MessageQuadArray } from '../src';

const { namedNode, quad } = DataFactory;
const q = (suffix: string): RDF.Quad => quad(namedNode(`urn:s${suffix}`), namedNode('urn:p'), namedNode('urn:o'));

function end(writer: Writer): Promise<Uint8Array> {
  return new Promise((resolve, reject) => writer.end((error, output) => error ? reject(error) : resolve(output!)));
}

describe('message APIs', () => {
  it('preserves leading, intermediate, and trailing empty messages', async () => {
    const writer = new Writer();
    writer.addMessage(new Message(0));
    writer.addMessage(new Message(1, [q('1')], { id: new Uint8Array([7]) }));
    writer.addMessage(new Message(2));
    writer.addMessage(new Message(3, [q('3')]));
    writer.addMessage(new Message(4));
    const bytes = await end(writer);

    const messages = new Parser().parseMessages(bytes);
    expect(messages.map(message => message.length)).toEqual([0, 1, 0, 1, 0]);
    expect(messages.map(message => message.messageCounter)).toEqual([0, 1, 2, 3, 4]);
    expect(messages[1]?.metadata.get('id')).toEqual(new Uint8Array([7]));
  });

  it('matches rdf-parser.ts MessageQuad output and conversion', async () => {
    const writer = new Writer();
    writer.addMessage([q('0')]);
    writer.addMessage([]);
    writer.addMessage([q('2')]);
    writer.addMessage([]);
    const bytes = await end(writer);
    const output = new Parser({ messages: true }).parse(bytes) as MessageQuadArray;
    expect(output.every(isMessageQuad)).toBe(true);
    expect(output.messageCount).toBe(4);
    expect(output.map(value => value.messageCounter)).toEqual([0, 2]);
    expect(toMessages(output).map(message => message.length)).toEqual([1, 0, 1, 0]);
  });

  it('writes MessageQuadArray including trailing empties', async () => {
    const values = [
      { quad: q('0'), messageCounter: 0 },
      { quad: q('2'), messageCounter: 2 },
    ] as MessageQuadArray;
    values.messageCount = 4;
    const writer = new Writer();
    writer.addQuads(values);
    expect(new Parser().parseMessages(await end(writer)).map(message => message.length)).toEqual([1, 0, 1, 0]);
  });
});

