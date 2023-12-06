import target, {
  alignDateRange,
  changeDateRange,
  queryState,
  filterArrayAction,
  processParams,
  changeDateInterval,
  dismissTrendsDateWarning,
  removeStateFilter,
  clearStateFilter,
  addStateFilter,
  showStateComplaints,
  dismissMapWarning,
  updateDataNormalization,
  changeDates,
} from './query';
import actions from '../../actions';
import * as types from '../../constants';
import dayjs from 'dayjs';
import { startOfToday } from '../../utils';
import {
  changeFocus,
  removeFocus,
  updateChartType,
  updateDataLens,
  updateDataSubLens,
} from '../trends/trends';
import { formatDate } from '../../utils/formatDate';

const maxDate = startOfToday();

describe('reducer:query', () => {
  let action, result, state;
  const test_date_received_max = maxDate;
  const test_date_received_min = new Date(
    dayjs(startOfToday()).subtract(3, 'years')
  );
  describe('default', () => {
    it('has a default state', () => {
      result = target(undefined, {});
      expect(result).toEqual({
        breakPoints: {},
        chartType: 'line',
        dataNormalization: types.GEO_NORM_NONE,
        dateInterval: 'Month',
        dateRange: '3y',
        date_received_max: test_date_received_max,
        date_received_min: test_date_received_min,
        enablePer1000: false,
        focus: '',
        from: 0,
        lens: 'Product',
        mapWarningEnabled: true,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=' +
          '2017-05-05&field=all&lens=product&sub_lens=sub_product&' +
          'trend_depth=5&trend_interval=month',
        searchText: '',
        searchField: 'all',
        page: 1,
        searchAfter: '',
        size: 25,
        sort: 'created_date_desc',
        subLens: 'sub_product',
        tab: 'Trends',
        totalPages: 0,
        trendDepth: 5,
        trendsDateWarningEnabled: false,
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });
  });

  describe('COMPLAINTS_RECEIVED actions', () => {
    it('updates total number of pages', () => {
      action = {
        type: actions.COMPLAINTS_RECEIVED,
        data: {
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
        },
      };

      state = {
        page: 10,
        size: 100,
      };

      expect(target(state, action)).toEqual({
        breakPoints: {
          2: [2, 2],
          3: [3, 2],
          4: [4, 2],
          5: [5, 2],
        },
        page: 10,
        queryString: '',
        size: 100,
        totalPages: 5,
        search: '?',
      });
    });

    it('limits the current page correctly', () => {
      action = {
        type: actions.COMPLAINTS_RECEIVED,
        data: {
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
        },
      };

      state = {
        page: 101,
        size: 100,
      };

      expect(target(state, action)).toEqual({
        breakPoints: {
          2: [2, 2],
          3: [3, 2],
          4: [4, 2],
          5: [5, 2],
        },
        page: 100,
        queryString: '',
        size: 100,
        totalPages: 5,
        search: '?',
      });
    });
  });

  it('handles SEARCH_FIELD_CHANGED actions', () => {
    action = {
      type: actions.SEARCH_FIELD_CHANGED,
      searchField: 'bar',
    };
    state = {
      from: 80,
      searchText: 'foo',
      size: 100,
    };
    expect(target(state, action)).toEqual({
      breakPoints: {},
      from: 0,
      page: 1,
      queryString: '?field=bar&search_term=foo',
      searchAfter: '',
      searchField: 'bar',
      searchText: 'foo',
      size: 100,
      search: '?searchField=bar&searchText=foo',
    });
  });

  it('handles SEARCH_TEXT_CHANGED actions', () => {
    action = {
      type: actions.SEARCH_TEXT_CHANGED,
      searchText: 'bar',
    };
    state = {
      from: 80,
      searchText: 'foo',
      size: 100,
    };
    expect(target(state, action)).toEqual({
      breakPoints: {},
      from: 0,
      page: 1,
      queryString: '?search_term=bar',
      searchAfter: '',
      searchText: 'bar',
      size: 100,
      search: '?searchText=bar',
    });
  });

  describe('trend depth', () => {
    beforeEach(() => {
      state = {
        tab: types.MODE_TRENDS,
        trendDepth: 5,
      };
    });
    it('handles DEPTH_CHANGED', () => {
      action = {
        type: actions.DEPTH_CHANGED,
        depth: 13,
      };
      expect(target(state, action)).toEqual({
        chartType: 'line',
        queryString: '?trend_depth=13',
        tab: types.MODE_TRENDS,
        trendDepth: 13,
        trendsDateWarningEnabled: false,
        search: '?chartType=line&tab=Trends',
      });
    });
    it('handles DEPTH_RESET', () => {
      action = {
        type: actions.DEPTH_RESET,
      };
      state.trendDepth = 1000;
      expect(target(state, action)).toEqual({
        chartType: 'line',
        queryString: '?trend_depth=5',
        tab: types.MODE_TRENDS,
        trendDepth: 5,
        trendsDateWarningEnabled: false,
        search: '?chartType=line&tab=Trends',
      });
    });
  });

  describe('Pager', () => {
    it('handles NEXT_PAGE_SHOWN actions', () => {
      action = {
        type: actions.NEXT_PAGE_SHOWN,
      };
      state = {
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, action)).toEqual({
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 200,
        page: 3,
        queryString: '?frm=200&search_after=909_131&size=100',
        searchAfter: '909_131',
        size: 100,
        tab: types.MODE_LIST,
        search: '?page=3&size=100&tab=List',
      });
    });

    it('handles PREV_PAGE_SHOWN actions', () => {
      action = {
        type: actions.PREV_PAGE_SHOWN,
      };
      state = {
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 3,
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, action)).toEqual({
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        queryString: '?frm=100&search_after=99_22131&size=100',
        searchAfter: '99_22131',
        size: 100,
        tab: types.MODE_LIST,
        search: '?page=2&size=100&tab=List',
      });
    });

    it('handles missing breakPoints actions', () => {
      action = {
        type: actions.PREV_PAGE_SHOWN,
      };
      state = {
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, action)).toEqual({
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 0,
        page: 1,
        queryString: '?size=100',
        searchAfter: '',
        size: 100,
        tab: types.MODE_LIST,
        search: '?page=1&size=100&tab=List',
      });
    });
  });

  describe('Action Bar', () => {
    it('handles SIZE_CHANGED actions', () => {
      action = {
        type: actions.SIZE_CHANGED,
        size: 50,
      };
      state = {
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, action)).toEqual({
        breakPoints: {},
        from: 0,
        page: 1,
        queryString: '?size=50',
        searchAfter: '',
        size: 50,
        tab: types.MODE_LIST,
        search: '?page=1&size=50&tab=List',
      });
    });

    it('handles SORT_CHANGED actions - default', () => {
      action = {
        type: actions.SORT_CHANGED,
        sort: 'foo',
      };
      state = {
        from: 100,
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, action)).toEqual({
        breakPoints: {},
        from: 0,
        page: 1,
        queryString: '?size=100&sort=created_date_desc',
        searchAfter: '',
        sort: 'created_date_desc',
        size: 100,
        tab: types.MODE_LIST,
        search: '?page=1&size=100&sort=created_date_desc&tab=List',
      });
    });

    it('handles SORT_CHANGED actions - valid value', () => {
      action = {
        type: actions.SORT_CHANGED,
        sort: 'relevance_asc',
      };
      state = {
        from: 100,
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, action)).toEqual({
        breakPoints: {},
        from: 0,
        page: 1,
        queryString: '?size=100&sort=relevance_asc',
        searchAfter: '',
        sort: 'relevance_asc',
        size: 100,
        tab: types.MODE_LIST,
        search: '?page=1&size=100&sort=relevance_asc&tab=List',
      });
    });
  });

  describe('Tabs', () => {
    beforeEach(() => {
      action = {
        type: actions.TAB_CHANGED,
      };
      state = {
        focus: 'Yoyo',
        tab: 'bar',
      };
    });

    it('handles TAB_CHANGED actions - default', () => {
      action.tab = 'foo';
      expect(target(state, action)).toEqual({
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        chartType: 'line',
        focus: 'Yoyo',
        tab: 'Trends',
        queryString: '?focus=Yoyo',
        trendsDateWarningEnabled: false,
        search: '?chartType=line&focus=Yoyo&tab=Trends',
      });
    });

    it('handles Trends TAB_CHANGED actions', () => {
      action.tab = 'Trends';
      expect(target(state, action)).toEqual({
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        chartType: 'line',
        focus: 'Yoyo',
        tab: 'Trends',
        queryString: '?focus=Yoyo',
        trendsDateWarningEnabled: false,
        search: '?chartType=line&focus=Yoyo&tab=Trends',
      });
    });

    it('handles a Map TAB_CHANGED actions', () => {
      action.tab = types.MODE_MAP;
      expect(target(state, action)).toEqual({
        breakPoints: {},
        dataNormalization: 'None',
        from: 0,
        page: 1,
        searchAfter: '',
        focus: '',
        enablePer1000: false,
        mapWarningEnabled: true,
        tab: types.MODE_MAP,
        queryString: '',
        search: '?dataNormalization=None&tab=Map',
      });
    });

    it('handles a List TAB_CHANGED actions', () => {
      action.tab = types.MODE_LIST;
      expect(target(state, action)).toEqual({
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        focus: '',
        tab: types.MODE_LIST,
        queryString: '',
        search: '?page=1&tab=List',
      });
    });
  });

  describe('URL_CHANGED actions', () => {
    let action, actual, state;

    beforeEach(() => {
      action = {
        params: {},
      };

      state = { ...queryState };
    });

    xit('handles empty params', () => {
      expect(target(state, processParams(action))).toEqual(state);
    });

    it('handles string params', () => {
      action.params = { searchText: 'hello' };
      actual = target(state, processParams(action));
      expect(actual.searchText).toEqual('hello');
    });

    it('handles size parameter', () => {
      action.params = { size: '100' };
      actual = target(state, processParams(action));
      expect(actual.size).toEqual('100');
    });

    it('handles page number', () => {
      action.params = { page: '100' };
      actual = target(state, processParams(action));
      expect(actual.page).toEqual(1);
    });

    it('handles bogus date parameters', () => {
      action.params = { dateInterval: '3y', dateRange: 'Week' };
      actual = target(state, processParams(action));
      expect(actual.dateInterval).toEqual('Month');
      expect(actual.dateRange).toEqual('3y');
    });

    it('handles bogus size & sort parameters', () => {
      action.params = { size: '9999', sort: 'tables' };
      actual = target(state, processParams(action));
      expect(actual.size).toEqual('10');
      expect(actual.sort).toEqual('created_date_desc');
    });

    it('converts some parameters to dates', () => {
      const expected = new Date(2013, 1, 3);
      action.params = { date_received_min: '2013-02-03' };
      actual = target({}, processParams(action)).date_received_min;
      expect(actual.getFullYear()).toEqual(expected.getFullYear());
      expect(actual.getMonth()).toEqual(expected.getMonth());
    });

    it('converts flag parameters to booleans', () => {
      action.params = { has_narrative: 'true' };
      actual = target({}, processParams(action)).has_narrative;
      expect(actual).toEqual(true);
    });

    xit('ignores incorrect dates', () => {
      action.params = { date_received_min: 'foo' };
      expect(target({}, processParams(action))).toEqual(state);
    });

    xit('ignores unknown parameters', () => {
      action.params = { foo: 'bar' };
      expect(target(state, processParams(action))).toEqual(state);
    });

    it('handles a single filter', () => {
      action.params = { product: 'Debt Collection' };
      actual = target({}, processParams(action));
      expect(actual.product).toEqual(['Debt Collection']);
    });

    it('handles a multiple filters', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target({}, processParams(action));
      expect(actual.product).toEqual(['Debt Collection', 'Mortgage']);
    });

    it('handles a multiple filters & focus', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target({ focus: 'Something' }, processParams(action));
      expect(actual.focus).toEqual('');
      expect(actual.product).toEqual(['Debt Collection', 'Mortgage']);
    });

    it('handles a trendDepth param', () => {
      action.params = { lens: 'Product', trendDepth: 1000 };
      actual = target({}, processParams(action));
      expect(actual.lens).toEqual('Product');
      expect(actual.trendDepth).toEqual(1000);
    });

    it('handles invalid lens and chartType combo', () => {
      action.params = { chartType: 'area', lens: 'Overview', tab: 'Trends' };
      state.tab = types.MODE_TRENDS;
      actual = target(state, processParams(action));
      expect(actual.chartType).toEqual('line');
      expect(actual.lens).toEqual('Overview');
      expect(actual.tab).toEqual('Trends');
    });

    it('handles valid lens and chartType combo', () => {
      action.params = { chartType: 'area', lens: 'Product', tab: 'Trends' };
      actual = target(state, processParams(action));
      expect(actual.chartType).toEqual('area');
      expect(actual.lens).toEqual('Product');
    });

    it('handles the "All" button from the landing page', () => {
      const dateMin = new Date(types.DATE_RANGE_MIN);

      action.params = { dataNormalization: 'None', dateRange: 'All' };

      actual = target({}, processParams(action));

      expect(actual.date_received_min).toEqual(dateMin);
      expect(actual.date_received_max).toEqual(maxDate);
      expect(actual.dateRange).toEqual('All');
    });

    describe('dates', () => {
      let expected;
      beforeEach(() => {
        state.dateRange = '2y';
        expected = { ...queryState };
      });

      it('clears the default range if the dates are not 3 years apart', () => {
        state.date_received_min = new Date(dayjs(maxDate).subtract(2, 'years'));
        expected.dateRange = '';
        expected.date_received_min = state.date_received_min;

        const actual = alignDateRange(state);
        expect(actual).toEqual(expected);
      });

      it('sets the All range if the dates are right', () => {
        state.date_received_min = new Date(types.DATE_RANGE_MIN);
        expected.dateRange = 'All';
        expected.date_received_min = state.date_received_min;

        const actual = alignDateRange(state);
        expect(actual).toEqual(expected);
      });

      it('sets the 3m range if the dates are right', () => {
        state.date_received_min = new Date(
          dayjs(maxDate).subtract(3, 'months')
        );
        expected.dateRange = '3m';
        expected.date_received_min = state.date_received_min;

        const actual = alignDateRange(state);
        expect(actual).toEqual(expected);
      });

      it('sets the 6m range if the dates are right', () => {
        state.date_received_min = new Date(
          dayjs(maxDate).subtract(6, 'months')
        );
        expected.dateRange = '6m';
        expected.date_received_min = state.date_received_min;

        const actual = alignDateRange(state);
        expect(actual).toEqual(expected);
      });

      it('sets the 1y range if the dates are right', () => {
        state.date_received_min = new Date(dayjs(maxDate).subtract(1, 'year'));
        expected.dateRange = '1y';
        expected.date_received_min = state.date_received_min;

        const actual = alignDateRange(state);
        expect(actual).toEqual(expected);
      });

      it('sets the 3y range if the dates are right', () => {
        const actual = alignDateRange(state);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Filters', () => {
    describe('FILTER_CHANGED actions updates query with filter state', () => {
      let key = '';
      let state = null;
      let filterName = '';
      let filterValue = null;
      let action = null;

      beforeEach(() => {
        key = 'affirmative';
        filterName = 'issue';
        filterValue = { key };
        state = {};
        action = { type: actions.FILTER_CHANGED, filterName, filterValue };
      });

      it('handles FILTER_CHANGED actions and returns correct object', () => {
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          [filterName]: [key],
          queryString: '?issue=affirmative',
          searchAfter: '',
          search: '?issue=affirmative',
        });
      });

      it('queryString ignores invalid api FILTER values', () => {
        action.filterName = 'foobar';
        expect(target(state, action)).toEqual({
          breakPoints: {},
          foobar: ['affirmative'],
          from: 0,
          page: 1,
          queryString: '',
          searchAfter: '',
          search: '?',
        });
      });

      it('handles FILTER_CHANGED actions & returns correct object - Map', () => {
        state.tab = types.MODE_MAP;
        expect(target(state, action)).toEqual({
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          from: 0,
          [filterName]: [key],
          page: 1,
          queryString: '?issue=affirmative',
          searchAfter: '',
          tab: types.MODE_MAP,
          search: '?dataNormalization=None&issue=affirmative&tab=Map',
        });
      });

      it('creates a filter array if target is undefined', () => {
        const filterReturn = filterArrayAction(undefined, key);
        expect(filterReturn).toEqual([key]);
      });

      it('adds additional filters when passed', () => {
        const filterReturn = filterArrayAction([key], 'bye');
        expect(filterReturn).toEqual([key, 'bye']);
      });

      it('removes filters when already present', () => {
        const filterReturn = filterArrayAction([key, 'bye'], key);
        expect(filterReturn).toEqual(['bye']);
      });
    });

    describe('FILTER_ADDED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          type: actions.FILTER_ADDED,
          filterName: 'product',
          filterValue: 'baz',
        };
      });

      it('adds a filter when one exists', () => {
        state = {
          product: ['bar', 'qaz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz', 'baz'],
          queryString: '?product=bar&product=qaz&product=baz',
          searchAfter: '',
          search: '?product=bar&product=qaz&product=baz',
        });
      });

      it('ignores a filter when it exists', () => {
        state = {
          product: ['bar', 'qaz', 'baz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz', 'baz'],
          queryString: '?product=bar&product=qaz&product=baz',
          searchAfter: '',
          search: '?product=bar&product=qaz&product=baz',
        });
      });

      it('handles a missing filter', () => {
        state = {
          issue: ['bar', 'baz', 'qaz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          product: ['baz'],
          issue: ['bar', 'baz', 'qaz'],
          page: 1,
          queryString: '?issue=bar&issue=baz&issue=qaz&product=baz',
          searchAfter: '',
          search: '?issue=bar&issue=baz&issue=qaz&product=baz',
        });
      });

      it('handles a missing filter value', () => {
        state = {
          product: ['bar', 'qaz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz', 'baz'],
          queryString: '?product=bar&product=qaz&product=baz',
          searchAfter: '',
          search: '?product=bar&product=qaz&product=baz',
        });
      });

      describe('has_narrative', () => {
        it('handles when present', () => {
          action.filterName = 'has_narrative';
          state = {
            has_narrative: true,
          };
          expect(target(state, action)).toEqual({
            breakPoints: {},
            from: 0,
            has_narrative: true,
            page: 1,
            queryString: '?has_narrative=true',
            searchAfter: '',
            search: '?has_narrative=true',
          });
        });

        it('handles when present - Map', () => {
          action.filterName = 'has_narrative';
          state = {
            dataNormalization: 'None',
            has_narrative: true,
            tab: types.MODE_MAP,
          };
          expect(target(state, action)).toEqual({
            breakPoints: {},
            dataNormalization: 'None',
            enablePer1000: false,
            from: 0,
            has_narrative: true,
            page: 1,
            queryString: '?has_narrative=true',
            searchAfter: '',
            tab: types.MODE_MAP,
            search: '?dataNormalization=None&has_narrative=true&tab=Map',
          });
        });

        it('handles when absent', () => {
          action.filterName = 'has_narrative';
          state = {};
          expect(target(state, action)).toEqual({
            breakPoints: {},
            from: 0,
            has_narrative: true,
            page: 1,
            queryString: '?has_narrative=true',
            searchAfter: '',
            search: '?has_narrative=true',
          });
        });
      });
    });

    describe('FILTER_REMOVED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          type: actions.FILTER_REMOVED,
          filterName: 'product',
          filterValue: 'baz',
        };
      });

      it('removes a filter when one exists', () => {
        state = {
          product: ['bar', 'baz', 'qaz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz'],
          queryString: '?product=bar&product=qaz',
          searchAfter: '',
          search: '?product=bar&product=qaz',
        });
      });

      it('removes a filter on Map tab when one exists', () => {
        state = {
          product: ['bar', 'baz', 'qaz'],
          mapWarningEnabled: true,
          tab: types.MODE_MAP,
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          from: 0,
          enablePer1000: false,
          page: 1,
          product: ['bar', 'qaz'],
          mapWarningEnabled: true,
          queryString: '?product=bar&product=qaz',
          searchAfter: '',
          tab: types.MODE_MAP,
          search: '?dataNormalization=None&product=bar&product=qaz&tab=Map',
        });
      });

      it('handles a missing filter', () => {
        state = {
          issue: ['bar', 'baz', 'qaz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          issue: ['bar', 'baz', 'qaz'],
          page: 1,
          queryString: '?issue=bar&issue=baz&issue=qaz',
          searchAfter: '',
          search: '?issue=bar&issue=baz&issue=qaz',
        });
      });

      it('handles a missing filter value', () => {
        state = {
          product: ['bar', 'qaz'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz'],
          queryString: '?product=bar&product=qaz',
          searchAfter: '',
          search: '?product=bar&product=qaz',
        });
      });

      describe('has_narrative', () => {
        it('handles when present', () => {
          action.filterName = 'has_narrative';
          state = {
            has_narrative: true,
          };
          expect(target(state, action)).toEqual({
            breakPoints: {},
            from: 0,
            page: 1,
            queryString: '',
            searchAfter: '',
            search: '?',
          });
        });

        it('handles when present - Map', () => {
          action.filterName = 'has_narrative';
          state = {
            dataNormalization: 'None',
            has_narrative: true,
            tab: types.MODE_MAP,
          };
          expect(target(state, action)).toEqual({
            breakPoints: {},
            dataNormalization: 'None',
            enablePer1000: false,
            from: 0,
            mapWarningEnabled: true,
            page: 1,
            queryString: '',
            searchAfter: '',
            tab: types.MODE_MAP,
            search: '?dataNormalization=None&tab=Map',
          });
        });

        it('handles when absent', () => {
          action.filterName = 'has_narrative';
          state = {};
          expect(target(state, action)).toEqual({
            breakPoints: {},
            from: 0,
            page: 1,
            queryString: '',
            searchAfter: '',
            search: '?',
          });
        });
      });
    });

    describe('FILTER_ALL_REMOVED actions', () => {
      let action, state;
      beforeEach(() => {
        action = {
          type: actions.FILTER_ALL_REMOVED,
        };

        state = {
          company: ['Acme'],
          date_received_min: new Date(2012, 0, 1),
          from: 100,
          has_narrative: true,
          searchField: 'all',
          size: 100,
          timely: ['bar', 'baz', 'qaz'],
          tab: types.MODE_LIST,
        };
      });

      it('clears all filters', () => {
        const actual = target(state, action);
        expect(actual).toMatchObject({
          dateRange: 'All',
          from: 0,
          searchField: 'all',
          size: 100,
        });

        expect(actual.queryString).toEqual(
          '?date_received_max=' +
            '2020-05-05&date_received_min=2011-12-01&field=all&size=100'
        );
      });

      it('clears all filters - Map', () => {
        state.tab = types.MODE_MAP;
        const actual = target(state, action);
        expect(actual).toMatchObject({
          dateRange: 'All',
          enablePer1000: false,
          from: 0,
          mapWarningEnabled: true,
          searchField: 'all',
          size: 100,
        });

        expect(actual.queryString).toEqual(
          '?date_received_max=' +
            '2020-05-05&date_received_min=2011-12-01&field=all'
        );
      });

      describe('when searching Narratives', () => {
        it('does not clear the hasNarrative filter', () => {
          state.searchField = types.NARRATIVE_SEARCH_FIELD;
          const actual = target(state, action);
          expect(actual).toMatchObject({
            dateRange: 'All',
            from: 0,
            has_narrative: true,
            searchField: types.NARRATIVE_SEARCH_FIELD,
            size: 100,
          });
          expect(actual.queryString).toEqual(
            '?date_received_max=2020-05-05&' +
              'date_received_min=2011-12-01&field=complaint_what_happened&' +
              'has_narrative=true&size=100'
          );
        });
      });
    });

    describe('FILTER_MULTIPLE_ADDED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          type: actions.FILTER_MULTIPLE_ADDED,
          filterName: 'issue',
          values: ['Mo Money', 'Mo Problems'],
        };
      });

      it("adds all filters if they didn't exist", () => {
        expect(target({}, action)).toEqual({
          breakPoints: {},
          from: 0,
          issue: ['Mo Money', 'Mo Problems'],
          page: 1,
          queryString: '?issue=Mo%20Money&issue=Mo%20Problems',
          searchAfter: '',
          search: '?issue=Mo%20Money&issue=Mo%20Problems',
        });
      });

      it("adds all filters if they didn't exist - Map", () => {
        expect(
          target(
            {
              enablePer1000: false,
              mapWarningEnabled: true,
              tab: types.MODE_MAP,
            },
            action
          )
        ).toEqual({
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          from: 0,
          issue: ['Mo Money', 'Mo Problems'],
          mapWarningEnabled: true,
          page: 1,
          queryString: '?issue=Mo%20Money&issue=Mo%20Problems',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&issue=Mo%20Money&issue=Mo%20Problems&tab=Map',
        });
      });

      it('skips filters if they exist already', () => {
        state = {
          issue: ['foo'],
        };
        action.values.push('foo');

        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          issue: ['foo', 'Mo Money', 'Mo Problems'],
          page: 1,
          queryString: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems',
          searchAfter: '',
          search: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems',
        });
      });

      it('skips filters if they exist already - Map', () => {
        state = {
          issue: ['foo'],
          tab: types.MODE_MAP,
        };
        action.values.push('foo');

        expect(target(state, action)).toEqual({
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          from: 0,
          issue: ['foo', 'Mo Money', 'Mo Problems'],
          page: 1,
          queryString: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&issue=foo&issue=Mo%20Money&issue=Mo%20Problems&tab=Map',
        });
      });
    });

    describe('FILTER_MULTIPLE_REMOVED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          type: actions.FILTER_MULTIPLE_REMOVED,
          filterName: 'issue',
          values: ['Mo Money', 'Mo Problems', 'bar'],
        };
      });

      it('removes filters if they exist', () => {
        state = {
          focus: 'Mo Money',
          issue: ['foo', 'Mo Money', 'Mo Problems'],
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          focus: '',
          from: 0,
          issue: ['foo'],
          page: 1,
          queryString: '?issue=foo',
          searchAfter: '',
          search: '?issue=foo',
        });
      });

      it('removes filters if they exist - Map tab', () => {
        state = {
          focus: '',
          issue: ['foo', 'Mo Money', 'Mo Problems'],
          tab: types.MODE_MAP,
        };
        expect(target(state, action)).toEqual({
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          focus: '',
          from: 0,
          issue: ['foo'],
          page: 1,
          queryString: '?issue=foo',
          searchAfter: '',
          tab: types.MODE_MAP,
          search: '?dataNormalization=None&issue=foo&tab=Map',
        });
      });

      it('ignores unknown filters', () => {
        expect(target({}, action)).toEqual({
          breakPoints: {},
          focus: '',
          from: 0,
          page: 1,
          queryString: '',
          searchAfter: '',
          search: '?',
        });
      });
    });

    describe('FILTER_FLAG_CHANGED actions', () => {
      let action, state;
      beforeEach(() => {
        action = {
          type: actions.FILTER_FLAG_CHANGED,
          filterName: 'has_narrative',
          requery: types.REQUERY_HITS_ONLY,
        };
        state = {};
      });

      it('adds narrative filter to empty state', () => {
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          has_narrative: true,
          queryString: '?has_narrative=true',
          searchAfter: '',
          search: '?has_narrative=true',
        });
      });

      it('toggles off narrative filter', () => {
        state.has_narrative = true;
        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          queryString: '',
          searchAfter: '',
          search: '?',
        });
      });
    });

    describe('FILTER_REPLACED actions', () => {
      it('replaces existing filter set', () => {
        action = {
          type: actions.FILTER_REPLACED,
          filterName: 'foobar',
          requery: types.REQUERY_HITS_ONLY,
          values: [3, 4, 5],
        };

        state = {
          foobar: [1, 23, 2],
        };

        expect(target(state, action)).toEqual({
          breakPoints: {},
          from: 0,
          foobar: [3, 4, 5],
          page: 1,
          queryString: '',
          searchAfter: '',
          search: '?',
        });
      });
    });
  });

  describe('Dates', () => {
    describe('changeDates actions', () => {
      let action, result;
      beforeEach(() => {
        action = {
          filterName: 'date_received',
          minDate: new Date(2001, 0, 30),
          maxDate: new Date(2013, 1, 3),
        };
        result = null;
      });

      it('adds the dates', () => {
        const testState = { ...queryState };
        delete testState.dateRange;
        expect(target(testState, changeDates(action))).toEqual({
          ...testState,
          breakPoints: {},
          date_received_min: new Date(2001, 0, 30),
          date_received_max: new Date(2013, 1, 3),
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2013-02-03&date_received_min=2001-01-30&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&date_received_max=2013-02-03&date_received_min=2001-01-30&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('clears dateRange when no match, i.e. when one or both dates have actually changed', () => {
        result = target(
          { ...queryState, dateRange: '1y' },
          changeDates(action)
        );
        expect(result.dateRange).toBeFalsy();
      });

      it('adds dateRange', () => {
        const min = new Date(dayjs(maxDate).subtract(3, 'months'));
        action.maxDate = maxDate;
        action.minDate = min;
        result = target({ ...queryState }, changeDates(action));
        expect(result.dateRange).toEqual('3m');
      });

      it('does not add empty dates', () => {
        action.maxDate = '';
        action.minDate = '';
        expect(target({ ...queryState }, changeDates(action))).toEqual({
          ...queryState,
          breakPoints: {},
          from: 0,
          page: 1,
          queryString: `?date_received_max=${formatDate(
            test_date_received_max
          )}&date_received_min=${formatDate(
            test_date_received_min
          )}&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month`,
          searchAfter: '',
          search: `?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=${formatDate(
            test_date_received_max
          )}&date_received_min=${formatDate(
            test_date_received_min
          )}&lens=Product&searchField=all&subLens=sub_product&tab=Trends`,
        });
      });
    });

    describe('DATE_RANGE_CHANGED actions', () => {
      let action, result;
      beforeEach(() => {
        action = {
          dateRange: '',
        };
      });

      it('handles All range', () => {
        action.dateRange = 'All';
        result = target({}, changeDateRange(action));
        expect(result.date_received_min).toEqual(
          new Date(types.DATE_RANGE_MIN)
        );
      });

      it('handles 1y range', () => {
        action.dateRange = '1y';
        result = target({ ...queryState }, changeDateRange(action));
        expect(result).toEqual({
          ...queryState,
          breakPoints: {},
          dateInterval: 'Month',
          dateRange: '1y',
          date_received_max: new Date('2020-05-05T04:00:00.000Z'),
          date_received_min: new Date('2019-05-05T04:00:00.000Z'),
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2019-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=1y&date_received_max=2020-05-05&date_received_min=2019-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
          trendsDateWarningEnabled: false,
        });
      });

      it('default range handling', () => {
        action.dateRange = 'foo';
        result = target({ ...queryState }, changeDateRange(action));
        // only set max date
        expect(result).toEqual({
          ...queryState,
          breakPoints: {},
          dateRange: '3y',
          date_received_min: new Date('2017-05-05T04:00:00.000Z'),
          date_received_max: new Date('2020-05-05T04:00:00.000Z'),
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('On Trends Tab handles All range', () => {
        action.dateRange = 'All';
        state = { dateInterval: 'Day', tab: types.MODE_TRENDS };
        result = target(state, changeDateRange(action));
        expect(result.dateInterval).toEqual('Week');
        expect(result.trendsDateWarningEnabled).toEqual(true);
      });
    });
  });

  describe('Map', () => {
    describe('Data normalization', () => {
      beforeEach(() => {
        action = {
          value: 'FooBar',
        };
        state = {
          ...queryState,
          tab: types.MODE_MAP,
        };
      });
      it('handles default value', () => {
        expect(target(state, updateDataNormalization(action))).toEqual({
          ...state,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
        });
      });

      it('handles per 1000 value', () => {
        action.value = types.GEO_NORM_PER1000;
        expect(target(state, updateDataNormalization(action))).toEqual({
          ...state,
          dataNormalization: 'Per 1000 pop.',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=Per%201000%20pop.&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
        });
      });
    });

    describe('Map Warning', () => {
      it('handles dismissMapWarning action', () => {
        state = {
          ...queryState,
          company: [1, 2, 3],
          product: 'bar',
          mapWarningEnabled: true,
          tab: types.MODE_MAP,
        };
        expect(target(state, dismissMapWarning())).toEqual({
          ...state,
          company: [1, 2, 3],
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          product: 'bar',
          mapWarningEnabled: false,
          queryString:
            '?company=1&company=2&company=3&date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&product=bar',
          tab: types.MODE_MAP,
          search:
            '?company=1&company=2&company=3&dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&product=bar&searchField=all&tab=Map',
        });
      });
    });

    describe('STATE_COMPLAINTS_SHOWN', () => {
      it('switches to List View', () => {
        result = target(
          {
            ...queryState,
            state: [],
            tab: types.MODE_MAP,
          },
          showStateComplaints()
        );

        expect(result).toEqual({
          ...queryState,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=25&sort=created_date_desc',
          tab: types.MODE_LIST,
          search:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=1&searchField=all&size=25&sort=created_date_desc&tab=List',
          state: [],
        });
      });

      it('saves all state filters and switches to List View', () => {
        result = target(
          {
            ...queryState,
            enablePer1000: false,
            mapWarningEnabled: true,
            state: ['TX', 'MX', 'FO'],
            tab: types.MODE_MAP,
          },
          showStateComplaints()
        );

        expect(result).toEqual({
          ...queryState,
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=25&sort=created_date_desc&state=TX&state=MX&state=FO',
          state: ['TX', 'MX', 'FO'],
          tab: types.MODE_LIST,
          search:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=1&searchField=all&size=25&sort=created_date_desc&state=TX&state=MX&state=FO&tab=List',
        });
      });
    });

    describe('STATE_FILTER_ADDED', () => {
      beforeEach(() => {
        action = {
          selectedState: { abbr: 'IL', name: 'Illinois' },
        };
      });
      it('adds state filter', () => {
        result = target(
          { ...queryState, tab: types.MODE_MAP },
          addStateFilter(action)
        );
        expect(result).toEqual({
          ...queryState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&state=IL',
          state: ['IL'],
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&state=IL&tab=Map',
        });
      });
      it('does not add dupe state filter', () => {
        result = target(
          {
            ...queryState,
            state: ['IL', 'TX'],
            tab: types.MODE_MAP,
          },
          addStateFilter(action)
        );

        expect(result).toEqual({
          ...queryState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&state=IL&state=TX',
          state: ['IL', 'TX'],
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&state=IL&state=TX&tab=Map',
        });
      });
    });

    describe('STATE_FILTER_CLEARED', () => {
      it('removes state filters', () => {
        result = target(
          {
            ...queryState,
            state: ['FO', 'BA'],
            tab: types.MODE_MAP,
          },
          clearStateFilter()
        );

        expect(result).toEqual({
          ...queryState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
          state: [],
        });
      });

      it('handles no state filters', () => {
        result = target(
          { ...queryState, tab: types.MODE_MAP },
          clearStateFilter()
        );

        expect(result).toEqual({
          ...queryState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
          state: [],
        });
      });
    });

    describe('STATE_FILTER_REMOVED', () => {
      beforeEach(() => {
        action = {
          selectedState: { abbr: 'IL', name: 'Illinois' },
        };
      });
      it('removes a state filter', () => {
        result = target(
          {
            ...queryState,
            state: ['CA', 'IL'],
            tab: types.MODE_MAP,
          },
          removeStateFilter(action)
        );
        expect(result).toEqual({
          ...queryState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&state=CA',
          state: ['CA'],
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&state=CA&tab=Map',
        });
      });
      it('handles empty state', () => {
        result = target({ ...queryState, tab: types.MODE_MAP }, action);
        expect(result).toEqual({
          ...queryState,
          dataNormalization: 'None',
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString: '',
          tab: types.MODE_MAP,
          search: '',
        });
      });
    });
  });

  describe('Trends', () => {
    beforeEach(() => {
      state = {
        tab: types.MODE_TRENDS,
      };
    });

    describe('Trends Date Warning', () => {
      it('handles trends/dismissTrendsDateWarning action', () => {
        expect(
          target(
            { ...queryState, trendsDateWarningEnabled: true },
            dismissTrendsDateWarning()
          )
        ).toEqual({
          ...queryState,
          trendsDateWarningEnabled: false,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('CHART_TYPE_CHANGED actions', () => {
      it('changes the chartType - default', () => {
        action = {
          chartType: 'Foo',
        };
        result = target(
          { ...queryState, chartType: 'ahha' },
          updateChartType(action)
        );
        expect(result).toEqual({
          ...queryState,
          chartType: 'Foo',
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          tab: types.MODE_TRENDS,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=Foo&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('DATA_LENS_CHANGED actions', () => {
      it('changes the lens - default', () => {
        action = {
          lens: 'Foo',
        };
        result = target(
          { ...queryState, focus: 'ahha' },
          updateDataLens(action)
        );
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          focus: '',
          lens: 'Overview',
          subLens: '',
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=overview&trend_depth=5&trend_interval=month',
          tab: 'Trends',
          trendDepth: 5,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Overview&searchField=all&tab=Trends',
        });
      });

      it('has special values when lens = Company', () => {
        action = {
          lens: 'Company',
        };
        result = target(
          { ...queryState, tab: types.MODE_TRENDS, focus: 'ahha' },
          updateDataLens(action)
        );
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          focus: '',
          lens: 'Company',
          subLens: 'product',
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=company&sub_lens=product&trend_depth=10&trend_interval=month',
          tab: 'Trends',
          trendDepth: 10,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Company&searchField=all&subLens=product&tab=Trends',
        });
      });

      it('changes the lens - Product', () => {
        action = {
          lens: 'Product',
        };
        result = target(
          { ...queryState, tab: types.MODE_TRENDS, focus: 'ahha' },
          updateDataLens(action)
        );
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          focus: '',
          lens: 'Product',
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 5,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('DATA_SUBLENS_CHANGED actions', () => {
      it('changes the sub lens', () => {
        action = {
          subLens: 'Issue',
        };
        result = target(
          { ...queryState, tab: types.MODE_TRENDS },
          updateDataSubLens(action)
        );
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          subLens: 'issue',
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=issue&trend_depth=5&trend_interval=month',
          tab: 'Trends',
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=issue&tab=Trends',
        });
      });
    });

    describe('DATE_INTERVAL_CHANGED', () => {
      it('changes the dateInterval', () => {
        action = {
          dateInterval: 'Day',
        };
        result = target(
          { ...queryState, tab: types.MODE_TRENDS },
          changeDateInterval(action)
        );
        expect(result).toEqual({
          ...queryState,
          breakPoints: {},
          chartType: 'line',
          dateInterval: 'Day',
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=day',
          searchAfter: '',
          tab: 'Trends',
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Day&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('FOCUS_CHANGED actions', () => {
      it('changes the focus', () => {
        action = {
          filterValues: ['A', 'A' + types.SLUG_SEPARATOR + 'B'],
          focus: 'A',
          lens: 'Product',
        };
        result = target({ ...queryState, focus: 'Else' }, changeFocus(action));
        expect(result).toEqual({
          ...queryState,
          product: ['A', 'A•B'],
          focus: 'A',
          lens: 'Product',
          tab: 'Trends',
          trendDepth: 25,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&focus=Else&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&focus=Else&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('changes the Company Focus', () => {
        action = {
          filterValues: ['A'],
          focus: 'A',
          lens: 'Company',
        };
        result = target({ ...queryState, focus: 'Else' }, changeFocus(action));
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          focus: 'A',
          lens: 'Company',
          company: ['A'],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&focus=Else&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 25,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&focus=Else&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('FOCUS_REMOVED actions', () => {
      it('clears the focus & resets values', () => {
        result = target({ ...queryState, lens: 'Product' }, removeFocus());
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          focus: '',
          lens: 'Product',
          product: [],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 5,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });
  });
});
