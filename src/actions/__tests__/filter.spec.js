import { REQUERY_ALWAYS } from '../../constants';
import * as sut from '../filter';

describe('action:filterActions', () => {
  describe('changeDates', () => {
    it('creates a simple action', () => {
      const filterName = 'date_received';
      const minDate = 'foo';
      const maxDate = 'bar';
      const expectedAction = {
        type: sut.DATES_CHANGED,
        filterName,
        minDate,
        maxDate,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.changeDates(filterName, minDate, maxDate)).toEqual(
        expectedAction,
      );
    });
  });

  describe('changeDateInterval', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.DATE_INTERVAL_CHANGED,
        dateInterval: 'foo',
        requery: REQUERY_ALWAYS,
      };
      expect(sut.changeDateInterval('foo')).toEqual(expectedAction);
    });
  });

  describe('dateRangeToggled', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.DATE_RANGE_CHANGED,
        dateRange: 'foo',
        requery: REQUERY_ALWAYS,
      };
      expect(sut.dateRangeToggled('foo')).toEqual(expectedAction);
    });
  });

  describe('changeFlagFilter', () => {
    it('creates a simple action', () => {
      const filterName = 'has_narrative';
      const expectedAction = {
        type: sut.FILTER_FLAG_CHANGED,
        filterName,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.toggleFlagFilter(filterName)).toEqual(expectedAction);
    });
  });

  describe('toggleFilter', () => {
    it('creates a simple action', () => {
      const filterName = 'timely';
      const filterValue = 'Yes';
      const expectedAction = {
        type: sut.FILTER_CHANGED,
        filterName,
        filterValue,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.toggleFilter(filterName, filterValue)).toEqual(expectedAction);
    });
  });

  describe('addFilter', () => {
    it('creates a simple action', () => {
      const filterName = 'timely';
      const filterValue = 'Yes';
      const expectedAction = {
        type: sut.FILTER_ADDED,
        filterName,
        filterValue,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.addFilter(filterName, filterValue)).toEqual(expectedAction);
    });
  });

  describe('removeFilter', () => {
    it('creates a simple action', () => {
      const filterName = 'timely';
      const filterValue = 'Yes';
      const expectedAction = {
        type: sut.FILTER_REMOVED,
        filterName,
        filterValue,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.removeFilter(filterName, filterValue)).toEqual(expectedAction);
    });
  });

  describe('removeAllFilters', () => {
    it('creates a simple action', () => {
      const expectedAction = {
        type: sut.FILTER_ALL_REMOVED,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.removeAllFilters()).toEqual(expectedAction);
    });
  });

  describe('addMultipleFilters', () => {
    it('creates a simple action', () => {
      const filterName = 'issue';
      const values = ['Mo Money', 'Mo Problems'];
      const expectedAction = {
        type: sut.FILTER_MULTIPLE_ADDED,
        filterName,
        values,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.addMultipleFilters(filterName, values)).toEqual(
        expectedAction,
      );
    });
  });

  describe('removeMultipleFilters', () => {
    it('creates a simple action', () => {
      const filterName = 'issue';
      const values = ['Mo Money', 'Mo Problems'];
      const expectedAction = {
        type: sut.FILTER_MULTIPLE_REMOVED,
        filterName,
        values,
        requery: REQUERY_ALWAYS,
      };
      expect(sut.removeMultipleFilters(filterName, values)).toEqual(
        expectedAction,
      );
    });
  });
});
