import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { queryManager } from '../queryManager';
import { REQUERY_ALWAYS, REQUERY_HITS_ONLY } from '../../constants';

/**
 *
 * @param {string} viewMode - The current view mode
 * @returns {void}
 */
function setupStore(viewMode) {
  const middlewares = [thunk, queryManager];
  const mockStore = configureMockStore(middlewares);
  return mockStore({
    aggs: {
      activeCall: '',
    },
    map: {
      activeCall: '',
    },
    query: {
      date_received_min: new Date(2013, 1, 3),
      from: 0,
      has_narrative: true,
      queryString: '?foo',
      searchText: '',
      size: 10,
      tab: viewMode,
    },
    results: {
      activeCall: '',
    },
  });
}

describe('redux middleware::queryManager', () => {
  describe('compound actions', () => {
    let store;

    describe('Unknown Mode', () => {
      beforeEach(() => {
        store = setupStore('bogus');
      });

      it('REQUERY_ALWAYS runs no queries', () => {
        const action = {
          type: 'FakeAction',
          meta: { requery: REQUERY_ALWAYS },
        };
        const expectedActions = [
          { type: 'FakeAction', meta: { requery: REQUERY_ALWAYS } },
        ];

        store.dispatch(action);
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('REQUERY_HITS_ONLY runs no queries', () => {
        const action = {
          type: 'FakeAction',
          meta: { requery: REQUERY_HITS_ONLY },
        };
        const expectedActions = [
          { type: 'FakeAction', meta: { requery: REQUERY_HITS_ONLY } },
        ];

        store.dispatch(action);
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('List Mode', () => {
      beforeEach(() => {
        store = setupStore('List');
      });
      it('does not query if an action has no metadata', () => {
        const action = {
          type: 'FakeAction',
        };
        const expectedActions = [{ type: 'FakeAction' }];
        store.dispatch(action);
        expect(store.getActions()).toEqual(expectedActions);
      });

      describe('REQUERY_ALWAYS', () => {
        it('runs both left and right queries', () => {
          const action = {
            type: 'FakeAction',
            meta: { requery: REQUERY_ALWAYS },
          };
          const expectedActions = [
            { type: 'FakeAction', meta: { requery: REQUERY_ALWAYS } },
            {
              type: 'aggs/aggregationsCallInProcess',
              payload: '@@API?foo&size=0',
            },
            { type: 'results/hitsCallInProcess', payload: '@@API?foo' },
          ];
          store.dispatch(action);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      describe('REQUERY_HITS_ONLY', () => {
        it('only runs right hand queries', () => {
          const action = {
            type: 'FakeAction',
            meta: { requery: REQUERY_HITS_ONLY },
          };
          const expectedActions = [
            { type: 'FakeAction', meta: { requery: REQUERY_HITS_ONLY } },
            { type: 'results/hitsCallInProcess', payload: '@@API?foo' },
          ];
          store.dispatch(action);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe('Map Mode', () => {
      beforeEach(() => {
        store = setupStore('Map');
      });
      describe('REQUERY_ALWAYS', () => {
        it('runs both left and right queries', () => {
          const action = {
            type: 'FakeAction',
            meta: { requery: REQUERY_ALWAYS },
          };
          const expectedActions = [
            { type: 'FakeAction', meta: { requery: REQUERY_ALWAYS } },
            {
              type: 'aggs/aggregationsCallInProcess',
              payload: '@@API?foo&size=0',
            },
            {
              type: 'map/statesCallInProcess',
              payload: '@@APIgeo/states/?foo&no_aggs=true',
            },
          ];

          store.dispatch(action);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      describe('REQUERY_HITS_ONLY', () => {
        it('only runs right hand queries', () => {
          const action = {
            type: 'FakeAction',
            meta: {
              requery: REQUERY_HITS_ONLY,
            },
          };
          const expectedActions = [
            { type: 'FakeAction', meta: { requery: REQUERY_HITS_ONLY } },
            {
              type: 'map/statesCallInProcess',
              payload: '@@APIgeo/states/?foo&no_aggs=true',
            },
          ];

          store.dispatch(action);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
