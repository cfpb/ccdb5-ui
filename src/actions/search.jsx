import { SEARCH_CHANGED } from '../constants'
import { getComplaints } from './complaints'

export function searchChanged(searchText, searchType) {
  return {
    type: SEARCH_CHANGED,
    searchText,
    searchType
  }
}

export default function search(searchText, searchType) {
  return dispatch => {
      dispatch(searchChanged(searchText, searchType))
      dispatch(getComplaints())
  }
}