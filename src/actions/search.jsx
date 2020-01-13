import { REQUERY_ALWAYS } from '../constants'

export const SEARCH_CHANGED = 'SEARCH_CHANGED'

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
    searchField,
    requery: REQUERY_ALWAYS
  }
}

