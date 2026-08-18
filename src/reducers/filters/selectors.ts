import type { FiltersState, RootState } from '../../types/root-state';

export const selectFiltersRoot = (state: RootState): FiltersState =>
  state.filters;
export const selectFiltersCompany = (state: RootState): string[] =>
  state.filters.company;
export const selectFiltersState = (state: RootState): string[] =>
  state.filters.state;
export const selectFiltersZipCode = (state: RootState): string[] =>
  state.filters.zip_code;
