import PropTypes from 'prop-types';

export const MoreAbout = ({ onClose }) => {
  const urlScrubbing =
    'https://files.consumerfinance.gov/f/documents/' +
    '201503_cfpb_Narrative-Scrubbing-Standard.pdf';

  const urlCriteria =
    'https://files.consumerfinance.gov/f/documents/' +
    '201503_cfpb_disclosure-of-consumer-complaint-narrative-data.pdf';

  return (
    <section className="more-about-modal">
      <div className="header">
        <h3>Things you should know before you use this database</h3>
      </div>
      <div className="body">
        <p className="body-copy">
          This database only includes complaints the CFPB sent to companies and
          complaints are only published after the company responds, confirming a
          commercial relationship or after 15 days, whichever comes first. This
          database does not include complaints referred to other regulators,
          such as complaints about depository institutions with less than $10
          billion in assets.
        </p>
        <p className="body-copy">
          This database is not a statistical sample of consumers’ experiences in
          the marketplace. Complaints are not necessarily representative of all
          consumers’ experiences with a financial product or company.
          Company-specific information should be considered in the context of
          that company’s size and/or market share.
        </p>
        <p className="body-copy">
          This database only includes a consumer’s description of what happened
          in their own words if the consumer agrees to share it and after we
          take steps to&nbsp;
          <a href={urlScrubbing} target="_blank" rel="noopener noreferrer">
            remove personal information
          </a>
          .&nbsp; One consumer’s experience is not necessarily representative of
          all consumers’ experiences and narratives are not verified before
          publication.
        </p>
        <p className="body-copy">
          This database generally updates daily and doesn’t include complaints
          that don’t meet our&nbsp;
          <a href={urlCriteria} target="_blank" rel="noopener noreferrer">
            publication criteria
          </a>
          .
        </p>
      </div>
      <div className="footer layout-row">
        <button className="a-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </section>
  );
};

MoreAbout.propTypes = {
  onClose: PropTypes.func.isRequired,
};
