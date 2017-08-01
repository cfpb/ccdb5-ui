import PropTypes from 'prop-types'
import React from 'react';
import { FormattedDate } from 'react-intl';
import './ComplaintDetail.less';

export default class ComplaintDetail extends React.Component {
  render() {
    const row = this.props.row;

    // Process the narrative
    let narrative = row.complaint_what_happened || ""

    return (
      <section className="card-container">
        <nav className="layout-row">
          <div className="back-to-search">
            <button className="a-btn a-btn__link">
                <span className="a-btn_icon
                             a-btn_icon__on-left
                             cf-icon
                             cf-icon__before
                             cf-icon-left"></span>
                Back to search results
            </button>          
          </div>
          <div className="meaning">
            <a href="https://www.consumerfinance.gov/complaint/data-use/"
               target="_blank">
              What do all these data points mean?
            </a>
          </div>
        </nav>
        <h1>{ row.complaint_id }</h1>
        <div className="card">
          <div className="card-left layout-column">
            <h5>Date CFPB received the complaint</h5>
            <span className="body-copy">
              <FormattedDate value={ row.date_received } />
            </span>
            <br />
            <h5>Consumer's state</h5>
            <span className="body-copy">{ row.state }</span>
            <br />
            <h5>Consumer's zip</h5>
            <span className="body-copy">{ row.zip_code }</span>
            <br />
            <h5>Complaint submitted via</h5>
            <span className="body-copy">{ row.submitted_via }</span>
            <br />
            <h5>Tags</h5>
            <span className="body-copy">{ row.tags }</span>
            <br />
            <h5>Did consumer dispute the response?</h5>
            <span className="body-copy">{ row.consumer_disputed }</span>
          </div>
          <div className="card-right layout-column">
            <h5>Product</h5> 
            <h3>{ row.product }</h3>
            { row.sub_product ? (
              <div className="layout-row">
                <span className="body-copy subitem">Sub-product:</span>
                <span className="body-copy">{ row.sub_product }</span>
              </div>
              ) : null
            }
            <br />
            <h5>Issue</h5>
            <h3>{ row.issue }</h3>
            { row.sub_issue ? (
              <div className="layout-row">
                <span className="body-copy subitem">Sub-issue:</span>
                <span className="body-copy">{ row.sub_issue }</span>
              </div>
              ) : null
            }
            <br />
            <h5>Consumer consent to publish narrative</h5>
            <span className="body-copy">{ row.consumer_consent_provided }</span>
            <br />            
            { narrative ? (
              <div>
                <h5>Consumer Complaint Narrative</h5>
                <span className="body-copy">
                  { narrative }
                </span>
              </div>
              ) : null
            }
          </div>
        </div>

        <h3 className="company-information">Company Information</h3>
        <div className="card">
          <div className="card-left layout-column">
            <h5>Date complaint sent to company</h5>
            <span className="body-copy">
              <FormattedDate value={ row.date_sent_to_company } />
            </span>
            <br />
            <h5>Matched company name</h5>
            <span className="body-copy">{ row.company }</span>
            <br />
          </div>
          <div className="card-right layout-column">
            <h5>Timely response?</h5>
            <span className="body-copy">{ row.timely }</span>
            <br />
            <h5>Company response to consumer</h5>
            <span className="body-copy">{ row.company_response }</span>
            <br />
            <h5>Company public response</h5>
            <span className="body-copy">{ row.company_public_response }</span>
          </div>
        </div>
      </section>
    );
  }
}

ComplaintDetail.propTypes = {
  complaint_id: PropTypes.string.isRequired,
  row: PropTypes.object
}

ComplaintDetail.defaultProps = {
  row: {
    company: "JPMORGAN CHASE & CO.",
    company_public_response: "Company believes the complaint is the result of a misunderstanding",
    company_response: "Closed with explanation",
    complaint_id: "2371744",
    complaint_what_happened: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ante magna, posuere ut nibh dictum, maximus pretium lorem. Fusce ut aliquam neque. Curabitur in massa pulvinar, mollis felis non, cursus est. Suspendisse euismod, enim eu luctus congue, neque ligula hendrerit ante, non congue ex elit mattis sem. Maecenas in tincidunt libero, eget pretium ante. Mauris ut pulvinar tellus. In euismod tellus ultricies porttitor posuere.\n\nMaecenas iaculis ex pretium vehicula condimentum. Aenean nulla nisi, consectetur nec finibus nec, euismod sed ligula. Sed fermentum ligula id lacinia luctus. Morbi sodales sed risus ut eleifend. Vivamus ligula nulla, maximus vitae libero eget, consectetur dapibus ipsum. Curabitur porta erat lacus, et fringilla ligula placerat scelerisque. Cras interdum, magna eget varius posuere, velit nisi placerat nunc, sit amet dictum arcu eros ut erat. Duis dignissim interdum felis sed consectetur. Praesent nulla nisi, ornare a fermentum in, lobortis vehicula magna. Vivamus venenatis lorem in nisl vulputate, ut consectetur tortor ornare. Nullam nibh nulla, venenatis sit amet nibh consequat, tristique porttitor nibh. Nulla hendrerit justo non ultricies scelerisque. Proin dictum, elit vel fringilla maximus, lacus ante volutpat nibh, eu auctor purus justo ut metus.",
    consumer_consent_provided: "Consent provided",
    consumer_disputed: "Yes",
    date_received: "2017-03-04T00:00:00",
    date_sent_to_company: "2017-03-04T00:00:00",
    has_narrative: true,
    issue: "Account opening, closing, or management",
    product: "Bank account or service",
    state: "KY",
    sub_issue: null,
    sub_product: "Checking account",
    submitted_via: "Web",
    tags: "Older American",
    timely: "Yes",
    zip_code: "423XX"
  }
}
