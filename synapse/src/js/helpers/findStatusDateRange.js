import moment from 'moment';

module.exports = (statusData, category) => {
  const datesInCategory = statusData.filter(datapoint => datapoint[category])
    .map(datapoint => moment(datapoint.date));
  const max = moment.max(datesInCategory);
  const tomorrow = moment.utc().add(1, 'days').hours(0).minutes(0).seconds(0); // eslint-disable-line
  const returnedMax = max.isAfter(tomorrow) ? tomorrow : max;
  return [
    moment.min(datesInCategory).format('DD-MMM-YY'),
    returnedMax.format('DD-MMM-YY'),
  ];
};
