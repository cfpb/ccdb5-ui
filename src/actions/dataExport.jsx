// Tip of the hat to:
// https://stackoverflow.com/questions/35623656
// https://stackoverflow.com/questions/3916191

import { buildLink, simulateClick } from './domUtils'
import { MODAL_HID, MODAL_SHOWN, MODAL_TYPE_DATA_EXPORT } from '../constants'
import Analytics from './analytics'
import { stateToQS } from '../reducers/query'

const DATA_HOST = 'https://data.consumerfinance.gov'

// ----------------------------------------------------------------------------
// Action Creators

/**
* Notifies the application that the export dialog box should appear
*
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function showExportDialog() {
  Analytics.sendEvent(
    Analytics.getDataLayerOptions( 'Export', 'User Opens Export Modal' )
  )
  return {
    type: MODAL_SHOWN,
    modalType: MODAL_TYPE_DATA_EXPORT,
    modalProps: {}
  }
}

/**
* Call the URL that contains the entire dataset
*
* @param {string} format JSON or CSV
* @returns {function} a set of steps to execute
*/
export function exportAllResults( format ) {
  Analytics.sendEvent(
    Analytics.getDataLayerOptions( 'Export All Data', format )
  )
  return () => {
    const uri = DATA_HOST + '/api/views/s6ew-h6mp/rows.' + format
    const link = buildLink( uri, 'download.' + format )
    simulateClick( link )
  }
}

/**
* Call the export endpoint of the API with the current filter criteria
*
* @param {string} format JSON or CSV
* @param {int} size The number of rows in the dataset
* @returns {function} a set of steps to execute
*/
export function exportSomeResults( format, size ) {
  Analytics.sendEvent(
    Analytics.getDataLayerOptions( 'Export Some Data', format )
  )
  return ( _, getState ) => {
    // params = {...getState()} only makes a shallow copy
    // Need to make a deep-copy or this size gets in the store (!)
    const params = { ...getState().query }

    params.size = size
    params.format = format
    // eslint-disable-next-line camelcase
    params.no_aggs = true

    const uri = '@@API' + stateToQS( params )
    const link = buildLink( uri, 'download.' + format )
    simulateClick( link )
  }
}

/**
* Navigate to Socrata in a different window
*
* @returns {function} a set of steps to execute
*/
export function visitSocrata() {
  Analytics.sendEvent(
    Analytics.getDataLayerOptions( 'Export', 'User redirects to Socrata' )
  )
  return dispatch => {
    dispatch( { type: MODAL_HID } )

    const uri = DATA_HOST + '/dataset/Consumer-Complaints/s6ew-h6mp'
    const link = buildLink( uri )
    simulateClick( link )
  }
}
