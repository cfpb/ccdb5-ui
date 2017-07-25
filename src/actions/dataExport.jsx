// Tip of the hat to: 
// https://stackoverflow.com/questions/35623656
// https://stackoverflow.com/questions/3916191

import { stateToQS } from './complaints'
import { MODAL_HID, MODAL_SHOWN, MODAL_TYPE_DATA_EXPORT } from '../constants'

export function showExportDialog() {
  return {
    type: MODAL_SHOWN,
    modalType: MODAL_TYPE_DATA_EXPORT,
    modalProps: {}
  }
}

export function exportResults(format, size) {
  return (dispatch, getState) => {
    dispatch({type: MODAL_HID})

    const params = {...getState()}
    params.query.size = 1000
    const uri = '@@API' + stateToQS(params)
    const link = document.createElement("a")
    link.href = uri
    link.download = 'monkey.csv'
    //link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }  
}

export function visitSocrata() {
  return dispatch => {
    dispatch({type: MODAL_HID})

    const link = document.createElement("a")
    link.href = 'https://data.consumerfinance.gov/dataset/Consumer-Complaints/s6ew-h6mp'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }  
}
