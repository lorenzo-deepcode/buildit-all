import { messages as reducer, initialState } from 'reducers/messages';
import { setMessage } from 'actions';

import { expect } from 'chai';

describe('messages reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should set a message', () => {
    const message = {
      text: 'a message',
      type: undefined,
    };
    const action = setMessage(message.text);
    expect(reducer(undefined, action)).to.deep.equal(message);
  });

  it('should replace a message', () => {
    const text = 'text';
    const start = {
      text: 'message',
      type: 'error',
    };
    const correct = {
      text,
      type: undefined,
    };
    const action = setMessage(text);
    expect(reducer(start, action)).to.deep.equal(correct);
  });
});
