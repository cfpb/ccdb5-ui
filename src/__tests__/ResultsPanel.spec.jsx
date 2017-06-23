import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import { ResultsPanel } from '../ResultsPanel';
import renderer from 'react-test-renderer';

describe('component:ReactPanel', () => {
  it('renders without crashing', () => {
    const items = [
      {
        company: 'foo',
        company_public_response: 'Closed',
        company_response: 'Closed',
        complaint_id: '1',
        complaint_what_happened: 'Lorem Ipsum',
        consumer_consent_provided: 'Yes',
        consumer_disputed: 'No',
        date_received: '2013-02-03',
        date_sent_to_company: '2013-02-03',
        issue: 'Foo',
        product: 'Bar',
        state: 'DC',
        sub_issue: 'Baz',
        sub_product: 'Qaz',
        submitted_via: 'email',
        timely: 'yes',
        zip_code: '200XX' 
      }
    ];

    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
      query: {
        from: 0,
        size: 10
      },
      results: {
        items: items,
        total: 1
      }
    })

    const target = renderer.create(
      <Provider store={ store } >
        <IntlProvider locale="en">
          <ResultsPanel items={ items } from="0" size="10" />
        </IntlProvider>
      </Provider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
