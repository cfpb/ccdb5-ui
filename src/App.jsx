
import React, { Component } from 'react';
import './App.less';
import ComplaintCard from './ComplaintCard';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import UrlBarSynch from './UrlBarSynch';

export class App extends Component {
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
      total: 0
    };
    let qs = this.urlBar.getParams();

    this.state = Object.assign({}, nonQs, qs);
  }

  componentDidMount() {
    this._callApi();
  }

  render() {
    let to = this.state.from + this.state.size;

    return (
      <main className="col-12">
        <aside className="col-3">
          <div className="refine-panel">Refine Panel</div>
        </aside>
        <div className="col-9 content">
          <SearchBar onSearch={this._onSearch} 
                     searchText={this.state.searchText} />
          <div className="results-panel">
            <summary>
              <Pagination {...this.state} onPage={this._onPage} />
            </summary>
            <ul className="cards-panel">
              {this.state.items
                .filter((e, i) => i >= this.state.from && i < to)
                .map(item => <ComplaintCard key={item.complaint_id}
                                            row={item} />)}
            </ul>
          </div>
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
