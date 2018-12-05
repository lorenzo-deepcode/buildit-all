let configureStore

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  configureStore = require('./configureStore.prod').default
} else {
  configureStore = require('./configureStore.dev').default
}

const store = configureStore()

export default store
