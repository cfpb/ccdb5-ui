// default filter state
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { coalesce, processUrlArrayParams } from '../../utils';
import * as types from '../../constants';
import { routeChanged } from '../routes/routes-slice';
import type { FiltersState } from '../../types/root-state';

/**
 * defaults create new array if param doesn't exist yet
 * if the value doesn't exist in the array, pushes
 * if value exists in the array, filters.
 *
 * @param {Array} target - the current filter
 * @param {string} val - the filter to toggle
 * @returns {Array} a cast copy to avoid any state mutation
 */
export function filterArrayAction(target: string[] = [], val: string): string[] {
  if (target.includes(val)) {
    target = target.filter(function (value) {
      return value !== val;
    });
  } else {
    target.push(val);
  }
  return [...target];
}

export const filtersState: FiltersState = {
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

type FilterPayload = {
  filterName: string;
  filterValue: string;
};

type FilterTogglePayload = {
  filterName: string;
  filterValue: { key: string };
};

type FiltersReplacedPayload = {
  filterName: string;
  values: string[];
};

type MultipleFiltersPayload = {
  filterName: string;
  values: string[];
};

type StateFilterPayload = {
  abbr: string;
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: filtersState,
  reducers: {
    filterAdded: {
      reducer: (state, action: PayloadAction<FilterPayload>) => {
        const { filterName, filterValue } = action.payload;
        const filters = state as FiltersState & Record<string, string[]>;
        if (Object.hasOwn(filters, filterName)) {
          const idx = filters[filterName].indexOf(filterValue);
          if (idx === -1) {
            filters[filterName].push(filterValue);
          }
        } else {
          filters[filterName] = [filterValue];
        }
      },
      prepare: (filterName: string, filterValue: string) => {
        return {
          payload: { filterName, filterValue },
        };
      },
    },
    filterRemoved: {
      reducer: (state, action: PayloadAction<FilterPayload>) => {
        const { filterName, filterValue } = action.payload;
        const filters = state as FiltersState & Record<string, string[]>;
        if (Object.hasOwn(filters, filterName)) {
          const idx = filters[filterName].indexOf(filterValue);
          if (idx !== -1) {
            filters[filterName].splice(idx, 1);
          }
        }
      },
      prepare: (filterName: string, filterValue: string) => {
        return {
          payload: { filterName, filterValue },
        };
      },
    },
    // allFiltersRemoved
    filtersCleared(state) {
      const filters = state as FiltersState & Record<string, string[]>;
      for (const knownFilter of types.knownFilters) {
        if (Object.hasOwn(filters, knownFilter)) {
          filters[knownFilter] = [];
        }
      }
    },
    filtersReplaced: {
      reducer: (state, action: PayloadAction<FiltersReplacedPayload>) => {
        const { filterName, values } = action.payload;
        const filters = state as FiltersState & Record<string, string[]>;
        // de-dupe the filters in case we messed up somewhere
        filters[filterName] = [...new Set(values)];
      },
      prepare: (filterName: string, values: string[]) => {
        return {
          payload: { filterName, values },
        };
      },
    },
    filterToggled: {
      reducer: (state, action: PayloadAction<FilterTogglePayload>) => {
        const { filterName, filterValue } = action.payload;
        const filters = state as FiltersState & Record<string, string[]>;
        filters[filterName] = filterArrayAction(
          filters[filterName],
          filterValue.key,
        );
      },
      prepare: (filterName: string, filterValue: { key: string }) => {
        return {
          payload: { filterName, filterValue },
        };
      },
    },
    multipleFiltersAdded: {
      reducer: (state, action: PayloadAction<MultipleFiltersPayload>) => {
        const name = action.payload.filterName;
        const filters = state as FiltersState & Record<string, string[]>;
        const arr = coalesce(filters, name, [] as string[]) as string[];

        // Add the filters
        for (const val of action.payload.values) {
          if (!arr.includes(val)) {
            arr.push(val);
          }
        }

        filters[name] = arr;
      },
      prepare: (filterName: string, values: string[]) => {
        return {
          payload: {
            filterName,
            values,
          },
        };
      },
    },
    multipleFiltersRemoved: {
      reducer: (state, action: PayloadAction<MultipleFiltersPayload>) => {
        const filters = state as FiltersState & Record<string, string[]>;
        if (Object.hasOwn(filters, action.payload.filterName)) {
          for (const val of action.payload.values) {
            const idx = filters[action.payload.filterName].indexOf(val);
            if (idx !== -1) {
              filters[action.payload.filterName].splice(idx, 1);
            }
          }
        }
      },
      prepare: (filterName: string, values: string[]) => {
        return {
          payload: { filterName, values },
        };
      },
    },
    stateFilterAdded(state, action: PayloadAction<StateFilterPayload>) {
      const filters = state as FiltersState & Record<string, string[]>;
      const stateFilters = coalesce(filters, 'state', [] as string[]) as string[];
      const { abbr } = action.payload;
      if (!stateFilters.includes(abbr)) {
        stateFilters.push(abbr);
      }

      filters.state = stateFilters;
    },
    stateFilterCleared(state) {
      state.state = [];
    },
    stateFilterRemoved(state, action: PayloadAction<StateFilterPayload>) {
      const filters = state as FiltersState & Record<string, string[]>;
      const stateFilters = coalesce(filters, 'state', [] as string[]) as string[];
      const { abbr } = action.payload;
      filters.state = stateFilters.filter((stateAbbr: string) => stateAbbr !== abbr);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(routeChanged, (state, action) => {
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
