import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import ReduxFocusHeader, {
  FocusHeader,
  mapDispatchToProps,
  mapStateToProps
} from '../Trends/FocusHeader'
import React from 'react'
import renderer from 'react-test-renderer'
import { REQUERY_ALWAYS } from '../../constants'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    query: {
      focus: 'Foo Bar',
      lens: 'Product',
      subLens: 'sub_product'
    },
    trends: {
      total: 90120
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <ReduxFocusHeader/>
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:FocusHeader', () => {
  it( 'renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  describe( 'buttons', () => {
    let cb = null
    let target = null

    beforeEach( () => {
      cb = jest.fn()
      target = shallow( <FocusHeader clearFocus={ cb }
                                     focus={ 'Focus item' }
                                     lens={ 'Foo' }
                                     total={ '9,123' }
      /> )
    } )

    it( 'changeFocus is called when the button is clicked', () => {
      const prev = target.find( '#clear-focus' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalled()
    } )

  } )

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into changeFocus', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).clearFocus()
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: REQUERY_ALWAYS,
          type: 'FOCUS_CHANGED',
          focus: ''
        } ]
      ] )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          focus: 'Foo',
          lens: 'Bar'
        },
        trends: {
          total: 1000
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        focus: 'Foo',
        lens: 'Bar',
        total: '1,000'
      } )
    } )
  } )

} )
