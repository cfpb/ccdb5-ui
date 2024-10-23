export const selectFiltersRoot = (state) => state.filters;
export const selectFiltersCompany = (state) => state.filters.company;
export const selectFiltersCompanyReceivedMax = (state) =>
  state.filters.company_received_max;
export const selectFiltersCompanyReceivedMin = (state) =>
  state.filters.company_received_min;
export const selectFiltersDataNormalization = (state) =>
  state.filters.dataNormalization;
export const selectFiltersEnablePer1000 = (state) =>
  state.filters.enablePer1000;
export const selectFiltersIssue = (state) => state.filters.issue;
export const selectFiltersProduct = (state) => state.filters.product;
export const selectFiltersState = (state) => state.filters.state;
export const selectFiltersHasNarrative = (state) => state.filters.has_narrative;
export const selectFiltersMapWarningEnabled = (state) =>
  state.filters.mapWarningEnabled;
