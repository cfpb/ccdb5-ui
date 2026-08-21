import './complaint-card.scss';
import { ariaReadoutNumbers } from '../../../utils';
import { Link } from 'react-router';
import { formatDisplayDate } from '../../../utils/format-date';
import { Heading } from '@cfpb/design-system-react';
import type { ReactNode } from 'react';

export interface ComplaintCardRow {
  complaint_id: string;
  company: string;
  company_response: string;
  timely: string;
  date_received: string;
  state: string;
  product: string;
  sub_product?: string | null;
  issue: string;
  sub_issue?: string | null;
}

interface ComplaintCardProps {
  row: ComplaintCardRow;
}

interface CardFieldProps {
  title: string;
  children: ReactNode;
}

const stripPossibleHighlight = (str: string) => {
  const re = /(<em>)?(.*?)(<\/em>)?/gi;
  return str.replaceAll(re, '$2');
};

const renderPossibleHighlight = (str: string) => {
  return <span dangerouslySetInnerHTML={{ __html: str }} />;
};

const CardField = ({ title, children }: CardFieldProps) => (
  <div className="complaint-card__field">
    <Heading type="4">{title}</Heading>
    <div className="complaint-card__field-value">{children}</div>
  </div>
);

export const ComplaintCard = ({ row }: ComplaintCardProps) => {
  const cleanId = stripPossibleHighlight(row.complaint_id);
  const complaintIdPath = 'detail/' + stripPossibleHighlight(row.complaint_id);

  return (
    <li className="complaint-card">
      <div className="complaint-card__body">
        <div className="complaint-card__id">
          <CardField title="Complaint ID">
            <Link
              className="complaint-card__detail-link"
              to={complaintIdPath}
              aria-label={'Complaint ' + ariaReadoutNumbers(cleanId)}
            >
              {cleanId}
            </Link>
          </CardField>
        </div>
        <div className="complaint-card__meta">
          <p className="complaint-card__meta-item">
            <Heading type="4" className="complaint-card__meta-label">
              Date received:
            </Heading>{' '}
            <span className="complaint-card__field-value">
              {formatDisplayDate(row.date_received)}
            </span>
          </p>
          <p className="complaint-card__meta-item">
            <Heading type="4" className="complaint-card__meta-label">
              Consumer’s state:
            </Heading>{' '}
            <span className="complaint-card__field-value">
              {renderPossibleHighlight(row.state)}
            </span>
          </p>
        </div>
        <div className="complaint-card__column complaint-card__column--primary">
          <CardField title="Company name">
            {renderPossibleHighlight(row.company)}
          </CardField>
          <CardField title="Company response to consumer">
            {renderPossibleHighlight(row.company_response)}
          </CardField>
          <CardField title="Timely response?">
            {renderPossibleHighlight(row.timely)}
          </CardField>
        </div>
        <div className="complaint-card__column complaint-card__column--secondary">
          <CardField title="Product">
            {renderPossibleHighlight(row.product)}
          </CardField>
          {row.sub_product ? (
            <CardField title="Sub-product">
              {renderPossibleHighlight(row.sub_product)}
            </CardField>
          ) : null}
          <CardField title="Issue">
            {renderPossibleHighlight(row.issue)}
          </CardField>
          {row.sub_issue ? (
            <CardField title="Sub-issue">
              {renderPossibleHighlight(row.sub_issue)}
            </CardField>
          ) : null}
        </div>
      </div>
    </li>
  );
};
