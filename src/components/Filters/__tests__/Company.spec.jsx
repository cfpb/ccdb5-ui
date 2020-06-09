import { shallow } from 'enzyme';
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import ReduxCompany, { Company } from '../Company'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const fixture = [
  { key: "Monocle Popper Inc", doc_count: 9999 },
  { key: "Safe-T Deposits LLC", doc_count: 999 },
  { key: "Securitized Collateral Risk Obligations Credit Co", doc_count: 99 },
  { key: "EZ Credit", doc_count: 9 }
]

function setupSnapshot(initialFixture) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {
      company: ['Monocle Popper Inc']
    },
    aggs: {
      company: initialFixture
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxCompany />
      </IntlProvider>
    </Provider>
  )
}

describe('component::Company', () => {
  describe('snapshots', () => {
    it('renders empty values without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('renders without crashing', () => {
      const target = setupSnapshot( fixture )
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
