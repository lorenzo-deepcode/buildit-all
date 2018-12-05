import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import forecast from './ducks/forecast';

export default combineReducers({
  form
, forecast
});