import { expect } from 'chai';
import transformStatusData from 'helpers/transformStatusData';

describe('transformStatusData', () => {
  const project = [{
    activity: { PM: 3 },
    projectDate: '2016/07/01',
  }];
  const correct = [{
    date: '01-Jul-16',
    PM: 3,
  }];

  it('transforms status data properly', () => {
    expect(transformStatusData(project, 'activity')).to.deep.equal(correct);
  });
});
