import { expect } from 'chai';
import processClass from 'processors/class';

const testClass = {
  type: 'class',
  value: [{ type: 'identifier', value: 'foo' }],
};
const correct = '.foo';

describe('Class Processor', () => {
  it('processes properly', () => {
    const output = processClass(testClass);
    expect(output).to.equal(correct);
  });
});
