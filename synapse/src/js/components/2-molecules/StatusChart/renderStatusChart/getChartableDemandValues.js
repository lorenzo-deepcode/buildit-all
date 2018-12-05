// TODO: Move the projection points generation to separate file, which would allow this
// to be more generic. i.e. Could use getChartableValues for all three charts.

const moment = require('moment');
const sumValuesInObject = require('sum-values-in-object');
const makePoints = require('helpers/makePoints');

module.exports = (data, demandCategories, projection, isProjectionVisible) => {
  const dataValues = data.map(datapoint => sumValuesInObject(datapoint, demandCategories));

  if (isProjectionVisible) {
    const projectionStartDate =
      moment(projection.startDate, 'YYYY MM DD').format('DD-MMM-YY');
    const projectionPoints = makePoints(projection, projectionStartDate);
    const projectionValues = projectionPoints.map(datapoint => datapoint.y);

    return [].concat(dataValues, projectionValues);
  }

  return dataValues;
};
