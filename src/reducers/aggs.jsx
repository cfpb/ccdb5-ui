import {
  AGGREGATIONS_API_CALLED, AGGREGATIONS_FAILED, AGGREGATIONS_RECEIVED
} from '../actions/complaints'

/* eslint-disable camelcase */

export const defaultAggs = {
  activeCall: '',
  doc_count: 0,
  isLoading: false,
  total: 0,
  error: '',
  lastUpdated: null,
  lastIndexed: null,
  loadingAggregations: false,
  hasDataIssue: false,
  isDataStale: false,
  isNarrativeStale: false,
  company: [],
  company_public_response: [],
  company_response: [],
  consumer_consent_provided: [],
  consumer_disputed: [],
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

  const doc_count = Math.max(
    state.doc_count,
    action.data.hits.total,
    action.data._meta.total_record_count
  )

  const result = { ...state,
    doc_count,
    error: '',
    isLoading: false,
    lastUpdated: action.data._meta.last_updated,
    lastIndexed: action.data._meta.last_indexed,
    hasDataIssue: action.data._meta.has_data_issue,
    isDataStale: action.data._meta.is_data_stale,
    isNarrativeStale: action.data._meta.is_narrative_stale,
    total: action.data.hits.total
  }

  keys.forEach( key => {
    result[key] = aggs[key][key].buckets
  } )

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

