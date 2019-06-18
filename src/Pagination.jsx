import { changePage } from './actions/paging'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import React from 'react'

export class Pagination extends React.Component {
  constructor( props ) {
    super( props );
    this.state = this._calculatePages( props );

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._handleSubmit = this._handleSubmit.bind( this );
    this._updateInputValue = this._updateInputValue.bind( this );
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( this._calculatePages( nextProps ) );
  }

  _calculatePages( props ) {
    const from = props.from || 0;
    var size = props.size || 1;
    if ( size > 100 ) {
      size = 100;
    }
    const total = props.total || 0;
    const c = Math.ceil( from / size ) + 1;

    return {
      current: c,
      total: Math.ceil( total / size ),
      inputValue: c
    }
  }

  _handleSubmit( event ) {
    event.preventDefault();
    this._setPage( this.state.inputValue );
  }

  _setPage( page ) {
    window.scrollTo( 0, 0 )
    this.props.onPage( page );
  }

  _updateInputValue( evt ) {
    this.setState( {
      inputValue: evt.target.value
    } );
  }

  render() {
    if ( this.props.total === 0 ) {
      return null;
    }

    return (
      <nav className="m-pagination"
           role="navigation"
           aria-label="Pagination">
          <button className="a-btn m-pagination_btn-prev"
                  onClick={() => this._setPage( this.state.current - 1 )}
                  disabled={this.state.current <= 1}>
              <span class="a-btn_icon a-btn_icon__on-left">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559.6 1200" class="cf-icon-svg"><path d="M494.5 1090.7c-17.3 0-33.8-6.8-46-19L19 642.1c-25.4-25.4-25.4-66.5 0-91.9l429.5-429.5c25.6-25.1 66.8-24.8 91.9.8 24.8 25.3 24.8 65.8 0 91.1L156.9 596.2l383.6 383.6c25.4 25.4 25.4 66.5.1 91.9-12.3 12.2-28.8 19-46.1 19z"></path></svg>
              </span>
              Previous
          </button>
          <button className="a-btn m-pagination_btn-next"
                    onClick={() => this._setPage( this.state.current + 1 )}
                    disabled={this.state.current >= this.state.total}>
              Next
              <span className="a-btn_icon
                               a-btn_icon__on-right">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559.6 1200" class="cf-icon-svg"><path d="M65.1 1090.2c-35.9 0-65-29-65.1-64.9 0-17.3 6.8-33.9 19.1-46.1l383.6-383.5L19.1 212.2c-25.1-25.6-24.8-66.8.9-92 25.3-24.8 65.8-24.8 91.1 0l429.5 429.5c25.4 25.4 25.4 66.5 0 91.9L111 1071.2c-12.1 12.2-28.7 19.1-45.9 19z"></path></svg>
              </span>
          </button>
          <form className="m-pagination_form"
                action="" onSubmit={this._handleSubmit}>
              <label className="m-pagination_label"
                     htmlFor="m-pagination_current-page">
                  Page
                  <span className="u-visually-hidden">
                      number {this.state.current} out
                  </span>
                  <input className="m-pagination_current-page"
                         id="m-pagination_current-page"
                         name="page"
                         type="number"
                         min="1"
                         max={this.state.total}
                         pattern="[0-9]*"
                         inputMode="numeric"
                         value={this.state.inputValue}
                         onChange={this._updateInputValue} />
                  of&nbsp;
                  <FormattedNumber value={this.state.total} />
              </label>
              <button className="a-btn
                             a-btn__link
                             m-pagination_btn-submit"
                      id="m-pagination_btn-submit"
                      type="submit">Go</button>
          </form>
      </nav>
    );
  }
}

export const mapStateToProps = state => ( {
  from: state.query.from,
  size: state.query.size,
  total: state.results.total
} )

export const mapDispatchToProps = dispatch => ( {
  onPage: page => {
    dispatch( changePage( page ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( Pagination )
