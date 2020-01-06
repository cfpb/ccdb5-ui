import configureMockStore from 'redux-mock-store'
import { mapStateToProps, RowChart } from '../RowChart'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

// this is how you override and mock an imported constructor
jest.mock( 'britecharts', () => {
  const props = [
    'row', 'margin', 'backgroundColor', 'enableLabels', 'labelsSize',
    'labelsTotalCount', 'labelsNumberFormat', 'outerPadding',
    'percentageAxisToMaxRatio', 'yAxisLineWrapLimit',
    'yAxisPaddingBetweenChart', 'width', 'wrapLabels', 'height'
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

  return mock
} )

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {}
  } )

  return renderer.create(
    <Provider store={ store }>
      <RowChart aggtype={'foo'}/>
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
      mapDiv.setAttribute( 'id', 'row-chart-foo' )
      window.domNode = mapDiv
      document.body.appendChild( mapDiv )
    } )

    afterEach( () => {
      const div = document.getElementById( 'row-chart-foo' )
      if ( div ) {
        document.body.removeChild( div )
      }
      jest.clearAllMocks()
    } )

    it( 'does nothing when no data', () => {
      const target = shallow( <RowChart data={ [] } aggtype={'foo'}/> )
      target._redrawChart = jest.fn()
      target.setProps( { data: [] } )
      expect(  target._redrawChart ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'trigger a new update when data changes', () => {
      const target = shallow( <RowChart data={ [ 23, 4, 3 ] } aggtype={'foo'} total={1000}/> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn(target.instance(), '_redrawChart')
      target.setProps( { data: [ 2, 5 ] } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          baz: [ 1, 2, 3 ]
        },
        map: {
          baz: [ 1, 2, 3 ]
        },
        results: {
          total: 100
        }
      }
      const ownProps = {
        aggtype: 'baz'
      }
      let actual = mapStateToProps( state, ownProps )
      expect( actual ).toEqual( {
        data: [],
        total: 100
      } )
    } )
  } )

} )
