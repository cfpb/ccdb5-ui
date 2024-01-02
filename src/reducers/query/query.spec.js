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
  replaceFilters,
  toggleFlagFilter,
  removeFilter,
  removeMultipleFilters,
  addMultipleFilters,
  removeAllFilters,
  addFilter,
  toggleFilter,
  changeTab,
  changeSort,
  changeSize,
  nextPageShown,
  prevPageShown,
  resetDepth,
  changeDepth,
  changeSearchText,
  changeSearchField,
    changeFocus
} from './query';
import * as types from '../../constants';
import dayjs from 'dayjs';
import { startOfToday } from '../../utils';
import {
  removeFocus,
  updateChartType,
  updateDataLens,
  updateDataSubLens,
} from '../trends/trends';
import { formatDate } from '../../utils/formatDate';
import { processHitsResults } from '../results/results';

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
        ...queryState,
        page: 10,
        size: 100,
        totalPages: 5,
      };

      expect(target(state, processHitsResults(action))).toEqual({
        ...state,
        breakPoints: {
          2: [2, 2],
          3: [3, 2],
          4: [4, 2],
          5: [5, 2],
        },
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });

    it('limits the current page correctly', () => {
      action = {
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
        ...queryState,
        page: 101,
        size: 100,
      };

      expect(target(state, processHitsResults(action))).toEqual({
        ...state,
        breakPoints: {
          2: [2, 2],
          3: [3, 2],
          4: [4, 2],
          5: [5, 2],
        },
        page: 100,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
        size: 100,
        totalPages: 5,
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });
  });

  it('handles SEARCH_FIELD_CHANGED actions', () => {
    action = {
      searchField: 'bar',
    };
    state = {
      ...queryState,
      from: 80,
      searchText: 'foo',
      size: 100,
    };
    expect(target(state, changeSearchField(action))).toEqual({
      ...state,
      breakPoints: {},
      from: 0,
      page: 1,
      queryString:
        '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&search_term=foo&sub_lens=sub_product&trend_depth=5&trend_interval=month',
      searchAfter: '',
      searchField: 'bar',
      searchText: 'foo',
      size: 100,
      search:
        '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&searchText=foo&subLens=sub_product&tab=Trends',
    });
  });

  it('handles SEARCH_TEXT_CHANGED actions', () => {
    action = {
      searchText: 'bar',
    };
    state = {
      ...queryState,
      from: 80,
      searchText: 'foo',
      size: 100,
    };
    expect(target(state, changeSearchText(action))).toEqual({
      ...state,
      breakPoints: {},
      from: 0,
      page: 1,
      queryString:
        '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&search_term=foo&sub_lens=sub_product&trend_depth=5&trend_interval=month',
      searchAfter: '',
      searchText: 'bar',
      size: 100,
      search:
        '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&searchText=foo&subLens=sub_product&tab=Trends',
    });
  });

  describe('trend depth', () => {
    beforeEach(() => {
      state = {
        ...queryState,
        tab: types.MODE_TRENDS,
        trendDepth: 5,
      };
    });
    it('handles DEPTH_CHANGED', () => {
      action = {
        depth: 13,
      };
      expect(target(state, changeDepth(action))).toEqual({
        ...state,
        chartType: 'line',
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=13&trend_interval=month',
        tab: types.MODE_TRENDS,
        trendDepth: 13,
        trendsDateWarningEnabled: false,
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });
    it('handles DEPTH_RESET', () => {
      state.trendDepth = 1000;
      expect(target(state, resetDepth())).toEqual({
        ...state,
        chartType: 'line',
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
        tab: types.MODE_TRENDS,
        trendDepth: 5,
        trendsDateWarningEnabled: false,
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });
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
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST,
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
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&frm=100&size=100&sort=created_date_desc',
        searchAfter: '909_131',
        size: 100,
        tab: types.MODE_LIST,
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=2&searchField=all&size=100&sort=created_date_desc&tab=List',
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
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, prevPageShown())).toEqual({
        ...state,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 100,
        page: 2,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&frm=100&size=100&sort=created_date_desc',
        searchAfter: '99_22131',
        size: 100,
        tab: types.MODE_LIST,
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=3&searchField=all&size=100&sort=created_date_desc&tab=List',
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
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, prevPageShown())).toEqual({
        ...state,
        breakPoints: {
          2: [99, 22131],
          3: [909, 131],
        },
        from: 0,
        page: 1,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&frm=100&size=100&sort=created_date_desc',
        searchAfter: '',
        size: 100,
        tab: types.MODE_LIST,
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=2&searchField=all&size=100&sort=created_date_desc&tab=List',
      });
    });
  });

  describe('Action Bar', () => {
    it('handles SIZE_CHANGED actions', () => {
      action = {
        size: 50,
      };
      state = {
        ...queryState,
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, changeSize(action))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=50&sort=created_date_desc',
        searchAfter: '',
        size: 50,
        tab: types.MODE_LIST,
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=1&searchField=all&size=50&sort=created_date_desc&tab=List',
      });
    });

    it('handles SORT_CHANGED actions - default', () => {
      action = {
        sort: 'foo',
      };
      state = {
        ...queryState,
        from: 100,
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, changeSort(action))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=100&sort=created_date_desc',
        searchAfter: '',
        sort: 'created_date_desc',
        size: 100,
        tab: types.MODE_LIST,
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=1&searchField=all&size=100&sort=created_date_desc&tab=List',
      });
    });

    it('handles SORT_CHANGED actions - valid value', () => {
      action = {
        sort: 'relevance_asc',
      };
      state = {
        ...queryState,
        from: 100,
        size: 100,
        tab: types.MODE_LIST,
      };
      expect(target(state, changeSort(action))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=100&sort=relevance_asc',
        searchAfter: '',
        sort: 'relevance_asc',
        size: 100,
        tab: types.MODE_LIST,
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=1&searchField=all&size=100&sort=relevance_asc&tab=List',
      });
    });
  });

  describe('Tabs', () => {
    beforeEach(() => {
      action = {};
      state = {
        ...queryState,
        focus: 'Yoyo',
        tab: 'bar',
      };
    });

    it('handles TAB_CHANGED actions - default', () => {
      action.tab = 'foo';
      expect(target(state, changeTab(action))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        chartType: 'line',
        focus: 'Yoyo',
        tab: 'Trends',
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&focus=Yoyo&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
        trendsDateWarningEnabled: false,
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&focus=Yoyo&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });

    it('handles Trends TAB_CHANGED actions', () => {
      action.tab = 'Trends';
      expect(target(state, changeTab(action))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        chartType: 'line',
        focus: 'Yoyo',
        tab: 'Trends',
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&focus=Yoyo&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
        trendsDateWarningEnabled: false,
        search:
          '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&focus=Yoyo&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
      });
    });

    it('handles a Map TAB_CHANGED actions', () => {
      action.tab = types.MODE_MAP;
      expect(target(state, changeTab(action))).toEqual({
        ...state,
        breakPoints: {},
        dataNormalization: 'None',
        from: 0,
        page: 1,
        searchAfter: '',
        focus: '',
        enablePer1000: false,
        mapWarningEnabled: true,
        tab: types.MODE_MAP,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
        search:
          '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
      });
    });

    it('handles a List TAB_CHANGED actions', () => {
      action.tab = types.MODE_LIST;
      expect(target(state, changeTab(action))).toEqual({
        ...state,
        breakPoints: {},
        from: 0,
        page: 1,
        searchAfter: '',
        focus: '',
        tab: types.MODE_LIST,
        queryString:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&size=25&sort=created_date_desc',
        search:
          '?date_received_max=2020-05-05&date_received_min=2017-05-05&page=1&searchField=all&size=25&sort=created_date_desc&tab=List',
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
      expect(actual.page).toEqual('100');
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
      actual = target(state, processParams(action)).date_received_min;
      expect(actual.getFullYear()).toEqual(expected.getFullYear());
      expect(actual.getMonth()).toEqual(expected.getMonth());
    });

    it('converts flag parameters to booleans', () => {
      action.params = { has_narrative: 'true' };
      actual = target(state, processParams(action)).has_narrative;
      expect(actual).toEqual(true);
    });

    xit('ignores incorrect dates', () => {
      action.params = { date_received_min: 'foo' };
      expect(target(state, processParams(action))).toEqual(state);
    });

    xit('ignores unknown parameters', () => {
      action.params = { foo: 'bar' };
      expect(target(state, processParams(action))).toEqual(state);
    });

    it('handles a single filter', () => {
      action.params = { product: 'Debt Collection' };
      actual = target(state, processParams(action));
      expect(actual.product).toEqual(['Debt Collection']);
    });

    it('handles a multiple filters', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target(state, processParams(action));
      expect(actual.product).toEqual(['Debt Collection', 'Mortgage']);
    });

    it('handles a multiple filters & focus', () => {
      action.params = { product: ['Debt Collection', 'Mortgage'] };
      actual = target({ ...state, focus: 'Something' }, processParams(action));
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

      actual = target(state, processParams(action));

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
        state = queryState;
        action = { filterName, filterValue };
      });

      it('handles FILTER_CHANGED actions and returns correct object', () => {
        expect(target(state, toggleFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          page: 1,
          [filterName]: [key],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('queryString ignores invalid api FILTER values', () => {
        action.filterName = 'foobar';
        expect(target(state, toggleFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          foobar: ['affirmative'],
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('handles FILTER_CHANGED actions & returns correct object - Map', () => {
        const newState = { ...state, tab: types.MODE_MAP };
        expect(target(newState, toggleFilter(action))).toEqual({
          ...newState,
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          from: 0,
          [filterName]: [key],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
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
          filterName: 'product',
          filterValue: 'baz',
        };
      });

      it('adds a filter when one exists', () => {
        state = {
          ...queryState,
          product: ['bar', 'qaz'],
        };
        expect(target(state, addFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz', 'baz'],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&product=bar&product=qaz&product=baz&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&product=bar&product=qaz&product=baz&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('ignores a filter when it exists', () => {
        state = {
          ...queryState,
          product: ['bar', 'qaz', 'baz'],
        };
        expect(target(state, addFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz', 'baz'],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&product=bar&product=qaz&product=baz&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&product=bar&product=qaz&product=baz&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('handles a missing filter', () => {
        state = {
          ...queryState,
          issue: ['bar', 'baz', 'qaz'],
        };
        expect(target(state, addFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          product: ['baz'],
          issue: ['bar', 'baz', 'qaz'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=bar&issue=baz&issue=qaz&lens=product&product=baz&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=bar&issue=baz&issue=qaz&lens=Product&product=baz&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('handles a missing filter value', () => {
        state = {
          ...queryState,
          product: ['bar', 'qaz'],
        };
        expect(target(state, addFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz', 'baz'],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&product=bar&product=qaz&product=baz&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&product=bar&product=qaz&product=baz&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      describe('has_narrative', () => {
        it('handles when present', () => {
          action.filterName = 'has_narrative';
          state = {
            ...queryState,
            has_narrative: true,
          };
          expect(target(state, addFilter(action))).toEqual({
            ...state,
            breakPoints: {},
            from: 0,
            has_narrative: true,
            page: 1,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&has_narrative=true&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
            searchAfter: '',
            search:
              '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&has_narrative=true&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
          });
        });

        it('handles when present - Map', () => {
          action.filterName = 'has_narrative';
          state = {
            ...queryState,
            dataNormalization: 'None',
            has_narrative: true,
            tab: types.MODE_MAP,
          };
          expect(target(state, addFilter(action))).toEqual({
            ...state,
            breakPoints: {},
            dataNormalization: 'None',
            enablePer1000: false,
            from: 0,
            has_narrative: true,
            page: 1,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&has_narrative=true',
            searchAfter: '',
            tab: types.MODE_MAP,
            search:
              '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&has_narrative=true&searchField=all&tab=Map',
          });
        });

        it('handles when absent', () => {
          action.filterName = 'has_narrative';
          expect(target(queryState, addFilter(action))).toEqual({
            ...queryState,
            breakPoints: {},
            from: 0,
            has_narrative: true,
            page: 1,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&has_narrative=true&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
            searchAfter: '',
            search:
              '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&has_narrative=true&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
          });
        });
      });
    });

    describe('FILTER_REMOVED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          filterName: 'product',
          filterValue: 'baz',
        };
      });

      it('removes a filter when one exists', () => {
        state = {
          ...queryState,
          product: ['bar', 'baz', 'qaz'],
        };
        expect(target(state, removeFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz'],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&product=bar&product=qaz&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&product=bar&product=qaz&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('removes a filter on Map tab when one exists', () => {
        state = {
          ...queryState,
          product: ['bar', 'baz', 'qaz'],
          mapWarningEnabled: true,
          tab: types.MODE_MAP,
        };
        expect(target(state, removeFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          from: 0,
          enablePer1000: false,
          page: 1,
          product: ['bar', 'qaz'],
          mapWarningEnabled: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&product=bar&product=qaz',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&product=bar&product=qaz&searchField=all&tab=Map',
        });
      });

      it('handles a missing filter', () => {
        state = {
          ...queryState,
          issue: ['bar', 'baz', 'qaz'],
        };
        expect(target(state, removeFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          issue: ['bar', 'baz', 'qaz'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=bar&issue=baz&issue=qaz&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=bar&issue=baz&issue=qaz&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('handles a missing filter value', () => {
        state = {
          ...queryState,
          product: ['bar', 'qaz'],
        };
        expect(target(state, removeFilter(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          page: 1,
          product: ['bar', 'qaz'],
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&product=bar&product=qaz&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&product=bar&product=qaz&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      describe('has_narrative', () => {
        it('handles when present', () => {
          action.filterName = 'has_narrative';
          state = {
            ...queryState,
            has_narrative: true,
          };
          const newState = { ...state };
          delete newState.has_narrative;
          expect(target(state, removeFilter(action))).toEqual({
            ...newState,
            breakPoints: {},
            from: 0,
            page: 1,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
            searchAfter: '',
            search:
              '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
          });
        });

        it('handles when present - Map', () => {
          action.filterName = 'has_narrative';
          state = {
            ...queryState,
            dataNormalization: 'None',
            has_narrative: true,
            tab: types.MODE_MAP,
          };
          const newState = { ...state };
          delete newState.has_narrative;
          expect(target(state, removeFilter(action))).toEqual({
            ...newState,
            breakPoints: {},
            dataNormalization: 'None',
            enablePer1000: false,
            from: 0,
            mapWarningEnabled: true,
            page: 1,
            searchAfter: '',
            tab: types.MODE_MAP,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all',
            search:
              '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&searchField=all&tab=Map',
          });
        });

        it('handles when absent', () => {
          action.filterName = 'has_narrative';
          expect(target(queryState, removeFilter(action))).toEqual({
            ...queryState,
            breakPoints: {},
            from: 0,
            page: 1,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
            searchAfter: '',
            search:
              '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
          });
        });
      });
    });

    describe('FILTER_ALL_REMOVED actions', () => {
      let action, state;
      beforeEach(() => {
        state = {
          ...queryState,
          company: ['Acme'],
          date_received_min: new Date(types.DATE_RANGE_MIN),
          from: 100,
          has_narrative: true,
          searchField: 'all',
          size: 100,
          timely: ['bar', 'baz', 'qaz'],
          tab: types.MODE_LIST,
        };
      });

      it('clears all filters', () => {
        const actual = target(state, removeAllFilters(action));
        delete state.company;
        delete state.timely;
        expect(actual).toMatchObject({
          ...state,
          dateRange: 'All',
          from: 0,
          searchField: 'all',
          size: 100,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2011-12-01&field=all&frm=100&has_narrative=true&size=100&sort=created_date_desc',
          search:
            '?date_received_max=2020-05-05&date_received_min=2011-12-01&has_narrative=true&page=1&searchField=all&size=100&sort=created_date_desc&tab=List',
        });
      });

      it('clears all filters - Map', () => {
        state.tab = types.MODE_MAP;
        const actual = target(state, removeAllFilters(action));
        delete state.company;
        delete state.timely;
        expect(actual).toMatchObject({
          ...state,
          dateRange: 'All',
          enablePer1000: false,
          from: 0,
          mapWarningEnabled: true,
          searchField: 'all',
          size: 100,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2011-12-01&field=all&has_narrative=true',
          search:
            '?dataNormalization=None&dateRange=All&date_received_max=2020-05-05&date_received_min=2011-12-01&has_narrative=true&searchField=all&tab=Map',
        });
      });

      describe('when searching Narratives', () => {
        it('does not clear the hasNarrative filter', () => {
          state.searchField = types.NARRATIVE_SEARCH_FIELD;
          delete state.company;
          delete state.timely;
          const actual = target(state, removeAllFilters(action));
          expect(actual).toMatchObject({
            ...state,
            dateRange: 'All',
            from: 0,
            has_narrative: true,
            searchField: types.NARRATIVE_SEARCH_FIELD,
            size: 100,
            queryString:
              '?date_received_max=2020-05-05&date_received_min=2011-12-01&field=complaint_what_happened&frm=100&has_narrative=true&size=100&sort=created_date_desc',
            search:
              '?date_received_max=2020-05-05&date_received_min=2011-12-01&has_narrative=true&page=1&searchField=complaint_what_happened&size=100&sort=created_date_desc&tab=List',
          });
        });
      });
    });

    describe('FILTER_MULTIPLE_ADDED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          filterName: 'issue',
          values: ['Mo Money', 'Mo Problems'],
        };
      });

      it("adds all filters if they didn't exist", () => {
        expect(target(queryState, addMultipleFilters(action))).toEqual({
          ...queryState,
          breakPoints: {},
          from: 0,
          issue: ['Mo Money', 'Mo Problems'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=Mo%20Money&issue=Mo%20Problems&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=Mo%20Money&issue=Mo%20Problems&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it("adds all filters if they didn't exist - Map", () => {
        expect(
          target(
            {
              ...queryState,
              enablePer1000: false,
              mapWarningEnabled: true,
              tab: types.MODE_MAP,
            },
            addMultipleFilters(action)
          )
        ).toEqual({
          ...queryState,
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          from: 0,
          issue: ['Mo Money', 'Mo Problems'],
          mapWarningEnabled: true,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=Mo%20Money&issue=Mo%20Problems',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=Mo%20Money&issue=Mo%20Problems&searchField=all&tab=Map',
        });
      });

      it('skips filters if they exist already', () => {
        state = {
          ...queryState,
          issue: ['foo'],
        };
        action.values.push('foo');

        expect(target(state, addMultipleFilters(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          issue: ['foo', 'Mo Money', 'Mo Problems'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=foo&issue=Mo%20Money&issue=Mo%20Problems&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=foo&issue=Mo%20Money&issue=Mo%20Problems&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('skips filters if they exist already - Map', () => {
        state = {
          ...queryState,
          issue: ['foo'],
          tab: types.MODE_MAP,
        };
        action.values.push('foo');

        expect(target(state, addMultipleFilters(action))).toEqual({
          ...state,
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          from: 0,
          issue: ['foo', 'Mo Money', 'Mo Problems'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=foo&issue=Mo%20Money&issue=Mo%20Problems',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=foo&issue=Mo%20Money&issue=Mo%20Problems&searchField=all&tab=Map',
        });
      });
    });

    describe('FILTER_MULTIPLE_REMOVED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          filterName: 'issue',
          values: ['Mo Money', 'Mo Problems', 'bar'],
        };
      });

      it('removes filters if they exist', () => {
        state = {
          ...queryState,
          focus: 'Mo Money',
          issue: ['foo', 'Mo Money', 'Mo Problems'],
        };
        expect(target(state, removeMultipleFilters(action))).toEqual({
          ...state,
          breakPoints: {},
          focus: '',
          from: 0,
          issue: ['foo'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=foo&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=foo&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('removes filters if they exist - Map tab', () => {
        state = {
          ...queryState,
          focus: '',
          issue: ['foo', 'Mo Money', 'Mo Problems'],
          tab: types.MODE_MAP,
        };
        expect(target(state, removeMultipleFilters(action))).toEqual({
          ...state,
          breakPoints: {},
          dataNormalization: types.GEO_NORM_NONE,
          enablePer1000: false,
          focus: '',
          from: 0,
          issue: ['foo'],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&issue=foo',
          searchAfter: '',
          tab: types.MODE_MAP,
          search:
            '?dataNormalization=None&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&issue=foo&searchField=all&tab=Map',
        });
      });

      it('ignores unknown filters', () => {
        expect(target(queryState, removeMultipleFilters(action))).toEqual({
          ...queryState,
          breakPoints: {},
          focus: '',
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('FILTER_FLAG_CHANGED actions', () => {
      let action;
      beforeEach(() => {
        action = {
          filterName: 'has_narrative',
          meta: { requery: types.REQUERY_HITS_ONLY },
        };
      });

      it('adds narrative filter to empty state', () => {
        expect(target(queryState, toggleFlagFilter(action))).toEqual({
          ...queryState,
          breakPoints: {},
          from: 0,
          page: 1,
          has_narrative: true,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&has_narrative=true&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&has_narrative=true&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });

      it('toggles off narrative filter', () => {
        expect(
          target(
            { ...queryState, has_narrative: true },
            toggleFlagFilter(action)
          )
        ).toEqual({
          ...queryState,
          breakPoints: {},
          from: 0,
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
      });
    });

    describe('FILTER_REPLACED actions', () => {
      it('replaces existing filter set', () => {
        action = {
          filterName: 'foobar',
          meta: { requery: types.REQUERY_HITS_ONLY },
          values: [3, 4, 5],
        };

        state = {
          ...queryState,
          foobar: [1, 23, 2],
        };

        expect(target(state, replaceFilters(action))).toEqual({
          ...state,
          breakPoints: {},
          from: 0,
          foobar: [3, 4, 5],
          page: 1,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&lens=product&sub_lens=sub_product&trend_depth=5&trend_interval=month',
          searchAfter: '',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&lens=Product&searchField=all&subLens=sub_product&tab=Trends',
        });
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
        expect(target(testState, changeDates(filterName, minDate, maxDate))).toEqual({
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
          { ...queryState, date_received_min: minDate, date_received_max: maxDate, dateRange: '1y' },
          changeDates(filterName, minDate, maxDate)
        );
        expect(result.dateRange).toBeFalsy();
      });

      it('adds dateRange', () => {
        const min = new Date(dayjs(maxDate).subtract(3, 'months'));
        result = target({ ...queryState }, changeDates( filterName, min, maxDate ));
        expect(result.dateRange).toEqual('3m');
      });

      it('does not add empty dates', () => {
        expect(target({ ...queryState }, changeDates(filterName, '', ''))).toEqual({
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
        action = '';
      });

      it('handles All range', () => {
        action = 'All';
        result = target({}, changeDateRange(action));
        expect(result.date_received_min).toEqual(
          new Date(types.DATE_RANGE_MIN)
        );
      });

      it('handles 1y range', () => {
        action = '1y';
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
        action = 'foo';
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
        action = 'All';
        state = { dateInterval: 'Day', tab: types.MODE_TRENDS };
        result = target(state, changeDateRange(action));
        expect(result.dateInterval).toEqual('Week');
        expect(result.trendsDateWarningEnabled).toEqual(true);
      });
    });
  });

  describe('Map', () => {
    let action, state, result;
    describe('Data normalization', () => {
      beforeEach(() => {
        action = 'FooBar';
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
        action = types.GEO_NORM_PER1000;
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
        action = { abbr: 'IL', name: 'Illinois' };
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
        action =  {abbr: 'IL', name: 'Illinois'};
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
        result = target(
          { ...queryState, tab: types.MODE_MAP },
          removeStateFilter(action)
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
  });

  describe('Trends', () => {
    let state, action, result;
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
        action = 'Foo';
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
        action = 'Foo';
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
        action = 'Company';
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
        action = 'Product';
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
        action = 'Issue';
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
        action = 'Day';
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
        const filterValues = ['A', 'A' + types.SLUG_SEPARATOR + 'B'];
        const focus = 'A';
        const lens = 'Product';
        result = target({ ...queryState, focus: 'Else' }, changeFocus(focus, lens, filterValues));
        expect(result).toEqual({
          ...queryState,
          product: ['A', 'A•B'],
          focus: 'A',
          lens: 'Product',
          tab: 'Trends',
          trendDepth: 25,
          queryString:
            '?date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&focus=A&lens=product&product=A&product=A%E2%80%A2B&sub_lens=sub_product&trend_depth=25&trend_interval=month',
          search:
            '?chartType=line&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&focus=A&lens=Product&product=A&product=A%E2%80%A2B&searchField=all&subLens=sub_product&tab=Trends'        });
      });

      it('changes the Company Focus', () => {
        const filterValues = ['A'];
        const focus = 'A';
        const lens = 'Company';
        result = target({ ...queryState, focus: 'Else' }, changeFocus(focus, lens, filterValues));
        expect(result).toEqual({
          ...queryState,
          chartType: 'line',
          focus: 'A',
          lens: 'Company',
          company: ['A'],
          queryString:
            '?company=A&date_received_max=2020-05-05&date_received_min=2017-05-05&field=all&focus=A&lens=company&sub_lens=sub_product&trend_depth=25&trend_interval=month',
          subLens: 'sub_product',
          tab: 'Trends',
          trendDepth: 25,
          trendsDateWarningEnabled: false,
          search:
            '?chartType=line&company=A&dateInterval=Month&dateRange=3y&date_received_max=2020-05-05&date_received_min=2017-05-05&focus=A&lens=Company&searchField=all&subLens=sub_product&tab=Trends',
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
