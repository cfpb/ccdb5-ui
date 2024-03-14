import { enablePer1000, processUrlArrayParams } from '../../utils';
import { createSlice } from '@reduxjs/toolkit';
import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../../constants';
import * as types from '../../constants';
import { enforceValues } from '../../utils/reducers';

export const viewState = {
  dataNormalization: types.GEO_NORM_NONE,
  enablePer1000: false,
  expandedRows: [],
  isFromExternal: false,
  isPrintMode: false,
  hasAdvancedSearchTips: false,
  hasFilters: true,
  mapWarningEnabled: true,
  modalTypeShown: false,
  showTour: false,
  tab: types.MODE_TRENDS,
  width: 0,
};

/**
 * helper function to check if per1000 & map warnings should be enabled
 *
 * @param {object} state - state we need to validate
 */
export function validatePer1000(state) {
  state.enablePer1000 = enablePer1000(state);
  if (state.enablePer1000) {
    state.mapWarningEnabled = true;
  }
  // if we enable per1k then don't reset it
  state.dataNormalization = state.enablePer1000
    ? state.dataNormalization || types.GEO_NORM_NONE
    : types.GEO_NORM_NONE;
}

export const viewSlice = createSlice({
  name: 'view',
  initialState: viewState,
  reducers: {
    dataNormalizationUpdated: {
      reducer: (state, action) => {
        state.dataNormalization = enforceValues(
          action.payload.value,
          'dataNormalization',
        );
        state.enablePer1000 =
          state.dataNormalization === types.GEO_NORM_PER1000;
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
    mapWarningDismissed: {
      reducer: (state) => {
        state.mapWarningEnabled = false;
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
    tabChanged: {
      reducer: (state, action) => {
        state.tab = enforceValues(action.payload.tab, 'tab');
        state.focus = state.tab === types.MODE_TRENDS ? state.focus : '';
        validatePer1000(state);
      },
      prepare: (tab) => {
        return {
          payload: { tab },
          meta: {
            requery: REQUERY_HITS_ONLY,
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
      .addCase('routes/routeChanged', (state, action) => {
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
  collapseRow,
  dataNormalizationUpdated,
  expandRow,
  hideAdvancedSearchTips,
  mapWarningDismissed,
  modalHidden,
  modalShown,
  processParams,
  resetExpandedRows,
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
