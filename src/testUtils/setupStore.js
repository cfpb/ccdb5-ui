import { createStore } from 'redux';
import actionsReducer from '../reducers/actions/actionsSlice';
import aggregationsReducer from '../reducers/aggs/aggsSlice';
import detailReducer from '../reducers/detail/detailSlice';
import filtersReducer from '../reducers/filters/filtersSlice';
import mapReducer from '../reducers/map/mapSlice';
import queryReducer from '../reducers/query/querySlice';
import resultsReducer from '../reducers/results/resultsSlice';
import routesReducer from '../reducers/routes/routesSlice';
import trendsReducer from '../reducers/trends/trendsSlice';
import viewModelReducer from '../reducers/view/viewSlice';
import { applyMiddleware, combineReducers } from '@reduxjs/toolkit';
import actionLogger from '../middleware/actionLogger/actionLogger';
import cloneDeep from 'lodash/cloneDeep';
// import emptyStore from '../actions/__fixtures__/emptyStore';

/**
 *
 *  Initial empty store for use to set up redux states. Use this to override settings
 *
 * @returns {object} complete empty redux store
 */
function initialState() {
  return cloneDeep({});
}

/**
 * Test utility to set up a redux store. Used to test and validate redux actions
 * this deprecates redux-mock-store
 *
 * @param {object} [targetState] - any overrides of default state we want
 * @param {object | Array } [additionalMiddlewares] - can be a single or array of middlewares to add
 * @returns {object} A mocked store for testing purposes.
 */
function setupStore(targetState, additionalMiddlewares) {
  const preloadedState = targetState ? targetState : initialState();
  const rootReducer = combineReducers({
    actions: actionsReducer,
    aggregations: aggregationsReducer,
    detail: detailReducer,
    filters: filtersReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
    routes: routesReducer,
    trends: trendsReducer,

    view: viewModelReducer,
  });
  // this is in case we pass in only a single value
  const middlewares = additionalMiddlewares
    ? [actionLogger].concat(additionalMiddlewares)
    : [actionLogger];
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares),
  );
}

export { initialState, setupStore };
