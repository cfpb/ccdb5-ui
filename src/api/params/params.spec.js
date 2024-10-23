import cloneDeep from 'lodash/cloneDeep';
import * as constants from '../../constants';
import emptyStore from '../../actions/__fixtures__/emptyStore';
import * as sut from './params';

describe('api.v2.params', () => {
  let fixtureStore, actual;
  beforeEach(() => {
    fixtureStore = cloneDeep(emptyStore);
    fixtureStore.query.date_received_min = '2011-07-21';
    fixtureStore.query.date_received_max = '2018-01-01';
    fixtureStore.view.tab = constants.MODE_LIST;
  });

  describe('extractAggregationParams', () => {
    it('handles missing dates', () => {
      actual = sut.extractAggregationParams(fixtureStore);
      expect(actual).toEqual({
        date_received_min: '2011-07-21',
        date_received_max: '2018-01-01',
        field: 'all',
      });
    });

    it('handles search text', () => {
      fixtureStore.query.searchText = 'foo';
      actual = sut.extractAggregationParams(fixtureStore);
      expect(actual).toEqual({
        date_received_max: '2018-01-01',
        date_received_min: '2011-07-21',
        field: 'all',
        search_term: 'foo',
      });
    });
  });

  describe('extractReducerAttributes', () => {
    it('extracts listed attributes', () => {
      const reducer = {
        anArray: [1, 2, 3],
        oneThing: 123,
        filty: [112],
      };
      actual = sut.extractReducerAttributes(reducer, ['anArray', 'oneThing']);
      expect(actual).toEqual({ anArray: [1, 2, 3], oneThing: 123 });
    });
  });

  describe('extractTrendsParams', () => {
    beforeEach(() => {
      fixtureStore.trends = {
        lens: 'ItemName',
        trendDepth: 10,
      };
      fixtureStore.query = {
        dateInterval: 'quantum',
      };
    });

    it('gets trends params', () => {
      actual = sut.extractTrendsParams(fixtureStore);
      expect(actual).toEqual({
        lens: 'itemname',
        trend_depth: 10,
        trend_interval: 'quantum',
      });
    });

    it('handles subLens and focus item', () => {
      fixtureStore.trends.focus = 'Focus item';
      fixtureStore.trends.subLens = 'Sub-issue';
      actual = sut.extractTrendsParams(fixtureStore);
      expect(actual).toEqual({
        focus: 'Focus item',
        lens: 'itemname',
        sub_lens: 'sub_issue',
        trend_depth: 10,
        trend_interval: 'quantum',
      });
    });
  });

  describe('parseParams', () => {
    beforeEach(() => {
      fixtureStore.query.searchText = 'foo';
      fixtureStore.trends.lens = 'Issue';
      fixtureStore.trends.subLens = 'Sub-issue';
    });

    describe('parseParamsToQuery', () => {
      it('handles bogus searchFieldMap', () => {
        fixtureStore.query.searchField = 'Bogus value';
        const actual = sut.extractQueryParams(fixtureStore.query);
        expect(actual.field).toEqual('all');
      });

      it('calculates frm from page and size when from is not given', () => {
        delete fixtureStore.query.from;
        fixtureStore.query.page = 0;
        fixtureStore.query.size = 10;
        const actual = sut.extractQueryParams(fixtureStore.query);
        expect(actual.frm).toEqual(0);
      });

      it('assigns query.searchAfter to search_after', () => {
        fixtureStore.query.searchAfter = '1__12345';
        const actual = sut.extractQueryParams(fixtureStore.query);
        expect(actual.search_after).toEqual('1__12345');
      });
    });
  });
});
