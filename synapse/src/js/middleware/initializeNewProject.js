/*
 * Middleware for INITIALIZE_NEW_PROJECT
 */
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { INITIALIZE_NEW_PROJECT } from 'actions/actions';
import {
  fetchProjectSuccess,
} from 'actions';

import blankProject from 'helpers/blankProject';

export const getStarterList = state => state.projects.starterProjectList;

export function* initializeNewProject(action) {
  const initializedProject = blankProject.create();
  initializedProject.new = true;

  if (action.harvestId) {
    const starters = yield(select(getStarterList));
    starters.forEach(projectFromList => {
      if (projectFromList.name === action.harvestId) {
        for (const key of Object.keys(projectFromList)) {
          initializedProject[key] = projectFromList[key];
        }
      }
    });
  }

  yield(put(fetchProjectSuccess(initializedProject)));
}

export function* watchInitializeNewProject() {
  yield call(takeEvery, INITIALIZE_NEW_PROJECT, initializeNewProject);
}
