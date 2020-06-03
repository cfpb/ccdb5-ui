import {
  ariaReadoutNumbers, calculateDateRange, clamp, coalesce, debounce,
  formatPercentage, getFullUrl, hasFiltersEnabled, hashCode, shortIsoFormat,
  sortSelThenCount, startOfToday, parseCookies
} from '../utils'
import { DATE_RANGE_MIN } from '../constants'
import React from 'react'
import moment from 'moment'

describe('module::utils', () => {
  describe( 'ariaReadoutNumbers', () => {
    it( 'breaks a sequence of numbers into an expanded string' , () => {
      const actual = ariaReadoutNumbers( '123456' )
      expect(actual).toEqual('1 2 3 4 5 6');
    } );

    it( 'handles empty strings' , () => {
      const actual = ariaReadoutNumbers( '' )
      expect(actual).toEqual('');
    } );

    it( 'handles undefined' , () => {
      const actual = ariaReadoutNumbers()
      expect(actual).toEqual('');
    } );
  } );

  describe('shortIsoFormat', () => {
    it('handles nulls', () => {
      const actual = shortIsoFormat( null )
      expect( actual ).toEqual( '' )
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    it('calls the passed in function after N milliseconds', () => {
      const spy = jest.fn()
      const target = debounce(spy, 200)
      target()
      expect(spy).not.toHaveBeenCalled()
      jest.runTimersToTime(200)
      expect(spy).toHaveBeenCalled()
    })

    it('only triggers one call while the timer is active', () => {
      const spy = jest.fn()
      const target = debounce(spy, 200)

      target()
      target()
      target()

      expect(spy).not.toHaveBeenCalled()
      jest.runAllTimers()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('passes arguments to the original function', () => {
      const spy = jest.fn()
      const target = debounce(spy, 200)

      target('foo', 'bar', 'baz', 'qaz')

      expect(spy).not.toHaveBeenCalled()
      jest.runAllTimers()
      expect(spy).toHaveBeenCalledWith('foo', 'bar', 'baz', 'qaz')
    })
  })

  describe( 'coalesce edge cases', () => {
    it( 'handles non-objects', () => {
      const actual = coalesce( false, 'foo', 'bar' );
      expect( actual ).toEqual( 'bar' );
    } );
  } );

  describe('clamp', ()=>{
    it( 'limits values', () => {
      let actual = clamp( 10, 1, 25 );
      expect( actual ).toEqual( 10 );

      actual = clamp( 10, 1, 5 );
      expect( actual ).toEqual( 5 );

      actual = clamp( 10, 15, 25 );
      expect( actual ).toEqual( 15 );
    } );
  })

  describe('hashCode', ()=>{
    it( 'hashes strings', () => {
      let actual = hashCode( '' );
      expect( actual ).toEqual( 0 );
      actual = hashCode( 'foobar' );
      expect( actual ).toEqual( -1268878963 );
    } );
  })

  describe('calculateDateInterval', ()=>{
    let start, end
    beforeEach( () => {
      end = startOfToday()
    } );

    it( 'returns empty when end date is not today', () => {
      start = new Date(2011, 1, 3)
      end = new Date(2013, 1, 3)
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '' )
    } )

    it( 'returns empty when start date doesnt match anything ', () => {
      start = new Date(1970, 1, 4)
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '' )
    } )

    it( 'returns All when dates is full range', () => {
      start = DATE_RANGE_MIN
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( 'All' );
    } );

    it( 'returns 3y', () => {
      start =  new Date( moment( end ).subtract( 3, 'years' ).calendar() )
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '3y' )
    } );

    it( 'returns 6m', () => {
      start =  new Date( moment( end ).subtract( 6, 'months' ).calendar() )
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '6m' )
    } )
  })

  describe('formatPercentage', ()=>{
    it('handles NaN values', ()=>{
      let actual = formatPercentage( NaN )
      expect(actual).toEqual(0.0)
    })
  })

  describe( 'getFullUrl', () => {
    it( 'adds a host if needed' , () => {
      const actual = getFullUrl( '/foo/bar#baz?qaz=a&b=c' )
      expect( actual ).toEqual( 'http://localhost/foo/bar#baz?qaz=a&b=c' )
    } );

    it( 'does not add a host if it is there' , () => {
      const uri = 'https://www.example.org:8000/foo/bar#baz?qaz=a&b=c'
      const actual = getFullUrl( uri )
      expect( actual ).toEqual( uri )
    } );
  } );

  describe( 'hasFiltersEnabled', () => {
    it( 'handles no filters', () => {
      const query = {
        date: {},
        bogus: {},
        product: []
      }

      expect( hasFiltersEnabled( query ) ).toBeFalsy()
    } )

    it( 'handles some filters', () => {
      const query = {
        date: {},
        bogus: {},
        product: [ { name: 'foo', value: 123 } ]
      }

      expect( hasFiltersEnabled( query ) ).toBeTruthy()
    } )

    it( 'handles flag filters', () => {
      const query = {
        date: {},
        bogus: {},
        has_narrative: true
      }

      expect( hasFiltersEnabled( query ) ).toBeTruthy()
    } )

    it( 'handles company_received filters', () => {
      const query = {
        date: {},
        bogus: {},
        product: [],
        company_received_max: 'foo'
      }

      expect( hasFiltersEnabled( query ) ).toBeTruthy()
    } )
  } )

  describe( 'sortSelThenCount', ()=>{
    it('handles empty options array', ()=>{
      const actual = sortSelThenCount( null, [ 1, 2, 3 ] )
      expect(actual).toEqual([]);
    })
  })

  describe( 'startOfToday', () => {
    let origMaxDate
    beforeAll( () => {
      origMaxDate = window.MAX_DATE
    } );

    beforeEach( () => {
      delete window.MAX_DATE
      delete window.complaint_public_metadata
    } );

    afterAll( () => {
      window.MAX_DATE = origMaxDate
    } );

    it( 'sets MAX_DATE from the metadata' , () => {
      window.complaint_public_metadata = {
        "metadata_timestamp": "2020-05-09 02:39:23",
        "qas_timestamp": "2020-05-08 23:48:52",
        "total_count": 2611545
      }

      const actual = startOfToday();
      expect( actual.getFullYear() ).toEqual( 2020 )
      expect( actual.getMonth() ).toEqual( 4 )
      expect( actual.getDate() ).toEqual( 9 )
      expect( actual.getHours() ).toEqual( 0 )
      expect( actual.getMinutes() ).toEqual( 0 )
    } );

    it( 'defaults MAX_DATE if the metadata is missing' , () => {
      jest.spyOn(global.Date, 'now')
      .mockImplementationOnce( _ => Date.UTC( 2020, 4, 1, 4 ) )

      const actual = startOfToday();
      expect( actual.getFullYear() ).toEqual( 2020 )
      expect( actual.getMonth() ).toEqual( 4 )
      expect( actual.getDate() ).toEqual( 1 )
      expect( actual.getHours() ).toEqual( 0 )
      expect( actual.getMinutes() ).toEqual( 0 )
    } );
  } );

  describe( 'parseCookies', () => {
    it( 'handles an empty string' , () => {
      const actual = parseCookies( '' )
      expect( actual ).toEqual( {} )
    } );

    it( 'handles undefined' , () => {
      const actual = parseCookies( undefined )
      expect( actual ).toEqual( {} )
    } );

    it( 'creates a dictionary from a cookie string' , () => {
      const actual = parseCookies(
        '_ga=fooo; _gid=baaar; csrftoken=baz; showTrends=hide;'
      )
      expect( actual ).toEqual( {
        _ga: 'fooo',
        _gid: 'baaar',
        csrftoken: 'baz',
        showTrends: 'hide'
      } )
    } );
  } );
})

