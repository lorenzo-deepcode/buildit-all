import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import Api from 'api';
import {
  receiveStarterProjects,
  setErrorMessage,
  startXHR,
  endXHR,
} from 'actions';
import { FETCH_STARTER_PROJECTS_REQUEST } from 'actions/actions';
import {
  fetchStarterProjects,
  watchFetchStarterProjectsRequest,
} from 'middleware/project';
const expect = require('chai').expect;

describe('Starter projects fetcher', () => {
  const errorMessage = 'We could not fetch the projects.';
  const starterProjects = 'a project';
  const generator = fetchStarterProjects();
  const errorGenerator = fetchStarterProjects();

  it('marks as xhr running', () => {
    expect(generator.next().value).to.deep.equal(put(startXHR()));
  });

  it('retrieves data', () => {
    expect(generator.next().value).to.deep.equal(call(Api.starterProjects));
  });

  it('handles data retrieved', () => {
    const starters = put(receiveStarterProjects(starterProjects));
    expect(generator.next(starterProjects).value).to.deep.equal(starters);
  });

  it('displays an error message', () => {
    errorGenerator.next();

    const message = put(setErrorMessage(errorMessage));
    expect(errorGenerator.throw(errorMessage).value).to.deep.equal(message);

    errorGenerator.next();
  });

  it('marks as xhr finished', () => {
    expect(generator.next().value).to.deep.equal(put(endXHR()));
  });

  it('finishes', () => {
    expect(generator.next().done).to.equal(true);
    expect(errorGenerator.next().done).to.equal(true);
  });

  it('watches', () => {
    const watchGenerator = watchFetchStarterProjectsRequest();
    const correct = call(takeEvery, FETCH_STARTER_PROJECTS_REQUEST, fetchStarterProjects);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });
});
