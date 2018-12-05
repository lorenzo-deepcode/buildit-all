import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import {
  DELETE_PROJECT,
  FETCH_PROJECTS,
  FETCH_PROJECTION_REQUEST,
  FETCH_STARTER_PROJECTS_REQUEST,
  FETCH_PROJECT_REQUEST,
  SAVE_PROJECTION_REQUEST,
  UPDATE_PROJECT_REQUEST,
  SAVE_PROJECT_REQUEST,
  VALIDATE_PROJECT_REQUEST,
} from 'actions/actions';
import {
  deleteProjectSuccess,
  receiveProjects,
  receiveStarterProjects,
  fetchProjectSuccess,
  setMessage,
  clearMessage,
  setErrorMessage,
  startXHR,
  endXHR,
} from 'actions';
import { trimFormInputs } from 'helpers/trimFormInputs';
import {
  deleteProject,
  fetchProject,
} from 'middleware/api';

import Api from 'api';

/*
 * Middleware for FETCH_PROJECT_REQUEST
 */
export function* fetchProjectRequest(action) {
  try {
    yield put(startXHR());
    const project = yield call(fetchProject, action.name);
    yield put(fetchProjectSuccess(project));
    // TODO:  This is not the best place for this.  I'm conflating business logic with an
    // xhr request.  This is working under the assumption that we are only calling
    // projection_request when we're on the projection page.  Which is TRUE, but irrelevant.
    // We should have this broken out better.  But that's for a later rethink.
    if (action.type === FETCH_PROJECTION_REQUEST && !project.projection) {
      yield put(setMessage('You are creating a new projection'));
    }
  } catch (err) {
    yield put(setErrorMessage('We could not fetch the project.'));
  } finally {
    yield put(endXHR());
  }
}
export function* watchFetchProjectRequest() {
  yield call(takeEvery, FETCH_PROJECT_REQUEST, fetchProjectRequest);
}
export function* watchFetchProjectionRequest() {
  yield call(takeEvery, FETCH_PROJECTION_REQUEST, fetchProjectRequest);
}

/*
 * Middleware for DELETE_PROJECT
 */
export function* deleteProjectRequest(action) {
  try {
    if (yield call(deleteProject, action)) {
      yield put(deleteProjectSuccess(action.name));
      yield put(setMessage(`Project ${action.name} deleted.`));
    }
  } catch (err) {
    yield put(setErrorMessage('We could not delete the project.'));
  }
}

export function* watchDeleteProject() {
  yield call(takeEvery, DELETE_PROJECT, deleteProjectRequest);
}

/*
 * Middleware for FETCH_PROJECTS
 */
export function* fetchProjects() {
  let projectSummary = [];
  try {
    yield put(startXHR());
    projectSummary = yield call(Api.projects);
    yield put(receiveProjects(projectSummary));
  } catch (err) {
    yield put(setErrorMessage('There was an error fetching the projects.'));
  } finally {
    yield put(endXHR());
  }
}
export function* watchFetchProjects() {
  yield call(takeEvery, FETCH_PROJECTS, fetchProjects);
}


/*
 * Middleware for FETCH_STARTER_PROJECTS_REQUEST
 */
export function* fetchStarterProjects() {
  try {
    yield put(startXHR());
    const starterProjects = yield call(Api.starterProjects);
    yield put(receiveStarterProjects(starterProjects));
  } catch (err) {
    yield put(setErrorMessage('We could not fetch the projects.'));
  } finally {
    yield put(endXHR());
  }
}
export function* watchFetchStarterProjectsRequest() {
  yield call(takeEvery, FETCH_STARTER_PROJECTS_REQUEST, fetchStarterProjects);
}


/*
 * Middleware for SAVE_PROJECTION_REQUEST
 */
export function* saveProjectionRequest(action) {
  try {
    yield put(startXHR());
    const projection = action.projection;
    const name = action.name;
    const projectionToSave = {
      backlogSize: projection.backlogSize,
      darkMatterPercentage: projection.darkMatter,
      iterationLength: projection.iterationLength,
      startVelocity: projection.velocityStart,
      targetVelocity: projection.velocityMiddle,
      startIterations: projection.periodStart,
      endIterations: projection.periodEnd,
      endVelocity: projection.velocityEnd,
      startDate: projection.startDate,
      endDate: projection.endDate,
    };
    yield call(Api.saveProjection, projectionToSave, name);
    yield put(setMessage(`The projection for project ${name} was saved successfully.`));
  } catch (err) {
    yield put(setErrorMessage(`There was an error. We could not save the projection: ${err}`));
  } finally {
    yield put(endXHR());
  }
}
export function* watchSaveProjectionRequest() {
  yield call(takeEvery, SAVE_PROJECTION_REQUEST, saveProjectionRequest);
}

function whitelistProjectFields(originalProject) {
  const finalProject = {};
  const whitelistFields = [
    'name',
    'program',
    'portfolio',
    'description',
    'startDate',
    'endDate',
    'demand',
    'defect',
    'effort',
    'projection',
  ];
  for (const field of whitelistFields) {
    if (originalProject[field]) {
      finalProject[field] = originalProject[field];
    }
  }
  return finalProject;
}


/*
 * Middleware for UPDATE_PROJECT_REQUEST
 */
export function* updateProjectRequest(action) {
  try {
    yield put(startXHR());
    yield call(Api.updateProject, whitelistProjectFields(action.project));
    const message = `The form data for project ${action.project.name} was saved successfully.`;
    yield put(setMessage(message));
  } catch (err) {
    yield put(setErrorMessage(`There was an error.  We could not save the project: ${err}`));
  } finally {
    yield put(endXHR());
  }
}
export function* watchUpdateProjectRequest() {
  yield call(takeEvery, UPDATE_PROJECT_REQUEST, updateProjectRequest);
}


/*
 * Middleware for SAVE_PROJECT_REQUEST
 */
export function* saveProjectRequest(action) {
  try {
    yield put(startXHR());
    const project = yield(call(trimFormInputs, action.project));
    yield put(setMessage(`Saving ${project.name}`));
    yield call(Api.saveProject, whitelistProjectFields(project));
    yield put(clearMessage());
    if (action.destination) {
      yield call(browserHistory.push, action.destination);
    }
    yield put(setMessage(`${project.name} saved`));
  } catch (err) {
    yield put(setErrorMessage('We could not save the project.'));
  } finally {
    yield put(endXHR());
  }
}
export function* watchSaveProjectRequest() {
  yield call(takeEvery, SAVE_PROJECT_REQUEST, saveProjectRequest);
}

/*
 * Middleware for VALIDATE_PROJECT_REQUEST
 */
export function* validateProjectRequest(action) {
  try {
    yield put(startXHR());
    const project = yield(call(trimFormInputs, action.project));
    yield put(setMessage(`Validating ${project.name}`));
    yield call(Api.saveProject, whitelistProjectFields(project));
    yield put(clearMessage());
    if (action.destination) {
      yield call(browserHistory.push, action.destination);
    }
    yield put(setMessage(`${project.name} validation returned`));
  } catch (err) {
    yield put(setErrorMessage('We could not validate the project.'));
  } finally {
    yield put(endXHR());
  }
}
export function* watchValidateProjectRequest() {
  yield call(takeEvery, VALIDATE_PROJECT_REQUEST, validateProjectRequest);
}
