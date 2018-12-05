import sortEvents from 'helpers/sortEvents';
import { expect } from 'chai';

describe('Project event history sorter', () => {
  const unsortedEvents = [
    { startTime: '2016-06-23T18:52:54Z' },
    { startTime: '2016-01-23T18:52:54Z' },
    { startTime: '2016-12-23T18:52:54Z' },
  ];

  it('sorts a list of events by start date', () => {
    const correct = [
      { startTime: '2016-01-23T18:52:54Z' },
      { startTime: '2016-06-23T18:52:54Z' },
      { startTime: '2016-12-23T18:52:54Z' },
    ];
    expect(sortEvents(unsortedEvents)).to.deep.equal(correct);
  });
});
