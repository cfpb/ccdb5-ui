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

    return (
      <section className={composeClasses}>
          <div className="layout-row">
            <h5 className="flex-all">{this.props.title}</h5>
            <div className="flex-fixed toggle">
                <button className="a-btn a-btn__link hover"
                        onClick={this._toggleChildDisplay}>
                { this.state.showChildren ? 'Hide' : 'Show' }
                  <span className={
                    'cf-icon ' + ( this.state.showChildren ? 'cf-icon-minus-round' : 'cf-icon-plus-round' )
                  }></span>
                </button>
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
