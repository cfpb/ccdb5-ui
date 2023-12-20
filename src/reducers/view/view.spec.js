import target, {
  collapseRow,
  expandRow,
  hideAdvancedSearchTips,
  modalHidden,
  modalShown,
  showAdvancedSearchTips,
  tourHidden,
  tourShown,
  updateFilterVisibility,
  updatePrintModeOff,
  updatePrintModeOn,
  updateScreenSize,
  viewState,
} from './view';
import actions from '../../actions';
import { updateDataLens } from '../trends/trends';

describe('reducer:map', () => {
  let action;

  describe('reducer', () => {
    it('has a default state', () => {
      expect(target(undefined, {})).toEqual(viewState);
    });
  });

  describe('Modal Actions', () => {
    it('shows a modal', () => {
      action = {
        modalType: 'foo',
      };
      expect(target(viewState, modalShown(action))).toEqual({
        ...viewState,
        modalTypeShown: 'foo',
      });
    });

    it('hides a modal', () => {
      expect(
        target({ ...viewState, modalTypeShown: 'foobar' }, modalHidden())
      ).toEqual({
        ...viewState,
        modalTypeShown: false,
      });
    });
  });

  describe('Advanced Search Tips actions', () => {
    it('shows advanced tips', () => {
      expect(target(viewState, showAdvancedSearchTips())).toEqual({
        ...viewState,
        hasAdvancedSearchTips: true,
      });
    });

    it('hides advanced tips', () => {
      expect(target(viewState, hideAdvancedSearchTips())).toEqual({
        ...viewState,
        hasAdvancedSearchTips: false,
      });
    });
  });

  describe('Tour Actions', () => {
    it('shows a tour', () => {
      expect(target(viewState, tourShown())).toEqual({
        ...viewState,
        expandedRows: [],
        hasAdvancedSearchTips: false,
        showTour: true,
      });
    });

    it('hides a Tour', () => {
      expect(target({ ...viewState, showTour: true }, tourHidden())).toEqual({
        ...viewState,
        showTour: false,
      });
    });
  });

  describe('handles PRINT_MODE_ON', () => {
    expect(target(viewState, updatePrintModeOn())).toEqual({
      ...viewState,
      isPrintMode: true,
    });
  });
  describe('handles PRINT_MODE_OFF', () => {
    expect(target(viewState, updatePrintModeOff())).toEqual({
      ...viewState,
      isFromExternal: false,
      isPrintMode: false,
    });
  });

  describe('handles SCREEN_RESIZED', () => {
    it('handles widths over 749', () => {
      action = 1000;
      expect(target(viewState, updateScreenSize(action))).toEqual({
        ...viewState,
        hasFilters: true,
        width: 1000,
      });
    });
  });

  it('handles widths under 749', () => {
    action = 375;
    expect(target(viewState, updateScreenSize(action))).toEqual({
      ...viewState,
      hasFilters: false,
      width: 375,
    });
  });

  describe('handles TOGGLE_FILTER_VISIBILITY', () => {
    expect(target(viewState, updateFilterVisibility())).toEqual({
      ...viewState,
      hasFilters: false,
    });
  });

  describe('Row Chart actions', () => {
    let action, result;

    it('handles DATA_LENS_CHANGED actions', () => {
      result = target(
        { ...viewState, expandedRows: ['foo'] },
        updateDataLens(action)
      );
      expect(result).toEqual({ ...viewState, expandedRows: [] });
    });

    it('handles ROW_COLLAPSED actions', () => {
      action = {
        value: 'foo',
      };
      result = target(
        { ...viewState, expandedRows: ['foo'] },
        collapseRow(action)
      );
      expect(result).toEqual({ ...viewState, expandedRows: [] });
    });

    it('handles ROW_EXPANDED actions', () => {
      action = {
        value: 'foo',
      };
      result = target(
        { ...viewState, expandedRows: ['what'] },
        expandRow(action)
      );
      expect(result).toEqual({ ...viewState, expandedRows: ['what', 'foo'] });
    });

    it('handles ROW_EXPANDED dupe value', () => {
      action = {
        value: 'foo',
      };
      result = target(
        { ...viewState, expandedRows: ['foo'] },
        expandRow(action)
      );
      expect(result).toEqual({ ...viewState, expandedRows: ['foo'] });
    });
  });

  describe.skip('URL_CHANGED actions', () => {
    let action = null;
    let state = null;
    beforeEach(() => {
      action = {
        type: actions.URL_CHANGED,
        params: {},
      };

      state = { ...viewState };
    });

    it('handles empty params', () => {
      expect(target(state, action)).toEqual(state);
    });

    it('handles PRINT params', () => {
      action.params = { isFromExternal: 'true', isPrintMode: 'true' };
      const actual = target(state, action);
      expect(actual).toEqual({
        expandedRows: [],
        isFromExternal: true,
        hasAdvancedSearchTips: false,
        isPrintMode: true,
        hasFilters: true,
        modalTypeShown: false,
        showTour: false,
        width: 0,
      });
    });

    it('handles single expandedRows param', () => {
      action.params = { expandedRows: 'hello' };
      const actual = target(state, action);
      expect(actual.expandedRows).toEqual(['hello']);
    });

    it('handles multiple expandedRows param', () => {
      action.params = { expandedRows: ['hello', 'ma'] };
      const actual = target(state, action);
      expect(actual.expandedRows).toEqual(['hello', 'ma']);
    });
  });
});
