import ReduxCompanyTypeahead, { CompanyTypeahead, mapDispatchToProps } from '../CompanyTypeahead'
import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupEnzyme() {
  const props = {
    queryString: '?foo=bar&baz=qaz',
    typeaheadSelect: jest.fn()
  }

  const target = shallow(<CompanyTypeahead {...props} />);

  return {
    props,
    target
  }
}

function setupSnapshot( { focus, lens, queryString } ) {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore( {
    query: {
      focus,
      lens,
      queryString
    }
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxCompanyTypeahead />
      </IntlProvider>
    </Provider>
  )
}

describe('component::CompanyTypeahead', () => {
  describe('snapshots', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot({})
      let tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })

    it( 'renders disabled without crashing', () => {
      const target = setupSnapshot( {
        lens: 'Company',
        focus: 'Acme'
      } )

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
