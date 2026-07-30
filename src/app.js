import './css/app.scss';
import '@cfpb/design-system-react/index.css';
import { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { ComplaintDetail } from './components/complaint-detail/complaint-detail';
import { SearchComponents } from './components/search/search-components';

// Strip trailing slash; empty/root builds leave basename unset.
const routerBasename = (process.env.BASE_PATH || '/')
  .replace(/\/$/, '')
  .replace(/^$/, '/');
const basename = routerBasename === '/' ? undefined : routerBasename;

/**
 *
 * @returns {ReactElement} Main application component
 */
const App = () => {
  return (
    <Router basename={basename}>
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
          element={<ComplaintDetail />}
        />
        <Route path="/detail/:id" element={<ComplaintDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
