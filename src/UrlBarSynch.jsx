const queryString = require('query-string');
import createHistory from 'history/createBrowserHistory';

const urlParams = ['searchText', 'from', 'size'];
const defaultParams = {
  searchText: 'foo',
  from: 0,
  size: 10
}

export default class UrlBarSynch {
  constructor(onChangeCallback) {
    this.onChangeCallback = onChangeCallback;

    // URL handling
    this.history = createHistory();
    this.location = this.history.location;
     
    // Listen for changes to the current location. 
    this.unlisten = this.history.listen(this._onUrlChanged.bind(this));
  }

  getParams() {
    return this._extractQueryStringParams(this.location.search);
  }

  setParams(params) {
    var subset = urlParams.reduce(
      (accum, k) => ((accum[k] = params[k], accum)), {}
    );

    var qs = queryString.stringify(subset);

    this.history.push({
      search: '?' + qs
    });
  }

  // componentWillUnmount() {
  //   this.unlisten();
  // }

  //---------------------------------------------------------------------------
  // URL Handlers

  _extractQueryStringParams(qs) {
    var values = Object.assign({}, defaultParams, queryString.parse(qs));

    values.from = parseInt(values.from, 10) || defaultParams.from;
    values.size = parseInt(values.size, 10) || defaultParams.size;

    return values;
  }

  _onUrlChanged(location, action) {
    if(action === 'POP' && this.onChangeCallback) {
      let params = this._extractQueryStringParams(location.search)
      this.onChangeCallback(params);
    }
  }
}

