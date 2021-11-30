import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import ReduxTrendsPanel, {
  TrendsPanel,
  mapDispatchToProps
} from '../Trends/TrendsPanel'
import { MODE_TRENDS } from '../../constants'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import * as utils from '../../utils'

jest.mock( 'britecharts', () => {
  const props = [
    'brush', 'line', 'tooltip', 'margin', 'backgroundColor', 'colorSchema',
    'enableLabels', 'labelsSize', 'labelsTotalCount', 'labelsNumberFormat',
    'outerPadding', 'percentageAxisToMaxRatio', 'yAxisLineWrapLimit',
    'dateRange', 'yAxisPaddingBetweenChart', 'width', 'wrapLabels', 'height',
    'on', 'initializeVerticalMarker', 'isAnimated', 'tooltipThreshold', 'grid',
    'aspectRatio', 'dateLabel', 'shouldShowDateInTitle', 'topicLabel', 'title'
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

function setupEnzyme( { focus, overview, lens, subLens } ) {
  const props = {
    focus,
    lenses: [ 'Foo', 'Baz', 'Bar' ],
    intervals: [ 'Month', 'Quarter', 'Nickel', 'Day' ],
    overview,
    lens,
    subLens,
    onChartType: jest.fn(),
    onInterval: jest.fn(),
    onLens: jest.fn()
  }
  const target = shallow( <TrendsPanel { ...props }/> )
  return target
}

function setupSnapshot( { chartType,
                          company,
                          focus,
                          lens,
                          subLens,
                          trendsDateWarningEnabled,
                          width }) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    aggs: {
      doc_count: 10000,
      total: 1000
    },
    query: {
      company,
      date_received_min: new Date( '1/1/2018' ),
      date_received_max: new Date( '1/1/2020' ),
      lens,
      subLens,
      tab: MODE_TRENDS,
      trendsDateWarningEnabled
    },
    trends: {
      chartType,
      colorMap: { "Complaints": "#ADDC91", "Other": "#a2a3a4" },
      focus,
      lens,
      results: {
        "dateRangeLine": {
          "dataByTopic": [ {
            "topic": "Complaints",
            "topicName": "Complaints",
            "dashed": false,
            "show": true,
            "dates": [
              { "date": "2020-03-01T00:00:00.000Z", "value": 29506 },
              { "date": "2020-04-01T00:00:00.000Z", "value": 35112 },
              { "date": "2020-05-01T00:00:00.000Z", "value": 9821 }
            ]
          } ]
        },
        issue: [ { name: 'adg', value: 123 } ],
        product: [ { name: 'adg', value: 123 } ],
        company: [ { name: 'adg', value: 123 } ]
      },
      total: 10000
    },
    view: {
      expandedRows: [],
      width
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <ReduxTrendsPanel/>
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:TrendsPanel', () => {
  describe( 'Snapshots', () => {
    let params
    beforeEach(()=>{
      params = {
        chartType: 'line',
        company: false,
        expandedRows: [],
        focus: '',
        lens: 'Overview',
        printMode: false,
        showMobileFilters: false,
        subLens: 'sub_product',
        trendsDateWarningEnabled: false,
        width: 1000
      }
    })

    it( 'renders company Overlay without crashing', () => {
      params.company = []
      params.lens = 'Company'

      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders lineChart Overview without crashing', () => {
      params.lens = 'Overview'
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders area without crashing', () => {
      params.chartType = 'area'
      params.lens = 'Product'
      params.subLens = 'sub_product'
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders date warning without crashing', () => {
      params.trendsDateWarningEnabled = true
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders Focus without crashing', () => {
      params.focus = 'Yippe'
      params.lens = 'Product'
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders print mode without crashing', () => {
      params.printMode = true
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders mobile filters without crashing', () => {
      params.width = 600
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders external Tooltip without crashing', () => {
      params.lens = 'Product'
      const target = setupSnapshot( params )
      const tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'helpers', () => {
    describe( 'areaChartTitle', () => {
      let params
      beforeEach( () => {
        params = {
          focus: '',
          overview: false,
          lens: 'Overview',
          subLens: 'sub_product'
        }
      } )
      it( 'gets area chart title - Overview', () => {
        params.overview = true
        const target = setupEnzyme( params )
        expect( target.instance()._areaChartTitle() )
          .toEqual( 'Complaints by date received by the CFPB' )
      } )

      it( 'gets area chart title - Data Lens', () => {
        params.lens = 'Something'
        const target = setupEnzyme( params )
        expect( target.instance()._areaChartTitle() )
          .toEqual( 'Complaints by date received by the CFPB' )
      } )

      it( 'gets area chart title - Focus', () => {
        params.focus = 'Hello'
        params.lens = 'Product'
        const target = setupEnzyme( params )
        expect( target.instance()._areaChartTitle() )
          .toEqual( 'Complaints by sub-products, by date received by the CFPB' )
      } )
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    let dispatch, gaSpy
    beforeEach(()=>{
      dispatch = jest.fn()
      gaSpy = jest.spyOn( utils, 'sendAnalyticsEvent' )
    })

    afterEach( () => {
      jest.clearAllMocks()
    } )

    it( 'hooks into changeDateInterval', () => {
      mapDispatchToProps( dispatch )
        .onInterval( {
          target: {
            value: 'foo date'
          }
        } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( gaSpy ).toHaveBeenCalledWith( 'Dropdown', 'Trends:foo date' )
    } )
    it( 'hooks into changeDataLens', () => {
      mapDispatchToProps( dispatch )
        .onLens( {
          target: {
            value: 'foo lens'
          }
        } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( gaSpy ).toHaveBeenCalledWith( 'Dropdown', 'Trends:foo lens' )
    } )

    it( 'hooks into dismissWarning', () => {
      mapDispatchToProps( dispatch ).onDismissWarning()
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: 'REQUERY_NEVER',
          type: 'TRENDS_DATE_WARNING_DISMISSED'
        } ]
      ] )
    } )
  } )
} )
