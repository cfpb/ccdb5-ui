import {
  MODE_LIST,
  REQUERY_ALWAYS,
  REQUERY_HITS_ONLY,
  REQUERY_NEVER,
} from '../constants';
import { initialState, setupStore } from '../testUtils/setupStore';
import queryManager from './queryManager';
import { AGGREGATIONS_API_CALLED, COMPLAINTS_API_CALLED } from '../actions';

describe('redux middleware::queryManager', () => {
  let targetStore;
  beforeEach(() => {
    targetStore = initialState();
    targetStore.query.date_received_max = '2018-01-01';
    targetStore.query.tab = MODE_LIST;
  });

  describe('REQUERY_NEVER', () => {
    it('does not query if an action has no metadata', () => {
      const store = setupStore(targetStore, queryManager);
      const action = {
        type: 'FakeAction',
      };
      store.dispatch(action);
      const { actions } = store.getState().actions;
      expect(actions).toEqual([action]);
    });

    it('does not query if an action has REQUERY_NEVER', () => {
      const store = setupStore(targetStore, queryManager);
      const action = {
        type: 'FakeAction',
        meta: { requery: REQUERY_NEVER },
      };
      store.dispatch(action);
      const { actions } = store.getState().actions;
      expect(actions).toEqual([action]);
    });
  });

  describe('REQUERY_ALWAYS', () => {
    it('runs both left and right queries', async () => {
      const store = setupStore(targetStore, queryManager);
      const action = {
        type: 'FakeAction',
        requery: REQUERY_ALWAYS,
      };
      store.dispatch(action);
      const { actions } = store.getState().actions;
      const actionNames = actions.map((item) => item.type);
      expect(actionNames).toEqual([
        action.type,
        AGGREGATIONS_API_CALLED,
        COMPLAINTS_API_CALLED,
      ]);
    });
  });

  describe('REQUERY_HITS_ONLY', () => {
    it('only runs right hand queries', () => {
      const store = setupStore(targetStore, queryManager);
      const action = {
        type: 'FakeAction',
        requery: REQUERY_HITS_ONLY,
      };

      store.dispatch(action);
      const { actions } = store.getState().actions;
      const actionNames = actions.map((item) => item.type);
      expect(actionNames).toEqual([action.type, COMPLAINTS_API_CALLED]);
    });
  });
});
