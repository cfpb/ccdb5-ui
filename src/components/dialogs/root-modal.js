import './root-modal.scss';
import * as types from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { DataExport } from './data-export/data-export';
import { ExportConfirmation } from './data-export/export-confirmation';
import { MoreAbout } from './more-about/more-about';
import { useMemo } from 'react';
import ReactModal from 'react-modal';
import { selectViewModalTypeShown } from '../../reducers/view/selectors';
import { modalHidden } from '../../reducers/view/view-slice';
import { getAppElement, getModalPortalParent } from '../../utils/dom';

export const RootModal = () => {
  const modalType = useSelector(selectViewModalTypeShown);
  const dispatch = useDispatch();
  const appElement = getAppElement();
  const portalParent = getModalPortalParent();
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
      {...(appElement ? { appElement } : {})}
      isOpen={true}
      contentLabel="CFPB Modal Dialog"
      className="ccdb-modal"
      overlayClassName="ccdb-modal__overlay"
      parentSelector={() => portalParent}
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
