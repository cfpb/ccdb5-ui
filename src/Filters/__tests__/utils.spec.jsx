import React from 'react'
import { shortIsoFormat } from '../utils'

describe('module::utils', () => {
  describe('shortIsoFormat', () => {
    it('handles nulls', () => {
      const actual = shortIsoFormat( null )
      expect( actual ).toEqual( '' )
    })
  })
})

