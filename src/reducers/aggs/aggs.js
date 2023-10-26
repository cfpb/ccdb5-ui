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
        activeCall: action.url,
        isLoading: true,
      };
    },
    processAggregationResults(state, action) {
      const aggs = action.data.aggregations;
      const keys = Object.keys(aggs);

      const doc_count = Math.max(
        state.doc_count,
        action.data.hits.total.value,
        action.data._meta.total_record_count
      );

      const result = {
        ...state,
        doc_count,
        error: '',
        isLoading: false,
        lastUpdated: action.data._meta.last_updated,
        lastIndexed: action.data._meta.last_indexed,
        hasDataIssue: action.data._meta.has_data_issue,
        isDataStale: action.data._meta.is_data_stale,
        total: action.data.hits.total.value,
      };

      keys.forEach((key) => {
        result[key] = aggs[key][key].buckets;
      });

      return result;
    },
    processAggregationError(state, action) {
      return {
        ...aggState,
        isLoading: false,
        error: processErrorMessage(action.error),
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
