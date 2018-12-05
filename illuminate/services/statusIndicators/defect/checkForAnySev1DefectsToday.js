const constants = require('../../../util/constants');
const { CommonProjectStatusResult } = require('../../../util/utils');
const Log4js = require('log4js');
const moment = require('moment');
const Config = require('config');
const R = require('ramda');

const name = 'Sev 1 Defects Today';

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

module.exports = {
  evaluate(project, defects) {
    logger.debug(`starting checkForAnySev1DefectsToday calculation for [${project.name}]`)
    if (defects.length === 0) {
      return undefined;
    }
    const okThreshold = 0;
    const warningThreshold = 1;
    const sev1Name = R.last(project.defect.severity).name;
    const today = moment().utc().format(constants.DBDATEFORMAT);
    const todaysDefect = defects.filter(defect => defect.projectDate === today)[0];
    let status = constants.STATUSOK;
    if (todaysDefect && todaysDefect.severity[sev1Name] >= warningThreshold) {
      status = constants.STATUSWARNING;
    }
    return CommonProjectStatusResult(name, todaysDefect.severity[sev1Name] || 0, okThreshold, status, constants.DEFECTSECTION);
  }
}