import isomorphicFetch from 'isomorphic-fetch';
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  RETRIEVE_MENU,
  // SET_ERROR,
} from 'actions/constants';

require('es6-promise').polyfill();

export function *retrieveMenu(action) {
  try {
    const response = yield call(isomorphicFetch, '//some-menu-url.json');
    if (response.status >= 400) {
      throw new Error("Nope.");
    }
    // yield put(SET_MENU, response.json());
    yield call(console.log, response.json());
  }
  catch (err) {
    yield call(console.log, err);
    // yield put(SET_ERROR)
  }
}

export function *watchRetrieveMenu() {
  yield call(takeEvery, RETRIEVE_MENU, retrieveMenu);
}
