/* eslint complexity: ["error", 5] */
import {
  API_PLACEHOLDER,
  MODE_LIST,
  MODE_MAP,
  MODE_TRENDS,
} from '../constants';
import {
  complaintDetailCalled,
  complaintDetailReceived,
  complaintDetailFailed,
} from '../reducers/detail/detail';
import {
  processTrends,
  processTrendsError,
  trendsCallInProcess,
} from '../reducers/trends/trends';
import {
  processStatesError,
  processStatesResults,
  statesCallInProcess,
} from '../reducers/map/map';
import {
  aggregationsCallInProcess,
  processAggregationError,
  processAggregationResults,
} from '../reducers/aggs/aggs';
import {
  hitsCallInProcess,
  processHitsError,
  processHitsResults,
} from '../reducers/results/results';

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

// ----------------------------------------------------------------------------
// Routing action
/**
 * Routes to the correct endpoint based on the state
 *
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
 *
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
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getAggregations() {
  return (dispatch, getState) => {
    const store = getState();
    const qs = store.query.queryString;
    const uri = API_PLACEHOLDER + qs + '&size=0';

    // This call is already in process
    if (store.aggs.isLoading) {
      return null;
    }

    dispatch(aggregationsCallInProcess(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(processAggregationResults(items)))
      .catch((error) => dispatch(processAggregationError(error)));
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

    dispatch(hitsCallInProcess(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => {
        dispatch(processHitsResults(items));
      })
      .catch((error) => dispatch(processHitsError(error)));
  };
}

/**
 * Calls the detail endpoint of the API
 *
 * @param {string} id - the id of the complaint to retrieve
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function getComplaintDetail(id) {
  return (dispatch) => {
    const uri = API_PLACEHOLDER + id;
    dispatch(complaintDetailCalled(uri));
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

    dispatch(statesCallInProcess(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(processStatesResults(items)))
      .catch((error) => dispatch(processStatesError(error)));
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
    const qs = 'trends/' + store.query.queryString;
    const uri = API_PLACEHOLDER + qs + '&no_aggs=true';
    // This call is already in process
    if (uri === store.trends.activeCall) {
      return null;
    }

    // kill query if Company param criteria aren't met
    if (
      store.trends.lens === 'Company' &&
      (!store.query.company || !store.query.company.length)
    ) {
      return null;
    }

    dispatch(trendsCallInProcess(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => {
        dispatch(processTrends(items));
      })
      .catch((error) => dispatch(processTrendsError(error)));
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
