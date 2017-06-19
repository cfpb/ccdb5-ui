// Required so that the expose-loader test works which moves the ReactDOM
// variable into the global space
// eslint-disable-next-line
import ReactDOM from 'react-dom';

import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { getComplaints } from './actions/complaints'

import reducers from './reducers'

import './App.less';
import FilterPanel from './FilterPanel';
import Hero from './Hero';
import SearchBar from './SearchBar';
import ResultsPanel from './ResultsPanel';
import UrlBarSynch from './UrlBarSynch';

const middleware = [thunkMiddleware]

let store = createStore(
  reducers,
  applyMiddleware(...middleware)
);

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

export class App extends React.Component {
  constructor() {
    super();

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._onPage = this._onPage.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onUrlChanged = this._onUrlChanged.bind(this);

    this.urlBar = new UrlBarSynch(this._onUrlChanged);

    // Build up the state from the URL
    let nonQs = {
      items: [],
      total: 0,

      aggs: {
        timely_response: [
          {key: 'No', active: true, doc_count: 678845},
          {key: 'Yes', active: false, doc_count: 487578}
        ],
        company_response: [
          {key: 'Closed with explanation', active: false, doc_count: 574783},
          {key: 'Closed with monetary relief', active: false, doc_count: 151083},
          {key: 'Closed with non-monetary relief', active: false, doc_count: 94550},
          {key: 'Untimely response', active: false, doc_count: 26894},
          {key: 'Closed', active: false, doc_count: 19151},
          {key: 'Closed without relief', active: false, doc_count: 4263},
          {key: 'Closed with relief', active: false, doc_count: 1347},
          {key: 'In progress', active: false, doc_count: 587},
        ]
      }
    };
    let qs = this.urlBar.getParams();

    this.state = Object.assign({}, nonQs, qs);
  }

  componentDidMount() {
    this._callApi();
  }

  render() {
    return (
      <Provider store={store}>
        <main className="content content__1-3" role="main">
          <Hero />
          <div className="content_wrapper">
            <SearchBar />
            <aside className="content_sidebar">
              <FilterPanel aggs={this.state.aggs} />
            </aside>
            <ResultsPanel onPage={this._onPage}
                          className="content_main" />
          </div>
        </main>
      </Provider>
    );
  }

  //---------------------------------------------------------------------------
  // API Call

  _callApi() {
    store.dispatch(getComplaints())
  }

  //---------------------------------------------------------------------------
  // Handlers

  _onSearch(s) {
    this.urlBar.setParams(store.getState());
    this._callApi();
  }

  _onPage(page) {
    let update = {
      from: (page - 1) * this.state.size
    }

    this.urlBar.setParams(Object.assign({}, this.state, update));
    this.setState(update);
  }

  _onUrlChanged(params) {
    this.setState(params);
  }
}
