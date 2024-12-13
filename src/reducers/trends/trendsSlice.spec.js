import trends, {
  chartTypeUpdated,
  dataLensChanged,
  dataSubLensChanged,
  depthChanged,
  depthReset,
  focusChanged,
  focusRemoved,
  tooltipUpdated,
  trendsState,
} from './trendsSlice';

import {
  filtersCleared,
  multipleFiltersRemoved,
} from '../filters/filtersSlice';
import { tabChanged } from '../view/viewSlice';
import { routeChanged } from '../routes/routesSlice';
import * as types from '../../constants';

describe('reducer:trends', () => {
  let action, result, state;

  describe('reducer', () => {
    it('has a default state', () => {
      expect(trends(undefined, {})).toEqual({
        chartType: 'line',
        focus: '',
        lens: 'Product',
        subLens: 'sub_product',
        tooltip: false,
        trendDepth: 5,
      });
    });
  });

  describe('CHART_TYPE_CHANGED action', () => {
    it('changes the chart type - default', () => {
      const chartType = 'FooBar';

      expect(
        trends({ ...trendsState, tooltip: true }, chartTypeUpdated(chartType)),
      ).toEqual({
        ...trendsState,
        chartType: 'FooBar',
        tooltip: false,
      });
    });

    it('changes the chart type - area', () => {
      const chartType = 'area';

      expect(
        trends({ ...trendsState, tooltip: true }, chartTypeUpdated(chartType)),
      ).toEqual({
        ...trendsState,
        chartType: 'area',
        tooltip: false,
      });
    });

    it('changes the chart type to line when lens is Overview', () => {
      const chartType = 'FooBar';
      const targetState = {
        ...trendsState,
        chartType: 'line',
        lens: 'Overview',
        subLens: 'sub_product',
        tooltip: false,
      };

      expect(trends(targetState, chartTypeUpdated(chartType))).toEqual({
        ...targetState,
      });
    });
  });

  describe('DATA_LENS_CHANGED action', () => {
    let lens;
    beforeEach(() => {
      lens = 'Overview';
      state = { focus: 'gg', tooltip: 'foo', chartType: 'area' };
    });
    it('updates the data lens default', () => {
      result = trends(state, dataLensChanged('Foo'));
      expect(result).toMatchObject({
        focus: '',
        lens: 'Product',
        subLens: 'sub_product',
        tooltip: false,
      });
    });

    it('updates the data lens Overview', () => {
      result = trends(
        { ...trendsState, ...state },
        dataLensChanged('Overview'),
      );
      expect(result).toMatchObject({
        ...trendsState,
        chartType: 'line',
        focus: '',
        lens: 'Overview',
        subLens: 'product',
        tooltip: false,
      });
    });

    it('updates the data lens - Company', () => {
      lens = 'Company';
      result = trends({ ...trendsState, ...state }, dataLensChanged(lens));
      expect(result).toMatchObject({
        ...trendsState,
        chartType: 'area',
        focus: '',
        lens: 'Company',
        subLens: 'product',
        tooltip: false,
        trendDepth: 10,
      });
    });

    it('updates the data lens - product', () => {
      lens = 'Product';
      result = trends({ ...trendsState, ...state }, dataLensChanged(lens));
      expect(result).toMatchObject({
        ...trendsState,
        chartType: 'area',
        focus: '',
        lens: 'Product',
        subLens: 'sub_product',
        tooltip: false,
      });
    });
  });

  describe('DATA_SUBLENS_CHANGED action', () => {
    it('updates the data sublens', () => {
      const subLens = 'sub_something';
      expect(
        trends({ ...trendsState, subLens: 'gg' }, dataSubLensChanged(subLens)),
      ).toEqual({
        ...trendsState,
        chartType: 'line',
        subLens: 'sub_something',
      });
    });
  });

  describe('FOCUS_CHANGED action', () => {
    it('updates the FOCUS and clears the tooltip', () => {
      const focus = 'Some Rando Text';
      const lens = 'Product';
      const filterVals = ['a', 'b', 'c'];
      expect(
        trends(
          {
            ...trendsState,
            focus: 'gg',
            tooltip: { wut: 'isthis' },
          },
          focusChanged(focus, lens, filterVals),
        ),
      ).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: 'Some Rando Text',
        lens: 'Product',
        subLens: 'sub_product',
        tooltip: false,
        trendDepth: 25,
      });
    });

    it('changes the Company Focus', () => {
      const filterValues = ['A'];
      const focus = 'A';
      const lens = 'Company';
      result = trends(
        { ...trendsState, focus: 'Else' },
        focusChanged(focus, lens, filterValues),
      );
      expect(result).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: 'A',
        lens: 'Company',
        subLens: 'product',
        trendDepth: 25,
      });
    });
  });

  describe('FOCUS_REMOVED action', () => {
    it('removes the FOCUS and resets values', () => {
      action = {};

      expect(
        trends(
          {
            ...trendsState,
            focus: 'gg',
            tooltip: { wut: 'isthis' },
          },
          focusRemoved(action),
        ),
      ).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: '',
        tooltip: false,
        trendDepth: 5,
      });
    });
  });

  describe('FILTER_ALL_REMOVED action', () => {
    it('resets the FOCUS', () => {
      action = {};
      result = trends({ ...trendsState, focus: 'gg' }, filtersCleared(action));
      expect(result).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: '',
      });
    });
  });

  describe('FILTER_MULTIPLE_REMOVED action', () => {
    it('resets the FOCUS if it matches one of the filters', () => {
      result = trends(
        { ...trendsState, focus: 'A' },
        multipleFiltersRemoved('somefilter', ['A', 'B']),
      );
      expect(result).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: '',
      });
    });

    it('leaves the FOCUS alone if no match any filters', () => {
      expect(
        trends(
          { ...trendsState, focus: 'C' },
          multipleFiltersRemoved('somefilter', ['A', 'B']),
        ),
      ).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: 'C',
      });
    });
  });

  describe('TAB_CHANGED action', () => {
    it('clears results and resets values', () => {
      const payload = 'Foo';

      expect(
        trends(
          {
            ...trendsState,
            focus: 'Your',
          },
          tabChanged(payload),
        ),
      ).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: '',
      });
    });

    it('leaves Focus alone when tab is Trend', () => {
      const payload = 'Trends';

      expect(
        trends(
          {
            ...trendsState,
            focus: 'Your',
          },
          tabChanged(payload),
        ),
      ).toEqual({
        ...trendsState,
        chartType: 'line',
        focus: 'Your',
      });
    });
  });

  describe('TRENDS_TOOLTIP_CHANGED', () => {
    it('handles no value', () => {
      const action = {};
      const state = { ...trendsState, results: {} };
      const res = trends(state, tooltipUpdated(action));

      expect(res.tooltip).toBeFalsy();
    });

    it('calculates total and sets the title', () => {
      const payload = {
        date: '2021-06-01T00:00:00.000Z',
        dateRange: {
          from: '2021-05-23T00:00:00.000Z',
          to: '2021-08-23T00:00:00.000Z',
        },
        interval: 'Month',
        values: [
          {
            topicName: 'Alpha',
            name: 'Alpha',
            date: '2021-06-01T00:00:00.000Z',
            value: 29769,
          },
          {
            topicName: 'Beta',
            name: 'Beta',
            date: '2021-06-01T00:00:00.000Z',
            value: 6610,
          },
          {
            topicName: 'Charlie',
            name: 'Charlie',
            date: '2021-06-01T00:00:00.000Z',
            value: 2317,
          },
          {
            topicName: 'Delta',
            name: 'Delta',
            date: '2021-06-01T00:00:00.000Z',
            value: 2322,
          },
          {
            topicName: 'Echo',
            name: 'Echo',
            date: '2021-06-01T00:00:00.000Z',
            value: 2174,
          },
        ],
      };
      state = {
        ...trendsState,
        colorMap: {
          Alpha: '#2cb34a',
          Beta: '#addc91',
          Charlie: '#257675',
          Delta: '#345534',
          Echo: '#532423',
        },
      };
      result = trends(state, tooltipUpdated(payload));

      expect(result.tooltip).toMatchObject({
        date: '2021-06-01T00:00:00.000Z',
        dateRange: {
          from: '2021-05-23T00:00:00.000Z',
          to: '2021-08-23T00:00:00.000Z',
        },
        interval: 'Month',
        values: [
          {
            topicName: 'Alpha',
            name: 'Alpha',
            date: '2021-06-01T00:00:00.000Z',
            value: 29769,
          },
          {
            topicName: 'Beta',
            name: 'Beta',
            date: '2021-06-01T00:00:00.000Z',
            value: 6610,
          },
          {
            topicName: 'Charlie',
            name: 'Charlie',
            date: '2021-06-01T00:00:00.000Z',
            value: 2317,
          },
          {
            topicName: 'Delta',
            name: 'Delta',
            date: '2021-06-01T00:00:00.000Z',
            value: 2322,
          },
          {
            topicName: 'Echo',
            name: 'Echo',
            date: '2021-06-01T00:00:00.000Z',
            value: 2174,
          },
        ],
        title: expect.stringContaining('Date range: 6/1/2021 -'),
        total: 43192,
      });
    });
  });

  describe('URL_CHANGED actions', () => {
    beforeEach(() => {
      state = trendsState;
    });

    it('handles empty params', () => {
      expect(trends(state, routeChanged('/', {}))).toEqual(state);
    });

    it('handles invalid lens params', () => {
      const params = { lens: 'foobar', subLens: 'mom', nope: 'hi' };
      const path = '/';
      result = trends(state, routeChanged(path, params));
      expect(result.lens).toBe('Product');
      expect(result.subLens).toBe('sub_product');
      expect(result.nope).toBeFalsy();
    });

    it('handles lens params', () => {
      const params = { lens: 'Overview', subLens: 'product', nope: 'hi' };
      const path = '/';

      result = trends(state, routeChanged(path, params));
      expect(result.lens).toBe('Overview');
      expect(result.subLens).toBe('');
      expect(result.nope).toBeFalsy();
    });
    it('handles company lens params', () => {
      const params = { lens: 'Company', subLens: 'product', nope: 'hi' };
      const path = '/';

      result = trends(state, routeChanged(path, params));
      expect(result.lens).toBe('Company');
      expect(result.subLens).toBe('product');
      expect(result.nope).toBeFalsy();
    });

    it('handles invalid lens and chartType combo', () => {
      const params = { chartType: 'area', lens: 'Overview' };
      result = trends(state, routeChanged('/', params));
      expect(result.chartType).toBe('line');
      expect(result.lens).toBe('Overview');
    });

    it('handles valid lens and chartType combo', () => {
      const params = { chartType: 'area', lens: 'Product' };
      result = trends(state, routeChanged('/', params));
      expect(result.chartType).toBe('area');
      expect(result.lens).toBe('Product');
    });
  });

  describe('trend depth', () => {
    beforeEach(() => {
      state = {
        ...trendsState,
        tab: types.MODE_TRENDS,
        trendDepth: 5,
      };
    });
    it('handles DEPTH_CHANGED', () => {
      const depth = 13;
      expect(trends(state, depthChanged(depth))).toEqual({
        ...state,
        chartType: 'line',
        trendDepth: 13,
      });
    });
    it('handles DEPTH_RESET', () => {
      state.trendDepth = 1000;
      expect(trends(state, depthReset())).toEqual({
        ...state,
        chartType: 'line',
        trendDepth: 5,
      });
    });
  });
});
