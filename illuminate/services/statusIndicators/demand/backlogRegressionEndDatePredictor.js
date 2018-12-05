const constants = require('../../../util/constants');
const { CommonProjectStatusResult } = require('../../../util/utils');
const Log4js = require('log4js');
const moment = require('moment');
const { linearRegression } = require('simple-statistics');
const Config = require('config');
const R = require('ramda');

const name = 'Backlog Regression End Date Predictor';

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

module.exports = {
  evaluate(project, demands) {
    logger.debug(`starting backlogRegressionEndDatePredictor calculation for [${project.name}]`)
    if (demands.length === 0) {
      return undefined;
    }

    const notDonePoints = [];

    const targetDate = moment(project.endDate, constants.DBDATEFORMAT).utc();

    const [ doneStartDate, doneEndDate ] = getDataRange(demands, constants.JIRACOMPLETE);

    demands
    .map(summary => R.merge(summary, { projectDate: moment(summary.projectDate, constants.DBDATEFORMAT).utc() }))
    .filter(summary => summary.projectDate.isSameOrAfter(doneStartDate) && summary.projectDate.isSameOrBefore(doneEndDate))
    .forEach(summary => {
      const x = summary.projectDate.unix();
      const yNotDone = R.toPairs(R.omit([constants.JIRACOMPLETE], summary.status))
      .reduce((count, pair) => count + pair[1], 0) || 0;
      if (yNotDone) {
        notDonePoints.push([x, yNotDone]);
      }
    });

    const notDoneMB = linearRegression(notDonePoints);
    const xZero = - notDoneMB.b / notDoneMB.m;

    const estimatedCompletionDate = moment.unix(xZero).utc();

    const dateFormat = 'MMM DD, YYYY';
    
    const projected = moment(project.endDate, constants.DBDATEFORMAT).utc().format(dateFormat);
    const actual = estimatedCompletionDate.format(dateFormat);
    let status = constants.STATUSWARNING;


    if (estimatedCompletionDate.isAfter(targetDate) || xZero < 0) {
      status = constants.STATUSERROR;
    } else if (estimatedCompletionDate.isBefore(targetDate)) {
      status = constants.STATUSOK;
    }
    return CommonProjectStatusResult(name, actual, projected, status, constants.DEMANDSECTION);
  }
};

function getDataRange(statusData, category) {
  const datesInCategory = statusData.filter(datapoint => datapoint.status[category])
    .map(datapoint => moment(datapoint.projectDate).utc());
  const tomorrow = moment().utc().add(1, 'days').hours(0).minutes(0).seconds(0);
  const max = moment.max(datesInCategory);
  const returnedMax = max.isAfter(tomorrow) ? tomorrow : max;
  return [
    moment.min(datesInCategory).utc(),
    returnedMax,
  ];
}