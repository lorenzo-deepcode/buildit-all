import { expect } from 'chai';
import processVariable from 'processors/variable';

const testVariable = {
  type: 'variable',
  value: 'black',
  start: { cursor: 941, line: 35, column: 9 },
  next: { cursor: 947, line: 35, column: 15 } };

const correct = '$black';

describe('Variable Processor', () => {
  it('processes properly', () => {
    const output = processVariable(testVariable);
    expect(output).to.equal(correct);
  });
});
