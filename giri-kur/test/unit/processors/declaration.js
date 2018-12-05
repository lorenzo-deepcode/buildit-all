import { expect } from 'chai';
import processDeclaration from 'processors/declaration';

const testDeclaration = {
  type: 'declaration',
  value: [
    { type: 'property', value: [{ type: 'variable', value: 'black' }] },
    { type: 'punctuation', value: ':' },
    { type: 'value',
      value: [
        { type: 'space', value: ' ' },
        { type: 'color_hex', value: '000000' },
      ],
    },
    { type: 'punctuation', value: ';' },
  ],
};

const correct = { token: { $black: '#000000' }, type: 'VARIABLE' };

describe('Declaration Processor', () => {
  it('processes properly', () => {
    const output = processDeclaration(testDeclaration);
    expect(output).to.deep.equal(correct);
  });
});
