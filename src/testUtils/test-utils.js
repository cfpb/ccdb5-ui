import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import aggReducer from '../reducers/aggs/aggs';
import detailReducer from '../reducers/detail/detail';
import mapReducer from '../reducers/map/map';
import queryReducer from '../reducers/query/query';
import resultsReducer from '../reducers/results/results';
import trendsReducer from '../reducers/trends/trends';
import viewReducer from '../reducers/view/view';

/**
 *
 * @param {object} preloadedState - The initial component state
 * @returns {object} Redux store we are mocking
 */
function configureStoreUtil(preloadedState) {
  return configureStore({
    reducer: {
      aggs: aggReducer,
      detail: detailReducer,
      map: mapReducer,
      query: queryReducer,
      results: resultsReducer,
      trends: trendsReducer,
      view: viewReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [],
        },
      }),
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
    store = configureStore({
      reducer: {
        aggs: aggReducer,
        detail: detailReducer,
        map: mapReducer,
        query: queryReducer,
        results: resultsReducer,
        trends: trendsReducer,
        view: viewReducer,
      },
      preloadedState,
    }),
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
