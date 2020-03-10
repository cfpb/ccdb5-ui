import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../constants'
export const PRINT_MODE_CHANGED = 'PRINT_MODE_CHANGED'
export const TAB_CHANGED = 'TAB_CHANGED'

// ----------------------------------------------------------------------------
// Simple actions

/**
 * Notifies the application that the print mode has changed
 *
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function printModeChanged() {
  return {
    type: PRINT_MODE_CHANGED,
    requery: REQUERY_NEVER
  }
}

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
