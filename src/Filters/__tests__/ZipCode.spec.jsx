import { shallow } from 'enzyme';
import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxZipCode, { mapDispatchToProps, ZipCode } from '../ZipCode'

const fixture = [
  { key: "200XX", doc_count: 9999 },
  { key: "300XX", doc_count: 999 },
  { key: "400XX", doc_count: 99 },
  { key: "500XX", doc_count: 9 }
]

function setupEnzyme() {
  const props = {
    forTypeahead: [],
    options: [],
    queryString: '?foo=bar&baz=qaz',
    typeaheadSelect: jest.fn()
  }

  const target = shallow(<ZipCode {...props} />);

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
      zip_code: ['300XX']
    },
    aggs: {
      zip_code: fixture
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxZipCode />
      </IntlProvider>
    </Provider>
  )
}

describe('component::ZipCode', () => {
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
        expect(url).toContain('@@API_suggest_zip/?foo=bar&baz=qaz&text=')

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
        const actual = target.instance()._onInputChange('20')
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
