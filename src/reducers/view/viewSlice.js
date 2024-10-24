import { processUrlArrayParams } from '../../utils';
import { createSlice } from '@reduxjs/toolkit';
import * as types from '../../constants';
import { enforceValues } from '../../utils/reducers';

export const viewState = {
  expandedRows: [],
  isPrintMode: false,
  hasAdvancedSearchTips: false,
  hasFilters: true,
  modalTypeShown: false,
  showTour: false,
  tab: types.MODE_TRENDS,
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
    modalHidden(state) {
      state.modalTypeShown = false;
    },
    modalShown(state, action) {
      state.modalTypeShown = action.payload;
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
    tabChanged: {
      reducer: (state, action) => {
        state.tab = enforceValues(action.payload, 'tab');
        state.expandedRows = [];
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
    rowCollapsed: {
      reducer: (state, action) => {
        state.expandedRows = state.expandedRows.filter(
          (obj) => obj !== action.payload,
        );
      },
    },
    rowExpanded: {
      reducer: (state, action) => {
        if (!state.expandedRows.includes(action.payload)) {
          state.expandedRows.push(action.payload);
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('trends/dataLensChanged', (state) => {
        state.expandedRows = [];
      })
      .addCase('trends/focusChanged', (state) => {
        state.tab = types.MODE_TRENDS;
      })
      .addCase('routes/routeChanged', (state, action) => {
        const params = action.payload.params;

        state.isPrintMode = params.isPrintMode === 'true';
        state.tab = enforceValues(params.tab, 'tab');

        const arrayParams = ['expandedRows'];
        processUrlArrayParams(params, state, arrayParams);
      });
  },
});

export const {
  hideAdvancedSearchTips,
  modalHidden,
  modalShown,
  processParams,
  rowCollapsed,
  rowExpanded,
  showAdvancedSearchTips,
  tabChanged,
  tourHidden,
  tourShown,
  updateFilterVisibility,
  updatePrintModeOff,
  updatePrintModeOn,
  updateScreenSize,
} = viewSlice.actions;
export default viewSlice.reducer;
