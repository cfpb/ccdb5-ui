// reducer for the Map Tab
import { GEO_NORM_NONE, TILE_MAP_STATES } from '../constants'
import actions from '../actions'
import { processAggregations } from './trends'
import { processErrorMessage } from '../utils'

export const defaultState = {
  activeCall: '',
  isLoading: false,
  dataNormalization: GEO_NORM_NONE,
  results: {
    product: [],
    state: []
  }
}


export const processStateAggregations = agg => {
  const states = Object.values( agg.state.buckets )
    .filter( o => TILE_MAP_STATES.includes( o.key ) )
    .map( o => ( {
      name: o.key,
      value: o.doc_count,
      issue: o.issue.buckets[0].key,
      product: o.product.buckets[0].key
    } ) )

  const stateNames = states.map( o => o.name )

  // patch any missing data
  if ( stateNames.length > 0 ) {
    TILE_MAP_STATES.forEach( o => {
      if ( !stateNames.includes( o ) ) {
        states.push( { name: o, value: 0, issue: '', product: '' } )
      }
    } )
  }
  return states
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Updates the state when an tab changed occurs, reset values to start clean
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function handleTabChanged( state ) {
  return {
    ...state,
    results: {
      product: [],
      state: []
    }
  }
}

/**
 * Updates the state when an aggregations call is in progress
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} the new state for the Redux store
 */
export function statesCallInProcess( state, action ) {
  return {
    ...state,
    activeCall: action.url,
    isLoading: true
  }
}

/**
 * Expanded logic for handling aggregations returned from the API
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processStatesResults( state, action ) {
  const aggregations = action.data.aggregations
  const { state: stateData } = aggregations
  // add in "issue" if we ever need issue row chart again
  const keys = [ 'product' ]
  const results = {}
  processAggregations( keys, state, aggregations, results )
  results.state = processStateAggregations( stateData )

  return {
    ...state,
    activeCall: '',
    isLoading: false,
    results
  }
}

/**
 * handling errors from an aggregation call
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processStatesError( state, action ) {
  return {
    ...state,
    activeCall: '',
    error: processErrorMessage( action.error ),
    isLoading: false,
    results: {
      product: [],
      state: []
    }
  }
}

/**
 * Handler for the update filter data normalization action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDateDataNormalization( state, action ) {
  let dataNormalization = state.dataNormalization
  if ( action.filterName === 'company_received' ) {
    if ( action.minDate || action.maxDate ) {
      dataNormalization = GEO_NORM_NONE
    }
  }

  return {
    ...state,
    dataNormalization
  }
}

/**
 * Handler for the update filter data normalization action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updateFilterDataNormalization( state ) {
  return {
    ...state,
    dataNormalization: GEO_NORM_NONE
  }
}

/**
 * Handler for the update data normalization action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDataNormalization( state, action ) {
  return {
    ...state,
    dataNormalization: action.value
  }
}

/**
 * Processes an object of key/value strings into the correct internal format
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} a filtered set of key/value pairs with the values set to
 * the correct type
 */
function processParams( state, action ) {
  const params = action.params
  const processed = Object.assign( {}, defaultState )

  // Handle flag filters
  if ( params.dataNormalization ) {
    processed.dataNormalization = params.dataNormalization
  }

  return processed
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Creates a hash table of action types to handlers
 *
 * @returns {object} a map of types to functions
 */
export function _buildHandlerMap() {
  const handlers = {}

  handlers[actions.DATA_NORMALIZATION_SELECTED] = updateDataNormalization
  handlers[actions.DATE_RANGE_CHANGED] = updateDateDataNormalization
  handlers[actions.FILTER_CHANGED] = updateFilterDataNormalization
  handlers[actions.FILTER_MULTIPLE_ADDED] = updateFilterDataNormalization
  handlers[actions.STATE_FILTER_ADDED] = updateFilterDataNormalization
  handlers[actions.STATES_API_CALLED] = statesCallInProcess
  handlers[actions.STATES_RECEIVED] = processStatesResults
  handlers[actions.STATES_FAILED] = processStatesError
  handlers[actions.TAB_CHANGED] = handleTabChanged
  handlers[actions.URL_CHANGED] = processParams

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

export default ( state = defaultState, action ) => {
  const newState = handleSpecificAction( state, action )
  return newState
}
