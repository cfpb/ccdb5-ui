import React from 'react';
import { IntlProvider } from 'react-intl';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import aggs from '../reducers/aggs/aggs';
import detail from '../reducers/detail/detail';
import map from '../reducers/map/map';
import query from '../reducers/query/query';
import results from '../reducers/results/results';
import trends from '../reducers/trends/trends';
import view from '../reducers/view/view';

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
    store = configureStore({
      reducer: {
        aggs: aggs,
        detail: detail,
        map: map,
        query: query,
        results: results,
        trends: trends,
        view: view,
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
      <IntlProvider locale="en">
        <Provider store={store}>
          <BrowserRouter>{children}</BrowserRouter>
        </Provider>
      </IntlProvider>
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
        aggs: aggs,
        detail: detail,
        map: map,
        query: query,
        results: results,
        trends: trends,
        view: view,
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
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </Provider>
      </IntlProvider>
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
