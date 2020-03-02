// reducer for the Map Tab
import { GEO_NORM_NONE, TILE_MAP_STATES } from '../constants'
import actions from '../actions'

export const defaultState = {
  isLoading: false,
  issue: [],
  dataNormalization: GEO_NORM_NONE,
  product: [],
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
  };
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
  handlers[actions.STATES_API_CALLED] = statesCallInProcess
  handlers[actions.STATES_RECEIVED] = processStatesResults
  handlers[actions.STATES_FAILED] = processStatesError
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
