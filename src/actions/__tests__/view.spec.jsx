import { REQUERY_HITS_ONLY, REQUERY_NEVER } from '../../constants'
import * as sut from '../view'

describe( 'action:view', () => {
  describe( 'filterVisibilityToggled', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.TOGGLE_FILTER_VISIBILITY,
        requery: REQUERY_NEVER
      }
      expect( sut.filterVisibilityToggled() ).toEqual( expectedAction )
    } )
  } )

  describe( 'printModeChanged', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.PRINT_MODE_CHANGED,
        requery: REQUERY_NEVER
      }
      expect( sut.printModeChanged() ).toEqual( expectedAction )
    } )
  } )

  describe( 'screenResized', () => {
    it( 'creates a simple action', () => {
      const expectedAction = {
        type: sut.SCREEN_RESIZED,
        screenWidth: 100,
        requery: REQUERY_NEVER
      }
      expect( sut.screenResized( 100 ) ).toEqual( expectedAction )
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
