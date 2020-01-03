import { changePage, nextPageShown, prevPageShown } from './actions/paging'
import { FormattedNumber, IntlProvider } from 'react-intl'
import { connect } from 'react-redux'
import iconMap from './iconMap'
import PropTypes from 'prop-types'
import React from 'react'

export class Pagination extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      page: props.page
    }
    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._handleSubmit = this._handleSubmit.bind( this );
    this._updateInputValue = this._updateInputValue.bind( this );
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.page !== this.props.page ) {
      // sync local state from redux
      this.setState( {
        page: this.props.page
      } )
    }
  }

  _handleSubmit( event ) {
    event.preventDefault();
    this._setPage( this.state.page );
  }

  _setPage( page ) {
    window.scrollTo( 0, 0 )
    this.props.onPage( page );
  }

  _updateInputValue( evt ) {
    const page = parseInt( evt.target.value, 10 ) || ''
    this.setState( {
      page: page
    } )
  }

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
          <form className="m-pagination_form"
                action="" onSubmit={this._handleSubmit}>
              <label className="m-pagination_label"
                     htmlFor="m-pagination_current-page">
                  Page
                  <span className="u-visually-hidden">
                      number {this.props.page} out
                  </span>
                  <input className="m-pagination_current-page"
                         id="m-pagination_current-page"
                         name="page"
                         type="number"
                         min="1"
                         max={this.props.total}
                         pattern="[0-9]*"
                         inputMode="numeric"
                         value={this.state.page}
                         onChange={this._updateInputValue}
                         />
                  of&nbsp;
                  <FormattedNumber value={this.props.total} />
              </label>
              <button className="a-btn
                             a-btn__link
                             m-pagination_btn-submit"
                      id="m-pagination_btn-submit"
                      type="submit">Go</button>
          </form>
      </nav>
      </IntlProvider>
    );
  }
}

Pagination.defaultProps = {
  total: 1,
  value: 1
}

Pagination.propTypes = {
  // eslint-disable-next-line camelcase
  total: PropTypes.number,
  value: PropTypes.number
}


export const mapStateToProps = state => ( {
  page: state.query.page,
  size: state.query.size,
  total: state.query.totalPages
} )

export const mapDispatchToProps = dispatch => ( {
  nextPage: () => {
    dispatch( nextPageShown() )
  },
  onPage: page => {
    dispatch( changePage( page ) )
  },
  prevPage: () => {
    dispatch( prevPageShown() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( Pagination )
