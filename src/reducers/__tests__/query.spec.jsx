import target, {
  alignIntervalAndRange, defaultQuery, filterArrayAction
} from '../query'
import actions from '../../actions'
import * as types from '../../constants'

import { REQUERY_HITS_ONLY } from '../../constants'
import moment from 'moment'

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
      expect( res.queryString ).toContain( 'field=all&page=1&size=25' +
        '&sort=created_date_desc' )
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
        size: 100,
        totalPages: 1000
      }

      expect( target( state, action ) ).toEqual( {
        page: 10,
        queryString: '?page=10&size=100&totalPages=100',
        size: 100
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
        size: 100,
        totalPages: 1000
      }

      expect( target( state, action ) ).toEqual( {
        page: 100,
        queryString: '?page=100&size=100&totalPages=100',
        size: 100
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

  describe( 'Pager', () => {
    it( 'handles PAGE_CHANGED actions', () => {
      const action = {
        type: actions.PAGE_CHANGED,
        page: 2
      }
      const state = {
        size: 100
      }
      expect( target( state, action ) ).toEqual( {
        from: 100,
        page: 2,
        queryString: '?frm=100&page=2&size=100',
        size: 100
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
        size: 100
      }
      expect( target( state, action ) ).toEqual( {
        from: 200,
        page: 3,
        queryString: '?frm=200&page=3&size=100',
        size: 100
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
        size: 100
      }
      expect( target( state, action ) ).toEqual( {
        from: 0,
        page: 1,
        queryString: '?page=1&size=100',
        size: 100
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
        size: 100
      }
      expect( target( state, action ) ).toEqual( {
        from: 0,
        page: 1,
        queryString: '?page=1&size=50',
        size: 50
      } )
    } )

    it( 'handles SORT_CHANGED actions', () => {
      const action = {
        type: actions.SORT_CHANGED,
        sort: 'foo'
      }
      const state = {
        from: 100,
        size: 100
      }
      expect( target( state, action ) ).toEqual( {
        from: 100,
        queryString: '?frm=100&size=100&sort=foo',
        sort: 'foo',
        size: 100
      } )
    } )

    it( 'handles TAB_CHANGED actions', () => {
      const action = {
        type: actions.TAB_CHANGED,
        tab: 'foo'
      }
      const state = {
        tab: 'bar'
      }
      expect( target( state, action ) ).toEqual( {
        tab: 'foo',
        queryString: '?tab=foo'
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

    it( 'handles the "All" button from the landing page' , () => {
      const dateMin = new Date( types.DATE_RANGE_MIN )
      const dateMax = new Date( moment().startOf( 'day' ).toString() )

      action.params = { dataNormalization: 'None', dateInterval: 'All' }

      const actual = target( {}, action )

      expect( actual.date_received_min ).toEqual( dateMin )
      expect( actual.date_received_max ).toEqual( dateMax )
      expect( actual.dateInterval ).toEqual( 'All' )
    } );

    describe( 'dates', () => {
      let expected;
      beforeEach( () => {
        state.dateInterval = '2y'
        expected = { ...defaultQuery }
      } );

      it( 'clears the default interval if the dates are not 3 years apart' , () => {
        state.date_received_min = new Date(
          moment().subtract( 2, 'years' ).calendar()
        )
        expected.dateInterval = ''
        expected.date_received_min = state.date_received_min

        const actual = alignIntervalAndRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the All interval if the dates are right' , () => {
        state.date_received_min = new Date( types.DATE_RANGE_MIN )
        expected.dateInterval = 'All'
        expected.date_received_min = state.date_received_min

        const actual = alignIntervalAndRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 3m interval if the dates are right' , () => {
        state.date_received_min = new Date(
          moment().subtract( 3, 'months' ).calendar()
        )
        expected.dateInterval = '3m'
        expected.date_received_min = state.date_received_min

        const actual = alignIntervalAndRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 6m interval if the dates are right' , () => {
        state.date_received_min = new Date(
          moment().subtract( 6, 'months' ).calendar()
        )
        expected.dateInterval = '6m'
        expected.date_received_min = state.date_received_min

        const actual = alignIntervalAndRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 1y interval if the dates are right' , () => {
        state.date_received_min = new Date(
          moment().subtract( 1, 'year' ).calendar()
        )
        expected.dateInterval = '1y'
        expected.date_received_min = state.date_received_min

        const actual = alignIntervalAndRange( state )
        expect( actual ).toEqual( expected );
      } );

      it( 'sets the 3y interval if the dates are right' , () => {
        const actual = alignIntervalAndRange( state )
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
        expect( target( state, action ) ).toEqual( {
          from: 100,
          queryString: '?field=all&frm=100&size=100',
          searchField: 'all',
          size: 100
        } )
      } )

      describe( 'when searching Narratives', () => {
        it( 'does not clear the hasNarrative filter', () => {
          const qs = '?field=' + types.NARRATIVE_SEARCH_FIELD +
            '&frm=100&has_narrative=true&size=100'

          state.searchField = types.NARRATIVE_SEARCH_FIELD
          expect( target( state, action ) ).toEqual( {
            from: 100,
            has_narrative: true,
            queryString: qs,
            searchField: types.NARRATIVE_SEARCH_FIELD,
            size: 100
          } )
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

      it( "skips filters if they exist already", () => {
        const state = {
          issue: [ 'foo' ]
        }
        action.values.push( 'foo' )

        expect( target( state, action ) ).toEqual( {
          issue: [ 'foo', 'Mo Money', 'Mo Problems' ],
          queryString: '?issue=foo&issue=Mo%20Money&issue=Mo%20Problems'
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

      it( "removes filters if they exist", () => {
        const state = {
          issue: [ 'foo', 'Mo Money', 'Mo Problems' ]
        }
        expect( target( state, action ) ).toEqual( {
          issue: [ 'foo' ],
          queryString: '?issue=foo'
        } )
      } )

      it( "ignores unknown filters", () => {
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
    describe( 'DATE_RANGE_CHANGED actions', () => {
      let action, result
      beforeEach( () => {
        action = {
          type: actions.DATE_RANGE_CHANGED,
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

      it( 'clears dateInterval when no match', () => {
        result = target( { dateInterval: '1y' }, action )
        expect( result.dateInterval ).toBeFalsy()
      } )

      it( 'adds dateInterval', () => {
        const min = new Date( moment().subtract( 3, 'months' ).calendar() )
        action.maxDate = new Date()
        action.minDate = min
        result = target( {}, action )
        expect( result.dateInterval ).toEqual( '3m' )
      } )

      it( 'does not add empty dates', () => {
        action.maxDate = ''
        action.minDate = ''
        expect( target( {}, action ) ).toEqual( {
          queryString: ''
        } )
      } )
    } )

    describe( 'DATE_INTERVAL_CHANGED actions', () => {
      let action, result
      beforeEach( () => {
        action = {
          type: actions.DATE_INTERVAL_CHANGED,
          dateInterval: ''
        }
      } )

      it( 'handles All interval', () => {
        action.dateInterval = 'All'
        result = target( {}, action )
        expect( result.date_received_min ).toEqual( new Date( types.DATE_RANGE_MIN ) )
      } )

      it( 'handles 3m interval', () => {
        action.dateInterval = '3m'
        result = target( {}, action )
        const min = new Date( moment().subtract( 3, 'months' ).calendar() )
        const diffMin = moment( min ).diff( moment( result.date_received_min ), 'months' )
        expect( diffMin ).toEqual( 0 )
      } )

      it( 'default interval handling', () => {
        action.dateInterval = 'foo'
        result = target( {}, action )
        // only set max to today's date
        const diff = moment( result.date_received_max ).diff( moment( new Date() ), 'days' )
        // make sure its same day
        expect( diff ).toEqual( 0 )
      } )
    } )
  } )

  describe( 'Map', () => {
    let action, res
    describe( 'STATE_COMPLAINTS_SHOWN', () => {
      it( 'switches to List View', () => {
        action = {
          type: actions.STATE_COMPLAINTS_SHOWN
        }

        res = target( {
          state: []
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
          state: [ 'TX', 'MX', 'FO' ]
        }, action )

        expect( res ).toEqual( {
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
        res = target( {}, action )
        expect( res ).toEqual( {
          queryString: '?state=IL',
          state: [ 'IL' ]
        } )
      } )
      it( 'does not add dupe state filter', () => {
        res = target( { state: [ 'IL', 'TX' ] }, action )
        expect( res ).toEqual( {
          queryString: '?state=IL&state=TX',
          state: [ 'IL', 'TX' ]
        } )
      } )
    } )

    describe( 'STATE_FILTER_CLEARED', () => {

      it( 'removes state filters', () => {
        action = {
          type: actions.STATE_FILTER_CLEARED
        }

        res = target( {
          state: [ 'FO', 'BA' ]
        }, action )

        expect( res ).toEqual( {
          queryString: '',
          state: []
        } )
      } )

      it( 'handles no state filters', () => {
        action = {
          type: actions.STATE_FILTER_CLEARED
        }

        res = target( {}, action )

        expect( res ).toEqual( {
          queryString: '',
          state: []
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
        res = target( { state: ['CA', 'IL'] }, action )
        expect( res ).toEqual( {
          queryString: '?state=CA',
          state: [ 'CA' ]
        } )
      } )
      it( 'handles empty state', () => {
        res = target( {}, action )
        expect( res ).toEqual( {
          queryString: '',
          state: []
        } )
      } )
    } )
  } )
} )
