import React from 'react';

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._calculatePages(props);

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._handleSubmit = this._handleSubmit.bind(this);
    this._updateInputValue = this._updateInputValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._calculatePages(nextProps));
  }

  _calculatePages(props) {
    const from = props.from || 0;
    const size = props.size || 1;
    const total = props.total || 0;
    const c = Math.ceil(from / size) + 1;

    return {
      current: c,
      total: Math.ceil(total / size),
      inputValue: c
    }
  }

  _handleSubmit(event) {
    event.preventDefault();
    this._setPage(this.state.inputValue);
  }

  _setPage(page) {
    this.props.onPage(page);
  }

  _updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }

  render() {
    if( this.props.total === 0) {
      return null;
    }

    return (
      <nav className="m-pagination"
           role="navigation"
           aria-label="Pagination">
          <button className="a-btn
                    a-btn__icon-on-left
                    cf-icon
                    cf-icon-left
                    cf-icon__before
                    m-pagination_btn-prev"
                    onClick={() => this._setPage(this.state.current - 1)}
                    disabled={this.state.current <= 1}>
              Previous
          </button>
          <button className="a-btn
                    a-btn__icon-on-right
                    cf-icon
                    cf-icon-right
                    cf-icon__after
                    m-pagination_btn-next"
                    onClick={() => this._setPage(this.state.current + 1)}
                    disabled={this.state.current >= this.state.total}>
              Next
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
                  of {this.state.total}
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