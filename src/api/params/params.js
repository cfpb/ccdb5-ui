/* eslint-disable camelcase */

// import { defaultSort } from '../../../constants';
// import { validateDatePeriod } from '../../../reducers/utils/dateReducers';
import { capitalize, clamp, removeNullProperties } from '../../utils';
// const isEqual = require('react-fast-compare');
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

  const set1 = {
    field: 'all',
  };

  if (query.dateRange) {
    set1.date_received_max = query.date_received_max;
    set1.date_received_min = query.date_received_min;
  }

  if (query.searchText) {
    set1.search_term = query.searchText;
  }

  const filterParams = Object.keys(filters).filter(
    (key) =>
      // exclude these from query
      !['dataNormalization', 'enablePer1000', 'mapWarningEnabled'].includes(
        key,
      ),
  );
  // Grab specific attributes from the reducers
  return Object.assign(
    {},
    set1,
    extractReducerAttributes(filters, filterParams),
  );
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
    searchField: query.searchFields ?? 'all',
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
  if (query.dateRange) {
    params.date_received_max = query.date_received_max;
    params.date_received_min = query.date_received_min;
  }

  /* istanbul ignore else */
  if (query.searchText) {
    params.search_term = query.searchText;
  }

  if (query.searchAfter) {
    params.search_after = query.searchAfter;
  }

  return params;
}

// /**
//  * Reverses extractQueryParams
//  *
//  * @param {object} params - the parameters returned from the API
//  * @returns {object} a version of the query state
//  */
// export function parseParamsToQuery(params) {
//   const {
//     date_received_max,
//     date_received_min,
//     field,
//     frm: frm_as_string,
//     index_name,
//     search_term,
//     size: size_as_string,
//     sort,
//   } = params;
//
//   const size = parseInt(size_as_string, 10);
//   const frm = parseInt(frm_as_string, 10);
//
//   const query = {
//     page: (frm + size) / size,
//     searchText: search_term || '',
//     // searchFields: revSearchFieldMap[field],
//     size,
//   };
//
//   // Handle the dates
//   const dateRange = removeNullProperties({
//     to: date_received_max,
//     from: date_received_min,
//   });
//
//   /* istanbul ignore else */
//   if (!isEqual(dateRange, {})) {
//     query.dateRange = dateRange;
//     validateDatePeriod(query.dateRange);
//   }
//
//   // Handle the index name
//   /* istanbul ignore else */
//   if (index_name) {
//     query._index = index_name;
//   }
//
//   // Handle sort
//   /* istanbul ignore else */
//   if (sort) {
//     query.sort = sortNames(sort);
//   }
//
//   return removeNullProperties(query);
// }

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

/**
 * Reverses extractTrendsParams
 *
 * @param {object} params - the parameters returned from the API
 * @returns {object} a version of the trends state
 */
export function parseParamsToTrends(params) {
  const { focus, lens, subLens, trend_depth } = params;
  const trends = {
    focus,
    lens,
    subLens,
    trend_depth,
  };

  return removeNullProperties(trends);
}

/**
 * Handles the view model specific params
 *
 * @param {object} params - the parameters returned from the API
 * @returns {object} a version of the view model state
 */
export function parseParamsToViewModel(params) {
  const { trend_interval: interval } = params;

  return removeNullProperties({
    interval: capitalize(interval),
  });
}
