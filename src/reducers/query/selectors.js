export const selectQueryState = (state) => state.query;

export const selectQueryDataNormalization = (state) =>
  state.query.dataNormalization;

export const selectQueryDateReceivedMax = (state) =>
  state.query.date_received_max;
export const selectQueryDateReceivedMin = (state) =>
  state.query.date_received_min;
export const selectQueryDateRange = (state) => state.query.dateRange;
export const selectQueryPage = (state) => state.query.page;
export const selectQuerySearchField = (state) => state.query.searchField;
export const selectQuerySearchText = (state) => state.query.searchText;
export const selectQuerySize = (state) => state.query.size;
export const selectQuerySort = (state) => state.query.sort;
export const selectQuerySubLens = (state) => state.query.subLens;
export const selectQueryStateFilters = (state) => state.query.state;
export const selectQueryTotalPages = (state) => state.query.totalPages;
