import configureMockStore from 'redux-mock-store'
import ReduxTabbedNavigation, {
  mapDispatchToProps, mapStateToProps, TabbedNavigation
} from '../TabbedNavigation'
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupSnapshot( tab ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore({
    query:{
      tab
    }
  })

  return renderer.create(
    <Provider store={ store }>
      <ReduxTabbedNavigation />
    </Provider>
  )
}

describe( 'component: TabbedNavigation', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'shows the List tab', () => {
      const target = setupSnapshot( MODE_LIST )
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'shows the Map tab', () => {
      const target = setupSnapshot( MODE_MAP )
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'shows the Trends tab', () => {
      const target = setupSnapshot( MODE_TRENDS )
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe('buttons', () => {
    let cb = null
    let target = null

    beforeEach( () => {
      cb = jest.fn()
      target = shallow( <TabbedNavigation onTab={ cb } /> )
    } )

    it( 'tabChanged is called with Map when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.map' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('Map')
    } )

    it( 'tabChanged is called with Trends when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.trends' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('Trends')
    } )

    it( 'tabChanged is called with List when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.list' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('List')
    } )
  })

  describe('mapDispatchToProps', () => {
    it('provides a way to call tabChanged', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onTab()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          tab: 'foo'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { tab: 'foo' } )
    } )
  } )


} )
