import './CollapsibleFilter.less';
import PropTypes from 'prop-types'
import React from 'react';

export default class CollapsibleFilter extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      showChildren: props.showChildren
    };

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._toggleChildDisplay = this._toggleChildDisplay.bind( this );
  }

  _toggleChildDisplay() {
    this.setState( {
      showChildren: !this.state.showChildren
    } );
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( {
      showChildren: nextProps.showChildren
    } );
  }

  render() {
    let composeClasses = 'o-expandable'
    if ( this.props.className ) {
      composeClasses += ' ' + this.props.className;
    }

    const buttonClasses = 'a-btn a-btn__link o-expandable_cue '

    const opened =
      <button className={ buttonClasses + 'o-expandable_cue-close' }
              onClick={this._toggleChildDisplay}>
        Hide
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm263.1 550.7H236c-27.6 0-50-22.4-50-50s22.4-50 50-50h527.1c27.6 0 50 22.4 50 50s-22.4 50-50 50z"></path></svg>
      </button>
    const closed =
      <button className={ buttonClasses + 'o-expandable_cue-open' }
              onClick={this._toggleChildDisplay}>
        Show
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm263.1 550.7H549.6v213.6c0 27.6-22.4 50-50 50s-50-22.4-50-50V655.9H236c-27.6 0-50-22.4-50-50s22.4-50 50-50h213.6V342.3c0-27.6 22.4-50 50-50s50 22.4 50 50v213.6h213.6c27.6 0 50 22.4 50 50s-22.5 50-50.1 50z"></path></svg>
      </button>

    return (
      <section className={composeClasses}>
        <div className="o-expandable_header o-expandable_target">
          <h4 className="o-expandable_header-left o-expandable_label">
              {this.props.title}
          </h4>
          <span className="o-expandable_header-right o-expandable_link">
            { this.state.showChildren ? opened : closed }
          </span>
        </div>
        <p>{this.props.desc}</p>
        { this.state.showChildren ? this.props.children : null }
      </section>
    );
  }
}

CollapsibleFilter.propTypes = {
  showChildren: PropTypes.bool
}

CollapsibleFilter.defaultProps = {
  showChildren: true
}
