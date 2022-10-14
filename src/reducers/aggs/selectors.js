export const selectAggsState = (state) => state.aggs;
export const selectAggsDocCount = (state) => state.aggs.doc_count;
export const selectAggsHasDataIssue = (state) => state.aggs.hasDataIssue;
export const selectAggsHasError = (state) => state.aggs.error;
export const selectAggsIsDataStale = (state) => state.aggs.isDataStale;
export const selectAggsTotal = (state) => state.aggs.total;
