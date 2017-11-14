import ReduxComplaintDetail, {
  ComplaintDetail, mapDispatchToProps
} from '../ComplaintDetail'
import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

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
    complaint_id: '123456789',
    loadDetail: jest.fn()
  }

  const target = shallow(<ComplaintDetail {...props} />)

  return {
    props,
    target
  }
}

function setupSnapshot(overrides={}, error='') {
  let data = Object.assign({}, fixture, overrides)
  if (error) {
    data = {}
  }

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    detail: {data, error}
  })

  const target = renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxComplaintDetail complaint_id='123456789' />
      </IntlProvider>
    </Provider>
  )

  return target
}

describe('component::ComplaintDetail', () => {
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
      
      values.forEach(v => {
        const target = setupSnapshot({consumer_consent_provided: v})
        const tree = target.toJSON()
        expect(tree).toMatchSnapshot()
      })
    })

    it('supports "Timely Response" icons', () => {
      const values = ['Yes', 'No']
      
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

    it('renders WAITING phase', () => {
      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore({
        detail: {data: {}, error: ''}
      })

      const target = renderer.create(
        <Provider store={store}>
          <IntlProvider locale="en">
            <ReduxComplaintDetail complaint_id='123456789' />
          </IntlProvider>
        </Provider>
      )

      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders ERROR phase', () => {
      const target = setupSnapshot({}, 'Error fetching data')
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

    it('takes the user back to the home page', () => {
      const orig = document.referrer
      Object.defineProperty(document, 'referrer', {value: ''})
      const {target} = setupEnzyme()
      Object.defineProperty(document, 'referrer', {value: orig})

      const back = target.find('.back-to-search button')
      back.simulate('click')
      expect(document.URL).toEqual('http://localhost/')
    })
  })
})
