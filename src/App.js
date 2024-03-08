import './css/App.less';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import queryManager from './middleware/queryManager';
import { ComplaintDetail } from './components/ComplaintDetail/ComplaintDetail';
import React from 'react';
import { SearchComponents } from './components/Search/SearchComponents';
import synchUrl from './middleware/synchUrl/synchUrl';
import { configureStore } from '@reduxjs/toolkit';
import aggReducer from './reducers/aggs/aggs';
import detailReducer from './reducers/detail/detail';
import mapReducer from './reducers/map/map';
import queryReducer from './reducers/query/query';
import resultsReducer from './reducers/results/results';
import routesReducer from './reducers/routes/routesSlice';
import trendsReducer from './reducers/trends/trends';
import viewReducer from './reducers/view/view';

// required format for redux-devtools-extension
const store = configureStore({
  devTools: true,
  reducer: {
    aggs: aggReducer,
    detail: detailReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
    routes: routesReducer,
    trends: trendsReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([queryManager, synchUrl]),
});

/* eslint-disable camelcase */
export const DetailComponents = () => {
  return (
    <IntlProvider locale="en">
      <main role="main">
        <ComplaintDetail />
      </main>
    </IntlProvider>
  );
};
/* eslint-enable camelcase */

// eslint-disable-next-line react/no-multi-comp
/**
 * Main App Component
 *
 * @returns {JSX.Element} Main app
 */
export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/*
              we need these duplicate routes to match relative path
              /data-research/consumer-complaints/search
              from CF.gov
              local
              which is just the root at localhost:3000/
          */}
          <Route index element={<SearchComponents />} />
          <Route
            path="/data-research/consumer-complaints/search"
            element={<SearchComponents />}
          />
          <Route
            path="/data-research/consumer-complaints/search/detail/:id"
            element={<DetailComponents />}
          />
          <Route path="/detail/:id" element={<DetailComponents />} />
        </Routes>
      </Router>
    </Provider>
  );
};
