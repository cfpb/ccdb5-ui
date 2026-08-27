import { Button, Heading } from '@cfpb/design-system-react';
import { useDispatch } from 'react-redux';
import { modalHidden } from '../../../reducers/view/view-slice';

export const ExportConfirmation = () => {
  const dispatch = useDispatch();

  return (
    <section className="export-modal">
      <div className="ccdb-modal__header">
        <Heading type="3">
          Download complaint data
        </Heading>
        <Button
          label="Close"
          isLink
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(modalHidden());
          }}
        />
      </div>
      <div className="ccdb-modal__body">
        <div className="export-modal__instructions">
          It may take a few minutes for your file to download. You can keep
          working while it processes.
        </div>
      </div>
    </section>
  );
};
