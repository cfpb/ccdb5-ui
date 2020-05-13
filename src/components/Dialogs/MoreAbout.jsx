import React from 'react'

export default class MoreAbout extends React.Component {
  render() {
    const urlScrubbing = 'http://files.consumerfinance.gov/a/assets/' +
      '201503_cfpb_Narrative-Scrubbing-Standard.pdf'

    const urlCriteria = 'http://files.consumerfinance.gov/f/' +
      '201303_cfpb_Final-Policy-Statement-Disclosure-of-Consumer-Complaint-' +
      'Data.pdf'

    return (
      <section className="more-about-modal">
        <div className="header layout-row">
          <h3 className="flex-all">More about the complaint database</h3>
        </div>
        <div className="body">
          <p className="body-copy">
            We don’t verify all the facts alleged in these complaints, but we
            do give companies the opportunity to confirm they have a commercial
            relationship with the consumer before we publish the complaint in
            this database.
          </p>
          <p className="body-copy">
            We only publish the description of what happened if the consumer
            agrees to share it and after we take steps to&nbsp;
            <a href={urlScrubbing} target="_blank">
              remove personal information.
            </a>
          </p>
          <p className="body-copy">
            We don’t publish complaints if they don't meet our&nbsp;
            <a href={urlCriteria} target="_blank">
              publication criteria.
            </a>
            &nbsp;Data is generally updated daily.
          </p>
          <p className="body-copy">
            Company specific information should be considered in the context of
            that company's size and/or market share.
          </p>
        </div>
        <div className="footer layout-row">
          <button className="a-btn"
                  onClick={this.props.onClose}>
            Close
          </button>
        </div>
      </section>
    )
  }
}
