import { getComplaints } from './complaints'
import { URL_CHANGED } from '../constants'

const queryString = require( 'query-string' );

//-----------------------------------------------------------------------------

/**
* Converts a Location object into structures needed by the reducers
*
* @param {Location} location information about the host, path and query string
* @returns {object} the pathname and a dictionary of the query string params
*/
export function processLocation( location ) {
  const qs = location.search;
  const params = queryString.parse( qs );

  return {
    pathname: location.pathname,
    params
  }
}

//-----------------------------------------------------------------------------

/**
* Notifies the application that the application's URL has changed
*
* @param {string} pathname the path of the URL
* @param {object} params key/value pairs that represent the query string
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function urlChanged( pathname, params ) {
  return {
    type: URL_CHANGED,
    pathname,
    params
  }
}

/**
* Notify the application that the URL has changed and call the API
*
* @param {Location} location information about the host, path and query string
* @returns {function} a series of simple actions to execute
*/
export default function announceUrlChanged( location ) {
  const { pathname, params } = processLocation( location );
  return dispatch => {
    dispatch( urlChanged( pathname, params ) )
    dispatch( getComplaints() )
  }
}
