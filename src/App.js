import './css/App.scss';
import '@cfpb/design-system-react/index.css';
import { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { ComplaintDetail } from './components/ComplaintDetail/ComplaintDetail';
import { SearchComponents } from './components/Search/SearchComponents';

/**
 *
 * @returns {ReactElement} Main application component
 */
const App = () => {
  return (
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
          element={<ComplaintDetail />}
        />
        <Route path="/detail/:id" element={<ComplaintDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
