import { expect } from 'chai';
import processOperator from 'processors/operator';

const testOperator = { type: 'operator',
  value: '!',
  start: { cursor: 999, line: 40, column: 19 },
  next: { cursor: 1000, line: 40, column: 20 } };

const correct = '!';

describe('Operator Processor', () => {
  it('processes properly', () => {
    const output = processOperator(testOperator);
    expect(output).to.equal(correct);
  });
});
