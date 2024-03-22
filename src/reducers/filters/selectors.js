export const selectFiltersState = (state) => state.filters;
export const selectFiltersCompanyReceivedMax = (state) =>
  state.filters.company_received_max;
export const selectFiltersCompanyReceivedMin = (state) =>
  state.filters.company_received_min;
export const selectFiltersDataNormalization = (state) =>
  state.filters.dataNormalization;
export const selectFiltersEnablePer1000 = (state) =>
  state.filters.enablePer1000;
export const selectFiltersHasNarrative = (state) => state.filters.has_narrative;
export const selectFiltersMapWarningEnabled = (state) =>
  state.filters.mapWarningEnabled;
