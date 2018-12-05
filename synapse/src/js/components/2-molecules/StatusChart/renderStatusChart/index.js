const showRegressionCurve = true; // Allows us to show the curve when debugging.

const moment = require('moment');
const d3 = require('d3');
const getY = require('./getY');
const getDataSetValue = require('./getDataSetValue');
const renderProjectionDot = require('./renderProjectionDot');
const getProjectionY = require('./getProjectionY');
const setChart = require('./setChart');
const renderLegend = require('./renderLegend');
const initializeScrubber = require('./initializeScrubber');
const moveScrubber = require('./moveScrubber');
const updateScrubberText = require('./updateScrubberText');
const updateValues = require('./updateValues');
const renderDateAxis = require('./renderDateAxis');
const renderYAxis = require('./renderYAxis');
const renderYAxisLabel = require('./renderYAxisLabel');
const renderStackedAreaChart = require('./renderStackedAreaChart');
const renderProjection = require('./renderProjection');
const renderProjectionAlarm = require('./renderProjectionAlarm');
const getIsProjectionVisible = require('./getIsProjectionVisible');
import dateScaleCreator from './dateScaleCreator';
import yScaleCreator from './yScaleCreator';
import getChartableDates from './getChartableDates';
import getChartableValues from './getChartableValues';
import getChartableDemandValues from './getChartableDemandValues';
import isProjectionAlarm from './isProjectionAlarm';
import findStatusChartOffset from 'helpers/findStatusChartOffset';
import renderRegressionLine from './renderRegressionLine';
import renderForecastedCompletionDate from './renderForecastedCompletionDate';

import {
  PADDING,
  WIDTH,
  HEIGHT,
  CHART_OFFSET_LEFT,
  SPACE_BETWEEN_CHARTS,
  DEMAND_Y_LABEL,
  DEFECT_Y_LABEL,
  EFFORT_Y_LABEL,
  Y_AXIS_ID,
  DATE_AXIS_ID,
  INDIVIDUAL_CHART_HEIGHT,
} from './config';

const isDataChartable = data => data.length > 0;

module.exports = (props, containerElement) => {
  const {
    demandStatus,
    defectStatus,
    effortStatus,
    projection,
    demandCategories,
    defectCategories,
    effortCategories,
   } = props;
  const isProjectionVisible = getIsProjectionVisible(projection);
  const done = demandCategories[demandCategories.length - 1];
  const notDone = demandCategories.filter((category, index, array) => (
    index < array.length - 1
  ));

  const chartOffsets = findStatusChartOffset([
    demandStatus, defectStatus, effortStatus,
  ], INDIVIDUAL_CHART_HEIGHT + SPACE_BETWEEN_CHARTS);
  const DEMAND_Y_OFFSET = chartOffsets[0];
  const DEFECT_Y_OFFSET = chartOffsets[1];
  const EFFORT_Y_OFFSET = chartOffsets[2];

  const chartContainer = setChart(containerElement, WIDTH, HEIGHT, PADDING);

  let demandChart;
  let defectChart;
  let effortChart;
  let demandValues;
  let defectValues;
  let effortValues;
  let demandYScale;
  let defectYScale;
  let effortYScale;
  let chartableDates;
  let dateScale;
  let scrubber;

  const prepareYScales = () => {
    demandValues = getChartableDemandValues(
      demandStatus,
      demandCategories,
      projection,
      isProjectionVisible
    );
    defectValues = getChartableValues(defectStatus, defectCategories);
    effortValues = getChartableValues(effortStatus, effortCategories);

    demandYScale = yScaleCreator(DEMAND_Y_OFFSET, demandValues);
    defectYScale = yScaleCreator(DEFECT_Y_OFFSET, defectValues);
    effortYScale = yScaleCreator(EFFORT_Y_OFFSET, effortValues);
  };

  const prepareDateScale = () => {
    chartableDates = getChartableDates(
      demandStatus,
      defectStatus,
      effortStatus,
      projection,
      WIDTH,
      isProjectionVisible
    );
    dateScale = dateScaleCreator(chartableDates, WIDTH);
  };

  const render = () => {
    if (isDataChartable(demandStatus)) {
      demandChart = renderStackedAreaChart(
        chartContainer,
        demandStatus,
        demandCategories,
        demandYScale,
        dateScale,
        CHART_OFFSET_LEFT,
        'demandChart'
      );
      renderLegend(
        demandChart,
        demandStatus,
        demandCategories,
        demandYScale,
        INDIVIDUAL_CHART_HEIGHT
      );
      renderYAxis(demandChart, `${Y_AXIS_ID}-demand`, demandYScale, CHART_OFFSET_LEFT);
      renderYAxisLabel(demandChart, DEMAND_Y_LABEL, CHART_OFFSET_LEFT, DEMAND_Y_OFFSET);
      renderDateAxis(
        demandChart,
        `${DATE_AXIS_ID}-demand`,
        dateScale,
        CHART_OFFSET_LEFT,
        DEMAND_Y_OFFSET,
        INDIVIDUAL_CHART_HEIGHT);

      if (showRegressionCurve) {
        const forecastedCompletionDate = renderRegressionLine({
          done,
          notDone,
          statusData: demandStatus,
          dateScale,
          xOffset: CHART_OFFSET_LEFT,
          yScale: demandYScale,
        });
        if (demandChart) {
          renderForecastedCompletionDate(
            demandChart, forecastedCompletionDate, WIDTH, DEMAND_Y_OFFSET);
        }
      }
    }
    if (isDataChartable(defectStatus)) {
      defectChart = renderStackedAreaChart(
        chartContainer,
        defectStatus,
        defectCategories,
        defectYScale,
        dateScale,
        CHART_OFFSET_LEFT,
        'defectChart'
      );
      renderLegend(
        defectChart,
        defectStatus,
        defectCategories,
        defectYScale,
        INDIVIDUAL_CHART_HEIGHT
      );
      renderYAxis(defectChart, `${Y_AXIS_ID}-defect`, defectYScale, CHART_OFFSET_LEFT);
      renderYAxisLabel(defectChart, DEFECT_Y_LABEL, CHART_OFFSET_LEFT, DEFECT_Y_OFFSET);
      renderDateAxis(
        defectChart,
        `${DATE_AXIS_ID}-defect`,
        dateScale,
        CHART_OFFSET_LEFT,
        DEFECT_Y_OFFSET,
        INDIVIDUAL_CHART_HEIGHT);
    }
    if (isDataChartable(effortStatus)) {
      effortChart = renderStackedAreaChart(
        chartContainer,
        effortStatus,
        effortCategories,
        effortYScale,
        dateScale,
        CHART_OFFSET_LEFT,
        'effortChart'
      );
      renderLegend(
        effortChart,
        effortStatus,
        effortCategories,
        effortYScale,
        INDIVIDUAL_CHART_HEIGHT
      );
      renderYAxis(effortChart, `${Y_AXIS_ID}-effort`, effortYScale, CHART_OFFSET_LEFT);
      renderYAxisLabel(effortChart, EFFORT_Y_LABEL, CHART_OFFSET_LEFT, EFFORT_Y_OFFSET);
      renderDateAxis(
        effortChart,
        `${DATE_AXIS_ID}-effort`,
        dateScale,
        CHART_OFFSET_LEFT,
        EFFORT_Y_OFFSET,
        INDIVIDUAL_CHART_HEIGHT);
    }
    if (isProjectionVisible) {
      renderProjection({
        data: projection,
        yScale: demandYScale,
        xOffset: CHART_OFFSET_LEFT,
        dateScale,
      });
      if (isProjectionAlarm(demandStatus, projection)) {
        renderProjectionAlarm(demandChart, WIDTH, DEMAND_Y_OFFSET);
      }
      demandStatus.forEach(datapoint => {
        const date = datapoint ? datapoint.date : '11-Jul-16';
        const doneValue = getY(date, demandStatus, 'Done', demandYScale);
        const projectionValue = getProjectionY(date, projection, dateScale, demandYScale);
        if (projectionValue && projectionValue < doneValue) {
          renderProjectionDot(
            demandChart, datapoint.date, projection, dateScale, demandYScale, CHART_OFFSET_LEFT);
        }
      });
    }
    scrubber = initializeScrubber(chartContainer, CHART_OFFSET_LEFT);
  };

  prepareDateScale();
  prepareYScales();
  render();

  /** EVENT LISTENERS **/

  // Scrubber line
  const isXInBounds = x => x >= CHART_OFFSET_LEFT && x <= WIDTH + PADDING.right + PADDING.left;

  chartContainer.on('mousemove', function handleMouseMove() {
    const x = d3.mouse(this)[0];
    const date = dateScale.invert(x - CHART_OFFSET_LEFT);
    const formattedDate = moment(date).format('DD-MMM-YY');
    if (isXInBounds(x)) {
      moveScrubber(scrubber, x);
      updateScrubberText(date);
      demandCategories.forEach(category => {
        const value = getDataSetValue(formattedDate, demandStatus, category);
        const categoryIdentifier = category.split(' ').join('-');
        const identifier = `demandChart-${categoryIdentifier}`;
        updateValues(`${identifier}`, value);
      });
      defectCategories.forEach(category => {
        const value = getDataSetValue(formattedDate, defectStatus, category);
        const categoryIdentifier = category.split(' ').join('-');
        const identifier = `defectChart-${categoryIdentifier}`;
        updateValues(`${identifier}`, value);
      });
      effortCategories.forEach(category => {
        const value = getDataSetValue(formattedDate, effortStatus, category);
        const categoryIdentifier = category.split(' ').join('-');
        const identifier = `effortChart-${categoryIdentifier}`;
        updateValues(`${identifier}`, value);
      });
    }
  });
};
