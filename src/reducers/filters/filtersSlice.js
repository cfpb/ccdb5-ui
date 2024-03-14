// default filter state
import { createSlice } from '@reduxjs/toolkit';
import { REQUERY_ALWAYS } from '../../constants';
import { filterArrayAction } from '../query/query';
import { coalesce, processUrlArrayParams } from '../../utils';
import * as types from '../../constants';

export const filtersState = {};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: filtersState,
  reducers: {
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
    filtersCleared: (state) => {
      state = {};
      return state;
    },
    filtersReplaced: {
      reducer: (state, action) => {
        // de-dupe the filters in case we messed up somewhere
        state[action.payload.filterName] = [...new Set(action.payload.values)];
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
        // remove the focus if it exists in one of the filter values we are removing
        state.focus = action.payload.values.includes(state.focus)
          ? ''
          : state.focus || '';

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
  },
  extraReducers: (builder) => {
    builder.addCase('routes/routeChanged', (state, action) => {
      filtersSlice.caseReducers.processParams(state, action);
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
} = filtersSlice.actions;

export default filtersSlice.reducer;
