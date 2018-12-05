const demandVsProjected = require('./demandVsProjected');
const backlogRegressionEndDatePredictor = require('./backlogRegressionEndDatePredictor');
const constants = require('../../../util/constants');
const dataStore = require('../../datastore/mongodb');
const R = require('ramda');
const CO = require('co');

module.exports = {
  getStatuses(project, projectPath) {
    return CO(function* () {
      const statusIndicators = [];
      const demands = yield dataStore.getAllData(projectPath, constants.SUMMARYDEMAND)
      statusIndicators.push(demandVsProjected.evaluate(project, R.clone(demands)));
      statusIndicators.push(backlogRegressionEndDatePredictor.evaluate(project, R.clone(demands)));
      return statusIndicators.filter(statusIndicators => statusIndicators);
    });
  },
};