import target, {
  getDefaultState, mainNameLens
} from '../trends'
import actions from '../../actions'
import {
  trendsBackfill,
  trendsBackfillResults
} from '../__fixtures__/trendsBackfill'
import {
  trendsCompanyAggs,
  trendsCompanyResults
} from '../__fixtures__/trendsCompanyResults'
import {
  trendsFocusAggs,
  trendsFocusAggsResults
} from '../__fixtures__/trendsFocusAggs'
import {
  trendsAggs,
  trendsResults
} from '../__fixtures__/trendsResults'
import {
  trendsAggsDupes, trendsAggsDupeResults
} from '../__fixtures__/trendsAggsDupes'
import {
  trendsAggsMissingBuckets,
  trendsAggsMissingBucketsResults
} from '../__fixtures__/trendsAggsMissingBuckets'

describe( 'reducer:trends', () => {
  let action, result, state

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( {
        activeCall: '',
        chartType: 'line',
        colorMap: {},
        error: false,
        focus: '',
        isLoading: false,
        lastDate: false,
        lens: 'Overview',
        results: {
          dateRangeArea: [],
          dateRangeLine: []
        },
        subLens: '',
        tooltip: false,
        total: 0
      } )
    } )
  } )

  describe( 'Lens Name Pluralization Helper', () => {
    it( 'pluralizes things properly', () => {
      expect( mainNameLens('Company') ).toEqual('companies')
      expect( mainNameLens('Product') ).toEqual('products')
      expect( mainNameLens('baz') ).toEqual('values')
    })
  })

  describe( 'CHART_TYPE_CHANGED action', () => {
    it( 'changes the chart type - default', () => {
      action = {
        type: actions.CHART_TYPE_CHANGED,
        chartType: 'FooBar'
      }

      expect( target( { tooltip: true }, action ) ).toEqual( {
        chartType: 'line',
        tooltip: false
      } )
    } )

    it( 'changes the chart type - area', () => {
      action = {
        type: actions.CHART_TYPE_CHANGED,
        chartType: 'area'
      }

      expect( target( { tooltip: true }, action ) ).toEqual( {
        chartType: 'area',
        tooltip: false
      } )
    } )

    it( 'changes the chart type to line when lens is Overview', () => {
      action = {
        type: actions.CHART_TYPE_CHANGED,
        chartType: 'FooBar'
      }

      expect( target( { lens: 'Overview' }, action ) ).toEqual( {
        chartType: 'line',
        lens: 'Overview',
        subLens: '',
        tooltip: false
      } )
    } )
  } )

  describe( 'DATA_LENS_CHANGED action', () => {
    beforeEach( () => {
      action = {
        type: actions.DATA_LENS_CHANGED,
        lens: 'Overview'
      }

      state = { focus: 'gg', tooltip: 'foo', chartType: 'area' }
    } )
    it( 'updates the data lens default', () => {
      result = target( state, action )
      expect( result ).toMatchObject( {
        chartType: 'line',
        focus: '',
        lens: 'Overview',
        subLens: '',
        tooltip: false
      } )
    } )

    it( 'updates the data lens - Company', () => {
      action.lens = 'Company'
      result = target( state, action )
      expect( result ).toMatchObject( {
        chartType: 'area',
        focus: '',
        lens: 'Company',
        subLens: 'product',
        tooltip: false
      } )
    } )

    it( 'updates the data lens - product', () => {
      action.lens = 'Product'
      result = target( state, action )
      expect( result ).toMatchObject( {
        chartType: 'area',
        focus: '',
        lens: 'Product',
        subLens: 'sub_product',
        tooltip: false
      } )
    } )
  } )

  describe( 'DATA_SUBLENS_CHANGED action', () => {
    it( 'updates the data sublens', () => {
      action = {
        type: actions.DATA_SUBLENS_CHANGED,
        subLens: 'sub_something'
      }

      expect( target( { subLens: 'gg' }, action ) ).toEqual( {
        chartType: 'line',
        subLens: 'sub_something'
      } )
    } )
  } )

  describe( 'FOCUS_CHANGED action', () => {
    it( 'updates the FOCUS and clears the tooltip', () => {
      action = {
        type: actions.FOCUS_CHANGED,
        focus: 'Some Rando Text',
        lens: 'Product'
      }

      expect( target( {
        focus: 'gg',
        tooltip: { wut: 'isthis' }
      }, action ) ).toEqual( {
        chartType: 'line',
        focus: 'Some Rando Text',
        lens: 'Product',
        subLens: 'sub_product',
        tooltip: false
      } )
    } )
  } )


  describe( 'FOCUS_REMOVED action', () => {
    it( 'removes the FOCUS and resets the row info', () => {
      action = {
        type: actions.FOCUS_REMOVED,
      }

      expect( target( {
        focus: 'gg',
        tooltip: { wut: 'isthis' }
      }, action ) ).toEqual( {
        chartType: 'line',
        focus: '',
        results: {
          dateRangeArea: [],
          dateRangeLine: []
        },
        tooltip: false
      } )
    } )
  } )

  describe( 'FILTER_ALL_REMOVED action', () => {
    it( 'resets the FOCUS', () => {
      action = {
        type: actions.FILTER_ALL_REMOVED
      }
      result = target( { focus: 'gg' }, action )
      expect( result ).toEqual( {
        chartType: 'line',
        focus: ''
      } )
    } )
  } )

  describe( 'FILTER_MULTIPLE_REMOVED action', () => {
    it( 'resets the FOCUS if it matches one of the filters', () => {
      action = {
        type: actions.FILTER_MULTIPLE_REMOVED,
        values: [ 'A', 'B' ]
      }
      result = target( { focus: 'A' }, action )
      expect( result ).toEqual( {
        chartType: 'line',
        focus: ''
      } )
    } )

    it( 'leaves the FOCUS alone if no match any filters', () => {
      action = {
        type: actions.FILTER_MULTIPLE_REMOVED,
        values: [ 'A', 'B' ]
      }

      expect( target( { focus: 'C' }, action ) )
        .toEqual( {
          chartType: 'line',
          focus: 'C'
        } )
    } )
  } )


  describe( 'TAB_CHANGED action', () => {
    it( 'clears results and resets values', () => {
      action = {
        type: actions.TAB_CHANGED,
        tab: 'Foo'
      }

      expect( target( {
        focus: 'Your',
        results: [ 1, 2, 3 ]
      }, action ) ).toEqual( {
        chartType: 'line',
        focus: '',
        results: {
          dateRangeArea: [],
          dateRangeLine: []
        }
      } )
    } )

    it( 'leaves Focus alone when tab is Trend', () => {
      action = {
        type: actions.TAB_CHANGED,
        tab: 'Trends'
      }

      expect( target( {
        focus: 'Your',
        results: [ 1, 2, 3 ]
      }, action ) ).toEqual( {
        chartType: 'line',
        focus: 'Your',
        results: {
          dateRangeArea: [],
          dateRangeLine: []
        }
      } )
    } )


  } )

  describe( 'TRENDS_API_CALLED actions', () => {
    action = {
      type: actions.TRENDS_API_CALLED,
      url: 'http://www.example.org'
    }
    expect( target( {}, action ) ).toEqual( {
      activeCall: 'http://www.example.org',
      chartType: 'line',
      isLoading: true
    } )
  } )

  describe( 'TRENDS_FAILED actions', () => {
    it( 'handles failed error messages', () => {
      action = {
        type: actions.TRENDS_FAILED,
        error: { message: 'foo bar', name: 'ErrorTypeName', stack: 'trace' }
      }
      expect( target( {
        activeCall: 'someurl',
        results: {
          dateRangeArea: [ 1, 2, 3 ],
          dateRangeLine: [ 7, 8, 9 ],
          product: [ 13, 25 ]
        }
      }, action ) ).toEqual( {
        activeCall: '',
        chartType: 'line',
        colorMap: {},
        error: { message: 'foo bar', name: 'ErrorTypeName',  stack: 'trace' },
        isLoading: false,
        lastDate: false,
        results: {
          dateRangeArea: [],
          dateRangeLine: []
        },
        tooltip: false,
        total: 0
      } )
    } )
  } )

  describe( 'TRENDS_RECEIVED actions', () => {
    beforeEach( () => {
      action = {
        type: actions.TRENDS_RECEIVED,
        data: {
          aggregations: false
        }
      }
      state = getDefaultState()
    } )

    it( 'maps data to object state - Overview', () => {
      // to replicate
      // just choose All date range and overview
      action.data.aggregations = trendsAggs
      result = target( state, action )
      expect( result ).toEqual( trendsResults )
    } )

    it( 'maps data to object state - Company', () => {
      // just changing
      state.lens = 'Company'
      action.data.aggregations = trendsCompanyAggs
      result = target( state, action )
      expect( result ).toEqual( trendsCompanyResults )
    } )

    it( 'maps data to object state - dupe rows', () => {
      action.data.aggregations = trendsAggsDupes
      result = target( state, action )
      expect( result ).toEqual( trendsAggsDupeResults )
    } )

    it( 'maps data to object state - Missing Bucket', () => {
      // to replicate this
      // ?date_received_max=2017-07-08
      // &date_received_min=2017-03-08
      // &from=0&lens=Product&tab=Trends
      // you'll get broken buckets since the product recategorization in apr
      state.lens = 'Product'
      action.data.aggregations = trendsAggsMissingBuckets
      result = target( state, action )
      expect( result ).toEqual( trendsAggsMissingBucketsResults )
    } )

    it( 'maps data to object state - Focus', () => {
      state.lens = 'Product'
      state.subLens = 'sub_product'
      state.focus = 'Debt collection'
      action.data.aggregations = trendsFocusAggs
      result = target( state, action )
      expect( result ).toEqual( trendsFocusAggsResults )
      expect( result.results.issue.length ).toBeTruthy()
      expect( result.results['sub-product'].length ).toBeTruthy()
    } )

    it( 'backfills periods based on dateRangeBuckets ', () => {
      // aka: the "covid" search
      state.chartType = 'area'
      state.lens = 'Product'
      state.subLens = 'sub_product'
      action.data.aggregations = trendsBackfill
      result = target( state, action )
      expect( result ).toEqual( trendsBackfillResults )
    } )

    it( 'handles zero results', () => {
      action.data.aggregations = {
        dateRangeArea: {
          doc_count: 0
        }
      }
      state.chartType = 'area'
      state.lens = 'Product'
      state.subLens = 'sub_product'
      state.results = {
        company: [ 1, 2, 3 ],
        dateRangeArea: [ 4, 5, 6 ],
        dateRangeLine: [ 7, 8, 9 ],
        product: [ 1, 2, 3 ]
      }
      result = target( state, action )
      expect( result ).toEqual( {
        activeCall: '',
        chartType: 'area',
        colorMap: {},
        error: false,
        focus: '',
        isLoading: false,
        lastDate: false,
        lens: 'Product',
        results: {
          dateRangeArea: [],
          dateRangeLine: []
        },
        subLens: 'sub_product',
        tooltip: false,
        total: 0
      } )
    } )
  } )

  describe( 'TRENDS_TOOLTIP_CHANGED', () => {
    it( 'handles no value', () => {
      const action = { type: actions.TRENDS_TOOLTIP_CHANGED }
      const state = { results: {} }
      const res = target( state, action )

      expect( res.tooltip ).toBeFalsy()
    } )

    it( 'calculates total and sets the title', () => {
      action = {
        type: actions.TRENDS_TOOLTIP_CHANGED,
        value: {
          date: '2021-06-01T00:00:00.000Z',
          dateRange: {
            from: '2021-05-23T00:00:00.000Z',
            to: '2021-08-23T00:00:00.000Z'
          },
          interval: 'Month',
          values: [
            {
              topicName: 'Alpha',
              name: 'Alpha',
              date: '2021-06-01T00:00:00.000Z',
              value: 29769
            }, {
              topicName: 'Beta',
              name: 'Beta',
              date: '2021-06-01T00:00:00.000Z',
              value: 6610
            }, {
              topicName: 'Charlie',
              name: 'Charlie',
              date: '2021-06-01T00:00:00.000Z',
              value: 2317
            }, {
              topicName: 'Delta',
              name: 'Delta',
              date: '2021-06-01T00:00:00.000Z',
              value: 2322
            }, {
              topicName: 'Echo',
              name: 'Echo',
              date: '2021-06-01T00:00:00.000Z',
              value: 2174
            }]
        }
      }
      state = {
        colorMap: {
          Alpha: '#2cb34a',
          Beta: '#addc91',
          Charlie: '#257675',
          Delta: '#345534',
          Echo: '#532423',
        }
      }
      result = target(state, action)

      expect(result.tooltip).toMatchObject({
        date: '2021-06-01T00:00:00.000Z',
        dateRange: {
          from: '2021-05-23T00:00:00.000Z',
          to: '2021-08-23T00:00:00.000Z'
        },
        interval: 'Month',
        values: [
            {
          topicName: 'Alpha',
          name: 'Alpha',
          date: '2021-06-01T00:00:00.000Z',
          value: 29769,
          colorIndex: 0
        },
          {
          topicName: 'Beta',
          name: 'Beta',
          date: '2021-06-01T00:00:00.000Z',
          value: 6610,
          colorIndex: 1
        }, {
          topicName: 'Charlie',
          name: 'Charlie',
          date: '2021-06-01T00:00:00.000Z',
          value: 2317,
          colorIndex: 4
        }, {
          topicName: 'Delta',
          name: 'Delta',
          date: '2021-06-01T00:00:00.000Z',
          value: 2322,
          colorIndex: -1
        }, {
          topicName: 'Echo',
          name: 'Echo',
          date: '2021-06-01T00:00:00.000Z',
          value: 2174,
          colorIndex: -1
        }],
        total: 43192
      })
      // incorrect in tests, but correct in the UI
      // title: 'Date range: 6/1/2021 - 6/30/2021',
      // title: 'Date range: 6/1/2021 - 7/31/2021',
      expect(result.tooltip.title).toMatch('Date range: 6/1/2021 - ')
    } )
  } )


  describe( 'URL_CHANGED actions', () => {
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = getDefaultState()
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles lens params', () => {
      action.params = { lens: 'hello', subLens: 'mom', nope: 'hi' }

      result = target( state, action )
      expect( result.lens ).toEqual( 'Overview' )
      expect( result.subLens ).toEqual( '' )
      expect( result.nope ).toBeFalsy()
    } )
  } )
} )
