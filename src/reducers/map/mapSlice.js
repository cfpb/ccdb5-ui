// reducer for the Map Tab
import { processAggregations } from '../trends/trendsSlice';
import { processErrorMessage } from '../../utils';
import {
  PERSIST_SAVE_QUERY_STRING,
  REQUERY_NEVER,
  TILE_MAP_STATES,
} from '../../constants';
import { createSlice } from '@reduxjs/toolkit';

export const mapState = {
  activeCall: '',
  error: false,
  results: {
    product: [],
    state: [],
  },
};

export const processStateAggregations = (agg) => {
  const states = Object.values(agg.state.buckets)
    .filter((val) => TILE_MAP_STATES.includes(val.key))
    .map((val) => ({
      name: val.key,
      value: val.doc_count,
      issue: val.issue.buckets[0].key,
      product: val.product.buckets[0].key,
    }));

  const stateNames = states.map((state) => state.name);

  // patch any missing data
  if (stateNames.length > 0) {
    TILE_MAP_STATES.forEach((state) => {
      if (!stateNames.includes(state)) {
        states.push({ name: state, value: 0, issue: '', product: '' });
      }
    });
  }
  return states;
};

export const mapSlice = createSlice({
  name: 'map',
  initialState: mapState,
  reducers: {
    statesApiCalled: {
      reducer: (state, action) => {
        state.activeCall = action.payload.url;
        state.error = false;
      },
    },
    statesReceived: {
      reducer: (state, action) => {
        const { aggregations } = action.payload.data;
        const { state: stateData } = aggregations;
        // add in "issue" if we ever need issue row chart again
        const keys = ['product'];
        const results = {};
        processAggregations(keys, state, aggregations, results);
        results.state = processStateAggregations(stateData);

        return {
          ...state,
          activeCall: '',
          error: false,
          results,
        };
      },
      prepare: (data) => {
        return {
          payload: data,
          meta: {
            persist: PERSIST_SAVE_QUERY_STRING,
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    statesApiFailed(state, action) {
      return {
        ...state,
        activeCall: '',
        error: processErrorMessage(action.payload),
        results: {
          product: [],
          state: [],
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase('view/tabChanged', (state) => {
      return {
        ...state,
        error: false,
        results: {
          product: [],
          state: [],
        },
      };
    });
  },
});

export const { statesApiCalled, statesReceived, statesApiFailed } =
  mapSlice.actions;
export default mapSlice.reducer;
