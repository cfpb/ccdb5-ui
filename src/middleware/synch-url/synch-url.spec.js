import * as routesActions from '../../reducers/routes/routes-slice';
import routesReducer from '../../reducers/routes/routes-slice';
import emptyStore from '../../actions/__fixtures__/empty-store';
import synchUrl from './synch-url';
import { createStore } from 'redux';
import { applyMiddleware, combineReducers } from '@reduxjs/toolkit';
import filtersReducer, {
  filtersReplaced,
} from '../../reducers/filters/filters-slice';
import actionsReducer from '../../reducers/actions/actions-slice';
import queryReducer from '../../reducers/query/query-slice';
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
    view: viewModelReducer,
  });
  return createStore(rootReducer, targetState, applyMiddleware(synchUrl));
}

describe('redux middleware::synchUrl', () => {
  let store, rSpy, targetState;
  beforeEach(() => {
    rSpy = rs.spyOn(routesActions, 'appUrlChanged');
    targetState = structuredClone(emptyStore);
    targetState.query.dateLastIndexed = '2021-05-05';
    targetState.query.date_received_min = '09-12-1980';
    targetState.query.date_received_max = '09-20-2000';
    targetState.routes.queryString =
      'date_received_max=09-20-2000&date_received_min=09-12-1980&page=1&searchField=all&size=25&sort=created_date_desc';
  });

  afterEach(() => {
    rSpy.mockRestore();
  });

  it('dispatches appUrlChanged if any params change', () => {
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
    });
  });
});
