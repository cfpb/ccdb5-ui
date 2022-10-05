import {
  COMPLAINT_DETAIL_CALLED,
  COMPLAINT_DETAIL_FAILED,
  COMPLAINT_DETAIL_RECEIVED,
} from '../../actions/complaints';

const defaultDetail = {
  activeCall: '',
  data: {},
  error: '',
};

export default (state = defaultDetail, action) => {
  switch (action.type) {
    case COMPLAINT_DETAIL_CALLED:
      return {
        activeCall: action.url,
        data: {},
        error: '',
      };

    case COMPLAINT_DETAIL_RECEIVED:
      return {
        activeCall: '',
        data: action.data.hits.hits[0]._source,
        error: '',
      };

    case COMPLAINT_DETAIL_FAILED:
      return {
        activeCall: '',
        data: {},
        error: action.error,
      };

    default:
      return state;
  }
};
