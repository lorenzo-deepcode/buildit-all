import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import {
  fetchRagStatusData,
  watchFetchRagStatusData,
} from 'middleware/status';
import {
  fetchProjectRagStatusData,
} from 'middleware/api';
import {
  fetchRagStatusSuccess,
  startXHR,
  endXHR,
} from 'actions';
import { FETCH_PROJECT_RAGSTATUS_DATA } from 'actions/actions';
const expect = require('chai').expect;

describe('RAG status fetcher', () => {
  const name = 'Foo';
  const generator = fetchRagStatusData({ name });
  const statuses = { statuses: ['red', 'amber', 'green'] };

  it('retrieves data', () => {
    const statusCorrect = call(fetchProjectRagStatusData, name);
    const correct = [statusCorrect];
    expect(generator.next().value).to.deep.equal(correct);
  });

  it('marks as xhr running', () => {
    const next = generator.next([statuses]).value;
    expect(next).to.deep.equal(put(startXHR()));
  });

  it('updates the statuses', () => {
    const next = generator.next().value;
    const statusesSuccessCorrect = put(fetchRagStatusSuccess(statuses));
    expect(next).to.deep.equal(statusesSuccessCorrect);
  });

  it('ends the xhr', () => {
    expect(generator.next().value).to.deep.equal(put(endXHR()));
  });

  it('finishes', () => {
    expect(generator.next().done).to.equal(true);
  });

  it('watches', () => {
    const watchGenerator = watchFetchRagStatusData();
    const correct = call(takeEvery, FETCH_PROJECT_RAGSTATUS_DATA, fetchRagStatusData);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });
});
