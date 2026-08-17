import target, {
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
} from './view-slice';
import * as actions from '../../actions';
import * as types from '../../constants';

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

  describe('Print Actions', () => {
    it('handles PRINT_MODE_ON', () => {
      expect(target(viewState, updatePrintModeOn())).toEqual({
        ...viewState,
        isPrintMode: true,
      });
    });
    it('handles PRINT_MODE_OFF', () => {
      expect(target(viewState, updatePrintModeOff())).toEqual({
        ...viewState,
        isPrintMode: false,
      });
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
    it('handles widths under 749', () => {
      action = 375;
      expect(target(viewState, updateScreenSize(action))).toEqual({
        ...viewState,
        hasFilters: false,
        width: 375,
      });
    });
  });

  describe('filter panel actions', () => {
    it('handles TOGGLE_FILTER_VISIBILITY', () => {
      expect(target(viewState, updateFilterVisibility())).toEqual({
        ...viewState,
        hasFilters: false,
      });
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
        hasAdvancedSearchTips: false,
        hasFilters: true,
        isPrintMode: true,
        modalTypeShown: false,
        showTour: false,
        tab: types.MODE_LIST,
        width: 0,
      });
    });
  });
});
