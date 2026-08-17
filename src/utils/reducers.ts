/**
 * Common utility functions used in the reducers.
 */

import * as types from '../constants';

type EnforceableField = 'dateRange' | 'searchField' | 'size' | 'sort' | 'tab';

const valMap: Record<
  EnforceableField,
  { defaultVal: string | number; values: (string | number)[] }
> = {
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

const isEnforceableField = (field: string): field is EnforceableField =>
  Object.hasOwn(valMap, field);

/**
 * Enforce valid values when someone pastes in a URL.
 *
 * @param value - Input val to check.
 * @param field - Key of the query object we need to validate.
 * @returns A known-valid value, or the original value when the field is unconstrained.
 */
export const enforceValues = (
  value: string | number,
  field: string,
): string | number => {
  if (isEnforceableField(field)) {
    const validValues = valMap[field];
    if (validValues.values.includes(value)) {
      return value;
    }
    return validValues.defaultVal;
  }

  return value;
};
