import target, { defaultView } from './view';
import * as actions from '../../actions';

describe('reducer:map', () => {
  let action;

  describe('reducer', () => {
    it('has a default state', () => {
      expect(target(undefined, {})).toEqual(defaultView);
    });
  });

  describe('Modal Actions', () => {
    it('shows a modal', () => {
      action = {
        type: actions.MODAL_SHOWN,
        modalType: 'foo',
      };
      expect(target({}, action)).toEqual({
        modalTypeShown: 'foo',
      });
    });

    it('hides a modal', () => {
      action = {
        type: actions.MODAL_HID,
      };
      expect(target({ modalTypeShown: 'foobar' }, action)).toEqual({
        modalTypeShown: false,
      });
    });
  });

  describe('Advanced Search Tips actions', () => {
    it('shows advanced tips', () => {
      action = {
        type: actions.SHOW_ADVANCED_SEARCH_TIPS,
      };
      expect(target({}, action)).toEqual({
        hasAdvancedSearchTips: true,
      });
    });

    it('hides advanced tips', () => {
      action = {
        type: actions.HIDE_ADVANCED_SEARCH_TIPS,
      };
      expect(target({}, action)).toEqual({
        hasAdvancedSearchTips: false,
      });
    });
  });

  describe('Tour Actions', () => {
    it('shows a tour', () => {
      action = {
        type: actions.SHOW_TOUR,
      };
      expect(target({}, action)).toEqual({
        expandedRows: [],
        hasAdvancedSearchTips: false,
        showTour: true,
      });
    });

    it('hides a Tour', () => {
      action = {
        type: actions.HIDE_TOUR,
      };
      expect(target({ showTour: true }, action)).toEqual({
        showTour: false,
      });
    });
  });

  describe('handles PRINT_MODE_ON', () => {
    action = {
      type: actions.PRINT_MODE_ON,
    };
    expect(target({}, action)).toEqual({
      isPrintMode: true,
    });
  });
  describe('handles PRINT_MODE_OFF', () => {
    action = {
      type: actions.PRINT_MODE_OFF,
    };
    expect(target({}, action)).toEqual({
      isFromExternal: false,
      isPrintMode: false,
    });
  });

  describe('handles SCREEN_RESIZED', () => {
    it('handles widths over 749', () => {
      action = {
        type: actions.SCREEN_RESIZED,
        screenWidth: 1000,
      };
      expect(target({}, action)).toEqual({
        hasFilters: true,
        width: 1000,
      });
    });
  });

  it('handles widths under 749', () => {
    action = {
      type: actions.SCREEN_RESIZED,
      screenWidth: 375,
    };
    expect(target({}, action)).toEqual({
      hasFilters: false,
      width: 375,
    });
  });

  describe('handles TOGGLE_FILTER_VISIBILITY', () => {
    action = {
      type: actions.TOGGLE_FILTER_VISIBILITY,
    };
    expect(target({}, action)).toEqual({
      hasFilters: true,
    });
  });

  describe('Row Chart actions', () => {
    let action, result;

    it('handles DATA_LENS_CHANGED actions', () => {
      action = {
        type: actions.DATA_LENS_CHANGED,
      };
      result = target({ expandedRows: ['foo'] }, action);
      expect(result).toEqual({ expandedRows: [] });
    });

    it('handles ROW_COLLAPSED actions', () => {
      action = {
        type: actions.ROW_COLLAPSED,
        value: 'foo',
      };
      result = target({ expandedRows: ['foo'] }, action);
      expect(result).toEqual({ expandedRows: [] });
    });

    it('handles ROW_EXPANDED actions', () => {
      action = {
        type: actions.ROW_EXPANDED,
        value: 'foo',
      };
      result = target({ expandedRows: ['what'] }, action);
      expect(result).toEqual({ expandedRows: ['what', 'foo'] });
    });

    it('handles ROW_EXPANDED dupe value', () => {
      action = {
        type: actions.ROW_EXPANDED,
        value: 'foo',
      };
      result = target({ expandedRows: ['foo'] }, action);
      expect(result).toEqual({ expandedRows: ['foo'] });
    });
  });

  describe('URL_CHANGED actions', () => {
    let action = null;
    let state = null;
    beforeEach(() => {
      action = {
        type: actions.URL_CHANGED,
        params: {},
      };

      state = { ...defaultView };
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
