import { Button, Heading } from '@cfpb/design-system-react';
import { useDispatch } from 'react-redux';
import { modalHidden } from '../../../reducers/view/viewSlice';

export const ExportConfirmation = () => {
  const dispatch = useDispatch();

  return (
    <section className="export-modal">
      <div className="header layout-row">
        <Heading type="3" className="flex-all">
          Export complaints
        </Heading>
        <Button
          label="Close"
          iconRight="delete-round"
          isLink
          data-gtm_ignore="true"
          onClick={() => {
            dispatch(modalHidden());
          }}
        />
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
