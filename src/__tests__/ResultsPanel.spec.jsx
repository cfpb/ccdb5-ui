import React from 'react';
import { ResultsPanel } from '../ResultsPanel';
import renderer from 'react-test-renderer';

describe('initial state', () => {
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

    const target = renderer.create(
      <ResultsPanel items={ items } from="0" size="10" />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
