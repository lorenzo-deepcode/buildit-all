const constants = require('../../../util/constants');
const { CommonProjectStatusResult } = require('../../../util/utils');
const Log4js = require('log4js');
const Config = require('config');
const moment = require('moment');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const name = 'Demand vs Projected';

module.exports = {
  evaluate(project, demands) {
    logger.debug(`starting backlogRegressionEndDatePredictor calculation for [${project.name}]`)
    if (demands.length === 0) {
      return undefined;
    }

    const actual = demands
    .sort((a, b) => a.projectDate < b.projectDate ? -1 : 1)
    .reduce((finalDone, summary) => summary.status.Done, undefined);

    const safeValue = actual ? actual : 0;

    const expected = getTodaysStoryTarget(project);
    let status = constants.STATUSWARNING;
    if (safeValue < expected) {
      status = constants.STATUSERROR;
    } else if (safeValue > expected) {
      status = constants.STATUSOK;
    }
    return CommonProjectStatusResult(name, actual, expected, status, constants.DEMANDSECTION);
  }
};

function getTodaysStoryTarget ({ projection }) {
  const {
    backlogSize,
    darkMatterPercentage,
    endIterations,
    endVelocity,
    iterationLength,
    startDate,
    startIterations,
    startVelocity,
    targetVelocity,
  } = projection;

  const dailyIterationLength = iterationLength * 7;
  const dailyEndLength = endIterations * dailyIterationLength;
  const dailyEndVelocity = endVelocity / dailyIterationLength;
  const dailyStartLength = startIterations * dailyIterationLength;
  const dailyStartVelocity = startVelocity / dailyIterationLength;
  const dailyTargetVelocity = targetVelocity / dailyIterationLength;
  const middleStories = backlogSize * (1 + darkMatterPercentage / 100)
                      - startIterations * startVelocity
                      - endIterations * endVelocity;
  const dailyMiddleLength = Math.ceil(middleStories / targetVelocity) * dailyIterationLength;
  const totalLength = dailyStartLength + dailyMiddleLength + dailyEndLength;

  const today = moment().utc();
  const momentStartDate = moment(startDate, constants.DBDATEFORMAT).utc();
  const dayNumber = today.diff(momentStartDate, 'days');

  function startPiece(day) {
    return Math.floor(dailyStartVelocity * day);
  }

  function middlePiece(day) {
    const m = dailyTargetVelocity;
    const x = dailyStartLength;
    const y = startPiece(x);
    const b = y - m * x;
    return Math.floor(m * day + b);
  }

  function endPiece(day) {
    const m = dailyEndVelocity;
    const x = dailyStartLength + dailyMiddleLength;
    const y = middlePiece(x);
    const b = y - m * x;
    return Math.floor(m * day + b);
  }
  if (dayNumber <= dailyStartLength) {
    return startPiece(dayNumber);
  }
  if (dayNumber > dailyStartLength && dayNumber <= totalLength - dailyEndLength) {
    return middlePiece(dayNumber); 
  }
  if (dayNumber  > totalLength - dailyEndLength) {
    return endPiece(dayNumber);
  }
}