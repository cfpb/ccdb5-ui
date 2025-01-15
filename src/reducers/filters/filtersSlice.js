// default filter state
import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { coalesce, enablePer1000, processUrlArrayParams } from '../../utils';
import * as types from '../../constants';
import { enforceValues } from '../../utils/reducers';
import { routeChanged } from '../routes/routesSlice';

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

export const filtersState = {
  company: [],
  company_public_response: [],
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
    dataNormalizationUpdated: {
      reducer: (state, action) => {
        state.dataNormalization = enforceValues(
          action.payload,
          'dataNormalization',
        );
      },
    },
    filterAdded: {
      reducer: (state, action) => {
        const { filterName, filterValue } = action.payload;
        if (filterName === 'has_narrative') {
          state.has_narrative = true;
        } else if (filterName in state) {
          const idx = state[filterName].indexOf(filterValue);
          if (idx === -1) {
            state[filterName].push(filterValue);
          }
        } else {
          state[filterName] = [filterValue];
        }
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
        };
      },
    },
    filterRemoved: {
      reducer: (state, action) => {
        const { filterName, filterValue } = action.payload;
        if (filterName === 'has_narrative') {
          delete state.has_narrative;
        } else if (filterName in state) {
          const idx = state[filterName].indexOf(filterValue);
          if (idx !== -1) {
            state[filterName].splice(idx, 1);
          }
        }
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
        };
      },
    },
    // allFiltersRemoved
    filtersCleared: {
      reducer: (state, action) => {
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
        };
      },
    },
    filterToggled: {
      reducer: (state, action) => {
        const { filterName, filterValue } = action.payload;
        state[filterName] = filterArrayAction(
          state[filterName],
          filterValue.key,
        );
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
        };
      },
    },
    mapWarningDismissed: {
      reducer: (state) => {
        state.mapWarningEnabled = false;
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
        };
      },
    },
    stateFilterAdded: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload;
        if (!stateFilters.includes(abbr)) {
          stateFilters.push(abbr);
        }

        state.state = stateFilters;
      },
    },
    stateFilterCleared: {
      reducer: (state) => {
        state.state = [];
      },
    },
    stateFilterRemoved: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload;
        state.state = stateFilters.filter((state) => state !== abbr);
      },
    },
    toggleFlagFilter: {
      reducer: (state, action) => {
        const filterName = action.payload;
        state[filterName] = Boolean(!state[filterName]);
        if (!state[filterName]) delete state[filterName];
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('routes/routeChanged', (state, action) => {
        const { params } = action.payload;
        // Handle the aggregation filters
        processUrlArrayParams(params, state, types.knownFilters);
        if (params.dataNormalization) {
          state.dataNormalization = params.dataNormalization;
        }
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
        state[filterKey] = [];
      })
      .addMatcher(
        isAnyOf(
          /*eslint no-use-before-define: ["error", { "variables": false }]*/
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

export const {
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
