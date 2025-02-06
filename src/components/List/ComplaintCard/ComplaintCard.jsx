import './ComplaintCard.scss';
import { ariaReadoutNumbers } from '../../../utils';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDisplayDate } from '../../../utils/formatDate';

const MAX_NARRATIVE = 300;

export const ComplaintCard = ({ row }) => {
  const _stripPossibleHighlight = (str) => {
    const re = /(<em>)?(.*?)(<\/em>)?/gi;
    return str.replace(re, '$2');
  };
  const cleanId = _stripPossibleHighlight(row.complaint_id);
  const complaintIdPath = 'detail/' + _stripPossibleHighlight(row.complaint_id);

  const _renderPossibleHighlight = (str) => {
    return (
      <span className="body-copy" dangerouslySetInnerHTML={{ __html: str }} />
    );
  };

  const _renderNarrative = (narrative, url) => {
    const hasOverflow = narrative.length > MAX_NARRATIVE;
    narrative = narrative.substring(0, MAX_NARRATIVE);

    return narrative ? (
      <div>
        <h4 className="u-mt15">Consumer Complaint Narrative</h4>
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
          <h3 className="to-detail">
            <Link
              to={complaintIdPath}
              aria-label={'Complaint ' + ariaReadoutNumbers(cleanId)}
            >
              {cleanId}
            </Link>
          </h3>
          <h4>Company name</h4>
          {_renderPossibleHighlight(row.company)}
          <h4 className="u-mt15">Company response to consumer</h4>
          {_renderPossibleHighlight(row.company_response)}
          <h4 className="u-mt15">Timely response?</h4>
          {_renderPossibleHighlight(row.timely)}
        </div>
        <div className="card-right layout-column">
          <div className="layout-row">
            <div className="layout-row">
              <h4>Date received:</h4>
              <span className="body-copy">
                {formatDisplayDate(row.date_received)}
              </span>
            </div>
            <div className="spacer" />
            <div className="layout-row">
              <h4>Consumer’s state:</h4>
              {_renderPossibleHighlight(row.state)}
            </div>
          </div>
          <h4 className="u-mt15">Product</h4>
          <h3 dangerouslySetInnerHTML={{ __html: row.product }} />
          {row.sub_product ? (
            <div className="layout-row">
              <span className="body-copy subitem">Sub-product:</span>
              {_renderPossibleHighlight(row.sub_product)}
            </div>
          ) : null}
          <h4 className="u-mt15">Issue</h4>
          <h3 dangerouslySetInnerHTML={{ __html: row.issue }} />
          {row.sub_issue ? (
            <div className="layout-row">
              <span className="body-copy subitem">Sub-issue:</span>
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
