import { status as reducer, initialState } from 'reducers/status';
import { fetchStatusSuccess } from 'actions';

import { expect } from 'chai';

describe('status reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should update the status', () => {
    const newStatus = {
      demand: 'demand',
      defect: 'defect',
      effort: 'effort',
      ragStatus: 'ragStatus',
    };
    const action = fetchStatusSuccess(newStatus);

    expect(reducer(undefined, action)).to.deep.equal(newStatus);
    expect(reducer(initialState, action)).to.deep.equal(newStatus);
  });
});
