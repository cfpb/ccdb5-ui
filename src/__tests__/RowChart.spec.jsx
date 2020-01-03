import configureMockStore from 'redux-mock-store'
import { mapStateToProps, RowChart } from '../RowChart'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {}
  } )

  return renderer.create(
    <Provider store={ store }>
      <RowChart/>
    </Provider>
  )
}

describe( 'component: RowChart', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'componentDidUpdate', () => {
    let mapDiv

    beforeEach( () => {
      mapDiv = document.createElement( 'div' )
      mapDiv.setAttribute( 'id', 'tile-chart-map' )
      window.domNode = mapDiv
      document.body.appendChild( mapDiv )
    } )

    afterEach( () => {
      const div = document.getElementById( 'tile-chart-map' )
      if ( div ) {
        document.body.removeChild( div )
      }
      jest.clearAllMocks()
    } )

    it( 'does nothing when no data', () => {
      const target = shallow( <RowChart data={ [] }/> )
      target._redrawMap = jest.fn()
      target.setProps( { data: [ [] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'redraw when the data is the same but map element is missing', () => {
      // append children to mock test
      const target = shallow( <RowChart data={ [ [23, 4, 3] ] }/> )
      target._redrawMap = jest.fn()
      target.setProps( { data: [ [23, 4, 3] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'skips redraw when the data is the same', () => {
      mapDiv.appendChild(document.createElement('foobar'));
      const target = shallow( <RowChart data={ [ [23, 4, 3] ] }/> )
      target._redrawMap = jest.fn()
      target.setProps( { data: [ [23, 4, 3] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'trigger a new update when data changes', () => {
      const target = shallow( <RowChart data={ [ [23, 4, 3] ] }/> )
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
