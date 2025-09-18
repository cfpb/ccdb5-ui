import { routeChanged } from '../reducers/routes/routesSlice';
import dayjs from 'dayjs';

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
 * @returns {(next: import('../types/reduxTypes').ReduxTypes.Next) => (action: import('../types/reduxTypes').ReduxTypes.PlainAction | import('../types/reduxTypes').ReduxTypes.Thunk) => Promise<unknown>} A Redux middleware function
 */
export function changeRoute(path, params) {
  return function (dispatch, getState) {
    const store = getState();
    const normalized = normalizeRouteParams(params);
    const isValid =
      dayjs(params.date_received_max).isValid() &&
      dayjs(params.date_received_min).isValid();
    const { routes } = store;
    const sameRoute =
      routes.path === path && isEqual(routes.params, normalized);

    if (!sameRoute && isValid) {
      dispatch(routeChanged(path, normalized));
    }
  };
}
