import * as types from '../constants'
const queryString = require( 'query-string' );

// ----------------------------------------------------------------------------
// Builders

const fieldMap = {
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm'
}

export function stateToQS( state ) {
  const params = {}
  const fields = Object.keys( state.query )

  // Copy over the fields
  fields.forEach( field => {
    // Do not include empty fields
    if ( !state.query[field] ) {
      return;
    }

    // Map the internal field names to the API field names
    if ( fieldMap[field] ) {
      params[fieldMap[field]] = state.query[field]
    } else {
      params[field] = state.query[field]
    }
  } )

  return '?' + queryString.stringify( params )
}

// ----------------------------------------------------------------------------
// Action Creators

export function getComplaints() {
  return ( dispatch, getState ) => {
    const uri = '@@API' + stateToQS( getState() )
    return fetch( uri )
    .then( result => result.json() )
    .then( items => dispatch( complaintsReceived( items ) ) )
    .catch( error => dispatch( complaintsFailed( error ) ) )
  }
}

export function getComplaintDetail( id ) {
  return dispatch => {
    const uri = '@@API' + id
    fetch( uri )
      .then( result => result.json() )
      .then( data => dispatch( complaintDetailReceived( data ) ) )
      .catch( error => dispatch( complaintDetailFailed( error ) ) )
  }
}

export function complaintsReceived( data ) {
  return {
    type: types.COMPLAINTS_RECEIVED,
    data
  }
}

export function complaintsFailed( error ) {
  return {
    type: types.COMPLAINTS_FAILED,
    error
  }
}

export function complaintDetailReceived( data ) {
  return {
    type: types.COMPLAINT_DETAIL_RECEIVED,
    data
  }
}

export function complaintDetailFailed( error ) {
  return {
    type: types.COMPLAINT_DETAIL_FAILED,
    error
  }
}
