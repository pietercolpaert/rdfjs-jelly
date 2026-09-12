import assert from 'node:assert/strict';
import test from 'node:test';
import { DataFactory as f } from '../dist/index.mjs';
import { describeMessages, verifyMessageOutput } from './message-workload.mjs';

const q = (s, o = s) => f.quad(f.blankNode(s), f.namedNode('urn:p'), f.blankNode(o));
const output = entries => Object.assign(entries, { messageCount: 3 });
const source = [[q('a', 'b'), q('a', 'b')], [], [q('c')]];
const valid = () => output([
  { quad: q('x', 'y'), messageCounter: 0 },
  { quad: q('x', 'y'), messageCounter: 0 },
  { quad: q('z'), messageCounter: 2 },
]);

test('accepts complete ordered equivalence with renaming and an empty message', () => {
  assert.equal(describeMessages(source).blankNodes, 3);
  assert.deepEqual(verifyMessageOutput(source, valid()), { statements: 3, messages: 3, blankNodes: 3 });
});
test('rejects workload boundaries that split a source blank node', () => {
  assert.throws(() => describeMessages([[q('a')], [q('a')]]), /source blank node crosses/);
});
test('rejects middle-statement changes and wrong message boundaries', () => {
  const changed = valid();
  changed[1].quad = f.quad(f.blankNode('x'), f.namedNode('urn:wrong'), f.blankNode('y'));
  assert.throws(() => verifyMessageOutput(source, changed), /term at/);
  const moved = valid(); moved[1].messageCounter = 1;
  assert.throws(() => verifyMessageOutput(source, moved), /message boundary/);
});
test('rejects split or merged blank nodes within a message', () => {
  const split = valid(); split[1].quad = q('new', 'y');
  assert.throws(() => verifyMessageOutput(source, split), /blank node split/);
  const merged = valid(); merged[0].quad = q('x');
  assert.throws(() => verifyMessageOutput(source, merged), /blank nodes merged/);
});
test('rejects cross-message identity reuse and missing or extra statements', () => {
  const shared = valid(); shared[2].quad = q('x');
  assert.throws(() => verifyMessageOutput(source, shared), /output blank node crosses/);
  const missing = valid(); missing.pop();
  assert.throws(() => verifyMessageOutput(source, missing), /missing statement/);
  const extra = valid(); extra.push(extra.at(-1));
  assert.throws(() => verifyMessageOutput(source, extra), /statement count/);
});
