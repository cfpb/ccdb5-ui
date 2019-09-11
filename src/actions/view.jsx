import { getComplaints } from './complaints'
import { TAB_CHANGED } from '../constants'

// ----------------------------------------------------------------------------
// Simple actions

/**
* Notifies the application that the tab has changed
*
* @param {string} tab the new tab name
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function tabChanged( tab ) {
  return {
    type: TAB_CHANGED,
    tab
  }
}


// ----------------------------------------------------------------------------
// Compound actions

/**
* Changes the current tab
*
* @param {string} tab the new tab
* @returns {function} a series of simple actions to execute
*/
export function changeTab( tab ) {
  return dispatch => {
    dispatch( tabChanged( tab ) )
    dispatch( getComplaints() )
  }
}
