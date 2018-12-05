const d3 = require('d3');
import lineGenerator from './lineGenerator';
import makePoints from 'helpers/makePoints';
import moment from 'moment';

module.exports = ({ data, dateScale, xOffset, yScale }) => {
  // TODO: pull this point generation stuff into a separate function
  const startDate = moment(data.startDate, 'YYYY MM DD').format('DD-MMM-YY');
  const points = makePoints(data, startDate);
  const line = lineGenerator(dateScale, yScale);

  d3.select('#demandChart')
    .append('path')
    .attr('class', 'projection-line')
    .attr('id', 'projectionLine')
    .datum(points)
    .attr('d', line)
    .attr('transform', `translate(${xOffset}, 0)`);
};
