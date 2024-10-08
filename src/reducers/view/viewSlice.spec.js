import target, {
  hideAdvancedSearchTips,
  modalHidden,
  modalShown,
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
  viewState,
} from './viewSlice';
import * as actions from '../../actions';
import * as types from '../../constants';
import { dataLensChanged, focusChanged } from '../../actions';

describe('reducer:View', () => {
  let action;

  describe('reducer', () => {
    it('has a default state', () => {
      expect(target(undefined, {})).toEqual(viewState);
    });
  });

  describe('Modal Actions', () => {
    it('shows a modal', () => {
      expect(target(viewState, modalShown('foo'))).toEqual({
        ...viewState,
        modalTypeShown: 'foo',
      });
    });

    it('hides a modal', () => {
      expect(
        target({ ...viewState, modalTypeShown: 'foobar' }, modalHidden()),
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
    let result;

    it('handles ROW_COLLAPSED actions', () => {
      const payload = 'foo';
      result = target(
        { ...viewState, expandedRows: ['foo'] },
        rowCollapsed(payload),
      );
      expect(result).toEqual({ ...viewState, expandedRows: [] });
    });

    it('handles ROW_EXPANDED actions', () => {
      const payload = 'foo';
      result = target(
        { ...viewState, expandedRows: ['what'] },
        rowExpanded(payload),
      );
      expect(result).toEqual({ ...viewState, expandedRows: ['what', 'foo'] });
    });

    it('handles ROW_EXPANDED dupe value', () => {
      const payload = 'foo';
      result = target(
        { ...viewState, expandedRows: ['foo'] },
        rowExpanded(payload),
      );
      expect(result).toEqual({ ...viewState, expandedRows: ['foo'] });
    });
  });

  describe('URL_CHANGED actions', () => {
    let state = null;
    beforeEach(() => {
      state = { ...viewState };
    });

    it('handles empty params', () => {
      expect(target(state, actions.routeChanged('/', {}))).toEqual(state);
    });

    it('handles PRINT params', () => {
      const params = { isPrintMode: 'true' };
      const actual = target(state, actions.routeChanged('/', params));
      expect(actual).toEqual({
        expandedRows: [],
        hasAdvancedSearchTips: false,
        hasFilters: true,
        isPrintMode: true,
        modalTypeShown: false,
        showTour: false,
        tab: types.MODE_TRENDS,
        width: 0,
      });
    });

    it('handles single expandedRows param', () => {
      const actual = target(
        state,
        actions.routeChanged('/', { expandedRows: 'hello' }),
      );
      expect(actual.expandedRows).toEqual(['hello']);
    });

    it('handles multiple expandedRows param', () => {
      const params = { expandedRows: ['hello', 'ma'] };
      const actual = target(state, actions.routeChanged('/', params));
      expect(actual.expandedRows).toEqual(['hello', 'ma']);
    });
  });

  describe('Tabs', () => {
    let tab, state;
    beforeEach(() => {
      state = {
        ...viewState,
        tab: 'bar',
      };
    });

    it('handles TAB_CHANGED actions - default', () => {
      tab = 'foo';
      expect(target(state, tabChanged(tab))).toEqual({
        ...state,
        tab: 'Trends',
      });
    });

    it('handles Trends TAB_CHANGED actions', () => {
      tab = 'Trends';
      expect(target(state, tabChanged(tab))).toEqual({
        ...state,
        tab: 'Trends',
      });
    });
  });

  describe('Trends actions', () => {
    let state;
    beforeEach(() => {
      state = {
        ...viewState,
      };
    });

    it('handles dataLensChanged', () => {
      state.expandedRows = ['a', 'b', 'c'];
      expect(target(state, dataLensChanged('Product'))).toEqual(viewState);
    });
    it('handles focusChanged', () => {
      state.tab = 'List';
      expect(target(state, focusChanged('Some product'))).toEqual({
        ...viewState,
        tab: 'Trends',
      });
    });
  });
});
