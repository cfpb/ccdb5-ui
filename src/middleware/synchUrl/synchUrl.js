import { createBrowserHistory } from 'history';
import { appUrlChanged } from '../../reducers/routes/routesSlice';
import queryString from 'query-string';
import { MODE_MAP, MODE_TRENDS, PERSIST_NONE } from '../../constants';
import { extractReducerAttributes } from '../../api/params/params';

/**
 * helper function to return viewModel params to extract based on view mode
 *
 * @param {string} viewMode - current view from viewModel
 * @returns {Array} lists the params to extract
 */
function getViewModelAttrs(viewMode) {
  const attrs = ['debug', 'tour'];
  const chartModes = [MODE_TRENDS];
  if (chartModes.includes(viewMode)) {
    attrs.push('interval');
  }
  return attrs;
}
/**
 * Extract dates from the query reducer
 *
 * @param {object} state - the current state of the Redux store
 * @returns {object} the extracted variables
 */
export function extractDates(state) {
  const { date_received_max, date_received_min } = state.query;
  return { date_received_max, date_received_min };
}

/**
 * Determine which reducer variables will go into a query string
 *
 * @param {object} state - the current state of the Redux store
 * @returns {object} an object that can be transferred to the URL query string
 */
export function extractQueryStringParams(state) {
  // Make a list of the attributes to copy to the URL

  // Conditional extractions
  const { tab } = state.view,
    attrsMap = ['dataNormalization', 'enablePer1000', 'mapWarningEnabled'],
    attrsTrends =
      tab === MODE_TRENDS
        ? ['chartType', 'focus', 'lens', 'subLens', 'trend_depth']
        : [],
    attrsQuery = [
      'dateRange',
      'date_received_min',
      'date_received_max',
      'searchText',
      'searchFields',
      'size',
      'page',
      'sort',
    ],
    attrsView = getViewModelAttrs(tab);

  // removing Map specific props unless on Map page
  const attrsFilters =
    tab === MODE_MAP
      ? Object.keys(state.filters)
      : Object.keys(state.filters).filter((item) => !attrsMap.includes(item));

  console.log(attrsFilters);
  // Grab specific attributes from the reducers
  const params = Object.assign(
    {},
    extractReducerAttributes(state.detail, ['id']),
    // tab === MODE_MAP ? extractReducerAttributes(state.geo, attrsMap) : {},
    extractReducerAttributes(state.query, attrsQuery),
    extractReducerAttributes(state.filters, attrsFilters),
    extractReducerAttributes(state.view, attrsView),
    tab === MODE_TRENDS
      ? extractReducerAttributes(state.trends, attrsTrends)
      : {},
  );

  console.log(params, tab);
  // Rename some properties (APP query string =/= API query string)
  // for (const apiName in renameThese) {
  //   const appName = renameThese[apiName];
  //   renameProperty(params, apiName, appName);
  // }

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
