import { expect } from 'chai';
import processArguments from 'processors/arguments';

const testArgs = {
  type: 'arguments',
  value: [
     { type: 'number', value: '85' },
     { type: 'punctuation', value: ',' },
     { type: 'space', value: ' ' },
     { type: 'number', value: '26' },
     { type: 'punctuation', value: ',' },
     { type: 'space', value: ' ' },
     { type: 'number', value: '139' },
  ],
};

const testArgsPseudo = {
  type: 'arguments',
  value: [
    {
      type: 'pseudo_class',
      value: [
        { type: 'identifier', value: 'root' },
      ],
    },
  ],
};

const correct = '85, 26, 139';
const correctPseudo = ':root';

describe('Arguments processor', () => {
  it('processes properly', () => {
    const output = processArguments(testArgs);
    expect(output).to.equal(correct);
  });

  it('process pseudoclasses properly', () => {
    const output = processArguments(testArgsPseudo);
    expect(output).to.equal(correctPseudo);
  });
});
