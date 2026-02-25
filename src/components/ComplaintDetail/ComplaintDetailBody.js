import { ariaReadoutNumbers } from '../../utils';
import PropTypes from 'prop-types';
import { Icon, Heading } from '@cfpb/design-system-react';
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
    'Consent provided': ['approved-round'],
    'Consent not provided': ['error-round'],
    'Consent withdrawn': ['minus-round'],
    'N/A': ['help-round'],
    Other: ['help-round'],
  };

  let consentIcon;
  if (value in iconLookupMap) {
    consentIcon = <Icon name={iconLookupMap[value]} isPresentational />;
  } else {
    consentIcon = <Icon name="error-round" isPresentational />;
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

  return (
    <div>
      <span className="cf-icon__before">
        <Icon name="clock-round" isPresentational />
      </span>
      <span className="body-copy">{value}</span>
    </div>
  );
};

CompanyTimely.propTypes = { value: PropTypes.string };

export const ComplaintDetailBody = ({ data, error, id }) => {
  if (error) {
    return <Heading type="1">There was a problem retrieving {id}</Heading>;
  }

  // Process the narrative
  const narrative = data.complaint_what_happened || '';
  const h1ReadOut = ariaReadoutNumbers(id);

  return (
    <article>
      <Heading type="1" aria-label={'Complaint ' + h1ReadOut}>
        {id}
      </Heading>
      <div className="card">
        <div className="card-left layout-column">
          <Heading type="4">Date CFPB received the complaint</Heading>
          <span className="body-copy">
            {formatDisplayDate(data.date_received)}
          </span>

          <Heading type="4" className="u-mt15">
            Consumer’s state
          </Heading>
          <span className="body-copy">{data.state}</span>

          <Heading type="4" className="u-mt15">
            Consumer’s zip
          </Heading>
          <span className="body-copy">{data.zip_code}</span>

          <Heading type="4" className="u-mt15">
            Submitted via
          </Heading>
          <span className="body-copy">{data.submitted_via}</span>

          {data.tags && data.tags.length ? (
            <>
              <Heading type="4" className="u-mt15">
                Tags
              </Heading>
              <span className="body-copy">{data.tags}</span>
            </>
          ) : null}
          <Heading type="4" className="u-mt15">
            Did consumer dispute the response?
          </Heading>
          <span className="body-copy">{data.consumer_disputed}</span>
        </div>
        <div className="card-right layout-column">
          <Heading type="4">Product</Heading>
          <Heading type="3">{data.product}</Heading>
          <SubAggregation label="Sub-product:" value={data.sub_product} />

          <Heading type="4" className="u-mt15">
            Issue
          </Heading>
          <Heading type="3">{data.issue}</Heading>
          <SubAggregation label="Sub-issue:" value={data.sub_issue} />

          <Heading type="4" className="u-mt15">
            Consumer consent to publish narrative
          </Heading>
          <ConsumerConsent value={data.consumer_consent_provided} />

          {narrative ? (
            <>
              <Heading type="4" className="u-mt15">
                Consumer complaint narrative
              </Heading>
              <span className="body-copy">{narrative}</span>
            </>
          ) : null}
        </div>
      </div>

      <Heading type="2" className="company-information">
        Company information
      </Heading>
      <div className="card">
        <div className="card-left layout-column">
          <Heading type="4">Date complaint sent to company</Heading>
          <span className="body-copy">
            {formatDisplayDate(data.date_sent_to_company)}
          </span>

          <Heading type="4" className="u-mt15">
            Company name
          </Heading>
          <span className="body-copy">{data.company}</span>
        </div>
        <div className="card-right layout-column">
          <Heading type="4">Timely response?</Heading>
          <CompanyTimely value={data.timely} />

          <Heading type="4" className="u-mt15">
            Company response to consumer
          </Heading>
          <span className="body-copy">
            {data.company_response ? data.company_response : 'N/A'}
          </span>

          <Heading type="4" className="u-mt15">
            Company public response
          </Heading>
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
