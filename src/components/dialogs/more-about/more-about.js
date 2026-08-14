import PropTypes from 'prop-types';
import { Button, Heading, Paragraph } from '@cfpb/design-system-react';

export const MoreAbout = ({ onClose }) => {
  return (
    <section className="more-about-modal">
      <div className="header">
        <Heading type="3">
          Things you should know before you use this database
        </Heading>
      </div>
      <div className="body">
        <Paragraph>
          This database only includes complaints the CFPB sent to companies and
          complaints are only published after the company responds, confirming a
          commercial relationship or after 15 days, whichever comes first. This
          database does not include complaints referred to other regulators,
          such as complaints about depository institutions with less than $10
          billion in assets.
        </Paragraph>
        <Paragraph>
          This database is not a statistical sample of consumers’ experiences in
          the marketplace. Complaints are not necessarily representative of all
          consumers’ experiences with a financial product or company.
          Company-specific information should be considered in the context of
          that company’s size and/or market share.
        </Paragraph>
        <Paragraph>This database generally updates daily.</Paragraph>
      </div>
      <div className="footer layout-row">
        <Button label="Close" onClick={onClose} />
      </div>
    </section>
  );
};

MoreAbout.propTypes = {
  onClose: PropTypes.func.isRequired,
};
