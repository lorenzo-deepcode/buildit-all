import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import {
  fetchProjectRequest,
  watchFetchProjectRequest,
  watchFetchProjectionRequest,
} from 'middleware/project';
import { fetchProject } from 'middleware/api';
import {
  fetchProjectSuccess,
  setMessage,
  setErrorMessage,
  startXHR,
  endXHR,
} from 'actions';
import {
  FETCH_PROJECT_REQUEST,
  FETCH_PROJECTION_REQUEST,
} from 'actions/actions';
const expect = require('chai').expect;

describe('Single project fetcher', () => {
  const project = 'test';
  const action = { name: project };
  const projectionAction = Object.assign({}, action, { type: FETCH_PROJECTION_REQUEST });
  const generator = fetchProjectRequest(action);
  const projectionGenerator = fetchProjectRequest(projectionAction);
  const errorGenerator = fetchProjectRequest(action);
  const errorMessage = new Promise((response, reject) => { reject('error message'); });
  const displayedErrorMessage = 'We could not fetch the project.';

  it('marks as xhr running', () => {
    expect(generator.next().value).to.deep.equal(put(startXHR()));
  });

  it('retrieves data', () => {
    expect(generator.next().value).to.deep.equal(call(fetchProject, project));
  });

  it('calls a success action', () => {
    expect(generator.next(project).value).to.deep.equal(put(fetchProjectSuccess(project)));
  });

  it('sets a message when requesting a projection and there isn\'t one yet.', () => {
    const correct = put(setMessage('You are creating a new projection'));

    projectionGenerator.next();
    projectionGenerator.next();
    projectionGenerator.next(project);

    expect(projectionGenerator.next().value).to.deep.equal(correct);
  });

  it('sets a message on error', () => {
    errorGenerator.next();

    const generatorValue = errorGenerator.throw(errorMessage).value;
    const correct = put(setErrorMessage(displayedErrorMessage));
    expect(generatorValue).to.deep.equal(correct);
  });

  it('marks as xhr finished', () => {
    expect(generator.next().value).to.deep.equal(put(endXHR()));
    expect(errorGenerator.next().value).to.deep.equal(put(endXHR()));
  });

  it('finishes', () => {
    expect(generator.next().done).to.equal(true);
    expect(errorGenerator.next().done).to.equal(true);
  });

  it('watches', () => {
    const watchGenerator = watchFetchProjectRequest();
    const correct = call(takeEvery, FETCH_PROJECT_REQUEST, fetchProjectRequest);
    expect(watchGenerator.next().value).to.deep.equal(correct);

    const projectionCorrect = call(takeEvery, FETCH_PROJECTION_REQUEST, fetchProjectRequest);
    const projectionWatchGenerator = watchFetchProjectionRequest();
    expect(projectionWatchGenerator.next().value).to.deep.equal(projectionCorrect);
  });
});
