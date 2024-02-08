/* eslint-disable camelcase */

import { createSlice } from '@reduxjs/toolkit';

export const resultsState = {
  activeCall: '',
  error: '',
  isLoading: false,
  items: [],
};

export const resultsSlice = createSlice({
  name: 'results',
  initialState: resultsState,
  reducers: {
    hitsCallInProcess: {
      reducer: (state, action) => {
        {
          state.activeCall = action.payload.url;
          state.isLoading = true;
        }
      },
    },
    processHitsResults: {
      reducer: (state, action) => {
        const items = _processHits(action.payload.data);
        state.activeCall = '';
        state.error = '';
        state.isLoading = false;
        state.items = items;
      },
      prepare: (items) => {
        return {
          payload: {
            data: items,
          },
        };
      },
    },
    processHitsError(state, action) {
      return {
        ...resultsState,
        error: action.payload.error,
      };
    },
  },
});

export const _processHits = (data) =>
  data.hits.hits.map((x) => {
    const item = { ...x._source };

    if (x.highlight) {
      Object.keys(x.highlight).forEach((field) => {
        item[field] = x.highlight[field][0];
      });
    }

    return item;
  });

export const { hitsCallInProcess, processHitsResults, processHitsError } =
  resultsSlice.actions;
export default resultsSlice.reducer;
