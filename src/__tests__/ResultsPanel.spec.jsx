import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import ResultsPanel from '../ResultsPanel';
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

function setupSnapshot(items=[], error='') {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {
      from: 0,
      size: 10
    },
    results: {
      doc_count: 100,
      error,
      items,
      total: items.length
    }
  })

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <ResultsPanel items={ items } from="0" size="10" />
      </IntlProvider>
    </Provider>
  )
}

describe('component:ReactPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot(fixture)
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays a message when there are no results', () => {
    const target = setupSnapshot()
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when an error has occurred', () => {
    const target = setupSnapshot([], 'oops!')
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
