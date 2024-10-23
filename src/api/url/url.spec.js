/* eslint-disable camelcase */

import cloneDeep from 'lodash/cloneDeep';
import * as constants from '.././../constants';
import emptyStore from '../../actions/__fixtures__/emptyStore';
import * as sut from './url';

describe('api.v2.url', () => {
  let fixtureStore;
  beforeEach(() => {
    fixtureStore = cloneDeep(emptyStore);
    fixtureStore.query.date_received_min = '2011-07-21';
    fixtureStore.query.date_received_max = '2018-01-01';
    fixtureStore.view.tab = constants.MODE_LIST;
  });

  describe('buildAggregationUri', () => {
    let expectedQS;
    beforeEach(() => {
      expectedQS =
        '?date_received_max=2018-01-01&date_received_min=2011-07-21' +
        '&field=all&size=0';
    });

    it('supports MODE_MAP', () => {
      fixtureStore.view.tab = constants.MODE_MAP;
      const actual = sut.buildAggregationUri(fixtureStore);
      expect(actual).toEqual(expectedQS);
    });
  });

  describe('buildUri', () => {
    it('works in map mode', () => {
      fixtureStore.view.tab = constants.MODE_MAP;

      const actual = sut.buildUri(fixtureStore);
      expect(actual).toEqual(
        '?date_received_max=2018-01-01' +
          '&date_received_min=2011-07-21&field=all&frm=0&no_aggs=true' +
          '&size=25&sort=created_date_desc',
      );
    });

    it('works in trends mode', () => {
      fixtureStore.view.tab = constants.MODE_TRENDS;
      const actual = sut.buildUri(fixtureStore);
      expect(actual).toEqual(
        '?date_received_max=2018-01-01' +
          '&date_received_min=2011-07-21&field=all&frm=0&lens=product' +
          '&no_aggs=true&searchField=all&size=25&sort=created_date_desc' +
          '&sub_lens=sub_product&trend_depth=5&trend_interval=month',
      );
    });
  });
});
