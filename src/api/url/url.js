/* eslint-disable camelcase */
import * as paramFns from '../params/params';
import queryString from 'query-string';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';

const uri = '/';
/**
 * Creates an aggregation query
 *
 * @param {object} state - The current state in the Redux store.
 * @returns {string} The full endpoint url.
 */
export function buildAggregationUri(state) {
  const params = paramFns.extractAggregationParams(state);
  // Add the no-hits param
  params.size = 0;

  return formatUri(uri, params);
}

/**
 * Determines the full url based on the state
 *
 * @param {object} state - The app state in Redux.
 * @returns {string} The url with parameters for the endpoint
 */
export function buildUri(state) {
  const { filters, query, view } = state;
  const { tab } = view;

  let params;

  switch (tab) {
    case MODE_LIST:
      params = paramFns.extractBasicParams(filters, query);
      params.no_aggs = true;
      break;

    case MODE_MAP:
      params = Object.assign(
        { no_aggs: true },
        paramFns.extractBasicParams(filters, query),
      );
      break;

    case MODE_TRENDS:
    default:
      params = Object.assign(
        { no_aggs: true },
        paramFns.extractBasicParams(filters, query),
        paramFns.extractTrendsParams(state),
      );
      break;
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
