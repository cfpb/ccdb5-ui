import target, {
  defaultState,
  processAggregations
} from '../trends'
import actions from '../../actions'

describe( 'reducer:trends', () => {
  let action

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( {
        activeCall: '',
        chartType: 'line',
        colorMap: {},
        expandedTrends: [],
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

  describe( 'CHART_TYPE_CHANGED action', ()=>{

  })

  describe( 'DATA_LENS_CHANGED action', ()=>{

  })

  describe( 'TAB_CHANGED action', ()=>{

  })

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
        error: 'foo bar'
      }
      expect( target( {
        activeCall: 'someurl',
        issue: [ 1, 2, 3 ],
        product: [ 1, 2, 3 ],
        state: [ 1, 2, 3 ]
      }, action ) ).toEqual( {
        activeCall: '',
        error: 'foo bar',
        isLoading: false,
        issue: [],
        product: []
      } )
    } )
  } )

  describe( 'TRENDS_RECEIVED actions', () => {
    beforeEach( () => {
      action = {
        type: actions.TRENDS_RECEIVED,
        data: {
          aggregations: []
        }
      }
    } )


    it( 'maps data to object state', () => {
      const result = target( null, action )
      expect( result ).toEqual( {
        activeCall: '',
        isLoading: false,
        results: {}
      } )
    } )
  } )

  describe( 'TREND_TOGGLED action', ()=>{

  })

  describe( 'TRENDS_TOOLTIP_CHANGED action', ()=>{

  })


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

  describe( 'helper functions', () => {
    describe( 'processAggregations', () => {
      it( 'calculates percentages properly', () => {
        const aggData = {
          doc_count: 1000,
          issue: {
            buckets: [
              { key: 'alpha', doc_count: 600 },
              { key: 'bar', doc_count: 150 },
              { key: 'car', doc_count: 125 },
              { key: 'delta', doc_count: 75 },
              { key: 'elephant', doc_count: 50 }
            ]
          }
        }

        const res = processAggregations( aggData )
        expect( res ).toEqual( [
          {
            hasChildren: false,
            isParent: true,
            name: "alpha",
            pctChange: 1,
            pctOfSet: "60.00",
            value: 600,
            visible: true,
            width: 0.5
          }, {
            hasChildren: false,
            isParent: true,
            name: "bar",
            pctChange: 1,
            pctOfSet: "15.00",
            value: 150,
            visible: true,
            width: 0.5
          }, {
            hasChildren: false,
            isParent: true,
            name: "car",
            pctChange: 1,
            pctOfSet: "13.00",
            value: 125,
            visible: true,
            width: 0.5
          }, {
            hasChildren: false,
            isParent: true,
            name: "delta",
            pctChange: 1,
            pctOfSet: "8.00",
            value: 75,
            visible: true,
            width: 0.5
          }, {
            hasChildren: false,
            isParent: true,
            name: "elephant",
            pctChange: 1,
            pctOfSet: "5.00",
            value: 50,
            visible: true,
            width: 0.5
          } ] )
      } )
    } )

  } )
} )
