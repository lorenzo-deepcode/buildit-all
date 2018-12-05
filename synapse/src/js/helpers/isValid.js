const moment = require('moment');

const acceptedDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];

const isDateProperlyFormatted = date => {
  if (!date) { return false; }
  if (!moment(date, acceptedDateFormats, true).isValid()) { return false; }
  return true;
};

const areAllDatesProperlyFormatted = data => {
  const length = data.length;
  for (let i = 0; i < length; i++) {
    if (!isDateProperlyFormatted(data[i].projectDate)) { return false; }
  }
  return true;
};

const datapointHasCorrectKeys = (dataPoint, type) => {
  const keys = Object.keys(dataPoint);
  if (type === 'demand-status-data') { return keys.indexOf('status') > 0; }
  if (type === 'defect-status-data') { return keys.indexOf('severity') > 0; }
  if (type === 'effort-status-data') { return keys.indexOf('activity') > 0; }
  return true;
};

const datapointsHaveCorrectKeys = (data, type) => {
  const length = data.length;
  for (let i = 0; i < length; i++) {
    if (!datapointHasCorrectKeys(data[i], type)) { return false; }
  }
  return true;
};

module.exports = (data, type) => {
  if (!areAllDatesProperlyFormatted(data)) { return false; }

  if (!datapointsHaveCorrectKeys(data, type)) { return false; }

  return true;
};
