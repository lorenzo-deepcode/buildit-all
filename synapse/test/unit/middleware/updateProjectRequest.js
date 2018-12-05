import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import Api from 'api';
import {
  setMessage,
  setErrorMessage,
  startXHR,
  endXHR,
} from 'actions';
import { UPDATE_PROJECT_REQUEST } from 'actions/actions';
import {
  updateProjectRequest,
  watchUpdateProjectRequest,
} from 'middleware/project';
const expect = require('chai').expect;

describe('Project updating', () => {
  const error = 'an error';
  const errorMessage = `There was an error.  We could not save the project: ${error}`;
  const project = { name: 'a project' };
  const action = { project };
  const generator = updateProjectRequest(action);
  const errorGenerator = updateProjectRequest(action);

  it('marks as xhr running', () => {
    expect(generator.next().value).to.deep.equal(put(startXHR()));
  });

  it('saves data', () => {
    expect(generator.next().value).to.deep.equal(call(Api.updateProject, project));
  });

  it('messages that the project was updated', () => {
    const correct = `The form data for project ${project.name} was saved successfully.`;
    expect(generator.next().value).to.deep.equal(put(setMessage(correct)));
  });

  it('displays an error message', () => {
    // Step into the try block
    errorGenerator.next();

    expect(errorGenerator.throw(error).value).to.deep.equal(put(setErrorMessage(errorMessage)));

    // After it displays the message, it has the endXHR call again
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
    const watchGenerator = watchUpdateProjectRequest();
    const correct = call(takeEvery, UPDATE_PROJECT_REQUEST, updateProjectRequest);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });
});
