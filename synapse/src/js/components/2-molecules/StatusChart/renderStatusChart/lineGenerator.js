const d3 = require('d3');
const parseTime = d3.timeParse('%d-%b-%y');

module.exports = (dateScale, yScale) => (
  d3.line()
    .x(d => dateScale(parseTime(d.date)))
    .y(d => yScale(d.y))
);
