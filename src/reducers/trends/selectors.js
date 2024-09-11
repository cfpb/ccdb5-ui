export const selectTrendsChartType = (state) => state.trends.chartType;
export const selectTrendsTooltip = (state) => state.trends.tooltip;
export const selectTrendsTotal = (state) => state.trends.total;
export const selectTrendsColorMap = (state) => state.trends.colorMap;
export const selectTrendsFocus = (state) => state.trends.focus;
export const selectTrendsResults = (state) => state.trends.results;
export const selectTrendsIsLoading = (state) => state.trends.isLoading;
export const selectTrendsResultsDateRangeArea = (state) =>
  state.trends.results.dateRangeArea;
export const selectTrendsResultsDateRangeLine = (state) =>
  state.trends.results.dateRangeLine;
export const selectTrendsResultsSubProduct = (state) =>
  state.trends.results['sub-product'];
