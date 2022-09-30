import './css/App.less';
import { applyMiddleware, createStore } from 'redux';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useParams
} from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import queryManager from './middleware/queryManager';
import ComplaintDetail from './components/ComplaintDetail';
import React from 'react';
import reducers from './reducers';
import { SearchComponents } from './components/Search/SearchComponents';
import thunkMiddleware from 'redux-thunk';
import synchUrl from "./middleware/synchUrl/synchUrl";

const middleware = [thunkMiddleware, queryManager, synchUrl];

const composeEnhancers = composeWithDevTools({
  // required for redux-devtools-extension
  // Specify name here, actionsBlacklist, actionsCreators and other options
  // if needed
});

// required format for redux-devtools-extension
const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(...middleware)
    // other store enhancers if any
  )
);

/* eslint-disable camelcase */

export const DetailComponents = () => {
  const {id} = useParams();

  return (
    <IntlProvider locale="en">
      <main role="main">
        <ComplaintDetail complaint_id={id}/>
      </main>
    </IntlProvider>
  );
}

/* eslint-enable camelcase */

// eslint-disable-next-line react/no-multi-comp
/**
 *
 */
export function App() {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<SearchComponents />} />
            <Route path="/detail/:id" element={<DetailComponents />} />
          </Routes>
        </Router>
      </Provider>
    );
}
