import isValid from 'helpers/isValid';
import { expect } from 'chai';

describe('Data validity checker', () => {
  it('Rejects when projectDate property is missing from a data point', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        status: {
          Backlog: 23,
        },
      },
      {
        projectDate: '',
        status: {
          Backlog: 34,
        },
      },
    ];
    expect(isValid(data, 'demand-status-data')).to.equal(false);
  });

  it('Rejects when projectDate does not conform to expected date format', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        status: {
          Backlog: 23,
        },
      },
      {
        projectDate: 'x2015-10-30',
        status: {
          Backlog: 34,
        },
      },
    ];
    expect(isValid(data, 'demand-status-data')).to.equal(false);
  });

  it('Does not reject when projectDate has slashes instead of dashes', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        status: {
          Backlog: 23,
        },
      },
      {
        projectDate: '2015/10/30',
        status: {
          Backlog: 34,
        },
      },
    ];
    expect(isValid(data, 'demand-status-data')).to.equal(true);
  });

  it('Rejects when a demand status point does not contain a "status" key', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        status: {
          Backlog: 23,
        },
      },
      {
        projectDate: '2015-10-30',
        platypus: {
          Backlog: 34,
        },
      },
    ];
    expect(isValid(data, 'demand-status-data')).to.equal(false);
  });

  it('Rejects when a defect status point does not contain a "severity" key', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        severity: {
          0: 1,
        },
      },
      {
        projectDate: '2015-10-30',
        kangaroo: {
          0: 2,
        },
      },
    ];
    expect(isValid(data, 'defect-status-data')).to.equal(false);
  });

  it('Rejects when an effort status point does not contain an "activity" key', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        activity: {
          Delivery: 1,
        },
      },
      {
        projectDate: '2015-10-30',
        mustard: {
          Delivery: 2,
        },
      },
    ];
    expect(isValid(data, 'effort-status-data')).to.equal(false);
  });

  it('Does not reject when we request something nonstandard', () => {
    const data = [
      {
        projectDate: '2015-10-29',
        status: {
          Backlog: 23,
        },
      },
      {
        projectDate: '2015/10/30',
        status: {
          Backlog: 34,
        },
      },
    ];
    expect(isValid(data, 'whatever')).to.equal(true);
  });
});
