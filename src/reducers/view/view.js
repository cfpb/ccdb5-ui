import { processUrlArrayParams } from '../../utils';
import {createSlice} from "@reduxjs/toolkit";

export const viewState = {
  expandedRows: [],
  isFromExternal: false,
  isPrintMode: false,
  hasAdvancedSearchTips: false,
  hasFilters: true,
  showTour: false,
  modalTypeShown: false,
  width: 0,
};

export const viewSlice = createSlice({
  name: 'view',
  initialState: viewState,
  reducers: {
    hideAdvancedSearchTips(state) {
      return {
        ...state,
        hasAdvancedSearchTips: false,
      };
    },
    modalHidden(state) {
      return {
        ...state,
        modalTypeShown: false,
      };
    },
    modalShown(state, action) {
      return {
        ...state,
        modalTypeShown: action.modalType,
      };
    },
    showAdvancedSearchTips(state) {
      return {
        ...state,
        hasAdvancedSearchTips: true,
      };
    },
    updatePrintModeOn(state) {
      return {
        ...state,
        isPrintMode: true,
      };
    },
    updatePrintModeOff(state) {
      return {
        ...state,
        isFromExternal: false,
        isPrintMode: false,
      };
    },
    updateScreenSize(state, action) {
      return {
        ...state,
        hasFilters: action.screenWidth > 749,
        width: action.screenWidth,
      };
    },
    updateFilterVisibility(state) {
      return {
        ...state,
        hasFilters: !state.hasFilters,
      };
    },
    tourHidden(state) {
      return {
        ...state,
        showTour: false,
      };
    },
    tourShown(state) {
      return {
        ...state,
        expandedRows: [],
        hasAdvancedSearchTips: false,
        showTour: true,
      };
    },
    collapseRow(state, action) {
      const { expandedRows } = state;
      const item = action.value;

      return {
        ...state,
        expandedRows: expandedRows.filter((o) => o !== item),
      };
    },
    expandRow(state, action) {
      const { expandedRows } = state;
      const item = action.value;

      if (!expandedRows.includes(item)) {
        expandedRows.push(item);
      }

      return {
        ...state,
        expandedRows,
      };
    },
    resetExpandedRows(state) {
      return {
        ...state,
        expandedRows: [],
      };
    },
    processParams(state, action) {
      const params = action.params;

      state.isPrintMode = params.isPrintMode === 'true';
      state.isFromExternal = params.isFromExternal === 'true';

      const arrayParams = ['expandedRows'];
      processUrlArrayParams(params, state, arrayParams);

      return state;
    }
  }
})


export const {processParams, resetExpandedRows, expandRow, collapseRow, tourShown, tourHidden, updateFilterVisibility, updateScreenSize, updatePrintModeOff, updatePrintModeOn, showAdvancedSearchTips, modalShown, modalHidden, hideAdvancedSearchTips } = viewSlice.actions;
export default viewSlice.reducer;
