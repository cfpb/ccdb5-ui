import actions from '../../actions'
import target from '../view'
import { DATE_RANGE_MIN } from '../../constants'
import moment from 'moment'

describe( 'reducer:view', () => {
  let action, dateMin, state
  describe( 'default', () => {
    it( 'has a default state', () => {
      const res = target( undefined, {} )
      expect( res ).toMatchObject( {
        dateInterval: '3y',
        tab: 'Map'
      } )
    } )
  } )

  describe('DATE_INTERVAL_CHANGED action', ()=>{
    it( 'sets the current date interval', () => {
      action = {
        type: actions.DATE_INTERVAL_CHANGED,
        dateInterval: 'foo'
      }
      state = {
        dateInterval: 'bar'
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: 'foo'
      } )
    } )
  })

  describe('DATE_RANGE_CHANGED action', ()=>{
    beforeEach(()=>{
      state = {
        dateInterval: 'bar'
      }
    })
    it( 'clears dateInterval when the end date is not today', () => {
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: '',
        minDate: ''
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: ''
      } )
    } )

    it( 'sets All dateInterval', () => {
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: new Date(),
        minDate: new Date( DATE_RANGE_MIN )
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: 'All'
      } )
    } )

    it( 'sets 1y dateInterval', () => {
      const dateMin = new Date( moment().subtract( 1, 'years' ).calendar() )
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: new Date(),
        minDate: dateMin
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: '1y'
      } )
    } )

    it( 'sets 3y dateInterval', () => {
      dateMin = new Date( moment().subtract( 3, 'years' ).calendar() )
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: new Date(),
        minDate: dateMin
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: '3y'
      } )
    } )

    it( 'sets 3m dateInterval', () => {
      dateMin = new Date( moment().subtract( 3, 'months' ).calendar() )
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: new Date(),
        minDate: dateMin
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: '3m'
      } )
    } )

    it( 'sets 6m dateInterval', () => {
      dateMin = new Date( moment().subtract( 6, 'months' ).calendar() )
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: new Date(),
        minDate: dateMin
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: '6m'
      } )
    } )

    it( 'clears dateInterval when no date ranges match', () => {
      action = {
        type: actions.DATE_RANGE_CHANGED,
        maxDate: new Date(),
        minDate: new Date( '2-11-1900' )
      }
      expect( target( state, action ) ).toEqual( {
        dateInterval: ''
      } )
    } )
  })

  describe( 'TAB_CHANGED action', () => {
    it( 'sets the current tab', () => {
      action = {
        type: actions.TAB_CHANGED,
        tab: 'foo'
      }
      state = {
        tab: 'bar'
      }
      expect( target( state, action ) ).toEqual( {
        tab: 'foo'
      } )
    } )
  } )
} )
