import _ from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';
import { fetchUsingMock } from '../api';

const LIMIT = 5;

export const TOGGLE = 'TOGGLE';
export const FETCH = 'FETCH';
export const SUCCESS = 'SUCCESS';
export const FAILED = 'FAILED';

export const initialState = {
  dates: []
, forecasts: []
, fetching: false
, error: false
, city: null
};

export const mapForecast = (forecast, index) => {
  return { 
    key: index
  , date: moment.unix(forecast.dt).utc().toDate()
  , description: forecast.weather[0].main
  , maximumTemperature: Math.floor(forecast.main.temp_max)
  , minimumTemperature: Math.floor(forecast.main.temp_min)
  , windSpeed: Math.floor(forecast.wind.speed)
  , windDirection: Math.floor(forecast.wind.deg)
  , rainfall: Math.ceil((forecast.rain && forecast.rain['3h']) || 0)
  , pressure: Math.floor(forecast.main.pressure)
  };
};

export const getDates = (forecasts) => {
  return _
  .chain(forecasts)
  .uniqBy(forecast => moment.unix(forecast.dt).day())
  .map(forecast => ({ date: moment.unix(forecast.dt), active: false }))
  .take(LIMIT)
  .value();
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE: 
    const dates = state.dates.map(date => {
      date.active = !date.active && moment(date.date).isSame(action.payload.date, 'day');
      return date;
    });

    return _.assign({}, state, { dates });

    case FETCH:
      return _.assign({}, state, { fetching: true, error: false, city: action.payload.city });

    case SUCCESS: 
      return _.assign({}, state, { fetching: false
                                 , error: false
                                 , dates: getDates(action.payload.forecasts)
                                 , forecasts: action.payload.forecasts.map(mapForecast) });

    case FAILED: 
      return _.assign({}, state, { fetching: false, error: true });

    default:
    return state;
  }
};

const selectedDateSelector = (state, props) => props.date.date;
const datesSelector = (state, props) => state.forecast.dates;
const forecastsSelector = (state, props) => state.forecast.forecasts;

export const detailSelector = createSelector(
  [ selectedDateSelector, forecastsSelector ], (selectedDate, forecasts) => {
  return _.filter(forecasts, forecast => {
    return moment(forecast.date).isSame(selectedDate, 'day');
  });
});

export const summarySelector = createSelector(
  [ selectedDateSelector, detailSelector, forecastsSelector ], (selectedDate, details, forecasts) => {

  if (forecasts.length === 0) return;

  const detail = _.first(details);

  if (detail == null) return;

  return { 
    date: selectedDate
  , description: detail.description
  , maximumTemperature: _.map(details, 'maximumTemperature').reduce((curr, prev) => Math.max(curr, prev))
  , minimumTemperature: _.map(details, 'minimumTemperature').reduce((curr, prev) => Math.min(curr, prev))
  , windSpeed: detail.windSpeed
  , windDirection: detail.windDirection
  , rainfall: _.map(details, 'rainfall').reduce((curr, prev) => curr + prev)
  , pressure: detail.pressure
  };
});

export const dateSelector = createSelector(
  [ selectedDateSelector, datesSelector ], (selectedDate, dates) => {
  return _.find(dates, date => {
    return moment(date.date).isSame(selectedDate, 'day');
  });
});

export const toggle = date => {
  return { type: TOGGLE, payload: { date }};
};

export const fetch = city => {
  return dispatch => {
    dispatch({ type: FETCH, payload: { city }});

    return fetchUsingMock(city)
    .then(response => {
      if (response == null || response.data == null || response.data.list == null) return dispatch({ type: FAILED });

      dispatch({ type: SUCCESS, payload: { forecasts: response.data.list }});
    })
    .catch(error => {
      dispatch({ type: FAILED });
    });
  };
};

