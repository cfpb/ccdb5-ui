/* eslint-disable camelcase */

import cloneDeep from 'lodash/cloneDeep';
import * as constants from '../../../constants';
import emptyStore from '../../../actions/__fixtures__/emptyStore';
import target from '../index';
import { genHistoryHref } from './url';

describe('api.v2.url', () => {
  let fixtureStore;
  beforeEach(() => {
    fixtureStore = cloneDeep(emptyStore);
    fixtureStore.geo.censusYear = '2021';
    fixtureStore.query.dateRange.from = '2011-07-21';
    fixtureStore.query.dateRange.to = '2018-01-01';
    fixtureStore.viewModel.viewMode = constants.MODE_LIST_COMPLAINTS;
  });

  describe('buildAggregationUri', () => {
    let expectedQS;
    beforeEach(() => {
      expectedQS =
        '?census_year=2021&date_received_max=2018-01-01' +
        '&date_received_min=2011-07-21&field=all' +
        '&index_name=complaint-crdb&size=0';
    });

    it('supports MODE_ATTACHMENT', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_ATTACHMENT;
      const actual = target.buildAggregationUri(fixtureStore);
      expect(actual).toEqual('/api/v2/attachments' + expectedQS);
    });

    it('supports MODE_COMPARE', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_COMPARE;
      const actual = target.buildAggregationUri(fixtureStore);
      expect(actual).toEqual('/api/v2/complaints' + expectedQS);
    });

    it('supports MODE_GEO', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_GEO;
      const actual = target.buildAggregationUri(fixtureStore);
      expect(actual).toEqual('/api/v2/complaints' + expectedQS);
    });

    it('reluctantly supports MODE_MORE_LIKE_COMPLAINT', () => {
      fixtureStore.query.mltId = '999';
      fixtureStore.viewModel.viewMode = constants.MODE_MORE_LIKE_COMPLAINT;
      const actual = target.buildAggregationUri(fixtureStore);
      expect(actual).toEqual('/api/v2/complaints/999/mlt' + expectedQS);
    });

    it('reluctantly supports MODE_TELL_YOUR_STORY', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_TELL_YOUR_STORY;
      const actual = target.buildAggregationUri(fixtureStore);
      expect(actual).toEqual('/api/v2/stories' + expectedQS);
    });

    it('does not support unknown modes', () => {
      fixtureStore.viewModel.viewMode = 'woo!';
      const actual = () => {
        target.buildAggregationUri(fixtureStore);
      };
      expect(actual).toThrow('V2 does not currently support woo!');
    });
  });

  describe('buildAlmanacUri', () => {
    let expectedQS;
    beforeEach(() => {
      fixtureStore.almanac.almanacId = 123;
      fixtureStore.almanac.almanacLevel = 'foobar';
      fixtureStore.geo.geographicLevel = 'lev';

      expectedQS =
        '?almanacLevel=foobar&census_year=2021' +
        '&date_received_max=2018-01-01&date_received_min=2011-07-21' +
        '&field=all&frm=0&index_name=complaint-crdb' +
        '&size=10&sort=relevance_desc';
    });

    it('builds uri', () => {
      const actual = target.buildAlmanacUri(fixtureStore);
      expect(actual).toEqual('/api/v2/geo/almanac/lev/123' + expectedQS);
    });
  });

  describe('buildHistoryUri', () => {
    it('builds default uri', () => {
      const actual = target.buildHistoryUri(fixtureStore);
      expect(actual).toEqual('/saved-searches?limit=100');
    });

    it('builds default uri - invalid tab', () => {
      const actual = target.buildHistoryUri(fixtureStore, 'foo');
      expect(actual).toEqual('/saved-searches?limit=100');
    });

    it('builds search history uri for complaints', () => {
      fixtureStore.query._index = constants.INDEX_CRDB;
      const actual = target.buildHistoryUri(fixtureStore, 'searches');
      expect(actual).toEqual(
        '/search-history?index_name=complaint-crdb&limit=100',
      );
    });

    it('builds search history uri for stories', () => {
      fixtureStore.query._index = constants.INDEX_TYS;
      const actual = target.buildHistoryUri(fixtureStore, 'searches');
      expect(actual).toEqual(
        '/search-history?index_name=complaint-tys&limit=100',
      );
    });

    it('builds search history uri for attachments', () => {
      fixtureStore.query._index = constants.INDEX_ATTACHMENT;
      const actual = target.buildHistoryUri(fixtureStore, 'searches');
      expect(actual).toEqual(
        '/search-history?index_name=complaint-crdb-attachment&limit=100',
      );
    });

    it('builds exports uri', () => {
      const actual = target.buildHistoryUri(fixtureStore, 'exports');
      expect(actual).toEqual(
        '/export-history?index_name=complaint-crdb&limit=100',
      );
    });
  });

  describe('buildUri', () => {
    it('accepts an arbitrary path', () => {
      const path = '/foo';
      const actual = target.buildUri(fixtureStore, path);
      expect(actual.substring(0, path.length)).toEqual(path);
    });

    it('does not support unknown modes', () => {
      fixtureStore.viewModel.viewMode = 'woo!';
      const actual = () => {
        target.buildUri(fixtureStore);
      };
      expect(actual).toThrow('V2 does not currently support woo!');
    });

    it('works in map mode', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_GEO;

      const path = '/q/map';
      const actual = target.buildUri(fixtureStore, path);
      expect(actual).toEqual(
        '/q/map?census_year=2021&centroidsEnabled=true' +
          '&date_received_max=2018-01-01&date_received_min=2011-07-21' +
          '&field=all&frm=0&geoShading=Complaints%20per%201000%20pop.' +
          '&geographicLevel=State' +
          '&index_name=complaint-crdb' +
          '&lat=36.935&lng=-95.45&no_aggs=true&size=10' +
          '&sort=relevance_desc&zoom=4',
      );
    });

    it('works in trends mode', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_TRENDS;

      const path = '/q/trends';
      const actual = target.buildUri(fixtureStore, path);
      expect(actual).toEqual(
        '/q/trends?census_year=2021&date_received_max=2018-01-01' +
          '&date_received_min=2011-07-21&field=all&frm=0' +
          '&index_name=complaint-crdb' +
          '&lens=overview&no_aggs=true&size=10&sort=relevance_desc' +
          '&trend_depth=10&trend_interval=month',
      );
    });

    it('works in compare mode', () => {
      fixtureStore.viewModel.viewMode = constants.MODE_COMPARE;

      const path = '/q/compare';
      const actual = target.buildUri(fixtureStore, path);
      expect(actual).toEqual(
        '/q/compare?census_year=2021&compareItem=' +
          '&date_received_max=2018-01-01&date_received_min=2011-07-21' +
          '&field=all&frm=0' +
          '&index_name=complaint-crdb&lens=sent_to' +
          '&no_aggs=true&selectedCompareType=narrow&size=10' +
          '&sort=relevance_desc&trend_interval=month',
      );
    });
  });

  describe('genDocumentHref', () => {
    it('creates urls for documents in with correct indexPath', () => {
      const actual = target.genDocumentHref('complaints', '867-5309');
      expect(actual).toContain('complaints/document?id=867-5309');
    });
  });

  describe('genHistoryHref', () => {
    test('When tab is provided then generate history url for that tab', () => {
      const expectedHref = '/complaints/history/exports';
      const actualHref = genHistoryHref(
        'complaints',
        constants.HistoryTabs.Exports,
      );
      expect(actualHref).toEqual(expect.stringContaining(expectedHref));
    });

    test('When tab is NOT provided then generate history url for that saved searches', () => {
      const expectedHref = '/complaints/history/saved-searches';
      const actualHref = genHistoryHref('complaints');
      expect(actualHref).toEqual(expect.stringContaining(expectedHref));
    });
  });
});
