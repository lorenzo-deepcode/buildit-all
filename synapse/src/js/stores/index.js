const isLogging = false;

import createSagaMiddleware from 'redux-saga';
import reducers from 'reducers';
import createLogger from 'redux-logger';

// Sagas
import {
  watchInitializeNewProject,
} from 'middleware/initializeNewProject';
import {
  watchFetchProjectionRequest,
  watchFetchProjects,
  watchFetchStarterProjectsRequest,
  watchFetchProjectRequest,
  watchSaveProjectionRequest,
  watchUpdateProjectRequest,
  watchSaveProjectRequest,
  watchDeleteProject,
} from 'middleware/project';
import {
  watchFetchDemandStatusData,
  watchFetchRagStatusData,
} from 'middleware/status';
import {
  watchLoginRequest,
  watchLogoutRequest,
} from 'middleware/auth';

const redux = require('redux');

const sagaMiddleware = createSagaMiddleware();

module.exports = (initialState) => {
  const middlewares = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development' && isLogging) {
    const logger = createLogger();
    middlewares.push(logger);
  }

  const store = redux.createStore(
    reducers,
    initialState,
    redux.applyMiddleware(...middlewares));

  sagaMiddleware.run(watchFetchProjectionRequest);
  sagaMiddleware.run(watchFetchDemandStatusData);
  sagaMiddleware.run(watchFetchRagStatusData);
  sagaMiddleware.run(watchFetchProjects);
  sagaMiddleware.run(watchFetchStarterProjectsRequest);
  sagaMiddleware.run(watchFetchProjectRequest);
  sagaMiddleware.run(watchSaveProjectionRequest);
  sagaMiddleware.run(watchUpdateProjectRequest);
  sagaMiddleware.run(watchSaveProjectRequest);
  sagaMiddleware.run(watchInitializeNewProject);
  sagaMiddleware.run(watchLoginRequest);
  sagaMiddleware.run(watchLogoutRequest);
  sagaMiddleware.run(watchDeleteProject);

  return store;
};
