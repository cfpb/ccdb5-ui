// Tip of the hat to: https://stackoverflow.com/questions/35623656

import './RootModal.less'
import * as types from '../constants'
import { connect } from 'react-redux'
import DataExport from './DataExport'
import React from 'react'
import ReactModal from 'react-modal'

const buildMap = () => {
  const retVal = {}
  retVal[types.MODAL_TYPE_DATA_EXPORT] = DataExport

  return retVal
}

export const MODAL_COMPONENTS = buildMap()

export const RootModal = ( { modalType, modalProps, onClose } ) => {
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

  return <span />
}

export const mapDispatchToProps = dispatch => ( {
  onClose: _ => {
    dispatch( { type: types.MODAL_HID } )
  }
} )

export default connect( state => state.modal, mapDispatchToProps )( RootModal )
