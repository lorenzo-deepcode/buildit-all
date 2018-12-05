import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import {
  fetchProjectSuccess,
} from 'actions';
import { INITIALIZE_NEW_PROJECT } from 'actions/actions';
import {
  initializeNewProject,
  getStarterList,
  watchInitializeNewProject,
} from 'middleware/initializeNewProject';

import blankProject from 'helpers/blankProject';

const expect = require('chai').expect;

describe('New project initializer', () => {
  const harvestName = 'bar';
  const harvestAction = { harvestId: harvestName };
  const starterHarvestProject = { name: harvestName, prop1: 'baz', new: true };
  const notHarvestName = 'baz';
  const notHarvestAction = { harvestId: notHarvestName };
  const starterList = [
    { name: 'foo', prop1: 'baz', new: true },
    starterHarvestProject,
  ];

  const generator = initializeNewProject({});
  const harvestGenerator = initializeNewProject(harvestAction);
  const notHarvestGenerator = initializeNewProject(notHarvestAction);

  it('deals with not having a harvest id', () => {
    const noHarvestProject = blankProject.create();
    noHarvestProject.new = true;

    const actual = generator.next(starterList).value;
    const correct = put(fetchProjectSuccess(noHarvestProject));
    expect(actual).to.deep.equal(correct);
  });

  it('retrieves a starter project list from the store', () => {
    const correct = select(getStarterList);
    expect(harvestGenerator.next().value).to.deep.equal(correct);
    expect(notHarvestGenerator.next().value).to.deep.equal(correct);
  });

  it('deals with having a harvest id', () => {
    const harvestProject = Object.assign({}, blankProject.create(), starterHarvestProject);
    const harvestCorrect = put(fetchProjectSuccess(harvestProject));

    const noHarvestProject = blankProject.create();
    noHarvestProject.new = true;
    const noHarvestCorrect = put(fetchProjectSuccess(noHarvestProject));

    const harvestActual = harvestGenerator.next(starterList).value;
    const noHarvestActual = notHarvestGenerator.next(starterList).value;
    expect(harvestActual).to.deep.equal(harvestCorrect);
    expect(noHarvestActual).to.deep.equal(noHarvestCorrect);
  });

  it('finishes', () => {
    expect(generator.next().done).to.equal(true);
    expect(harvestGenerator.next().done).to.equal(true);
    expect(notHarvestGenerator.next().done).to.equal(true);
  });

  it('watches', () => {
    const watchGenerator = watchInitializeNewProject();
    const correct = call(takeEvery, INITIALIZE_NEW_PROJECT, initializeNewProject);
    expect(watchGenerator.next().value).to.deep.equal(correct);
  });

  it('can fetch status', () => {
    const testProjectList = ['a', 'set', 'of', 'test', 'values'];
    const testState = { projects: { starterProjectList: testProjectList } };
    expect(getStarterList(testState)).to.equal(testProjectList);
  });
});
