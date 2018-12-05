const findDateRangeInDays = require('./findDateRangeInDays');

module.exports = (dataSeries) => {
  const result = [];
  for (let index = 0; index < dataSeries.length; index++) {
    const dataPoint = dataSeries[index];
    const dateOfCurrentPoint = dataPoint[0];
    const nextPoint = dataSeries[index + 1];
    if (nextPoint) {
      const dateOfNextPoint = nextPoint[0];
      const timeRangeBetweenPoints = findDateRangeInDays(dateOfNextPoint, dateOfCurrentPoint);
      if (timeRangeBetweenPoints > 1) {
        result.push(index);
      }
    }
  }
  return result;
};
