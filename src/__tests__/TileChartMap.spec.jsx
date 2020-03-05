import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, TileChartMap
} from '../TileChartMap'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import TileMap from '../TileMap'

jest.mock( '../TileMap' )

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

    describe('print mode', () => {
      it( 'toggles print mode', () => {
        target = shallow( <TileChartMap togglePrintMode={actionMock}/> )
        const instance = target.instance()
        instance._togglePrintStyles()
        expect( actionMock ).toHaveBeenCalledTimes( 1 )
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
  } )

  describe( 'event listeners', () => {
    beforeEach( () => {
      window.addEventListener = jest.fn();
      window.removeEventListener = jest.fn();
    } );

    it( 'unregisters the same listener on unmount' , () => {
        const a = window.addEventListener
        const b = window.removeEventListener

        target = shallow( <TileChartMap /> )
        expect(a.mock.calls.length).toBe(3)
        expect(a.mock.calls[0][0]).toBe('afterprint')
        expect(a.mock.calls[1][0]).toBe('beforeprint')
        expect(a.mock.calls[2][0]).toBe('resize')

        target.unmount()
        expect(b.mock.calls.length).toBe(3)
        expect(b.mock.calls[0][0]).toBe('afterprint')
        expect(b.mock.calls[1][0]).toBe('beforeprint')
        expect(b.mock.calls[2][0]).toBe('resize')

        expect(a.mock.calls[0][1]).toBe(b.mock.calls[0][1])
      } );
  } );

  describe( 'mapDispatchToProps', () => {
    beforeEach( () => {
      jest.clearAllMocks()
    } )
    it( 'provides a way to call addState', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).addState()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )

    it( 'provides a way to call removeState', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).removeState()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
    it( 'provides a way to call togglePrintMode', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).togglePrintMode()
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
            { name: 'CA', issue: 'something', product: 'c prod', value: 3 },
            { name: 'MH', issue: 'real data', product: 'is messy', value: 9 },
          ]
        },
        query: {
          state: [ 'TX' ]
        },
        view: {
          printMode: false
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
        printMode: false,
        stateFilters: [ 'TX' ]
      } )
    } )
  } )
} )
