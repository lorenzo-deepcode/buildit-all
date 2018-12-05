import { combineReducers } from 'redux-immutable';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Immutable from 'immutable';


import {
  watchRetrieveMenu
} from 'sagas/ajax/menu';

// const rootReducer = combineReducers({});
const rootReducer = state => state;
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

module.exports = (initialState) => {
  const immutableState = Immutable.Map(initialState);

  const store = createStore(rootReducer, immutableState, applyMiddleware(...middlewares));
  sagaMiddleware.run(watchRetrieveMenu);

  return store;
}
