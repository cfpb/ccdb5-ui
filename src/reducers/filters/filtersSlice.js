// default filter state
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  PERSIST_SAVE_QUERY_STRING,
  REQUERY_ALWAYS,
  REQUERY_NEVER,
} from '../../constants';
import { coalesce, enablePer1000, processUrlArrayParams } from '../../utils';
import * as types from '../../constants';
import { enforceValues } from '../../utils/reducers';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/formatDate';
import { routeChanged } from '../routes/routesSlice';

export const filtersState = {
  company: [],
  company_public_response: [],
  company_received_max: '',
  company_received_min: '',
  company_response: [],
  consumer_consent_provided: [],
  consumer_disputed: [],
  dataNormalization: types.GEO_NORM_NONE,
  enablePer1000: false,
  issue: [],
  mapWarningEnabled: true,
  product: [],
  state: [],
  submitted_via: [],
  tags: [],
  timely: [],
  zip_code: [],
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: filtersState,
  reducers: {
    companyReceivedDateUpdated: {
      // eslint-disable-next-line complexity
      reducer: (state, action) => {
        const fields = [
          action.payload.filterName + '_min',
          action.payload.filterName + '_max',
        ];

        let { maxDate, minDate } = action.payload;
        // If maxDate or minDate are falsy, early exit
        if (!maxDate || !minDate) {
          return state;
        }

        minDate = formatDate(dayjs(minDate).startOf('day'));
        maxDate = formatDate(dayjs(maxDate).startOf('day'));

        state[fields[0]] = minDate || state[fields[0]];
        state[fields[1]] = maxDate || state[fields[1]];
      },
      prepare: (filterName, minDate, maxDate) => {
        return {
          payload: {
            filterName,
            minDate,
            maxDate,
          },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    dataNormalizationUpdated: {
      reducer: (state, action) => {
        state.dataNormalization = enforceValues(
          action.payload,
          'dataNormalization',
        );
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
    filterAdded: {
      reducer: (state, action) => {
        if (action.payload.filterName === 'has_narrative') {
          state.has_narrative = true;
        } else if (action.payload.filterName in state) {
          const idx = state[action.payload.filterName].indexOf(
            action.payload.filterValue,
          );
          if (idx === -1) {
            state[action.payload.filterName].push(action.payload.filterValue);
          }
        } else {
          state[action.payload.filterName] = [action.payload.filterValue];
        }
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    filterRemoved: {
      reducer: (state, action) => {
        if (action.payload.filterName === 'has_narrative') {
          delete state.has_narrative;
        } else if (action.payload.filterName in state) {
          const idx = state[action.payload.filterName].indexOf(
            action.payload.filterValue,
          );
          if (idx !== -1) {
            state[action.payload.filterName].splice(idx, 1);
          }
        }
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    // allFiltersRemoved
    filtersCleared: (state, action) => {
      const allFilters = types.knownFilters.concat(types.flagFilters);
      if (types.NARRATIVE_SEARCH_FIELD === action.payload) {
        // keep has_narrative intact if we're coming from Narratives search
        const idx = allFilters.indexOf('has_narrative');
        allFilters.splice(idx, 1);
      }
      allFilters.forEach((knownFilter) => {
        if (knownFilter in state) {
          state[knownFilter] = [];
        }
      });
    },
    filtersReplaced: {
      reducer: (state, action) => {
        const { filterName, values } = action.payload;
        // de-dupe the filters in case we messed up somewhere
        state[filterName] = [...new Set(values)];
      },
      prepare: (filterName, values) => {
        return {
          payload: { filterName, values },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    filterToggled: {
      reducer: (state, action) => {
        state[action.payload.filterName] = filterArrayAction(
          state[action.payload.filterName],
          action.payload.filterValue.key,
        );
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    mapWarningDismissed: {
      reducer: (state) => {
        state.mapWarningEnabled = false;
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
    multipleFiltersAdded: {
      reducer: (state, action) => {
        const name = action.payload.filterName;
        const arr = coalesce(state, name, []);

        // Add the filters
        action.payload.values.forEach((val) => {
          if (arr.indexOf(val) === -1) {
            arr.push(val);
          }
        });

        state[name] = arr;
      },
      prepare: (filterName, values) => {
        return {
          payload: {
            filterName,
            values,
          },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    multipleFiltersRemoved: {
      reducer: (state, action) => {
        if (state[action.payload.filterName]) {
          action.payload.values.forEach((val) => {
            const idx = state[action.payload.filterName].indexOf(val);
            if (idx !== -1) {
              state[action.payload.filterName].splice(idx, 1);
            }
          });
        }
      },
      prepare: (filterName, values) => {
        return {
          payload: { filterName, values },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    stateFilterAdded: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload.selectedState;
        if (!stateFilters.includes(abbr)) {
          stateFilters.push(abbr);
        }

        state.state = stateFilters;
      },
      prepare: (selectedState) => {
        return {
          payload: { selectedState },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    stateFilterCleared: {
      reducer: (state) => {
        state.state = [];
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    stateFilterRemoved: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload.selectedState;
        state.state = stateFilters.filter((state) => state !== abbr);
      },
      prepare: (selectedState) => {
        return {
          payload: { selectedState },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    toggleFlagFilter: {
      reducer: (state, action) => {
        state[action.payload.filterName] = Boolean(
          !state[action.payload.filterName],
        );
        if (!state[action.payload.filterName])
          delete state[action.payload.filterName];
      },
      prepare: (filterName) => {
        return {
          payload: {
            filterName,
          },
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('routes/routeChanged', (state, action) => {
        const { params } = action.payload;
        // Handle the aggregation filters
        processUrlArrayParams(params, state, types.knownFilters);
      })
      .addCase('trends/focusChanged', (state, action) => {
        const { focus, lens, filterValues } = action.payload;
        const filterKey = lens.toLowerCase();
        const activeFilters = [];

        if (filterKey === 'company') {
          activeFilters.push(focus);
        } else {
          filterValues.forEach((val) => {
            activeFilters.push(val);
          });
        }
        state[filterKey] = activeFilters;
      })
      .addCase('trends/focusRemoved', (state, action) => {
        const lens = action.payload;
        const filterKey = lens.toLowerCase();
        delete state[filterKey];
      })
      .addMatcher(
        isAnyOf(
          filterAdded,
          filterRemoved,
          filtersCleared,
          filtersReplaced,
          filterToggled,
          multipleFiltersAdded,
          multipleFiltersRemoved,
          routeChanged,
          stateFilterCleared,
          stateFilterRemoved,
          toggleFlagFilter,
        ),
        (state) => {
          validatePer1000(state);
        },
      );
  },
});

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
 * helper function to check if per1000 & map warnings should be enabled
 *
 * @param {object} state - state we need to validate
 */
export function validatePer1000(state) {
  state.enablePer1000 = enablePer1000(state);
  if (state.enablePer1000) {
    state.mapWarningEnabled = true;
  }
  // if we enable per1k then don't reset it
  state.dataNormalization = state.enablePer1000
    ? state.dataNormalization || types.GEO_NORM_NONE
    : types.GEO_NORM_NONE;
}
export const {
  companyReceivedDateUpdated,
  dataNormalizationUpdated,
  filterAdded,
  filterRemoved,
  filtersCleared,
  filtersReplaced,
  filterToggled,
  mapWarningDismissed,
  multipleFiltersAdded,
  multipleFiltersRemoved,
  stateFilterAdded,
  stateFilterCleared,
  stateFilterRemoved,
  toggleFlagFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;
