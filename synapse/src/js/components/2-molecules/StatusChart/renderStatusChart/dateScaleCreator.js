// ===== DATE SCALE CREATOR ===== //
// Given an array of dates and a pixel width,
// returns a scaling function that maps from a date to an integer.
// The date needs to be parsed before it is passed.
// Example: dateScale(parseTime('01-Jan-16'))

// If no params are passed, it uses the default values
// listed here to create the scaling function.
// Expects dates in this form: '01-Jan-96' (The format is determined by parseTime.)


const d3 = require('d3');
import parseTime from './parseTime';

const DEFAULT_DATE_RANGE = [parseTime('01-Jan-96'), parseTime('01-Jan-97')];
const DEFAULT_WIDTH = 1200;

const dateScaleCreator = (dates, width) => {
  if (dates && width) {
    const parsedDates = dates.map(date => parseTime(date));
    return d3.scaleTime()
      .domain(d3.extent(parsedDates))
      .range([0, width]);
  }
  return d3.scaleTime()
    .domain(DEFAULT_DATE_RANGE)
    .range([0, DEFAULT_WIDTH]);
};


export default dateScaleCreator;
