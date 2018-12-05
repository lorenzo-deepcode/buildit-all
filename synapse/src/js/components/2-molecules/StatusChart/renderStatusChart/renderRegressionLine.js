import _ from 'underscore';
const d3 = require('d3');
import moment from 'moment';
import findStatusDateRange from 'helpers/findStatusDateRange';
import lineGenerator from './lineGenerator';
import convertStatusDataToUnixTime from 'helpers/convertStatusDataToUnixTime';
import { linearRegression } from 'simple-statistics';

const formula = (statusData) => {
  if (statusData) {
    const statusDataUnixTime = convertStatusDataToUnixTime(statusData);
    return linearRegression(statusDataUnixTime);
  }
  return undefined;
};

const y = (f, date) => {
  const x = date.unix();
  return f.m * x + f.b;
};

const getDataInRange = ({ statusData, startDate, endDate }) => statusData.filter(datapoint => {
  const parsedDatapointDate = moment(datapoint.date, 'DD-MMM-YY');
  return parsedDatapointDate.isSameOrAfter(startDate) &&
    parsedDatapointDate.isBefore(endDate);
});

const getDataInCategories = (statusData, categories) => statusData.map(datapoint => {
  const result = { date: datapoint.date };
  const intersection = _.intersection(categories, Object.keys(datapoint));
  let sum = 0;
  intersection.forEach(category => { sum += datapoint[category]; });
  result.value = sum;
  return result;
});

const getForecastedEndDate = notDoneFormula => {
  // Given y = mx + b, solve for x when y = 0
  const endDateUnixTime = - notDoneFormula.b / notDoneFormula.m;
  // Multiplying by 1000 because endDateUnixtime is in seconds
  return moment.utc(endDateUnixTime * 1000);
};

module.exports = ({ statusData, dateScale, xOffset, yScale, done, notDone }) => {
  const dateRange = findStatusDateRange(statusData, done);
  const doneStartDate = moment(dateRange[0], 'DD-MMM-YY');
  const doneEndDate = moment(dateRange[1], 'DD-MMM-YY');

  const trimmedData = getDataInRange({
    statusData,
    startDate: doneStartDate,
    endDate: doneEndDate,
  });

  const doneData = getDataInCategories(trimmedData, [done]);
  const notDoneData = getDataInCategories(trimmedData, notDone);
  const doneFormula = formula(doneData);
  const notDoneFormula = formula(notDoneData);

  const forecastEndDate = getForecastedEndDate(notDoneFormula);

  const doneDate0 = doneStartDate;
  const doneDate1 = forecastEndDate.isBefore(doneEndDate) ?
    doneEndDate : forecastEndDate;
  const doneY0 = y(doneFormula, doneDate0);
  const doneY1 = y(doneFormula, doneDate1);
  const donePoints = [
    { date: doneDate0.format('DD-MMM-YY'), y: doneY0 },
    { date: doneDate1.format('DD-MMM-YY'), y: doneY1 },
  ];

  const notDoneDate0 = doneStartDate;
  const notDoneDate1 = forecastEndDate.isBefore(doneEndDate) ?
    doneEndDate : forecastEndDate;
  const notDoneY0 = y(notDoneFormula, notDoneDate0);
  const notDoneY1 = y(notDoneFormula, notDoneDate1);
  const notDonePoints = [
    { date: notDoneDate0.format('DD-MMM-YY'), y: doneY0 + notDoneY0 },
    { date: notDoneDate1.format('DD-MMM-YY'), y: doneY1 + notDoneY1 },
  ];

  const line = lineGenerator(dateScale, yScale);
  d3.select('#demandChart')
    .append('path')
    .attr('class', 'regression-line done')
    .datum(donePoints)
    .attr('d', line)
    .attr('transform', `translate(${xOffset}, 0)`);

  d3.select('#demandChart')
    .append('path')
    .attr('class', 'regression-line backlog')
    .datum(notDonePoints)
    .attr('d', line)
    .attr('transform', `translate(${xOffset}, 0)`);
  if (forecastEndDate.isAfter(doneStartDate)) {
    return forecastEndDate;
  }
  return undefined;
};
