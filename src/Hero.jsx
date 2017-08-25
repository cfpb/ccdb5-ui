import './Hero.less';
import { MODAL_SHOWN, MODAL_TYPE_MORE_ABOUT } from './constants'
import { connect } from 'react-redux'
import React from 'react';

/**
* Notifies the application that the "More About..." dialog box should appear
*
* @returns {string} a packaged payload to be used by Redux reducers
*/
export function showMoreAboutDialog() {
  return {
    type: MODAL_SHOWN,
    modalType: MODAL_TYPE_MORE_ABOUT,
    modalProps: {}
  }
}

export class Hero extends React.Component {
  render() {
    const socrataUrl = 'https://data.consumerfinance.gov/dataset/' +
      'Consumer-Complaints/s6ew-h6mp'

    return (
        <header className="content_hero">
          <h1 className="content-header">Consumer Complaint Database</h1>
          <h4 className="content-header">Beta</h4>
          <p>
          Consumer complaints are added to this public database after the
          company has responded to the complaint, confirming a commercial
          relationship with the consumer, or after they've had the complaint
          for 15 calendar days, whichever comes first. We don’t verify all the
          facts alleged in complaints, but we do give companies the opportunity
          to publicly respond to complaints by selecting responses from a
          pre-populated list. Company-level information should be considered in
          the context of company size and/or market share.
          </p>
          <ul className="m-list m-list__horizontal">
            <li className="m-list_item">
              <button className="a-btn a-btn__link"
                      onClick={this.props.onMoreAbout}>
                More about the complaint database
              </button>
            </li>
            <li className="m-list_item">
              <a href="https://www.consumerfinance.gov/complaint/data-use/"
                 target="_blank">
                How we use complaint data
              </a>
            </li>
            <li className="m-list_item">
              <a href="https://cfpb.github.io/api/ccdb/" target="_blank">
                Technical documentation
              </a>
            </li>
            <li className="m-list_item">
              <a href={socrataUrl} target="_blank">
                View complaint data in Socrata
              </a>
            </li>
          </ul>
        </header>
    );
  }
}

export const mapStateToProps = () => ( {
} )

export const mapDispatchToProps = dispatch => ( {
  onMoreAbout: () => {
    dispatch( showMoreAboutDialog() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( Hero )
