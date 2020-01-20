import { REQUERY_ALWAYS } from '../constants'

export const STATE_COMPLAINTS_SHOWN = 'STATE_COMPLAINTS_SHOWN'
export const STATE_FILTER_ADDED = 'STATE_FILTER_ADDED'
export const STATE_FILTER_REMOVED = 'STATE_FILTER_REMOVED'

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
  }
}

/**
 * Creates an action in response after state clear button clicked
 *
 * @param {string} stateAbbr the tile map state that is toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function removeStateFilter( stateAbbr ) {
  return {
    type: STATE_FILTER_REMOVED,
    stateAbbr,
    requery: REQUERY_ALWAYS
  }
}

/**
 * Creates an action in response after 'view all complaints from TX' clicked
 *
 * @param {string} stateAbbr the tile map state that is toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function showStateComplaints( stateAbbr ) {
  return {
    type: STATE_COMPLAINTS_SHOWN,
    stateAbbr,
    requery: REQUERY_ALWAYS
  }
}
