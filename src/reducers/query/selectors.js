export const selectQueryState = (state) => state.query;
export const selectQueryCompany = (state) => state.query.company;
export const selectQueryCompanyReceivedMax = (state) =>
  state.query.company_received_max;
export const selectQueryCompanyReceivedMin = (state) =>
  state.query.company_received_min;

export const selectQueryDataNormalization = (state) =>
  state.query.dataNormalization;

export const selectQueryDateReceivedMax = (state) =>
  state.query.date_received_max;
export const selectQueryDateReceivedMin = (state) =>
  state.query.date_received_min;
export const selectQueryDateRange = (state) => state.query.dateRange;
export const selectQueryEnablePer1000 = (state) => state.query.enablePer1000;
export const selectQueryFocus = (state) => state.query.focus;
export const selectQueryMapWarningEnabled = (state) =>
  state.query.mapWarningEnabled;

export const selectQueryHasNarrative = (state) => state.query.has_narrative;
export const selectQueryLens = (state) => state.query.lens;
export const selectQueryPage = (state) => state.query.page;
export const selectQueryProduct = (state) => state.query.product;
export const selectQuerySearch = (state) => state.query.search;
export const selectQuerySearchField = (state) => state.query.searchField;
export const selectQuerySearchText = (state) => state.query.searchText;
export const selectQuerySize = (state) => state.query.size;
export const selectQuerySort = (state) => state.query.sort;
export const selectQueryStateFilters = (state) => state.query.state;
export const selectQuerySubLens = (state) => state.query.subLens;
export const selectQueryTab = (state) => state.query.tab;
export const selectQueryTotalPages = (state) => state.query.totalPages;
export const selectQueryDateInterval = (state) => state.query.dateInterval;
export const selectQueryIsTrendsDateWarningDisabled = (state) =>
  state.query.isTrendsDateWarningEnabled;
