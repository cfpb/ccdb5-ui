// Tip of the hat to: 
// https://stackoverflow.com/questions/35623656
// https://stackoverflow.com/questions/3916191

import { stateToQS } from './complaints'
import { buildLink, simulateClick } from './domUtils'
import { MODAL_HID, MODAL_SHOWN, MODAL_TYPE_DATA_EXPORT } from '../constants'

const DATA_HOST = 'https://data.consumerfinance.gov'

// ----------------------------------------------------------------------------
// Action Creators

export function showExportDialog() {
  return {
    type: MODAL_SHOWN,
    modalType: MODAL_TYPE_DATA_EXPORT,
    modalProps: {}
  }
}

export function exportAllResults(format) {
  return (dispatch, getState) => {
    dispatch({type: MODAL_HID})

    const uri = DATA_HOST + '/api/views/s6ew-h6mp/rows.json'
    const link = buildLink(uri, 'download.' + format)
    simulateClick(link)
  }
}

export function exportSomeResults(format, size) {
  return (dispatch, getState) => {
    dispatch({type: MODAL_HID})

    // params = {...getState()} only makes a shallow copy
    // Need to make a deep-copy or this size gets in the store (!)
    const params = {
      query: {...getState().query}
    }
    params.query.size = Math.min(10000, size)
    params.query.format = format

    // TODO: set the format, correct size and no_aggs in the query string

    const uri = '@@API' + stateToQS(params)
    const link = buildLink(uri, 'download.' + format)
    simulateClick(link)
  }
}

export function visitSocrata() {
  return dispatch => {
    dispatch({type: MODAL_HID})

    const uri = DATA_HOST + '/dataset/Consumer-Complaints/s6ew-h6mp'
    const link = buildLink(uri)
    simulateClick(link)
  }
}
