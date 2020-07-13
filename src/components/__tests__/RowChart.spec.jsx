import * as trendsUtils from '../../utils/trends'
import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps,
  mapStateToProps,
  RowChart
} from '../Charts/RowChart'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

// this is how you override and mock an imported constructor
jest.mock( 'britecharts', () => {
  const props = [
    'row', 'margin', 'backgroundColor', 'colorSchema', 'enableLabels',
    'labelsSize', 'labelsTotalCount', 'labelsNumberFormat', 'outerPadding',
    'percentageAxisToMaxRatio', 'yAxisLineWrapLimit', 'miniTooltip',
    'yAxisPaddingBetweenChart', 'width', 'wrapLabels', 'height', 'on',
    'valueFormatter', 'paddingBetweenGroups'
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
    'remove', 'selectAll', 'on'
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
  const store = mockStore( {
    printMode: false,
    width: 1000
  } )

  return renderer.create(
    <Provider store={ store }>
      <RowChart id={ 'foo' }
                data={ [ 1, 2, 3 ] }
                title={ 'Foo title we want' }
                colorScheme={ [] }
                total={ 1000 }
      />
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
      const target = shallow( <RowChart
        colorScheme={ [] }
        data={ [] }
        id={ 'foo' }
        title={ 'test' }
        total={ 0 }
      /> )
      target._redrawChart = jest.fn()
      target.setProps( { data: [] } )
      expect( target._redrawChart ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'handles Trend cookie flag', () => {
      const target = shallow( <RowChart
        colorScheme={ [] }
        showTrends={ true }
        title={ 'test' }
        data={ [ 23, 4, 3 ] }
        id={ 'foo' }
        total={ 1000 }
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( {
        data: [
          { name: 'More Information about xy', value: 10 },
          { name: 'More Information about z', value: 10 },
          { name: 'Something else nformation abou', value: 10 }
        ]
      } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when data changes', () => {
      const target = shallow( <RowChart
        colorScheme={ [] }
        title={ 'test' }
        data={ [ 23, 4, 3,
          { name: 'More Information about xy', value: 10 },
          { name: 'Athing about xy', value: 10 }
        ] }
        id={ 'foo' }
        total={ 1000 }
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { data: [ 2, 5 ] } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when printMode changes', () => {
      const target = shallow( <RowChart colorScheme={ [] }
                                        title={ 'test' }
                                        data={ [ 23, 4, 3 ] }
                                        id={ 'foo' }
                                        total={ 1000 }
                                        printMode={ 'false' }
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { printMode: true } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when width changes', () => {
      const target = shallow( <RowChart colorScheme={ [] }
                                        title={ 'test' }
                                        data={ [ 23, 4, 3 ] }
                                        id={ 'foo' }
                                        total={ 1000 }
                                        printMode={ 'false' }
                                        width={ 1000 }
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { width: 600 } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'calls select Focus with a lens', () => {
      const cb = jest.fn()
      const target = shallow( <RowChart
        selectFocus={ cb }
        colorScheme={ [] }
        title={ 'test' }
        lens={ 'Boo' }
        data={ [ 23, 4, 3 ] }
        id={ 'foo' }
        total={ 1000 }
      /> )
      target.instance()._selectFocus( { name: 'foo' } )
      expect( cb ).toHaveBeenCalledTimes( 1 )
      expect( cb ).toHaveBeenCalledWith( { name: 'foo' }, 'Boo' )
    } )

    it( 'calls select Focus with product lens - Overview', () => {
      const cb = jest.fn()
      const target = shallow( <RowChart
        lens={ 'Overview' }
        selectFocus={ cb }
        colorScheme={ [] }
        title={ 'test' }
        data={ [ 23, 4, 3 ] }
        id={ 'foo' }
        total={ 1000 }
      /> )
      target.instance()._selectFocus( { name: 'foo' } )
      expect( cb ).toHaveBeenCalledTimes( 1 )
      expect( cb ).toHaveBeenCalledWith( { name: 'foo' }, 'Product' )
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    let dispatch
    beforeEach( () => {
      dispatch = jest.fn()
    } )

    afterEach( () => {
      jest.clearAllMocks()
    } )

    it( 'hooks into changeFocus', () => {
      spyOn( trendsUtils, 'scrollToFocus' )
      mapDispatchToProps( dispatch )
        .selectFocus( { parent: 'mom', name: 'dad' } )
      expect( dispatch.mock.calls ).toEqual( [ [ {
        focus: 'mom',
        requery: 'REQUERY_ALWAYS',
        type: 'FOCUS_CHANGED'
      } ] ] )
      expect( trendsUtils.scrollToFocus ).toHaveBeenCalled()
    } )

    it( 'hooks into collapseTrend', () => {
      spyOn( trendsUtils, 'scrollToFocus' )
      mapDispatchToProps( dispatch ).collapseRow( 'Some Expanded row' )
      expect( dispatch.mock.calls ).toEqual( [ [ {
        requery: "REQUERY_NEVER",
        type: "TREND_COLLAPSED",
        value: "Some Expanded row"
      } ] ] )
      expect( trendsUtils.scrollToFocus ).not.toHaveBeenCalled()
    } )

    it( 'hooks into expandTrend', () => {
      spyOn( trendsUtils, 'scrollToFocus' )
      mapDispatchToProps( dispatch ).expandRow( 'collapse row name' )
      expect( dispatch.mock.calls ).toEqual( [ [ {
        requery: "REQUERY_NEVER",
        type: "TREND_EXPANDED",
        value: "collapse row name"
      } ] ] )
      expect( trendsUtils.scrollToFocus ).not.toHaveBeenCalled()
    } )
  } )

  describe( 'mapStateToProps', () => {
    let state
    beforeEach( () => {
      state = {
        map: {
          expandableRows: [],
          expandedTrends: []
        },
        query: {
          lens: 'Foo',
          tab: 'Map'
        },
        trends: {
          expandableRows: [],
          expandedTrends: []
        },
        view: {
          printMode: false,
          showTrends: true,
          width: 1000
        }
      }
    } )
    it( 'maps state and props - Map', () => {
      const ownProps = {
        id: 'baz'
      }
      let actual = mapStateToProps( state, ownProps )
      expect( actual ).toEqual( {
        expandableRows: [],
        expandedTrends: [],
        lens: 'Product',
        printMode: false,
        showTrends: true,
        tab: 'Map',
        width: 1000
      } )
    } )

    it( 'maps state and props - Other', () => {
      const ownProps = {
        id: 'baz'
      }

      state.query.tab = 'Trends'

      let actual = mapStateToProps( state, ownProps )
      expect( actual ).toEqual( {
        expandableRows: [],
        expandedTrends: [],
        lens: 'Foo',
        printMode: false,
        tab: 'Trends',
        showTrends: true,
        width: 1000
      } )
    } )
  } )

  describe( 'helper functions', () => {
    it( 'gets height based on number of rows', () => {
      const target = mount( <RowChart colorScheme={ [] }
                                      title={ 'test' }
                                      total={ 10 }
                                      data={ [ 23, 4, 3 ] }
                                      id={ 'foo' }/> )
      let res = target.instance()._getHeight( 1 )
      expect( res ).toEqual( 100 )
      res = target.instance()._getHeight( 5 )
      expect( res ).toEqual( 300 )
    } )

    it( 'formats text of the tooltip', () => {
      const target = mount( <RowChart colorScheme={ [] }
                                      title={ 'test' }
                                      total={ 1000 }
                                      data={ [ 23, 4, 3 ] }
                                      id={ 'foo' }/> )
      let res = target.instance()._formatTip( 100000 )
      expect( res ).toEqual( '100,000 complaints' )
    } )

  } )

} )
