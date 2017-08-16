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
        <span className="cf-icon cf-icon-minus-round"></span>
      </button>

    const closed =
      <button className={ buttonClasses + 'o-expandable_cue-open' }
              onClick={this._toggleChildDisplay}>
        Show
        <span className="cf-icon cf-icon-plus-round"></span>
      </button>

    return (
      <section className={composeClasses}>
        <div className="o-expandable_header o-expandable_target">
          <h5 className="o-expandable_header-left o-expandable_label">
              {this.props.title}
          </h5>
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

CollapsibleFilter.PropTypes = {
  showChildren: PropTypes.bool
}

CollapsibleFilter.defaultProps = {
  showChildren: true
}
