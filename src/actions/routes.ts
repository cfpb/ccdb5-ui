import { routeChanged } from '../reducers/routes/routes-slice';
import dayjs from 'dayjs';
import isEqual from 'react-fast-compare';
import type { Thunk } from '../types/redux-types';
import type { RootState } from '../types/root-state';

// ----------------------------------------------------------------------------
// Helpers

/**
 * Remove templated params from a params list and make sure ints are ints
 *
 * @param {object} params - the query string params as a dictionary
 * @returns {object} a processed version of the params
 */
export function normalizeRouteParams(
  params: Record<string, unknown>,
): Record<string, unknown> {
  const processed = { ...params };
  // Drop legacy view-mode params; List is the only results view now.
  const remove = ['search_after', 'tab'];
  const numbers = ['size', 'page'];

  for (const value of remove) {
    if (Object.prototype.hasOwnProperty.call(processed, value)) {
      delete processed[value];
    }
  }

  for (const number of numbers) {
    if (Object.prototype.hasOwnProperty.call(processed, number)) {
      processed[number] = Number(processed[number]);
    }
  }

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
 * @returns {import('../types/redux-types').Thunk} A thunk that updates the route when the URL changed
 */
export function changeRoute(
  path: string,
  params: Record<string, unknown>,
): Thunk {
  return function (dispatch, getState) {
    const store = getState() as RootState;
    const normalized = normalizeRouteParams(params);
    const isValid =
      dayjs(params.date_received_max as string).isValid() &&
      dayjs(params.date_received_min as string).isValid();
    const { routes } = store;
    const isSameRoute =
      routes.path === path && isEqual(routes.params, normalized);

    if (!isSameRoute && isValid) {
      dispatch(routeChanged(path, normalized));
    }
  };
}
