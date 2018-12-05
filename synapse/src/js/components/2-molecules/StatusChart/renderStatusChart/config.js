const bodyWidth = document.body.clientWidth;
const smallScreenMode = bodyWidth < 800;

export const CHART_OFFSET_LEFT = smallScreenMode ? 10 : 250;
export const WIDTH = smallScreenMode ? 450 : 800;

export const PADDING = { top: 50, right: 200, bottom: 0, left: 55 };
export const HEIGHT = 1200;
export const INDIVIDUAL_CHART_HEIGHT = 300;
export const SPACE_BETWEEN_CHARTS = 100;

export const DEMAND_Y_LABEL = 'Stories';
export const DEFECT_Y_LABEL = 'Count';
export const EFFORT_Y_LABEL = 'Person/Days';
export const DATE_LABEL = 'Date';

export const DATE_AXIS_ID = 'axis--date';
export const Y_AXIS_ID = 'axis--y';

export const FORECAST_UPPER_BOUND = '01-01-2050';
