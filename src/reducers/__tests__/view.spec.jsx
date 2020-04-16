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

  describe('handles PRINT_MODE_ON', ()=>{
    action = {
      type: actions.PRINT_MODE_ON,
    }
    expect( target( {}, action ) ).toEqual( {
      printMode: true
    } )
  })
  describe('handles PRINT_MODE_OFF', ()=>{
    action = {
      type: actions.PRINT_MODE_OFF,
    }
    expect( target( {}, action ) ).toEqual( {
      printMode: false
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

  describe( 'URL_CHANGED actions', () => {
    let action = null
    let state = null
    beforeEach( () => {
      action = {
        type: actions.URL_CHANGED,
        params: {}
      }

      state = { ...defaultView }
    } )

    it( 'handles empty params', () => {
      expect( target( state, action ) ).toEqual( state )
    } )

    it( 'handles string params', () => {
      action.params = { printMode: 'true' }
      const actual = target( state, action )
      expect( actual.printMode ).toEqual( 'true' )
    } )
  } )
} )
