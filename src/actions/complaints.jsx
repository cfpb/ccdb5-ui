export const COMPLAINTS_API_CALLED = 'COMPLAINTS_API_CALLED'
export const COMPLAINTS_RECEIVED = 'COMPLAINTS_RECEIVED'
export const COMPLAINTS_FAILED = 'COMPLAINTS_FAILED'
export const COMPLAINT_DETAIL_RECEIVED = 'COMPLAINT_DETAIL_RECEIVED'
export const COMPLAINT_DETAIL_FAILED = 'COMPLAINT_DETAIL_FAILED'

// ----------------------------------------------------------------------------
// Action Creators

/**
* Calls the search endpoint of the API
*
* @returns {Promise} a chain of promises that will update the Redux store
*/
export function getComplaints() {
  return ( dispatch, getState ) => {
    const store = getState()
    const qs = store.query.queryString
    const uri = '@@API' + qs

    // This call is already in process
    if ( uri === store.results.activeCall ) {
      return null
    }

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
    type: COMPLAINTS_API_CALLED,
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
    type: COMPLAINTS_RECEIVED,
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
    type: COMPLAINTS_FAILED,
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
    type: COMPLAINT_DETAIL_RECEIVED,
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
    type: COMPLAINT_DETAIL_FAILED,
    error
  }
}
