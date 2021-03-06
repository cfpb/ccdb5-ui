import './css/App.less'
import { applyMiddleware, createStore } from 'redux'
import {
  Route,
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
import ComplaintDetail from './components/ComplaintDetail'
import { composeWithDevTools } from 'redux-devtools-extension'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import queryManager from './middleware/queryManager'
import React from 'react'
// Required so that the expose-loader test works which moves the ReactDOM
// variable into the global space
// eslint-disable-next-line
import ReactDOM from 'react-dom'
import reducers from './reducers'
import SearchComponents from './components/Search/SearchComponents'
import thunkMiddleware from 'redux-thunk'

const middleware = [ thunkMiddleware, queryManager ];

const composeEnhancers = composeWithDevTools( {
  // required for redux-devtools-extension
  // Specify name here, actionsBlacklist, actionsCreators and other options
  // if needed
} )

// required format for redux-devtools-extension
const store = createStore( reducers, composeEnhancers(
  applyMiddleware( ...middleware ),
  // other store enhancers if any
) )


/* eslint-disable camelcase */

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

/* eslint-enable camelcase */

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
