/* eslint-disable camelcase, no-empty-function, max-nested-callbacks */

import cloneDeep from 'lodash/cloneDeep';
import * as constants from '../../constants';
import emptyStore from '../../../actions/__fixtures__/emptyStore';
import * as sut from './params';

describe('api.v2.params', () => {
  let fixtureStore, actual;
  beforeEach(() => {
    fixtureStore = cloneDeep(emptyStore);
    fixtureStore.query.dateRange.datePeriod = '';
    fixtureStore.query.dateRange.from = '2011-07-21';
    fixtureStore.query.dateRange.to = '2018-01-01';
    fixtureStore.view.tab = constants.MODE_LIST;
  });

  describe('extractAggregationParams', () => {
    it('handles missing dates', () => {
      delete fixtureStore.query.dateRange;
      actual = sut.extractAggregationParams(fixtureStore);
      expect(actual).toEqual({
        field: 'all',
        index_name: 'complaint-crdb',
      });
    });

    it('handles search text', () => {
      fixtureStore.query.searchText = 'foo';
      actual = sut.extractAggregationParams(fixtureStore);
      expect(actual).toEqual({
        date_received_max: '2018-01-01',
        date_received_min: '2011-07-21',
        field: 'all',
        index_name: 'complaint-crdb',
        search_term: 'foo',
      });
    });
  });

  describe('extractCompareParams', () => {
    beforeEach(() => {
      fixtureStore.comparisons = {
        compareItem: 'Important Item',
        selectedCompareType: 'Something',
      };
      fixtureStore.viewModel = {
        interval: 'month',
      };
    });

    it('gets compare params', () => {
      actual = sut.extractCompareParams(fixtureStore);
      expect(actual).toEqual({
        compareItem: 'Important Item',
        lens: 'sent_to',
        selectedCompareType: 'something',
        trend_interval: 'month',
      });
    });
  });

  describe('extractGeoParams', () => {
    beforeEach(() => {
      fixtureStore.almanac = {
        almanacId: '123',
        almanacLevel: 'County',
      };

      fixtureStore.geo = {
        boundingBox: false,
        center: { lat: 99, lng: 99 },
        centroidsEnabled: true,
        mapType: 'leaflet',
        geographicLevel: 'baz',
        geoShading: 'shady',
        zoom: 7.3,
      };
    });

    it('gets geo params - leaflet', () => {
      fixtureStore.geo.boundingBox = {
        north: 1,
        south: 1,
        east: 1,
        west: 1,
      };

      actual = sut.extractGeoParams(fixtureStore);
      expect(actual).toEqual({
        almanacId: '123',
        almanacLevel: 'County',
        centroidsEnabled: true,
        geographicLevel: 'baz',
        geoShading: 'shady',
        lat: '99',
        lng: '99',
        zoom: '7.3',
        north: '1',
        south: '1',
        west: '1',
        east: '1',
      });
    });

    it('gets geo params - tile', () => {
      fixtureStore.almanac = {};
      fixtureStore.geo.mapType = 'tile';

      actual = sut.extractGeoParams(fixtureStore);
      expect(actual).toEqual({
        geographicLevel: 'baz',
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

  describe('extractSavedListQueryParams', () => {
    beforeEach(() => {
      fixtureStore.query = {
        from: 0,
        _index: 'complaint-crdb',
        searchAfter: '',
        size: 10,
        sort: 'Newest to oldest',
      };
    });
    it('gets query params without search after', () => {
      actual = sut.extractSavedListQueryParams(fixtureStore);
      expect(actual).toEqual({
        frm: 0,
        index_name: 'complaint-crdb',
        no_aggs: true,
        size: 10,
        sort: 'created_date_desc',
      });
    });
    it('gets query params with search after', () => {
      fixtureStore.query.searchAfter = '123_4560-2345';
      actual = sut.extractSavedListQueryParams(fixtureStore);
      expect(actual).toEqual({
        frm: 0,
        index_name: 'complaint-crdb',
        no_aggs: true,
        search_after: '123_4560-2345',
        size: 10,
        sort: 'created_date_desc',
      });
    });
  });

  describe('extractTrendsParams', () => {
    beforeEach(() => {
      fixtureStore.trends = {
        lens: 'ItemName',
        trend_depth: 10,
      };
      fixtureStore.viewModel = {
        interval: 'Quantum',
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
      fixtureStore.comparisons.compareItem = 'Important Item';
      fixtureStore.query.searchText = 'foo';
      fixtureStore.trends.lens = 'Issue';
      fixtureStore.trends.subLens = 'Sub-issue';
    });

    describe('parseParamsToCompare', () => {
      it('reverses extractCompareParams', () => {
        const forward = sut.extractCompareParams(fixtureStore);
        const reversed = sut.parseParamsToCompare(forward);
        expect(fixtureStore.comparisons).toEqual(
          expect.objectContaining(reversed),
        );
      });

      it('extracts compare_company', () => {
        const params = {
          compare_company: 'Axnm Inc',
          selectedCompareType: 'company',
        };
        actual = sut.parseParamsToCompare(params);
        expect(actual).toEqual({
          compareItem: 'Axnm Inc',
          selectedCompareType: 'Company',
        });
      });
    });

    describe('parseParamsToQuery', () => {
      it('reverses extractQueryParams', () => {
        const forward = sut.extractQueryParams(fixtureStore.query);
        const reversed = sut.parseParamsToQuery(forward);
        expect(fixtureStore.query).toEqual(expect.objectContaining(reversed));
      });

      it('handles created date sort', () => {
        fixtureStore.query.sort = 'Newest to oldest';
        const forward = sut.extractQueryParams(fixtureStore.query);
        const reversed = sut.parseParamsToQuery(forward);
        expect(fixtureStore.query).toEqual(expect.objectContaining(reversed));
      });

      it('handles bogus searchFieldMap', () => {
        fixtureStore.query.searchFields = 'Bogus value';
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

    describe('parseParamsToTrends', () => {
      it('reverses extractTrendsParams', () => {
        const forward = sut.extractTrendsParams(fixtureStore);
        const reversed = sut.parseParamsToTrends(forward);
        expect(fixtureStore.trends).toEqual(expect.objectContaining(reversed));
      });
    });

    describe('parseParamsToViewModel', () => {
      it('reverses extractCompareParams', () => {
        const forward = sut.extractCompareParams(fixtureStore);
        const reversed = sut.parseParamsToViewModel(forward);
        expect(fixtureStore.viewModel).toEqual(
          expect.objectContaining(reversed),
        );
      });

      it('reverses extractTrendsParams', () => {
        const forward = sut.extractTrendsParams(fixtureStore);
        const reversed = sut.parseParamsToViewModel(forward);
        expect(fixtureStore.viewModel).toEqual(
          expect.objectContaining(reversed),
        );
      });
    });
  });
});
