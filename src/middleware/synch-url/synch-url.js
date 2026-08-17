import { createBrowserHistory } from 'history';
import queryString from 'query-string';
import { extractReducerAttributes } from '../../api/params/params';
import { appUrlChanged } from '../../reducers/routes/routes-slice';

/**
 * Retrieve attributes for the filters reducer
 *
 * @param {object} filters - filtersState in redux
 * @returns {Array} list of filter attributes
 */
function getFiltersAttrs(filters) {
  return Object.keys(filters);
}

/**
 * Function to return query attributes that belong in the URL
 *
 * @returns {Array} an array of params
 */
function getQueryAttrs() {
  return [
    'dateRange',
    'company_received_min',
    'company_received_max',
    'date_received_min',
    'date_received_max',
    'searchText',
    'searchField',
    'search_after',
    'size',
    'page',
    'sort',
  ];
}

/**
 * helper function to return viewModel params to extract
 *
 * @returns {Array} lists the params to extract
 */
function getViewModelAttrs() {
  return ['debug', 'tour', 'tab'];
}

/**
 * Determine which reducer variables will go into a query string to push into the url
 *
 * @param {object} state - the current state of the Redux store
 * @returns {object} an object that can be transferred to the URL query string
 */
export function extractQueryStringParams(state) {
  const attrsFilters = getFiltersAttrs(state.filters),
    attrsQuery = getQueryAttrs(),
    attrsView = getViewModelAttrs();

  const params = Object.assign(
    {},
    extractReducerAttributes(state.query, attrsQuery),
    extractReducerAttributes(state.filters, attrsFilters),
    extractReducerAttributes(state.view, attrsView),
  );

  if (state.query.searchAfter) {
    params.search_after = state.query.searchAfter;
  }

  return params;
}

/**
 * Middleware function to synch state to url
 *
 * @param {import('../types/redux-types').ReduxTypes.Store} store - Redux store
 * @returns {(next: import('../types/redux-types').ReduxTypes.Next) => (action: import('../types/redux-types').ReduxTypes.PlainAction | import('../types/redux-types').ReduxTypes.Thunk) => Promise<unknown>} A Redux middleware function
 */
export default function synchUrl(store) {
  return (next) => (action) => {
    // Pass the action forward in the chain

    const result = next(action);
    // Get the current state
    const state = store.getState();

    if (action.type === 'routes/routeChanged' || !state.query.dateLastIndexed) {
      return result;
    }

    const params = extractQueryStringParams(state);
    // See if processing should continue
    // Update the application
    const history = createBrowserHistory({
      basename: (process.env.BASE_PATH || '/').replace(/\/$/, '') || undefined,
    });
    const location = history.location;

    const { queryString: oldQS } = state.routes;
    const newQS = queryString.stringify(params);
    // And record the change in Redux to prevent ROUTE_CHANGED storms
    if (oldQS === '' || oldQS !== newQS) {
      history.push({
        pathname: location.pathname,
        search: '?' + newQS,
      });
      store.dispatch(appUrlChanged(location.pathname, params));
    }
    return result;
  };
}
