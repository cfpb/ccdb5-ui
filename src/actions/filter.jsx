import {
  DATE_RANGE_CHANGED,
  FILTER_ALL_REMOVED, FILTER_CHANGED, FILTER_FLAG_CHANGED,
  FILTER_MULTIPLE_ADDED, FILTER_MULTIPLE_REMOVED, FILTER_REMOVED
} from '../constants'
import { getComplaints } from './complaints'

// ----------------------------------------------------------------------------
// Simple actions

/**
* Notifies the application that a date range has changed
*
* @param {string} filterName which filter is being updated
* @param {Date} minDate the minimum date in the range
* @param {Date} maxDate the maximum date in the range
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function dateRangeChanged( filterName, minDate, maxDate ) {
  return {
    type: DATE_RANGE_CHANGED,
    filterName,
    minDate,
    maxDate
  }
}

/**
* Notifies the application that an aggregation filter changed
*
* @param {string} filterName which filter was clicked
* @param {string} filterValue the value of the filter that was clicked
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterToggle( filterName, filterValue ) {
  return {
    type: FILTER_CHANGED,
    filterName,
    filterValue
  }
}

/**
* Notifies the application that a flag filter changed
*
* @param {string} filterName which filter was clicked
* @param {bool} filterValue the value of the filter that was clicked
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterFlagToggle( filterName, filterValue ) {
  return {
    type: FILTER_FLAG_CHANGED,
    filterName,
    filterValue
  }
}

/**
* Notifies the application that a filter was removed
*
* @param {string} filterName which filter was clicked
* @param {string} filterValue the value of the filter that was clicked
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterRemoved( filterName, filterValue ) {
  return {
    type: FILTER_REMOVED,
    filterName,
    filterValue
  }
}

/**
* Notifies the application that all filters have been removed
*
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterAllRemoved() {
  return {
    type: FILTER_ALL_REMOVED
  }
}

/**
* Notifies the application that several related filters were added
*
* @param {string} filterName which filter is being updated
* @param {array} values one or more values to add to the filter set
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterMultipleAdded( filterName, values ) {
  // eslint-disable-next-line no-console
  console.assert( Array.isArray( values ) )
  return {
    type: FILTER_MULTIPLE_ADDED,
    filterName,
    values
  }
}

/**
* Notifies the application that several related filters were removed
*
* @param {string} filterName which filter is being updated
* @param {array} values one or more values to remove to the filter set
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterMultipleRemoved( filterName, values ) {
  // eslint-disable-next-line no-console
  console.assert( Array.isArray( values ) )
  return {
    type: FILTER_MULTIPLE_REMOVED,
    filterName,
    values
  }
}

// ----------------------------------------------------------------------------
// Compound Actions

/**
* Adds several filters to the current set
*
* @param {string} filterName which filter is being updated
* @param {array} values one or more values to add to the filter set
* @returns {function} a series of actions to execute
*/
export function addMultipleFilters( filterName, values ) {
  return dispatch => {
    dispatch( filterMultipleAdded( filterName, values ) )
    dispatch( getComplaints() )
  }
}

/**
* Changes the date range of a filter
*
* @param {string} filterName which filter is being updated
* @param {Date} minDate the minimum date in the range
* @param {Date} maxDate the maximum date in the range
* @returns {function} a series of actions to execute
*/
export function changeDateRange( filterName, minDate, maxDate ) {
  return dispatch => {
    dispatch( dateRangeChanged( filterName, minDate, maxDate ) )
    dispatch( getComplaints() )
  }
}

/**
* Changes one filter in the current set
*
* @param {string} filterName which filter is being updated
* @param {string} filterValue the value being changed
* @returns {function} a series of actions to execute
*/
export function filterChanged( filterName, filterValue ) {
  return dispatch => {
    dispatch( filterToggle( filterName, filterValue ) )
    dispatch( getComplaints() )
  }
}

/**
* Removes one filter from the current set
*
* @param {string} filterName which filter is being updated
* @param {string} filterValue the value being removed
* @returns {function} a series of actions to execute
*/
export function removeFilter( filterName, filterValue ) {
  return dispatch => {
    dispatch( filterRemoved( filterName, filterValue ) )
    dispatch( getComplaints() )
  }
}

/**
* Remove all filters from the current set
*
* @returns {function} a series of actions to execute
*/
export function removeAllFilters() {
  return dispatch => {
    dispatch( filterAllRemoved() )
    dispatch( getComplaints() )
  }
}

/**
* Removes several filters from the current set
*
* @param {string} filterName which filter is being updated
* @param {array} values one or more values to remove from the filter set
* @returns {function} a series of actions to execute
*/
export function removeMultipleFilters( filterName, values ) {
  return dispatch => {
    dispatch( filterMultipleRemoved( filterName, values ) )
    dispatch( getComplaints() )
  }
}

/**
* Changes the value on a flag filter
*
* @param {string} filterName which filter is being updated
* @param {bool} value the value being changed
* @returns {function} a series of actions to execute
*/
export function changeFlagFilter( filterName, value ) {
  return dispatch => {
    dispatch( filterFlagToggle( filterName, value ) )
    dispatch( getComplaints() )
  }
}
