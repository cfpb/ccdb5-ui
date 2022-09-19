import { REQUERY_ALWAYS } from '../constants';

export const SEARCH_FIELD_CHANGED = 'SEARCH_FIELD_CHANGED';
export const SEARCH_TEXT_CHANGED = 'SEARCH_TEXT_CHANGED';

/**
 * Notifies the application that a new search field is being executed
 *
 * @param {string} searchField the field to search within
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function searchFieldChanged( searchField ) {
  return {
    type: SEARCH_FIELD_CHANGED,
    searchField,
    requery: REQUERY_ALWAYS
  };
}

/**
 * Notifies the application that a new search text is changed
 *
 * @param {string} searchText the text to search for
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function searchTextChanged( searchText ) {
  return {
    type: SEARCH_TEXT_CHANGED,
    searchText,
    requery: REQUERY_ALWAYS
  };
}
