/* eslint-disable unicorn/consistent-boolean-name -- established selector names */
import type { RootState } from '../../types/root-state';

export const selectViewHasAdvancedSearchTips = (state: RootState): boolean =>
  state.view.hasAdvancedSearchTips;
export const selectViewHasFilters = (state: RootState): boolean =>
  state.view.hasFilters;
export const selectViewIsPrintMode = (state: RootState): boolean =>
  state.view.isPrintMode;
export const selectViewShowTour = (state: RootState): boolean =>
  state.view.showTour;
export const selectViewWidth = (state: RootState): number => state.view.width;
export const selectViewIsMoreAboutModalOpen = (state: RootState): boolean =>
  state.view.isMoreAboutModalOpen;
