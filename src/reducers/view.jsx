import actions from '../actions'
import { processUrlArrayParams } from '../utils'

export const defaultView = {
  expandedRows: [],
  fromExternal: false,
  printMode: false,
  showAdvancedSearchTips: false,
  showFilters: true,
  showTour: false,
  width: 0
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

  state.printMode = params.printMode === 'true'
  state.fromExternal = params.fromExternal === 'true'

  const arrayParams = [ 'expandedRows' ]
  processUrlArrayParams( params, state, arrayParams )

  return state
}


/**
 * Handler hide advanced tips
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function hideAdvancedSearchTips( state ) {
  return {
    ...state,
    showAdvancedSearchTips: false
  }
}


/**
 * Handler show advanced tips
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function showAdvancedSearchTips( state ) {
  return {
    ...state,
    showAdvancedSearchTips: true
  }
}

/**
 * Handler for the update print mode on action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updatePrintModeOn( state ) {
  return {
    ...state,
    printMode: true
  }
}

/**
 * Handler for the update print mode off action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updatePrintModeOff( state ) {
  return {
    ...state,
    fromExternal: false,
    printMode: false
  }
}


/**
 * Handler for the update screen size action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateScreenSize( state, action ) {
  return {
    ...state,
    showFilters: action.screenWidth > 749,
    width: action.screenWidth
  }
}

/**
 * Handler for the update screen size action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updateFilterVisibility( state ) {
  return {
    ...state,
    showFilters: !state.showFilters
  }
}

/**
 * Handler for the update hide tour
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function tourHidden( state ) {
  return {
    ...state,
    showTour: false
  }
}

/**
 * Handler for the update show tour action.
 * Reset page state so we can highlight things consistently.
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function tourShown( state ) {
  return {
    ...state,
    expandedRows: [],
    showAdvancedSearchTips: false,
    showTour: true
  }
}

/**
 * Handler for the Row collapse action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function collapseRow( state, action ) {
  const { expandedRows } = state
  const item = action.value

  return {
    ...state,
    expandedRows: expandedRows.filter( o => o !== item )
  }
}

/**
 * Handler for the Row expand action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function expandRow( state, action ) {
  const { expandedRows } = state
  const item = action.value

  if ( !expandedRows.includes( item ) ) {
    expandedRows.push( item )
  }

  return {
    ...state,
    expandedRows
  }
}

/**
 * reset the expanded rows when the data lens changes so we don't have
 * remnants of rows showing across company/
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function resetExpandedRows( state ) {
  return {
    ...state,
    expandedRows: []
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

  handlers[actions.DATA_LENS_CHANGED] = resetExpandedRows
  handlers[actions.PRINT_MODE_ON] = updatePrintModeOn
  handlers[actions.PRINT_MODE_OFF] = updatePrintModeOff
  handlers[actions.SCREEN_RESIZED] = updateScreenSize
  handlers[actions.HIDE_ADVANCED_SEARCH_TIPS] = hideAdvancedSearchTips
  handlers[actions.SHOW_ADVANCED_SEARCH_TIPS] = showAdvancedSearchTips
  handlers[actions.TOGGLE_FILTER_VISIBILITY] = updateFilterVisibility
  handlers[actions.HIDE_TOUR] = tourHidden
  handlers[actions.SHOW_TOUR] = tourShown
  handlers[actions.ROW_COLLAPSED] = collapseRow
  handlers[actions.ROW_EXPANDED] = expandRow
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

export default ( state = defaultView, action ) => {
  const newState = handleSpecificAction( state, action )
  return newState
}
