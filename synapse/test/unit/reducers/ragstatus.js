import { statuses as reducer, initialState } from 'reducers/ragstatus';
import { fetchRagStatusSuccess } from 'actions';

import { expect } from 'chai';

describe('RAG status reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should update the statuses', () => {
    const newStatuses = {
      statuses: 'statuses',
    };
    const action = fetchRagStatusSuccess(newStatuses);

    expect(reducer(undefined, action)).to.deep.equal({
      statuses: newStatuses,
    });
    expect(reducer(initialState, action)).to.deep.equal({
      statuses: newStatuses,
    });
  });
});
