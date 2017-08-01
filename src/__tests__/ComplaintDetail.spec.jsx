import React from 'react';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';
import ComplaintDetail from '../ComplaintDetail';

const fixture = {
  company: 'JPMORGAN CHASE & CO.',
  company_public_response: 'Company acknowledges the complaint',
  company_response: 'Closed with explanation',
  complaint_id: '2371744',
  complaint_what_happened: 'Lorem ipsum dolor sit amet',
  consumer_consent_provided: 'Consent provided',
  consumer_disputed: 'Yes',
  date_received: '2017-03-04T00:00:00',
  date_sent_to_company: '2017-03-04T00:00:00',
  has_narrative: true,
  issue: 'Account opening, closing, or management',
  product: 'Bank account or service',
  state: 'KY',
  sub_issue: 'Closing',
  sub_product: 'Checking account',
  submitted_via: 'Web',
  tags: 'Older American',
  timely: 'Yes',
  zip_code: '423XX'
}

function setupSnapshot(overrides={}) {
  const props = Object.assign({}, fixture, overrides)

  return renderer.create(
    <IntlProvider locale="en">
      <ComplaintDetail complaint_id='123456789' row={props} />
    </IntlProvider>
  )
}

describe('snapshots', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('supports "Consumer Consent Provided" icons', () => {
    const values = [
      'Consent provided',
      'Consent not provided',
      'Consent withdrawn',
      'N/A',
      'FOO'
    ]
    
    let target, tree
    values.forEach(v => {
      const target = setupSnapshot({consumer_consent_provided: v})
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('supports "Timely Response" icons', () => {
    const values = ['Yes', 'No']
    
    let target, tree
    values.forEach(v => {
      const target = setupSnapshot({timely: v})
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  it('renders without a narrative', () => {
    const target = setupSnapshot({complaint_what_happened: ''})
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without a sub-issue', () => {
    const target = setupSnapshot({sub_issue: ''})
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders without a sub-product', () => {
    const target = setupSnapshot({sub_product: ''})
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
