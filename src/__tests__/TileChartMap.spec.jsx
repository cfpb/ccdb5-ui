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
    let mapDiv, redrawSpy, target

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
      target = shallow( <TileChartMap data={ [] }/> )
      redrawSpy = jest.spyOn(target.instance(), '_redrawMap')
      target.setProps( { data: [ [] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'redraw when the data is the same but map element is missing', () => {
      // append children to mock test
      target = shallow( <TileChartMap data={ [ [23, 4, 3] ] }/> )
      redrawSpy = jest.spyOn(target.instance(), '_redrawMap')
      target.setProps( { data: [ [23, 4, 3] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'skips redraw when the data is the same', () => {
      mapDiv.appendChild(document.createElement('foobar'));
      target = shallow( <TileChartMap data={ [ [23, 4, 3] ] }/> )
      redrawSpy = jest.spyOn(target.instance(), '_redrawMap')
      target.setProps( { data: [ [23, 4, 3] ] } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 0 )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )

    } )

    it( 'trigger a new update when data changes', () => {
      target = shallow( <TileChartMap data={ [ [23, 4, 3] ] }/> )
      redrawSpy = jest.spyOn(target.instance(), '_redrawMap')
      target.setProps( { data: [ [ 2, 5 ] ] } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          state: [
            { abbr: 'a', name: 'aa'},
            { abbr: 'b', name: 'bb'},
            { abbr: 'c', name: 'cc'}
          ],
          selectedState: 'b'
        },
        query: {
          state: [ 'a' ]
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        data: [
          [ { abbr: 'a', name: 'aa', className: 'deselected'},
            { abbr: 'b', name: 'bb', className: 'deselected'},
            { abbr: 'c', name: 'cc', className: 'deselected'}
            ]
        ],
        stateFilters: [ 'a' ],
        selectedState: 'b'
      } )
    } )
  } )


} )
