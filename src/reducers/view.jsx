import {
  PRINT_MODE_CHANGED
} from '../actions/view'

const defaultView = {
  printMode: false
}

export default ( state = defaultView, action ) => {
  switch ( action.type ) {
    case PRINT_MODE_CHANGED:
      return {
        printMode: !state.printMode
      }
    default:
      return state
  }
}
