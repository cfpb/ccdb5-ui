/* eslint-disable camelcase */
import * as paramFns from '../params/params';
import queryString from 'query-string';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';

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

  return formatUri('', params);
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
    case MODE_TRENDS:
      params = Object.assign(
        {},
        paramFns.extractBasicParams(filters, query),
        paramFns.extractTrendsParams(state),
      );
      break;
    case MODE_LIST:
    case MODE_MAP:
    default:
      params = Object.assign(paramFns.extractBasicParams(filters, query));
      break;
  }

  params.no_aggs = true;
  return formatUri('', params);
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
