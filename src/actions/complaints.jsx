import { COMPLAINTS_RECEIVED } from '../constants'

export function getComplaints() {
  return dispatch => {
    return fetch('https://data.consumerfinance.gov/resource/jhzv-w97w.json')
    .then(result => result.json())
    .then(items => dispatch(complaintsReceived(items)))
  }
}

export function complaintsReceived(items) {
  return {
    type: COMPLAINTS_RECEIVED,
    items
  }
}