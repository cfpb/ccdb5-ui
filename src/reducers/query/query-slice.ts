import * as types from '../../constants';
import { minDate } from '../../constants';
import {
  calculateDateRange,
  setMaxDate,
  shortIsoFormat,
  startOfToday,
} from '../../utils';
import { enforceValues } from '../../utils/reducers';
import dayjs from 'dayjs';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import { formatDate } from '../../utils/format-date';
import {
  filterAdded,
  filterRemoved,
  filtersCleared,
  filtersReplaced,
  filterToggled,
  multipleFiltersAdded,
  multipleFiltersRemoved,
} from '../filters/filters-slice';
import { routeChanged } from '../routes/routes-slice';
import queryString from 'query-string';
import { complaintsApi } from '../../api/complaints';
import type { QueryState } from '../../types/root-state';

// ----------------------------------------------------------------------------
// Helper functions

/**
 * Makes sure the date range reflects the actual dates selected
 *
 * @param {object} state - the raw, unvalidated state
 * @returns {object|undefined} the validated state, or early exit
 */
export function alignDateRange(state: QueryState) {
  // Shorten the input field names
  const dateLastIndexed = state.dateLastIndexed || startOfToday();
  const dateMax = state.date_received_max;
  const dateMin = state.date_received_min;

  // All
  if (
    dayjs(dateMax).isSame(dateLastIndexed) &&
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
  let isMatched = false;

  for (let idx = 0; !isMatched && idx < ranges.length; idx++) {
    const range = ranges[idx];

    if (
      dayjs(dateMin).isSame(rangeMap[range as keyof typeof rangeMap], 'day')
    ) {
      state.dateRange = range;
      isMatched = true;
    }
  }

  // No matches, clear
  if (!isMatched) {
    state.dateRange = '';
  }
}

/**
 * Check for a common case where there is a date range but no dates
 *
 * @param {object} params - a set of URL parameters
 * @returns {boolean} true if the params meet this condition
 */
export function dateRangeNoDates(params: Record<string, unknown>) {
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
export function toDate(value: unknown): string | null {
  if (dayjs(value as string).isValid()) {
    return String(formatDate(value as string) ?? '');
  }

  return null;
}

const formatDayjs = (value: dayjs.Dayjs): string =>
  String(formatDate(value.toDate()) ?? '');

/**
 * Get search results after specified page
 *
 * @param {object} breakPoints - breakPoints from the List API slice
 * @param {number} page - page number
 * @returns {Array} array containing complaint's received date and id
 */
function getSearchAfter(
  breakPoints: Record<number, string[]> | QueryState,
  page: number,
): string {
  if (!breakPoints || !Object.hasOwn(breakPoints, page)) {
    return '';
  }
  const point = (breakPoints as Record<number, string[]>)[page];
  return point ? point.join('_') : '';
}

/**
 * gets the pagination state
 *
 * @param {number} page - the page we are on
 * @param {object} state - the redux state
 * @returns {object} contains the from and searchAfter params
 */
function getPagination(page: number, state: QueryState) {
  return {
    from: (page - 1) * state.size,
    page,
    searchAfter: getSearchAfter(state, page),
  };
}

// ----------------------------------------------------------------------------
// Query String Builder

const fieldMap: Record<string, string> = {
  searchAfter: 'search_after',
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm',
};

/**
 * Converts a set of key/value pairs into a query string for API calls
 *
 * @param {object} state - a set of key/value pairs
 * @returns {string} a formatted query string
 */
export function stateToQS(state: QueryState) {
  const params: Record<string, unknown> = {};
  const fields = Object.keys(state) as (keyof QueryState)[];

  // Copy over the fields

  for (const field of fields) {
    // Do not include empty fields
    if (!Object.hasOwn(state, field)) {
      continue;
    }
    const fieldValue = state[field];
    if (!fieldValue) {
      continue;
    }

    let value: unknown = fieldValue;

    // Process dates
    if (
      typeof value === 'string' &&
      (types.dateFilters as readonly string[]).includes(field)
    ) {
      value = shortIsoFormat(value);
    }

    // Map the internal field names to the API field names
    if (Object.hasOwn(fieldMap, field)) {
      params[fieldMap[field]] = value;
    } else {
      params[field] = value;
    }
  }

  // list of API params
  // https://cfpb.github.io/api/ccdb/api/index.html#/
  const filterKeys = new Set([
    'search_term',
    'field',
    ...types.dateFilters,
    ...types.knownFilters,
    'frm',
    'search_after',
    'size',
    'sort',
    'format',
    'no_aggs',
  ]);

  // where we only filter out the params required for each of the tabs
  const filteredParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (filterKeys.has(key)) {
      filteredParams[key] = value;
    }
  }

  return '?' + queryString.stringify(filteredParams);
}

/**
 * helper function to clear out breakpoints, reset page to 1 when any sort
 * or filter changes the query
 *
 * @param {object} state - redux state
 */
export function clearPager(state: QueryState) {
  state.from = 0;
  state.page = 1;
  state.searchAfter = '';
}

export const queryState: QueryState = {
  company_received_max: '',
  company_received_min: '',
  dateRange: '',
  dateLastIndexed: '',
  date_received_max: '',
  date_received_min: '',
  from: 0,
  page: 1,
  searchAfter: '',
  searchField: 'all',
  searchText: '',
  size: 25,
  sort: 'created_date_desc',
};

interface DateChangedPayload {
  minDate: string;
  maxDate: string;
}

/**
 * Apply a named date range preset to query state.
 *
 * @param state - Query slice state to update.
 * @param payload - Date range key such as All, 3m, 6m, 1y, or 3y.
 */
function applyDateRangeChanged(state: QueryState, payload: string) {
  const dateRange = String(enforceValues(payload, 'dateRange'));
  const maxDateVal = formatDayjs(dayjs(startOfToday()));
  const res: Record<string, string> = {
    All: formatDayjs(dayjs(types.DATE_RANGE_MIN)),
    '3m': formatDayjs(dayjs(maxDateVal).subtract(3, 'months')),
    '6m': formatDayjs(dayjs(maxDateVal).subtract(6, 'months')),
    '1y': formatDayjs(dayjs(maxDateVal).subtract(1, 'year')),
    '3y': formatDayjs(dayjs(maxDateVal).subtract(3, 'years')),
  };
  state.dateRange = dateRange;
  state.date_received_min = res[dateRange] ?? state.date_received_min;
  state.date_received_max = maxDateVal;
}

export const querySlice = createSlice({
  name: 'query',
  initialState: queryState,
  reducers: {
    dateRangeChanged(state, action: PayloadAction<string>) {
      applyDateRangeChanged(state, action.payload);
    },
    companyReceivedDateChanged: {
      reducer: (state, action: PayloadAction<DateChangedPayload>) => {
        const { maxDate: maxDateIn, minDate: minDateIn } = action.payload;

        const minDate = dayjs(minDateIn).isValid()
          ? formatDayjs(dayjs(minDateIn).startOf('day'))
          : null;
        const maxDate = dayjs(maxDateIn).isValid()
          ? formatDayjs(dayjs(maxDateIn).startOf('day'))
          : null;
        state.company_received_min = minDate ?? '';
        state.company_received_max = maxDate ?? '';
      },
      prepare: (minDate: string, maxDate: string) => {
        return {
          payload: {
            minDate,
            maxDate,
          },
        };
      },
    },
    datesChanged: {
      reducer: (state, action: PayloadAction<DateChangedPayload>) => {
        const { maxDate: maxDateIn, minDate: minDateIn } = action.payload;
        const minDate = dayjs(minDateIn).isValid()
          ? formatDayjs(dayjs(minDateIn).startOf('day'))
          : null;
        const maxDate = dayjs(maxDateIn).isValid()
          ? formatDayjs(dayjs(maxDateIn).startOf('day'))
          : null;

        const isDatesChanged =
          state.date_received_min !== minDate ||
          state.date_received_max !== maxDate;

        const dateRange = calculateDateRange(
          minDate,
          maxDate,
          state.dateLastIndexed,
        );

        if (dateRange && isDatesChanged) {
          state.dateRange = dateRange;
        } else {
          delete (state as { dateRange?: string }).dateRange;
        }

        state.date_received_min = minDate || state.date_received_min;
        state.date_received_max = maxDate || state.date_received_max;
      },
      prepare: (minDate: string, maxDate: string) => {
        return {
          payload: {
            minDate,
            maxDate,
          },
        };
      },
    },
    searchFieldChanged(state, action: PayloadAction<string>) {
      state.searchField = action.payload;
    },
    searchTextChanged(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
    prevPageShown(state, action: PayloadAction<Record<number, string[]>>) {
      const breakPoints = action.payload;
      // don't let them go lower than 1
      const prevPage = state.page - 1;
      const pagination = getPagination(prevPage, state);
      state.page = pagination.page;
      state.from = pagination.from;
      state.searchAfter = getSearchAfter(breakPoints, prevPage);
    },
    nextPageShown(state, action: PayloadAction<Record<number, string[]>>) {
      const breakPoints = action.payload;
      const nextPage = state.page + 1;
      const pagination = getPagination(nextPage, state);
      state.page = pagination.page;
      state.from = pagination.from;
      state.searchAfter = getSearchAfter(breakPoints, nextPage);
    },
    sizeChanged(state, action: PayloadAction<string | number>) {
      state.size = enforceValues(action.payload, 'size') as QueryState['size'];
    },
    sortChanged(state, action: PayloadAction<string>) {
      state.sort = String(enforceValues(action.payload, 'sort'));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filtersCleared, (state) => {
        state.dateRange = 'All';
        state.company_received_max = '';
        state.company_received_min = '';
        state.date_received_min = minDate as string;
        state.date_received_max = state.dateLastIndexed;
        state.company_received_max = '';
        state.company_received_min = '';
      })
      .addCase(routeChanged, (state, action) => {
        const { params } = action.payload;
        // Set some variables from the URL
        const keys = [
          'dateRange',
          'searchField',
          'searchText',
          'sort',
        ] as const;
        for (const item of keys) {
          if (!Object.hasOwn(params, item)) {
            continue;
          }
          const paramValue = params[item];
          if (paramValue) {
            (state as QueryState & Record<string, string | number>)[item] =
              String(enforceValues(String(paramValue), item));
          }
        }

        for (const field of types.dateFilters) {
          if (
            params[field] === undefined ||
            !dayjs(params[field] as string).isValid()
          ) {
            continue;
          }

          const parsedDate = toDate(params[field]);
          if (parsedDate) {
            (state as QueryState & Record<string, string>)[field] = parsedDate;
          }
        }

        // Handle numeric fields
        state.page = Number(params.page ?? queryState.page);
        state.size = Number(params.size ?? queryState.size);

        if (params.search_after) {
          state.searchAfter = String(params.search_after);
        }

        // Apply the date range
        if (dateRangeNoDates(params) || params.dateRange === 'All') {
          applyDateRangeChanged(state, String(params.dateRange));
        }
        alignDateRange(state);
      })
      .addMatcher(
        complaintsApi.endpoints.getMeta.matchFulfilled,
        (state, { payload }) => {
          state.dateLastIndexed = dayjs(
            (payload as { _meta: { last_updated: string } })._meta.last_updated,
          )
            .startOf('day')
            .format('YYYY-MM-DD');

          setMaxDate(
            formatDayjs(dayjs(state.dateLastIndexed).startOf('day')) as string,
          );

          // set defaults if the value is not set yet
          if (!state.date_received_max) {
            state.date_received_max = formatDayjs(dayjs(state.dateLastIndexed));
          }
          if (!state.date_received_min) {
            state.date_received_min = formatDayjs(
              dayjs(state.dateLastIndexed).subtract(3, 'years'),
            );
          }
          alignDateRange(state);
        },
      )
      .addMatcher(
        isAnyOf(
          companyReceivedDateChanged,
          datesChanged,
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
  nextPageShown,
  prevPageShown,
  searchFieldChanged,
  searchTextChanged,
  sizeChanged,
  sortChanged,
} = querySlice.actions;
export default querySlice.reducer;
