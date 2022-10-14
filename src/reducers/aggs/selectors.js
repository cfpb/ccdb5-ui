export const selectAggsState = (state) => state.aggs;
export const selectAggsDocCount = (state) => state.aggs.doc_count;
export const selectAggsHasError = (state) => state.aggs.error;
export const selectAggsTotal = (state) => state.aggs.total;
