import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../../constants'
import * as sut from '../view'

describe( 'action:view', () => {
  describe( 'printModeChanged', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.PRINT_MODE_CHANGED,
        requery: REQUERY_NEVER
      }
      expect( sut.printModeChanged() ).toEqual( expectedAction )
    } )
  } )
  describe( 'tabChanged', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.TAB_CHANGED,
        tab: 'Foo',
        requery: REQUERY_HITS_ONLY
      }
      expect( sut.tabChanged( 'Foo' ) ).toEqual( expectedAction )
    } )
  } )
} )
