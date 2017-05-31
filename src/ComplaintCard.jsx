import React from 'react';
import './ComplaintCard.less';

export default class ComplaintCard extends React.Component {
  fields = [
    'company',
    'company_public_response',
    'company_response',
    'complaint_what_happened',
    'consumer_consent_provided',
    'consumer_disputed',
    'date_received',
    'date_sent_to_company',
    'issue',
    'product',
    'state',
    'sub_issue',
    'sub_product',
    'submitted_via',
    'timely',
    'zip_code'
  ]

  render() {
    return (
      <li>
          {this.fields
            .filter(field => typeof this.props.row[field] !== 'undefined')
            .map(field => 
              <div className="col col-12" key={field}>
                <div className="col col-3">{field}</div>
                <div className="col col-9">{this.props.row[field]}</div>
              </div>
            )
          }
      </li>
    );
  }
}