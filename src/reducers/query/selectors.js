export const selectQueryRoot = (state) => state.query;
export const selectQueryCompanyReceivedMax = (state) =>
  state.query.company_received_max;
export const selectQueryCompanyReceivedMin = (state) =>
  state.query.company_received_min;
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
export const selectQueryDateInterval = (state) => state.query.dateInterval;
export const selectQueryTrendsDateWarningEnabled = (state) =>
  state.query.trendsDateWarningEnabled;
