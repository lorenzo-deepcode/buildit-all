const moment = require('moment');
const makePoints = require('helpers/makePoints');

module.exports = (
  demandStatus,
  defectStatus,
  effortStatus,
  projection,
  width,
  isProjectionVisible
) => {
  const demandDates = demandStatus.map(datapoint => datapoint.date);
  const defectDates = defectStatus.map(datapoint => datapoint.date);
  const effortDates = effortStatus.map(datapoint => datapoint.date);

  const projectionStartDate =
    moment(projection.startDate, 'YYYY MM DD').format('DD-MMM-YY');
  const projectionPoints = makePoints(projection, projectionStartDate);
  const projectionDates = projectionPoints.map(datapoint => datapoint.date);

  if (isProjectionVisible) {
    return [].concat(demandDates, defectDates, effortDates, projectionDates);
  }
  return [].concat(demandDates, defectDates, effortDates);
};
