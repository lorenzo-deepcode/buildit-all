import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import Api from 'api';
import {
  setMessage,
  startXHR,
  endXHR,
} from 'actions';
import { SAVE_PROJECTION_REQUEST } from 'actions/actions';
import {
  saveProjectionRequest,
  watchSaveProjectionRequest,
} from 'middleware/project';
const expect = require('chai').expect;

describe('Projection saver', () => {
  // Neither of these work properly
  // const errorMessage = { message: 'an error message' };
  // const errorMessage = 'an error message';
  const projection = {
    backlogSize: true,
    darkMatter: true,
    iterationLength: true,
    velocityStart: true,
    velocityMiddle: true,
    periodStart: true,
    periodEnd: true,
    velocityEnd: true,
    startDate: true,
    endDate: true,
  };
  const processedProjection = {
    backlogSize: true,
    darkMatterPercentage: true,
    iterationLength: true,
    startVelocity: true,
    targetVelocity: true,
    startIterations: true,
    endIterations: true,
    endVelocity: true,
    startDate: true,
    endDate: true,
  };
  const name = 'a name';
  const action = { projection, name };
  const generator = saveProjectionRequest(action);
  // const errorGenerator = saveProjectionRequest();

  it('marks as xhr running', () => {
    expect(generator.next().value).to.deep.equal(put(startXHR()));
  });

  it('saves data', () => {
    const correctSave = call(Api.saveProjection, processedProjection, name);
    expect(generator.next().value).to.deep.equal(correctSave);
  });

  it('displays a message', () => {
    const message = put(setMessage(`The projection for project ${name} was saved successfully.`));
    expect(generator.next().value).to.deep.equal(message);
  });

  it('marks as xhr finished', () => {
    expect(generator.next().value).to.deep.equal(put(endXHR()));
  });

  // TODO:  Figure out why this test is borked.
  // it('displays an error message', () => {
  //   errorGenerator.next();
  //
  //   const message = `There was an error. We could not save the projection: ${errorMessage}`;
  //   expect(errorGenerator.throw(errorMessage).value)
  //      .to.deep.equal(put(setErrorMessage(message)));
  // });

  // TODO: re-enable this test once the previous test is fixed
  // it('finishes', () => {
  //   expect(generator.next().done).to.equal(true);
  //   expect(errorGenerator.next().done).to.equal(true);
  // });

  it('watches', () => {
    const watchGenerator = watchSaveProjectionRequest();
    const correct = call(takeEvery, SAVE_PROJECTION_REQUEST, saveProjectionRequest);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });
});
