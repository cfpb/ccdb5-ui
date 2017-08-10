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
    let composeClasses = 'collapsible-filter';
    if ( this.props.className ) {
      composeClasses += ' ' + this.props.className;
    }

    const opened =
      <button className="a-btn a-btn__link hover"
              onClick={this._toggleChildDisplay}>
        Hide
        <span className="cf-icon cf-icon-minus-round"></span>
      </button>

    const closed =
      <button className="a-btn a-btn__link hover"
              onClick={this._toggleChildDisplay}>
        Show
        <span className="cf-icon cf-icon-plus-round"></span>
      </button>

    return (
      <section className={composeClasses}>
          <div className="layout-row">
            <h5 className="flex-all">{this.props.title}</h5>
            <div className="flex-fixed toggle">
              { this.state.showChildren ? opened : closed }
            </div>
          </div>
          <p>{this.props.desc}</p>
          { this.state.showChildren ? this.props.children : null }
      </section>
    );
  }
}

CollapsibleFilter.PropTypes = {
  showChildren: PropTypes.bool
}

CollapsibleFilter.defaultProps = {
  showChildren: true
}
