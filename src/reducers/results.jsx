import { RCV_COMPLAINTS } from '../constants'
const defaultResults = {
  items: [],
  total: 0
}

export default (state = defaultResults, action) => {
  switch(action.type) {
  case RCV_COMPLAINTS:
    return {
      ...state,
      items: action.items,
      total: action.items.length
    }

  default:
    return state
  }
}
