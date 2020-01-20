// reducer for the Map Tab
import { STATE_FILTER_ADDED, STATE_FILTER_REMOVED } from '../actions/map'
import {
  STATES_API_CALLED, STATES_FAILED, STATES_RECEIVED
} from '../actions/complaints'
import { TILE_MAP_STATES } from '../constants'

export const defaultState = {
  isLoading: false,
  issue: [],
  product: [],
  selectedState: '',
  state: []
}

export const processAggregations = agg => {
  const total = agg.doc_count
  const chartResults = []
  for ( const k in agg ) {
    if ( agg[k].buckets ) {
      agg[k].buckets.forEach( o => {
        chartResults.push( {
          name: o.key,
          value: o.doc_count,
          pctChange: 1,
          isParent: true,
          hasChildren: false,
          pctOfSet: Math.round( o.doc_count / total * 100 )
            .toFixed( 2 ),
          width: 0.5
        } )
      } )
    }
  }
  return chartResults
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
  const result = { ...state }

  const stateData = action.data.aggregations.state
  const issueData = action.data.aggregations.issue
  const productData = action.data.aggregations.product
  result.activeCall = ''
  result.isLoading = false
  result.state = processStateAggregations( stateData )
  result.issue = processAggregations( issueData )
  result.product = processAggregations( productData )

  return result
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
    issue: [],
    error: action.error,
    isLoading: false,
    product: [],
    state: TILE_MAP_STATES.map( o => ( {
      name: o,
      value: 0,
      issue: '',
      product: ''
    } ) )
  }
}

/**
 * toggle a state map toolbar
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} new state for the Redux store
 */
export function deselectState( state ) {
  return {
    ...state,
    selectedState: ''
  }
}


/**
 * toggle a state map toolbar
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function toggleState( state, action ) {
  let { selectedState } = state
  selectedState = selectedState.abbr === action.selectedState.abbr ?
    '' : action.selectedState

  return {
    ...state,
    selectedState
  }
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
  handlers[STATES_API_CALLED] = statesCallInProcess
  handlers[STATES_RECEIVED] = processStatesResults
  handlers[STATES_FAILED] = processStatesError
  handlers[STATE_FILTER_ADDED] = toggleState
  handlers[STATE_FILTER_REMOVED] = deselectState

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
