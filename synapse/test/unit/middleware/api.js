import { call } from 'redux-saga/effects';

import {
  fetchProject,
  deleteProject,
  fetchProjectDemandData,
  fetchProjectDefectData,
  fetchProjectEffortData,
  fetchEventHistoryData,
  fetchProjectRagStatusData,
} from 'middleware/api';

import Api from 'api';

import { expect } from 'chai';

describe('fetcher for individual project data', () => {
  const projectCorrect = 'foo';
  const name = 'name';
  const generator = fetchProject(name);
  const errorGenerator = fetchProject(name);

  it('fetches the project', () => {
    const correct = call(Api.project, name);
    expect(generator.next().value).to.deep.equal(correct);
    const final = generator.next(projectCorrect).value;
    expect(final).to.deep.equal(projectCorrect);
  });
  it('returns a default on failure', () => {
    errorGenerator.next();
    const final = errorGenerator.throw('').value;
    expect(final).to.deep.equal({});
  });
});

describe('individual project deleter', () => {
  const name = 'name';
  const generator = deleteProject(name);
  const errorGenerator = deleteProject(name);

  it('deletes a project', () => {
    const correct = call(Api.deleteProject, name);
    expect(generator.next().value).to.deep.equal(correct);
    expect(generator.next().value).to.equal(true);
  });

  it('notifies on failure', () => {
    errorGenerator.next();
    expect(errorGenerator.throw(new Error()).value).to.equal(false);
  });

  it('completes', () => {
    expect(generator.next().done).to.equal(true);
    expect(errorGenerator.next().done).to.equal(true);
  });
});


describe('fetcher for project demand data', () => {
  const demandCorrect = 'foo';
  const name = 'name';
  const generator = fetchProjectDemandData(name);
  const errorGenerator = fetchProjectDemandData(name);

  it('fetches demand', () => {
    const correct = call(Api.projectDemandSummary, name);
    expect(generator.next().value).to.deep.equal(correct);
    const final = generator.next(demandCorrect).value;
    expect(final).to.deep.equal(demandCorrect);
  });
  it('returns a default on failure', () => {
    errorGenerator.next();
    const final = errorGenerator.throw('').value;
    expect(final).to.deep.equal([]);
  });
});

describe('fetcher for project defect data', () => {
  const defectCorrect = 'foo';
  const name = 'name';
  const generator = fetchProjectDefectData(name);
  const errorGenerator = fetchProjectDefectData(name);

  it('fetches defect', () => {
    const correct = call(Api.projectDefectSummary, name);
    expect(generator.next().value).to.deep.equal(correct);
    const final = generator.next(defectCorrect).value;
    expect(final).to.deep.equal(defectCorrect);
  });
  it('returns a default on failure', () => {
    errorGenerator.next();
    const final = errorGenerator.throw('').value;
    expect(final).to.deep.equal([]);
  });
});

describe('fetcher for project effort data', () => {
  const effortCorrect = 'foo';
  const name = 'name';
  const generator = fetchProjectEffortData(name);
  const errorGenerator = fetchProjectEffortData(name);

  it('fetches effort', () => {
    const correct = call(Api.projectEffortSummary, name);
    expect(generator.next().value).to.deep.equal(correct);
    const final = generator.next(effortCorrect).value;
    expect(final).to.deep.equal(effortCorrect);
  });
  it('returns a default on failure', () => {
    errorGenerator.next();
    const final = errorGenerator.throw('').value;
    expect(final).to.deep.equal([]);
  });
});

describe('fetcher for event history', () => {
  const eventsCorrect = ['one', 'two', 'three'];
  const defaultValue = [];
  const name = 'name';
  const generator = fetchEventHistoryData(name);
  const errorGenerator = fetchEventHistoryData(name);

  it('fetches event history', () => {
    const correct = call(Api.projectEventHistory, name);
    expect(generator.next().value).to.deep.equal(correct);
    expect(generator.next(eventsCorrect).value).to.deep.equal(eventsCorrect);
  });
  it('returns an empty array on failure', () => {
    errorGenerator.next();
    const final = errorGenerator.throw('').value;
    expect(final).to.deep.equal(defaultValue);
  });
});

describe('fetcher for RAG status data', () => {
  const statusesCorrect = ['testStatus'];
  const defaultValue = [];
  const name = 'name';
  const generator = fetchProjectRagStatusData(name);
  const errorGenerator = fetchProjectRagStatusData(name);

  it('fetches rag statuses', () => {
    const correct = call(Api.projectRagStatusSummary, name);
    expect(generator.next().value).to.deep.equal(correct);
    expect(generator.next(statusesCorrect).value).to.deep.equal(statusesCorrect);
  });
  it('returns an empty array on failure', () => {
    errorGenerator.next();
    const final = errorGenerator.throw('').value;
    expect(final).to.deep.equal(defaultValue);
  });
});
