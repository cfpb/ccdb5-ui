import { sendQuery } from './complaints';

const queryString = require('query-string');

export const URL_CHANGED = 'processParams';
//-----------------------------------------------------------------------------

/**
 * Converts a Location object into structures needed by the reducers
 * @param {Location} location - information about the host, path and query string
 * @returns {object} the pathname and a dictionary of the query string params
 */
export function processLocation(location) {
  const qs = location.search;
  const params = queryString.parse(qs);

  return {
    pathname: location.pathname,
    params,
  };
}


/**
 * Notify the application that the URL has changed and call the API
 * @param {Location} location - information about the host, path and query string
 * @returns {Function} a series of simple actions to execute
 */
export default function announceUrlChanged(location) {
  const { pathname, params } = processLocation(location);
  return (dispatch) => {
    dispatch(urlChanged(pathname, params));
    dispatch(sendQuery());
  };
}
