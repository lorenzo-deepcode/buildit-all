import { applyMiddleware, createStore, compose } from 'redux'

import { apiMiddleware } from 'redux-api-middleware'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

import { rootReducer, rootSaga } from 'Redux'

import history from 'History'

export default (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [
    apiMiddleware,
    routerMiddleware(history),
    sagaMiddleware,
  ]

  const enhancer = compose(
    applyMiddleware(...middlewares)
  )

  const store = createStore(
    rootReducer,
    initialState,
    enhancer
  )

  sagaMiddleware.run(rootSaga)

  return store
}
