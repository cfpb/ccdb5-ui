// Tip of the hat to: https://stackoverflow.com/questions/35623656

import React from 'react'
import ReactModal from 'react-modal'
import { connect } from 'react-redux'
import DataExport from './DataExport'
import './RootModal.less'
import * as types from '../constants'

const buildMap = () => {
  const retVal = {}
  retVal[types.MODAL_TYPE_DATA_EXPORT] = DataExport

  return retVal
}

export const MODAL_COMPONENTS = buildMap()

export const RootModal = ({ modalType, modalProps, onClose }) => {
  if ( modalType in MODAL_COMPONENTS ) {
    const SpecificModal = MODAL_COMPONENTS[modalType]

    return (
      <ReactModal isOpen={true}
                  contentLabel="CFPB Modal Dialog"
                  className="modal-body"
                  overlayClassName="modal-overlay"
                  onRequestClose={onClose}>
        <SpecificModal {...modalProps} onClose={onClose} />
      </ReactModal>
    )
  }

  return (<span />)
}

export const mapDispatchToProps = dispatch => {
  return {
    onClose: _ => {
      dispatch({type: types.MODAL_HID})
    }
  }
}

export default connect(state => state.modal, mapDispatchToProps)(RootModal)