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
    return (
        <header className="content_hero">
          <h1 className="content-header">Consumer Complaint Database</h1>
          <p>
              Complaints are published after the company responds,
               confirming a commercial relationship with the consumer,
               or after 15 days, whichever comes first.<span> </span>
              <a href="../#about-the-database">
                Learn more
              </a>
            </p>
            <p>
              Complaints are not necessarily representative of all consumers’
               experiences with a financial product or company.<span> </span>
              <a href="../#what-you-should-consider">
              Learn more
              </a>
            </p>
            <p>
              We don’t verify all the allegations in complaint narratives.<span> </span>
              <a href="../#what-you-should-consider">
                Learn more
              </a>
            </p>
            <p></p>
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
