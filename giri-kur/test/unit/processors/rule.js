import { expect } from 'chai';
import processRule from 'processors/rule';

const testRule = {
  type: 'rule',
  value: [
    { type: 'nonsense', value: 'foo' },
    { type: 'selector',
      value: [
        { type: 'identifier', value: 'h1' },
        { type: 'space', value: ' ' },
      ],
    },
    { type: 'block',
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
    },
  ],
};

const correct = {
  selector: [['h1']],
  declarations: [{ 'font-size': '1rem' }],
};

describe('Rule Processor', () => {
  it('processes properly', () => {
    const output = processRule(testRule);
    expect(output).to.deep.equal(correct);
  });
});
