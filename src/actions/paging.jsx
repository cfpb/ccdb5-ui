import { PAGE_CHANGED, SIZE_CHANGED, SORT_CHANGED } from '../constants'
import { getComplaints } from './complaints'

// ----------------------------------------------------------------------------
// Simple actions

/**
* Notifies the application that the page has changed
*
* @param {int} page the new page number
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function pageChanged( page ) {
  return {
    type: PAGE_CHANGED,
    page
  }
}

/**
* Notifies the application that the size of a page of results has changed
*
* @param {int} size the new size of a page
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function sizeChanged( size ) {
  // eslint-disable-next-line no-console
  console.assert( typeof size === 'number' )
  return {
    type: SIZE_CHANGED,
    size
  }
}

/**
* Notifies the application that the sort order of results has changed
*
* @param {string} sort the new sort.  Should match a value expected by the API
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function sortChanged( sort ) {
  return {
    type: SORT_CHANGED,
    sort
  }
}

// ----------------------------------------------------------------------------
// Compound actions

/**
* Changes the current page number
*
* @param {int} page the new page number
* @returns {function} a series of simple actions to execute
*/
export function changePage( page ) {
  return dispatch => {
    dispatch( pageChanged( page ) )
    dispatch( getComplaints() )
  }
}

/**
* Changes the current page size
*
* @param {int} size the new page size
* @returns {function} a series of simple actions to execute
*/
export function changeSize( size ) {
  return dispatch => {
    dispatch( sizeChanged( size ) )
    dispatch( getComplaints() )
  }
}

/**
* Changes the sort order of results
*
* @param {string} sort the new sort.  Should match a value expected by the API
* @returns {function} a series of simple actions to execute
*/
export function changeSort( sort ) {
  return dispatch => {
    dispatch( sortChanged( sort ) )
    dispatch( getComplaints() )
  }
}
