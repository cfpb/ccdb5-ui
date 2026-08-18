import { createSlice } from '@reduxjs/toolkit';

export const viewState = {
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
    hideAdvancedSearchTips: {
      reducer: (state) => {
        state.hasAdvancedSearchTips = false;
      },
    },
    moreAboutModalHidden(state) {
      state.isMoreAboutModalOpen = false;
    },
    moreAboutModalShown(state) {
      state.isMoreAboutModalOpen = true;
    },
    showAdvancedSearchTips: {
      reducer: (state) => {
        state.hasAdvancedSearchTips = true;
      },
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
    updateFilterVisibility: {
      reducer: (state) => {
        state.hasFilters = !state.hasFilters;
      },
    },
    tourHidden: {
      reducer: (state) => {
        state.showTour = false;
      },
    },
    tourShown: {
      reducer: (state) => {
        state.showTour = true;
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase('routes/routeChanged', (state, action) => {
      const params = action.payload.params;

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
