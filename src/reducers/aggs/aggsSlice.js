import { processErrorMessage } from '../../utils';
import { createSlice } from '@reduxjs/toolkit';
import { REQUERY_NEVER } from '../../constants';

/* eslint-disable camelcase */

export const aggsState = {
  activeCall: '',
  doc_count: 0,
  total: 0,
  error: '',
  lastUpdated: null,
  lastIndexed: null,
  hasDataIssue: false,
  isDataStale: false,
  company: [],
  company_public_response: [],
  company_response: [],
  consumer_consent_provided: [],
  consumer_disputed: [],
  issue: [],
  product: [],
  state: [],
  submitted_via: [],
  tag: [],
  timely: [],
  zip_code: [],
};

export const aggSlice = createSlice({
  name: 'aggs',
  initialState: aggsState,
  reducers: {
    aggregationsApiCalled: (state, action) => {
      state.error = '';
      state.activeCall = action.payload;
    },
    aggregationsReceived: {
      reducer: (state, action) => {
        const aggs = action.payload.data.aggregations;
        const keys = Object.keys(aggs);

        state.doc_count = Math.max(
          state.doc_count,
          action.payload.data.hits.total.value,
          action.payload.data._meta.total_record_count,
        );
        state.error = '';
        state.activeCall = '';
        state.lastUpdated = action.payload.data._meta.last_updated;
        state.lastIndexed = action.payload.data._meta.last_indexed;
        state.hasDataIssue = action.payload.data._meta.has_data_issue;
        state.isDataStale = action.payload.data._meta.is_data_stale;
        state.total = action.payload.data.hits.total.value;

        keys.forEach((key) => {
          state[key] = aggs[key][key].buckets;
        });
      },
      prepare: (data) => {
        return {
          payload: data,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    aggregationsApiFailed: {
      reducer: (state, action) => {
        state.activeCall = '';
        state.error = processErrorMessage(action.payload);
      },
      prepare: (error) => {
        return {
          payload: {
            message: error.message,
            name: error.name,
          },
        };
      },
    },
  },
});

export const {
  aggregationsApiCalled,
  aggregationsReceived,
  aggregationsApiFailed,
} = aggSlice.actions;

export default aggSlice.reducer;
