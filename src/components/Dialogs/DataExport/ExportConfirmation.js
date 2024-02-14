import React from 'react';
import getIcon from '../../iconMap';
import { useDispatch } from 'react-redux';
import { hideModal } from '../../../actions/view';

export const ExportConfirmation = () => {
  const dispatch = useDispatch();

  return (
    <section className="export-modal">
      <div className="header layout-row">
        <h3 className="flex-all">Export complaints</h3>
        <button
          className="a-btn a-btn__link"
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(hideModal());
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
