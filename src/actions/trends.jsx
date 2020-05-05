import { REQUERY_ALWAYS, REQUERY_NEVER } from '../constants'

export const DATA_LENS_CHANGED = 'DATA_LENS_CHANGED'
export const DATA_SUBLENS_CHANGED = 'DATA_SUBLENS_CHANGED'
export const FOCUS_CHANGED = 'FOCUS_CHANGED'
export const TREND_TOGGLED = 'TREND_TOGGLED'
export const TRENDS_TOOLTIP_CHANGED = 'TRENDS_TOOLTIP_CHANGED'

/**
 * Notifies the application that data lens overview, product, issue was toggled
 *
 * @param {string} lens which lens was selected
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeDataLens( lens ) {
  return {
    type: DATA_LENS_CHANGED,
    lens,
    requery: REQUERY_ALWAYS
  }
}

/**
 * Indicates the data sub lens selected
 *
 * @param {string} subLens the tab selected for row charts
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function dataSubLensChanged( subLens ) {
  return {
    type: DATA_SUBLENS_CHANGED,
    requery: REQUERY_ALWAYS,
    subLens
  }
}

/**
 * Notifies the application that a new search is being executed
 *
 * @param {string} value the text to search for
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function focusChanged( value ) {
  return {
    type: FOCUS_CHANGED,
    requery: REQUERY_ALWAYS,
    value
  }
}

/**
 * Notifies the application that the toolTip for stacked area chart has changed
 *
 * @param {string} value the new interval payload
 * @param {string} interval the current payload
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendsTooltipChanged( value, interval ) {
  return {
    type: TRENDS_TOOLTIP_CHANGED,
    value
  }
}

/**
 * Indicates a bar in row chart has been toggled
 *
 * @param {string} value of trend agg that was toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendToggled( value ) {
  return {
    type: TREND_TOGGLED,
    requery: REQUERY_NEVER,
    value
  };
}
