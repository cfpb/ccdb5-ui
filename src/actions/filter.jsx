import {
  FILTER_ALL_REMOVED, FILTER_CHANGED, FILTER_MULTIPLE_ADDED,
  FILTER_MULTIPLE_REMOVED, FILTER_REMOVED
} from '../constants'
import { getComplaints } from './complaints'

// ----------------------------------------------------------------------------
// Simple actions

/**
* Creates an action when an aggregation filter checkbox is clicked
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
* Creates an action to remove a filter
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
* Creates an action to remove all filters
*
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function filterAllRemoved() {
  return {
    type: FILTER_ALL_REMOVED
  }
}

/**
* Creates an action to add several related filters
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
* Creates an action to remove several related filters
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
