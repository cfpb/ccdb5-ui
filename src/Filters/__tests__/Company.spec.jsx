import { shallow } from 'enzyme';
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxCompany, { mapDispatchToProps, Company } from '../Company'

const fixture = [
  { key: "Monocle Popper Inc", doc_count: 9999 },
  { key: "Safe-T Deposits LLC", doc_count: 999 },
  { key: "Securitized Collateral Risk Obligations Credit Co", doc_count: 99 },
  { key: "EZ Credit", doc_count: 9 }
]

function setupEnzyme() {
  const props = {
    forTypeahead: [],
    options: [],
    queryString: '?foo=bar&baz=qaz',
    typeaheadSelect: jest.fn()
  }

  const target = shallow(<Company {...props} />);

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
      company: ['Monocle Popper Inc']
    },
    aggs: {
      company: fixture
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
    it('renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('Typeahead interface', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@API_suggest_company/?foo=bar&baz=qaz&text=')

        return new Promise((resolve) => {
          resolve({
            json: function() {
              return ['foo', 'bar', 'baz', 'qaz']
            }
          })
        })
      })
    })

    describe('_onInputChange', () => {
      it('provides a promise', () => {
        const {target} = setupEnzyme()
        const actual = target.instance()._onInputChange('mo')
        expect(actual.then).toBeInstanceOf(Function)
      })
    })

    describe('_renderOption', () => {
      it('produces a custom component', () => {
        const {target, props} = setupEnzyme()
        const option = {
          key: 'Foo',
          label: 'foo',
          position: 0,
          value: 'FOO'
        }
        const actual = target.instance()._renderOption(option)
        expect(actual.value).toEqual('Foo')
        expect(actual.component).toMatchObject({
          props: {
            label: 'foo',
            position: 0,
            value: 'FOO'
          }
        })
      })
    })
  
    describe('_onOptionSelected', () => {
      it('checks the filter associated with the option', () => {
        const {target, props} = setupEnzyme()
        target.instance()._onOptionSelected({key: 'foo'})
        expect(props.typeaheadSelect).toHaveBeenCalledWith('foo')
      })
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
