import * as actions from '../complaints';
import * as constants from '../../constants';
import { sendHitsQuery } from '../sendHitsQuery/sendHitsQuery';

/**
 * Routes to the correct endpoint based on the state
 *
 * @returns {Promise} a chain of promises that will update the Redux store
 */
export function sendQuery() {
  // eslint-disable-next-line complexity
  return (dispatch, getState) => {
    const state = getState();
    const viewMode = state.query.tab;
    switch (viewMode) {
      case constants.MODE_MAP:
      case constants.MODE_LIST:
      case constants.MODE_TRENDS:
        dispatch(actions.getAggregations());
        break;
      default:
        return;
    }

    // Send the right-hand queries
    dispatch(sendHitsQuery());
  };
}
