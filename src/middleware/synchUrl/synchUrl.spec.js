import * as routesActions from '../../reducers/routes/routesSlice';
import {
  MODE_MAP,
  MODE_LIST,
  PERSIST_NONE,
  PERSIST_SAVE,
  MODE_TRENDS,
} from '../../constants';
import cloneDeep from 'lodash/cloneDeep';
import emptyStore from '../../actions/__fixtures__/emptyStore';
import synchUrl from './synchUrl';
import { createStore } from 'redux';
import { applyMiddleware } from '@reduxjs/toolkit';
import rootReducer from '../../reducers/query/querySlice';

/**
 *
 * @param {object} targetState - A mocked state to pass in to set up Redux.
 * @returns {object} A mocked store for testing purposes.
 */
function setupStore(targetState) {
  return createStore(rootReducer, targetState, applyMiddleware(synchUrl));
}

describe('redux middleware::synchUrl', () => {
  let store, rSpy, action, targetState;
  beforeEach(() => {
    rSpy = jest.spyOn(routesActions, 'appUrlChanged');
    targetState = cloneDeep(emptyStore);
    targetState.query.date_received_min = '09-12-1980';
    targetState.query.date_received_max = '09-20-2000';

    action = {
      type: 'FakeAction',
      meta: { persist: PERSIST_SAVE },
    };
  });

  afterEach(() => {
    rSpy.mockRestore();
  });

  describe('PERSIST_NONE', () => {
    it('does not query if an action has no metadata', () => {
      action = {
        type: 'FakeAction',
      };
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).not.toHaveBeenCalled();
    });

    it('does not query if an action has PERSIST_NONE', () => {
      action = {
        type: 'FakeAction',
        meta: { persist: PERSIST_NONE },
      };
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).not.toHaveBeenCalled();
    });
  });

  describe('complaints', () => {
    it('queries if an action has PERSIST_SAVE', () => {
      targetState.view.tab = MODE_LIST;
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/', {
        date_received_max: '09-20-2000',
        date_received_min: '09-12-1980',
        dateRange: '3y',
        page: 1,
        searchField: 'all',
        size: 25,
        sort: 'created_date_desc',
        tab: 'List',
      });
    });
  });

  describe('map', () => {
    it('queries if an action has PERSIST_SAVE', () => {
      targetState.view.tab = MODE_MAP;

      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/', {
        dataNormalization: 'None',
        dateRange: '3y',
        date_received_min: '09-12-1980',
        date_received_max: '09-20-2000',
        mapWarningEnabled: true,
        searchField: 'all',
        tab: 'Map',
      });
    });
  });
  describe('trends', () => {
    it('queries if an action has PERSIST_SAVE', () => {
      targetState.query.dateInterval = 'Month';
      targetState.view.tab = MODE_TRENDS;
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/', {
        chartType: 'line',
        date_received_min: '09-12-1980',
        date_received_max: '09-20-2000',
        dateInterval: 'Month',
        dateRange: '3y',
        lens: 'Product',
        searchField: 'all',
        subLens: 'sub_product',
        tab: 'Trends',
      });
    });
  });
});
