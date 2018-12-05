import { expect } from 'chai'
import reducer, { TOGGLE, initialState } from '../../../src/ducks/forecast'

describe('Forecast reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });
});