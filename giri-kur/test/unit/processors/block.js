import { expect } from 'chai';
import processBlock from 'processors/block';

const testBlock = {
  type: 'block',
  value: [
    { type: 'space', value: '\n  ' },
    { type: 'declaration',
      value: [
        { type: 'property', value: [{ type: 'identifier', value: 'font-size' }] },
        { type: 'punctuation', value: ':' },
        { type: 'value',
          value: [
            { type: 'space', value: ' ' },
            { type: 'number', value: '1' },
            { type: 'identifier', value: 'rem' },
          ],
        },
        { type: 'punctuation', value: ';' },
      ],
    },
    { type: 'space', value: '\n' },
  ],
};

const correct = [{ 'font-size': '1rem' }];

describe('Block processor', () => {
  it('processes properly', () => {
    const output = processBlock(testBlock);
    expect(output).to.deep.equal(correct);
  });
});
