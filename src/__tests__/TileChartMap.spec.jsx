import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, TileChartMap
} from '../TileChartMap'
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
  let mapDiv, redrawSpy, target
  describe( 'initial state', () => {
    beforeEach( () => {
      jest.clearAllMocks()
    } )
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'toggles map state when different from current state', () => {
      target = shallow( <TileChartMap/> )
      const mapEvent = { point: { abbr: 'FO', fullName: 'Foo Bar' } }
      const instance = target.instance()
      //._toggleState( mapEvent )
      instance.mapShapeToggled = jest.fn()
      instance._toggleState( mapEvent )
      expect( instance.mapShapeToggled ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'does nothing current state is the same', () => {
      target = shallow( <TileChartMap/> )
      const mapEvent = { point: { abbr: 'FO', fullName: 'Foo Bar' } }
      const instance = target.instance()
      instance.mapShapeToggled = jest.fn()
      instance.selectedState = { abbr: 'FO', name: 'Foo Bar' }
      instance._toggleState( mapEvent )
      expect( instance.mapShapeToggled ).toHaveBeenCalledTimes( 0 )
    } )
  } )

  describe( 'componentDidUpdate', () => {
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
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { data: [ [] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'redraw when the data is the same but map element is missing', () => {
      // append children to mock test
      target = shallow( <TileChartMap data={ [ [ { name: 'TX', value: 100 } ] ] }/> )
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { data: [ [ { name: 'TX', value: 100 } ] ] } )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'skips redraw when the data is the same', () => {
      mapDiv.appendChild( document.createElement( 'foobar' ) )
      target = shallow( <TileChartMap data={ [ [ 23, 4, 3 ] ] }/> )
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { data: [ [ 23, 4, 3 ] ] } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 0 )
      expect( TileMap ).toHaveBeenCalledTimes( 0 )

    } )

    it( 'trigger a new update when data changes', () => {
      target = shallow( <TileChartMap data={ [ [ { name: 'TX', value: 100}, { name: 'LA', value: 10 } ] ] }/> )
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { data: [ [ { name: 'TX', value: 100 }, { name: 'LA', value: 100 } ] ] } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    beforeEach( () => {
      jest.clearAllMocks()
    } )
    it( 'provides a way to call mapShapeToggled', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).mapShapeToggled()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          dataNormalization: false,
          state: [
            // name comes from agg api
            { name: 'TX', issue: 'something', product: 'a prod', value: 100000 },
            { name: 'LA', issue: 'something', product: 'b prod', value: 2 },
            { name: 'CA', issue: 'something', product: 'c prod', value: 3 }
          ],
          // fyi Selected State comes from map
          selectedState: { abbr: 'TX', name: 'Texas' }
        },
        query: {
          state: [ 'TX' ]
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        data: [
          [
            {
              name: 'TX',
              className: 'selected',
              issue: 'something',
              perCapita: '3.65',
              product: 'a prod',
              value: 100000
            },
            {
              name: 'LA',
              className: 'deselected',
              issue: 'something',
              perCapita: '0.00',
              product: 'b prod',
              value: 2
            },
            {
              name: 'CA',
              className: 'deselected',
              issue: 'something',
              perCapita: '0.00',
              product: 'c prod',
              value: 3
            }
          ]
        ],
        dataNormalization: false,
        stateFilters: [ 'TX' ],
        selectedState: { abbr: 'TX', name: 'Texas' }
      } )
    } )
  } )


} )
