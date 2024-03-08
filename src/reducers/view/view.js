import { processUrlArrayParams } from '../../utils';
import { createSlice } from '@reduxjs/toolkit';
import { REQUERY_NEVER } from '../../constants';

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
    hideAdvancedSearchTips: {
      reducer: (state) => {
        state.hasAdvancedSearchTips = false;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    modalHidden(state) {
      state.modalTypeShown = false;
    },
    modalShown(state, action) {
      state.modalTypeShown = action.payload.modalType;
    },
    showAdvancedSearchTips: {
      reducer: (state) => {
        state.hasAdvancedSearchTips = true;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    updatePrintModeOn(state) {
      state.isPrintMode = true;
    },
    updatePrintModeOff(state) {
      state.isPrintMode = false;
      state.isFromExternal = false;
    },
    updateScreenSize(state, action) {
      state.hasFilters = action.payload > 749;
      state.width = action.payload;
    },
    updateFilterVisibility: {
      reducer: (state) => {
        state.hasFilters = !state.hasFilters;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    tourHidden: {
      reducer: (state) => {
        state.showTour = false;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    tourShown: {
      reducer: (state) => {
        state.showTour = true;
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    collapseRow: {
      reducer: (state, action) => {
        state.expandedRows = state.expandedRows.filter(
          (obj) => obj !== action.payload,
        );
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    expandRow: {
      reducer: (state, action) => {
        if (!state.expandedRows.includes(action.payload)) {
          state.expandedRows.push(action.payload);
        }
      },
      prepare: (payload) => {
        return {
          payload,
          meta: {
            requery: REQUERY_NEVER,
          },
        };
      },
    },
    resetExpandedRows(state) {
      state.expandedRows = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('trends/updateDataLens', (state) => {
        state.expandedRows = [];
      })
      .addCase('query/processParams', (state, action) => {
        const params = action.payload.params;

        state.isPrintMode = params.isPrintMode === 'true';
        state.isFromExternal = params.isFromExternal === 'true';

        const arrayParams = ['expandedRows'];
        processUrlArrayParams(params, state, arrayParams);

        return state;
      });
  },
});

export const {
  processParams,
  resetExpandedRows,
  expandRow,
  collapseRow,
  tourShown,
  tourHidden,
  updateFilterVisibility,
  updateScreenSize,
  updatePrintModeOff,
  updatePrintModeOn,
  showAdvancedSearchTips,
  modalShown,
  modalHidden,
  hideAdvancedSearchTips,
} = viewSlice.actions;
export default viewSlice.reducer;
