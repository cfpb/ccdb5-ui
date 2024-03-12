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
  trendsReceived,
  trendsApiFailed,
  trendsApiCalled,
} from '../reducers/trends/trends';
import {
  statesApiCalled,
  statesApiFailed,
  statesReceived,
} from '../reducers/map/map';
import {
  aggregationsApiCalled,
  aggregationsApiFailed,
  aggregationsReceived,
} from '../reducers/aggs/aggs';
import {
  complaintsApiCalled,
  complaintsApiFailed,
  complaintsReceived,
} from '../reducers/results/results';

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
    if (store.aggs.activeCall) {
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

    dispatch(complaintsApiCalled(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => {
        dispatch(complaintsReceived(items));
      })
      .catch((error) => dispatch(complaintsApiFailed(error)));
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

    dispatch(statesApiCalled(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => dispatch(statesReceived(items)))
      .catch((error) => dispatch(statesApiFailed(error)));
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

    dispatch(trendsApiCalled(uri));
    return fetch(uri)
      .then((result) => result.json())
      .then((items) => {
        dispatch(trendsReceived(items));
      })
      .catch((error) => dispatch(trendsApiFailed(error)));
  };
}
