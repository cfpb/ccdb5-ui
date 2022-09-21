import './css/App.less';
import { applyMiddleware, createStore } from 'redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { DetailComponents } from './DetailComponents';
import { Provider } from 'react-redux';
import queryManager from './middleware/queryManager';
import React from 'react';
// Required so that the expose-loader test works which moves the ReactDOM
// variable into the global space
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import reducers from './reducers';
import SearchComponents from './components/Search/SearchComponents';
import thunkMiddleware from 'redux-thunk';

const middleware = [thunkMiddleware, queryManager];

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

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="*/detail/:id" component={DetailComponents} />
            <Route path="/" component={SearchComponents} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
