import * as sut from '../map';
import { REQUERY_ALWAYS, REQUERY_NEVER } from '../../constants';

describe('action:map', () => {
  describe('addStateFilter', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_FILTER_ADDED,
        selectedState: { abbr: 'TX', name: 'Texas' },
        requery: REQUERY_ALWAYS,
      };
      const action = sut.addStateFilter({ abbr: 'TX', name: 'Texas' });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('dataNormalizationChanged', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.DATA_NORMALIZATION_SELECTED,
        requery: REQUERY_NEVER,
        value: 'foo',
      };
      const action = sut.dataNormalizationChanged('foo');
      expect(action).toEqual(expectedAction);
    });
  });

  describe('clearStateFilter', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_FILTER_CLEARED,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.clearStateFilter()).toEqual(expectedAction);
    });
  });

  describe('showStateComplaints', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_COMPLAINTS_SHOWN,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.showStateComplaints()).toEqual(expectedAction);
    });
  });

  describe('removeStateFilter', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.STATE_FILTER_REMOVED,
        selectedState: { abbr: 'TX', name: 'Texas' },
        requery: REQUERY_ALWAYS,
      };
      const action = sut.removeStateFilter({ abbr: 'TX', name: 'Texas' });
      expect(action).toEqual(expectedAction);
    });
  });
});
