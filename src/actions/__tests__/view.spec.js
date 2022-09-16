import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../../constants';
import * as sut from '../view';

describe('action:view', () => {
  describe('filterVisibilityToggled', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.TOGGLE_FILTER_VISIBILITY,
        requery: REQUERY_NEVER,
      };
      expect(sut.filterVisibilityToggled()).toEqual(expectedAction);
    });
  });

  describe('mapWarningDismissed', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.MAP_WARNING_DISMISSED,
        requery: REQUERY_NEVER,
      };
      expect(sut.mapWarningDismissed()).toEqual(expectedAction);
    });
  });

  describe('printModeOn', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.PRINT_MODE_ON,
        requery: REQUERY_NEVER,
      };
      expect(sut.printModeOn()).toEqual(expectedAction);
    });
  });

  describe('printModeOff', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.PRINT_MODE_OFF,
        requery: REQUERY_NEVER,
      };
      expect(sut.printModeOff()).toEqual(expectedAction);
    });
  });

  describe('Row Chart toggles', () => {
    describe('collapseRow', () => {
      it('creates a simple action', () => {
        const expectedAction = {
          type: sut.ROW_COLLAPSED,
          value: 'bar',
          requery: REQUERY_NEVER,
        };
        expect(sut.collapseRow('bar')).toEqual(expectedAction);
      });
    });

    describe('expandRow', () => {
      it('creates a simple action', () => {
        const expectedAction = {
          type: sut.ROW_EXPANDED,
          value: 'bar',
          requery: REQUERY_NEVER,
        };
        expect(sut.expandRow('bar')).toEqual(expectedAction);
      });
    });
  });

  describe('screenResized', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.SCREEN_RESIZED,
        screenWidth: 100,
        requery: REQUERY_NEVER,
      };
      expect(sut.screenResized(100)).toEqual(expectedAction);
    });
  });

  describe('tabChanged', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.TAB_CHANGED,
        tab: 'Foo',
        requery: REQUERY_HITS_ONLY,
      };
      expect(sut.tabChanged('Foo')).toEqual(expectedAction);
    });
  });

  describe('trendsDateWarningDismissed', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.TRENDS_DATE_WARNING_DISMISSED,
        requery: REQUERY_NEVER,
      };
      expect(sut.trendsDateWarningDismissed()).toEqual(expectedAction);
    });
  });
});
