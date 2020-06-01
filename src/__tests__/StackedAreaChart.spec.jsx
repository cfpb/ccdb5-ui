import configureMockStore from 'redux-mock-store'
import {
  mapStateToProps,
  StackedAreaChart
} from '../components/Charts/StackedAreaChart'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

// this is how you override and mock an imported constructor
jest.mock( 'britecharts', () => {
  const props = [
    'stackedArea', 'margin', 'initializeVerticalMarker', 'colorSchema',
    'dateLabel', 'tooltipThreshold', 'grid', 'aspectRatio', 'isAnimated', 'on',
    'yAxisPaddingBetweenChart', 'width', 'height', 'areaCurve'
  ]

  const mock = {}

  for ( let i = 0; i < props.length; i++ ) {
    const propName = props[i]
    mock[propName] = jest.fn().mockImplementation( () => {
      return mock
    } )
  }

  return mock
} )

jest.mock( 'd3', () => {
  const props = [
    'select', 'each', 'node', 'getBoundingClientRect', 'width', 'datum', 'call',
    'remove', 'selectAll'
  ]

  const mock = {}

  for ( let i = 0; i < props.length; i++ ) {
    const propName = props[i]
    mock[propName] = jest.fn().mockImplementation( () => {
      return mock
    } )
  }

  // set narrow width value for 100% test coverage
  mock.width = 100

  return mock
} )

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {} )
  const colorMap = {
    foo: '#fff',
    bar: '#eee'
  }

  return renderer.create(
    <Provider store={ store }>
      <StackedAreaChart colorMap />
    </Provider>
  )
}

describe( 'component: StackedAreaChart', () => {
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
      mapDiv.setAttribute( 'id', 'stacked-area-chart-foo' )
      window.domNode = mapDiv
      document.body.appendChild( mapDiv )
    } )

    afterEach( () => {
      const div = document.getElementById( 'stacked-area-chart-foo' )
      if ( div ) {
        document.body.removeChild( div )
      }
      jest.clearAllMocks()
    } )

    it( 'does nothing when no data', () => {
      const target = shallow( <StackedAreaChart colorMap={ { foo: 'bar' } }
                                                data={ [] }
      /> )
      target._redrawChart = jest.fn()
      target.setProps( { data: [] } )
      expect( target._redrawChart ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'trigger a new update when data changes', () => {
      const target = shallow( <StackedAreaChart
        colorMap={ { foo: 'bar', shi: 'oio' } }
        data={ [ 23, 4, 3 ] }
        total={ 1000 }/> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { data: [ 2, 5 ] } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when printMode changes', () => {
      const target = shallow( <StackedAreaChart
        colorMap={ { foo: 'bar', shi: 'oio' } }
        data={ [ 23, 4, 3 ] }
        total={ 1000 }
        printMode={ 'false' }
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { printMode: true } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when width changes', () => {
      const target = shallow( <StackedAreaChart
        colorMap={ { foo: 'bar', shi: 'oio' } }
        data={ [ 23, 4, 3 ] }
        printMode={ 'false' }
        width={ 1000 }
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { width: 600 } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          baz: [ 1, 2, 3 ],
          dateInterval: 'Month'
        },
        trends: {
          colorMap: {},
          lens: 'Overview',
          results: {
            dateRangeArea: []
          },
          tooltip: {}
        },
        view: {
          printMode: false,
          width: 1000
        }
      }

      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        colorMap: {},
        data: [],
        interval: 'Month',
        lens: 'Overview',
        printMode: false,
        tooltip: {},
        width: 1000
      } )
    } )
  } )
} )
