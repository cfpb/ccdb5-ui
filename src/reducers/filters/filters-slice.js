// default filter state
import { createSlice } from '@reduxjs/toolkit';
import { coalesce, processUrlArrayParams } from '../../utils';
import * as types from '../../constants';

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
  if (target.includes(val)) {
    target = target.filter(function (value) {
      return value !== val;
    });
  } else {
    target.push(val);
  }
  return [...target];
}

export const filtersState = {
  company: [],
  company_public_response: [],
  company_response: [],
  issue: [],
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
    filterAdded: {
      reducer: (state, action) => {
        const { filterName, filterValue } = action.payload;
        if (Object.hasOwn(state, filterName)) {
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
        if (Object.hasOwn(state, filterName)) {
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
      reducer: (state) => {
        for (const knownFilter of types.knownFilters) {
          if (Object.hasOwn(state, knownFilter)) {
            state[knownFilter] = [];
          }
        }
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
    multipleFiltersAdded: {
      reducer: (state, action) => {
        const name = action.payload.filterName;
        const arr = coalesce(state, name, []);

        // Add the filters
        for (const val of action.payload.values) {
          if (!arr.includes(val)) {
            arr.push(val);
          }
        }

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
        if (Object.hasOwn(state, action.payload.filterName)) {
          for (const val of action.payload.values) {
            const idx = state[action.payload.filterName].indexOf(val);
            if (idx !== -1) {
              state[action.payload.filterName].splice(idx, 1);
            }
          }
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
  },
  extraReducers: (builder) => {
    builder.addCase('routes/routeChanged', (state, action) => {
      const { params } = action.payload;
      // Handle the aggregation filters
      processUrlArrayParams(params, state, types.knownFilters);
    });
  },
});

export const {
  filterAdded,
  filterRemoved,
  filtersCleared,
  filtersReplaced,
  filterToggled,
  multipleFiltersAdded,
  multipleFiltersRemoved,
  stateFilterAdded,
  stateFilterCleared,
  stateFilterRemoved,
} = filtersSlice.actions;

export default filtersSlice.reducer;
