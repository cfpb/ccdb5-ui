import { getComplaints } from './complaints'
import { SEARCH_CHANGED } from '../constants'

/**
* Notifies the application that a new search is being executed
*
* @param {string} searchText the text to search for
* @param {string} searchField the field to search within
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function searchChanged( searchText, searchField ) {
  return {
    type: SEARCH_CHANGED,
    searchText,
    searchField
  }
}

/**
* Requests a new search
*
* @param {string} searchText the text to search for
* @param {string} searchField the field to search within
* @returns {function} a series of simple actions to execute
*/
export default function search( searchText, searchField ) {
  return dispatch => {
    dispatch( searchChanged( searchText, searchField ) )
    dispatch( getComplaints() )
  }
}
