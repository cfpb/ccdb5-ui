import {
  FILTER_CHANGED, FILTER_REMOVED, FILTER_ALL_REMOVED, FILTER_PARENT_CHECKED
} from '../constants'
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

export function filterParentChecked(filterName, parentValue, childrenValues) {
  console.assert(Array.isArray(childrenValues))
  return {
    type: FILTER_PARENT_CHECKED,
    filterName,
    parentValue,
    childrenValues
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

export function checkParentFilter(filterName, parentValue, childrenValues) {
  return dispatch => {
    dispatch( filterParentChecked(filterName, parentValue, childrenValues) )
    dispatch( getComplaints() )
  }
}
