import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducer from './reducer';

const logger = createLogger();

export default (initialState) => {
  const store = compose(applyMiddleware(thunk, logger))(createStore)(reducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
