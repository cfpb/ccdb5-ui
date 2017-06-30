import { FILTER_CHANGED, FILTER_REMOVED, FILTER_ALL_REMOVED } from '../constants'
import { getComplaints } from './complaints'

// ----------------------------------------------------------------------------
// Simple actions

export function filterToggle(filterName, filterValue) {
  return {
    type: FILTER_CHANGED,
    filterName,
    filterValue
  }
}

export function filterRemoved(filterName, filterValue) {
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

// ----------------------------------------------------------------------------
// Compound Actions

export function filterChanged(filterName, filterValue) {
  return dispatch => {
      dispatch( filterToggle(filterName, filterValue) )
      dispatch( getComplaints() )
  }
}

export function removeFilter(filterName, filterValue) {
  return dispatch => {
      dispatch( filterRemoved(filterName, filterValue) )
      dispatch( getComplaints() )
  }
}

export function removeAllFilters() {
  return dispatch => {
      dispatch( filterAllRemoved() )
      dispatch( getComplaints() )
  }
}
