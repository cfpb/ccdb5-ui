import * as actions from '../complaints';
import * as constants from '../../constants';

/**
 * Routes to the correct endpoint based on the state
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function sendHitsQuery() {
  // eslint-disable-next-line complexity
  return (dispatch, getState) => {
    const state = getState();
    const viewMode = state.query.tab;
    switch (viewMode) {
      case constants.MODE_MAP:
        dispatch(actions.getStates());
        break;
      case constants.MODE_TRENDS:
        dispatch(actions.getTrends());
        break;
      case constants.MODE_LIST:
        dispatch(actions.getComplaints());
        break;
      default:
        break;
    }
  };
}
