import './Hero.less';
import { MODAL_SHOWN, MODAL_TYPE_MORE_ABOUT } from '../../constants';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
    modalProps: {},
  };
}

export class Hero extends React.Component {
  render() {
    return (
      <header className="content_hero">
        <h1 className="content-header">Consumer Complaint Database</h1>
        <ul className="m-list m-list__horizontal">
          <li className="m-list_item">
            <button
              className="a-btn a-btn__link"
              onClick={this.props.onMoreAbout}
            >
              Things to know before you use this database
            </button>
          </li>
          <li className="m-list_item">
            <a
              href="https://www.consumerfinance.gov/complaint/data-use/"
              target="_blank"
              rel="noopener noreferrer"
            >
              How we use complaint data
            </a>
          </li>
          <li className="m-list_item">
            <a
              href="https://cfpb.github.io/api/ccdb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Technical documentation
            </a>
          </li>
        </ul>
      </header>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  onMoreAbout: () => {
    dispatch(showMoreAboutDialog());
  },
});

export default connect(null, mapDispatchToProps)(Hero);

Hero.propTypes = {
  onMoreAbout: PropTypes.func.isRequired,
};
