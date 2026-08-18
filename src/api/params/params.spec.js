import emptyStore from '../../actions/__fixtures__/empty-store';
import * as sut from './params';

describe('api.v2.params', () => {
  let fixtureStore, actual;
  beforeEach(() => {
    fixtureStore = structuredClone(emptyStore);
    fixtureStore.query.date_received_min = '2011-07-21';
    fixtureStore.query.date_received_max = '2018-01-01';
  });

  describe('extractAggregationParams', () => {
    it('handles missing dates', () => {
      actual = sut.extractAggregationParams(
        fixtureStore.filters,
        fixtureStore.query,
      );
      expect(actual).toEqual({
        date_received_min: '2011-07-21',
        date_received_max: '2018-01-01',
        field: 'all',
        size: 0,
      });
    });

    it('handles search text', () => {
      fixtureStore.query.searchText = 'savings / loan';
      actual = sut.extractAggregationParams(
        fixtureStore.filters,
        fixtureStore.query,
      );
      expect(actual).toEqual({
        date_received_max: '2018-01-01',
        date_received_min: '2011-07-21',
        field: 'all',
        search_term: 'savings / loan',
        size: 0,
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

  describe('parseParamsToQuery', () => {
    beforeEach(() => {
      fixtureStore.query.searchText = 'foo';
    });

    it('handles bogus searchFieldMap', () => {
      fixtureStore.query.searchField = 'Bogus value';
      const actual = sut.extractQueryParams(fixtureStore.query);
      expect(actual.field).toBe('all');
    });

    it('calculates frm from page and size when from is not given', () => {
      delete fixtureStore.query.from;
      fixtureStore.query.page = 0;
      fixtureStore.query.size = 10;
      const actual = sut.extractQueryParams(fixtureStore.query);
      expect(actual.frm).toBe(0);
    });

    it('assigns query.searchAfter to search_after', () => {
      fixtureStore.query.searchAfter = '1__12345';
      const actual = sut.extractQueryParams(fixtureStore.query);
      expect(actual.search_after).toBe('1__12345');
    });
  });
});
