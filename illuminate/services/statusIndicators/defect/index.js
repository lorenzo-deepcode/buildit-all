const checkForAnySev1DefectsToday = require('./checkForAnySev1DefectsToday');
const constants = require('../../../util/constants');
const dataStore = require('../../datastore/mongodb');
const R = require('ramda');
const CO = require('co');

module.exports = {
  getStatuses(project, projectPath) {
    return CO(function* () {
      const statusIndicators = [];
      const defects = yield dataStore.getAllData(projectPath, constants.SUMMARYDEFECT)
      statusIndicators.push(checkForAnySev1DefectsToday.evaluate(project, R.clone(defects)));
      return statusIndicators.filter(statusIndicators => statusIndicators);
    });
  },
};