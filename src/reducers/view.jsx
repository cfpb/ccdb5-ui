/* eslint-disable camelcase */
import { DATE_INTERVAL_CHANGED, DATE_RANGE_CHANGED } from '../actions/filter'
import { DATE_RANGE_MIN } from '../constants'
import moment from 'moment'
import { TAB_CHANGED } from '../actions/view'

const defaultView = {
  dateInterval: '3y',
  tab: 'Map'
}

/* eslint complexity: ["error", 7] */
/**
 * helper function to get interval based on selected dates
 * @param {object} state redux state
 * @param {object} action the redux action containing values from date_range
 * @returns {string} the interval
 * @private
 */
function _calculateInterval( state, action ) {
  // only check intervals if the end date is today
  if ( !moment( action.maxDate ).isSame( new Date(), 'day' ) ) {
    return '';
  }

  // is the start date the same as the oldest document?
  if ( moment( action.minDate ).isSame( DATE_RANGE_MIN, 'day' ) ) {
    return 'All';
  }

  const end = moment( action.maxDate );
  const start = moment( action.minDate );

  // verify if it's 3 or 1 years
  const yrDiff = end.diff( start, 'years' );
  if ( yrDiff === 3 || yrDiff === 1 ) {
    return yrDiff + 'y';
  }

  // verify if it's 6 or 3 months
  const moDiff = end.diff( start, 'months' );
  if ( moDiff === 6 || moDiff === 3 ) {
    return moDiff + 'm';
  }

  return '';
}

export default ( state = defaultView, action ) => {
  const newState = { ...state };
  switch ( action.type ) {
    case DATE_INTERVAL_CHANGED:
      newState.dateInterval = action.dateInterval;
      break;
    case DATE_RANGE_CHANGED:
      newState.dateInterval = _calculateInterval( state, action );
      break;
    case TAB_CHANGED:
      newState.tab = action.tab;
      break;
    default:
      break;
  }
  return newState;
}
