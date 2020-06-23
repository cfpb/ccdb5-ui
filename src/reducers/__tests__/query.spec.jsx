import target, {
  alignDateRange, defaultQuery, filterArrayAction
} from '../query'
import { MODE_TRENDS, REQUERY_HITS_ONLY } from '../../constants'
import actions from '../../actions'
import * as types from '../../constants'

import moment from 'moment'
import { startOfToday }  from '../../utils'

const maxDate = startOfToday()

describe( 'reducer:query', () => {
  describe( 'default', () => {
    it( 'has a default state', () => {
      const res = target( undefined, {} )
      expect( res ).toMatchObject( {
        searchText: '',
        searchField: 'all',
        page: 1,
        size: 25,
        sort: 'created_date_desc'
      } )
      // doing this because I can't seem to mock the date since
      // defaultQuery is imported
      expect( res ).toHaveProperty( 'date_received_max' )
      expect( res ).toHaveProperty( 'date_received_min' )
      expect( res.queryString ).toContain( 'date_received_max' )
      expect( res.queryString ).toContain( 'date_received_min' )
      expect( res.queryString ).toContain( 'field=all&lens=overview' +
        '&page=1&size=25&sort=created_date_desc' )
    } )
  } )

  describe( 'COMPLAINTS_RECEIVED actions', () => {
    it( 'updates total number of pages', () => {
      const action = {
        type: actions.COMPLAINTS_RECEIVED,
        data: {
          hits: {
            total: 10000
          }
        }
      }

      const state = {
        page: 10,
        size: 100
      }

      expect( target( state, action ) ).toEqual( {
        page: 10,
        queryString: '?page=10&size=100',
        size: 100,
        totalPages: 100
      } )
    } )

    it( 'limits the current page correctly', () => {
      const action = {
        type: actions.COMPLAINTS_RECEIVED,
        data: {
          hits: {
            total: 10000
          }
        }
      }

      const state = {
        page: 101,
        size: 100
      }

      expect( target( state, action ) ).toEqual( {
        page: 100,
        queryString: '?page=100&size=100',
        size: 100,
        totalPages: 100
      } )
    } )
  } )

  it( 'handles SEARCH_CHANGED actions', () => {
    const action = {
      type: actions.SEARCH_CHANGED,
      searchText: 'foo',
      searchField: 'bar'
    }
    const state = {
      from: 80,
      size: 100
    }
    expect( target( state, action ) ).toEqual( {
      from: 0,
      page: 1,
      queryString: '?field=bar&page=1&search_term=foo&size=100',
      searchField: 'bar',
      searchText: 'foo',
      size: 100
    } )
  } )

  describe( 'trend depth', () => {
    it( 'handles DEPTH_CHANGED', () => {
      const action = {
        type: actions.DEPTH_CHANGED,
        depth: 13
      }
      const state = {
        trendDepth: 5
      }
      expect( target( state, action ) ).toEqual( {
        queryString: '?trend_depth=13',
        trendDepth: 13
      } )
    } )
    it( 'handles DEPTH_RESET', () => {
      const action = {
        type: actions.DEPTH_RESET
      }
      const state = {
        trendDepth: 10000
      }
      expect( target( state, action ) ).toEqual( {
        queryString: '?trend_depth=5',
        trendDepth: '5'
      } )
    } )
  } )

  describe( 'Pager', () => {
    it( 'handles PAGE_CHANGED actions', () => {
      const action = {
        type: actions.PAGE_CHANGED,
        page: 2
      }
      const state = {
        size: 100,
        tab: types.MODE_LIST
      }
      expect( target( state, action ) ).toEqual( {
        from: 100,
        page: 2,
        queryString: '?frm=100&page=2&size=100&tab=List',
        size: 100,
        tab: types.MODE_LIST
      } )
    } )

    it( 'handles NEXT_PAGE_SHOWN actions', () => {
      const action = {
        type: actions.NEXT_PAGE_SHOWN
      }
      const state = {
        from: 100,
        page: 2,
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST
      }
      expect( target( state, action ) ).toEqual( {
        from: 200,
        page: 3,
        queryString: '?frm=200&page=3&size=100&tab=List',
        size: 100,
        tab: types.MODE_LIST
      } )
    } )

    it( 'handles PREV_PAGE_SHOWN actions', () => {
      const action = {
        type: actions.PREV_PAGE_SHOWN
      }
      const state = {
        from: 100,
        page: 2,
        queryString: 'foobar',
        size: 100,
        tab: types.MODE_LIST
      }
      expect( target( state, action ) ).toEqual( {
        from: 0,
        page: 1,
        queryString: '?page=1&size=100&tab=List',
        size: 100,
        tab: types.MODE_LIST
      } )
    } )
  } )

  describe( 'Action Bar', () => {
    it( 'handles SIZE_CHANGED actions', () => {
      const action = {
        type: actions.SIZE_CHANGED,
        size: 50
      }
      const state = {
        size: 100,
        tab: types.MODE_LIST
      }
      expect( target( state, action ) ).toEqual( {
        from: 0,
        page: 1,
        queryString: '?page=1&size=50&tab=List',
        size: 50,
        tab: types.MODE_LIST
      } )
    } )

    it( 'handles SORT_CHANGED actions', () => {
      const action = {
        type: actions.SORT_CHANGED,
        sort: 'foo'
      }
      const state = {
        from: 100,
        size: 100,
        tab: types.MODE_LIST
      }
      expect( target( state, action ) ).toEqual( {
        from: 100,
        queryString: '?frm=100&size=100&sort=foo&tab=List',
        sort: 'foo',
        size: 100,
        tab: types.MODE_LIST
      } )
    } )
  } )

  describe( 'Tabs', () => {
    let action, state
    beforeEach(()=>{
      action = {
        type: actions.TAB_CHANGED
      }
      state = {
        tab: 'bar'
      }
    })
    it( 'handles TAB_CHANGED actions', () => {
      action.tab = 'foo'
      expect( target( state, action ) ).toEqual( {
        tab: 'foo',
        queryString: '?tab=foo'
      } )
    } )

    it( 'handles a Map TAB_CHANGED actions', () => {
      action.tab = types.MODE_MAP
      expect( target( state, action ) ).toEqual( {
        enablePer1000: true,
        mapWarningEnabled: true,
        tab: types.MODE_MAP,
        queryString: '?tab=Map'
      } )
    } )
  } )

  describe( 'URL_CHANGED actions', () => {
    let action = null
    let state = null
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = { ...defaultQuery }
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles string params', () => {
      action.params = { searchText: 'hello' }
      const actual = target( state, action )
      expect( actual.searchText ).toEqual( 'hello' )
    } )

    it( 'converts some parameters to integers', () => {
      action.params = { size: '100' }
      const actual = target( state, action )
      expect( actual.size ).toEqual( 100 )
    } )

    it( 'ignores bad integer parameters', () => {
      action.params = { size: 'foo' }
      const actual = target( state, action )
      expect( actual.size ).toEqual( 25 )
    } )

    it( 'converts some parameters to dates', () => {
      const expected = new Date( 2013, 1, 3 )
      action.params = { date_received_min: '2013-02-03' }
      const actual = target( {}, action ).date_received_min
      expect( actual.getFullYear() ).toEqual( expected.getFullYear() )
      expect( actual.getMonth() ).toEqual( expected.getMonth() )
    } )

    it( 'converts flag parameters to strings', () => {
      const expected = 'true'
      action.params = { has_narrative: true }
      const actual = target( {}, action ).has_narrative
      expect( actual ).toEqual( expected )
    } )

    it( 'ignores incorrect dates', () => {
      action.params = { date_received_min: 'foo' }
      expect( target( {}, action ) ).toEqual( state )
    } )

    it( 'ignores unknown parameters', () => {
      action.params = { foo: 'bar' }
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles a single filter', () => {
      action.params = { product: 'Debt Collection' }
      const actual = target( {}, action )
      expect( actual.product ).toEqual( [ 'Debt Collection' ] )
    } )

    it( 'handles a multiple filters', () => {
      action.params = { product: [ 'Debt Collection', 'Mortgage' ] }
      const actual = target( {}, action )
      expect( actual.product ).toEqual( [ 'Debt Collection', 'Mortgage' ] )
    } )

    it( 'handles a trendDepth param', () => {
      action.params = { lens: 'Product', trendDepth: 1000 }
      const actual = target( {}, action )
      expect( actual.lens ).toEqual( 'Product' )
      expect( actual.trendDepth ).toEqual( 1000 )
    } )


    it( 'handles the "All" button from the landing page' , () => {
      const dateMin = new Date( types.DATE_RANGE_MIN )

      action.params = { dataNormalization: 'None', dateRange: 'All' }

      const actual = target( {}, action )

      expect( actual.date_received_min ).toEqual( dateMin )
      expect( actual.date_received_max ).toEqual( maxDate )
      expect( actual.dateRange ).toEqual( 'All' )
    } );

    describe( 'dates', () => {
      let expected;
      beforeEach( () => {
        state.dateRange = '2y'
        expected = { ...defaultQuery }
      } );

      it( 'clears the default range if the dates are not 3 years apart' , () => {
        state.date_received_min = new Date(
          moment( maxDate ).subtract( 2, 'years' )
        )
        expected.dateRange = ''
        expected.date_received_min = state.date_received_min

        const actual = alignDateRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the All range if the dates are right' , () => {
        state.date_received_min = new Date( types.DATE_RANGE_MIN )
        expected.dateRange = 'All'
        expected.date_received_min = state.date_received_min

        const actual = alignDateRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 3m range if the dates are right' , () => {
        state.date_received_min = new Date(
          moment( maxDate ).subtract( 3, 'months' )
        )
        expected.dateRange = '3m'
        expected.date_received_min = state.date_received_min

        const actual = alignDateRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 6m range if the dates are right' , () => {
        state.date_received_min = new Date(
          moment( maxDate ).subtract( 6, 'months' )
        )
        expected.dateRange = '6m'
        expected.date_received_min = state.date_received_min

        const actual = alignDateRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 1y range if the dates are right' , () => {
        state.date_received_min = new Date(
          moment( maxDate ).subtract( 1, 'year' )
        )
        expected.dateRange = '1y'
        expected.date_received_min = state.date_received_min

        const actual = alignDateRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 3y range if the dates are right' , () => {
        const actual = alignDateRange( state )
        expect( actual ).toEqual( expected );
      } );
    } );
  } )

  describe( 'Filters', () => {
    describe( 'FILTER_CHANGED actions updates query with filter state', () => {
      let key = ''
      let state = null
      let filterName = ''
      let filterValue = null
      let action = null

      beforeEach( () => {
        key = 'affirmative'
        filterName = 'filtyMcFilterson'
        filterValue = { key }
        state = {}
        action = { type: actions.FILTER_CHANGED, filterName, filterValue }
      } )

      it( 'handles FILTER_CHANGED actions and returns correct object', () => {
        expect( target( state, action ) ).toEqual(
          {
            [filterName]: [ key ],
            queryString: '?filtyMcFilterson=affirmative'
          }
        )
      } )

      it( 'handles FILTER_CHANGED actions & returns correct object - Map', () => {
        state.tab = types.MODE_MAP
        expect( target( state, action ) ).toEqual(
          {
            enablePer1000: true,
            [filterName]: [ key ],
            mapWarningEnabled: true,
            queryString: '?filtyMcFilterson=affirmative&tab=Map',
            tab: types.MODE_MAP
          }
        )
      } )


      it( 'creates a filter array if target is undefined', () => {
        let filterReturn = filterArrayAction( undefined, key )
        expect( filterReturn ).toEqual( [ key ] )
      } )

      it( 'adds additional filters when passed', () => {
        let filterReturn = filterArrayAction( [ key ], 'bye' )
        expect( filterReturn ).toEqual( [ key, 'bye' ] )
      } )

      it( 'removes filters when already present', () => {
        let filterReturn = filterArrayAction( [ key, 'bye' ], key )
        expect( filterReturn ).toEqual( [ 'bye' ] )
      } )

    } )

    describe( 'FILTER_REMOVED actions', () => {
      let action
      beforeEach( () => {
        action = {
          type: actions.FILTER_REMOVED,
          filterName: 'foo',
          filterValue: 'baz'
        }
      } )

      it( 'removes a filter when one exists', () => {
        const state = {
          foo: [ 'bar', 'baz', 'qaz' ]
        }
        expect( target( state, action ) ).toEqual( {
          foo: [ 'bar', 'qaz' ],
          queryString: '?foo=bar&foo=qaz'
        } )
      } )

      it( 'removes a filter on Map tab when one exists', () => {
        const state = {
          foo: [ 'bar', 'baz', 'qaz' ],
          tab: types.MODE_MAP
        }
        expect( target( state, action ) ).toEqual( {
          enablePer1000: true,
          foo: [ 'bar', 'qaz' ],
          mapWarningEnabled: true,
          queryString: '?foo=bar&foo=qaz&tab=Map',
          tab: types.MODE_MAP
        } )
      } )

      it( 'handles a missing filter', () => {
        const state = {
          foobar: [ 'bar', 'baz', 'qaz' ]
        }
        expect( target( state, action ) ).toEqual( {
          foobar: [ 'bar', 'baz', 'qaz' ],
          queryString: '?foobar=bar&foobar=baz&foobar=qaz'
        } )
      } )

      it( 'handles a missing filter value', () => {
        const state = {
          foo: [ 'bar', 'qaz' ]
        }
        expect( target( state, action ) ).toEqual( {
          foo: [ 'bar', 'qaz' ],
          queryString: '?foo=bar&foo=qaz'
        } )
      } )

      describe( 'has_narrative', () => {
        it( 'handles when present' , () => {
          action.filterName = 'has_narrative'
          const state = {
            has_narrative: true
          }
          expect( target( state, action ) ).toEqual( {
            queryString: ''
          } )
        } );

        it( 'handles when present - Map', () => {
          action.filterName = 'has_narrative'
          const state = {
            has_narrative: true,
            tab: types.MODE_MAP
          }
          expect( target( state, action ) ).toEqual( {
            enablePer1000: true,
            mapWarningEnabled: true,
            queryString: '?tab=Map',
            tab: types.MODE_MAP
          } )
        } )

        it( 'handles when absent' , () => {
          action.filterName = 'has_narrative'
          const state = {}
          expect( target( state, action ) ).toEqual( {
            queryString: ''
          } )
        } );
      } );
    } )

    describe( 'FILTER_ALL_REMOVED actions', () => {
      let action, state
      beforeEach( () => {
        action = {
          type: actions.FILTER_ALL_REMOVED
        }

        state = {
          company: [ 'Acme' ],
          date_received_min: new Date( 2012, 0, 1 ),
          from: 100,
          has_narrative: true,
          searchField: 'all',
          size: 100,
          timely: [ 'bar', 'baz', 'qaz' ]
        }
      } )

      it( 'clears all filters', () => {
        const actual = target( state, action )
        expect( actual ).toMatchObject( {
          dateRange: 'All',
          from: 100,
          searchField: 'all',
          size: 100
        } )

        expect( actual.queryString ).toContain( 'dateRange=All' )
        expect( actual.queryString ).toContain( '&date_received_min=2011-12-01&field=all&frm=100&size=100' )
        const diffMin = moment( actual.date_received_min ).diff( moment( types.DATE_RANGE_MIN ), 'days' )
        expect( diffMin ).toEqual( 0 )
        const diffMax = moment( actual.date_received_max ).diff( moment( maxDate ), 'days' )
        expect( diffMax ).toEqual( 0 )
        expect( actual.date_received_max ).toBeTruthy()
      } )

      it( 'clears all filters - Map', () => {
        state.tab = types.MODE_MAP
        const actual = target( state, action )
        expect( actual ).toMatchObject( {
          dateRange: 'All',
          enablePer1000: true,
          from: 100,
          mapWarningEnabled: true,
          searchField: 'all',
          size: 100
        } )

        expect( actual.queryString ).toContain( 'dateRange=All' )
        expect( actual.queryString ).toContain( '&date_received_min=2011-12-01&field=all&frm=100&size=100' )
        const diffMin = moment( actual.date_received_min ).diff( moment( types.DATE_RANGE_MIN ), 'days' )
        expect( diffMin ).toEqual( 0 )
        const diffMax = moment( actual.date_received_max ).diff( moment( maxDate ), 'days' )
        expect( diffMax ).toEqual( 0 )
        expect( actual.date_received_max ).toBeTruthy()
      } )

      describe( 'when searching Narratives', () => {
        it( 'does not clear the hasNarrative filter', () => {
          const qs = '?field=' + types.NARRATIVE_SEARCH_FIELD +
            '&frm=100&has_narrative=true&size=100'

          state.searchField = types.NARRATIVE_SEARCH_FIELD
          const actual = target( state, action )
          expect( actual ).toMatchObject( {
            dateRange: 'All',
            from: 100,
            has_narrative: true,
            searchField: types.NARRATIVE_SEARCH_FIELD,
            size: 100
          } )
          expect( actual.queryString ).toContain( 'dateRange=All' )
          expect( actual.queryString )
            .toContain( '&date_received_min=2011-12-01&' +
              'field=complaint_what_happened&frm=100&has_narrative=true&' +
              'size=100' )

          const diffMin = moment( actual.date_received_min ).diff( moment( types.DATE_RANGE_MIN ), 'days' )
          expect( diffMin ).toEqual( 0 )
          const diffMax = moment( actual.date_received_max ).diff( moment( maxDate ), 'days' )
          expect( diffMax ).toEqual( 0 )
          expect( actual.date_received_max ).toBeTruthy()
        } )
      } )
    } )

    describe( 'FILTER_MULTIPLE_ADDED actions', () => {
      let action
      beforeEach( () => {
        action = {
          type: actions.FILTER_MULTIPLE_ADDED,
          filterName: 'issue',
          values: [ 'Mo Money', 'Mo Problems' ]
        }
      } )

      it( "adds all filters if they didn't exist", () => {
        expect( target( {}, action ) ).toEqual( {
          issue: [ 'Mo Money', 'Mo Problems' ],
          queryString: '?issue=Mo%20Money&issue=Mo%20Problems'
        } )
      } )

      it( "adds all filters if they didn't exist - Map", () => {
        expect( target( {
          enablePer1000: true,
          mapWarningEnabled: true,
          tab: types.MODE_MAP
        }, action ) ).toEqual( {
          enablePer1000: false,
          issue: [ 'Mo Money', 'Mo Problems' ],
          mapWarningEnabled: true,
          queryString: '?issue=Mo%20Money&issue=Mo%20Problems&tab=Map',
          tab: types.MODE_MAP
        } )
      } )

      it( 'skips filters if they exist already', () => {
        const state = {
          issue: [ 'foo' ]
        }
        action.values.push( 'foo' )

        expect( target( state, action ) ).toEqual( {
          issue: [ 'foo', 'Mo Money', 'Mo Problems' ],
          queryString: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems'
        } )
      } )

      it( 'skips filters if they exist already - Map', () => {
        const state = {
          issue: [ 'foo' ],
          tab: types.MODE_MAP
        }
        action.values.push( 'foo' )

        expect( target( state, action ) ).toEqual( {
          enablePer1000: false,
          issue: [ 'foo', 'Mo Money', 'Mo Problems' ],
          queryString: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems&tab=Map',
          tab: types.MODE_MAP
        } )
      } )

    } )

    describe( 'FILTER_MULTIPLE_REMOVED actions', () => {
      let action
      beforeEach( () => {
        action = {
          type: actions.FILTER_MULTIPLE_REMOVED,
          filterName: 'issue',
          values: [ 'Mo Money', 'Mo Problems', 'bar' ]
        }
      } )

      it( 'removes filters if they exist', () => {
        const state = {
          issue: [ 'foo', 'Mo Money', 'Mo Problems' ]
        }
        expect( target( state, action ) ).toEqual( {
          issue: [ 'foo' ],
          queryString: '?issue=foo'
        } )
      } )

      it( 'removes filters if they exist - Map tab', () => {
        const state = {
          issue: [ 'foo', 'Mo Money', 'Mo Problems' ],
          tab: types.MODE_MAP
        }
        expect( target( state, action ) ).toEqual( {
          enablePer1000: false,
          issue: [ 'foo' ],
          queryString: '?issue=foo&tab=Map',
          tab: types.MODE_MAP
        } )
      } )

      it( 'ignores unknown filters', () => {
        expect( target( {}, action ) ).toEqual( {
          queryString: ''
        } )
      } )
    } )

    describe( 'FILTER_FLAG_CHANGED actions', () => {
      let action, state
      beforeEach( () => {
        action = {
          type: actions.FILTER_FLAG_CHANGED,
          filterName: 'has_narrative',
          requery: REQUERY_HITS_ONLY
        }
        state = {}
      } )

      it( 'adds narrative filter to empty state', () => {
        expect( target( state, action ) ).toEqual( {
          has_narrative: true,
          queryString: '?has_narrative=true'
        } )
      } )

      it( 'toggles off narrative filter', () => {
        state.has_narrative = true
        expect( target( state, action ) ).toEqual( {
          queryString: ''
        } )
      } )
    } )
  } )

  describe( 'Dates', () => {
    describe( 'DATES_CHANGED actions', () => {
      let action, result
      beforeEach( () => {
        action = {
          type: actions.DATES_CHANGED,
          filterName: 'date_received',
          minDate: new Date( 2001, 0, 30 ),
          maxDate: new Date( 2013, 1, 3 )
        }
        result = null
      } )

      it( 'adds the dates', () => {
        expect( target( {}, action ) ).toEqual( {
          date_received_min: new Date( 2001, 0, 30 ),
          date_received_max: new Date( 2013, 1, 3 ),
          queryString: '?date_received_max=2013-02-03&date_received_min=2001-01-30'
        } )
      } )

      it( 'clears dateRange when no match', () => {
        result = target( { dateRange: '1y' }, action )
        expect( result.dateRange ).toBeFalsy()
      } )

      it( 'adds dateRange', () => {
        const min = new Date( moment( maxDate ).subtract( 3, 'months' ) )
        action.maxDate = maxDate
        action.minDate = min
        result = target( {}, action )
        expect( result.dateRange ).toEqual( '3m' )
      } )

      it( 'does not add empty dates', () => {
        action.maxDate = ''
        action.minDate = ''
        expect( target( {}, action ) ).toEqual( {
          queryString: ''
        } )
      } )
    } )

    describe( 'DATE_RANGE_CHANGED actions', () => {
      let action, result
      beforeEach( () => {
        action = {
          type: actions.DATE_RANGE_CHANGED,
          dateRange: ''
        }
      } )

      it( 'handles All range', () => {
        action.dateRange = 'All'
        result = target( {}, action )
        expect( result.date_received_min ).toEqual( new Date( types.DATE_RANGE_MIN ) )
      } )

      it( 'handles 1y range', () => {
        action.dateRange = '1y'
        result = target( {}, action )
        expect( result ).toEqual( {
          dateRange: '1y',
          date_received_max: new Date( '2020-05-05T04:00:00.000Z' ),
          date_received_min: new Date( '2019-05-05T04:00:00.000Z' ),
          queryString: '?dateRange=1y&date_received_max=2020-05-05&date_received_min=2019-05-05'
        } )
      } )

      it( 'default range handling', () => {
        action.dateRange = 'foo'
        result = target( {}, action )
        // only set max date
        expect( result ).toEqual( {
          dateRange: 'foo',
          date_received_max: new Date( '2020-05-05T04:00:00.000Z' ),
          queryString: '?dateRange=foo&date_received_max=2020-05-05'
        } )
      } )

      it( 'On Trends Tab handles All range', () => {
        action.dateRange = 'All'
        const state = { dateInterval: 'Day', tab: MODE_TRENDS }
        result = target( state, action )
        expect( result.dateInterval ).toEqual( 'Week' )
        expect( result.trendsDateWarningEnabled ).toEqual( true )
      } )

    } )
  } )

  describe( 'Map', () => {

    describe( 'Map Warning', () => {
      it( 'handles MAP_WARNING_DISMISSED action', () => {
        const action = {
          type: actions.MAP_WARNING_DISMISSED
        }
        const state = {
          company: [ 1, 2, 3 ],
          foo: 'bar',
          mapWarningEnabled: true,
          tab: types.MODE_MAP
        }
        expect( target( state, action ) ).toEqual( {
          company: [ 1, 2, 3 ],
          enablePer1000: false,
          foo: 'bar',
          mapWarningEnabled: false,
          queryString: '?company=1&company=2&company=3&foo=bar&tab=Map',
          tab: types.MODE_MAP
        } )
      } )
    } )

    let action, res
    describe( 'STATE_COMPLAINTS_SHOWN', () => {
      it( 'switches to List View', () => {
        action = {
          type: actions.STATE_COMPLAINTS_SHOWN
        }

        res = target( {
          state: [],
          tab: types.MODE_MAP
        }, action )

        expect( res ).toEqual( {
          queryString: '?tab=List',
          state: [ ],
          tab: types.MODE_LIST
        } )
      } )

      it( 'saves all state filters and switches to List View', () => {
        action = {
          type: actions.STATE_COMPLAINTS_SHOWN
        }

        res = target( {
          enablePer1000: false,
          mapWarningEnabled: true,
          state: [ 'TX', 'MX', 'FO' ],
          tab: types.MODE_MAP
        }, action )

        expect( res ).toEqual( {
          enablePer1000: false,
          mapWarningEnabled: true,
          queryString: '?state=TX&state=MX&state=FO&tab=List',
          state: [ 'TX', 'MX', 'FO' ],
          tab: types.MODE_LIST
        } )
      } )
    } )

    describe( 'STATE_FILTER_ADDED', () => {
      beforeEach( () => {
        action = {
          type: actions.STATE_FILTER_ADDED,
          selectedState: { abbr: 'IL', name: 'Illinois' }
        }
      } )
      it( 'adds state filter', () => {
        res = target( { tab: types.MODE_MAP }, action )
        expect( res ).toEqual( {
          enablePer1000: false,
          queryString: '?state=IL&tab=Map',
          state: [ 'IL' ],
          tab: types.MODE_MAP
        } )
      } )
      it( 'does not add dupe state filter', () => {
        res = target( {
          state: [ 'IL', 'TX' ],
          tab: types.MODE_MAP
        }, action )

        expect( res ).toEqual( {
          enablePer1000: false,
          queryString: '?state=IL&state=TX&tab=Map',
          state: [ 'IL', 'TX' ],
          tab: types.MODE_MAP
        } )
      } )
    } )

    describe( 'STATE_FILTER_CLEARED', () => {

      it( 'removes state filters', () => {
        action = {
          type: actions.STATE_FILTER_CLEARED
        }

        res = target( {
          state: [ 'FO', 'BA' ],
          tab: types.MODE_MAP
        }, action )

        expect( res ).toEqual( {
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '?tab=Map',
          state: [],
          tab: types.MODE_MAP
        } )
      } )

      it( 'handles no state filters', () => {
        action = {
          type: actions.STATE_FILTER_CLEARED
        }

        res = target( { tab: types.MODE_MAP }, action )

        expect( res ).toEqual( {
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '?tab=Map',
          state: [],
          tab: types.MODE_MAP
        } )
      } )
    } )

    describe( 'STATE_FILTER_REMOVED', () => {
      beforeEach( () => {
        action = {
          type: actions.STATE_FILTER_REMOVED,
          selectedState: { abbr: 'IL', name: 'Illinois' }
        }
      } )
      it( 'removes a state filter', () => {
        res = target( {
          state: [ 'CA', 'IL' ],
          tab: types.MODE_MAP
        }, action )
        expect( res ).toEqual( {
          enablePer1000: false,
          queryString: '?state=CA&tab=Map',
          state: [ 'CA' ],
          tab: types.MODE_MAP
        } )
      } )
      it( 'handles empty state', () => {
        res = target( { tab: types.MODE_MAP }, action )
        expect( res ).toEqual( {
          enablePer1000: true,
          mapWarningEnabled: true,
          queryString: '?tab=Map',
          state: [],
          tab: types.MODE_MAP
        } )
      } )
    } )
  } )

  describe( 'Trends', () => {
    describe( 'Trends Date Warning', () => {
      it( 'handles TRENDS_DATE_WARNING_DISMISSED action', () => {
        const action = {
          type: actions.TRENDS_DATE_WARNING_DISMISSED
        }
        const state = {
          trendsDateWarningEnabled: true
        }
        expect( target( state, action ) ).toEqual( {
          queryString: '',
          trendsDateWarningEnabled: false
        } )
      } )
    } )

    describe( 'CHART_TYPE_CHANGED actions', () => {
      it( 'changes the chartType', () => {
        const action = {
          type: actions.CHART_TYPE_CHANGED,
          chartType: 'Foo'
        }
        const result = target( { chartType: 'ahha' },
          action )
        expect( result ).toEqual( {
          chartType: 'Foo',
          queryString: '?chartType=Foo',
        } )
      } )
    } )

    describe( 'DATA_LENS_CHANGED actions', () => {
      it( 'changes the lens', () => {
        const action = {
          type: actions.DATA_LENS_CHANGED,
          lens: 'Foo'
        }
        const result = target( { tab: types.MODE_TRENDS, focus: 'ahha' },
          action )
        expect( result ).toEqual( {
          focus: '',
          lens: 'Foo',
          subLens: 'sub_foo',
          queryString: '?lens=foo&sub_lens=sub_foo&tab=Trends',
          tab: 'Trends',
          trendsDateWarningEnabled: false
        } )
      } )
    } )

    describe( 'DATA_SUBLENS_CHANGED actions', () => {
      it( 'changes the sub lens', () => {
        const action = {
          type: actions.DATA_SUBLENS_CHANGED,
          subLens: 'Issue'
        }
        const result = target( { tab: types.MODE_TRENDS }, action )
        expect( result ).toEqual( {
          subLens: 'issue',
          queryString: '?sub_lens=issue&tab=Trends',
          tab: 'Trends',
          trendsDateWarningEnabled: false
        } )
      } )
    } )

    describe( 'DATE_INTERVAL_CHANGED', () => {
      it( 'changes the dateInterval', () => {
        const action = {
          type: actions.DATE_INTERVAL_CHANGED,
          dateInterval: 'Day'
        }
        const result = target( { tab: types.MODE_TRENDS }, action )
        expect( result ).toEqual( {
          dateInterval: 'Day',
          queryString: '?tab=Trends&trend_interval=day',
          tab: 'Trends',
          trendsDateWarningEnabled: false
        } )
      } )
    } )

    describe( 'FOCUS_CHANGED actions', () => {
      it( 'changes the focus', () => {
        const action = {
          type: actions.FOCUS_CHANGED,
          focus: 'Something'
        }
        const result = target( { focus: 'Else' }, action )
        expect( result ).toEqual( {
          focus: 'Something',
          queryString: '?focus=Something'
        } )
      } )
    } )
  } )
} )
