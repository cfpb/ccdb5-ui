import { createBrowserHistory } from 'history';
import { appUrlChanged } from '../../reducers/routes/routesSlice';
import queryString from 'query-string';
import {
  MODE_LIST,
  MODE_MAP,
  MODE_TRENDS,
  PERSIST_NONE,
} from '../../constants';
import { extractReducerAttributes } from '../../api/params/params';

/**
 * Retrieve attributes for the filters reducer
 *
 * @param {object} filters - filtersState in redux
 * @param {string} tab - current tab we are on
 * @returns {Array} list of filter attributes
 */
function getFiltersAttrs(filters, tab) {
  const attrsMap = ['dataNormalization', 'enablePer1000', 'mapWarningEnabled'];

  return tab === MODE_MAP
    ? Object.keys(filters)
    : Object.keys(filters).filter((item) => !attrsMap.includes(item));
}

/**
 * Function to return only attributes user needs on Query Tab
 *
 * @param {string} tab - The current tab we are on
 * @returns {Array} an array of params
 */
function getQueryAttrs(tab) {
  // default query that every route should have
  const defaultParams = [
    'dateRange',
    'company_received_min',
    'company_received_max',
    'date_received_min',
    'date_received_max',
    'searchText',
    'searchField',
  ];

  // list view needs these params
  if (tab === MODE_LIST) {
    return defaultParams.concat(['size', 'page', 'sort']);
  }
  if (tab === MODE_TRENDS) {
    return defaultParams.concat(['dateInterval']);
  }
  return defaultParams;
}

/**
 * helper function to return trends params to extract based on view mode
 *
 * @param {string} tab - current tab from viewModel
 * @returns {Array} lists the params to extract
 */
function getTrendsAttrs(tab) {
  return tab === MODE_TRENDS
    ? ['chartType', 'focus', 'lens', 'subLens', 'trend_depth']
    : [];
}
/**
 * helper function to return viewModel params to extract based on view mode
 *
 * @param {string} tab - current tab from viewModel
 * @returns {Array} lists the params to extract
 */
function getViewModelAttrs(tab) {
  const attrs = ['debug', 'tour', 'tab'];
  const chartModes = [MODE_TRENDS];
  if (chartModes.includes(tab)) {
    attrs.push('interval');
  }
  return attrs;
}

/**
 * Determine which reducer variables will go into a query string to push into the url
 *
 * @param {object} state - the current state of the Redux store
 * @returns {object} an object that can be transferred to the URL query string
 */
export function extractQueryStringParams(state) {
  // Make a list of the attributes to copy to the URL

  // Conditional extractions
  const { tab } = state.view,
    attrsFilters = getFiltersAttrs(state.filters, tab),
    attrsTrends = getTrendsAttrs(tab),
    attrsQuery = getQueryAttrs(tab),
    attrsView = getViewModelAttrs(tab);

  // Grab specific attributes from the reducers
  const params = Object.assign(
    {},
    extractReducerAttributes(state.detail, ['id']),
    // no unique map atts
    extractReducerAttributes(state.query, attrsQuery),
    extractReducerAttributes(state.filters, attrsFilters),
    extractReducerAttributes(state.view, attrsView),
    extractReducerAttributes(state.trends, attrsTrends),
  );

  if (state.query.searchAfter) {
    params.search_after = state.query.searchAfter;
  }

  return params;
}

/**
 *
 * @param {object} store - This is the redux store.
 * @returns {Function} a closure around the Redux middleware function
 */
const synchUrl = (store) => (next) => (action) => {
  // Pass the action forward in the chain
  // eslint-disable-next-line callback-return
  const result = next(action);

  // Get the current state
  const state = store.getState();
  // Only process certain messages
  const persist = action.meta?.persist ?? PERSIST_NONE;

  if (persist.indexOf('PERSIST_SAVE') !== 0) {
    return result;
  }

  const params = extractQueryStringParams(state);
  // See if processing should continue
  // Update the application
  const history = createBrowserHistory();
  const location = history.location;

  // if (location.search !== search && !location.pathname.includes('/detail/')) {
  history.push({
    pathname: location.pathname,
    search: '?' + queryString.stringify(params),
  });
  // And record the change in Redux to prevent ROUTE_CHANGED storms
  store.dispatch(appUrlChanged(location.pathname, params));
  return result;
};

export default synchUrl;
