import { COMPLAINTS_RECEIVED } from '../constants'

export function getComplaints() {
  return dispatch => {
    return fetch('@@API')
    .then(result => result.json())
    .then(items => dispatch(complaintsReceived(items)))
  }
}

export function complaintsReceived(data) {
  return {
    type: COMPLAINTS_RECEIVED,
    data
  }
}