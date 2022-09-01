import { nextPageShown, prevPageShown } from '../../actions/paging';
import { connect } from 'react-redux';
import iconMap from '../iconMap';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

export class Pagination extends React.Component {
  render() {
    return (
      <IntlProvider locale="en">
        <nav className="m-pagination"
          role="navigation"
          aria-label="Pagination">
          <button className="a-btn m-pagination_btn-prev"
            onClick={() => this.props.prevPage()}
            disabled={this.props.page <= 1}>
            <span className="a-btn_icon a-btn_icon__on-left">
              { iconMap.getIcon( 'left' ) }
            </span>
              Previous
          </button>
          <button className="a-btn m-pagination_btn-next"
            onClick={() => this.props.nextPage()}
            disabled={this.props.page >= this.props.total}>
              Next
            <span className="a-btn_icon
                               a-btn_icon__on-right">
              { iconMap.getIcon( 'right' ) }
            </span>
          </button>
          <div className="m-pagination_form">
            <label className="m-pagination_label">
                  Page {this.props.page}
            </label>
          </div>
        </nav>
      </IntlProvider>
    );
  }
}

Pagination.defaultProps = {
  total: 1,
  value: 1
};

Pagination.propTypes = {
  // eslint-disable-next-line camelcase
  total: PropTypes.number,
  value: PropTypes.number
};


export const mapStateToProps = state => ( {
  page: state.query.page,
  size: state.query.size,
  total: state.query.totalPages
} );

export const mapDispatchToProps = dispatch => ( {
  nextPage: () => {
    dispatch( nextPageShown() );
  },
  prevPage: () => {
    dispatch( prevPageShown() );
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( Pagination );
