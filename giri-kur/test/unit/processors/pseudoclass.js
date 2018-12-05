import { expect } from 'chai';
import processPseudoClass from 'processors/pseudoclass';

const testClass = {
  type: 'pseudo_class',
  value: [{ type: 'identifier', value: 'hover' }],
};
const correct = ':hover';

describe('Pseudoclass Processor', () => {
  it('processes properly', () => {
    const output = processPseudoClass(testClass);
    expect(output).to.equal(correct);
  });
});
