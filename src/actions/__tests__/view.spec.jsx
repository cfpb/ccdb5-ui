import { REQUERY_HITS_ONLY } from '../../constants'
import * as sut from '../view'

describe( 'action:view', () => {
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
