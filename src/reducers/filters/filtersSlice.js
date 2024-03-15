// default filter state
import { createSlice } from '@reduxjs/toolkit';
import { REQUERY_ALWAYS, REQUERY_NEVER } from '../../constants';
import { coalesce, enablePer1000, processUrlArrayParams } from '../../utils';
import * as types from '../../constants';
import { enforceValues } from '../../utils/reducers';

export const filtersState = {
  dataNormalization: types.GEO_NORM_NONE,
  enablePer1000: false,
  mapWarningEnabled: true,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: filtersState,
  reducers: {
    dataNormalizationUpdated: {
      reducer: (state, action) => {
        state.dataNormalization = enforceValues(
          action.payload.value,
          'dataNormalization',
        );
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
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    // allFiltersRemoved
    filtersCleared: (state, action) => {
      const allFilters = types.knownFilters.concat(types.flagFilters);
      if (types.NARRATIVE_SEARCH_FIELD === action.payload) {
        const idx = allFilters.indexOf('has_narrative');
        allFilters.splice(idx, 1);
      }
      allFilters.forEach((knownFilter) => {
        if (knownFilter in state) {
          delete state[knownFilter];
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
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    filterToggled: {
      reducer: (state, action) => {
        return {
          ...state,
          [action.payload.filterName]: filterArrayAction(
            state[action.payload.filterName],
            action.payload.filterValue.key,
          ),
        };
      },
      prepare: (filterName, filterValue) => {
        return {
          payload: { filterName, filterValue },
          meta: {
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
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    processParams: {
      reducer: (state, action) => {
        const params = { ...action.payload.params };
        // Handle the aggregation filters
        processUrlArrayParams(params, state, types.knownFilters);
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
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
    stateFilterCleared: {
      reducer: (state) => {
        delete state.state;
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
    stateFilterRemoved: {
      reducer: (state, action) => {
        const stateFilters = coalesce(state, 'state', []);
        const { abbr } = action.payload.selectedState;
        state.state = stateFilters.filter((state) => state !== abbr);
        if (!state.state.length) {
          delete state.state;
        }
      },
      prepare: (selectedState) => {
        return {
          payload: { selectedState },
          meta: {
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
            requery: REQUERY_ALWAYS,
          },
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('routes/routeChanged', (state, action) => {
        filtersSlice.caseReducers.processParams(state, action);
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
        const { lens } = action.payload;
        const filterKey = lens.toLowerCase();
        delete state[filterKey];
      });
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
