/* eslint complexity: ["error", 5] */
import * as types from '../../constants';
import {
  calculateDateRange,
  clamp,
  coalesce,
  enablePer1000,
  processUrlArrayParams,
  shortIsoFormat,
  startOfToday,
} from '../../utils';
import { enforceValues } from '../../utils/reducers';
import dayjs from 'dayjs';
import { isGreaterThanYear } from '../../utils/trends';
import { createSlice } from '@reduxjs/toolkit';
import {
  REQUERY_ALWAYS,
  REQUERY_HITS_ONLY,
  REQUERY_NEVER,
} from '../../constants';

const queryString = require('query-string');

/* eslint-disable camelcase */
export const queryState = {
  breakPoints: {},
  chartType: 'line',
  dataNormalization: types.GEO_NORM_NONE,
  dateInterval: 'Month',
  dateRange: '3y',
  date_received_max: startOfToday(),
  date_received_min: new Date(dayjs(startOfToday()).subtract(3, 'years')),
  enablePer1000: false,
  focus: '',
  from: 0,
  mapWarningEnabled: true,
  lens: 'Product',
  page: 1,
  queryString: '',
  search: '',
  searchAfter: '',
  searchField: 'all',
  searchText: '',
  size: '25',
  sort: 'created_date_desc',
  subLens: 'sub_product',
  tab: types.MODE_TRENDS,
  totalPages: 0,
  trendDepth: 5,
  trendsDateWarningEnabled: false,
};

const fieldMap = {
  searchAfter: 'search_after',
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm',
};

const trendFieldMap = {
  dateInterval: 'trend_interval',
  lens: 'lens',
  subLens: 'sub_lens',
  trendDepth: 'trend_depth',
};

const urlParams = [
  'chartType',
  'dataNormalization',
  'dateInterval',
  'dateRange',
  'focus',
  'lens',
  'searchText',
  'searchField',
  'size',
  'sort',
  'subLens',
  'tab',
];

const urlParamsInt = ['from', 'page', 'trendDepth'];

export const querySlice = createSlice({
  name: 'query',
  initialState: queryState,
  reducers: {
    processParams(state, action) {
      const params = action.payload.params;
      let processed = Object.assign({}, queryState);

      // Filter for known
      urlParams.forEach((field) => {
        if (typeof params[field] !== 'undefined') {
          processed[field] = enforceValues(params[field], field);
        }
      });

      // Handle the aggregation filters
      processUrlArrayParams(params, processed, types.knownFilters);

      // Handle date filters
      types.dateFilters.forEach((field) => {
        if (typeof params[field] !== 'undefined') {
          const d = toDate(params[field]);
          if (d) {
            processed[field] = d;
          }
        }
      });

      // Handle flag filters
      types.flagFilters.forEach((field) => {
        if (typeof params[field] !== 'undefined') {
          processed[field] = params[field] === 'true';
        }
      });

      // Handle numeric params
      urlParamsInt.forEach((field) => {
        if (typeof params[field] !== 'undefined') {
          const n = parseInt(params[field], 10);
          if (isNaN(n) === false) {
            processed[field] = enforceValues(n, field);
          }
        }
      });

      // Apply the date range
      if (dateRangeNoDates(params) || params.dateRange === 'All') {
        const innerAction = { dateRange: params.dateRange };
        processed = changeDateRange(processed, innerAction);
      }

      // this is always page 1 since we don't know breakPoints
      processed.page = 1;

      return alignDateRange(processed);
    },
    changeDateInterval: {
      reducer: (state, action) => {
        state.dateInterval = enforceValues(
          action.payload.dateInterval,
          'dateInterval'
        );
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    changeDateRange: {
      // eslint-disable-next-line complexity
      reducer: (state, action) => {
        const dateRange = enforceValues(action.payload.dateRange, 'dateRange');
        const maxDate = startOfToday();
        const res = {
          All: new Date(types.DATE_RANGE_MIN),
          '3m': new Date(dayjs(maxDate).subtract(3, 'months')),
          '6m': new Date(dayjs(maxDate).subtract(6, 'months')),
          '1y': new Date(dayjs(maxDate).subtract(1, 'year')),
          '3y': new Date(dayjs(maxDate).subtract(3, 'years')),
        };
        state.dateRange = dateRange;
        state.date_received_min = res[dateRange]
          ? res[dateRange]
          : state.date_received_min;
        state.date_received_max = maxDate;
        state.dateInterval =
          dateRange === 'All' && state.tab === types.MODE_TRENDS
            ? 'Week'
            : state.dateInterval || queryState.dateInterval;
        state.trendsDateWarningEnabled =
          dateRange === 'All' && state.tab === types.MODE_TRENDS;
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    changeDates: {
      // eslint-disable-next-line complexity
      reducer: (state, action) => {
        const fields = [
          action.payload.filterName + '_min',
          action.payload.filterName + '_max',
        ];

        let { maxDate, minDate } = action.payload;

        // If maxDate or minDate are falsy, just set the search and queryStrings and exit
        if (!maxDate || !minDate) {
          state.queryString = stateToQS(state);
          state.search = stateToURL(state);
          return state;
        }

        minDate = dayjs(minDate).isValid()
          ? new Date(dayjs(minDate).startOf('day'))
          : null;
        maxDate = dayjs(maxDate).isValid()
          ? new Date(dayjs(maxDate).startOf('day'))
          : null;

        const datesChanged =
          state[fields[0]] !== minDate || state[fields[1]] !== maxDate;
        const dateRange = calculateDateRange(minDate, maxDate);

        if (dateRange && datesChanged) {
          state.dateRange = dateRange;
        } else {
          delete state.dateRange;
        }

        state[fields[0]] = minDate || state[fields[0]];
        state[fields[1]] = maxDate || state[fields[1]];
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    toggleFlagFilter: {
      reducer: (state, action) => {
        state[action.payload.filterName] = Boolean(
          !state[action.payload.filterName]
        );
        if (!state[action.payload.filterName])
          delete state[action.payload.filterName];
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    changeSearchField: {
      reducer: (state, action) => {
        const pagination = getPagination(1, state);
        return {
          ...state,
          ...pagination,
          searchField: action.payload.searchField,
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    changeSearchText: {
      reducer: (state, action) => {
        const pagination = getPagination(1, state);
        return {
          ...state,
          ...pagination,
          searchText: action.payload.searchText,
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    addMultipleFilters: {
      reducer: (state, action) => {
        const name = action.payload.filterName;
        const a = coalesce(state, name, []);

        // Add the filters
        action.payload.values.forEach((x) => {
          if (a.indexOf(x) === -1) {
            a.push(x);
          }
        });

        state[name] = a;
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    toggleFilter: {
      reducer: (state, action) => {
        return {
          ...state,
          [action.payload.filterName]: filterArrayAction(
            state[action.payload.filterName],
            action.payload.filterValue.key
          ),
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    addStateFilter: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload.selectedState;
        if (!stateFilters.includes(abbr)) {
          stateFilters.push(abbr);
        }

        state.state = stateFilters;
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    clearStateFilter: {
      reducer: (state) => {
        state.state = [];
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    showStateComplaints: {
      reducer: (state) => {
        state.tab = types.MODE_LIST;
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    removeStateFilter: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload.selectedState;

        state.state = stateFilters.filter((o) => o !== abbr);
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    removeAllFilters: {
      reducer: (state) => {
        const allFilters = types.knownFilters.concat(
          types.dateFilters,
          types.flagFilters
        );

        if (state.searchField === types.NARRATIVE_SEARCH_FIELD) {
          const idx = allFilters.indexOf('has_narrative');
          allFilters.splice(idx, 1);
        }

        allFilters.forEach((kf) => {
          if (kf in state && kf !== 'has_narrative') {
            delete state[kf];
          }
        });

        // set date range to All
        // adjust date filter for max and min ranges
        state.dateRange = 'All';
        /* eslint-disable camelcase */
        state.date_received_min = new Date(types.DATE_RANGE_MIN);
        state.date_received_max = startOfToday();
        state.focus = '';
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
        state.from = 0;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    addFilter: {
      reducer: (state, action) => {
        const newState = { ...state };
        if (action.payload.filterName === 'has_narrative') {
          newState.has_narrative = true;
        } else if (action.payload.filterName in newState) {
          const idx = newState[action.payload.filterName].indexOf(
            action.payload.filterValue
          );
          if (idx === -1) {
            newState[action.payload.filterName].push(
              action.payload.filterValue
            );
          }
        } else {
          newState[action.payload.filterName] = [action.payload.filterValue];
        }

        return newState;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    removeFilter: {
      reducer: (state, action) => {
        if (action.payload.filterName === 'has_narrative') {
          delete state.has_narrative;
        } else if (action.payload.filterName in state) {
          const idx = state[action.payload.filterName].indexOf(
            action.payload.filterValue
          );
          if (idx !== -1) {
            state[action.payload.filterName].splice(idx, 1);
          }
        }
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    replaceFilters: {
      reducer: (state, action) => {
        // de-dupe the filters in case we messed up somewhere
        state[action.payload.filterName] = [...new Set(action.payload.values)];
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    removeMultipleFilters: {
      reducer: (state, action) => {
        // remove the focus if it exists in one of the filter values we are removing
        state.focus = action.payload.values.includes(state.focus)
          ? ''
          : state.focus || '';

        if (state[action.payload.filterName]) {
          action.payload.values.forEach((x) => {
            const idx = state[action.payload.filterName].indexOf(x);
            if (idx !== -1) {
              state[action.payload.filterName].splice(idx, 1);
            }
          });
        }
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    dismissMapWarning: {
      reducer: (state) => {
        state.mapWarningEnabled = false;
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    dismissTrendsDateWarning: {
      reducer: (state) => {
        state.trendsDateWarningEnabled = false;
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    prevPageShown: {
      reducer: (state) => {
        // don't let them go lower than 1
        const page = clamp(state.page - 1, 1, state.page);
        const pagination = getPagination(page, state);
        return {
          ...state,
          ...pagination,
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_HITS_ONLY,
          },
        };
      },
    },
    nextPageShown: {
      reducer: (state) => {
        // don't let them go past the total num of pages
        const page = clamp(state.page + 1, 1, state.totalPages);
        const pagination = getPagination(page, state);
        return {
          ...state,
          ...pagination,
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_HITS_ONLY,
          },
        };
      },
    },
    changeSize: {
      reducer: (state, action) => {
        const pagination = getPagination(1, state);
        return {
          ...state,
          ...pagination,
          size: action.payload.size,
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_HITS_ONLY,
          },
        };
      },
    },
    changeSort: {
      reducer: (state, action) => {
        const pagination = getPagination(1, state);
        const sort = enforceValues(action.payload.sort, 'sort');
        return {
          ...state,
          ...pagination,
          sort,
        };
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_HITS_ONLY,
          },
        };
      },
    },
    changeTab: {
      reducer: (state, action) => {
        const tab = enforceValues(action.payload, 'tab');
        state.focus = tab === types.MODE_TRENDS ? state.focus : '';
        state.tab = tab;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_HITS_ONLY,
          },
        };
      },
    },
    updateTotalPages(state, action) {
      const { _meta, hits } = action.data;
      const totalPages = Math.ceil(hits.total.value / state.size);
      // reset pager to 1 if the number of total pages is less than current page
      const { break_points: breakPoints } = _meta;
      const page = state.page > totalPages ? totalPages : state.page;
      return {
        ...state,
        breakPoints,
        page,
        totalPages: Object.keys(breakPoints).length + 1,
      };
    },
    changeDepth: {
      reducer: (state, action) => {
        state.trendDepth = action.payload.depth;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    resetDepth: {
      reducer: (state) => {
        state.trendDepth = 5;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    changeFocus: {
      reducer: (state, action) => {
        const { focus, filterValues, lens } = action.payload;
        const filterKey = lens.toLowerCase();
        const activeFilters = [];

        if (filterKey === 'company') {
          activeFilters.push(focus);
        } else {
          filterValues.forEach((o) => {
            activeFilters.push(o);
          });
        }
        state[filterKey] = activeFilters;
        state.focus = focus;
        state.lens = lens;
        state.tab = types.MODE_TRENDS;
        state.trendDepth = 25;
      },
      prepare: (payload) => {
        return {
          payload,
        };
      },
    },
    removeFocus(state) {
      const { lens } = state;
      const filterKey = lens.toLowerCase();
      return {
        ...state,
        [filterKey]: [],
        focus: '',
        tab: types.MODE_TRENDS,
        trendDepth: 5,
      };
    },
    changeDataLens(state, action) {
      const lens = enforceValues(action.lens, 'lens');

      return {
        ...state,
        focus: '',
        lens,
        trendDepth: lens === 'Company' ? 10 : 5,
      };
    },
    changeDataSubLens(state, action) {
      return {
        ...state,
        subLens: action.subLens.toLowerCase(),
      };
    },
    updateChartType(state, action) {
      return {
        ...state,
        chartType: action.chartType,
      };
    },
    updateDataNormalization: {
      reducer: (state, action) => {
        state.dataNormalization = enforceValues(
          action.payload.value,
          'dataNormalization'
        );
        state.queryString = stateToQS(state);
        state.search = stateToURL(state);
        state.enablePer1000 =
          state.dataNormalization === types.GEO_NORM_PER1000;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('detail/complaintDetailCalled', (state) => {
        state.search = stateToURL(state);
        state.queryString = stateToQS(state);
      })
      .addCase('trends/updateChartType', (state, action) => {
        state.chartType = action.payload.chartType;
        state.search = stateToURL(state);
        state.queryString = stateToQS(state);
      })
      .addCase('trends/updateDataLens', (state, action) => {
        state.focus = '';
        state.lens = enforceValues(action.payload.lens, 'lens');
        switch (state.lens) {
          case 'Company':
            state.subLens = 'product';
            break;
          case 'Product':
            state.subLens = 'sub_product';
            break;
          default:
            state.subLens = '';
        }
        state.trendDepth = state.lens === 'Company' ? 10 : 5;
        state.search = stateToURL(state);
        state.queryString = stateToQS(state);
      })
      .addCase('trends/updateDataSubLens', (state, action) => {
        state.subLens = action.payload.subLens.toLowerCase();
        state.search = stateToURL(state);
        state.queryString = stateToQS(state);
      })
      .addCase('trends/changeFocus', (state, action) => {
        const { focus, filterValues, lens } = action.payload;
        const filterKey = lens.toLowerCase();
        const activeFilters = [];

        if (filterKey === 'company') {
          activeFilters.push(focus);
        } else {
          filterValues.forEach((o) => {
            activeFilters.push(o);
          });
        }

        return {
          ...state,
          [filterKey]: activeFilters,
          focus,
          lens,
          tab: types.MODE_TRENDS,
          trendDepth: 25,
          queryString: stateToQS(state),
          search: stateToURL(state),
        };
      })
      .addCase('trends/removeFocus', (state) => {
        const { lens } = queryState;
        const filterKey = lens.toLowerCase();
        return {
          ...state,
          [filterKey]: [],
          focus: '',
          tab: types.MODE_TRENDS,
          trendDepth: 5,
          queryString: stateToQS(state),
          search: stateToURL(state),
        };
      });
  },
});

// ----------------------------------------------------------------------------
// Helper functions

/* eslint-disable complexity */

/**
 * Makes sure the date range reflects the actual dates selected
 * @param {object} state - the raw, unvalidated state
 * @returns {object} the validated state
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
    return state;
  }

  const rangeMap = {
    '3y': new Date(dayjs(dateMax).subtract(3, 'years')),
    '3m': new Date(dayjs(dateMax).subtract(3, 'months')),
    '6m': new Date(dayjs(dateMax).subtract(6, 'months')),
    '1y': new Date(dayjs(dateMax).subtract(1, 'year')),
  };
  const ranges = Object.keys(rangeMap);
  let matched = false;

  for (let i = 0; i < ranges.length && !matched; i++) {
    const range = ranges[i];

    if (dayjs(dateMin).isSame(rangeMap[range], 'day')) {
      state.dateRange = range;
      matched = true;
    }
  }

  // No matches, clear
  if (!matched) {
    state.dateRange = '';
  }

  return state;
}

/* eslint-enable complexity */

/**
 * Check for a common case where there is a date range but no dates
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
 * @param {string} value - Hopefully, an ISO-8601 formatted string
 * @returns {Date} The parsed and validated date, or null
 */
export function toDate(value) {
  if (isNaN(Date.parse(value))) {
    return null;
  }

  // Adjust UTC to local timezone
  // This code adjusts for daylight saving time
  // but does not work for locations east of Greenwich
  const utcDate = new Date(value);
  const localTimeThen = new Date(
    utcDate.getFullYear(),
    utcDate.getMonth(),
    utcDate.getDate() + 1
  );

  return localTimeThen;
}

/**
 * Makes sure that we have a valid dateInterval is selected, or moves to week
 * when the date range > 1yr
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
 * defaults create new array if param doesn't exist yet
 * if the value doesn't exist in the array, pushes
 * if value exists in the array, filters.
 * @param {Array} target - the current filter
 * @param {string} val - the filter to toggle
 * @returns {Array} a cast copy to avoid any state mutation
 */
export function filterArrayAction(target = [], val) {
  if (target.indexOf(val) === -1) {
    target.push(val);
  } else {
    target = target.filter(function (value) {
      return value !== val;
    });
  }
  return [...target];
}

/**
 * gets the pagination state
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

/**
 * Get search results after specified page
 * @param {object} state - the current state in the Redux store
 * @param {number} page - page number
 * @returns {Array} array containing complaint's received date and id
 */
function getSearchAfter(state, page) {
  const { breakPoints } = state;
  return breakPoints && breakPoints[page] ? breakPoints[page].join('_') : '';
}

/**
 * helper function to remove any empty arrays from known filter sets
 * @param {object} state - we need to clean up
 */
export function pruneEmptyFilters(state) {
  // go through the object and delete any filter keys that have no values in it
  types.knownFilters.forEach((o) => {
    if (Array.isArray(state[o]) && state[o].length === 0) {
      delete state[o];
    }
  });
}

// ----------------------------------------------------------------------------
// Query String Builder

/**
 * Converts a set of key/value pairs into a query string for API calls
 * @param {string} state - a set of key/value pairs
 * @returns {string} a formatted query string
 */
export function stateToQS(state) {
  const params = {};
  const fields = Object.keys(state);

  // Copy over the fields
  // eslint-disable-next-line complexity
  fields.forEach((field) => {
    // Do not include empty fields
    if (!state[field]) {
      return;
    }

    // Avoid recursion
    if (field === 'queryString') {
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
    } else if (trendFieldMap[field]) {
      params[trendFieldMap[field]] = value.toString().toLowerCase();
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
    types.flagFilters
  );

  const paramMap = {
    List: [
      'frm',
      'search_after',
      'size',
      'sort',
      'format',
      'no_aggs',
      'no_highlight',
    ],
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
    exportParams.forEach((p) => {
      /* istanbul ignore else */
      if (!filterKeys.includes(p)) {
        filterKeys.push(p);
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
 * Converts a set of key/value pairs into a query string for URL history.
 * @param {string} state - a set of key/value pairs
 * @returns {string} a formatted query string
 */
export function stateToURL(state) {
  const params = {};
  const fields = Object.keys(state);

  // Copy over the fields
  // eslint-disable-next-line complexity
  fields.forEach((field) => {
    // Do not include empty fields
    if (!state[field]) {
      return;
    }

    // Exclude these params from the browser url
    if (['queryString', 'url', 'breakPoints'].includes(field)) {
      return;
    }

    let value = state[field];

    // Process date filters url-friendly display
    if (types.dateFilters.indexOf(field) !== -1) {
      value = shortIsoFormat(value);
    }
    params[field] = value;
  });

  // list of API params
  // https://cfpb.github.io/api/ccdb/api/index.html#/
  const commonParams = [].concat(
    ['searchText', 'searchField', 'tab'],
    types.dateFilters,
    types.knownFilters,
    types.flagFilters
  );

  const paramMap = {
    List: ['sort', 'size', 'page'],
    Map: ['dataNormalization', 'dateRange', 'expandedRows'],
    Trends: [
      'chartType',
      'dateRange',
      'dateInterval',
      'expandedRows',
      'lens',
      'focus',
      'subLens',
    ],
  };

  const filterKeys = [].concat(commonParams, paramMap[params.tab]);

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
 * helper function to check if per1000 & map warnings should be enabled
 * @param {object} queryState - state we need to validate
 */
export function validatePer1000(queryState) {
  queryState.enablePer1000 = enablePer1000(queryState);
  if (queryState.enablePer1000) {
    queryState.mapWarningEnabled = true;
  }
  // if we enable per1k then don't reset it
  queryState.dataNormalization = queryState.enablePer1000
    ? queryState.dataNormalization || types.GEO_NORM_NONE
    : types.GEO_NORM_NONE;
}

/**
 * helper function to clear out breakpoints, reset page to 1 when any sort
 * or filter changes the query
 * @param {object} state - redux state
 */
export function resetBreakpoints(state) {
  state.breakPoints = {};
  state.from = 0;
  state.page = 1;
  state.searchAfter = '';
}

export const {
  processParams,
  changeDateInterval,
  changeDateRange,
  changeDates,
  toggleFlagFilter,
  changeSearchField,
  changeSearchText,
  addMultipleFilters,
  toggleFilter,
  addStateFilter,
  clearStateFilter,
  showStateComplaints,
  removeStateFilter,
  removeAllFilters,
  addFilter,
  removeFilter,
  replaceFilters,
  removeMultipleFilters,
  dismissMapWarning,
  dismissTrendsDateWarning,
  prevPageShown,
  nextPageShown,
  changeSize,
  changeSort,
  changeTab,
  updateTotalPages,
  changeDepth,
  resetDepth,
  changeFocus,
  removeFocus,
  changeDataLens,
  changeDataSubLens,
  updateChartType,
  updateDataNormalization,
} = querySlice.actions;
export default querySlice.reducer;
