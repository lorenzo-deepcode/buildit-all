import { expect } from 'chai';
import { toggle, TOGGLE } from '../../../src/ducks/forecast';

describe('Forecast actions', () => {
  it('should create an action to toggle the forecast detail', () => {
    const date = new Date();
    expect(toggle(date)).to.deep.equal({ type: TOGGLE, payload: { date }});
  });
});