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

const middleware = [thunkMiddleware]

let store = createStore(
  reducers,
  applyMiddleware(...middleware)
);

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
// let unsubscribe = store.subscribe(() =>
//   console.log(store.getState())
// )

export class App extends React.Component {
  constructor() {
    super();

    // Build up the state from the URL
    let nonQs = {
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

    this.state = Object.assign({}, nonQs);
  }

  componentDidMount() {
    store.dispatch(getComplaints())
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
            <ResultsPanel className="content_main" />
          </div>
        </main>
      </Provider>
    );
  }
}
