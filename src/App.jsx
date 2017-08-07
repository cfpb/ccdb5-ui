import './App.less';
import { applyMiddleware, createStore } from 'redux'
import {
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'

import ComplaintDetail from './ComplaintDetail';
import { composeWithDevTools } from 'redux-devtools-extension';
import FilterPanel from './FilterPanel';
import Hero from './Hero';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import React from 'react';
// Required so that the expose-loader test works which moves the ReactDOM
// variable into the global space
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import reducers from './reducers'
import ResultsPanel from './ResultsPanel';
import RootModal from './Dialogs/RootModal'
import SearchPanel from './SearchPanel';
import thunkMiddleware from 'redux-thunk'
import UrlBarSynch from './UrlBarSynch';

const middleware = [ thunkMiddleware ];

const composeEnhancers = composeWithDevTools( {
  // required for redux-devtools-extension
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
} );

// required format for redux-devtools-extension
const store = createStore( reducers, /* preloadedState, */ composeEnhancers(
  applyMiddleware( ...middleware ),
  // other store enhancers if any
) );


export class SearchComponents extends React.Component {
  render() {
    return (
      <IntlProvider locale="en">
        <main className="content content__1-3" role="main">
          <UrlBarSynch />
          <Hero />
          <div className="content_wrapper">
            <SearchPanel />
            <aside className="content_sidebar">
              <FilterPanel />
            </aside>
            <ResultsPanel className="content_main" />
          </div>
          <RootModal />
        </main>
      </IntlProvider>
    )
  }
}

export class DetailComponents extends React.Component {
  render() {
    const complaint_id = this.props.match.params.id;

    return (
      <IntlProvider locale="en">
        <main role="main">
          <ComplaintDetail complaint_id={complaint_id}/>
        </main>
      </IntlProvider>
    )
  }
}

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="*/detail/:id" component={DetailComponents}/>
            <Route path="/" component={SearchComponents}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
