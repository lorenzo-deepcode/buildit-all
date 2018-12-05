import {
  FETCH_PROJECT_RAGSTATUS_DATA,
  FETCH_RAGSTATUS_SUCCESS,
} from 'actions/actions';

export const fetchRagStatusSuccess = statuses => ({
  type: FETCH_RAGSTATUS_SUCCESS,
  statuses,
});

export const fetchRagStatusData = name => ({
  type: FETCH_PROJECT_RAGSTATUS_DATA,
  name,
});
