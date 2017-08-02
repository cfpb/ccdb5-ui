import { shallow } from 'enzyme';
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxCompanyName, { mapDispatchToProps, CompanyName } from '../CompanyName'

const fixture = [
  { key: "BANK OF", doc_count: 9999 },
  { key: "CAPITAL", doc_count: 999 },
  { key: "Financial", doc_count: 99 },
  { key: "Bankers", doc_count: 9 }
]

function setupEnzyme() {
  const props = {
    forTypeahead: [],
    options: [],
    typeaheadSelect: jest.fn()
  }

  const target = shallow(<CompanyName {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {
      company: ['CAPITAL']
    },
    aggs: {
      company: fixture
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxCompanyName />
      </IntlProvider>
    </Provider>
  )
}

describe('component::CompanyName', () => {
  describe('snapshots', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('_onOptionSelected', () => {
    it('checks the filter associated with the option', () => {
      const {target, props} = setupEnzyme()
      target.instance()._onOptionSelected({key: 'foo'})
      expect(props.typeaheadSelect).toHaveBeenCalledWith('foo')
    })
  })

  describe('mapDispatchToProps', () => {
    it('hooks into addMultipleFilters', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).typeaheadSelect('foo')
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })
})
