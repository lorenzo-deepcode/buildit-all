import formatDate from 'helpers/formatDate';

import { expect } from 'chai';

describe('formatDate helper', () => {
  it('formats a date properly', () => {
    const date = '2001-01-31';
    const correct = 'January 31st 2001';
    expect(formatDate(date)).to.equal(correct);
  });
  it('returns an empty string with no input', () => {
    expect(formatDate()).to.equal('');
  });
});
