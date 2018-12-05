import { expect } from 'chai';
import processAtkeyword from 'processors/atkeyword';

const testAttribute = {
  type: 'atkeyword',
  value: 'media',
};

const correct = '@media';

describe('Atkeyword Processor', () => {
  it('processes properly', () => {
    const output = processAtkeyword(testAttribute);
    expect(output).to.equal(correct);
  });
});
