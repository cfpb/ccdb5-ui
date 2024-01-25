import { ariaReadoutNumbers } from '../../utils';
import { FormattedDate } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import iconMap from '../iconMap';

const SubAggregation = ({ label, value }) => {
  return value ? (
    <div className="layout-row">
      <span className="body-copy subitem" tabIndex="0">
        {label}
      </span>
      <span className="body-copy" tabIndex="0">
        {value}
      </span>
    </div>
  ) : null;
};

SubAggregation.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

const ConsumerConsent = ({ value }) => {
  // Arrays are for SVG icon call and add custom classes for setting color.
  const iconLookupMap = {
    'Consent provided': ['approved-round', 'cf-icon-approved-round'],
    'Consent not provided': ['delete-round', 'cf-icon-delete-round'],
    'Consent withdrawn': ['minus-round', 'cf-icon-minus-round'],
    'N/A': ['help-round', 'cf-icon-help-round'],
    Other: ['help-round', 'cf-icon-help-round'],
  };

  let consentIcon;
  if (value in iconLookupMap) {
    const consentIconLookup = iconLookupMap[value];
    const iconName = consentIconLookup[0];
    const customClass = consentIconLookup[1];
    consentIcon = iconMap.getIcon(iconName, customClass);
  } else {
    consentIcon = iconMap.getIcon('error-round', 'cf-icon-error-round');
    value = 'No data available';
  }

  return (
    <div>
      <span className="cf-icon__before">{consentIcon}</span>
      <span className="body-copy" tabIndex="0">
        {value}
      </span>
    </div>
  );
};

ConsumerConsent.propTypes = { value: PropTypes.string };

const CompanyTimely = ({ value }) => {
  if (!value) {
    return (
      <span className="body-copy" tabIndex="0">
        N/A
      </span>
    );
  }
  const styles = ['cf-icon__before'];
  if (value.toLowerCase() === 'no') {
    styles.push('not-timely');
  }

  return (
    <div>
      <span className="cf-icon__before">
        {iconMap.getIcon(
          'clock-round',
          'cf-icon-clock-round' +
            (value.toLowerCase() === 'no' ? ' not-timely' : ''),
        )}
      </span>
      <span className="body-copy" tabIndex="0">
        {value}
      </span>
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
      <h1 aria-label={'Complaint ' + h1ReadOut} tabIndex="0">
        {id}
      </h1>
      <div className="card">
        <div className="card-left layout-column">
          <h4 tabIndex="0">Date CFPB received the complaint</h4>
          <span className="body-copy" tabIndex="0">
            <FormattedDate value={data.date_received} />
          </span>
          <br />
          <h4 tabIndex="0">Consumer&apos;s state</h4>
          <span className="body-copy" tabIndex="0">
            {data.state}
          </span>
          <br />
          <h4 tabIndex="0">Consumer&apos;s zip</h4>
          <span className="body-copy" tabIndex="0">
            {data.zip_code}
          </span>
          <br />
          <h4 tabIndex="0">Submitted via</h4>
          <span className="body-copy" tabIndex="0">
            {data.submitted_via}
          </span>
          <br />
          <h4 tabIndex="0">Tags</h4>
          <span className="body-copy" tabIndex="0">
            {data.tags}
          </span>
          <br />
          <h4 tabIndex="0">Did consumer dispute the response?</h4>
          <span className="body-copy" tabIndex="0">
            {data.consumer_disputed}
          </span>
        </div>
        <div className="card-right layout-column">
          <h4 tabIndex="0">Product</h4>
          <h3 tabIndex="0">{data.product}</h3>
          <SubAggregation label="Sub-product:" value={data.sub_product} />
          <br />
          <h4 tabIndex="0">Issue</h4>
          <h3 tabIndex="0">{data.issue}</h3>
          <SubAggregation label="Sub-issue:" value={data.sub_issue} />
          <br />
          <h4 tabIndex="0">Consumer consent to publish narrative</h4>
          <ConsumerConsent value={data.consumer_consent_provided} />
          <br />
          {narrative ? (
            <div>
              <h4 tabIndex="0">Consumer complaint narrative</h4>
              <span className="body-copy" tabIndex="0">
                {narrative}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <h2 className="company-information" tabIndex="0">
        Company information
      </h2>
      <div className="card">
        <div className="card-left layout-column">
          <h4 tabIndex="0">Date complaint sent to company</h4>
          <span className="body-copy" tabIndex="0">
            <FormattedDate value={data.date_sent_to_company} />
          </span>
          <br />
          <h4 tabIndex="0">Company name</h4>
          <span className="body-copy" tabIndex="0">
            {data.company}
          </span>
          <br />
        </div>
        <div className="card-right layout-column">
          <h4 tabIndex="0">Timely response?</h4>
          <CompanyTimely value={data.timely} />
          <br />
          <h4 tabIndex="0">Company response to consumer</h4>
          <span className="body-copy" tabIndex="0">
            {data.company_response ? data.company_response : 'N/A'}
          </span>
          <br />
          <h4 tabIndex="0">Company public response</h4>
          <span className="body-copy" tabIndex="0">
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
