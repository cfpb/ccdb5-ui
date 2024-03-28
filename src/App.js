import './css/App.less';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { ComplaintDetail } from './components/ComplaintDetail/ComplaintDetail';
import { SearchComponents } from './components/Search/SearchComponents';
import store from './app/store';

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
