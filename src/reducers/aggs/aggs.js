import { processErrorMessage } from '../../utils';
import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable camelcase */

export const aggState = {
  activeCall: '',
  doc_count: 0,
  isLoading: false,
  total: 0,
  error: '',
  lastUpdated: null,
  lastIndexed: null,
  loadingAggregations: false,
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
  initialState: aggState,
  reducers: {
    aggregationsCallInProcess(state, action) {
      return {
        ...state,
        activeCall: action.payload.url,
        isLoading: true,
      };
    },
    processAggregationResults(state, action) {
      const aggs = action.payload.data.aggregations;
      const keys = Object.keys(aggs);

      state.doc_count = Math.max(
        state.doc_count,
        action.payload.data.hits.total.value,
        action.payload.data._meta.total_record_count
      );
      state.error = ''
      state.isLoading = false;
      state.lastUpdated= action.payload.data._meta.last_updated;
      state.lastIndexed= action.payload.data._meta.last_indexed;
      state.hasDataIssue= action.payload.data._meta.has_data_issue;
      state.isDataStale= action.payload.data._meta.is_data_stale;
      state.total= action.payload.data.hits.total.value;

      keys.forEach((key) => {
        state[key] = aggs[key][key].buckets;
      });
    },
    processAggregationError(state, action) {
      return {
        ...aggState,
        isLoading: false,
        error: processErrorMessage(action.payload.error),
      };
    },
  },
});

export const {
  aggregationsCallInProcess,
  processAggregationResults,
  processAggregationError,
} = aggSlice.actions;

export default aggSlice.reducer;
