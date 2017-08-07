import { getComplaints } from './complaints'
import { SEARCH_CHANGED } from '../constants'

export function searchChanged( searchText, searchField ) {
  return {
    type: SEARCH_CHANGED,
    searchText,
    searchField
  }
}

export default function search( searchText, searchField ) {
  return dispatch => {
    dispatch( searchChanged( searchText, searchField ) )
    dispatch( getComplaints() )
  }
}
