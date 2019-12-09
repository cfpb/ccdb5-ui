import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import MapPanel from '../MapPanel';
import renderer from 'react-test-renderer';

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

function setupSnapshot(items=[], initialStore={}) {
  const results = Object.assign({
    doc_count: 100,
    error: '',
    hasDataIssue: false,
    isDataStale: false,
    items,
    total: items.length
  }, initialStore);

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    map: {
      state: []
    },
    query: {
      from: 0,
      size: 10
    },
    results,
    view: {
      tab: 'Map'
    }
  })

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <MapPanel />
      </IntlProvider>
    </Provider>
  )
}

describe('component:MapPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot(fixture)
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
})
