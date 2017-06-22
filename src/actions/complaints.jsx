import { COMPLAINTS_RECEIVED } from '../constants'
const queryString = require('query-string');

// ----------------------------------------------------------------------------
// Builders

const fieldMap = {
  searchText: 'search_term',
  from: 'frm'
}

export function stateToQS(state) {
  const params = {}
  const fields = Object.keys(state.query)

  // Copy over the fields
  fields.forEach(field => {
    // Do not include empty fields
    if( !state.query[field] ) {
      return;
    }

    // Map the internal field names to the API field names
    if( fieldMap[field] ) {
      params[fieldMap[field]] = state.query[field]
    }
    else {
      params[field] = state.query[field]
    }
  })

  return '?' + queryString.stringify(params)
}

// ----------------------------------------------------------------------------
// Action Creators

export function getComplaints() {
  return (dispatch, getState) => {
    const uri = '@@API' + stateToQS(getState())
    return fetch(uri)
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