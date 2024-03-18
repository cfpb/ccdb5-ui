import { createBrowserHistory } from 'history';
import { appUrlChanged } from '../../reducers/routes/routesSlice';
import queryString from 'query-string';
import { MODE_MAP, MODE_TRENDS, PERSIST_NONE } from '../../constants';
import {
  extractAgeParams,
  extractReducerAttributes,
} from '../../api/params/params';

/**
 * Extended logic to build the set of geo params
 *
 * @param {object} state - the current state of the Redux store
 * @param {string} viewMode - current view from viewModel
 * @returns {object} a set of {fieldName: value} pairs
 */
function buildGeoParams(state, viewMode) {
  if (viewMode !== MODE_MAP) return {};

  return Object.assign(
    {},
    // App-only params
    extractReducerAttributes(state.geo, ['dataNormalization', 'mapType']),
  );
}

/**
 * helper function to return trends params to extract based on view mode
 *
 * @param {string} viewMode - current view from viewModel
 * @returns {Array} lists the params to extract
 */
function getTrendsAttrs(viewMode) {
  return viewMode === MODE_TRENDS
    ? ['chartType', 'focus', 'lens', 'subLens', 'trend_depth']
    : [];
}
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
  const results = {};

  // Special handling for dates
  const dateRange = state.query?.dateRange ?? { from: '', to: '' };
  results.date_from = dateRange.from;
  results.date_to = dateRange.to;

  return results;
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
  const { viewMode, viewName } = state.view,
    attrsTrends = getTrendsAttrs(viewMode),
    attrsQuery = [
      'ind',
      'mltField',
      'mltId',
      'queryText',
      'searchFields',
      'size',
      'page',
      'sort',
    ],
    attrsView = getViewModelAttrs(viewMode);

  const geoParams = buildGeoParams(state, viewMode);

  // Grab specific attributes from the reducers
  const params = Object.assign(
    {},
    extractAgeParams(state.query.ageRange),
    // extractReducerAttributes(state.document, ['id']),
    extractReducerAttributes(state.query, attrsQuery),
    extractReducerAttributes(state.filters, Object.keys(state.filters)),
    extractReducerAttributes(state.view, attrsView),
    extractReducerAttributes(state.trends, attrsTrends),
    geoParams,
    extractDates(state),
  );

  if (viewName === 'List') params.detailMode = state.view.detailMode;

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
