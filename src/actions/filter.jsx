import { REQUERY_ALWAYS } from '../constants'

export const DATE_INTERVAL_CHANGED = 'DATE_INTERVAL_CHANGED'
export const DATE_RANGE_CHANGED = 'DATE_RANGE_CHANGED'
export const DATES_CHANGED = 'DATES_CHANGED'
export const FILTER_ALL_REMOVED = 'FILTER_ALL_REMOVED'
export const FILTER_CHANGED = 'FILTER_CHANGED'
export const FILTER_FLAG_CHANGED = 'FILTER_FLAG_CHANGED'
export const FILTER_MULTIPLE_ADDED = 'FILTER_MULTIPLE_ADDED'
export const FILTER_MULTIPLE_REMOVED = 'FILTER_MULTIPLE_REMOVED'
export const FILTER_REMOVED = 'FILTER_REMOVED'

// ----------------------------------------------------------------------------
// Simple actions


/**
 * Notifies that date interval (day, week, month, quarter, yr) was changed
 *
 * @param {string} dateInterval which interval was selected
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeDateInterval( dateInterval ) {
  return {
    type: DATE_INTERVAL_CHANGED,
    dateInterval,
    requery: REQUERY_ALWAYS
  }
}


/**
* Notifies the application that the dates have changed
*
* @param {string} filterName which filter is being updated
* @param {Date} minDate the minimum date in the range
* @param {Date} maxDate the maximum date in the range
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function changeDates( filterName, minDate, maxDate ) {
  return {
    type: DATES_CHANGED,
    filterName,
    minDate,
    maxDate,
    requery: REQUERY_ALWAYS
  }
}

/**
 * Notifies the application that the filtered dates have changed
 *
 * @param {string} dateRange which filter is being updated
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function dateRangeToggled( dateRange ) {
  return {
    type: DATE_RANGE_CHANGED,
    dateRange,
    requery: REQUERY_ALWAYS
  }
}

/**
* Notifies the application that an aggregation filter changed
*
* @param {string} filterName which filter was clicked
* @param {string} filterValue the value of the filter that was clicked
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function toggleFilter( filterName, filterValue ) {
  return {
    type: FILTER_CHANGED,
    filterName,
    filterValue,
    requery: REQUERY_ALWAYS
  }
}

/**
* Notifies the application that a flag filter toggled
*
* @param {string} filterName which filter was clicked
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function toggleFlagFilter( filterName ) {
  return {
    type: FILTER_FLAG_CHANGED,
    filterName,
    requery: REQUERY_ALWAYS
  }
}

/**
* Notifies the application that a filter was removed
*
* @param {string} filterName which filter was clicked
* @param {string} filterValue the value of the filter that was clicked
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function removeFilter( filterName, filterValue ) {
  return {
    type: FILTER_REMOVED,
    filterName,
    filterValue,
    requery: REQUERY_ALWAYS
  }
}

/**
* Notifies the application that all filters have been removed
*
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function removeAllFilters() {
  return {
    type: FILTER_ALL_REMOVED,
    requery: REQUERY_ALWAYS
  }
}

/**
* Notifies the application that several related filters were added
*
* @param {string} filterName which filter is being updated
* @param {array} values one or more values to add to the filter set
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function addMultipleFilters( filterName, values ) {
  // eslint-disable-next-line no-console
  console.assert( Array.isArray( values ) )
  return {
    type: FILTER_MULTIPLE_ADDED,
    filterName,
    values,
    requery: REQUERY_ALWAYS
  }
}

/**
* Notifies the application that several related filters were removed
*
* @param {string} filterName which filter is being updated
* @param {array} values one or more values to remove to the filter set
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function removeMultipleFilters( filterName, values ) {
  // eslint-disable-next-line no-console
  console.assert( Array.isArray( values ) )
  return {
    type: FILTER_MULTIPLE_REMOVED,
    filterName,
    values,
    requery: REQUERY_ALWAYS
  }
}
