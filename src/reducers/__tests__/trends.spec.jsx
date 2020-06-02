import target, {
  defaultState,
  processTrends
} from '../trends'
import actions from '../../actions'
import { resultsOverview } from '../__fixtures__/trendsResults'
import trendsAggs from '../__fixtures__/trendsAggs'

describe( 'reducer:trends', () => {
  let action

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( {
        activeCall: '',
        chartType: 'line',
        colorMap: {},
        expandedTrends: [],
        filterNames: [],
        focus: false,
        isLoading: false,
        lastDate: false,
        lens: 'Overview',
        results: {
          dateRangeArea: [],
          dateRangeLine: [],
          dateRangeBrush: [],
          issue: [],
          product: []
        },
        subLens: '',
        tooltip: false
      } )
    } )
  } )

  describe( 'CHART_TYPE_CHANGED action', () => {

  } )

  describe( 'DATA_LENS_CHANGED action', () => {

  } )

  describe( 'TAB_CHANGED action', () => {

  } )

  describe( 'TRENDS_API_CALLED actions', () => {
    action = {
      type: actions.TRENDS_API_CALLED,
      url: 'http://www.example.org'
    }
    expect( target( {}, action ) ).toEqual( {
      activeCall: 'http://www.example.org',
      isLoading: true
    } )
  } )

  describe( 'TRENDS_FAILED actions', () => {
    it( 'handles failed error messages', () => {
      action = {
        type: actions.TRENDS_FAILED,
        error: { message: 'foo bar', name: 'ErrorTypeName' }
      }
      expect( target( {
        activeCall: 'someurl',
        results: {
          dateRangeArea: [ 1, 2, 3 ],
          dateRangeBrush: [ 4, 5, 6 ],
          dateRangeLine: [ 7, 8, 9 ],
          issue: [ 10, 11, 12 ],
          product: [ 13, 25 ]
        }
      }, action ) ).toEqual( {
        activeCall: '',
        error: { message: 'foo bar', name: 'ErrorTypeName' },
        isLoading: false,
        results: {
          dateRangeArea: [],
          dateRangeBrush: [],
          dateRangeLine: [],
          issue: [],
          product: []
        }
      } )
    } )
  } )

  describe( 'TRENDS_RECEIVED actions', () => {
    beforeEach( () => {
      action = {
        type: actions.TRENDS_RECEIVED,
        data: {
          aggregations: trendsAggs
        }
      }
    } )

    it( 'maps data to object state - Overview', () => {
      const result = target( defaultState, action )
      expect( result ).toEqual( resultsOverview )
    } )
  } )

  describe( 'TREND_TOGGLED action', () => {

  } )

  describe( 'TRENDS_TOOLTIP_CHANGED action', () => {

  } )

  describe( 'URL_CHANGED actions', () => {
    let action
    let state
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = { ...defaultState }
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles lens params', () => {
      action.params = { lens: 'hello', subLens: 'mom', nope: 'hi' }

      const actual = target( state, action )
      expect( actual.lens ).toEqual( 'hello' )
      expect( actual.subLens ).toEqual( 'mom' )
      expect( actual.nope ).toBeFalsy()
    } )
  } )
} )
