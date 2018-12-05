import { expect } from 'chai';
import processSelector from 'processors/selector';

const testSelector = {
  type: 'selector',
  value: [
    { type: 'identifier', value: 'h1' },
    { type: 'space', value: ' ' },
  ],
};
const testSelectorPseudo = {
  type: 'selector',
  value: [
    { type: 'identifier', value: 'h1' },
    { type: 'space', value: ' ' },
    { type: 'pseudo_class', value: [{ type: 'identifier', value: 'hover' }] },
  ],
};
const testSelectorWebkit = {
  type: 'selector',
  value: [
    { type: 'attribute',
      value: [
        { type: 'identifier', value: 'type' },
        { type: 'operator', value: '=' },
        { type: 'string_double', value: 'number' },
      ],
    },
    { type: 'punctuation', value: ':' },
    { type: 'punctuation', value: ':' },
    { type: 'operator', value: '-' },
    { type: 'identifier', value: 'webkit-inner-spin-button' },
  ],
};
const testSelectorMultiple = {
  type: 'selector',
  value: [
    { type: 'identifier', value: 'h1' },
    { type: 'punctuation', value: ',' },
    { type: 'space', value: ' ' },
    { type: 'identifier', value: 'h2' },
    { type: 'space', value: ' ' },
  ],
};
const testSelectorWeird = {
  type: 'selector',
  value: [
    { type: 'punctuation', value: ',' },
    { type: 'space', value: ' ' },
    { type: 'identifier', value: 'h2' },
    { type: 'space', value: ' ' },
  ],
};

const correct = [['h1']];
const correctPseudo = [['h1', ':hover']];
const correctWebkit = [['[type=number]', '::-webkit-inner-spin-button']];
const correctMultiple = [['h1'], ['h2']];
const correctWeird = [['h2']];

describe('Selector Processor', () => {
  it('processes properly', () => {
    const output = processSelector(testSelector);
    expect(output).to.deep.equal(correct);
  });
  it('processes a pseudoclass properly', () => {
    const output = processSelector(testSelectorPseudo);
    expect(output).to.deep.equal(correctPseudo);
  });
  it('processes a webkit rule properly', () => {
    const output = processSelector(testSelectorWebkit);
    expect(output).to.deep.equal(correctWebkit);
  });
  it('processes multiple selectors properly', () => {
    const output = processSelector(testSelectorMultiple);
    expect(output).to.deep.equal(correctMultiple);
  });
  it('processes something weird', () => {
    const output = processSelector(testSelectorWeird);
    expect(output).to.deep.equal(correctWeird);
  });
});
