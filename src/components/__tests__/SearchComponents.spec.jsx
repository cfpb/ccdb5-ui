import { mapStateToProps } from '../Search/SearchComponents'
import React from 'react'

describe( 'component: SearchComponents', () => {
  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        view: {
          printMode: false
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        printClass: ''
      } )
    } )

    it( 'maps state and props print', () => {
      const state = {
        view: {
          printMode: true
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        printClass: 'print'
      } )
    } )

  } )
} )
