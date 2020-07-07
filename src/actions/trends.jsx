import { REQUERY_ALWAYS, REQUERY_NEVER } from '../constants'

export const CHART_TYPE_CHANGED = 'CHART_TYPE_CHANGED'
export const DATA_LENS_CHANGED = 'DATA_LENS_CHANGED'
export const DATA_SUBLENS_CHANGED = 'DATA_SUBLENS_CHANGED'
export const DEPTH_CHANGED = 'DEPTH_CHANGED'
export const DEPTH_RESET = 'DEPTH_RESET'
export const FOCUS_CHANGED = 'FOCUS_CHANGED'
export const TREND_TOGGLED = 'TREND_TOGGLED'
export const TRENDS_TOOLTIP_CHANGED = 'TRENDS_TOOLTIP_CHANGED'

/**
 * Notifies the application that chart type toggled
 *
 * @param {string} chartType which chartType was selected, line or stacked area
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeChartType( chartType ) {
  return {
    type: CHART_TYPE_CHANGED,
    chartType,
    requery: REQUERY_NEVER
  }
}

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
 * Indicates the data subLens selected
 *
 * @param {string} subLens the tab selected for row charts
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeDataSubLens( subLens ) {
  return {
    type: DATA_SUBLENS_CHANGED,
    requery: REQUERY_ALWAYS,
    subLens
  }
}

/**
 * Notifies the application that depth is being changed
 *
 * @param {string} depth the max number of aggregations returned
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeDepth( depth ) {
  return {
    type: DEPTH_CHANGED,
    requery: REQUERY_ALWAYS,
    depth
  }
}

/**
 * Notifies the application that depth is being reset
 *
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function resetDepth() {
  return {
    type: DEPTH_RESET,
    requery: REQUERY_ALWAYS
  }
}

/**
 * Notifies the application that focus is being changed
 *
 * @param {string} focus the text to search for
 * @param {string} lens the lens we're focusing on
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeFocus( focus, lens ) {
  return {
    type: FOCUS_CHANGED,
    requery: REQUERY_ALWAYS,
    focus,
    lens
  }
}

/**
 * Notifies the application that the toolTip for stacked area chart has changed
 *
 * @param {string} value the new payload from the tooltip
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function updateTrendsTooltip( value ) {
  return {
    type: TRENDS_TOOLTIP_CHANGED,
    value,
    requery: REQUERY_NEVER
  }
}

/**
 * Indicates a bar in row chart has been toggled
 *
 * @param {string} value of trend agg that was toggled
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function toggleTrend( value ) {
  return {
    type: TREND_TOGGLED,
    requery: REQUERY_NEVER,
    value
  }
}
