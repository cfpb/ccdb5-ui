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
import { enforceValues, validateTrendsReducer } from '../../utils/reducers';
import * as actions from '../../actions';
import dayjs from 'dayjs';
import { isGreaterThanYear } from '../../utils/trends';
import queryString from 'query-string';

/* eslint-disable camelcase */
export const defaultQuery = {
  breakPoints: {},
  chartType: 'line',
  dataNormalization: types.GEO_NORM_NONE,
  dateInterval: 'Month',
  dateRange: '3y',
  date_received_max: startOfToday(),
  date_received_min: new Date(dayjs(startOfToday()).subtract(3, 'years')),
  enablePer1000: true,
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

// ----------------------------------------------------------------------------
// Helper functions

/* eslint-disable complexity */

/**
 * Makes sure the date range reflects the actual dates selected
 *
 * @param {object} state - the raw, unvalidated state
 * @returns {object} the validated state
 */
export function alignDateRange(state) {
  // Shorten the input field names
  const dateMax = state.date_received_max;
  const dateMin = state.date_received_min;

  // All
  if (
    dayjs(dateMax).isSame(defaultQuery.date_received_max) &&
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

  return state;
}

/* eslint-enable complexity */

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
    utcDate.getDate() + 1,
  );

  return localTimeThen;
}

/**
 * Processes an object of key/value strings into the correct internal format
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the key/value pairs
 * @returns {object} a filtered set of key/value pairs with the values set to
 * the correct type
 */
function processParams(state, action) {
  const params = action.params;
  let processed = Object.assign({}, defaultQuery);

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
      const date = toDate(params[field]);
      if (date) {
        processed[field] = date;
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
      const num = parseInt(params[field], 10);
      if (isNaN(num) === false) {
        processed[field] = enforceValues(num, field);
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
}

/**
 * update state based on changeDateInterval action
 *
 * @param {object} state - current redux state
 * @param {object} action - command executed
 * @returns {object} new state in redux
 */
function changeDateInterval(state, action) {
  const dateInterval = enforceValues(action.dateInterval, 'dateInterval');
  return {
    ...state,
    dateInterval,
  };
}

/**
 * Change a date range filter according to selected range
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the date range
 * @returns {object} the new state for the Redux store
 */
export function changeDateRange(state, action) {
  const dateRange = enforceValues(action.dateRange, 'dateRange');
  const newState = {
    ...state,
    dateRange,
  };

  const maxDate = startOfToday();

  const res = {
    All: new Date(types.DATE_RANGE_MIN),
    '3m': new Date(dayjs(maxDate).subtract(3, 'months')),
    '6m': new Date(dayjs(maxDate).subtract(6, 'months')),
    '1y': new Date(dayjs(maxDate).subtract(1, 'year')),
    '3y': new Date(dayjs(maxDate).subtract(3, 'years')),
  };

  /* istanbul ignore else */
  if (res[dateRange]) {
    newState.date_received_min = res[dateRange];
  }

  newState.date_received_max = maxDate;

  return newState;
}

/**
 * Change a date range filter
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the date range to change
 * @returns {object} the new state for the Redux store
 */
export function changeDates(state, action) {
  const fields = [action.filterName + '_min', action.filterName + '_max'];

  let { maxDate, minDate } = action;

  minDate = dayjs(minDate).isValid()
    ? new Date(dayjs(minDate).startOf('day'))
    : null;
  maxDate = dayjs(maxDate).isValid()
    ? new Date(dayjs(maxDate).startOf('day'))
    : null;

  const newState = {
    ...state,
    [fields[0]]: minDate,
    [fields[1]]: maxDate,
  };

  // Remove nulls
  fields.forEach((field) => {
    if (newState[field] === null) {
      delete newState[field];
    }
  });

  const dateRange = calculateDateRange(minDate, maxDate);
  if (dateRange) {
    newState.dateRange = dateRange;
  } else {
    delete newState.dateRange;
  }

  return newState;
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
 * Change a boolean flag filter
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the value to change
 * @returns {object} the new state for the Redux store
 */
export function toggleFlagFilter(state, action) {
  /* eslint-disable camelcase */
  const newState = {
    ...state,
    [action.filterName]: Boolean(!state[action.filterName]),
  };

  /* eslint-enable camelcase */

  // Remove nulls
  const fields = ['has_narrative'];
  fields.forEach((field) => {
    if (!newState[field]) {
      delete newState[field];
    }
  });

  return newState;
}

/**
 * updates when search text params are changed
 *
 * @param {object} state - current state in redux
 * @param {object} action - payload with search text and field
 * @returns {object} updated state for redux
 */
export function changeSearchField(state, action) {
  const pagination = getPagination(1, state);
  return {
    ...state,
    ...pagination,
    searchField: action.searchField,
  };
}

/**
 * updates when search text params are changed
 *
 * @param {object} state - current state in redux
 * @param {object} action - payload with search text and field
 * @returns {object} updated state for redux
 */
export function changeSearchText(state, action) {
  const pagination = getPagination(1, state);
  return {
    ...state,
    ...pagination,
    searchText: action.searchText,
  };
}

/**
 * Adds new filters to the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filters to add
 * @returns {object} the new state for the Redux store
 */
export function addMultipleFilters(state, action) {
  const newState = { ...state };
  const name = action.filterName;
  const obj = coalesce(newState, name, []);

  // Add the filters
  action.values.forEach((val) => {
    if (obj.indexOf(val) === -1) {
      obj.push(val);
    }
  });

  newState[name] = obj;

  return newState;
}

/**
 * defaults create new array if param doesn't exist yet
 * if the value doesn't exist in the array, pushes
 * if value exists in the array, filters.
 *
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
 * Toggles a filter in the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filters to change
 * @returns {object} the new state for the Redux store
 */
export function toggleFilter(state, action) {
  const newState = {
    ...state,
    [action.filterName]: filterArrayAction(
      state[action.filterName],
      action.filterValue.key,
    ),
  };

  return newState;
}

/**
 * adds a state filter in the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filters to change
 * @returns {object} the new state for the Redux store
 */
export function addStateFilter(state, action) {
  const stateFilters = coalesce(state, 'state', []);
  const { abbr } = action.selectedState;
  if (!stateFilters.includes(abbr)) {
    stateFilters.push(abbr);
  }

  const newState = {
    ...state,
    state: stateFilters,
  };

  return newState;
}

/**
 * removes all state filters in the current set
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function clearStateFilter(state) {
  const newState = {
    ...state,
    state: [],
  };

  return newState;
}

/**
 * only applies the single state filter and switches view mode to complaints
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function showStateComplaints(state) {
  return {
    ...state,
    tab: types.MODE_LIST,
  };
}

/**
 * removes one state filters in the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filters to change
 * @returns {object} the new state for the Redux store
 */
export function removeStateFilter(state, action) {
  const stateFilters = coalesce(state, 'state', []);
  const { abbr } = action.selectedState;

  const newState = {
    ...state,
    state: stateFilters.filter((state) => state !== abbr),
  };

  return newState;
}

/**
 * Removes all filters from the current set
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function removeAllFilters(state) {
  const newState = { ...state };

  const allFilters = types.knownFilters.concat(
    types.dateFilters,
    types.flagFilters,
  );

  if (state.searchField === types.NARRATIVE_SEARCH_FIELD) {
    const idx = allFilters.indexOf('has_narrative');
    allFilters.splice(idx, 1);
  }

  allFilters.forEach((kf) => {
    if (kf in newState) {
      delete newState[kf];
    }
  });

  // set date range to All
  // adjust date filter for max and min ranges
  newState.dateRange = 'All';
  /* eslint-disable camelcase */
  newState.date_received_min = new Date(types.DATE_RANGE_MIN);
  newState.date_received_max = startOfToday();
  newState.focus = '';

  return newState;
}

/**
 * Adds a filter to the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filter to add
 * @returns {object} the new state for the Redux store
 */
function addFilter(state, action) {
  const newState = { ...state };
  if (action.filterName === 'has_narrative') {
    newState.has_narrative = true;
  } else if (action.filterName in newState) {
    const idx = newState[action.filterName].indexOf(action.filterValue);
    if (idx === -1) {
      newState[action.filterName].push(action.filterValue);
    }
  } else {
    newState[action.filterName] = [action.filterValue];
  }

  return newState;
}

/**
 * Removes a filter from the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filter to remove
 * @returns {object} the new state for the Redux store
 */
function removeFilter(state, action) {
  const newState = { ...state };
  if (action.filterName === 'has_narrative') {
    delete newState.has_narrative;
  } else if (action.filterName in newState) {
    const idx = newState[action.filterName].indexOf(action.filterValue);
    if (idx !== -1) {
      newState[action.filterName].splice(idx, 1);
    }
  }

  return newState;
}

/**
 * replaces filters with whatever we want
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filter to remove
 * @returns {object} the new state for the Redux store
 */
function replaceFilters(state, action) {
  const newState = { ...state };
  // de-dupe the filters in case we messed up somewhere
  newState[action.filterName] = [...new Set(action.values)];
  return newState;
}

/**
 * Removes multiple filters from the current set
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the payload containing the filters to remove
 * @returns {object} the new state for the Redux store
 */
function removeMultipleFilters(state, action) {
  const newState = { ...state };

  // remove the focus if it exists in one of the filter values we are removing
  newState.focus = action.values.includes(state.focus) ? '' : state.focus || '';
  let obj = newState[action.filterName];

  if (obj) {
    action.values.forEach((val) => {
      const idx = obj.indexOf(val);
      if (idx !== -1) {
        obj = [...obj.slice(0, idx), ...obj.slice(idx + 1)];
      }
    });
    newState[action.filterName] = obj;
  }

  return newState;
}

/**
 * Handler for the dismiss map warning action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function dismissMapWarning(state) {
  return {
    ...state,
    mapWarningEnabled: false,
  };
}

/**
 * Handler for the dismiss trends warning action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function dismissTrendsDateWarning(state) {
  return {
    ...state,
    trendsDateWarningEnabled: false,
  };
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

/**
 * Update state based on the sort order changed action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function prevPage(state) {
  // don't let them go lower than 1
  const page = clamp(state.page - 1, 1, state.page);
  const pagination = getPagination(page, state);
  return {
    ...state,
    ...pagination,
  };
}

/**
 * Update state based on the sort order changed action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function nextPage(state) {
  // don't let them go past the total num of pages
  const page = clamp(state.page + 1, 1, state.totalPages);
  const pagination = getPagination(page, state);
  return {
    ...state,
    ...pagination,
  };
}

/**
 * Get search results after specified page
 *
 * @param {object} state - the current state in the Redux store
 * @param {number} page - page number
 * @returns {Array} array containing complaint's received date and id
 */
function getSearchAfter(state, page) {
  const { breakPoints } = state;
  return breakPoints && breakPoints[page] ? breakPoints[page].join('_') : '';
}

/**
 * update state based on changeSize action
 *
 * @param {object} state - current redux state
 * @param {object} action - command executed
 * @returns {object} new state in redux
 */
function changeSize(state, action) {
  const pagination = getPagination(1, state);
  return {
    ...state,
    ...pagination,
    size: action.size,
  };
}

/**
 * update state based on changeSort action
 *
 * @param {object} state - current redux state
 * @param {object} action - command executed
 * @returns {object} new state in redux
 */
function changeSort(state, action) {
  const pagination = getPagination(1, state);
  const sort = enforceValues(action.sort, 'sort');
  return {
    ...state,
    ...pagination,
    sort,
  };
}

/**
 * update state based on tabChanged action
 *
 * @param {object} state - current redux state
 * @param {object} action - command executed
 * @returns {object} new state in redux
 */
function changeTab(state, action) {
  const tab = enforceValues(action.tab, 'tab');
  return {
    ...state,
    focus: tab === types.MODE_TRENDS ? state.focus : '',
    tab,
  };
}

/**
 * Upon complaint received, we need to make sure to reset the page
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {{page: number, totalPages: number}} the new state
 */
function updateTotalPages(state, action) {
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
}

/**
 * Handler for the depth changed action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function changeDepth(state, action) {
  return {
    ...state,
    trendDepth: action.depth,
  };
}

/**
 * Handler for the depth reset action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function resetDepth(state) {
  return {
    ...state,
    trendDepth: 5,
  };
}

/**
 * Handler for the focus selected action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function changeFocus(state, action) {
  const { focus, filterValues, lens } = action;
  const filterKey = lens.toLowerCase();
  const activeFilters = [];

  if (filterKey === 'company') {
    activeFilters.push(focus);
  } else {
    filterValues.forEach((val) => {
      activeFilters.push(val);
    });
  }

  return {
    ...state,
    [filterKey]: activeFilters,
    focus,
    lens,
    tab: types.MODE_TRENDS,
    trendDepth: 25,
  };
}

/**
 * Handler for the focus selected action
 *
 * @param {object} state - the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function removeFocus(state) {
  const { lens } = state;
  const filterKey = lens.toLowerCase();
  return {
    ...state,
    [filterKey]: [],
    focus: '',
    tab: types.MODE_TRENDS,
    trendDepth: 5,
  };
}

/**
 * update state based on changeDataLens action
 *
 * @param {object} state - current redux state
 * @param {object} action - command executed
 * @returns {object} new state in redux
 */
function changeDataLens(state, action) {
  const lens = enforceValues(action.lens, 'lens');

  return {
    ...state,
    focus: '',
    lens,
    trendDepth: lens === 'Company' ? 10 : 5,
  };
}

/**
 * update state based on changeDataSubLens action
 *
 * @param {object} state - current redux state
 * @param {object} action - command executed
 * @returns {object} new state in redux
 */
function changeDataSubLens(state, action) {
  return {
    ...state,
    subLens: action.subLens.toLowerCase(),
  };
}

/**
 * Handler for the update chart type action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateChartType(state, action) {
  return {
    ...state,
    chartType: action.chartType,
  };
}

/**
 * Handler for the update data normalization action
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDataNormalization(state, action) {
  const dataNormalization = enforceValues(action.value, 'dataNormalization');
  return {
    ...state,
    dataNormalization,
  };
}

/**
 * helper function to remove any empty arrays from known filter sets
 *
 * @param {object} state - we need to clean up
 */
export function pruneEmptyFilters(state) {
  // go through the object and delete any filter keys that have no values in it
  types.knownFilters.forEach((filter) => {
    if (Array.isArray(state[filter]) && state[filter].length === 0) {
      delete state[filter];
    }
  });
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
    if (types.dateFilters.includes(field)) {
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
    types.flagFilters,
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
 * Converts a set of key/value pairs into a query string for URL history.
 *
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
    types.flagFilters,
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
 *
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
 *
 * @param {object} state - redux state
 */
export function resetBreakpoints(state) {
  state.breakPoints = {};
  state.from = 0;
  state.page = 1;
  state.searchAfter = '';
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
 * Creates a hash table of action types to handlers
 *
 * @returns {object} a map of types to functions
 */
// eslint-disable-next-line max-statements, require-jsdoc
export function _buildHandlerMap() {
  const handlers = {};
  handlers[actions.CHART_TYPE_CHANGED] = updateChartType;
  handlers[actions.COMPLAINTS_RECEIVED] = updateTotalPages;
  handlers[actions.DATA_LENS_CHANGED] = changeDataLens;
  handlers[actions.DATA_NORMALIZATION_SELECTED] = updateDataNormalization;
  handlers[actions.DATA_SUBLENS_CHANGED] = changeDataSubLens;
  handlers[actions.DATE_INTERVAL_CHANGED] = changeDateInterval;
  handlers[actions.DATE_RANGE_CHANGED] = changeDateRange;
  handlers[actions.DATES_CHANGED] = changeDates;
  handlers[actions.DEPTH_CHANGED] = changeDepth;
  handlers[actions.DEPTH_RESET] = resetDepth;
  handlers[actions.FILTER_ALL_REMOVED] = removeAllFilters;
  handlers[actions.FILTER_CHANGED] = toggleFilter;
  handlers[actions.FILTER_FLAG_CHANGED] = toggleFlagFilter;
  handlers[actions.FILTER_MULTIPLE_ADDED] = addMultipleFilters;
  handlers[actions.FILTER_MULTIPLE_REMOVED] = removeMultipleFilters;
  handlers[actions.FILTER_ADDED] = addFilter;
  handlers[actions.FILTER_REMOVED] = removeFilter;
  handlers[actions.FILTER_REPLACED] = replaceFilters;
  handlers[actions.FOCUS_CHANGED] = changeFocus;
  handlers[actions.FOCUS_REMOVED] = removeFocus;
  handlers[actions.MAP_WARNING_DISMISSED] = dismissMapWarning;
  handlers[actions.NEXT_PAGE_SHOWN] = nextPage;
  handlers[actions.PREV_PAGE_SHOWN] = prevPage;
  handlers[actions.SIZE_CHANGED] = changeSize;
  handlers[actions.SORT_CHANGED] = changeSort;
  handlers[actions.STATE_COMPLAINTS_SHOWN] = showStateComplaints;
  handlers[actions.STATE_FILTER_ADDED] = addStateFilter;
  handlers[actions.STATE_FILTER_CLEARED] = clearStateFilter;
  handlers[actions.STATE_FILTER_REMOVED] = removeStateFilter;
  handlers[actions.TAB_CHANGED] = changeTab;
  handlers[actions.TRENDS_DATE_WARNING_DISMISSED] = dismissTrendsDateWarning;
  handlers[actions.URL_CHANGED] = processParams;
  handlers[actions.SEARCH_TEXT_CHANGED] = changeSearchText;
  handlers[actions.SEARCH_FIELD_CHANGED] = changeSearchField;

  return handlers;
}

const _handlers = _buildHandlerMap();

/**
 * Routes an action to an appropriate handler
 *
 * @param {object} state - the current state in the Redux store
 * @param {object} action - the command being executed
 * @returns {object} the new state for the Redux store
 */
function handleSpecificAction(state, action) {
  if (action.type in _handlers) {
    return _handlers[action.type](state, action);
  }

  return state;
}

const query = (state = defaultQuery, action) => {
  const newState = handleSpecificAction(state, action);

  const breakPointActions = [
    actions.DATE_INTERVAL_CHANGED,
    actions.DATE_RANGE_CHANGED,
    actions.DATES_CHANGED,
    actions.FILTER_ALL_REMOVED,
    actions.FILTER_CHANGED,
    actions.FILTER_FLAG_CHANGED,
    actions.FILTER_MULTIPLE_ADDED,
    actions.FILTER_MULTIPLE_REMOVED,
    actions.FILTER_ADDED,
    actions.FILTER_REMOVED,
    actions.FILTER_REPLACED,
    actions.SEARCH_FIELD_CHANGED,
    actions.SEARCH_TEXT_CHANGED,
    actions.SIZE_CHANGED,
    actions.SORT_CHANGED,
    actions.TAB_CHANGED,
  ];
  // these actions cause the page to reset to 1 and also clear out breakpts
  if (breakPointActions.includes(action.type)) {
    resetBreakpoints(newState);
  }

  if (newState.tab === types.MODE_MAP) {
    // only update the map warning items when we're on the map tab
    validatePer1000(newState);
  }

  if (newState.tab === types.MODE_TRENDS) {
    // swap date interval in cases where the date range is > 1yr
    validateDateInterval(newState);
    validateTrendsReducer(newState);
  }

  // remove any filter keys with empty array
  pruneEmptyFilters(newState);

  const qs = stateToQS(newState);
  newState.queryString = qs === '?' ? '' : qs;
  newState.search = stateToURL(newState);

  return newState;
};

export default query;
