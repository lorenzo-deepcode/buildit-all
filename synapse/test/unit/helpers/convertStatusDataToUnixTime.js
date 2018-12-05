import convertStatusDataToUnixTime from 'helpers/convertStatusDataToUnixTime';
import { expect } from 'chai';

describe('Convert Status Data To Unix Time', () => {
  it('Results in an array of equal length to the input', () => {
    const statusData = [
      { Backlog: 0, date: '01-Jan-16' },
      { Backlog: 2, date: '03-Jan-16' },
    ];
    const result = convertStatusDataToUnixTime(statusData);
    expect(result.length).to.equal(2);
  });
});
