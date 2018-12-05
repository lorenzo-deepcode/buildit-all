import { expect } from 'chai';
import processId from 'processors/id';

const testId = { type: 'id', value: [{ type: 'identifier', value: 'bar' }] };
const correct = '#bar';

describe('ID Processor', () => {
  it('processes properly', () => {
    const output = processId(testId);
    expect(output).to.equal(correct);
  });
});
