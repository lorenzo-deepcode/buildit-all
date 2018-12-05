import { expect } from 'chai';
import generateRulePackages from 'lib/generate/rulePackages';

describe('Rule Package generator', () => {
  it('generates properly', () => {
    const rules = [
      {
        selector: ['a'],
        declarations: [{ color: 'green' }],
      },
      {
        selector: ['a'],
        declarations: [{ 'text-decoration': 'underline' }],
      },
      {
        selector: ['[type=number]', '::-webkit-inner-spin-button'],
        declarations: [{ height: 'auto' }],
      },
      {
        selector: ['[type=number]', '::-webkit-outer-spin-button'],
        declarations: [{ height: 'auto' }],
      },
    ];
    const correct = {
      a: {
        '*': [
          { color: 'green' },
          { 'text-decoration': 'underline' },
        ],
      },
      '[type=number]': {
        '::-webkit-inner-spin-button': [{ height: 'auto' }],
        '::-webkit-outer-spin-button': [{ height: 'auto' }],
      },
    };

    expect(generateRulePackages(rules)).to.deep.equal(correct);
  });
});
