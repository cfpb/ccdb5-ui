import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import aggs from '../reducers/aggs/aggs';
import detail from '../reducers/detail';
import map from '../reducers/map';
import modal from '../reducers/modal';
import query from '../reducers/query/query';
import results from '../reducers/results/results';
import trends from '../reducers/trends';
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
        modal: modal,
        query: query,
        results: results,
        trends: trends,
        view: view,
      },
      //   middleware: (getDefaultMiddleware) =>
      //     getDefaultMiddleware({
      //       serializableCheck: {
      //         // Ignore these action types
      //         // ignoredActions: ['HTTP_GET_REQUEST', 'HTTP_POST_REQUEST'],
      //       },
      //     }),
      preloadedState,
    }),
    ...renderOptions
  } = {}
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
        <HashRouter>{children}</HashRouter>
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
export { testRender };
