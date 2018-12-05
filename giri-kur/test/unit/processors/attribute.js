import { expect } from 'chai';
import processAttribute from 'processors/attribute';

const testAttribute = {
  type: 'attribute',
  value: [
    { type: 'identifier', value: 'type' },
    { type: 'operator', value: '=' },
    { type: 'string_double', value: 'number' },
  ],
};

const correct = '[type=number]';

describe('Attribute Processor', () => {
  it('processes properly', () => {
    const output = processAttribute(testAttribute);
    expect(output).to.equal(correct);
  });
});
