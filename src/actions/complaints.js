/* eslint complexity: ["error", 5] */
import {
  API_PLACEHOLDER,
  MODE_LIST,
  MODE_MAP,
  MODE_TRENDS,
} from '../constants';

export const AGGREGATIONS_API_CALLED = 'aggregationsCallInProcess';
export const AGGREGATIONS_RECEIVED = 'processAggregationResults';
export const AGGREGATIONS_FAILED = 'processAggregationError';
export const COMPLAINTS_API_CALLED = 'COMPLAINTS_API_CALLED';
export const COMPLAINTS_RECEIVED = 'COMPLAINTS_RECEIVED';
export const COMPLAINTS_FAILED = 'COMPLAINTS_FAILED';
export const COMPLAINT_DETAIL_RECEIVED = 'complaintsDetailReceived';
export const COMPLAINT_DETAIL_FAILED = 'complaintsDetailFailed';
export const COMPLAINT_DETAIL_CALLED = 'complaintsDetailCalled';
export const STATES_API_CALLED = 'STATES_API_CALLED';
export const STATES_RECEIVED = 'STATES_RECEIVED';
export const STATES_FAILED = 'STATES_FAILED';
export const TRENDS_API_CALLED = 'trendsCallInProcess';
export const TRENDS_RECEIVED = 'processTrends';
export const TRENDS_FAILED = 'processTrendsError';

// ----------------------------------------------------------------------------
// Routing action
/**
 * Routes to the correct endpoint based on the state
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function sendQuery() {
  // eslint-disable-next-line complexity
  return (dispatch, getState) => {
    const state = getState();
    const viewMode = state.query.tab;
    switch (viewMode) {
      case MODE_MAP:
      case MODE_LIST:
      case MODE_TRENDS:
        dispatch(getAggregations());
        break;
      default:
        return;
    }

    // Send the right-hand queries
    dispatch(sendHitsQuery());
  };
}

/**
 * Routes to the correct endpoint based on the state
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function sendHitsQuery() {
  // eslint-disable-next-line complexity
  return (dispatch, getState) => {
    const state = getState();
    const viewMode = state.query.tab;
    switch (viewMode) {
      case MODE_MAP:
        dispatch(getStates());
        break;
      case MODE_TRENDS:
        dispatch(getTrends());
        break;
      case MODE_LIST:
        dispatch(getComplaints());
        break;
      default:
        break;
    }
  };
}

// ----------------------------------------------------------------------------
// Action Creators

/**
 * Calls the aggregations endpoint of the API
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getAggregations() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = store.query.queryString;
    const uri = API_PLACEHOLDER + qs + '&size=0';

    // This call is already in process
    if (store.results.loadingAggregations) {
      return null;
    }

    dispatch(callingApi(AGGREGATIONS_API_CALLED, uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(aggregationsReceived(items)))
      .catch((error) => dispatch(aggregationsFailed(error)));
  };
}

/**
 * Calls the complaint search endpoint of the API
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getComplaints() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = store.query.queryString;
    const uri = API_PLACEHOLDER + qs;

    // This call is already in process
    if (uri === store.results.activeCall) {
      return null;
    }

    dispatch(callingApi(COMPLAINTS_API_CALLED, uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(complaintsReceived(items)))
      .catch((error) => dispatch(complaintsFailed(error)));
  };
}

/**
 * Calls the detail endpoint of the API
 * @param {string} id - the id of the complaint to retrieve
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getComplaintDetail(id) {
  return (dispatch) => {
    const uri = API_PLACEHOLDER + id;
    dispatch(callingApi(COMPLAINT_DETAIL_CALLED, uri));
    fetch(uri)
      .then((result) => result.json())
      .then((data) => dispatch(complaintDetailReceived(data)))
      .catch((error) => dispatch(complaintDetailFailed(error)));
  };
}

/**
 * Calls the states endpoint of the API
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getStates() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = 'geo/states/' + store.query.queryString;
    const uri = API_PLACEHOLDER + qs + '&no_aggs=true';

    // This call is already in process
    if (uri === store.map.activeCall) {
      return null;
    }

    dispatch(callingApi(STATES_API_CALLED, uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(statesReceived(items)))
      .catch((error) => dispatch(statesFailed(error)));
  };
}

/**
 * Calls the trends endpoint of the API
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getTrends() {
  return (dispatch, getState) => {
    const store = getState();
    const { query, trends } = store;
    const qs = 'trends/' + query.queryString;
    const uri = API_PLACEHOLDER + qs + '&no_aggs=true';

    // This call is already in process
    if (uri === trends.activeCall) {
      return null;
    }

    // kill query if Company param criteria aren't met
    if (
      trends.lens === 'Company' &&
      (!query.company || !query.company.length)
    ) {
      return null;
    }

    dispatch(callingApi(TRENDS_API_CALLED, uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(trendsReceived(items)))
      .catch((error) => dispatch(trendsFailed(error)));
  };
}

/**
 * Notifies the application that an API call is happening
 * @param {string} type - action type
 * @param {string} url - the url being called
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function callingApi(type, url) {
  return {
    type,
    url,
  };
}

/**
 * Creates an action in response to aggregations being received from the API
 * @param {string} data - the raw data returned from the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function aggregationsReceived(data) {
  return {
    type: AGGREGATIONS_RECEIVED,
    data,
  };
}

/**
 * Creates an action in response after aggregation search fails
 * @param {string} error - the error returned from `fetch`, not the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function aggregationsFailed(error) {
  return {
    type: AGGREGATIONS_FAILED,
    error,
  };
}

/**
 * Creates an action in response to search results being received from the API
 * @param {string} data - the raw data returned from the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function complaintsReceived(data) {
  return {
    type: COMPLAINTS_RECEIVED,
    data,
  };
}

/**
 * Creates an action in response after a search fails
 * @param {string} error - the error returned from `fetch`, not the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function complaintsFailed(error) {
  return {
    type: COMPLAINTS_FAILED,
    error,
  };
}

/**
 * Creates an action in response to complaint detail being received from the API
 * @param {string} data - the raw data returned from the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function complaintDetailReceived(data) {
  return {
    type: COMPLAINT_DETAIL_RECEIVED,
    data,
  };
}

/**
 * Creates an action in response after a detail search fails
 * @param {string} error - the error returned from `fetch`, not the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function complaintDetailFailed(error) {
  return {
    type: COMPLAINT_DETAIL_FAILED,
    error,
  };
}

/**
 * Creates an action in response to states results being received from the API
 * @param {string} data - the raw data returned from the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function statesReceived(data) {
  return {
    type: STATES_RECEIVED,
    data,
  };
}

/**
 * Creates an action in response after states results fails
 * @param {string} error - the error returned from `fetch`, not the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function statesFailed(error) {
  return {
    type: STATES_FAILED,
    error,
  };
}

/**
 * Creates an action in response to trends results being received from the API
 * @param {string} data - the raw data returned from the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendsReceived(data) {
  return {
    type: TRENDS_RECEIVED,
    data,
  };
}

/**
 * Creates an action in response after trends results fails
 * @param {string} error - the error returned from `fetch`, not the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendsFailed(error) {
  return {
    type: TRENDS_FAILED,
    error,
  };
}
