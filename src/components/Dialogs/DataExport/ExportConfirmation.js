import getIcon from '../../Common/Icon/iconMap';
import { useDispatch } from 'react-redux';
import { modalHidden } from '../../../reducers/view/viewSlice';

export const ExportConfirmation = () => {
  const dispatch = useDispatch();

  return (
    <section className="export-modal">
      <div className="header layout-row">
        <h3 className="flex-all">Export complaints</h3>
        <button
          className="a-btn a-btn--link"
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(modalHidden());
          }}
        >
          Close
          {getIcon('delete-round')}
        </button>
      </div>
      <div className="body">
        <div className="body-copy instructions">
          It may take a few minutes for your file to download. You can keep
          working while it processes.
        </div>
      </div>
    </section>
  );
};
