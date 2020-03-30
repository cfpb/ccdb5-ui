import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../constants'
export const PRINT_MODE_CHANGED = 'PRINT_MODE_CHANGED'
export const SCREEN_RESIZED = 'SCREEN_RESIZED'
export const TAB_CHANGED = 'TAB_CHANGED'
export const TOGGLE_FILTER_VISIBILITY = 'TOGGLE_FILTER_VISIBILITY'

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
 * Notifies the application that the screen has resized
 * @param {string} width the width of the screen
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function screenResized( width ) {
  return {
    type: SCREEN_RESIZED,
    screenWidth: width,
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

/**
 * Notifies the application that the filter visibility has changed
 *
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function filterVisiblityToggled() {
  return {
    type: TOGGLE_FILTER_VISIBILITY,
    requery: REQUERY_NEVER
  }
}
