import React from 'react';
import ComplaintCard from '../ComplaintCard';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  it('renders without crashing', () => {
    const item = {
      company: 'ABC Corp',
      company_public_response: 'Lorem',
      company_response: 'Ipsum',
      complaint_id: '99990909',
      complaint_what_happened: 'Oh baby you. Got what I need',
      consumer_consent_provided: 'Yes',
      consumer_disputed: 'Yes',
      date_received: '2013-02-03',
      date_sent_to_company: '2013-01-01',
      issue: 'Alpha',
      product: 'Beta',
      state: 'DC',
      sub_issue: 'Gamma',
      sub_product: 'Delta',
      submitted_via: 'Email',
      timely: 'Yes',
      zip_code: '20008',
      foo: 'do not show this'
    };

    const target = renderer.create(
      <ComplaintCard key={item.complaint_id} row={item} />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('foo');
  });
});

