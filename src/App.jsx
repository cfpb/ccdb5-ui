// Required so that the expose-loader test works which moves the ReactDOM
// variable into the global space
// eslint-disable-next-line
import ReactDOM from 'react-dom';

import React from 'react';
import './App.less';
import FilterPanel from './FilterPanel';
import Hero from './Hero';
import SearchBar from './SearchBar';
import ResultsPanel from './ResultsPanel';
import UrlBarSynch from './UrlBarSynch';

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
      <main className="content content__1-3" role="main">
        <Hero />
        <div className="content_wrapper">
          <SearchBar onSearch={this._onSearch} 
                     searchText={this.state.searchText} />
          <aside className="content_sidebar">
            <FilterPanel aggs={this.state.aggs} />
          </aside>
          <ResultsPanel {...this.state} onPage={this._onPage}
                        className="content_main" />
        </div>
      </main>
    );
  }

  //---------------------------------------------------------------------------
  // API Call

  _callApi() {
    return fetch('https://data.consumerfinance.gov/resource/jhzv-w97w.json')
    .then(result => result.json())
    .then(items => this.setState({items: items, total: items.length}))
  }

  //---------------------------------------------------------------------------
  // Handlers

  _onSearch(s) {
    let update = {
      searchText: s,
      from: 0,
      total: 0
    };

    this.urlBar.setParams(Object.assign({}, this.state, update));
    this.setState(update);
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
