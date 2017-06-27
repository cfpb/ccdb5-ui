import { FILTER_CHANGED } from '../constants'
import { getComplaints } from './complaints'

export function filterToggle(filterName, filterValue) {
  return {
    type: FILTER_CHANGED,
    filterName: filterName,
    filterValue: filterValue
  }
}

export default function filterChanged(filterName, filterValue) {
  return dispatch => {
      dispatch(filterToggle(filterName, filterValue))
      dispatch(getComplaints())
  }
}
