const d3 = require('d3');
const renderDot = require('./renderDot');
const getProjectionY = require('./getProjectionY');
const parseTime = d3.timeParse('%d-%b-%y');

const convertDateToXPixelValue = (date, dateScale) => dateScale(parseTime(date));

module.exports = (containerElement, date, projection, dateScale, yScale, xOffset) => {
  const x = convertDateToXPixelValue(date, dateScale);
  const y = getProjectionY(date, projection, dateScale, yScale);
  renderDot(containerElement, x + xOffset, y, 'projection-alarm-dot');
};
