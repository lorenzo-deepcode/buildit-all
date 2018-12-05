import { expect } from 'chai';

import process, { stripSpaces } from 'processors';

describe('Processor Index', () => {
  it('processes nodes with a type', () => {
    const correctValue = 'foo';
    const testNode = { type: 'value', value: [correctValue] };
    const testNode2 = { node: testNode };

    expect(process(testNode)).to.equal(correctValue);
    expect(process(testNode2)).to.equal(correctValue);
  });

  it('processes nodes with just values, no processable type', () => {
    const correctValue = 'foo';
    const testNode = { value: correctValue };

    expect(process(testNode)).to.equal(correctValue);
  });

  it('processes nodes with no processable type and no value property', () => {
    const correctValue = 'foo';

    expect(process(correctValue)).to.equal(correctValue);
  });

  it('strips spaces', () => {
    const correct = { type: 'variable', value: 'black' };
    const testWithSpaces = [
      { type: 'space', value: ' ' },
      correct,
      { type: 'space', value: ' ' },
    ];
    expect(stripSpaces(testWithSpaces)).to.deep.equal([correct]);
  });
});
