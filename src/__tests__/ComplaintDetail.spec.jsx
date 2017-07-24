import React from 'react';
import ComplaintDetail from '../ComplaintDetail';
import renderer from 'react-test-renderer';

describe('initial state', () => {
  let item;
  beforeEach(() => {
    item = {
      company: 'ABC Corp',
      company_public_response: 'Lorem',
      company_response: 'Ipsum',
      complaint_id: '99990909',
      complaint_what_happened: 'Oh baby you. Got what I need',
      consumer_consent_provided: 'Yes',
      consumer_disputed: 'Yes',
      date_received: '2013-02-03T12:00:00Z',
      date_sent_to_company: '2013-01-01T12:00:00Z',
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
  })

  it('renders without crashing', () => {
    const target = renderer.create(
          <ComplaintDetail complaint_={item.complaint_id} />
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toContain('99990909');
  });

});
