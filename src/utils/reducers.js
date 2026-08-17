/**
 * contains common utility functions we use in the reducers
 */

import * as types from '../constants';

/**
 * helper function to enforce valid values when someone pastes in a url
 *
 * @param {string|number} value - input val to check
 * @param {string} field - key of the query object we need to validate
 * @returns {string|number|unknown} valid value
 */
export const enforceValues = (value, field) => {
  const valMap = {
    dateRange: {
      defaultVal: '3y',
      values: Object.keys(types.dateRanges),
    },
    searchField: {
      defaultVal: 'all',
      values: ['all', 'company'],
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
      defaultVal: types.MODE_LIST,
      values: [types.MODE_LIST],
    },
  };
  if (Object.hasOwn(valMap, field)) {
    const validValues = valMap[field];
    if (validValues.values.includes(value)) {
      return value;
    }
    return validValues.defaultVal;
  }

  return value;
};
