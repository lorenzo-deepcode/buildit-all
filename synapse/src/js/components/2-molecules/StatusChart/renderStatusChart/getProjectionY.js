/* getProjectionY
Takes a date and returns the y value at that point on the projection curve.
*/

const RAMP_UP_PERIOD = 'RAMP_UP_PERIOD';
const TARGET_PERIOD = 'TARGET_PERIOD';
const RAMP_DOWN_PERIOD = 'RAMP_DOWN_PERIOD';

const moment = require('moment');
const makePoints = require('helpers/makePoints');
const d3 = require('d3');
const parseTime = d3.timeParse('%d-%b-%y');

const convertDateToXPixelValue = (date, dateScale) => dateScale(parseTime(date));
const convertStoriesToYPixelValue = (y, yScale) => yScale(y);

/* getRegion
Takes a date and returns the "region" of the projection curve.
There are three regions in a projection curve:
  - Ramp up period
  - Target period
  - Ramp down period
If the date falls outside the projection, getRegion returns undefined.
*/
const getRegion = (date, projectionPoints) => {
  const parsedDate = moment(date, 'DD-MMM-YY');
  const projectionDates = projectionPoints.map(point => (
    moment(point.date, 'DD-MMM-YY')
  ));
  if (parsedDate.isAfter(projectionDates[0]) && parsedDate.isBefore(projectionDates[1])) {
    return RAMP_UP_PERIOD;
  }
  if (parsedDate.isAfter(projectionDates[1]) && parsedDate.isBefore(projectionDates[2])) {
    return TARGET_PERIOD;
  }
  if (parsedDate.isAfter(projectionDates[2]) && parsedDate.isBefore(projectionDates[3])) {
    return RAMP_DOWN_PERIOD;
  }
  return undefined;
};

module.exports = (targetDate, projection, dateScale, yScale) => {
  const projectionStartDate =
    moment(projection.startDate, 'YYYY MM DD').format('DD-MMM-YY');
  const projectionPoints = makePoints(projection, projectionStartDate);
  const region = getRegion(targetDate, projectionPoints);

  if (!region) return undefined;

  let p1;
  let p2;

  switch (region) {
  case RAMP_UP_PERIOD:
    p1 = projectionPoints[0];
    p2 = projectionPoints[1];
    break;
  case TARGET_PERIOD:
    p1 = projectionPoints[1];
    p2 = projectionPoints[2];
    break;
  case RAMP_DOWN_PERIOD:
    p1 = projectionPoints[2];
    p2 = projectionPoints[3];
    break;
  default: return undefined;
  }

  // Solving for y = mx + b
  const x1 = convertDateToXPixelValue(p1.date, dateScale);
  const x2 = convertDateToXPixelValue(p2.date, dateScale);
  const y1 = convertStoriesToYPixelValue(p1.y, yScale);
  const y2 = convertStoriesToYPixelValue(p2.y, yScale);
  const m = (y2 - y1) / (x2 - x1);
  const xTarget = convertDateToXPixelValue(targetDate, dateScale);
  const b = y1 - m * x1;
  const y = m * xTarget + b;

  return y;
};
