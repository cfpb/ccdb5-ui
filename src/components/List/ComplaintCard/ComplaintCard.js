import './ComplaintCard.scss';
import { ariaReadoutNumbers } from '../../../utils';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { formatDisplayDate } from '../../../utils/formatDate';
import { Heading } from '@cfpb/design-system-react';

const MAX_NARRATIVE = 300;

export const ComplaintCard = ({ row }) => {
  const _stripPossibleHighlight = (str) => {
    const re = /(<em>)?(.*?)(<\/em>)?/gi;
    return str.replace(re, '$2');
  };
  const cleanId = _stripPossibleHighlight(row.complaint_id);
  const complaintIdPath = 'detail/' + _stripPossibleHighlight(row.complaint_id);

  const _renderPossibleHighlight = (str) => {
    return <span dangerouslySetInnerHTML={{ __html: str }} />;
  };

  const _renderNarrative = (narrative, url) => {
    const hasOverflow = narrative.length > MAX_NARRATIVE;
    narrative = narrative.substring(0, MAX_NARRATIVE);

    return narrative ? (
      <div>
        <Heading type="4" className="u-mt15">
          Consumer Complaint Narrative
        </Heading>
        {_renderPossibleHighlight(narrative)}
        {hasOverflow ? (
          <span>
            {' '}
            <Link to={url}>[...]</Link>
          </span>
        ) : null}
      </div>
    ) : null;
  };

  return (
    <li className="card-container">
      <div className="card">
        <div className="card-left layout-column">
          <Heading type="3" className="to-detail">
            <Link
              to={complaintIdPath}
              aria-label={'Complaint ' + ariaReadoutNumbers(cleanId)}
            >
              {cleanId}
            </Link>
          </Heading>
          <Heading type="4">Company name</Heading>
          {_renderPossibleHighlight(row.company)}
          <Heading type="4" className="u-mt15">
            Company response to consumer
          </Heading>
          {_renderPossibleHighlight(row.company_response)}
          <Heading type="4" className="u-mt15">
            Timely response?
          </Heading>
          {_renderPossibleHighlight(row.timely)}
        </div>
        <div className="card-right layout-column">
          <div className="layout-row">
            <div className="layout-row">
              <Heading type="4">Date received:</Heading>
              <span>{formatDisplayDate(row.date_received)}</span>
            </div>
            <div className="spacer" />
            <div className="layout-row">
              <Heading type="4">Consumer’s state:</Heading>
              {_renderPossibleHighlight(row.state)}
            </div>
          </div>
          <Heading type="4" className="u-mt15">
            Product
          </Heading>
          <Heading type="3" dangerouslySetInnerHTML={{ __html: row.product }} />
          {row.sub_product ? (
            <div className="layout-row">
              <span className="subitem">Sub-product:</span>
              {_renderPossibleHighlight(row.sub_product)}
            </div>
          ) : null}
          <Heading type="4" className="u-mt15">
            Issue
          </Heading>
          <Heading type="3" dangerouslySetInnerHTML={{ __html: row.issue }} />
          {row.sub_issue ? (
            <div className="layout-row">
              <span className="subitem">Sub-issue:</span>
              {_renderPossibleHighlight(row.sub_issue)}
            </div>
          ) : null}
          {_renderNarrative(row.complaint_what_happened || '', complaintIdPath)}
        </div>
      </div>
    </li>
  );
};

ComplaintCard.propTypes = {
  row: PropTypes.object.isRequired,
};
