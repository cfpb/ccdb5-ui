import './RootModal.scss';
import * as types from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { DataExport } from './DataExport/DataExport';
import { ExportConfirmation } from './DataExport/ExportConfirmation';
import { MoreAbout } from './MoreAbout/MoreAbout';
import { useMemo } from 'react';
import ReactModal from 'react-modal';
import { selectViewModalTypeShown } from '../../reducers/view/selectors';
import { modalHidden } from '../../reducers/view/viewSlice';

export const RootModal = () => {
  const modalType = useSelector(selectViewModalTypeShown);
  const dispatch = useDispatch();
  const SpecificModal = useMemo(() => {
    const modals = {
      [types.MODAL_TYPE_DATA_EXPORT]: DataExport,
      [types.MODAL_TYPE_EXPORT_CONFIRMATION]: ExportConfirmation,
      [types.MODAL_TYPE_MORE_ABOUT]: MoreAbout,
    };
    return modals[modalType];
  }, [modalType]);

  return SpecificModal ? (
    <ReactModal
      appElement={document.querySelector('#ccdb-ui-root')}
      isOpen={true}
      contentLabel="CFPB Modal Dialog"
      className="modal-body"
      overlayClassName="modal-overlay"
      onRequestClose={() => {
        dispatch(modalHidden());
      }}
    >
      <SpecificModal
        onClose={() => {
          dispatch(modalHidden());
        }}
      />
    </ReactModal>
  ) : null;
};
