import { SEARCH_TEXT } from '../constants'
import { getComplaints } from './complaints'

export function searchUpdating(searchText, searchType) {
  return {
    type: SEARCH_TEXT,
    searchText,
    searchType
  }
}

export default function search(searchText, searchType) {
  return dispatch => {
      dispatch(searchUpdating(searchText, searchType))
      dispatch(getComplaints())
  }
}