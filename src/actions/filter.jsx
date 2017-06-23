import { FILTER_CHANGED } from '../constants'

export function filterChanged(filterCategory, filterName) {
  return {
    type: FILTER_CHANGED,
    filterCategory,
    filterName
  }
}

export default function filterChanged(filterCategory, filterName) {
  return dispatch => {
      dispatch(filterChanged(filterCategory, filterName))
  }
}
