/**
 * contains common utility functions we use in the reducers
 */

import * as types from '../constants';
import { getSubLens } from './trends';

/**
 * helper function to enforce valid values when someone pastes in a url
 *
 * @param {string|number} value - input val to check
 * @param {string} field - key of the query object we need to validate
 * @returns {string|number|*} valid value
 */
export const enforceValues = (value, field) => {
  const valMap = {
    chartType: {
      defaultVal: 'line',
      values: ['line', 'area'],
    },
    dataNormalization: {
      defaultVal: types.GEO_NORM_NONE,
      values: [types.GEO_NORM_NONE, types.GEO_NORM_PER1000],
    },
    dateInterval: {
      defaultVal: 'Month',
      values: types.dateIntervals,
    },
    dateRange: {
      defaultVal: '3y',
      values: Object.keys(types.dateRanges),
    },
    lens: {
      defaultVal: 'Product',
      values: types.lenses,
    },
    searchField: {
      defaultVal: 'all',
      values: ['all', 'company', 'complaint_what_happened'],
    },
    size: {
      defaultVal: 25,
      values: Object.keys(types.sizes),
    },
    sort: {
      defaultVal: 'created_date_desc',
      values: Object.keys(types.sorts),
    },
    tab: {
      defaultVal: types.MODE_TRENDS,
      values: [types.MODE_TRENDS, types.MODE_LIST, types.MODE_MAP],
    },
  };
  if (valMap[field]) {
    const validValues = valMap[field];
    if (validValues.values.includes(value)) {
      return value;
    }
    return validValues.defaultVal;
  }

  return value;
};

/**
 * helper function to make sure the proper chartType is selected for trends
 * also validate lens/subLens combos
 * we can't have Overview and area chart at the same time
 *
 * @param {object} state - in redux to check against
 */
export const validateTrendsReducer = (state) => {
  state.chartType = enforceValues(state.chartType, 'chartType');
  state.chartType = state.lens === 'Overview' ? 'line' : state.chartType;

  const validLens = {
    Overview: [''],
    Company: ['product'],
    Product: ['sub_product', 'issue'],
  };

  if (validLens[state.lens] && !validLens[state.lens].includes(state.subLens)) {
    state.subLens = getSubLens(state.lens);
  }
};
