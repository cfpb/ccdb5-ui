import * as routesActions from '../../reducers/routes/routesSlice';
import {
  MODE_COMPARE,
  MODE_GEO,
  MODE_LIST_COMPLAINTS,
  MODE_TRENDS,
  PERSIST_NONE,
  PERSIST_SAVE,
} from '../../constants';
import configureMockStore from 'redux-mock-store';
import cloneDeep from 'lodash/cloneDeep';
import emptyStore from '../../actions/__fixtures__/emptyStore';
import synchUrl from './synchUrl';
import thunk from 'redux-thunk';

/**
 *
 * @param {object} targetState - A mocked state to pass in to set up Redux.
 * @returns {object} A mocked store for testing purposes.
 */
function setupStore(targetState) {
  const middlewares = [thunk, synchUrl];
  const mockStore = configureMockStore(middlewares);
  return mockStore(targetState);
}

describe('redux middleware::synchUrl', () => {
  let store, rSpy, action, targetState;
  beforeEach(() => {
    rSpy = jest.spyOn(routesActions, 'appUrlChanged');
    targetState = cloneDeep(emptyStore);
    targetState.query.dateRange = {
      from: '09-12-1980',
      to: '09-20-2000',
    };
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
    it('ignores unmanaged paths', () => {
      const unmanagedPaths = ['/', '/dataguide'];

      unmanagedPaths.forEach((p) => {
        targetState.viewModel.viewMode = MODE_LIST_COMPLAINTS;
        targetState.viewModel.routePath = p;
        store = setupStore(targetState);
        store.dispatch(action);
        expect(rSpy).not.toHaveBeenCalled();
      });
    });

    it('queries if an action has PERSIST_SAVE', () => {
      targetState.viewModel.viewMode = MODE_LIST_COMPLAINTS;
      targetState.viewModel.routePath = '/complaints/q';
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/complaints/q', {
        censusYear: '2019',
        fields: 'All Data',
        date_from: '09-12-1980',
        date_to: '09-20-2000',
        page: 1,
        size: 10,
        sort: 'Most relevant',
      });
    });
  });

  describe('compare', () => {
    it('queries if an action has PERSIST_SAVE', () => {
      targetState.viewModel.viewMode = MODE_COMPARE;
      targetState.viewModel.routePath = '/complaints/q/compare';
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/complaints/q/compare', {
        censusYear: '2019',
        interval: 'Month',
        date_from: '09-12-1980',
        date_to: '09-20-2000',
        fields: 'All Data',
        page: 1,
        selectedCompareType: 'Narrow',
        size: 10,
        sort: 'Most relevant',
      });
    });
  });

  describe('geo', () => {
    it('queries if an action has PERSIST_SAVE', () => {
      targetState.viewModel.routePath = '/complaints/q/map';
      targetState.geo.boundingBox = {
        north: 54,
        south: 20,
        west: -130,
        east: -62,
      };
      targetState.viewModel.viewMode = MODE_GEO;

      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/complaints/q/map', {
        censusYear: '2019',
        centroidsEnabled: true,
        dataNormalization: 'None',
        date_from: '09-12-1980',
        date_to: '09-20-2000',
        east: '-62',
        fields: 'All Data',
        geoShading: 'Complaints per 1000 pop.',
        geographicLevel: 'State',
        lat: '36.935',
        lng: '-95.45',
        mapType: 'leaflet',
        north: '54',
        page: 1,
        size: 10,
        sort: 'Most relevant',
        south: '20',
        west: '-130',
        zoom: '4',
      });
    });
  });

  describe('trends', () => {
    it('queries if an action has PERSIST_SAVE', () => {
      targetState.viewModel.viewMode = MODE_TRENDS;
      targetState.viewModel.interval = 'Month';
      targetState.viewModel.viewMode = MODE_TRENDS;
      targetState.viewModel.routePath = '/complaints/q/trends';
      store = setupStore(targetState);
      store.dispatch(action);
      expect(rSpy).toHaveBeenCalledWith('/complaints/q/trends', {
        censusYear: '2019',
        chartType: 'line',
        date_from: '09-12-1980',
        date_to: '09-20-2000',
        interval: 'Month',
        fields: 'All Data',
        lens: 'Overview',
        page: 1,
        size: 10,
        sort: 'Most relevant',
        trend_depth: 10,
      });
    });
  });
});
