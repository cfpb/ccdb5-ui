import { routeChanged } from '../reducers/routes/routesSlice';
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
  return function (dispatch, getState) {
    const store = getState();
    const normalized = normalizeRouteParams(params);
    const { routes } = store;
    const sameRoute =
      routes.path === path && isEqual(routes.params, normalized);

    if (!sameRoute) {
      dispatch(routeChanged(path, normalized));
    }
  };
}
