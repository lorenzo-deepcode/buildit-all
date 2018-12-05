const constants = require('../util/constants');
const utils = require('../util/utils');
const dataStore = require('./datastore/mongodb');
const statusIndicators = require('./statusIndicators');

const Config = require('config');
const Log4js = require('log4js');
const CO = require('co');
const R = require('ramda');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.updateProjectStatus = function(aProject, projectPath) {
  return CO(function* () {
    function checkStatus(desiredStatus) {
      return (status) => status.status === desiredStatus;
    }

    const statuses = yield statusIndicators.getStatuses(aProject, projectPath);

    const flattened = R.flatten(R.toPairs(statuses).map(system => system[1]));
  
    if (flattened.length > 0) {
      let color = constants.STATUSOK;
      if (flattened.some(checkStatus(constants.STATUSERROR))) {
        color = constants.STATUSERROR
      } else if (flattened.some(checkStatus(constants.STATUSWARNING))) {
        color = constants.STATUSWARNING;
      }
      return dataStore.updateDocumentPart(
        utils.dbCorePath(),
        constants.PROJECTCOLLECTION,
        aProject._id,
        constants.PROJECTSTATUSKEY,
        color
      )
      .then(() => dataStore.wipeAndStoreData(projectPath, constants.STATUSCOLLECTION, flattened))
      .catch(error => {
        logger.error('updateProjectStatus', error);
        throw error;
      });
    } else {
      return Promise.resolve();
    }
  });
}