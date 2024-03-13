import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as sut from '../complaints';
import {
  complaintsApiCalled,
  complaintsApiFailed,
  complaintsReceived,
} from '../../reducers/results/resultsSlice';
import {
  statesApiCalled,
  statesApiFailed,
  statesReceived,
} from '../../reducers/map/mapSlice';
import {
  trendsApiCalled,
  trendsApiFailed,
  trendsReceived,
} from '../../reducers/trends/trendsSlice';
import {
  aggregationsApiCalled,
  aggregationsApiFailed,
  aggregationsReceived,
} from '../../reducers/aggs/aggsSlice';
import {
  complaintDetailCalled,
  complaintDetailFailed,
  complaintDetailReceived,
} from '../../reducers/detail/detailSlice';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

/**
 *
 * @param {string} tab - Trends, List, Map view we are testing
 * @returns {object} mocked redux store
 */
function setupStore(tab) {
  return mockStore({
    aggs: { activeCall: '' },
    map: { activeCall: '' },
    query: {
      tab,
    },
    trends: {
      activeCall: '',
    },
    results: {
      activeCall: '',
    },
  });
}

describe('action::complaints', () => {
  describe('sendHitsQuery', () => {
    it('calls the Complaints API', () => {
      const store = setupStore('List');
      store.dispatch(sut.sendHitsQuery());
      const expectedActions = [complaintsApiCalled('@@API?foobar')];

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('calls the Map API', () => {
      const store = setupStore('Map');
      store.dispatch(sut.sendHitsQuery());
      const expectedActions = [
        statesApiCalled('@@APIgeo/states/?foobar&no_aggs=true'),
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('calls the Trends API', () => {
      const store = setupStore('Trends');
      store.dispatch(sut.sendHitsQuery());
      const expectedActions = [
        trendsApiCalled('@@APItrends/?foobar&no_aggs=true'),
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('getAggregations', () => {
    let onSuccess, onFail, store;

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@API?foo&size=0');
        /* eslint-disable id-length */
        return {
          then: (x) => {
            x({ json: () => ({}) });
            return {
              then: (x) => {
                onSuccess = (data) => x(data);
                return {
                  catch: (y) => {
                    onFail = y;
                  },
                };
              },
            };
          },
        };
      });
      /* eslint-enable id-length */
      store = mockStore({
        aggs: {
          activeCall: '',
        },
        query: {
          date_received_min: new Date(2013, 1, 3),
          from: 0,
          has_narrative: true,
          searchText: '',
          size: 10,
        },
        results: {
          activeCall: '',
        },
      });
    });

    it('calls the API', () => {
      store.dispatch(sut.getAggregations());
      expect(global.fetch).toHaveBeenCalled();
    });

    it('discards duplicate API calls', () => {
      const state = store.getState();
      state.aggs.activeCall = '/?foo=baz';
      store = mockStore(state);

      store.dispatch(sut.getAggregations());
      expect(global.fetch).not.toHaveBeenCalled();
    });

    describe('when the API call is finished', () => {
      it('sends a simple action when data is received', () => {
        store.dispatch(sut.getAggregations());
        const expectedActions = [
          aggregationsApiCalled('@@API?foo&size=0'),
          aggregationsReceived(['123']),
        ];
        onSuccess(['123']);
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('sends a different simple action when an error occurs', () => {
        store.dispatch(sut.getAggregations());
        const expectedActions = [
          aggregationsApiCalled('@@API?foo&size=0'),
          aggregationsApiFailed({ error: 'oops' }),
        ];
        onFail({ error: 'oops' });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('getComplaints', () => {
    let onSuccess, onFail, store;

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@API?foo');
        /* eslint-disable id-length */
        return {
          then: (x) => {
            x({ json: () => ({}) });
            return {
              then: (x) => {
                onSuccess = (data) => x(data);
                return {
                  catch: (y) => {
                    onFail = y;
                  },
                };
              },
            };
          },
        };
      });
      /* eslint-enable id-length */
      store = mockStore({
        query: {
          date_received_min: new Date(2013, 1, 3),
          from: 0,
          has_narrative: true,
          searchText: '',
          size: 10,
        },
        results: {
          activeCall: '',
        },
      });
    });

    it('calls the API', () => {
      store.dispatch(sut.getComplaints());
      expect(global.fetch).toHaveBeenCalled();
    });

    it('discards duplicate API calls', () => {
      const state = store.getState();
      state.results.activeCall = '@@API' + state.query.queryString;
      store = mockStore(state);

      store.dispatch(sut.getComplaints());
      expect(global.fetch).not.toHaveBeenCalled();
    });

    describe('when the API call is finished', () => {
      it('sends a simple action when data is received', () => {
        store.dispatch(sut.getComplaints());
        const expectedActions = [
          complaintsApiCalled('@@API?foo'),
          complaintsReceived(['123']),
        ];
        onSuccess(['123']);
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('sends a different simple action when an error occurs', () => {
        store.dispatch(sut.getComplaints());
        const expectedActions = [
          complaintsApiCalled('@@API?foo'),
          complaintsApiFailed({ error: 'oops' }),
        ];
        onFail({ error: 'oops' });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('getComplaintDetail', () => {
    let onSuccess, onFail;

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@API123');
        /* eslint-disable id-length */
        return {
          then: (x) => {
            x({ json: () => ({}) });
            return {
              then: (x) => {
                onSuccess = (data) => x(data);
                return {
                  catch: (y) => {
                    onFail = y;
                  },
                };
              },
            };
          },
        };
      });
    });
    /* eslint-enable id-length */
    it('calls the API', () => {
      const store = mockStore({});
      store.dispatch(sut.getComplaintDetail('123'));
      expect(global.fetch).toHaveBeenCalled();
    });

    describe('when the API call is finished', () => {
      let store;
      beforeEach(() => {
        store = mockStore({});
        store.dispatch(sut.getComplaintDetail('123'));
      });

      it('sends a simple action when data is received', () => {
        const expectedActions = [
          complaintDetailCalled('@@API123'),
          complaintDetailReceived({ foo: 'bar' }),
        ];
        onSuccess({ foo: 'bar' });
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('sends a different simple action when an error occurs', () => {
        const expectedActions = [
          complaintDetailCalled('@@API123'),
          complaintDetailFailed({ error: 'oops' }),
        ];
        onFail({ error: 'oops' });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('getStates', () => {
    let onSuccess, onFail, store;

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@APIgeo/states/?foo&no_aggs=true');
        /* eslint-disable id-length */
        return {
          then: (x) => {
            x({ json: () => ({}) });
            return {
              then: (x) => {
                onSuccess = (data) => x(data);
                return {
                  catch: (y) => {
                    onFail = y;
                  },
                };
              },
            };
          },
        };
      });
      /* eslint-enable id-length */
      store = mockStore({
        query: {
          date_received_min: new Date(2013, 1, 3),
          from: 0,
          has_narrative: true,
          queryString: '?foo',
          searchText: '',
          size: 10,
        },
        map: {
          activeCall: '',
        },
      });
    });

    it('calls the API', () => {
      store.dispatch(sut.getStates());
      expect(global.fetch).toHaveBeenCalled();
    });

    it('discards duplicate API calls', () => {
      const state = store.getState();
      state.map.activeCall =
        '@@APIgeo/states/' + state.query.queryString + '&no_aggs=true';
      store = mockStore(state);

      store.dispatch(sut.getStates());
      expect(global.fetch).not.toHaveBeenCalled();
    });

    describe('when the API call is finished', () => {
      it('sends a simple action when data is received', () => {
        store.dispatch(sut.getStates());
        const expectedActions = [
          statesApiCalled('@@APIgeo/states/?foo&no_aggs=true'),
          statesReceived({ data: ['123'] }),
        ];
        onSuccess({ data: ['123'] });
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('sends a different simple action when an error occurs', () => {
        store.dispatch(sut.getStates());
        const expectedActions = [
          statesApiCalled('@@APIgeo/states/?foo&no_aggs=true'),
          statesApiFailed({ error: 'oops' }),
        ];
        onFail({ error: 'oops' });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('getTrends', () => {
    let onSuccess, onFail, store;

    /**
     *
     * @param {Array} company - The companies we are viewing trends for
     * @param {string} lens - Aggregate by selected in trends
     * @returns {object} mocked redux store
     */
    function setupStore(company, lens) {
      const mockState = {
        query: {
          company,
          date_received_min: new Date(2013, 1, 3),
          from: 0,
          has_narrative: true,
          queryString: '?foo',
          searchText: '',
          size: 10,
        },
        trends: {
          activeCall: '',
          lens,
        },
      };
      return mockStore(mockState);
    }

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@APItrends/?foo&no_aggs=true');
        /* eslint-disable id-length */
        return {
          then: (x) => {
            x({ json: () => ({}) });
            return {
              then: (x) => {
                onSuccess = (data) => x(data);
                return {
                  catch: (y) => {
                    onFail = y;
                  },
                };
              },
            };
          },
        };
      });
    });
    /* eslint-enable id-length */
    it('calls the API', () => {
      store = setupStore();
      store.dispatch(sut.getTrends());
      expect(global.fetch).toHaveBeenCalled();
    });

    it('discards invalid API calls', () => {
      store = setupStore([], 'Company');
      const state = store.getState();
      store = mockStore(state);

      store.dispatch(sut.getTrends());
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('discards duplicate API calls', () => {
      store = setupStore();
      const state = store.getState();
      state.trends.activeCall =
        '@@APItrends/' + state.query.queryString + '&no_aggs=true';
      store = mockStore(state);

      store.dispatch(sut.getTrends());
      expect(global.fetch).not.toHaveBeenCalled();
    });

    describe('when the API call is finished', () => {
      it('sends a simple action when data is received', () => {
        store = setupStore();
        store.dispatch(sut.getTrends());
        const expectedActions = [
          trendsApiCalled('@@APItrends/?foo&no_aggs=true'),
          trendsReceived({ data: ['123'] }),
        ];
        onSuccess({ data: ['123'] });
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('sends a different simple action when an error occurs', () => {
        store = setupStore();
        store.dispatch(sut.getTrends());
        const expectedActions = [
          trendsApiCalled('@@APItrends/?foo&no_aggs=true'),
          trendsApiFailed({ name: 'bad', error: 'oops' }),
        ];
        onFail({ name: 'bad', error: 'oops' });
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
