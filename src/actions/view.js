import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../constants';

export const MAP_WARNING_DISMISSED = 'MAP_WARNING_DISMISSED';
export const MODAL_HID = 'view/modalHidden';
export const MODAL_SHOWN = 'view/modalShown';
export const PRINT_MODE_ON = 'view/updatePrintModeOn';
export const PRINT_MODE_OFF = 'view/updatePrintModeOff';
export const ROW_COLLAPSED = 'view/collapseRow';
export const ROW_EXPANDED = 'view/expandRow';
export const SCREEN_RESIZED = 'view/updateScreenSize';
export const HIDE_ADVANCED_SEARCH_TIPS = 'view/hideAdvancedSearchTips';
export const SHOW_ADVANCED_SEARCH_TIPS = 'view/showAdvancedSearchTips';
export const HIDE_TOUR = 'view/tourShown';
export const SHOW_TOUR = 'view/tourHidden';
export const TAB_CHANGED = 'view/changeTab';
export const TOGGLE_FILTER_VISIBILITY = 'view/updateFilterVisibility';
export const TRENDS_DATE_WARNING_DISMISSED = 'TRENDS_DATE_WARNING_DISMISSED';

// ----------------------------------------------------------------------------
// Simple actions
/**
 * Notifies the application that the filter visibility has changed
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function filterVisibilityToggled() {
  return {
    type: TOGGLE_FILTER_VISIBILITY,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that user dismissed map warning
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function mapWarningDismissed() {
  return {
    type: MAP_WARNING_DISMISSED,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that the print mode has changed
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function printModeOn() {
  return {
    type: PRINT_MODE_ON,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that the print mode has changed
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function printModeOff() {
  return {
    type: PRINT_MODE_OFF,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that advanced tips shown
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function showAdvancedTips() {
  return {
    type: SHOW_ADVANCED_SEARCH_TIPS,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that advanced tips hidden
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function hideAdvancedTips() {
  return {
    type: HIDE_ADVANCED_SEARCH_TIPS,
    requery: REQUERY_NEVER,
  };
}

/**
 * Indicates a bar in row chart has been collapsed
 * @param {string} value - of trend agg that was toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function collapseRow(value) {
  return {
    type: ROW_COLLAPSED,
    requery: REQUERY_NEVER,
    value,
  };
}

/**
 * Indicates all modals are hidden
 * @returns {object} A packaged payload to be used by Redux reducers
 */
export function hideModal() {
  return {
    type: MODAL_HID,
  };
}

/**
 * Indicates the named modal was opened
 * @param {string} value - The name of the modal to open.
 * @returns {object} A packaged payload to be used by Redux reducers
 */
export function showModal(value) {
  return {
    type: MODAL_SHOWN,
    modalType: value,
  };
}

/**
 * Indicates a bar in row chart has been expanded
 * @param {string} value - of trend agg that was toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function expandRow(value) {
  return {
    type: ROW_EXPANDED,
    requery: REQUERY_NEVER,
    value,
  };
}

/**
 * Notifies the application that the screen has resized
 * @param {string} width - the width of the screen
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function screenResized(width) {
  return {
    type: SCREEN_RESIZED,
    screenWidth: width,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that the tab has changed
 * @param {string} tab - the new tab name
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function tabChanged(tab) {
  return {
    type: TAB_CHANGED,
    tab,
    requery: REQUERY_HITS_ONLY,
  };
}

/**
 * Notifies the application that the tour was toggled OFF
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function tourHidden() {
  return {
    type: HIDE_TOUR,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that the tour was toggled on
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function tourShown() {
  return {
    type: SHOW_TOUR,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that user dismissed trends date warning
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendsDateWarningDismissed() {
  return {
    type: TRENDS_DATE_WARNING_DISMISSED,
    requery: REQUERY_NEVER,
  };
}
