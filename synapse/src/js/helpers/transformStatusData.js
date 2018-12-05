import moment from 'moment';

module.exports = ((data, key) => (
  data.map(dataPoint => {
    // dataPoint.projectDate is in YYYY/mm/dd format, and we're getting a deprecation warning.
    const processedDate = moment(dataPoint.projectDate.replace(new RegExp('/', 'g'), '-'));
    const date = [
      processedDate.format('DD'),
      processedDate.format('MMM'),
      processedDate.format('YY'),
    ].join('-');

    const transformedDataPoint = {
      date,
    };

    const categories = Object.keys(dataPoint[key]);

    categories.forEach(category => {
      transformedDataPoint[category] = dataPoint[key][category];
    });

    return transformedDataPoint;
  })
));
