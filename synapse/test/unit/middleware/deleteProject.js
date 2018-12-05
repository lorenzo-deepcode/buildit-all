import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import {
  deleteProjectSuccess,
  setMessage,
  setErrorMessage,
} from 'actions';
import { DELETE_PROJECT } from 'actions/actions';
import {
  deleteProjectRequest,
  watchDeleteProject,
} from 'middleware/project';
import {
  deleteProject as apiDeleteProject,
} from 'middleware/api';

import { expect } from 'chai';

describe('Project deleter middleware', () => {
  const errorMessage = 'We could not delete the project.';
  const project = { name: 'P001', projection: {} };
  const generator = deleteProjectRequest(project);
  const errorGenerator = deleteProjectRequest(project);

  it('makes the deletion api call', () => {
    expect(generator.next().value).to.deep.equal(call(apiDeleteProject, project));
  });

  it('triggers the deletion success', () => {
    expect(generator.next(true).value).to.deep.equal(put(deleteProjectSuccess(project.name)));
  });

  it('messages its success', () => {
    const correct = put(setMessage(`Project ${project.name} deleted.`));
    expect(generator.next().value).to.deep.equal(correct);
  });

  it('displays an error message', () => {
    errorGenerator.next();
    const message = put(setErrorMessage(errorMessage));

    expect(errorGenerator.throw(errorMessage).value).to.deep.equal(message);
  });

  it('watches', () => {
    const watchGenerator = watchDeleteProject();
    const correct = call(takeEvery, DELETE_PROJECT, deleteProjectRequest);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });
});
