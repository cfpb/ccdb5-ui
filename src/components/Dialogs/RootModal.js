// Tip of the hat to: https://stackoverflow.com/questions/35623656

import './RootModal.less';
import * as types from '../../constants';
import { connect } from 'react-redux';
import DataExport from './DataExport';
import MoreAbout from './MoreAbout';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

const buildMap = () => {
  const retVal = {};
  retVal[types.MODAL_TYPE_DATA_EXPORT] = DataExport;
  retVal[types.MODAL_TYPE_MORE_ABOUT] = MoreAbout;
  return retVal;
};

export const MODAL_COMPONENTS = buildMap();

export const RootModal = ({ modalType, modalProps, onClose }) => {
  if (modalType in MODAL_COMPONENTS) {
    const SpecificModal = MODAL_COMPONENTS[modalType];

    return (
      <ReactModal
        appElement={document.querySelector('#ccdb-ui-root')}
        isOpen={true}
        contentLabel="CFPB Modal Dialog"
        className="modal-body"
        overlayClassName="modal-overlay"
        onRequestClose={onClose}
      >
        <SpecificModal {...modalProps} onClose={onClose} />
      </ReactModal>
    );
  }

  return (
    <ReactModal
      appElement={document.querySelector('#ccdb-ui-root')}
      isOpen={false}
    />
  );
};

export const mapDispatchToProps = (dispatch) => ({
  onClose: () => {
    dispatch({ type: types.MODAL_HID });
  },
});

export const mapStateToProps = (state) => state.modal;

export default connect(mapStateToProps, mapDispatchToProps)(RootModal);

RootModal.propTypes = {
  modalType: PropTypes.string,
  modalProps: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
