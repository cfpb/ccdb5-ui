import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, TabbedNavigation
} from '../TabbedNavigation'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupSnapshot(showTrends) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore()

  return renderer.create(
    <Provider store={ store }>
      <TabbedNavigation showTrends={ showTrends } />
    </Provider>
  )
}

describe( 'component: TabbedNavigation', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot(false)
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'shows the Trends tab', () => {
      const target = setupSnapshot(true)
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe('buttons', () => {
    let cb = null
    let target = null

    beforeEach( () => {
      cb = jest.fn()
      window.scrollTo = jest.fn();

      target = shallow( <TabbedNavigation onTab={ cb } showTrends /> )
    } )

    it( 'tabChanged is called with Map when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.map' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('Map')
    } )

    it( 'tabChanged is called with List when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.list' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('List')
    } )

    it( 'tabChanged is called with Trends when the button is clicked', () => {
      const prev = target.find( '.tabbed-navigation button.trends' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('Trends')
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
        },
        view: {
          showTrends: true
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { tab: 'foo', showTrends: true } )
    } )
  } )


} )
