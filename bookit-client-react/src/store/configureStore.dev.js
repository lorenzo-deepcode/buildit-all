import { applyMiddleware, createStore, compose } from 'redux'

import { apiMiddleware } from 'redux-api-middleware'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

import { rootReducer, rootSaga } from 'Redux'

import history from 'History'

const composeEnhancers = (
  window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

export default (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [
    apiMiddleware,
    routerMiddleware(history),
    sagaMiddleware,
  ]

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
  )

  const store = createStore(
    rootReducer,
    initialState,
    enhancer
  )

  let sagaTask = sagaMiddleware.run(rootSaga)

  if (module.hot) {
    module.hot.accept('Redux', () => {
      store.replaceReducer(rootReducer)
      sagaTask.cancel()
      sagaTask = sagaMiddleware.run(rootSaga)
    })
  }

  return store
}
