import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { queryManager } from '../queryManager';
import { REQUERY_ALWAYS, REQUERY_HITS_ONLY } from '../../constants';

/**
 *
 * @param viewMode
 */
function setupStore(viewMode = 'Map') {
  const middlewares = [thunk, queryManager];
  const mockStore = configureMockStore(middlewares);
  return mockStore({
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
          requery: REQUERY_ALWAYS,
        };
        const expectedActions = [
          { type: 'FakeAction', requery: REQUERY_ALWAYS },
        ];

        store.dispatch(action);
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('REQUERY_HITS_ONLY runs no queries', () => {
        const action = {
          type: 'FakeAction',
          requery: REQUERY_HITS_ONLY,
        };
        const expectedActions = [
          { type: 'FakeAction', requery: REQUERY_HITS_ONLY },
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
            requery: REQUERY_ALWAYS,
          };
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_ALWAYS },
            { type: 'aggregationsCallInProcess', url: '@@API?foo&size=0' },
            { type: 'COMPLAINTS_API_CALLED', url: '@@API?foo' },
          ];

          store.dispatch(action);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      describe('REQUERY_HITS_ONLY', () => {
        it('only runs right hand queries', () => {
          const action = {
            type: 'FakeAction',
            requery: REQUERY_HITS_ONLY,
          };
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_HITS_ONLY },
            { type: 'COMPLAINTS_API_CALLED', url: '@@API?foo' },
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
            requery: REQUERY_ALWAYS,
          };
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_ALWAYS },
            { type: 'aggregationsCallInProcess', url: '@@API?foo&size=0' },
            {
              type: 'STATES_API_CALLED',
              url: '@@APIgeo/states/?foo&no_aggs=true',
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
            requery: REQUERY_HITS_ONLY,
          };
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_HITS_ONLY },
            {
              type: 'STATES_API_CALLED',
              url: '@@APIgeo/states/?foo&no_aggs=true',
            },
          ];

          store.dispatch(action);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});
