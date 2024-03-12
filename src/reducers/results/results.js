/* eslint-disable camelcase */

import { createSlice } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';

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
        state.activeCall = action.payload;
        state.isLoading = true;
      },
    },
    complaintsReceived: {
      reducer: (state, action) => {
        const items = _processHits(action);
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

export const _processHits = (action) => {
  const data = cloneDeep(action.payload.data);
  return data.hits.hits.map((hit) => {
    const item = { ...hit._source };

    if (hit.highlight) {
      Object.keys(hit.highlight).forEach((field) => {
        item[field] = hit.highlight[field][0];
      });
    }

    return item;
  });
};

export const { hitsCallInProcess, complaintsReceived, processHitsError } =
  resultsSlice.actions;
export default resultsSlice.reducer;
