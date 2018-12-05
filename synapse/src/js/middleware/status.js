/*
 * Middleware for FETCH_PROJECT_STATUS_DATA
 */

import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { FETCH_PROJECT_STATUS_DATA, FETCH_PROJECT_RAGSTATUS_DATA } from 'actions/actions';
import {
  fetchProjectSuccess,
  fetchRagStatusSuccess,
  fetchStatusSuccess,
  fetchEventHistorySuccess,
  setErrorMessage,
  startXHR,
  endXHR,
} from 'actions';
import {
  fetchProject,
  fetchProjectDemandData,
  fetchProjectDefectData,
  fetchProjectEffortData,
  fetchProjectRagStatusData,
  fetchEventHistoryData,
} from 'middleware/api';

export function createStatusErrorMessage(demand, defect, effort, project) {
  // Construct any required error messages
  const errorMessage = [];
  const getMissingStatusDataList = (statusData) => (
    Object.keys(statusData).filter(key => (
      statusData[key].length === 0
    ))
  );
  const missingDataList = getMissingStatusDataList({ demand, defect, effort });
  if (missingDataList.length) {
    errorMessage.push(`There is no data for ${missingDataList.join(', ')}.`);
  }
  if (!project.projection) {
    errorMessage.push('You have not yet set a projection for this project.');
  }

  return errorMessage;
}

/*
 * Saga for FETCH_PROJECT_RAGSTATUS_DATA
 */
export function* fetchRagStatusData(action) {
  const name = action.name;

  const [statuses] = yield[
    call(fetchProjectRagStatusData, name),
  ];

  yield put(startXHR());

  yield put(fetchRagStatusSuccess(statuses));

  yield put(endXHR());
}

/*
 * Saga for FETCH_PROJECT_STATUS_DATA
 */
export function* fetchAllStatusData(action) {
  const name = action.name;

  yield put(startXHR());

  const [demand, defect, effort, ragStatus, events, project] = yield[
    call(fetchProjectDemandData, name),
    call(fetchProjectDefectData, name),
    call(fetchProjectEffortData, name),
    call(fetchProjectRagStatusData, name),
    call(fetchEventHistoryData, name),
    call(fetchProject, name),
  ];

  yield put(fetchStatusSuccess({
    demand,
    defect,
    effort,
    ragStatus,
  }));
  yield put(fetchProjectSuccess(project));
  yield put(fetchEventHistorySuccess(events));

  const errorMessage = yield call(createStatusErrorMessage, demand, defect, effort, project);
  if (errorMessage.length) {
    yield put(setErrorMessage(errorMessage.join(' ')));
  }

  yield put(endXHR());
}

export function* watchFetchDemandStatusData() {
  yield call(takeEvery, FETCH_PROJECT_STATUS_DATA, fetchAllStatusData);
}

export function* watchFetchRagStatusData() {
  yield call(takeEvery, FETCH_PROJECT_RAGSTATUS_DATA, fetchRagStatusData);
}
