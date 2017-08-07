// Tip of the hat to: https://stackoverflow.com/questions/35623656

import { MODAL_HID, MODAL_SHOWN } from '../constants'

const initialState = {
  modalType: null,
  modalProps: {}
}


// ----------------------------------------------------------------------------
// Action Handler

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case MODAL_SHOWN:
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      }
    case MODAL_HID:
      return initialState
    default:
      return state
  }
}
