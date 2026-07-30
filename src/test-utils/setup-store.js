import { createStore } from 'redux';
import actionsReducer from '../reducers/actions/actions-slice';
import filtersReducer from '../reducers/filters/filters-slice';
import queryReducer from '../reducers/query/query-slice';
import routesReducer from '../reducers/routes/routes-slice';
import trendsReducer from '../reducers/trends/trends-slice';
import viewModelReducer from '../reducers/view/view-slice';
import { applyMiddleware, combineReducers } from '@reduxjs/toolkit';
import { actionLogger } from '../middleware/action-logger/action-logger';
import emptyStore from '../actions/__fixtures__/empty-store';

/**
 *
 *  Initial empty store for use to set up redux states. Use this to override settings
 *
 * @returns {object} complete empty redux store
 */
function initialState() {
  return structuredClone(emptyStore);
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
    filters: filtersReducer,
    query: queryReducer,
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
