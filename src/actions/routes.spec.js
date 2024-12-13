import * as sut from './index';
import { initialState, setupStore } from '../testUtils/setupStore';

describe('routes', () => {
  describe('changeRoute', () => {
    let appPath, fixtureStore;
    beforeEach(() => {
      fixtureStore = initialState();
      appPath = '/complaints/q';
    });

    it('does not send a message its the same route and params', () => {
      const params = { yoyo: 'hello' };
      fixtureStore.routes.path = appPath;
      fixtureStore.routes.params = params;

      const store = setupStore(fixtureStore);
      store.dispatch(sut.changeRoute(appPath, params));
      const { actions } = store.getState().actions;
      expect(actions).toEqual([]);
    });
    it('sends a ROUTE_CHANGED when there no props', () => {
      const params = {};
      const store = setupStore(fixtureStore);
      store.dispatch(sut.changeRoute(appPath, params));
      const { actions } = store.getState().actions;
      expect(actions).toEqual([sut.routeChanged(appPath, params)]);
    });
  });
  describe('normalizeRouteParams', () => {
    it('strips params not needed', () => {
      const params = {
        foo: 'bar',
        search_after: '11232432',
      };

      const actual = sut.normalizeRouteParams(params);
      expect(actual).toEqual({ foo: 'bar' });
    });
    it('makes sure number parameters are integers', () => {
      const params = {
        size: '50',
        page: '1',
      };

      const actual = sut.normalizeRouteParams(params);
      expect(actual).toEqual({ size: 50, page: 1 });
    });
  });
});
