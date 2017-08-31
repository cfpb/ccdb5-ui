/* eslint complexity: ["error", 6] */

import * as types from '../constants'
import { shortIsoFormat } from '../utils'
const queryString = require( 'query-string' );

// ----------------------------------------------------------------------------
// Builders

const fieldMap = {
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm'
}

/**
* Converts a set of key/value pairs into a query string for the API
*
* @param {string} state a set of key/value pairs
* @returns {string} a formatted query string
*/
export function stateToQS( state ) {
  const params = {}
  const fields = Object.keys( state.query )

  // Copy over the fields
  fields.forEach( field => {
    // Do not include empty fields
    if ( !state.query[field] ) {
      return;
    }

    var value = state.query[field]

    // Process dates
    if ( types.dateFilters.indexOf( field ) !== -1 ) {
      value = shortIsoFormat( value )
    }

    // Process boolean flags
    const positives = [ 'yes', 'true' ]
    if ( types.flagFilters.indexOf( field ) !== -1 ) {
      value = positives.includes( String( value ).toLowerCase() )
    }

    // Map the internal field names to the API field names
    if ( fieldMap[field] ) {
      params[fieldMap[field]] = value
    } else {
      params[field] = value
    }
  } )

  return '?' + queryString.stringify( params )
}

// ----------------------------------------------------------------------------
// Action Creators

/**
* Calls the search endpoint of the API
*
* @returns {Promise} a chain of promises that will update the Redux store
*/
export function getComplaints() {
  return ( dispatch, getState ) => {
    const uri = '@@API' + stateToQS( getState() )
    dispatch( callingApi( uri ) )
    return fetch( uri )
    .then( result => result.json() )
    .then( items => dispatch( complaintsReceived( items ) ) )
    .catch( error => dispatch( complaintsFailed( error ) ) )
  }
}

/**
* Calls the detail endpoint of the API
*
* @param {string} id the id of the complaint to retrieve
* @returns {Promise} a chain of promises that will update the Redux store
*/
export function getComplaintDetail( id ) {
  return dispatch => {
    const uri = '@@API' + id
    dispatch( callingApi( uri ) )
    fetch( uri )
      .then( result => result.json() )
      .then( data => dispatch( complaintDetailReceived( data ) ) )
      .catch( error => dispatch( complaintDetailFailed( error ) ) )
  }
}

/**
* Notifies the application that an API call is happening
*
* @param {string} url the url being called
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function callingApi( url ) {
  return {
    type: types.API_CALLED,
    url
  }
}

/**
* Creates an action in response to search results being received from the API
*
* @param {string} data the raw data returned from the API
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function complaintsReceived( data ) {
  return {
    type: types.COMPLAINTS_RECEIVED,
    data
  }
}

/**
* Creates an action in response after a search fails
*
* @param {string} error the error returned from `fetch`, not the API
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function complaintsFailed( error ) {
  return {
    type: types.COMPLAINTS_FAILED,
    error
  }
}

/**
* Creates an action in response to a complaint being received from the API
*
* @param {string} data the raw data returned from the API
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function complaintDetailReceived( data ) {
  return {
    type: types.COMPLAINT_DETAIL_RECEIVED,
    data
  }
}

/**
* Creates an action in response after a detail search fails
*
* @param {string} error the error returned from `fetch`, not the API
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function complaintDetailFailed( error ) {
  return {
    type: types.COMPLAINT_DETAIL_FAILED,
    error
  }
}
