import './css/app.scss';
import '@cfpb/design-system-react/dsr.css';
import { DSRProvider } from '@cfpb/design-system-react';
import { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { ComplaintDetail } from './components/complaint-detail/complaint-detail';
import { DsrLink } from './components/dsr-link/dsr-link';
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
export default function App() {
  return (
    <Router basename={basename}>
      <DSRProvider LinkComponent={DsrLink}>
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
      </DSRProvider>
    </Router>
  );
}
