import assert from 'node:assert/strict';

const slots = ['subject', 'predicate', 'object', 'graph'];

// This benchmark preserves a source dataset without splitting any blank-node
// identity between messages. Other message workloads may legitimately reuse
// labels in separate scopes; they need a different input-validation policy.
export function describeMessages(messages) {
  const owners = new Map();
  let statements = 0;
  for (const [counter, message] of messages.entries()) {
    statements += message.length;
    for (const quad of message) for (const slot of slots) {
      const term = quad[slot];
      if (term.termType !== 'BlankNode') continue;
      if (owners.has(term.value)) assert.equal(owners.get(term.value), counter, 'source blank node crosses message boundaries');
      else owners.set(term.value, counter);
    }
  }
  const sizes = messages.map(message => message.length);
  return {
    messages: messages.length, statements, blankNodes: owners.size,
    minStatementsPerMessage: sizes.length ? Math.min(...sizes) : 0,
    maxStatementsPerMessage: sizes.length ? Math.max(...sizes) : 0,
  };
}

// Ordered message equivalence: compare every term, with a bijection for blank
// nodes per message. The bijection must neither merge nor split identities.
export function verifyMessageOutput(messages, output) {
  assert.equal(output.messageCount, messages.length, 'message count');
  const owners = new Map();
  let index = 0;
  for (const [counter, message] of messages.entries()) {
    const forward = new Map();
    const reverse = new Map();
    for (const expectedQuad of message) {
      const entry = output[index++];
      assert.ok(entry, 'missing statement');
      assert.equal(entry.messageCounter, counter, 'message boundary');
      for (const slot of slots) {
        const expected = expectedQuad[slot], actual = entry.quad[slot];
        assert.equal(actual.termType, expected.termType, `term type at ${index}/${slot}`);
        if (expected.termType !== 'BlankNode') {
          assert.ok(actual.equals(expected), `term at ${index}/${slot}`);
          continue;
        }
        if (owners.has(actual.value)) assert.equal(owners.get(actual.value), counter, 'output blank node crosses message boundaries');
        else owners.set(actual.value, counter);
        if (forward.has(expected.value)) assert.equal(actual.value, forward.get(expected.value), 'blank node split');
        else forward.set(expected.value, actual.value);
        if (reverse.has(actual.value)) assert.equal(expected.value, reverse.get(actual.value), 'blank nodes merged');
        else reverse.set(actual.value, expected.value);
      }
    }
  }
  assert.equal(output.length, index, 'statement count');
  return { statements: index, messages: messages.length, blankNodes: owners.size };
}
