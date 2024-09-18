/* eslint complexity: ["error", 5] */
import { API_PLACEHOLDER } from '../constants';
import {
  complaintDetailCalled,
  complaintDetailReceived,
  complaintDetailFailed,
} from '../reducers/detail/detailSlice';
import {
  trendsReceived,
  trendsApiFailed,
  trendsApiCalled,
} from '../reducers/trends/trendsSlice';
import {
  statesApiCalled,
  statesApiFailed,
  statesReceived,
} from '../reducers/map/mapSlice';
import {
  aggregationsApiCalled,
  aggregationsApiFailed,
  aggregationsReceived,
} from '../reducers/aggs/aggsSlice';
import {
  complaintsApiCalled,
  complaintsApiFailed,
  complaintsReceived,
} from '../reducers/results/resultsSlice';
import { buildAggregationUri, buildUri } from '../api/url/url';
import { httpGet } from './httpRequests/httpRequests';

// ----------------------------------------------------------------------------
// Action Creators

/**
 * Calls the aggregations endpoint of the API
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getAggregations() {
  return (dispatch, getState) => {
    const store = getState();

    const qs = buildAggregationUri(store);
    const uri = API_PLACEHOLDER + qs;

    // This call is already in process
    if (store.aggs.activeCall) {
      return null;
    }

    dispatch(aggregationsApiCalled(uri));
    dispatch(httpGet(uri, aggregationsReceived, aggregationsApiFailed));
  };
}

/**
 * Calls the complaint search endpoint of the API
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getComplaints() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = buildUri(store);
    const uri = API_PLACEHOLDER + qs;
    // This call is already in process
    if (uri === store.results.activeCall) {
      return null;
    }

    dispatch(complaintsApiCalled(uri));
    dispatch(httpGet(uri, complaintsReceived, complaintsApiFailed));
  };
}

/**
 * Calls the detail endpoint of the API
 *
 * @param {string} id - the id of the complaint to retrieve
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getComplaintDetail(id) {
  return (dispatch, getState) => {
    const store = getState();
    const uri = API_PLACEHOLDER + id;

    if (uri === store.detail.activeCall) {
      return null;
    }

    dispatch(complaintDetailCalled(uri));
    dispatch(httpGet(uri, complaintDetailReceived, complaintDetailFailed));
  };
}

/**
 * Calls the states endpoint of the API
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getStates() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = 'geo/states/' + buildUri(store);
    const uri = API_PLACEHOLDER + qs + '&no_aggs=true';

    // This call is already in process
    if (uri === store.map.activeCall) {
      return null;
    }

    dispatch(statesApiCalled(uri));
    dispatch(httpGet(uri, statesReceived, statesApiFailed));
  };
}

/**
 * Calls the trends endpoint of the API
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getTrends() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = 'trends' + buildUri(store);
    const uri = API_PLACEHOLDER + qs + '&no_aggs=true';
    // This call is already in process
    if (uri === store.trends.activeCall) {
      return null;
    }

    // kill query if Company param criteria aren't met
    if (
      store.trends.lens === 'Company' &&
      (!store.filters.company || !store.filters.company.length)
    ) {
      return null;
    }

    dispatch(trendsApiCalled(uri));
    dispatch(httpGet(uri, trendsReceived, trendsApiFailed));
  };
}
