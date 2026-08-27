import { ariaReadoutNumbers } from '../../utils';
import PropTypes from 'prop-types';
import { Heading, Icon } from '@cfpb/design-system-react';
import { formatDisplayDate } from '../../utils/format-date';

const SubAggregation = ({ label, value }) => {
  return value ? (
    <div className="complaint-detail__subaggregation">
      <span className="complaint-detail__subaggregation-label">{label}</span>
      <span>{value}</span>
    </div>
  ) : null;
};

SubAggregation.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

const CompanyTimely = ({ value }) => {
  if (!value) {
    return <span>N/A</span>;
  }

  return (
    <div>
      <span className="complaint-detail__timely-icon">
        <Icon name="clock-round" isPresentational />
      </span>
      <span>{value}</span>
    </div>
  );
};

CompanyTimely.propTypes = { value: PropTypes.string };

export const ComplaintDetailBody = ({ data, error, id }) => {
  if (error) {
    return <Heading type="1">There was a problem retrieving {id}</Heading>;
  }

  const h1ReadOut = ariaReadoutNumbers(id);

  return (
    <article className="complaint-detail__body">
      <Heading type="1" aria-label={'Complaint ' + h1ReadOut}>
        {id}
      </Heading>
      <div className="complaint-detail__card">
        <div className="complaint-detail__column complaint-detail__column--narrow">
          <Heading type="4">Date CFPB received the complaint</Heading>
          <span>{formatDisplayDate(data.date_received)}</span>

          <Heading type="4" className="u-mt15">
            Consumer’s state
          </Heading>
          <span>{data.state}</span>

          <Heading type="4" className="u-mt15">
            Consumer’s zip
          </Heading>
          <span>{data.zip_code}</span>

          <Heading type="4" className="u-mt15">
            Submitted via
          </Heading>
          <span>{data.submitted_via}</span>

          {data.tags && data.tags.length > 0 ? (
            <>
              <Heading type="4" className="u-mt15">
                Tags
              </Heading>
              <span>{data.tags}</span>
            </>
          ) : null}
        </div>
        <div className="complaint-detail__column complaint-detail__column--wide">
          <Heading type="4">Product</Heading>
          <Heading type="3">{data.product}</Heading>
          <SubAggregation label="Sub-product:" value={data.sub_product} />

          <Heading type="4" className="u-mt15">
            Issue
          </Heading>
          <Heading type="3">{data.issue}</Heading>
          <SubAggregation label="Sub-issue:" value={data.sub_issue} />
        </div>
      </div>

      <Heading type="2" className="complaint-detail__company-heading">
        Company information
      </Heading>
      <div className="complaint-detail__card">
        <div className="complaint-detail__column complaint-detail__column--narrow">
          <Heading type="4">Date complaint sent to company</Heading>
          <span>{formatDisplayDate(data.date_sent_to_company)}</span>

          <Heading type="4" className="u-mt15">
            Company name
          </Heading>
          <span>{data.company}</span>
        </div>
        <div className="complaint-detail__column complaint-detail__column--wide">
          <Heading type="4">Timely response?</Heading>
          <CompanyTimely value={data.timely} />

          <Heading type="4" className="u-mt15">
            Company response to consumer
          </Heading>
          <span>{data.company_response || 'N/A'}</span>

          <Heading type="4" className="u-mt15">
            Company public response
          </Heading>
          <span>{data.company_public_response || 'N/A'}</span>
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
