import { REQUERY_ALWAYS, REQUERY_NEVER } from '../constants';

export const DATA_NORMALIZATION_SELECTED = 'DATA_NORMALIZATION_SELECTED';
export const STATE_COMPLAINTS_SHOWN = 'STATE_COMPLAINTS_SHOWN';
export const STATE_FILTER_ADDED = 'STATE_FILTER_ADDED';
export const STATE_FILTER_CLEARED = 'STATE_FILTER_CLEARED';
export const STATE_FILTER_REMOVED = 'STATE_FILTER_REMOVED';

/**
 * Indicates data normalization (yes, Per 1000 population) value was selected
 * @param {object} value of the data normalization
 * @returns {object} a packaged payload to be used by Redux reducers
 */
export function dataNormalizationChanged( value ) {
  return {
    type: DATA_NORMALIZATION_SELECTED,
    requery: REQUERY_NEVER,
    value
  };
}

/**
 * Creates an action in response after state tile clicked
 *
 * @param {object} selectedState the tile map state that is toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function addStateFilter( selectedState ) {
  return {
    type: STATE_FILTER_ADDED,
    selectedState,
    requery: REQUERY_ALWAYS
  };
}

/**
 * Creates an action in response after state clear button clicked
 *
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function clearStateFilter() {
  return {
    type: STATE_FILTER_CLEARED,
    requery: REQUERY_ALWAYS
  };
}

/**
 * Creates an action in response after 'view all complaints from TX' clicked
 *
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function showStateComplaints() {
  return {
    type: STATE_COMPLAINTS_SHOWN,
    requery: REQUERY_ALWAYS
  };
}

/**
 * Creates an action in response after state tile clicked
 *
 * @param {object} selectedState the tile map state that is toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function removeStateFilter( selectedState ) {
  return {
    type: STATE_FILTER_REMOVED,
    selectedState,
    requery: REQUERY_ALWAYS
  };
}
