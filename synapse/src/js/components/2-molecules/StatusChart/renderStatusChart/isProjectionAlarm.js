/* Projection alarm indicator
 * Given a set of status data and a projection object,
 * returns true if the projection end date is greater than the status data's end date,
 * false if otherwise.
 */
import moment from 'moment';

const getDates = datapoint => moment(datapoint.date, 'DD-MMM-YY');

module.exports = (data, projection) => {
  const statusDates = data.map(getDates);
  return moment.max(statusDates).isAfter(projection.endDate);
};
