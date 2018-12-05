import {
  errorHelper,
  stockErrorMessage,
  xhrErrorMessage,
  xhrInternalErrorMessage,
} from 'helpers/errorHelper';
import { expect } from 'chai';

describe('error helper', () => {
  it('deals with a JSON body', () => {
    const message = 'foo';
    const messageStyle = { error: { message } };
    const statusStyle = { error: { statusCode: message } };
    const messageBody = { body: JSON.stringify(messageStyle) };
    const statusBody = { body: JSON.stringify(statusStyle) };
    expect(errorHelper(messageBody)).to.equal(message);
    expect(errorHelper(statusBody)).to.equal(message);
  });

  it('deals with non-JSON bodies', () => {
    const message = 'foo';
    const messageBody = { body: { error: { message } } };
    const statusBody = { body: { error: { statusCode: message } } };
    const emptyStyle = { error: {} };
    expect(errorHelper(messageBody)).to.equal(message);
    expect(errorHelper(statusBody)).to.equal(message);
    expect(errorHelper(emptyStyle)).to.equal(stockErrorMessage);
  });

  it('deals with statusText errors', () => {
    const statusText = 'foo';
    expect(errorHelper({ statusText })).to.equal(statusText);
  });

  it('deals with messages', () => {
    const message = 'foo';
    const thing = { message };
    expect(errorHelper(thing)).to.equal(message);
  });

  it('deals with XHR errors', () => {
    const thing = { message: xhrInternalErrorMessage };
    expect(errorHelper(thing)).to.equal(xhrErrorMessage);
  });

  it('handles empty errors', () => {
    expect(errorHelper(undefined)).to.equal(stockErrorMessage);
  });

  it('handles gibberish', () => {
    const thing = 'asdfwewgrsdfwewsfewedfs';
    expect(errorHelper(thing)).to.equal(stockErrorMessage);
  });
});
