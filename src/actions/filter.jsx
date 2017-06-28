import { FILTER_CHANGED } from '../constants'
import { getComplaints } from './complaints'

// Simple Action
export function filterToggle(filterName, filterValue) {
  return {
    type: FILTER_CHANGED,
    filterName: filterName,
    filterValue: filterValue
  }
}

// Compound Action
export function filterChanged(filterName, filterValue) {
  return dispatch => {
      dispatch( filterToggle(filterName, filterValue) )
      dispatch(getComplaints())
  }
}
