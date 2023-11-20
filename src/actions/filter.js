import { REQUERY_ALWAYS } from '../constants';

export const DATE_INTERVAL_CHANGED = 'changeDateInterval';
export const DATE_RANGE_CHANGED = 'changeDateRange';
export const DATES_CHANGED = 'changeDates';
export const FILTER_ALL_REMOVED = 'removeAllFilters';
export const FILTER_CHANGED = 'toggleFilter';
export const FILTER_FLAG_CHANGED = 'toggleFlagFilter';
export const FILTER_MULTIPLE_ADDED = 'addMultipleFilters';
export const FILTER_MULTIPLE_REMOVED = 'removeMultipleFilters';
export const FILTER_ADDED = 'addFilter';
export const FILTER_REMOVED = 'removeFilter';
export const FILTER_REPLACED = 'replaceFilter';

// ----------------------------------------------------------------------------
// Simple actions

/**
 * Notifies the application that the dates have changed
 * @param {string} filterName - which filter is being updated
 * @param {Date} minDate - the minimum date in the range
 * @param {Date} maxDate - the maximum date in the range
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeDates(filterName, minDate, maxDate) {
  return {
    type: DATES_CHANGED,
    filterName,
    minDate,
    maxDate,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that the filtered dates have changed
 * @param {string} dateRange - which filter is being updated
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function dateRangeToggled(dateRange) {
  return {
    type: DATE_RANGE_CHANGED,
    dateRange,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that an aggregation filter changed
 * @param {string} filterName - which filter was clicked
 * @param {string} filterValue - the value of the filter that was clicked
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function toggleFilter(filterName, filterValue) {
  return {
    type: FILTER_CHANGED,
    filterName,
    filterValue,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that a flag filter toggled
 * @param {string} filterName - which filter was clicked
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function toggleFlagFilter(filterName) {
  return {
    type: FILTER_FLAG_CHANGED,
    filterName,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that a filter was added
 * @param {string} filterName - which filter was clicked
 * @param {string} filterValue - the value of the filter that was clicked
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function addFilter(filterName, filterValue) {
  return {
    type: FILTER_ADDED,
    filterName,
    filterValue,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that a filter was removed
 * @param {string} filterName - which filter was clicked
 * @param {string} filterValue - the value of the filter that was clicked
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function removeFilter(filterName, filterValue) {
  return {
    type: FILTER_REMOVED,
    filterName,
    filterValue,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that all filters have been removed
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function removeAllFilters() {
  return {
    type: FILTER_ALL_REMOVED,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that several related filters were added
 * @param {string} filterName - which filter is being updated
 * @param {Array} values - one or more values to add to the filter set
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function addMultipleFilters(filterName, values) {
  // eslint-disable-next-line no-console
  console.assert(Array.isArray(values));
  return {
    type: FILTER_MULTIPLE_ADDED,
    filterName,
    values,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that several related filters were removed
 * @param {string} filterName - which filter is being updated
 * @param {Array} values - one or more values to remove to the filter set
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function removeMultipleFilters(filterName, values) {
  // eslint-disable-next-line no-console
  console.assert(Array.isArray(values));
  return {
    type: FILTER_MULTIPLE_REMOVED,
    filterName,
    values,
    requery: REQUERY_ALWAYS,
  };
}

/**
 * Notifies the application that filters will be replaced
 * @param {string} filterName - which filter is being updated
 * @param {Array} values - one or more values to replace in the filter set
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function replaceFilters(filterName, values) {
  // eslint-disable-next-line no-console
  console.assert(Array.isArray(values));
  return {
    type: FILTER_REPLACED,
    filterName,
    values,
    requery: REQUERY_ALWAYS,
  };
}
