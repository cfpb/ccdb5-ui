import type { QueryState, RootState } from '../../types/root-state';

export const selectQueryRoot = (state: RootState): QueryState => state.query;
export const selectQueryCompanyReceivedMax = (state: RootState): string =>
  state.query.company_received_max;
export const selectQueryCompanyReceivedMin = (state: RootState): string =>
  state.query.company_received_min;
export const selectQueryDateLastIndexed = (state: RootState): string =>
  state.query.dateLastIndexed;
export const selectQueryDateReceivedMax = (state: RootState): string =>
  state.query.date_received_max;
export const selectQueryDateReceivedMin = (state: RootState): string =>
  state.query.date_received_min;
export const selectQueryDateRange = (state: RootState): string =>
  state.query.dateRange;
export const selectQueryPage = (state: RootState): number => state.query.page;
export const selectQuerySearchField = (state: RootState): string =>
  state.query.searchField;
export const selectQuerySearchText = (state: RootState): string =>
  state.query.searchText;
export const selectQuerySize = (state: RootState): number => state.query.size;
export const selectQuerySort = (state: RootState): string => state.query.sort;
