import { RCV_COMPLAINTS } from '../constants'

export function getComplaints() {
  return dispatch => {
    return fetch('https://data.consumerfinance.gov/resource/jhzv-w97w.json')
    .then(result => result.json())
    .then(items => dispatch(receiveComplaints(items)))
  }
}

export function receiveComplaints(items) {
  return {
    type: RCV_COMPLAINTS,
    items
  }
}