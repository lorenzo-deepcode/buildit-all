import { call } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import isomorphicFetch from 'isomorphic-fetch';
import { expect } from 'chai';

import { RETRIEVE_MENU } from 'actions/constants';
import {
  menuAjaxEndpoint,
  retrieveMenu,
  watchRetrieveMenu,
} from 'sagas/ajax/menu';

describe('menu fetcher', () => {
  const jsonFunctionStub = () => ({ foo: "bar"});
  const goodResponse = {
    status: 200,
    json: jsonFunctionStub,
  };
  const badResponse = {
    status: 404,
    json: jsonFunctionStub,
  };
  const err = new Error("Nope.");
  const generator = retrieveMenu();
  const badResponseGenerator = retrieveMenu();
  const errorGenerator = retrieveMenu();

  it('watches', () => {
    const correct = call(takeEvery, RETRIEVE_MENU, retrieveMenu);
    expect(watchRetrieveMenu().next().value).to.deep.equal(correct);
  });

  it('fetches the menu', () => {
    const correct = call(isomorphicFetch, menuAjaxEndpoint);
    expect(generator.next().value).to.deep.equal(correct);
  });
  it('logs the results', () => {
    const correct = call(console.log, jsonFunctionStub());
    expect(generator.next(goodResponse).value).to.deep.equal(correct);
  });

  it('fails properly with a bad status code', () => {
    const correct = call(console.log, err);
    badResponseGenerator.next();
    expect(badResponseGenerator.next(badResponse).value).to.deep.equal(correct);
  });

  it('fails properly with a bad ajax call', () => {
    const correct = call(console.log, err);
    errorGenerator.next();
    expect(errorGenerator.throw(new Error).value).to.deep.equal(correct);
  });

  it('completes', () => {
    expect(generator.next().done).to.be.true;
    expect(badResponseGenerator.next().done).to.be.true;
    expect(errorGenerator.next().done).to.be.true;
  });
});
