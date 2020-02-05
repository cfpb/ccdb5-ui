import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';
import ResultsPanel from '../ResultsPanel';

const fixture = [
  {
    company: 'foo',
    company_public_response: 'Closed',
    company_response: 'Closed',
    complaint_id: '1',
    complaint_what_happened: 'Lorem Ipsum',
    consumer_consent_provided: 'Yes',
    consumer_disputed: 'No',
    date_received: '2013-02-03T12:00:00Z',
    date_sent_to_company: '2013-01-01T12:00:00Z',
    issue: 'Foo',
    product: 'Bar',
    state: 'DC',
    sub_issue: 'Baz',
    sub_product: 'Qaz',
    submitted_via: 'email',
    timely: 'yes',
    zip_code: '200XX'
  }
]

function setupSnapshot(items=[], initialStore={}, tab = 'List') {
  const results = Object.assign({
    error: '',
    hasDataIssue: false,
    isDataStale: false,
    items
  }, initialStore)

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    aggs: {
      doc_count: 100,
      total: items.length
    },
    map: {
      state: []
    },
    results,
    query: {
      tab: tab
    },
  });

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <ResultsPanel />
      </IntlProvider>
    </Provider>
  )
}

describe('component:Results', () => {
  it('renders map panel without crashing', () => {
    const target = setupSnapshot( fixture, null, 'Map' );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders list panel without crashing', () => {
    const target = setupSnapshot( fixture, null, 'List' );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

})
