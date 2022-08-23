import configureMockStore from 'redux-mock-store'
import ReduxLineChart, {
  LineChart,
  mapDispatchToProps,
  mapStateToProps
} from '../Charts/LineChart'
import {shallow} from 'enzyme'
import {Provider} from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

// this is how you override and mock an imported constructor
jest.mock( 'britecharts', () => {
  const props = [
    'line', 'margin', 'backgroundColor', 'colorSchema', 'enableLabels',
    'labelsSize', 'labelsTotalCount', 'labelsNumberFormat', 'outerPadding',
    'percentageAxisToMaxRatio', 'yAxisLineWrapLimit', 'grid', 'dateLabel',
    'initializeVerticalMarker', 'yAxisPaddingBetweenChart', 'width', 'on',
    'wrapLabels', 'height', 'isAnimated', 'tooltipThreshold', 'aspectRatio',
    // tooltip specifics
    'tooltip', 'title', 'update', 'shouldShowDateInTitle', 'topicLabel'
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

function setupSnapshot(lens) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    query: {
      dateInterval: 'Month',
      date_received_min: '2012',
      date_received_max: '2016',
      lens: 'Overview'
    },
    trends: {
      colorMap: { Complaints: '#ADDC91', 'Other': '#a2a3a4' },
      lastDate: '2015-01-01',
      results: {
        dateRangeLine: {
          dataByTopic: [ {
            topic: 'Complaints',
            topicName: 'Complaints',
            dashed: false,
            show: true,
            dates: [
              { date: '2020-03-01T00:00:00.000Z', value: 29068 },
              { date: '2020-04-01T00:00:00.000Z', value: 35112 },
              { date: '2020-05-01T00:00:00.000Z', value: 9821 }
            ]
          } ]
        }
      },
      tooltip: false
    },
    view: {
      printMode: false,
      width: 1000
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <ReduxLineChart title={ 'foo' }/>
    </Provider>
  )
}

describe( 'component: LineChart', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot( 'Overview' )
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )

    it( 'renders data lens without crashing', () => {
      const target = setupSnapshot( 'Issue' )
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'componentDidUpdate', () => {
    let mapDiv
    const lastDate = '2020-05-01T00:00:00.000Z'
    const colorMap = {
      'Credit reporting': '#2cb34a',
      'Debt collection': '#addc91',
      'Credit card or prepaid card': '#257675',
      Mortgage: '#9ec4c3',
      'Checking or savings account': '#0072ce',
      Complaints: '#ADDC91',
      'All other products': '#a2a3a4'
    }
    const data = {
      dataByTopic: [
        {
          topic: 'Credit reporting',
          topicName: 'Credit reporting',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-03-01T00:00:00.000Z', value: 17231 },
            { date: '2020-04-01T00:00:00.000Z', value: 21179 },
            { date: '2020-05-01T00:00:00.000Z', value: 6868 }
          ]
        },
        {
          topic: 'Debt collection',
          topicName: 'Debt collection',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-03-01T00:00:00.000Z', value: 4206 },
            { date: '2020-04-01T00:00:00.000Z', value: 4508 },
            { date: '2020-05-01T00:00:00.000Z', value: 1068 }
          ]
        },
        {
          topic: 'Credit card or prepaid card',
          topicName: 'Credit card or prepaid card',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-03-01T00:00:00.000Z', value: 2435 },
            { date: '2020-04-01T00:00:00.000Z', value: 3137 },
            { date: '2020-05-01T00:00:00.000Z', value: 712 }
          ]
        },
        {
          topic: 'Mortgage',
          topicName: 'Mortgage',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-03-01T00:00:00.000Z', value: 2132 },
            { date: '2020-04-01T00:00:00.000Z', value: 2179 },
            { date: '2020-05-01T00:00:00.000Z', value: 365 } ]
        },
        {
          topic: 'Checking or savings account',
          topicName: 'Checking or savings account',
          dashed: false,
          show: true,
          dates: [
            { date: '2020-03-01T00:00:00.000Z', value: 1688 },
            { date: '2020-04-01T00:00:00.000Z', value: 2030 },
            { date: '2020-05-01T00:00:00.000Z', value: 383 } ]
        } ]
    }
    beforeEach( () => {
      mapDiv = document.createElement( 'div' )
      mapDiv.setAttribute( 'id', 'line-chart-foo' )
      window.domNode = mapDiv
      document.body.appendChild( mapDiv )
    } )

    afterEach( () => {
      const div = document.getElementById( 'line-chart-foo' )
      if ( div ) {
        document.body.removeChild( div )
      }
      jest.clearAllMocks()
    } )

    it( 'does nothing when no data', () => {
      const target = shallow( <LineChart data={ [] } title={ 'foo' }/> )
      target._redrawChart = jest.fn()
      target.setProps( { data: [] } )
      expect( target._redrawChart ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'trigger a new update when data changes', () => {
      const target = shallow( <LineChart tooltipUpdated={ jest.fn() }
                                         colorMap={ colorMap }
                                         data={ data }
                                         dateRange={{
                                           from: '1/1/2020',
                                           to: '5/30/2021'
                                         }}
                                         interval={'Month'}
                                         processData={ data }
                                         title={ 'foo' }
                                         tooltip={{date: '5/30/2021'}}
                                         lastDate={ lastDate }
                                         showChart={true}
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      const newData = {
        dataByTopic: [
          {
            topic: 'Mortgage',
            topicName: 'Mortgage',
            dashed: false,
            show: true,
            dates: [
              { date: '2020-03-01T00:00:00.000Z', value: 2132 },
              { date: '2020-04-01T00:00:00.000Z', value: 2179 },
              { date: '2020-05-01T00:00:00.000Z', value: 365 } ]
          },
          {
            topic: 'Checking or savings account',
            topicName: 'Checking or savings account',
            dashed: false,
            show: true,
            dates: [
              { date: '2020-03-01T00:00:00.000Z', value: 1688 },
              { date: '2020-04-01T00:00:00.000Z', value: 2030 },
              { date: '2020-05-01T00:00:00.000Z', value: 383 } ]
          } ]
      }

      target.setProps( { data: newData } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when printMode changes', () => {
      const target = shallow( <LineChart data={ data }
                                         tooltipUpdated={ jest.fn() }
                                         colorMap={ colorMap }
                                         printMode={ 'false' }
                                         dateRange={{
                                           from: '1/1/2020',
                                           to: '5/30/2021'
                                         }}
                                         interval={'Month'}
                                         processData={ data }
                                         title={ 'foo' }
                                         tooltip={{date: '5/30/2021'}}
                                         lastDate={ lastDate }
                                         showChart={true}
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { printMode: true } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'trigger a new update when width changes', () => {
      const target = shallow( <LineChart colorMap={ colorMap }
                                         data={ data }
                                         dateRange={{
                                           from: '1/1/2020',
                                           to: '1/1/2021'
                                         }}
                                         interval={'Month'}
                                         tooltipUpdated={ jest.fn() }
                                         printMode={ 'false' }
                                         processData={ data }
                                         width={ 1000 }
                                         title={ 'foo' }
                                         tooltip={{date: '5/30/2021'}}
                                         lastDate={ lastDate }
                                         showChart={true}
      /> )
      target._redrawChart = jest.fn()
      const sp = jest.spyOn( target.instance(), '_redrawChart' )
      target.setProps( { width: 600 } )
      expect( sp ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    it( 'provides a way to call updateTrendsTooltip', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).tooltipUpdated( 'foo' )
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: 'REQUERY_NEVER',
          type: 'TRENDS_TOOLTIP_CHANGED',
          value: 'foo'
        } ]
      ] )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          dateInterval: 'Month',
          date_received_min: '',
          date_received_max: '',
          lens: 'Overview'
        },
        trends: {
          colorMap: {},
          results: {
            dateRangeLine: []
          },
          tooltip: false
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
        dateRange: {
          from: '',
          to: ''
        },
        lens: 'Overview',
        printMode: false,
        processData: [],
        tooltip: false,
        showChart: false,
        width: 1000
      } )
    } )
  } )

  describe( 'tooltip events', () => {
    let target, cb

    beforeEach( () => {
      cb = jest.fn()
    } )

    it( 'updates external tooltip with different data', () => {
      const data = {
        dataByTopic: []
      }
      target = shallow( <LineChart data={ data }
                                   interval={ 'Month' }
                                   dateRange={ { from: '2012', to: '2020' } }
                                   title={ 'foo' }
                                   tooltip={ { date: '2000' } }
                                   tooltipUpdated={ cb }
      /> )
      const instance = target.instance()
      instance._updateTooltip( { date: '2012', value: 2000 }  )
      expect( cb ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'does not external tooltip with same data', () => {
      const data = {
        dataByTopic: []
      }
      target = shallow( <LineChart data={ data }
                                   interval={ 'Month' }
                                   dateRange={ { from: '2012', to: '2020' } }
                                   title={ 'foo' }
                                   tooltip={ { date: '2000' } }
                                   tooltipUpdated={ cb }
      /> )
      const instance = target.instance()
      instance._updateTooltip( { date: '2000', value: 100 }  )
      expect( cb ).toHaveBeenCalledTimes( 0 )
    } )

    it( 'internal tooltip', () => {
      const data = {
        dataByTopic: []
      }
      target = shallow( <LineChart data={ data } interval={ 'Month' }
                                   dateRange={ { from: '2012', to: '2020' } }
                                   title={ 'foo' }/> )
      const instance = target.instance()
      instance.tip = {
        title: jest.fn(),
        update: jest.fn()
      }
      instance._updateInternalTooltip( { date: '2012', value: 200 }, {}, 0 )
      expect( instance.tip.title ).toHaveBeenCalledTimes( 1 )
    } )
  } )

  describe( 'helpers', () => {
    describe( '_chartWidth', () => {
      it( 'gets print width - Overview', () => {
        const data = {
          dataByTopic: []
        }
        const target = shallow( <LineChart printMode={ true }
                                           lens={ 'Overview' }
                                           data={ data } interval={ 'Month' }
                                           dateRange={ {
                                             from: '2012',
                                             to: '2020'
                                           } }
                                           title={ 'foo' }/> )
        expect( target.instance()._chartWidth( '#foo' ) )
          .toEqual( 750 )
      } )
    } )
  } )

} )
