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
  const { query } = state;

  const set1 = {
    field: 'all',
  };

  if (query.dateRange) {
    set1.date_received_max = query.dateRange.to;
    set1.date_received_min = query.dateRange.from;
  }

  if (query.queryText) {
    set1.search_term = query.queryText;
  }

  // Grab specific attributes from the reducers
  return Object.assign(
    {},
    set1,
    extractAgeParams(state.query.ageRange),
    extractReducerAttributes(state.filters, Object.keys(state.filters)),
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
  // Grab specific attributes from the reducers
  return Object.assign(
    {},
    extractQueryParams(queryState),
    extractReducerAttributes(filterState, Object.keys(filterState)),
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

export const buildSort = (sort) => {
  const sortMap = {
    'Least relevant': 'relevance_asc',
    'Most relevant': 'relevance_desc',
    'Oldest to newest': 'created_date_asc',
    'Newest to oldest': 'created_date_desc',
  };
  return sortMap[sort] || 'relevance_desc';
};

export const sortNames = (sort) => {
  const sortMap = {
    relevance_asc: 'Least relevant',
    relevance_desc: 'Most relevant',
    created_date_asc: 'Oldest to newest',
    created_date_desc: 'Newest to oldest',
  };

  return sortMap[sort] || 'Oldest to newest';
};

/**
 * Selects specific values from the query reducer to be used in a query string
 *
 * @param {object} queryState - the current query state in the Redux store
 * @returns {object} a dictionary of strings
 */
export function extractQueryParams(queryState) {
  const query = queryState;
  const ageParams = extractAgeParams(query.ageRange);
  const params = {
    ...ageParams,
    searchField: query.searchFields ?? 'all',
    // edge case for doc complaint override in
    // actions/complaints.js
    frm:
      query.from !== undefined
        ? query.from
        : clamp(query.page - 1, 0) * query.size,
    index_name: query._index,
    size: query.size,
    sort: buildSort(query.sort),
  };

  /* istanbul ignore else */
  if (query.dateRange) {
    params.date_received_max = query.dateRange.to;
    params.date_received_min = query.dateRange.from;
  }

  /* istanbul ignore else */
  if (query.queryText) {
    params.search_term = query.queryText;
  }

  if (query.searchAfter) {
    params.search_after = query.searchAfter;
  }

  return params;
}

/**
 * helper function to parse out age to use in query string
 *
 * @param {object} ageRange - ageRange object from query reducer
 * @returns {object} params we parsed out
 */
export function extractAgeParams(ageRange = {}) {
  const { ageNotProvided, max, min, olderAmerican } = ageRange;

  if (ageNotProvided) {
    return { age_min: 'None' };
  }
  if (olderAmerican) {
    return {
      age_min: 62,
      // age_max needs to be open ended for this to work
      // age_max: ''
    };
  }

  const params = {};
  if (min) {
    params.age_min = min;
  }
  if (max) {
    params.age_max = max;
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
//     queryText: search_term || '',
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
  const { dateInterval, focus, lens, subLens, trend_depth } = state.trends;

  const params = {
    lens: lens.replace(' ', '_').toLowerCase(),
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
