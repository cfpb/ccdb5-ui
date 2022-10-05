import target, {
  alignDateRange,
  defaultQuery,
  filterArrayAction,
} from './query';
import actions from '../../actions';
import * as types from '../../constants';
import dayjs from 'dayjs';
import { startOfToday } from '../../utils';

const maxDate = startOfToday();

describe('reducer:query', () => {
  let action, result, state;
  describe('default', () => {
    xit('has a default state', () => {
      result = target(undefined, {});
      expect(result).toEqual({
        breakPoints: {},
        chartType: 'line',
        dataNormalization: types.GEO_NORM_NONE,
        dateInterval: 'Month',
        dateRange: '3y',
        date_received_max: new Date('2020-05-05T04:00:00.000Z'),
        date_received_min: new Date('2017-05-05T04:00:00.000Z'),
        enablePer1000: true,
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
        url: '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
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
        url: '?',
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
        url: '?',
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
      url: '?searchField=bar&searchText=foo',
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
      url: '?searchText=bar',
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
        url: '?chartType=line&tab=Trends',
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
        url: '?chartType=line&tab=Trends',
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
        url: '?page=3&size=100&tab=List',
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
        url: '?page=2&size=100&tab=List',
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
        url: '?page=1&size=100&tab=List',
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
        url: '?page=1&size=50&tab=List',
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
        url: '?page=1&size=100&sort=created_date_desc&tab=List',
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
        url: '?page=1&size=100&sort=relevance_asc&tab=List',
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
        url: '?chartType=line&focus=Yoyo&tab=Trends',
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
        url: '?chartType=line&focus=Yoyo&tab=Trends',
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
        enablePer1000: true,
        mapWarningEnabled: true,
        tab: types.MODE_MAP,
        queryString: '',
        url: '?dataNormalization=None&tab=Map',
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
        url: '?page=1&tab=List',
      });
    });
  });

  describe('URL_CHANGED actions', () => {
    let action, actual, state;

    beforeEach(() => {
      action = {
        type: actions.URL_CHANGED,
        params: {},
      };

      state = { ...defaultQuery };
    });

    xit('handles empty params', () => {
      expect(target(state, action)).toEqual(state);
    });

    it('handles string params', () => {
      action.params = { searchText: 'hello' };
      actual = target(state, action);
      expect(actual.searchText).toEqual('hello');
    });

    it('converts some parameters to integers', () => {
      action.params = { size: '100' };
      actual = target(state, action);
      expect(actual.size).toEqual(100);
    });

    it('handles page number', () => {
      action.params = { page: '100' };
      actual = target(state, action);
      expect(actual.page).toEqual(1);
    });

    it('handles bogus date parameters', () => {
      action.params = { dateInterval: '3y', dateRange: 'Week' };
      actual = target(state, action);
      expect(actual.dateInterval).toEqual('Month');
      expect(actual.dateRange).toEqual('3y');
    });

    it('handles bogus size & sort parameters', () => {
      action.params = { size: '9999', sort: 'tables' };
      actual = target(state, action);
      expect(actual.size).toEqual(10);
      expect(actual.sort).toEqual('created_date_desc');
    });

    it('ignores bad integer parameters', () => {
      action.params = { size: 'foo' };
      actual = target(state, action);
      expect(actual.size).toEqual(25);
    });

    it('converts some parameters to dates', () => {
      const expected = new Date(2013, 1, 3);
      action.params = { date_received_min: '2013-02-03' };
      actual = target({}, action).date_received_min;
      expect(actual.getFullYear()).toEqual(expected.getFullYear());
      expect(actual.getMonth()).toEqual(expected.getMonth());
    });

    it('converts flag parameters to booleans', () => {
      action.params = { has_narrative: 'true' };
      actual = target({}, action).has_narrative;
      expect(actual).toEqual(true);
    });

    xit('ignores incorrect dates', () => {
      action.params = { date_received_min: 'foo' };
      expect(target({}, action)).toEqual(state);
    });

    xit('ignores unknown parameters', () => {
      action.params = { foo: 'bar' };
      expect(target(state, action)).toEqual(state);
    });

    it('handles a single filter', () => {
      action.params = { product: 'Debt Collection' };
      actual = target({}, action);
      expect(actual.product).toEqual(['Debt Collection']);
    });

    it('handles a multiple filters', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target({}, action);
      expect(actual.product).toEqual(['Debt Collection', 'Mortgage']);
    });

    it('handles a multiple filters & focus', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target({ focus: 'Something' }, action);
      expect(actual.focus).toEqual('');
      expect(actual.product).toEqual(['Debt Collection', 'Mortgage']);
    });

    it('handles a trendDepth param', () => {
      action.params = { lens: 'Product', trendDepth: 1000 };
      actual = target({}, action);
      expect(actual.lens).toEqual('Product');
      expect(actual.trendDepth).toEqual(1000);
    });

    it('handles invalid lens and chartType combo', () => {
      action.params = { chartType: 'area', lens: 'Overview', tab: 'Trends' };
      state.tab = types.MODE_TRENDS;
      actual = target(state, action);
      expect(actual.chartType).toEqual('line');
      expect(actual.lens).toEqual('Overview');
      expect(actual.tab).toEqual('Trends');
    });

    it('handles valid lens and chartType combo', () => {
      action.params = { chartType: 'area', lens: 'Product', tab: 'Trends' };
      actual = target(state, action);
      expect(actual.chartType).toEqual('area');
      expect(actual.lens).toEqual('Product');
    });

    it('handles the "All" button from the landing page', () => {
      const dateMin = new Date(types.DATE_RANGE_MIN);

      action.params = { dataNormalization: 'None', dateRange: 'All' };

      actual = target({}, action);

      expect(actual.date_received_min).toEqual(dateMin);
      expect(actual.date_received_max).toEqual(maxDate);
      expect(actual.dateRange).toEqual('All');
    });

    describe('dates', () => {
      let expected;
      beforeEach(() => {
        state.dateRange = '2y';
        expected = { ...defaultQuery };
      });

      it('clears the default range if the dates are not 3 years apart', () => {
        state.date_received_min = new Date(
          dayjs(maxDate).subtract(2, 'years')
        );
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
          url: '?issue=affirmative',
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
          url: '?',
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
          url: '?dataNormalization=None&issue=affirmative&tab=Map',
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
          url: '?product=bar&product=qaz&product=baz',
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
          url: '?product=bar&product=qaz&product=baz',
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
          url: '?issue=bar&issue=baz&issue=qaz&product=baz',
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
          url: '?product=bar&product=qaz&product=baz',
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
            url: '?has_narrative=true',
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
            url: '?dataNormalization=None&has_narrative=true&tab=Map',
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
            url: '?has_narrative=true',
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
          url: '?product=bar&product=qaz',
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
          url: '?dataNormalization=None&product=bar&product=qaz&tab=Map',
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
          url: '?issue=bar&issue=baz&issue=qaz',
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
          url: '?product=bar&product=qaz',
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
            url: '?',
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
            enablePer1000: true,
            from: 0,
            mapWarningEnabled: true,
            page: 1,
            queryString: '',
            searchAfter: '',
            tab: types.MODE_MAP,
            url: '?dataNormalization=None&tab=Map',
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
            url: '?',
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
          enablePer1000: true,
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
          url: '?issue=Mo%20Money&issue=Mo%20Problems',
        });
      });

      it("adds all filters if they didn't exist - Map", () => {
        expect(
          target(
            {
              enablePer1000: true,
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
          url: '?dataNormalization=None&issue=Mo%20Money&issue=Mo%20Problems&tab=Map',
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
          url: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems',
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
          url: '?dataNormalization=None&issue=foo&issue=Mo%20Money&issue=Mo%20Problems&tab=Map',
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
          url: '?issue=foo',
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
          url: '?dataNormalization=None&issue=foo&tab=Map',
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
          url: '?',
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
          url: '?has_narrative=true',
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
          url: '?',
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
          url: '?',
        });
      });
    });
  });

  describe('Dates', () => {
    describe('DATES_CHANGED actions', () => {
      let action, result;
      beforeEach(() => {
        action = {
          type: actions.DATES_CHANGED,
          filterName: 'date_received',
          minDate: new Date(2001, 0, 30),
          maxDate: new Date(2013, 1, 3),
        };
        result = null;
      });

      it('adds the dates', () => {
        expect(target({}, action)).toEqual({
          breakPoints: {},
          date_received_min: new Date(2001, 0, 30),
          date_received_max: new Date(2013, 1, 3),
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2013-02-03&date_received_min=2001-01-30',
          searchAfter: '',
          url: '?date_received_max=2013-02-03&date_received_min=2001-01-30',
        });
      });

      it('clears dateRange when no match', () => {
        result = target({ dateRange: '1y' }, action);
        expect(result.dateRange).toBeFalsy();
      });

      it('adds dateRange', () => {
        const min = new Date(dayjs(maxDate).subtract(3, 'months'));
        action.maxDate = maxDate;
        action.minDate = min;
        result = target({}, action);
        expect(result.dateRange).toEqual('3m');
      });

      it('does not add empty dates', () => {
        action.maxDate = '';
        action.minDate = '';
        expect(target({}, action)).toEqual({
          breakPoints: {},
          from: 0,
          page: 1,
          queryString: '',
          searchAfter: '',
          url: '?',
        });
      });
    });

    describe('DATE_RANGE_CHANGED actions', () => {
      let action, result;
      beforeEach(() => {
        action = {
          type: actions.DATE_RANGE_CHANGED,
          dateRange: '',
        };
      });

      it('handles All range', () => {
        action.dateRange = 'All';
        result = target({}, action);
        expect(result.date_received_min).toEqual(
          new Date(types.DATE_RANGE_MIN)
        );
      });

      xit('handles 1y range', () => {
        action.dateRange = '1y';
        result = target({}, action);
        expect(result).toEqual({
          breakPoints: {},
          dateRange: '1y',
          date_received_max: new Date('2020-05-05T04:00:00.000Z'),
          date_received_min: new Date('2019-05-05T04:00:00.000Z'),
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2019-05-05',
          searchAfter: '',
          url: '?date_received_max=2020-05-05&date_received_min=2019-05-05',
        });
      });

      xit('default range handling', () => {
        action.dateRange = 'foo';
        result = target({}, action);
        // only set max date
        expect(result).toEqual({
          breakPoints: {},
          dateRange: '3y',
          date_received_min: new Date('2017-05-05T04:00:00.000Z'),
          date_received_max: new Date('2020-05-05T04:00:00.000Z'),
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05',
          searchAfter: '',
          url: '?date_received_max=2020-05-05&date_received_min=2017-05-05',
        });
      });

      it('On Trends Tab handles All range', () => {
        action.dateRange = 'All';
        state = { dateInterval: 'Day', tab: types.MODE_TRENDS };
        result = target(state, action);
        expect(result.dateInterval).toEqual('Week');
        expect(result.trendsDateWarningEnabled).toEqual(true);
      });
    });
  });

  describe('Map', () => {
    describe('Data normalization', () => {
      beforeEach(() => {
        action = {
          type: actions.DATA_NORMALIZATION_SELECTED,
          value: 'FooBar',
        };
        state = {
          tab: types.MODE_MAP,
        };
      });
      it('handles default value', () => {
        expect(target(state, action)).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '',
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&tab=Map',
        });
      });

      it('handles per 1000 value', () => {
        action.value = types.GEO_NORM_PER1000;
        expect(target(state, action)).toEqual({
          dataNormalization: 'Per 1000 pop.',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '',
          tab: types.MODE_MAP,
          url: '?dataNormalization=Per%201000%20pop.&tab=Map',
        });
      });
    });

    describe('Map Warning', () => {
      it('handles MAP_WARNING_DISMISSED action', () => {
        action = {
          type: actions.MAP_WARNING_DISMISSED,
        };
        state = {
          company: [1, 2, 3],
          product: 'bar',
          mapWarningEnabled: true,
          tab: types.MODE_MAP,
        };
        expect(target(state, action)).toEqual({
          company: [1, 2, 3],
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          product: 'bar',
          mapWarningEnabled: false,
          queryString: '?company=1&company=2&company=3&product=bar',
          tab: types.MODE_MAP,
          url: '?company=1&company=2&company=3&dataNormalization=None&product=bar&tab=Map',
        });
      });
    });

    describe('STATE_COMPLAINTS_SHOWN', () => {
      it('switches to List View', () => {
        action = {
          type: actions.STATE_COMPLAINTS_SHOWN,
        };

        result = target(
          {
            state: [],
            tab: types.MODE_MAP,
          },
          action
        );

        expect(result).toEqual({
          queryString: '',
          tab: types.MODE_LIST,
          url: '?tab=List',
        });
      });

      it('saves all state filters and switches to List View', () => {
        action = {
          type: actions.STATE_COMPLAINTS_SHOWN,
        };

        result = target(
          {
            enablePer1000: false,
            mapWarningEnabled: true,
            state: ['TX', 'MX', 'FO'],
            tab: types.MODE_MAP,
          },
          action
        );

        expect(result).toEqual({
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString: '?state=TX&state=MX&state=FO',
          state: ['TX', 'MX', 'FO'],
          tab: types.MODE_LIST,
          url: '?state=TX&state=MX&state=FO&tab=List',
        });
      });
    });

    describe('STATE_FILTER_ADDED', () => {
      beforeEach(() => {
        action = {
          type: actions.STATE_FILTER_ADDED,
          selectedState: { abbr: 'IL', name: 'Illinois' },
        };
      });
      it('adds state filter', () => {
        result = target({ tab: types.MODE_MAP }, action);
        expect(result).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '?state=IL',
          state: ['IL'],
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&state=IL&tab=Map',
        });
      });
      it('does not add dupe state filter', () => {
        result = target(
          {
            state: ['IL', 'TX'],
            tab: types.MODE_MAP,
          },
          action
        );

        expect(result).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '?state=IL&state=TX',
          state: ['IL', 'TX'],
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&state=IL&state=TX&tab=Map',
        });
      });
    });

    describe('STATE_FILTER_CLEARED', () => {
      it('removes state filters', () => {
        action = {
          type: actions.STATE_FILTER_CLEARED,
        };

        result = target(
          {
            state: ['FO', 'BA'],
            tab: types.MODE_MAP,
          },
          action
        );

        expect(result).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '',
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&tab=Map',
        });
      });

      it('handles no state filters', () => {
        action = {
          type: actions.STATE_FILTER_CLEARED,
        };

        result = target({ tab: types.MODE_MAP }, action);

        expect(result).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '',
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&tab=Map',
        });
      });
    });

    describe('STATE_FILTER_REMOVED', () => {
      beforeEach(() => {
        action = {
          type: actions.STATE_FILTER_REMOVED,
          selectedState: { abbr: 'IL', name: 'Illinois' },
        };
      });
      it('removes a state filter', () => {
        result = target(
          {
            state: ['CA', 'IL'],
            tab: types.MODE_MAP,
          },
          action
        );
        expect(result).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '?state=CA',
          state: ['CA'],
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&state=CA&tab=Map',
        });
      });
      it('handles empty state', () => {
        result = target({ tab: types.MODE_MAP }, action);
        expect(result).toEqual({
          dataNormalization: 'None',
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '',
          tab: types.MODE_MAP,
          url: '?dataNormalization=None&tab=Map',
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
      it('handles TRENDS_DATE_WARNING_DISMISSED action', () => {
        action = {
          type: actions.TRENDS_DATE_WARNING_DISMISSED,
        };
        state.trendsDateWarningEnabled = true;
        expect(target(state, action)).toEqual({
          chartType: 'line',
          queryString: '',
          tab: types.MODE_TRENDS,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&tab=Trends',
        });
      });
    });

    describe('CHART_TYPE_CHANGED actions', () => {
      it('changes the chartType - default', () => {
        action = {
          type: actions.CHART_TYPE_CHANGED,
          chartType: 'Foo',
        };
        state.chartType = 'ahha';
        result = target(state, action);
        expect(result).toEqual({
          chartType: 'line',
          queryString: '',
          tab: types.MODE_TRENDS,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&tab=Trends',
        });
      });
    });

    describe('DATA_LENS_CHANGED actions', () => {
      it('changes the lens - default', () => {
        action = {
          type: actions.DATA_LENS_CHANGED,
          lens: 'Foo',
        };
        state.focus = 'ahha';
        result = target(state, action);
        expect(result).toEqual({
          chartType: 'line',
          focus: '',
          lens: 'Overview',
          subLens: '',
          queryString: '?lens=overview&trend_depth=5',
          tab: 'Trends',
          trendDepth: 5,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&lens=Overview&tab=Trends',
        });
      });

      it('has special values when lens = Company', () => {
        action = {
          type: actions.DATA_LENS_CHANGED,
          lens: 'Company',
        };
        result = target({ tab: types.MODE_TRENDS, focus: 'ahha' }, action);
        expect(result).toEqual({
          chartType: 'line',
          focus: '',
          lens: 'Company',
          subLens: 'product',
          queryString: '?lens=company&sub_lens=product&trend_depth=10',
          tab: 'Trends',
          trendDepth: 10,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&lens=Company&subLens=product&tab=Trends',
        });
      });

      it('changes the lens - Product', () => {
        action = {
          type: actions.DATA_LENS_CHANGED,
          lens: 'Product',
        };
        result = target({ tab: types.MODE_TRENDS, focus: 'ahha' }, action);
        expect(result).toEqual({
          chartType: 'line',
          focus: '',
          lens: 'Product',
          queryString: '?lens=product&sub_lens=sub_product&trend_depth=5',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 5,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&lens=Product&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('DATA_SUBLENS_CHANGED actions', () => {
      it('changes the sub lens', () => {
        action = {
          type: actions.DATA_SUBLENS_CHANGED,
          subLens: 'Issue',
        };
        result = target({ tab: types.MODE_TRENDS }, action);
        expect(result).toEqual({
          chartType: 'line',
          subLens: 'issue',
          queryString: '?sub_lens=issue',
          tab: 'Trends',
          trendsDateWarningEnabled: false,
          url: '?chartType=line&subLens=issue&tab=Trends',
        });
      });
    });

    describe('DATE_INTERVAL_CHANGED', () => {
      it('changes the dateInterval', () => {
        action = {
          type: actions.DATE_INTERVAL_CHANGED,
          dateInterval: 'Day',
        };
        result = target({ tab: types.MODE_TRENDS }, action);
        expect(result).toEqual({
          breakPoints: {},
          chartType: 'line',
          dateInterval: 'Day',
          from: 0,
          page: 1,
          queryString: '?trend_interval=day',
          searchAfter: '',
          tab: 'Trends',
          trendsDateWarningEnabled: false,
          url: '?chartType=line&dateInterval=Day&tab=Trends',
        });
      });
    });

    describe('FOCUS_CHANGED actions', () => {
      it('changes the focus', () => {
        action = {
          type: actions.FOCUS_CHANGED,
          filterValues: ['A', 'A' + types.SLUG_SEPARATOR + 'B'],
          focus: 'A',
          lens: 'Product',
        };
        result = target({ focus: 'Else' }, action);
        expect(result).toEqual({
          chartType: 'line',
          focus: 'A',
          lens: 'Product',
          product: ['A', 'A' + types.SLUG_SEPARATOR + 'B'],
          queryString:
            '?focus=A&lens=product&product=A&product=A%E2%80%A2B' +
            '&sub_lens=sub_product&trend_depth=25',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 25,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&focus=A&lens=Product&product=A&product=A%E2%80%A2B&subLens=sub_product&tab=Trends',
        });
      });

      it('changes the Company Focus', () => {
        action = {
          type: actions.FOCUS_CHANGED,
          filterValues: ['A'],
          focus: 'A',
          lens: 'Company',
        };
        result = target({ focus: 'Else' }, action);
        expect(result).toEqual({
          chartType: 'line',
          focus: 'A',
          lens: 'Company',
          company: ['A'],
          queryString:
            '?company=A&focus=A&lens=company&sub_lens=product' +
            '&trend_depth=25',
          subLens: 'product',
          tab: 'Trends',
          trendDepth: 25,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&company=A&focus=A&lens=Company&subLens=product&tab=Trends',
        });
      });
    });

    describe('FOCUS_REMOVED actions', () => {
      it('clears the focus & resets values', () => {
        action = {
          type: actions.FOCUS_REMOVED,
        };
        result = target({ lens: 'Product' }, action);
        expect(result).toEqual({
          chartType: 'line',
          focus: '',
          lens: 'Product',
          queryString: '?lens=product&sub_lens=sub_product&trend_depth=5',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 5,
          trendsDateWarningEnabled: false,
          url: '?chartType=line&lens=Product&subLens=sub_product&tab=Trends',
        });
      });
    });
  });
});
