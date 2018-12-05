import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import {
  createStatusErrorMessage,
  fetchAllStatusData,
  watchFetchDemandStatusData,
} from 'middleware/status';
import {
  fetchProject,
  fetchProjectDemandData,
  fetchProjectDefectData,
  fetchProjectEffortData,
  fetchProjectRagStatusData,
  fetchEventHistoryData,
} from 'middleware/api';
import {
  fetchProjectSuccess,
  fetchEventHistorySuccess,
  setErrorMessage,
  startXHR,
  endXHR,
} from 'actions';
import { FETCH_PROJECT_STATUS_DATA } from 'actions/actions';
import {
  fetchStatusSuccess,
} from 'actions/fetchAllStatusData';
const expect = require('chai').expect;

describe('status error message constructor', () => {
  const goodDemand = ['foo', 'bar', 'baz'];
  const goodDefect = ['foo', 'bar', 'baz'];
  const goodEffort = ['foo', 'bar', 'baz'];
  const goodProject = { projection: 'foo' };
  const badDemand = [];
  const badDefect = [];
  const badEffort = [];
  const badProject = {};

  it('returns nothing when everything is fine', () => {
    const noMessage = createStatusErrorMessage(goodDemand, goodDefect, goodEffort, goodProject);
    expect(noMessage).to.deep.equal([]);
  });
  it('returns one message when projections are missing', () => {
    const oneMessage = createStatusErrorMessage(goodDemand, goodDefect, goodEffort, badProject);
    expect(oneMessage).to.deep.equal(['You have not yet set a projection for this project.']);
  });
  it('returns one message when status data is missing', () => {
    const missingDataList = ['demand', 'effort'];
    const correct = [`There is no data for ${missingDataList.join(', ')}.`];
    const oneMessage = createStatusErrorMessage(badDemand, goodDefect, badEffort, goodProject);
    expect(oneMessage).to.deep.equal(correct);
  });
  it('returns two messages when both are bad', () => {
    const missingDataList = ['demand', 'defect', 'effort'];
    const correct = [
      `There is no data for ${missingDataList.join(', ')}.`,
      'You have not yet set a projection for this project.',
    ];
    const twoMessage = createStatusErrorMessage(badDemand, badDefect, badEffort, badProject);
    expect(twoMessage).to.deep.equal(correct);
  });
});


describe('All status for project fetcher', () => {
  const name = 'Foo';
  const generator = fetchAllStatusData({ name });
  const errorGenerator = fetchAllStatusData({ name });
  const demand = { this: 'that' };
  const defect = { near: 'far' };
  const effort = { we: 'they' };
  const events = ['one', 'two', 'three'];
  const ragStatus = ['red', 'amber', 'green'];
  const project = { project: 'Yes, this is a project' };
  project.projection = {
    pretendKey: 'Just for the test.',
  };

  it('marks as xhr running', () => {
    expect(generator.next().value).to.deep.equal(put(startXHR()));
  });

  it('retrieves data', () => {
    const projectCorrect = call(fetchProject, name);
    const demandCorrect = call(fetchProjectDemandData, name);
    const defectCorrect = call(fetchProjectDefectData, name);
    const effortCorrect = call(fetchProjectEffortData, name);
    const ragStatusCorrect = call(fetchProjectRagStatusData, name);
    const eventsCorrect = call(fetchEventHistoryData, name);

    const correct = [
      demandCorrect,
      defectCorrect,
      effortCorrect,
      ragStatusCorrect,
      eventsCorrect,
      projectCorrect,
    ];
    expect(generator.next().value).to.deep.equal(correct);
  });

  it('updates the status', () => {
    const next = generator.next([demand, defect, effort, ragStatus, events, project]).value;
    const statusSuccessCorrect = put(fetchStatusSuccess({
      demand, defect, effort, ragStatus,
    }));
    expect(next).to.deep.equal(statusSuccessCorrect);
  });

  it('updates the project itself', () => {
    expect(generator.next().value).to.deep.equal(put(fetchProjectSuccess(project)));
  });

  it('updates the event history', () => {
    expect(generator.next().value).to.deep.equal(put(fetchEventHistorySuccess(events)));
  });

  it('attempts to construct an error message', () => {
    const correct = call(createStatusErrorMessage, demand, defect, effort, project);
    expect(generator.next().value).to.deep.equal(correct);
  });

  it('sends a message when there is an error message', () => {
    errorGenerator.next();
    errorGenerator.next();
    errorGenerator.next([demand, defect, effort, events, project]);
    errorGenerator.next();
    errorGenerator.next();
    errorGenerator.next();
    expect(errorGenerator.next(['foo']).value).to.deep.equal(put(setErrorMessage('foo')));
  });
  it('ends the xhr display after error', () => {
    expect(errorGenerator.next().value).to.deep.equal(put(endXHR()));
  });

  it('skips displaying an error message if there isn\'t one', () => {
    const correct = put(endXHR());
    expect(generator.next([]).value).to.deep.equal(correct);
  });

  it('finishes', () => {
    expect(generator.next().done).to.equal(true);
    expect(errorGenerator.next().done).to.equal(true);
  });

  it('watches', () => {
    const watchGenerator = watchFetchDemandStatusData();
    const correct = call(takeEvery, FETCH_PROJECT_STATUS_DATA, fetchAllStatusData);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });
});
