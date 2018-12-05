let historyForEnv

if (process.env.NODE_ENV === 'test') {
  historyForEnv = require('./createHistory.testing').default
} else {
  historyForEnv = require('./createHistory').default
}

export default historyForEnv
