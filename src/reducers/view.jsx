import actions from '../actions'

export const defaultView = {
  printMode: false,
  showFilters: true,
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

  if ( params.printMode ) {
    state.printMode = params.printMode
  }

  return state
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


// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Creates a hash table of action types to handlers
 *
 * @returns {object} a map of types to functions
 */
export function _buildHandlerMap() {
  const handlers = {}

  handlers[actions.PRINT_MODE_ON] = updatePrintModeOn
  handlers[actions.PRINT_MODE_OFF] = updatePrintModeOff
  handlers[actions.SCREEN_RESIZED] = updateScreenSize
  handlers[actions.TOGGLE_FILTER_VISIBILITY] = updateFilterVisibility
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
