import './root-modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import { MoreAbout } from './more-about/more-about';
import ReactModal from 'react-modal';
import { selectViewIsMoreAboutModalOpen } from '../../reducers/view/selectors';
import { moreAboutModalHidden } from '../../reducers/view/view-slice';
import { getAppElement, getModalPortalParent } from '../../utils/dom';

export const RootModal = () => {
  const isOpen = useSelector(selectViewIsMoreAboutModalOpen);
  const dispatch = useDispatch();

  if (!isOpen) {
    return null;
  }

  const appElement = getAppElement();
  const portalParent = getModalPortalParent();
  const closeModal = () => {
    dispatch(moreAboutModalHidden());
  };

  return (
    <ReactModal
      {...(appElement ? { appElement } : {})}
      isOpen
      contentLabel="CFPB Modal Dialog"
      className="modal-body"
      overlayClassName="modal-overlay"
      parentSelector={() => portalParent}
      onRequestClose={closeModal}
    >
      <MoreAbout onClose={closeModal} />
    </ReactModal>
  );
};
