import {
  FETCH_EVENT_HISTORY_SUCCESS,
} from 'actions/actions';

export const fetchEventHistorySuccess = events => ({
  type: FETCH_EVENT_HISTORY_SUCCESS,
  events,
});
