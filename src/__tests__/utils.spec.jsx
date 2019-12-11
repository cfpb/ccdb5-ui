import { clamp, coalesce, debounce, shortIsoFormat } from '../utils'
import React from 'react'

describe('module::utils', () => {
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
})

