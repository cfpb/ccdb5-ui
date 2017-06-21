import { COMPLAINTS_RECEIVED } from '../constants'
const defaultResults = {
  items: [],
  total: 0
}

export default (state = defaultResults, action) => {
  switch(action.type) {
  case COMPLAINTS_RECEIVED:
    return {
      ...state,
      items: action.items,
      total: action.items.length
    }

  default:
    return state
  }
}
