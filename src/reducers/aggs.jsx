import {
  AGGREGATIONS_API_CALLED, AGGREGATIONS_FAILED, AGGREGATIONS_RECEIVED
} from '../actions/complaints'

/* eslint-disable camelcase */

export const defaultAggs = {
  activeCall: '',
  company: [],
  company_public_response: [],
  company_response: [],
  consumer_consent_provided: [],
  consumer_disputed: [],
  isLoading: false,
  issue: [],
  product: [],
  state: [],
  submitted_via: [],
  tag: [],
  timely: [],
  zip_code: []
}

// ----------------------------------------------------------------------------
// Action Handlers
/**
 * handles complaint api call in progress
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function aggregationsCallInProcess( state, action ) {
  return {
    ...state,
    activeCall: action.url,
    isLoading: true
  }
}

/**
 * expanded logic to process complaint data
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processAggregationResults( state, action ) {
  const aggs = action.data.aggregations
  const keys = Object.keys( aggs )
  const result = { ...state }

  keys.forEach( key => {
    result[key] = aggs[key][key].buckets
  } )

  result.isLoading = false

  return result
}

/**
 * handling errors from an complaint api call
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processAggregationError( state, action ) {
  return {
    ...defaultAggs,
    isLoading: false,
    error: action.error
  }
}

/**
 * Creates a hash table of action types to handlers
 *
 * @returns {object} a map of types to functions
 */
export function _buildHandlerMap() {
  const handlers = {}
  handlers[AGGREGATIONS_API_CALLED] = aggregationsCallInProcess
  handlers[AGGREGATIONS_RECEIVED] = processAggregationResults
  handlers[AGGREGATIONS_FAILED] = processAggregationError

  return handlers
}

const _handlers = _buildHandlerMap()

/**
 * Routes an action to an appropriate handler
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function handleSpecificAction( state, action ) {
  if ( action.type in _handlers ) {
    return _handlers[action.type]( state, action )
  }

  return state
}


export default ( state = defaultAggs, action ) => {
  const newState = handleSpecificAction( state, action )
  return newState
}

