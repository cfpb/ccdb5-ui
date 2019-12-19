import configureMockStore from 'redux-mock-store'
import { mapStateToProps, TileChartMap } from '../TileChartMap'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import { TileMap } from 'cfpb-chart-builder'

// this is how you override and mock an imported constructor
jest.mock( 'cfpb-chart-builder', () => {
  return {
    TileMap: jest.fn().mockImplementation( () => {
      return {}
    } )
  }
} )

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {}
  } )

  return renderer.create(
    <Provider store={ store }>
      <TileChartMap/>
    </Provider>
  )
}

describe( 'component: TileChartMap', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'componentDidUpdate', () => {
    beforeAll( () => {
      const div = document.createElement( 'div' )
      div.setAttribute( 'id', 'tile-chart-map' )
      window.domNode = div
      document.body.appendChild( div )
    } )

    afterAll( () => {
      const div = document.getElementById( 'tile-chart-map' )
      if ( div ) {
        document.body.removeChild( div )
      }
    } )

    it( 'does nothing when no data', () => {
      const target = shallow( <TileChartMap data={ [] }/> )
      target._redrawMap = jest.fn()
      target.setProps( { data: [ [] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'skips redraw when the data is the same', () => {
      const target = shallow( <TileChartMap data={ [ [23, 4, 3] ] }/> )
      target._redrawMap = jest.fn()
      target.setProps( { data: [ [23, 4, 3] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )

    } )

    it( 'trigger a new update when data changes', () => {
      const target = shallow( <TileChartMap data={ [ [23, 4, 3] ] }/> )
      target._redrawMap = jest.fn()
      target.setProps( { data: [ [ 2, 5 ] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          state: [ 1, 2, 3 ]
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        data: [
          [ 1, 2, 3 ]
        ]
      } )
    } )
  } )


} )
