// reducer for the Map Tab
import { processAggregations } from '../trends/trends';
import { processErrorMessage } from '../../utils';
import { TILE_MAP_STATES } from '../../constants';
import { createSlice } from '@reduxjs/toolkit';

export const mapState = {
  activeCall: '',
  error: false,
  isLoading: false,
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
    handleTabChanged(state) {
      return {
        ...state,
        error: false,
        results: {
          product: [],
          state: [],
        },
      };
    },
    statesCallInProcess: {
      reducer: (state, action) => {
        state.activeCall = action.payload.url;
        state.error = false;
        state.isLoading = true;
      },
    },
    processStatesResults(state, action) {
      const aggregations = action.payload.aggregations;
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
        isLoading: false,
        results,
      };
    },
    processStatesError(state, action) {
      return {
        ...state,
        activeCall: '',
        error: processErrorMessage(action.payload),
        isLoading: false,
        results: {
          product: [],
          state: [],
        },
      };
    },
  },
});

export const {
  handleTabChanged,
  statesCallInProcess,
  processStatesResults,
  processStatesError,
} = mapSlice.actions;
export default mapSlice.reducer;
