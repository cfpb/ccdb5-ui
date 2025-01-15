import * as types from '../../constants';
import { maxDate, minDate } from '../../constants';
import {
  calculateDateRange,
  coalesce,
  shortIsoFormat,
  startOfToday,
} from '../../utils';
import { enforceValues } from '../../utils/reducers';
import dayjs from 'dayjs';
import { isGreaterThanYear } from '../../utils/trends';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { formatDate } from '../../utils/formatDate';
import {
  filterAdded,
  filterRemoved,
  filtersCleared,
  filtersReplaced,
  filterToggled,
  multipleFiltersAdded,
  multipleFiltersRemoved,
  toggleFlagFilter,
} from '../filters/filtersSlice';
import { tabChanged } from '../view/viewSlice';
import queryString from 'query-string';

// ----------------------------------------------------------------------------
// Helper functions

/**
 * Makes sure the date range reflects the actual dates selected
 *
 * @param {object} state - the raw, unvalidated state
 * @returns {object|undefined} the validated state, or early exit
 */
export function alignDateRange(state) {
  // Shorten the input field names
  const dateMax = state.date_received_max;
  const dateMin = state.date_received_min;

  // All
  if (
    dayjs(dateMax).isSame(queryState.date_received_max) &&
    dayjs(dateMin).isSame(types.DATE_RANGE_MIN)
  ) {
    state.dateRange = 'All';
    return;
  }

  const rangeMap = {
    '3y': dayjs(dateMax).subtract(3, 'years'),
    '3m': dayjs(dateMax).subtract(3, 'months'),
    '6m': dayjs(dateMax).subtract(6, 'months'),
    '1y': dayjs(dateMax).subtract(1, 'year'),
  };
  const ranges = Object.keys(rangeMap);
  let matched = false;

  for (let idx = 0; idx < ranges.length && !matched; idx++) {
    const range = ranges[idx];

    if (dayjs(dateMin).isSame(rangeMap[range], 'day')) {
      state.dateRange = range;
      matched = true;
    }
  }

  // No matches, clear
  if (!matched) {
    state.dateRange = '';
  }
}

/**
 * Check for a common case where there is a date range but no dates
 *
 * @param {object} params - a set of URL parameters
 * @returns {boolean} true if the params meet this condition
 */
export function dateRangeNoDates(params) {
  const keys = Object.keys(params);

  return (
    keys.includes('dateRange') &&
    !keys.includes('date_received_min') &&
    !keys.includes('date_received_max')
  );
}

// ----------------------------------------------------------------------------
// Complex reduction logic

/**
 * Safely converts a string to a local date
 *
 * @param {string} value - Hopefully, an ISO-8601 formatted string
 * @returns {string} The parsed and validated date, or null
 */
export function toDate(value) {
  if (dayjs(value).isValid()) {
    return formatDate(value);
  }

  return null;
}

/**
 * Makes sure that we have a valid dateInterval is selected, or moves to week
 * when the date range > 1yr
 *
 * @param {object} queryState - the current state of query reducer
 */
export function validateDateInterval(queryState) {
  const { date_received_min, date_received_max, dateInterval } = queryState;
  // determine if we need to update date Interval if range > 1 yr
  if (
    isGreaterThanYear(date_received_min, date_received_max) &&
    dateInterval === 'Day'
  ) {
    queryState.dateInterval = 'Week';
    queryState.trendsDateWarningEnabled = true;
  }

  // > 1yr, so we can go ahead and disable the warning
  if (!isGreaterThanYear(date_received_min, date_received_max)) {
    queryState.trendsDateWarningEnabled = false;
  }
}

/**
 * Get search results after specified page
 *
 * @param {object} breakPoints - breakPoints from the List API slice
 * @param {number} page - page number
 * @returns {Array} array containing complaint's received date and id
 */
function getSearchAfter(breakPoints, page) {
  return breakPoints && breakPoints[page] ? breakPoints[page].join('_') : '';
}

/**
 * gets the pagination state
 *
 * @param {number} page - the page we are on
 * @param {object} state - the redux state
 * @returns {object} contains the from and searchAfter params
 */
function getPagination(page, state) {
  return {
    from: (page - 1) * state.size,
    page,
    searchAfter: getSearchAfter(state, page),
  };
}

// ----------------------------------------------------------------------------
// Query String Builder

/**
 * Converts a set of key/value pairs into a query string for API calls
 *
 * @param {string} state - a set of key/value pairs
 * @returns {string} a formatted query string
 */
export function stateToQS(state) {
  const params = {};
  const fields = Object.keys(state);

  // Copy over the fields

  fields.forEach((field) => {
    // Do not include empty fields
    if (!state[field]) {
      return;
    }

    let value = state[field];

    // Process dates
    if (types.dateFilters.indexOf(field) !== -1) {
      value = shortIsoFormat(value);
    }

    // Process boolean flags
    const positives = ['yes', 'true'];
    if (types.flagFilters.indexOf(field) !== -1) {
      value = positives.includes(String(value).toLowerCase());
    }

    // Map the internal field names to the API field names
    if (fieldMap[field]) {
      params[fieldMap[field]] = value;
    } else {
      params[field] = value;
    }
  });

  // list of API params
  // https://cfpb.github.io/api/ccdb/api/index.html#/
  const commonParams = [].concat(
    ['search_term', 'field'],
    types.dateFilters,
    types.knownFilters,
    types.flagFilters,
  );

  const paramMap = {
    List: ['frm', 'search_after', 'size', 'sort', 'format', 'no_aggs'],
    // nothing unique to states endpoint
    Map: [],
    Trends: [
      'lens',
      'focus',
      'sub_lens',
      'sub_lens_depth',
      'trend_interval',
      'trend_depth',
    ],
  };

  const filterKeys = [].concat(commonParams, paramMap[params.tab]);
  // if format exists it means we're exporting, so add it to allowable params
  if (Object.keys(params).includes('format')) {
    const exportParams = ['size', 'format', 'no_aggs'];
    exportParams.forEach((param) => {
      /* istanbul ignore else */
      if (!filterKeys.includes(param)) {
        filterKeys.push(param);
      }
    });
  }

  // where we only filter out the params required for each of the tabs
  const filteredParams = Object.keys(params)
    .filter((key) => filterKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});

  return '?' + queryString.stringify(filteredParams);
}

/**
 * helper function to clear out breakpoints, reset page to 1 when any sort
 * or filter changes the query
 *
 * @param {object} state - redux state
 */
export function clearPager(state) {
  state.from = 0;
  state.page = 1;
  state.searchAfter = '';
}

export const queryState = {
  company_received_max: '',
  company_received_min: '',
  dateInterval: 'Month',
  dateRange: '3y',
  date_received_max: formatDate(dayjs(startOfToday())),
  date_received_min: formatDate(
    new Date(dayjs(startOfToday()).subtract(3, 'years')),
  ),
  from: 0,
  page: 1,
  searchAfter: '',
  searchField: 'all',
  searchText: '',
  size: 25,
  sort: 'created_date_desc',
  trendsDateWarningEnabled: false,
};

const fieldMap = {
  searchAfter: 'search_after',
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm',
};

export const querySlice = createSlice({
  name: 'query',
  initialState: queryState,
  reducers: {
    dateIntervalChanged: {
      reducer: (state, action) => {
        state.dateInterval = enforceValues(action.payload, 'dateInterval');
        validateDateInterval(state);
      },
    },
    dateRangeChanged: {
      reducer: (state, action) => {
        const dateRange = enforceValues(action.payload, 'dateRange');
        const maxDate = formatDate(dayjs(startOfToday()));
        const res = {
          All: formatDate(dayjs(types.DATE_RANGE_MIN)),
          '3m': formatDate(dayjs(maxDate).subtract(3, 'months')),
          '6m': formatDate(dayjs(maxDate).subtract(6, 'months')),
          '1y': formatDate(dayjs(maxDate).subtract(1, 'year')),
          '3y': formatDate(dayjs(maxDate).subtract(3, 'years')),
        };
        state.dateRange = dateRange;
        state.date_received_min = res[dateRange]
          ? res[dateRange]
          : state.date_received_min;
        state.date_received_max = maxDate;
        validateDateInterval(state);
      },
    },
    companyReceivedDateChanged: {
      reducer: (state, action) => {
        let { maxDate, minDate } = action.payload;

        minDate = dayjs(minDate).isValid()
          ? formatDate(dayjs(minDate).startOf('day'))
          : null;

        maxDate = dayjs(maxDate).isValid()
          ? formatDate(dayjs(maxDate).startOf('day'))
          : null;
        state.company_received_min = minDate;
        state.company_received_max = maxDate;
      },
      prepare: (minDate, maxDate) => {
        return {
          payload: {
            minDate,
            maxDate,
          },
        };
      },
    },
    datesChanged: {
      reducer: (state, action) => {
        let { maxDate, minDate } = action.payload;
        minDate = dayjs(minDate).isValid()
          ? formatDate(dayjs(minDate).startOf('day'))
          : null;
        maxDate = dayjs(maxDate).isValid()
          ? formatDate(dayjs(maxDate).startOf('day'))
          : null;

        const datesChanged =
          state.date_received_min !== minDate ||
          state.date_received_max !== maxDate;

        const dateRange = calculateDateRange(minDate, maxDate);

        if (dateRange && datesChanged) {
          state.dateRange = dateRange;
        } else {
          delete state.dateRange;
        }

        state.date_received_min = minDate || state.date_received_min;
        state.date_received_max = maxDate || state.date_received_max;
        validateDateInterval(state);
      },
      prepare: (minDate, maxDate) => {
        return {
          payload: {
            minDate,
            maxDate,
          },
        };
      },
    },
    searchFieldChanged: {
      reducer: (state, action) => {
        state.searchField = action.payload;
      },
    },
    searchTextChanged: {
      reducer: (state, action) => {
        return {
          ...state,
          searchText: action.payload,
        };
      },
    },
    trendsDateWarningDismissed: {
      reducer: (state) => {
        state.trendsDateWarningEnabled = false;
      },
    },
    prevPageShown: {
      reducer: (state, action) => {
        const breakPoints = action.payload;
        // don't let them go lower than 1
        const prevPage = state.page - 1;
        const pagination = getPagination(prevPage, state);
        state.page = pagination.page;
        state.from = pagination.from;
        state.searchAfter = getSearchAfter(breakPoints, prevPage);
      },
    },
    nextPageShown: {
      reducer: (state, action) => {
        const breakPoints = action.payload;
        const nextPage = state.page + 1;
        const pagination = getPagination(nextPage, state);
        state.page = pagination.page;
        state.from = pagination.from;
        state.searchAfter = getSearchAfter(breakPoints, nextPage);
      },
    },
    sizeChanged: {
      reducer: (state, action) => {
        state.size = enforceValues(action.payload, 'size');
      },
    },
    sortChanged: {
      reducer: (state, action) => {
        state.sort = enforceValues(action.payload, 'sort');
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('filters/filtersCleared', (state) => {
        state.dateRange = 'All';
        state.company_received_max = '';
        state.company_received_min = '';
        state.date_received_min = minDate;
        state.date_received_max = maxDate;
        state.company_received_max = '';
        state.company_received_min = '';
      })
      .addCase('routes/routeChanged', (state, action) => {
        const { params } = action.payload;
        // Set some variables from the URL
        const keys = [
          'dateRange',
          'dateInterval',
          'searchField',
          'searchText',
          'sort',
        ];
        keys.forEach((item) => {
          if (params[item]) {
            state[item] = enforceValues(params[item], item);
          }
        });

        types.dateFilters.forEach((field) => {
          if (
            typeof params[field] !== 'undefined' &&
            dayjs(params[field]).isValid()
          ) {
            state[field] = toDate(params[field]);
          }
        });

        // Handle numeric fields
        const defaultPage = coalesce(params, 'page', queryState.page);
        const defaultSize = coalesce(params, 'size', queryState.size);
        state.page = parseInt(defaultPage, 10);
        state.size = parseInt(defaultSize, 10);

        if (params.search_after) {
          state.searchAfter = params.search_after;
        }

        // Apply the date range
        if (dateRangeNoDates(params) || params.dateRange === 'All') {
          const innerAction = { payload: params.dateRange };
          querySlice.caseReducers.dateRangeChanged(state, innerAction);
        }
        alignDateRange(state);
      })
      .addMatcher(
        isAnyOf(
          /*eslint no-use-before-define: ["error", { "variables": false }]*/
          companyReceivedDateChanged,
          datesChanged,
          dateIntervalChanged,
          dateRangeChanged,
          filterAdded,
          filterRemoved,
          filterToggled,
          filtersCleared,
          filtersReplaced,
          multipleFiltersAdded,
          multipleFiltersRemoved,
          searchFieldChanged,
          searchTextChanged,
          sizeChanged,
          sortChanged,
          tabChanged,
          toggleFlagFilter,
        ),
        (state) => {
          clearPager(state);
        },
      );
  },
});

export const {
  companyReceivedDateChanged,
  datesChanged,
  dateRangeChanged,
  dateIntervalChanged,
  trendsDateWarningDismissed,
  nextPageShown,
  prevPageShown,
  searchFieldChanged,
  searchTextChanged,
  sizeChanged,
  sortChanged,
} = querySlice.actions;
export default querySlice.reducer;
