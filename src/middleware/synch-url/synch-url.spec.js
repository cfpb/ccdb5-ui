import * as routesActions from '../../reducers/routes/routes-slice';
import routesReducer from '../../reducers/routes/routes-slice';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';
import emptyStore from '../../actions/__fixtures__/empty-store';
import synchUrl from './synch-url';
import { createStore } from 'redux';
import { applyMiddleware, combineReducers } from '@reduxjs/toolkit';
import filtersReducer, {
  filtersReplaced,
} from '../../reducers/filters/filters-slice';
import actionsReducer from '../../reducers/actions/actions-slice';
import queryReducer from '../../reducers/query/query-slice';
import trendsReducer from '../../reducers/trends/trends-slice';
import viewModelReducer from '../../reducers/view/view-slice';

/**
 *
 * @param {object} targetState - A mocked state to pass in to set up Redux.
 * @returns {object} A mocked store for testing purposes.
 */
function setupStore(targetState) {
  const rootReducer = combineReducers({
    actions: actionsReducer,
    filters: filtersReducer,
    query: queryReducer,
    routes: routesReducer,
    trends: trendsReducer,
    view: viewModelReducer,
  });
  return createStore(rootReducer, targetState, applyMiddleware(synchUrl));
}

describe('redux middleware::synchUrl', () => {
  let store, rSpy, targetState;
  beforeEach(() => {
    rSpy = jest.spyOn(routesActions, 'appUrlChanged');
    targetState = structuredClone(emptyStore);
    targetState.query.dateLastIndexed = '2021-05-05';
    targetState.query.date_received_min = '09-12-1980';
    targetState.query.date_received_max = '09-20-2000';
    targetState.view.tab = MODE_LIST;
    targetState.routes.queryString =
      '=3y&date_received_max=09-20-2000&date_received_min=09-12-1980&page=1&searchField=all&size=25&sort=created_date_desc&tab=List';
  });

  afterEach(() => {
    rSpy.mockRestore();
  });

  it('List view dispatches appUrlChanged if any params changes', () => {
    targetState.query.search_after = '2314324_1233';
    store = setupStore(targetState);
    store.dispatch(filtersReplaced('product', ['foo', 'bar']));
    expect(rSpy).toHaveBeenCalledWith('/', {
      date_received_max: '09-20-2000',
      date_received_min: '09-12-1980',
      page: 1,
      product: ['foo', 'bar'],
      searchField: 'all',
      search_after: '2314324_1233',
      size: 25,
      sort: 'created_date_desc',
      tab: 'List',
    });
  });

  it('Trends view dispatches appUrlChanged if any params changes', () => {
    targetState.view.tab = MODE_TRENDS;
    store = setupStore(targetState);
    store.dispatch(filtersReplaced('product', ['foo', 'bar']));
    expect(rSpy).toHaveBeenCalledWith('/', {
      chartType: 'line',
      dateInterval: 'Month',
      date_received_max: '09-20-2000',
      date_received_min: '09-12-1980',
      lens: 'Product',
      product: ['foo', 'bar'],
      searchField: 'all',
      subLens: 'sub_product',
      tab: 'Trends',
    });
  });

  it('Map view dispatches appUrlChanged if any params changes', () => {
    targetState.view.tab = MODE_MAP;
    store = setupStore(targetState);
    store.dispatch(filtersReplaced('product', ['foo', 'bar']));
    expect(rSpy).toHaveBeenCalledWith('/', {
      date_received_max: '09-20-2000',
      date_received_min: '09-12-1980',
      product: ['foo', 'bar'],
      searchField: 'all',
      tab: 'Map',
    });
  });
});
