/* eslint-disable camelcase */
import * as paramFns from '../params/params';
import * as constants from '../../constants';
import queryString from 'query-string';

/**
 * Creates an aggregation query
 *
 * @param {object} state - The current state in the Redux store.
 * @returns {string} The full endpoint url.
 */
export function buildAggregationUri(state) {
  const params = paramFns.extractAggregationParams(state);

  const { viewMode } = state.viewModel;

  let uri = URI_COMPLAINTS;

  switch (viewMode) {
    case constants.MODE_ATTACHMENT:
      uri = URI_ATTACHMENT;
      break;

    case constants.MODE_MORE_LIKE_COMPLAINT:
      uri = `${URI_COMPLAINTS}/${state.query.mltId}/mlt`;
      break;

    case constants.MODE_COMPARE:
    case constants.MODE_GEO:
    case constants.MODE_LIST_COMPLAINTS:
    case constants.MODE_TRENDS:
      uri = URI_COMPLAINTS;
      break;

    case constants.MODE_TELL_YOUR_STORY:
      uri = URI_TELL_YOUR_STORY;
      break;

    default:
      throw new Error('V2 does not currently support ' + viewMode);
  }

  // Add the no-hits param
  params.size = 0;

  return formatUri(uri, params);
}

/**
 * Creates an almanac query
 *
 * @param {object} state - The current state in the Redux store.
 * @returns {string} The full endpoint url.
 */
export function buildAlmanacUri(state) {
  const { almanac, filters, geo, query } = state;
  const { almanacId, almanacLevel } = almanac;
  const { geographicLevel } = geo;

  const params = Object.assign(
    {
      almanacLevel,
      index_name: query._index,
    },
    paramFns.extractBasicParams(filters, query),
  );

  const level = geographicLevel.toLowerCase();
  const uri = `${URI_ALMANAC}/${level}/${almanacId}`;
  return formatUri(uri, params);
}

/**
 * Determines the full url of history endpoint based on the state.
 *
 * @param {object} state - The current state in the Redux store.
 * @param {string} tab - The current state in the Redux store.
 * @returns {string} The full endpoint url.
 */
export function buildHistoryUri(state, tab) {
  let uri;
  switch (tab) {
    case constants.HistoryTabs.Searches:
      uri = '/search-history';
      break;
    case constants.HistoryTabs.Exports:
      uri = '/export-history';
      break;
    case constants.HistoryTabs.SavedSearches:
    default:
      uri = '/saved-searches';
  }

  const params = {
    limit: 100,
  };

  if (
    tab === constants.HistoryTabs.Searches ||
    tab === constants.HistoryTabs.Exports
  ) {
    params.index_name = state.query._index;
  }

  return formatUri(uri, params);
}

/**
 * Determines the full peers url based on the state
 *
 * @param {object} state - The current state in the Redux store.
 * @returns {string} The full peers endpoint url.
 */
export function buildPeersUri(state) {
  const { compareItem } = state.comparisons;
  const uri = `${URI_PEERS}/${compareItem}`;
  const params = { index_name: 'complaint-peers' };

  return formatUri(uri, params);
}

/**
 * Determines the full url based on the state
 *
 * @param {object} state - The app state in Redux.
 * @param {string} endpoint - The api endpoint
 * @returns {string} The url with parameters for the endpoint
 */
export function buildUri(state, endpoint = '') {
  const uri = endpoint === '' ? getEndpointPath(state) : endpoint;
  const { filters, geo, query, viewModel } = state;
  const { viewMode } = viewModel;

  let params;

  switch (viewMode) {
    case constants.MODE_ATTACHMENT:
    case constants.MODE_LIST_COMPLAINTS:
      params = paramFns.extractBasicParams(filters, geo, query);
      params.no_aggs = true;
      break;

    case constants.MODE_MORE_LIKE_COMPLAINT:
      params = paramFns.extractBasicParams(filters, geo, query);
      break;

    case constants.MODE_COMPARE:
      params = Object.assign(
        { no_aggs: true },
        paramFns.extractBasicParams(filters, geo, query),
        paramFns.extractCompareParams(state),
      );
      break;

    case constants.MODE_GEO:
      params = Object.assign(
        { no_aggs: true },
        paramFns.extractBasicParams(filters, geo, query),
        paramFns.extractGeoParams(state),
      );
      break;

    case constants.MODE_TRENDS:
      params = Object.assign(
        { no_aggs: true },
        paramFns.extractBasicParams(filters, geo, query),
        paramFns.extractTrendsParams(state),
      );
      break;

    case constants.MODE_TELL_YOUR_STORY:
      params = paramFns.extractTysParams(state);
      break;

    default:
      throw new Error('V2 does not currently support ' + viewMode);
  }

  return formatUri(uri, params);
}

/**
 * Builds a URL from a path and dictionary
 *
 * @param {string} path - The V2 endpoint.
 * @param {object} params - A key/value pair of the query string params.
 * @returns {string} The full endpoint url.
 */
export function formatUri(path, params) {
  return path + '?' + queryString.stringify(params);
}

/**
 * Generates a link for each document.
 *
 * @param {string} indexPath - complaints or tys.
 * @param {string} referenceNumber - The complaint id.
 * @returns {string} The document url.
 */
export function genDocumentHref(indexPath, referenceNumber = '') {
  return '/' + indexPath + '/document?id=' + referenceNumber;
}

/**
 * Generates a link for MLT 'See more like this narrative`
 *
 * @param {string} id - The document id we are referencing
 * @returns {string} -The link to the MLT list view search
 */
export const genMLTHref = (id) => {
  return `/complaints/mlt?field=what_happened&fields=All%20Data&mltId=${id}`;
};

/**
 *
 * @param {string} indexPath - complaints or tys
 * @returns {string} The url to the root of search
 */
export function genBackLink(indexPath) {
  return '/' + indexPath + '/q';
}

/**
 * Generates url to the History page
 *
 * @param {string} indexPath - complaints or stories
 * @param {string} tab - The history tab we want to direct history to
 * @returns {string} The url.
 */
export function genHistoryHref(indexPath, tab) {
  const tabName = tab ? tab : constants.HistoryTabs.SavedSearches;
  return `/${indexPath}/history/${tabName}?`;
}

/**
 * Determines the correct endpoint based on the state
 *
 * @param {object} state - The current state in the Redux store.
 * @returns {string} the endpoint url (without query string).
 */
export function getEndpointPath(state) {
  const { searchFields } = state.query;
  const { viewMode } = state.viewModel;

  let path = viewMode in pathMap ? pathMap[viewMode] : URI_COMPLAINTS;

  if (viewMode === constants.MODE_MORE_LIKE_COMPLAINT) {
    path += '/' + state.query.mltId + '/mlt';
  }

  if (viewMode === constants.MODE_COMPARE) {
    const { compareItem } = state.comparisons;
    path += `/${compareItem}`;
  }

  const docModes = [constants.MODE_DOCUMENT, constants.MODE_TYS_DOCUMENT];
  if (docModes.includes(viewMode)) {
    const { id } = state.document;
    if (searchFields === constants.SearchFields.Attachments) {
      path += `/${id}`;
    }
  }

  if (viewMode === constants.MODE_GEO) {
    const { geographicLevel } = state.geo;
    const searchField = constants.geographicLevels[geographicLevel].searchField;
    path += `/${searchField}/complaints`;
  }

  return path;
}
