import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { TrendsPanel, mapDispatchToProps } from '../Trends/TrendsPanel'
import { MODE_MAP } from '../../constants'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

jest.mock( 'britecharts', () => {
  const props = [
    'brush', 'line', 'tooltip', 'margin', 'backgroundColor', 'colorSchema',
    'enableLabels', 'labelsSize', 'labelsTotalCount', 'labelsNumberFormat',
    'outerPadding', 'percentageAxisToMaxRatio', 'yAxisLineWrapLimit',
    'dateRange', 'yAxisPaddingBetweenChart', 'width', 'wrapLabels', 'height',
    'on', 'initializeVerticalMarker', 'isAnimated', 'tooltipThreshold', 'grid',
    'aspectRatio', 'dateLabel'
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


function setupSnapshot( printMode, overview ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    aggs: {
      doc_count: 10000,
      total: 1000
    },
    query: {
      date_received_min: "2018-01-01T00:00:00.000Z",
      date_received_max: "2020-01-01T00:00:00.000Z",
      lens: overview ? 'Overview' : 'Product',
      subLens: ''
    },
    trends: {
      colorMap: { "Complaints": "#ADDC91", "Other": "#a2a3a4" },
      results: {
        "dateRangeBrush": [
          {
            "date": new Date( "2020-01-01T00:00:00.000Z" ),
            "value": 26413
          }, {
            "date": new Date( "2020-02-01T00:00:00.000Z" ),
            "value": 25096
          }, {
            "date": new Date( "2020-03-01T00:00:00.000Z" ),
            "value": 29506
          }, {
            "date": new Date( "2020-04-01T00:00:00.000Z" ),
            "value": 35112
          }, {
            "date": new Date( "2020-05-01T00:00:00.000Z" ),
            "value": 9821
          } ],
        "dateRangeLine": {
          "dataByTopic": [ {
            "topic": "Complaints",
            "topicName": "Complaints",
            "dashed": false,
            "show": true,
            "dates": [ {
              "date": "2020-03-01T00:00:00.000Z",
              "value": 29506
            }, {
              "date": "2020-04-01T00:00:00.000Z",
              "value": 35112
            }, { "date": "2020-05-01T00:00:00.000Z", "value": 9821 } ]
          } ]
        }
      }
    },
    view: {
      printMode,
      width: 900
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <TrendsPanel
          onChartType={ jest.fn() }
          onInterval={ jest.fn() }
          onLens={ jest.fn() }
          chartType={ 'line' }
          dataLensData={ { data: [], colorScheme: [] } }
          issueData={ { data: [], colorScheme: [] } }
          productData={ { data: [], colorScheme: [] } }
          overview={ overview }
        />
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:TrendsPanel', () => {
  it( 'renders without crashing', () => {
    const target = setupSnapshot( false, true )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders print mode without crashing', () => {
    const target = setupSnapshot( true, true )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders external Tooltip without crashing', () => {
    const target = setupSnapshot( true, false )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into changeChartType', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch )
        .onChartType( {
          target: {
            value: 'foo'
          }
        } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
    it( 'hooks into changeChartType', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch )
        .onChartType( {
          target: {
            value: 'foo'
          }
        } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
    it( 'hooks into changeDateInterval', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch )
        .onInterval( {
          target: {
            value: 'foo'
          }
        } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
    it( 'hooks into changeDataLens', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch )
        .onLens( {
          target: {
            value: 'foo'
          }
        } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )

  } )
} )
