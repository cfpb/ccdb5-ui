/* eslint-disable camelcase */

import cloneDeep from 'lodash/cloneDeep';
import * as constants from '.././../constants';
import emptyStore from '../../../actions/__fixtures__/emptyStore';
import * as sut from './url';

describe('api.v2.url', () => {
  let fixtureStore;
  beforeEach(() => {
    fixtureStore = cloneDeep(emptyStore);
    fixtureStore.query.dateRange.from = '2011-07-21';
    fixtureStore.query.dateRange.to = '2018-01-01';
    fixtureStore.view.tab = constants.MODE_LIST;
  });

  describe('buildAggregationUri', () => {
    let expectedQS;
    beforeEach(() => {
      expectedQS =
        '?census_year=2021&date_received_max=2018-01-01' +
        '&date_received_min=2011-07-21&field=all' +
        '&index_name=complaint-crdb&size=0';
    });

    it('supports MODE_MAP', () => {
      fixtureStore.view.tab = constants.MODE_MAP;
      const actual = sut.buildAggregationUri(fixtureStore);
      expect(actual).toEqual('/api/v2/complaints' + expectedQS);
    });
  });

  describe('buildUri', () => {
    it('accepts an arbitrary path', () => {
      const path = '/foo';
      const actual = sut.buildUri(fixtureStore, path);
      expect(actual.substring(0, path.length)).toEqual(path);
    });

    it('does not support unknown modes', () => {
      fixtureStore.view.tab = 'woo!';
      const actual = () => {
        sut.buildUri(fixtureStore);
      };
      expect(actual).toThrow('V2 does not currently support woo!');
    });

    it('works in map mode', () => {
      fixtureStore.view.tab = constants.MODE_MAP;

      const path = '/q/map';
      const actual = sut.buildUri(fixtureStore, path);
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
      fixtureStore.view.tab = constants.MODE_TRENDS;

      const path = '/q/trends';
      const actual = sut.buildUri(fixtureStore, path);
      expect(actual).toEqual(
        '/q/trends?census_year=2021&date_received_max=2018-01-01' +
          '&date_received_min=2011-07-21&field=all&frm=0' +
          '&index_name=complaint-crdb' +
          '&lens=overview&no_aggs=true&size=10&sort=relevance_desc' +
          '&trend_depth=10&trend_interval=month',
      );
    });
  });

  describe('genDocumentHref', () => {
    it('creates urls for documents in with correct indexPath', () => {
      const actual = sut.genDocumentHref('complaints', '867-5309');
      expect(actual).toContain('complaints/document?id=867-5309');
    });
  });
});
