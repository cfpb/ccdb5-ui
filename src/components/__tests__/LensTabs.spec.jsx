import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import ReduxLensTabs, {
  LensTabs,
  mapDispatchToProps,
  mapStateToProps
} from '../Trends/LensTabs'
import React from 'react'
import renderer from 'react-test-renderer'
import { REQUERY_ALWAYS } from '../../constants'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme'

function setupSnapshot( lens ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    query: {
      lens,
      subLens: 'sub_product'
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <ReduxLensTabs showTitle={true}/>
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:LensTabs', () => {
  it( 'does not render when Overview', () => {
    const target = setupSnapshot( 'Overview' )
    const tree = target.toJSON()
    expect( tree ).toBeNull()
  } )

  it( 'renders Product without crashing', () => {
    const target = setupSnapshot( 'Product' )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  describe( 'buttons', () => {
    let cb = null
    let target = null

    beforeEach( () => {
      cb = jest.fn()
      target = shallow( <LensTabs onTab={ cb }
                                  lens={ 'Product' }
                                  subLens={ 'Issue' }
                                  showTitle={ true }/> )
    } )

    it( 'tabChanged is called with Product when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.sub_product' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( 'sub_product' )
    } )

    it( 'tabChanged is called with Issue when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.issue' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( 'issue' )
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into changeDataSubLens', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).onTab( 'What' )
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: REQUERY_ALWAYS,
          subLens: 'what',
          type: 'DATA_SUBLENS_CHANGED'
        } ]
      ] )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          lens: 'foo',
          subLens: 'bar'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { lens: 'foo', subLens: 'bar' } )
    } )
  } )

} )
