import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, TileChartMap
} from '../TileChartMap'
import Analytics from '../actions/analytics'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import TileMap from '../TileMap'

jest.mock( '../TileMap' )
jest.mock( '../actions/analytics' )

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
  let actionMock = jest.fn()
  describe( 'initial state', () => {
    beforeEach( () => {
      jest.clearAllMocks()
    } )
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    describe('when clicking a map node', () => {
      it( 'adds a map filter when it is not currently a filter', () => {
        target = shallow( <TileChartMap /> )
        const mapEvent = { point: { abbr: 'FO', fullName: 'Foo Bar' } }
        const instance = target.instance()
        instance.stateFilters = [ 'CA' ]
        instance.addState = jest.fn()
        instance._toggleState( mapEvent )
        expect( instance.addState ).toHaveBeenCalledTimes( 1 )
      } )

      it( 'removes a map filter when it is currently a filter', () => {
        target = shallow( <TileChartMap /> )
        const mapEvent = { point: { abbr: 'FO', fullName: 'Foo Bar' } }
        const instance = target.instance()
        instance.stateFilters = [ 'FO' ]
        instance.removeState = jest.fn()
        instance._toggleState( mapEvent )
        expect( instance.removeState ).toHaveBeenCalledTimes( 1 )
      } )
    } );
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
      target = shallow( <TileChartMap data={ [ [ { name: 'TX', value: 100}, { name: 'LA', value: 10 } ] ] } dataNormalization={'None'}/> )
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { data: [ [ { name: 'TX', value: 100 }, { name: 'LA', value: 100 } ] ] } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when printMode changes', () => {
      target = shallow( <TileChartMap data={ [ [ { name: 'TX', value: 100}, { name: 'LA', value: 10 } ] ] } printMode={false}/> )
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { printMode: true } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when width changes', () => {
      target = shallow( <TileChartMap
        data={ [ [ { name: 'TX', value: 100}, { name: 'LA', value: 10 } ] ] }
        printMode={false} width={1000}
      /> )
      redrawSpy = jest.spyOn( target.instance(), '_redrawMap' )
      target.setProps( { width: 600 } )
      expect( redrawSpy ).toHaveBeenCalledTimes( 1 )
      expect( TileMap ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    let dispatch
    beforeEach( () => {
      jest.clearAllMocks()
      dispatch = jest.fn()
      Analytics.getDataLayerOptions = jest.fn()
      Analytics.sendEvent = jest.fn()

    } )
    it( 'provides a way to call addState', () => {
      mapDispatchToProps( dispatch )
        .addState( { abbr: 'foo', name: 'bar' } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( Analytics.getDataLayerOptions )
        .toHaveBeenCalledWith( 'State Event: add', 'foo' )
      expect( Analytics.sendEvent ).toHaveBeenCalled()
    } )

    it( 'provides a way to call removeState', () => {
      mapDispatchToProps( dispatch )
        .removeState( { abbr: 'foo', name: 'bar' } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( Analytics.getDataLayerOptions )
        .toHaveBeenCalledWith( 'State Event: remove', 'foo' )
      expect( Analytics.sendEvent ).toHaveBeenCalled()
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
            { name: 'CA', issue: 'something', product: 'c prod', value: 3 },
            { name: 'MH', issue: 'real data', product: 'is messy', value: 9 },
          ]
        },
        query: {
          state: [ 'TX' ]
        },
        view: {
          printMode: false,
          width: 1000
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        data: [
          [
            {
              abbr: 'TX',
              name: 'TX',
              fullName: 'Texas',
              className: 'selected',
              issue: 'something',
              perCapita: '3.65',
              product: 'a prod',
              value: 100000
            },
            {
              abbr: 'LA',
              name: 'LA',
              fullName: 'Louisiana',
              className: 'deselected',
              issue: 'something',
              perCapita: '0.00',
              product: 'b prod',
              value: 2
            },
            {
              abbr: 'CA',
              name: 'CA',
              fullName: 'California',
              className: 'deselected',
              issue: 'something',
              perCapita: '0.00',
              product: 'c prod',
              value: 3
            },
            {
              abbr: 'MH',
              name: 'MH',
              fullName: '',
              className: 'deselected',
              issue: 'real data',
              perCapita: '9000.00',
              product: 'is messy',
              value: 9
            }
          ]
        ],
        dataNormalization: false,
        hasTip: true,
        printClass: '',
        stateFilters: [ 'TX' ],
        width: 1000
      } )
    } )
  } )
} )
