import './ComplaintCard.less'
import { FormattedDate } from 'react-intl'
import React from 'react'

const MAX_NARRATIVE = 300

export default class ComplaintCard extends React.Component {
  render() {
    const row = this.props.row;

    // Process the narrative
    let narrative = row.complaint_what_happened || ''
    const hasOverflow = narrative.length > MAX_NARRATIVE
    narrative = narrative.substring( 0, MAX_NARRATIVE )
    const complaintIdPath = '/detail/' + row.complaint_id;

    return (
      <li className="card-container">
        <div className="card">
          <div className="card-left layout-column">
            <h3 className="to-detail">
              <a href={ complaintIdPath }>{ row.complaint_id }</a>
            </h3>
            <h5>Matched company name</h5>
            <span className="body-copy">{ row.company }</span>
            <br />
            <h5>Company response to consumer</h5>
            <span className="body-copy">{ row.company_response }</span>
            <br />
            <h5>Timely response?</h5>
            <span className="body-copy">{ row.timely }</span>
          </div>
          <div className="card-right layout-column">
            <div className="layout-row">
              <div className="layout-row">
                <h5>Date received:</h5>
                <span className="body-copy">
                  <FormattedDate value={ row.date_received } />
                </span>
              </div>
              <div className="spacer" />
              <div className="layout-row">
                <h5>Consumer's state:</h5>
                <span className="body-copy">{ row.state }</span>
              </div>
            </div>
            <br />
            <h5>Product</h5>
            <h3>{ row.product }</h3>
            { row.sub_product ?
              <div className="layout-row">
                <span className="body-copy subitem">Sub-product:</span>
                <span className="body-copy">{ row.sub_product }</span>
              </div> :
               null
            }
            <br />
            <h5>Issue</h5>
            <h3>{ row.issue }</h3>
            { row.sub_issue ?
              <div className="layout-row">
                <span className="body-copy subitem">Sub-issue:</span>
                <span className="body-copy">{ row.sub_issue }</span>
              </div> :
               null
            }
            <br />
            { narrative ?
              <div>
                <h5>Consumer Complaint Narrative</h5>
                <span className="body-copy">
                  { narrative }
                  { hasOverflow ? <span> <a>[...]</a></span> : null }
                </span>
              </div> :
               null
            }
          </div>
        </div>
      </li>
    );
  }
}
