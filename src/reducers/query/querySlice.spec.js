import target, {
  alignDateRange,
  dateRangeChanged,
  queryState,
  changeDates,
  sortChanged,
  sizeChanged,
  nextPageShown,
  prevPageShown,
  searchTextChanged,
  searchFieldChanged,
} from './querySlice';
import * as types from '../../constants';
import dayjs from 'dayjs';
import { startOfToday } from '../../utils';
import { complaintsReceived } from '../results/resultsSlice';
import { routeChanged } from '../routes/routesSlice';

const maxDate = startOfToday();

describe('reducer:query', () => {
  let result, state;
  describe('default', () => {
    it('has a default state', () => {
      result = target(undefined, {});
      expect(result).toEqual({
        breakPoints: {},
        dateInterval: 'Month',
        dateRange: '3y',
        date_received_max: '2020-05-05',
        date_received_min: '2017-05-05',
        from: 0,
        searchText: '',
        searchField: 'all',
        page: 1,
        searchAfter: '',
        size: 25,
        sort: 'created_date_desc',
        totalPages: 0,
        trendsDateWarningEnabled: false,
      });
    });
  });

  describe('COMPLAINTS_RECEIVED actions', () => {
    it('updates total number of pages', () => {
      const payload = {
        _meta: {
          break_points: {
            2: [2, 2],
            3: [3, 2],
            4: [4, 2],
            5: [5, 2],
          },
        },
        hits: {
          total: { value: 10000 },
        },
      };

      state = {
        ...queryState,
        page: 10,
        size: 100,
        totalPages: 5,
      };

      expect(target(state, complaintsReceived(payload))).toEqual({
        ...state,
        breakPoints: {
          2: [2, 2],
          3: [3, 2],
          4: [4, 2],
          5: [5, 2],
        },
      });
    });

    it('limits the current page correctly', () => {
      const payload = {
        _meta: {
          break_points: {
            2: [2, 2],
            3: [3, 2],
            4: [4, 2],
            5: [5, 2],
          },
        },
        hits: {
          total: { value: 10000 },
        },
      };

      state = {
        ...queryState,
        page: 101,
        size: 100,
      };

      expect(target(state, complaintsReceived(payload))).toEqual({
        ...state,
        breakPoints: {
          2: [2, 2],
          3: [3, 2],
          4: [4, 2],
          5: [5, 2],
        },
        page: 100,
        size: 100,
        totalPages: 5,
      });
    });
  });

  it('handles SEARCH_FIELD_CHANGED actions', () => {
    const searchField = 'bar';
    state = {
      ...queryState,
      from: 80,
      searchText: 'foo',
      size: 100,
    };
    expect(target(state, searchFieldChanged(searchField))).toEqual({
      ...state,
      breakPoints: {},
      from: 0,
      page: 1,
      searchAfter: '',
      searchField: 'bar',
      searchText: 'foo',
      size: 100,
    });
  });

  it('handles SEARCH_TEXT_CHANGED actions', () => {
    const searchText = 'bar';
    state = {
      ...queryState,
      searchText: 'foo',
    };
    expect(target(state, searchTextChanged(searchText)).searchText).toEqual(
      'bar',
    );
  });

  describe('Pager', () => {
    it('handles NEXT_PAGE_SHOWN actions', () => {
      state = {
        ...queryState,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        size: 100,
        totalPages: 3,
      };
      expect(target(state, nextPageShown())).toEqual({
        ...state,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 200,
        page: 3,
        searchAfter: '909_131',
        size: 100,
        totalPages: 3,
      });
    });

    it('handles PREV_PAGE_SHOWN actions', () => {
      state = {
        ...queryState,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 3,
        size: 100,
      };
      expect(target(state, prevPageShown())).toEqual({
        ...state,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        searchAfter: '99_22131',
        size: 100,
      });
    });

    it('handles missing breakPoints actions', () => {
      state = {
        ...queryState,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        size: 100,
      };
      expect(target(state, prevPageShown())).toEqual({
        ...state,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 0,
        page: 1,
        searchAfter: '',
        size: 100,
      });
    });
  });

  describe('Action Bar', () => {
    let sort, size;
    it('handles SIZE_CHANGED actions', () => {
      size = '50';

      state = {
        ...queryState,
        size: 100,
      };
      expect(target(state, sizeChanged(size))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        size: '50',
      });
    });

    it('handles SORT_CHANGED actions - default', () => {
      sort = 'foo';

      state = {
        ...queryState,
        from: 100,
        size: 100,
      };
      expect(target(state, sortChanged(sort))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        sort: 'created_date_desc',
        size: 100,
      });
    });

    it('handles SORT_CHANGED actions - valid value', () => {
      sort = 'relevance_asc';
      state = {
        ...queryState,
        from: 100,
        size: 100,
      };
      expect(target(state, sortChanged(sort))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        sort: 'relevance_asc',
        size: 100,
      });
    });
  });

  describe('URL_CHANGED actions', () => {
    let params, actual, state;

    beforeEach(() => {
      params = {};
      state = { ...queryState };
    });

    it('handles empty params', () => {
      expect(target(state, routeChanged('', params))).toEqual(state);
    });

    it('handles string params', () => {
      params = { searchText: 'hello' };
      actual = target(state, routeChanged('', params));
      expect(actual.searchText).toEqual('hello');
    });

    it('handles size parameter', () => {
      params = { size: '100' };
      actual = target(state, routeChanged('', params));
      expect(actual.size).toEqual(100);
    });

    it('handles page number', () => {
      params = { page: '100' };
      actual = target(state, routeChanged('', params));
      expect(actual.page).toEqual(100);
    });

    it('handles bogus date parameters', () => {
      params = { dateInterval: '3y', dateRange: 'Week' };
      actual = target(state, routeChanged('', params));
      expect(actual.dateInterval).toEqual('Month');
      expect(actual.dateRange).toEqual('3y');
    });

    it('handles bogus size & sort parameters', () => {
      params = { size: '9999', sort: 'tables' };
      actual = target(state, routeChanged('', params));
      expect(actual.size).toEqual(25);
      expect(actual.sort).toEqual('created_date_desc');
    });

    it('converts some parameters to dates', () => {
      params = { date_received_min: '2013-02-03' };
      actual = target(state, routeChanged('', params)).date_received_min;
      expect(actual).toEqual('2013-02-03');
    });

    it('ignores incorrect dates', () => {
      params = { date_received_min: 'foo' };
      expect(target(state, routeChanged('', params))).toEqual(state);
    });

    it('ignores unknown parameters', () => {
      params = { foo: 'bar' };
      expect(target(state, routeChanged('', params))).toEqual(state);
    });

    it('handles the "All" button from the landing page', () => {
      params = { dateRange: 'All' };

      actual = target(state, routeChanged('', params));

      expect(actual.date_received_min).toEqual('2011-12-01');
      expect(actual.date_received_max).toEqual('2020-05-05');
      expect(actual.dateRange).toEqual('All');
    });

    describe('dates', () => {
      beforeEach(() => {
        state.dateRange = '2y';
      });

      it('clears the default range if the dates are not 3 years apart', () => {
        state.date_received_min = dayjs(
          new Date(dayjs(maxDate).subtract(2, 'years')),
        ).toISOString();
        alignDateRange(state);
        expect(state.dateRange).toEqual('');
      });

      it('sets the All range if the dates are right', () => {
        state.date_received_min = types.DATE_RANGE_MIN;
        alignDateRange(state);
        expect(state.dateRange).toEqual('All');
      });

      it('sets the 3m range if the dates are right', () => {
        state.date_received_min = dayjs(
          new Date(dayjs(maxDate).subtract(3, 'months')),
        ).toISOString();
        alignDateRange(state);
        expect(state.dateRange).toEqual('3m');
      });

      it('sets the 6m range if the dates are right', () => {
        state.date_received_min = dayjs(
          new Date(dayjs(maxDate).subtract(6, 'months')),
        ).toISOString();

        alignDateRange(state);
        expect(state.dateRange).toEqual('6m');
      });

      it('sets the 1y range if the dates are right', () => {
        state.date_received_min = dayjs(
          new Date(dayjs(maxDate).subtract(1, 'year')),
        ).toISOString();
        alignDateRange(state);
        expect(state.dateRange).toEqual('1y');
      });

      it('sets the 3y range if the dates are right', () => {
        alignDateRange(state);
        expect(state.dateRange).toEqual('3y');
      });
    });
  });

  describe('Dates', () => {
    describe('changeDates actions', () => {
      let result;
      const filterName = 'date_received';
      const minDate = new Date(2001, 0, 30);
      const maxDate = new Date(2013, 1, 3);
      beforeEach(() => {
        result = null;
      });

      it('adds the dates', () => {
        const testState = { ...queryState };
        delete testState.dateRange;
        expect(
          target(testState, changeDates(filterName, minDate, maxDate)),
        ).toEqual({
          ...testState,
          breakPoints: {},
          date_received_min: '2001-01-30',
          date_received_max: '2013-02-03',
          from: 0,
          page: 1,
          searchAfter: '',
        });
      });

      it('clears dateRange when no match, i.e. when one or both dates have actually changed', () => {
        result = target(
          {
            ...queryState,
            date_received_min: minDate,
            date_received_max: maxDate,
            dateRange: '1y',
          },
          changeDates(filterName, minDate, maxDate),
        );
        expect(result.dateRange).toBeFalsy();
      });

      it('adds dateRange', () => {
        // date range should only be applied to when the max date is
        // today's date
        const max = dayjs(startOfToday());
        const min = new Date(dayjs(max).subtract(3, 'months'));
        result = target({ ...queryState }, changeDates(filterName, min, max));
        expect(result.dateRange).toEqual('3m');
      });

      it('does not add empty dates', () => {
        expect(
          target({ ...queryState }, changeDates(filterName, '', '')),
        ).toEqual({
          ...queryState,
          breakPoints: {},
          from: 0,
          page: 1,
          searchAfter: '',
        });
      });
    });

    describe('DATE_RANGE_CHANGED actions', () => {
      let action, result;
      beforeEach(() => {
        action = '';
      });

      it('handles All range', () => {
        action = 'All';
        result = target({}, dateRangeChanged(action));
        expect(result.date_received_min).toEqual('2011-12-01');
      });

      it('handles 1y range', () => {
        action = '1y';
        result = target({ ...queryState }, dateRangeChanged(action));
        expect(result).toEqual({
          ...queryState,
          breakPoints: {},
          dateInterval: 'Month',
          dateRange: '1y',
          date_received_max: '2020-05-05',
          date_received_min: '2019-05-05',
          from: 0,
          page: 1,
          searchAfter: '',
          trendsDateWarningEnabled: false,
        });
      });

      it('default range handling', () => {
        action = 'foo';
        result = target({ ...queryState }, dateRangeChanged(action));
        // only set max date
        expect(result).toEqual({
          ...queryState,
          breakPoints: {},
          dateRange: '3y',
          date_received_min: '2017-05-05',
          date_received_max: '2020-05-05',
          from: 0,
          page: 1,
          searchAfter: '',
        });
      });
    });
  });
});