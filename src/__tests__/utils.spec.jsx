import {
  ariaReadoutNumbers, calculateDateRange, clamp, coalesce, debounce,
  getFullUrl, hasFiltersEnabled, hashCode, shortIsoFormat, sortSelThenCount
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
    it( 'returns empty when end date is not today', () => {
      start = new Date(2011, 1, 3)
      end = new Date(2013, 1, 3)
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '' )
    } )

    it( 'returns empty when start date doesnt match anything ', () => {
      end = new Date(1970, 1, 4)
      end = new Date()
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '' )
    } )

    it( 'returns All when dates is full range', () => {
      start = DATE_RANGE_MIN
      end = new Date()
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( 'All' );
    } );

    it( 'returns 3y', () => {
      start =  new Date( moment().subtract( 3, 'years' ).calendar() )
      end = new Date()
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '3y' )
    } );

    it( 'returns 6m', () => {
      start =  new Date( moment().subtract( 6, 'months' ).calendar() )
      end = new Date()
      let actual = calculateDateRange( start, end )
      expect( actual ).toEqual( '6m' )
    } )
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
})

