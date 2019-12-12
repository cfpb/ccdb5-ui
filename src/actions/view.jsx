import { REQUERY_HITS_ONLY } from '../constants'

export const TAB_CHANGED = 'TAB_CHANGED'

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
    tab,
    requery: REQUERY_HITS_ONLY
  }
}
