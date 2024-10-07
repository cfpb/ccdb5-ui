import { createStore } from 'redux';
import actionsReducer from '../reducers/actions/actions';
import aggregationsReducer from '../reducers/aggs/aggs';
import detailReducer from '../reducers/detail/detail';
import mapReducer from '../reducers/map/map';
import queryReducer from '../reducers/query/query';
import resultsReducer from '../reducers/results/results';
import trendsReducer from '../reducers/trends/trends';
import viewModelReducer from '../reducers/view/view';
import { applyMiddleware, combineReducers } from '@reduxjs/toolkit';
import actionLogger from '../middleware/actionLogger/actionLogger';
import cloneDeep from 'lodash/cloneDeep';
import emptyStore from '../actions/__fixtures__/emptyStore';

/**
 *
 *  Initial empty store for use to set up redux states. Use this to override settings
 *
 * @returns {object} complete empty redux store
 */
function initialState() {
  return cloneDeep(emptyStore);
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
    aggs: aggregationsReducer,
    detail: detailReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
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
