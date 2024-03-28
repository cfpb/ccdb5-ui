import { routeChanged } from '../reducers/routes/routesSlice';
import queryString from 'query-string';
const isEqual = require('react-fast-compare');

// ----------------------------------------------------------------------------
// Helpers

/**
 * Remove templated params from a params list and make sure ints are ints
 *
 * @param {object} params - the query string params as a dictionary
 * @returns {object} a processed version of the params
 */
export function normalizeRouteParams(params) {
  const processed = { ...params };
  const remove = ['search_after'];
  const numbers = ['size', 'page', 'trend_depth'];

  remove.forEach((value) => {
    if (Object.prototype.hasOwnProperty.call(processed, value)) {
      delete processed[value];
    }
  });

  numbers.forEach((number) => {
    if (Object.prototype.hasOwnProperty.call(processed, number)) {
      processed[number] = parseInt(processed[number], 10);
    }
  });

  return processed;
}

// --------------------------------------------------------------------------
// Compound actions
//

/**
 * Encapsulates the notification logic related to signets and routes
 *
 * @param {string} path - the new path being used
 * @param {object} params - the query string
 * @returns {Function} a series of actions to execute
 */
export function changeRoute(path, params) {
  // eslint-disable-next-line complexity
  return function (dispatch, getState) {
    const store = getState();
    const normalized = normalizeRouteParams(params);
    const { routes } = store;
    const sameRoute =
      routes.path === path && isEqual(routes.params, normalized);
    if (sameRoute === false) {
      dispatch(routeChanged(path, normalized));
    }
  };
}

/**
 * Converts a Location object into structures needed by the reducers
 *
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
