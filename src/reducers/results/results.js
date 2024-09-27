/* eslint-disable camelcase */
import {
  COMPLAINTS_API_CALLED,
  COMPLAINTS_FAILED,
  COMPLAINTS_RECEIVED,
} from '../../actions/complaints';

export const defaultResults = {
  activeCall: '',
  error: '',
  items: [],
};

export const _processHits = (data) =>
  data.hits.hits.map((hit) => {
    const item = { ...hit._source };

    if (hit.highlight) {
      Object.keys(hit.highlight).forEach((field) => {
        item[field] = hit.highlight[field][0];
      });
    }

    return item;
  });

// ----------------------------------------------------------------------------
// Action Handlers
/**
 * handles complaint api call in progress
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function hitsCallInProcess(state, action) {
  return {
    ...state,
    activeCall: action.url,
  };
}

/**
 * expanded logic to process complaint data
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processHitsResults(state, action) {
  const items = _processHits(action.data);

  return {
    ...state,
    activeCall: '',
    error: '',
    items: items,
  };
}

/**
 * handling errors from an complaint api call
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processHitsError(state, action) {
  return {
    ...defaultResults,
    error: action.error,
  };
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Creates a hash table of action types to handlers
 *
 * @returns {object} a map of types to functions
 */
export function _buildHandlerMap() {
  const handlers = {};
  handlers[COMPLAINTS_API_CALLED] = hitsCallInProcess;
  handlers[COMPLAINTS_RECEIVED] = processHitsResults;
  handlers[COMPLAINTS_FAILED] = processHitsError;

  return handlers;
}

const _handlers = _buildHandlerMap();

/**
 * Routes an action to an appropriate handler
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function handleSpecificAction(state, action) {
  if (action.type in _handlers) {
    return _handlers[action.type](state, action);
  }

  return state;
}

const results = (state = defaultResults, action) => {
  const newState = handleSpecificAction(state, action);
  return newState;
};

export default results;
