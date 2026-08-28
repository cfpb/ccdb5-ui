import { createSlice } from '@reduxjs/toolkit';
import { routeChanged } from '../routes/routes-slice';
import type { ViewState } from '../../types/root-state';

export const viewState: ViewState = {
  isPrintMode: false,
  hasAdvancedSearchTips: false,
  hasFilters: true,
  isMoreAboutModalOpen: false,
  showTour: false,
  width: 0,
};

export const viewSlice = createSlice({
  name: 'view',
  initialState: viewState,
  reducers: {
    hideAdvancedSearchTips(state) {
      state.hasAdvancedSearchTips = false;
    },
    moreAboutModalHidden(state) {
      state.isMoreAboutModalOpen = false;
    },
    moreAboutModalShown(state) {
      state.isMoreAboutModalOpen = true;
    },
    showAdvancedSearchTips(state) {
      state.hasAdvancedSearchTips = true;
    },
    updatePrintModeOn(state) {
      state.isPrintMode = true;
    },
    updatePrintModeOff(state) {
      state.isPrintMode = false;
    },
    updateScreenSize(state, action) {
      state.hasFilters = action.payload > 749;
      state.width = action.payload;
    },
    updateFilterVisibility(state) {
      state.hasFilters = !state.hasFilters;
    },
    tourHidden(state) {
      state.showTour = false;
    },
    tourShown(state) {
      state.showTour = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(routeChanged, (state, action) => {
      const { params } = action.payload;

      state.isPrintMode = params.isPrintMode === 'true';
    });
  },
});

export const {
  hideAdvancedSearchTips,
  moreAboutModalHidden,
  moreAboutModalShown,
  showAdvancedSearchTips,
  tourHidden,
  tourShown,
  updateFilterVisibility,
  updatePrintModeOff,
  updatePrintModeOn,
  updateScreenSize,
} = viewSlice.actions;
export default viewSlice.reducer;
