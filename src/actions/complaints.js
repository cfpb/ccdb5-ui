/* eslint complexity: ["error", 5] */
import { API_PLACEHOLDER } from '../constants';
import {
  aggregationsApiCalled,
  aggregationsApiFailed,
  aggregationsReceived,
} from '../reducers/aggs/aggsSlice';

export const COMPLAINTS_API_CALLED = 'COMPLAINTS_API_CALLED';
export const COMPLAINTS_RECEIVED = 'COMPLAINTS_RECEIVED';
export const COMPLAINTS_FAILED = 'COMPLAINTS_FAILED';
export const COMPLAINT_DETAIL_RECEIVED = 'COMPLAINT_DETAIL_RECEIVED';
export const COMPLAINT_DETAIL_FAILED = 'COMPLAINT_DETAIL_FAILED';
export const COMPLAINT_DETAIL_CALLED = 'COMPLAINT_DETAIL_CALLED';
export const STATES_API_CALLED = 'STATES_API_CALLED';
export const STATES_RECEIVED = 'STATES_RECEIVED';
export const STATES_FAILED = 'STATES_FAILED';
export const TRENDS_API_CALLED = 'TRENDS_API_CALLED';
export const TRENDS_RECEIVED = 'TRENDS_RECEIVED';
export const TRENDS_FAILED = 'TRENDS_FAILED';

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
    const regex = /&size=\d+&/gm;
    // remove the duplicate size from the qs
    const qs = store.query.queryString.replace(regex, '&');
    const uri = API_PLACEHOLDER + qs + '&size=0';
    // This call is already in process
    if (uri === store.aggs.activeCall) {
      return null;
    }

    dispatch(aggregationsApiCalled(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(aggregationsReceived(items)))
      .catch((error) => dispatch(aggregationsApiFailed(error)));
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
 *
 * @param {string} id - the id of the complaint to retrieve
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getComplaintDetail(id) {
  return (dispatch, getState) => {
    const store = getState();
    const uri = API_PLACEHOLDER + id;

    // This call is already in process
    if (uri === store.detail.activeCall) {
      return null;
    }

    dispatch(callingApi(COMPLAINT_DETAIL_CALLED, uri));
    fetch(uri)
      .then((result) => result.json())
      .then((data) => dispatch(complaintDetailReceived(data)))
      .catch((error) => dispatch(complaintDetailFailed(error)));
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
 *
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
 *
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
 * Creates an action in response to search results being received from the API
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
 * @param {string} error - the error returned from `fetch`, not the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendsFailed(error) {
  return {
    type: TRENDS_FAILED,
    error,
  };
}
