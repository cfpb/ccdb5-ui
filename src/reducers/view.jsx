import {
  PRINT_MODE_CHANGED, SCREEN_RESIZED, TOGGLE_FILTER_VISIBILITY
} from '../actions/view'

export const defaultView = {
  printMode: false,
  showFilters: true,
  width: 0
}

export default ( state = defaultView, action ) => {
  switch ( action.type ) {
    case PRINT_MODE_CHANGED:
      return {
        printMode: !state.printMode
      }
    case SCREEN_RESIZED:
      return {
        showFilters: action.screenWidth > 749,
        width: action.screenWidth
      }
    case TOGGLE_FILTER_VISIBILITY:
      return {
        showFilters: !state.showFilters
      }
    default:
      return state
  }
}
