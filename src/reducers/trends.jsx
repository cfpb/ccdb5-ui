// reducer for trends tab
import { COMPLAINTS_RECEIVED } from '../constants'

/* eslint-disable camelcase */

export const defaultState = {
  issues: [],
  products: [],
  trends: []
};

/* eslint-enable camelcase */

export default ( state = defaultState, action ) => {
  switch ( action.type ) {
    case COMPLAINTS_RECEIVED: {

      return {}
    }

    default:
      return state
  }
}
