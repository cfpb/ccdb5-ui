import target, {
  defaultView
} from '../view'
import actions from '../../actions'

describe( 'reducer:map', () => {
  let action

  describe( 'reducer', () => {
    it( 'has a default state', () => {
      expect( target( undefined, {} ) ).toEqual( defaultView )
    } )
  } )

  describe('handles PRINT_MODE_CHANGED', ()=>{
    action = {
      type: actions.PRINT_MODE_CHANGED,
    }
    expect( target( {}, action ) ).toEqual( {
      printMode: true
    } )
  })

} )
