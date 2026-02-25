import { ariaReadoutNumbers } from '../../utils';
import PropTypes from 'prop-types';
import { Icon } from '@cfpb/design-system-react';
import { formatDisplayDate } from '../../utils/formatDate';

const SubAggregation = ({ label, value }) => {
  return value ? (
    <div className="layout-row">
      <span className="body-copy subitem">{label}</span>
      <span className="body-copy">{value}</span>
    </div>
  ) : null;
};

SubAggregation.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

const ConsumerConsent = ({ value }) => {
  // Icon name in design-system (delete-round is error-round in DS)
  const iconLookupMap = {
    'Consent provided': ['approved-round', 'cf-icon-approved-round'],
    'Consent not provided': ['error-round', 'cf-icon-delete-round'],
    'Consent withdrawn': ['minus-round', 'cf-icon-minus-round'],
    'N/A': ['help-round', 'cf-icon-help-round'],
    Other: ['help-round', 'cf-icon-help-round'],
  };

  let consentIcon;
  if (value in iconLookupMap) {
    const [iconName, customClass] = iconLookupMap[value];
    consentIcon = (
      <Icon name={iconName} className={customClass} isPresentational />
    );
  } else {
    consentIcon = (
      <Icon name="error-round" className="cf-icon-error-round" isPresentational />
    );
    value = 'No data available';
  }

  return (
    <div>
      <span className="cf-icon__before">{consentIcon}</span>
      <span className="body-copy">{value}</span>
    </div>
  );
};

ConsumerConsent.propTypes = { value: PropTypes.string };

const CompanyTimely = ({ value }) => {
  if (!value) {
    return <span className="body-copy">N/A</span>;
  }
  const styles = ['cf-icon__before'];
  if (value.toLowerCase() === 'no') {
    styles.push('not-timely');
  }

  return (
    <div>
      <span className="cf-icon__before">
        <Icon
          name="clock-round"
          className={
            'cf-icon-clock-round' +
            (value.toLowerCase() === 'no' ? ' not-timely' : '')
          }
          isPresentational
        />
      </span>
      <span className="body-copy">{value}</span>
    </div>
  );
};

CompanyTimely.propTypes = { value: PropTypes.string };

export const ComplaintDetailBody = ({ data, error, id }) => {
  if (error) {
    return <h1>There was a problem retrieving {id}</h1>;
  }

  // Process the narrative
  const narrative = data.complaint_what_happened || '';
  const h1ReadOut = ariaReadoutNumbers(id);

  return (
    <article>
      <h1 aria-label={'Complaint ' + h1ReadOut}>{id}</h1>
      <div className="card">
        <div className="card-left layout-column">
          <h4>Date CFPB received the complaint</h4>
          <span className="body-copy">
            {formatDisplayDate(data.date_received)}
          </span>

          <h4 className="u-mt15">Consumer’s state</h4>
          <span className="body-copy">{data.state}</span>

          <h4 className="u-mt15">Consumer’s zip</h4>
          <span className="body-copy">{data.zip_code}</span>

          <h4 className="u-mt15">Submitted via</h4>
          <span className="body-copy">{data.submitted_via}</span>

          {data.tags && data.tags.length ? (
            <>
              <h4 className="u-mt15">Tags</h4>
              <span className="body-copy">{data.tags}</span>
            </>
          ) : null}
          <h4 className="u-mt15">Did consumer dispute the response?</h4>
          <span className="body-copy">{data.consumer_disputed}</span>
        </div>
        <div className="card-right layout-column">
          <h4>Product</h4>
          <h3>{data.product}</h3>
          <SubAggregation label="Sub-product:" value={data.sub_product} />

          <h4 className="u-mt15">Issue</h4>
          <h3>{data.issue}</h3>
          <SubAggregation label="Sub-issue:" value={data.sub_issue} />

          <h4 className="u-mt15">Consumer consent to publish narrative</h4>
          <ConsumerConsent value={data.consumer_consent_provided} />

          {narrative ? (
            <>
              <h4 className="u-mt15">Consumer complaint narrative</h4>
              <span className="body-copy">{narrative}</span>
            </>
          ) : null}
        </div>
      </div>

      <h2 className="company-information">Company information</h2>
      <div className="card">
        <div className="card-left layout-column">
          <h4>Date complaint sent to company</h4>
          <span className="body-copy">
            {formatDisplayDate(data.date_sent_to_company)}
          </span>

          <h4 className="u-mt15">Company name</h4>
          <span className="body-copy">{data.company}</span>
        </div>
        <div className="card-right layout-column">
          <h4>Timely response?</h4>
          <CompanyTimely value={data.timely} />

          <h4 className="u-mt15">Company response to consumer</h4>
          <span className="body-copy">
            {data.company_response ? data.company_response : 'N/A'}
          </span>

          <h4 className="u-mt15">Company public response</h4>
          <span className="body-copy">
            {data.company_public_response
              ? data.company_public_response
              : 'N/A'}
          </span>
        </div>
      </div>
    </article>
  );
};

ComplaintDetailBody.propTypes = {
  data: PropTypes.object,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  id: PropTypes.string,
};
