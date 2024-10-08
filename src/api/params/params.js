/* eslint-disable camelcase */
import { clamp, removeNullProperties } from '../../utils';
import { enforceValues } from '../../utils/reducers';
// ----------------------------------------------------------------------------
// return parameter objects

/**
 * Selects specific variables to be used in an aggregation query
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} a dictionary of strings
 */
export function extractAggregationParams(state) {
  const { filters, query } = state;

  const queryState = extractQueryParams(query);

  const queryParams = Object.keys(queryState).filter(
    (key) =>
      // exclude these from query
      !['frm', 'search_after', 'size', 'sort'].includes(key),
  );

  const filterParams = Object.keys(filters).filter(
    (key) =>
      // exclude these from query
      !['dataNormalization', 'enablePer1000', 'mapWarningEnabled'].includes(
        key,
      ),
  );

  // Grab specific attributes from the reducers
  const newObject = Object.assign(
    {},
    extractReducerAttributes(queryState, queryParams),
    extractReducerAttributes(filters, filterParams),
  );

  return removeNullProperties(newObject);
}

/**
 * Selects specific variables to be used in the basic query string
 *
 * @param {object} filterState - the current Filter state in the Redux store
 * @param {object} queryState - the current Query state in the Redux store
 * @returns {object} a dictionary of strings
 */
export function extractBasicParams(filterState, queryState) {
  const filterParams = Object.keys(filterState).filter(
    (key) =>
      // exclude these from query
      !['dataNormalization', 'enablePer1000', 'mapWarningEnabled'].includes(
        key,
      ),
  );

  // Grab specific attributes from the reducers
  return Object.assign(
    {},
    extractQueryParams(queryState),
    extractReducerAttributes(filterState, filterParams),
  );
}

/**
 * Extract specific variables from a reducer
 *
 * @param {object} reducer - a single reducer from the Redux store
 * @param {Array} attributes - a list of variables to extract
 * @returns {object} the extracted variables
 */
export function extractReducerAttributes(reducer, attributes) {
  const results = {};

  attributes.forEach((attribute) => {
    const value = reducer[attribute];
    /* istanbul ignore else */
    if (Array.isArray(value)) {
      if (value.length > 0) {
        results[attribute] = value;
      }
    } else if (value) {
      results[attribute] = value;
    }
  });

  return results;
}

// ----------------------------------------------------------------------------
// parameter objects <--> reducer

/**
 * Selects specific values from the query reducer to be used in a query string
 *
 * @param {object} queryState - the current query state in the Redux store
 * @returns {object} a dictionary of strings
 */
export function extractQueryParams(queryState) {
  const query = queryState;
  const params = {
    company_received_max: query.company_received_max,
    company_received_min: query.company_received_min,
    date_received_max: query.date_received_max,
    date_received_min: query.date_received_min,
    field: enforceValues(query.searchField, 'searchField'),
    // edge case for doc complaint override in
    // actions/complaints.js
    frm:
      query.from !== undefined
        ? query.from
        : clamp(query.page - 1, 0) * query.size,
    size: query.size,
    sort: query.sort,
  };

  /* istanbul ignore else */
  if (query.searchText) {
    params.search_term = query.searchText;
  }

  if (query.searchAfter) {
    params.search_after = query.searchAfter;
  }

  return removeNullProperties(params);
}

/**
 * Selects specific variables from the trends reducer to be used in a query str
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} a dictionary of strings
 */
export function extractTrendsParams(state) {
  const { dateInterval, searchField } = state.query;
  const { focus, lens, subLens, trendDepth: trend_depth } = state.trends;

  const params = {
    lens: lens.replace(' ', '_').toLowerCase(),
    searchField,
    trend_depth,
    trend_interval: dateInterval.toLowerCase(),
  };

  if (subLens) {
    params.sub_lens = subLens.replace('-', '_').replace(' ', '_').toLowerCase();
  }

  if (focus) {
    params.focus = focus;
  }

  return params;
}
