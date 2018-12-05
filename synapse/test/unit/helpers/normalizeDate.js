import normalizeDate from 'reducers/fixerUppers/normalizers/normalizeProject/normalizeDate';
import { expect } from 'chai';

describe('date normalizer', () => {
  const normalizedDate = '2004-02-12';
  const sampleDate = `${normalizedDate}T15:19:21+00:00`;

  it('returns a normalized date properly', () => {
    expect(normalizeDate(sampleDate)).to.deep.equal(normalizedDate);
  });
  it('returns nothing for bad data', () => {
    expect(normalizeDate()).to.equal(undefined);
  });
});
