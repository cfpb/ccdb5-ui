import './ComplaintCard.less'
import { FormattedDate } from 'react-intl'
import React from 'react'

const MAX_NARRATIVE = 300

export default class ComplaintCard extends React.Component {
  render() {
    const row = this.props.row;
    const complaintIdPath = 'detail/' + row.complaint_id

    return (
      <li className="card-container">
        <div className="card">
          <div className="card-left layout-column">
            <h3 className="to-detail">
              <a href={ complaintIdPath }>{ row.complaint_id }</a>
            </h3>
            <h5>Matched company name</h5>
            { this._renderPossibleHighlight( row.company ) }
            <br />
            <h5>Company response to consumer</h5>
            { this._renderPossibleHighlight( row.company_response ) }
            <br />
            <h5>Timely response?</h5>
            { this._renderPossibleHighlight( row.timely ) }
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
                { this._renderPossibleHighlight( row.state ) }
              </div>
            </div>
            <br />
            <h5>Product</h5>
            <h3 dangerouslySetInnerHTML={ { __html: row.product } }></h3>
            { row.sub_product ?
              <div className="layout-row">
                <span className="body-copy subitem">Sub-product:</span>
                { this._renderPossibleHighlight( row.sub_product ) }
              </div> :
               null
            }
            <br />
            <h5>Issue</h5>
            <h3 dangerouslySetInnerHTML={ { __html: row.issue } }></h3>
            { row.sub_issue ?
              <div className="layout-row">
                <span className="body-copy subitem">Sub-issue:</span>
                { this._renderPossibleHighlight( row.sub_issue ) }
              </div> :
               null
            }
            <br />
            { this._renderNarrative(
                row.complaint_what_happened || '', complaintIdPath
              ) }
          </div>
        </div>
      </li>
    )
  }

  // --------------------------------------------------------------------------
  // Subrender methods

  _renderPossibleHighlight( s ) {
    return <span className="body-copy"
                 dangerouslySetInnerHTML={ { __html: s } }>
           </span>
  }

  _renderNarrative( narrative, url ) {
    const hasOverflow = narrative.length > MAX_NARRATIVE
    narrative = narrative.substring( 0, MAX_NARRATIVE )

    return narrative ?
        <div>
          <h5>Consumer Complaint Narrative</h5>
            { this._renderPossibleHighlight( narrative ) }
            { hasOverflow ? <span> <a href={ url }>[...]</a></span> : null }
        </div> :
       null
  }

}
