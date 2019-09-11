/* eslint-disable camelcase */

import {
  TAB_CHANGED
} from '../constants'

const defaultView = {
  tab: 'List'
}

export default ( state = defaultView, action ) => {
  switch ( action.type ) {
    case TAB_CHANGED:
      return {
        ...state,
        tab: action.tab
      }

    default:
      return state
  }
}
