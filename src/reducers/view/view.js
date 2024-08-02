import actions from '../../actions';
import { processUrlArrayParams } from '../../utils';

export const defaultView = {
  expandedRows: [],
  isFromExternal: false,
  isPrintMode: false,
  hasAdvancedSearchTips: false,
  hasFilters: true,
  showTour: false,
  modalTypeShown: false,
  width: 0,
};

/**
 * Processes an object of key/value strings into the correct internal format
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} a filtered set of key/value pairs with the values set to
 * the correct type
 */
function processParams(state, action) {
  const params = action.params;

  state.isPrintMode = params.isPrintMode === 'true';
  state.isFromExternal = params.isFromExternal === 'true';

  const arrayParams = ['expandedRows'];
  processUrlArrayParams(params, state, arrayParams);

  return state;
}

/**
 * Handler hide advanced tips
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function hideAdvancedSearchTips(state) {
  return {
    ...state,
    hasAdvancedSearchTips: false,
  };
}

/**
 * Handler for the modal hide
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function modalHidden(state) {
  return {
    ...state,
    modalTypeShown: false,
  };
}

/**
 * Handler for the modal show
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - The redux action
 * @returns {object} the new state for the Redux store
 */
export function modalShown(state, action) {
  return {
    ...state,
    modalTypeShown: action.modalType,
  };
}

/**
 * Handler show advanced tips
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function showAdvancedSearchTips(state) {
  return {
    ...state,
    hasAdvancedSearchTips: true,
  };
}

/**
 * Handler for the update print mode on action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updatePrintModeOn(state) {
  return {
    ...state,
    isPrintMode: true,
  };
}

/**
 * Handler for the update print mode off action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updatePrintModeOff(state) {
  return {
    ...state,
    isFromExternal: false,
    isPrintMode: false,
  };
}

/**
 * Handler for the update screen size action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateScreenSize(state, action) {
  return {
    ...state,
    hasFilters: action.screenWidth > 749,
    width: action.screenWidth,
  };
}

/**
 * Handler for the update screen size action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function updateFilterVisibility(state) {
  return {
    ...state,
    hasFilters: !state.hasFilters,
  };
}

/**
 * Handler for the update hide tour
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function tourHidden(state) {
  return {
    ...state,
    showTour: false,
  };
}

/**
 * Handler for the update show tour action.
 * Reset page state so we can highlight things consistently.
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function tourShown(state) {
  return {
    ...state,
    expandedRows: [],
    hasAdvancedSearchTips: false,
    showTour: true,
  };
}

/**
 * Handler for the Row collapse action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function collapseRow(state, action) {
  const { expandedRows } = state;
  const item = action.value;

  return {
    ...state,
    expandedRows: expandedRows.filter((row) => row !== item),
  };
}

/**
 * Handler for the Row expand action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function expandRow(state, action) {
  const { expandedRows } = state;
  const item = action.value;
  let newState;

  if (!expandedRows.includes(item)) {
    newState = {
      ...state,
      expandedRows: [...expandedRows, item],
    };
  } else {
    newState = {
      ...state,
      expandedRows,
    };
  }

  return newState;
}

/**
 * reset the expanded rows when the data lens changes so we don't have
 * remnants of rows showing across company/
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function resetExpandedRows(state) {
  return {
    ...state,
    expandedRows: [],
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

  handlers[actions.DATA_LENS_CHANGED] = resetExpandedRows;
  handlers[actions.MODAL_HID] = modalHidden;
  handlers[actions.MODAL_SHOWN] = modalShown;
  handlers[actions.PRINT_MODE_ON] = updatePrintModeOn;
  handlers[actions.PRINT_MODE_OFF] = updatePrintModeOff;
  handlers[actions.SCREEN_RESIZED] = updateScreenSize;
  handlers[actions.HIDE_ADVANCED_SEARCH_TIPS] = hideAdvancedSearchTips;
  handlers[actions.SHOW_ADVANCED_SEARCH_TIPS] = showAdvancedSearchTips;
  handlers[actions.TOGGLE_FILTER_VISIBILITY] = updateFilterVisibility;
  handlers[actions.HIDE_TOUR] = tourHidden;
  handlers[actions.SHOW_TOUR] = tourShown;
  handlers[actions.ROW_COLLAPSED] = collapseRow;
  handlers[actions.ROW_EXPANDED] = expandRow;
  handlers[actions.URL_CHANGED] = processParams;
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

const view = (state = defaultView, action) => {
  const newState = handleSpecificAction(state, action);
  return newState;
};

export default view;
