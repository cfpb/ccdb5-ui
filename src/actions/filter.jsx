import {
  FILTER_ALL_REMOVED, FILTER_CHANGED, FILTER_MULTIPLE_ADDED, FILTER_MULTIPLE_REMOVED,
  FILTER_REMOVED
} from '../constants'
import { getComplaints } from './complaints'

// ----------------------------------------------------------------------------
// Simple actions

export function filterToggle( filterName, filterValue ) {
  return {
    type: FILTER_CHANGED,
    filterName,
    filterValue
  }
}

export function filterRemoved( filterName, filterValue ) {
  return {
    type: FILTER_REMOVED,
    filterName,
    filterValue
  }
}

export function filterAllRemoved() {
  return {
    type: FILTER_ALL_REMOVED
  }
}

export function filterMultipleAdded( filterName, values ) {
  console.assert( Array.isArray( values ) )
  return {
    type: FILTER_MULTIPLE_ADDED,
    filterName,
    values
  }
}

export function filterMultipleRemoved( filterName, values ) {
  console.assert( Array.isArray( values ) )
  return {
    type: FILTER_MULTIPLE_REMOVED,
    filterName,
    values
  }
}

// ----------------------------------------------------------------------------
// Compound Actions

export function addMultipleFilters( filterName, values ) {
  return dispatch => {
    dispatch( filterMultipleAdded( filterName, values ) )
    dispatch( getComplaints() )
  }
}

export function filterChanged( filterName, filterValue ) {
  return dispatch => {
    dispatch( filterToggle( filterName, filterValue ) )
    dispatch( getComplaints() )
  }
}

export function removeFilter( filterName, filterValue ) {
  return dispatch => {
    dispatch( filterRemoved( filterName, filterValue ) )
    dispatch( getComplaints() )
  }
}

export function removeAllFilters() {
  return dispatch => {
    dispatch( filterAllRemoved() )
    dispatch( getComplaints() )
  }
}

export function removeMultipleFilters( filterName, values ) {
  return dispatch => {
    dispatch( filterMultipleRemoved( filterName, values ) )
    dispatch( getComplaints() )
  }
}
