import { expect } from 'chai';
import processColorHex from 'processors/color_hex';

const testHex = { type: 'color_hex',
  value: 'fff',
  start: { cursor: 1065, line: 46, column: 9 },
  next: { cursor: 1069, line: 46, column: 13 } };

const correct = '#fff';

describe('Color Hex processor', () => {
  it('processes properly', () => {
    const output = processColorHex(testHex);
    expect(output).to.equal(correct);
  });
});
