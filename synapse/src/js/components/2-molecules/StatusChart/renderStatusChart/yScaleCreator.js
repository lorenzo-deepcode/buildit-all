// ===== Y SCALE CREATOR ===== //
// Given a set of values (of type number) and a pixel width (of type number),
// returns a scaling function that maps from a value to a y pixel position.

const d3 = require('d3');

// TODO: Pull this constant up to a higher place, probs. Maybe a chart config file?
const CHART_HEIGHT = 300;
const DEFAULT_VALUE_RANGE = [0, 100];

const yScaleCreator = (yOffset, values) => {
  if (values.length > 1) {
    return d3.scaleLinear()
      .domain([0, d3.max(values)])
      .range([yOffset + CHART_HEIGHT, yOffset]);
  }
  return d3.scaleLinear()
    .domain(DEFAULT_VALUE_RANGE)
    .range([CHART_HEIGHT, 0]);
};

export default yScaleCreator;
