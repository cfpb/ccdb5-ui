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

  describe( 'handles SCREEN_RESIZED', () => {
    it( 'handles widths over 749', () => {
      action = {
        type: actions.SCREEN_RESIZED,
        screenWidth: 1000
      }
      expect( target( {}, action ) ).toEqual( {
        showFilters: true,
        width: 1000
      } )
    } )
  } )

  it( 'handles widths under 749', () => {
    action = {
      type: actions.SCREEN_RESIZED,
      screenWidth: 375
    }
    expect( target( {}, action ) ).toEqual( {
      showFilters: false,
      width: 375
    } )
  } )

  describe('handles TOGGLE_FILTER_VISIBILITY', ()=>{
    action = {
      type: actions.TOGGLE_FILTER_VISIBILITY,
    }
    expect( target( {}, action ) ).toEqual( {
      showFilters: true
    } )
  })

} )
