// reducer for the Map Tab
import actions from '../actions';
import { processAggregations } from './trends';
import { processErrorMessage } from '../utils';
import { TILE_MAP_STATES } from '../constants';

export const defaultState = {
  activeCall: '',
  isLoading: false,
  results: {
    product: [],
    state: [],
  },
};

export const processStateAggregations = (agg) => {
  const states = Object.values(agg.state.buckets)
    .filter((o) => TILE_MAP_STATES.includes(o.key))
    .map((o) => ({
      name: o.key,
      value: o.doc_count,
      issue: o.issue.buckets[0].key,
      product: o.product.buckets[0].key,
    }));

  const stateNames = states.map((o) => o.name);

  // patch any missing data
  if (stateNames.length > 0) {
    TILE_MAP_STATES.forEach((o) => {
      if (!stateNames.includes(o)) {
        states.push({ name: o, value: 0, issue: '', product: '' });
      }
    });
  }
  return states;
};

// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Updates the state when an tab changed occurs, reset values to start clean
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function handleTabChanged(state) {
  return {
    ...state,
    results: {
      product: [],
      state: [],
    },
  };
}

/**
 * Updates the state when an aggregations call is in progress
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} the new state for the Redux store
 */
export function statesCallInProcess(state, action) {
  return {
    ...state,
    activeCall: action.url,
    isLoading: true,
  };
}

/**
 * Expanded logic for handling aggregations returned from the API
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processStatesResults(state, action) {
  const aggregations = action.data.aggregations;
  const { state: stateData } = aggregations;
  // add in "issue" if we ever need issue row chart again
  const keys = ['product'];
  const results = {};
  processAggregations(keys, state, aggregations, results);
  results.state = processStateAggregations(stateData);

  return {
    ...state,
    activeCall: '',
    isLoading: false,
    results,
  };
}

/**
 * handling errors from an aggregation call
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processStatesError(state, action) {
  return {
    ...state,
    activeCall: '',
    error: processErrorMessage(action.error),
    isLoading: false,
    results: {
      product: [],
      state: [],
    },
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

  handlers[actions.STATES_API_CALLED] = statesCallInProcess;
  handlers[actions.STATES_RECEIVED] = processStatesResults;
  handlers[actions.STATES_FAILED] = processStatesError;
  handlers[actions.TAB_CHANGED] = handleTabChanged;

  return handlers;
}

const _handlers = _buildHandlerMap();

/**
 * Routes an action to an appropriate handler
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function handleSpecificAction(state, action) {
  if (action.type in _handlers) {
    return _handlers[action.type](state, action);
  }

  return state;
}

export default (state = defaultState, action) => {
  const newState = handleSpecificAction(state, action);
  return newState;
};
