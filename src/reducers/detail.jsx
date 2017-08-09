import {
  COMPLAINT_DETAIL_FAILED, COMPLAINT_DETAIL_RECEIVED
} from '../constants'

const defaultDetail = {
  data: {},
  error: ''
}

export default ( state = defaultDetail, action ) => {
  switch ( action.type ) {
    case COMPLAINT_DETAIL_RECEIVED:
      return {
        data: action.data.hits.hits[0]._source,
        error: ''
      }

    case COMPLAINT_DETAIL_FAILED:
      return {
        data: {},
        error: action.error
      }

    default:
      return state
  }
}
