const backlogRegression = require('../services/statusIndicators/demand/backlogRegressionEndDatePredictor');
const constants = require('../util/constants');
const { CommonProjectStatusResult } = require('../util/utils');
const moment = require('moment');
const R = require('ramda');
const Should = require('should');

const name = 'Backlog Regression End Date Predictor';
const expectedDateFormat = 'MMM DD, YYYY';

describe('Rag Status Indicators - Backlog Regression End Date Predictor', () => {
  it('returns red when the projected end date is after the project end date', () => {
    const startDate = moment().utc().subtract(10, 'weeks').format(constants.DBDATEFORMAT);
    const endDate = moment().utc().add(5, 'weeks');
    const target = moment().utc().add(15, 'weeks').format(expectedDateFormat);
    const entryData = [
      { weeksAgo: 5, count: 100 },
      { weeksAgo: 0, count: 75 },
    ];
    const result = backlogRegression.evaluate(createProjectWithDates(startDate, endDate.format(constants.DBDATEFORMAT)), getDemand(entryData));
    Should(result).match(CommonProjectStatusResult(name, target, endDate.format(expectedDateFormat), constants.STATUSERROR, constants.DEMANDSECTION));
  });

  it('returns amber when the projected end date is on the project end date', () => {
    const startDate = moment().utc().subtract(10, 'weeks').format(constants.DBDATEFORMAT);
    const endDate = moment().utc().add(5, 'weeks');
    const entryData = [
      { weeksAgo: 5, count: 100 },
      { weeksAgo: 0, count: 50 },
    ];
    const result = backlogRegression.evaluate(createProjectWithDates(startDate, endDate.format(constants.DBDATEFORMAT)), getDemand(entryData));
    Should(result).match(CommonProjectStatusResult(name, endDate.format(expectedDateFormat), endDate.format(expectedDateFormat), constants.STATUSWARNING, constants.DEMANDSECTION));
  });

  it('returns green when the projected end date is before the project end date', () => {
    const startDate = moment().utc().subtract(4, 'weeks').format(constants.DBDATEFORMAT);
    const endDate = moment().utc().add(1, 'weeks');
    const targetDate = moment().utc().subtract(1, 'weeks').format(expectedDateFormat);
    const entryData = [
      { weeksAgo: 4, count: 75 },
      { weeksAgo: 3, count: 50 },
    ];
    const result = backlogRegression.evaluate(createProjectWithDates(startDate, endDate.format(constants.DBDATEFORMAT)), getDemand(entryData));
    Should(result).match(CommonProjectStatusResult(name, targetDate, endDate.format(expectedDateFormat), constants.STATUSOK, constants.DEMANDSECTION));
  });
});

function getDemand(entryData) {
  return entryData.reduce((array, entry) => {
    const status = distributeIncompleteTasks(entry.count);
    status.Done = getRandomInt(10, 20);
    const projectDate = moment().utc().subtract(entry.weeksAgo, 'weeks').format(constants.DBDATEFORMAT);
    array.push({
      projectDate,
      status,
    });
    return array;
  }, []);
}

function createProjectWithDates(startDate, endDate) {
  return {
    name: 'testProject',
    startDate,
    endDate,
  };
}

function distributeIncompleteTasks(count) {
  const possibleStatuses = ['Backlog', 'Selected for development', 'Ready for Demo', 'In Progress'];
  const starter = possibleStatuses.reduce((object, key) => {
    object[key] = 0;
    return object;
  }, {});

  return R.range(0, count)
  .reduce((object) => {
    const index = getRandomInt(0, possibleStatuses.length - 1);
    object[possibleStatuses[index]]++;
    return object;
  }, starter);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}