import normalizeProject from 'reducers/fixerUppers/normalizers/normalizeProject';
import { expect } from 'chai';

describe('normalizeProject helper', () => {
  const unnormalized = {
    name: ['name'],
    test: ['test'],
    startDate: '2016-01-01',
  };
  it('normalizes a project properly', () => {
    const correct = {
      name: 'name',
      test: ['test'],
      startDate: '2016-01-01',
      endDate: '2020-01-01',
      demand: { flow: [] },
      defect: { severity: [] },
      effort: { role: [] },
    };
    expect(normalizeProject(unnormalized)).to.deep.equal(correct);
  });
  it('skips demand/defect/effort when they are already present', () => {
    const modifiedUnnormalized = unnormalized;
    modifiedUnnormalized.demand = [1, 2, 3, 4, 5];
    modifiedUnnormalized.defect = 'gibberish';
    modifiedUnnormalized.effort = {};

    const correct = {
      name: 'name',
      test: ['test'],
      startDate: '2016-01-01',
      endDate: '2020-01-01',
      demand: [1, 2, 3, 4, 5],
      defect: 'gibberish',
      effort: {},
    };
    expect(normalizeProject(modifiedUnnormalized)).to.deep.equal(correct);
  });
});
