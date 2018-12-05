import moment from 'moment';
import makePoints from 'helpers/makePoints';

const getDates = datapoint => moment(datapoint.date, 'DD-MMM-YY');

const normalizeProjection = (projection) => {
  const normalizedProjection = projection;
  const startDate = moment(projection.startDate, 'YYYY MM DD').format('DD-MMM-YY');
  const points = makePoints(projection, startDate);
  const dates = points.map(getDates);
  const endDate = moment.max(dates).format('YYYY-MM-DD');

  normalizedProjection.endDate = endDate;
  normalizedProjection.points = points;

  return normalizedProjection;
};

export default normalizeProjection;
