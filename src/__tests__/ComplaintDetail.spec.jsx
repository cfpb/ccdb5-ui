import { shallow } from 'enzyme';
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
  date_received: '2017-03-04T12:00:00',
  date_sent_to_company: '2017-03-04T12:00:00',
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

function _buildJson(row) {
  return {
    hits: { hits: [{ _source: row }] } 
  }
}

function setupEnzyme() {
  const props = {
    complaint_id: '123456789'   
  }

  const target = shallow(<ComplaintDetail {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot(overrides={}) {
  const row = Object.assign({}, fixture, overrides)

  // Provide hooks for "API"
  let onSuccess, onFail

  global.fetch = jest.fn().mockImplementation((url) => {
    expect(url).toContain('@@API123456789')

    return {
      then: (x) => {
        x({ json: () => ({})})
        return {
          then: (x) => {
            onSuccess = () => x(_buildJson(row))
            return {
              catch: (y) => {onFail = y}
            }
          }
        }
      }
    }
  })

  const target = renderer.create(
    <IntlProvider locale="en">
      <ComplaintDetail complaint_id='123456789' />
    </IntlProvider>
  )

  return {target, onSuccess, onFail}
}

describe('component::ComplaintDetail', () => {
  describe('snapshots', () => {
    it('renders without crashing', () => {
      const {target, onSuccess} = setupSnapshot()
      onSuccess()
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
      
      values.forEach(v => {
        const {target, onSuccess} = setupSnapshot({consumer_consent_provided: v})
        onSuccess()
        const tree = target.toJSON()
        expect(tree).toMatchSnapshot()
      })
    })

    it('supports "Timely Response" icons', () => {
      const values = ['Yes', 'No']
      
      values.forEach(v => {
        const {target, onSuccess} = setupSnapshot({timely: v})
        onSuccess()
        const tree = target.toJSON()
        expect(tree).toMatchSnapshot()
      })
    })

    it('renders without a narrative', () => {
      const {target, onSuccess} = setupSnapshot({complaint_what_happened: ''})
      onSuccess()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders without a sub-issue', () => {
      const {target, onSuccess} = setupSnapshot({sub_issue: ''})
      onSuccess()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders without a sub-product', () => {
      const {target, onSuccess} = setupSnapshot({sub_product: ''})
      onSuccess()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders WAITING phase', () => {
      const {target} = setupSnapshot({sub_product: ''})
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders ERROR phase', () => {
      const {target, onFail} = setupSnapshot({sub_product: ''})
      onFail()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('navigation', () => {
    it('takes the user back to the previous page', () => {
      global.history.go = jest.fn()

      const {target} = setupEnzyme()
      const back = target.find('.back-to-search button')
      back.simulate('click')
      expect(global.history.go).toHaveBeenCalledWith(-1)
    })
  })
})
