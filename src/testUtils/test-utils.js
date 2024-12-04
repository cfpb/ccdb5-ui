import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import actions from '../reducers/actions/actionsSlice';
import filters from '../reducers/filters/filtersSlice';
import query from '../reducers/query/querySlice';
import routes from '../reducers/routes/routesSlice';
import trends from '../reducers/trends/trendsSlice';
import view from '../reducers/view/viewSlice';
import { complaintsApi } from '../api/complaints';

/**
 *
 * @param {object} preloadedState - The initial component state
 * @returns {object} Redux store we are mocking
 */
export function configureStoreUtil(preloadedState) {
  return configureStore({
    reducer: {
      [complaintsApi.reducerPath]: complaintsApi.reducer,
      actions,
      filters,
      query,
      routes,
      trends,
      view,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(complaintsApi.middleware),
    preloadedState,
  });
}

/**
 *
 * @param {object} ui - React component we are passing in
 * @param {object} root0 - React component
 * @param {object} root0.preloadedState - The initial component state
 * @param {object} root0.store - Redux store we are mocking
 * @returns {object} React jsx components
 */
function testRender(
  ui,
  {
    preloadedState,
    store = configureStoreUtil(preloadedState),
    ...renderOptions
  } = {},
) {
  /**
   *
   * @param {object} root0 - React component
   * @param {object} root0.children - React child components
   * @returns {object} React component
   */
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  Wrapper.propTypes = {
    children: PropTypes.any,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Use this render method to test the react-router-dom hooks such as
 * useLocation or useParams
 *
 * @param {object} ui - React component we are passing in
 * @param {object} root0 - React component
 * @param {object} root0.preloadedState - The initial component state
 * @param {object} root0.store - Redux store we are mocking
 * @param {Array} root0.initialEntries - entries for browser history
 * @returns {object} React jsx components
 */
function testRenderWithMemoryRouter(
  ui,
  {
    initialEntries = [],
    preloadedState,
    store = configureStoreUtil(preloadedState),
    ...renderOptions
  } = {},
) {
  /**
   *
   * @param {object} root0 - React component
   * @param {object} root0.children - React child components
   * @returns {object} React component
   */
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  Wrapper.propTypes = {
    children: PropTypes.any,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
export { testRender, testRenderWithMemoryRouter };
