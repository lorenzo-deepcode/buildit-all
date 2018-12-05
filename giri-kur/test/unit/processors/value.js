import { expect } from 'chai';
import processValue from 'processors/value';

const testValue = {
  type: 'value',
  value: [
    { type: 'space',
      value: ' ',
      start: { cursor: 915, line: 31, column: 12 },
      next: { cursor: 916, line: 31, column: 13 } },
    { type: 'number',
      value: '1',
      start: { cursor: 916, line: 31, column: 13 },
      next: { cursor: 917, line: 31, column: 14 } },
    { type: 'identifier',
      value: 'rem',
      start: { cursor: 917, line: 31, column: 14 },
      next: { cursor: 920, line: 31, column: 17 } },
  ],
  start: { cursor: 915, line: 31, column: 12 },
  next: { cursor: 920, line: 31, column: 17 } };

const correct = '1rem';

describe('Value Processor', () => {
  it('processes properly', () => {
    const output = processValue(testValue);
    expect(output).to.equal(correct);
  });
});
