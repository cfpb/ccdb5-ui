import './CollapsibleFilter.less';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export default class CollapsibleFilter extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      hasChildren: props.hasChildren
    };

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._toggleChildDisplay = this._toggleChildDisplay.bind( this );
  }

  _toggleChildDisplay() {
    this.setState( {
      hasChildren: !this.state.hasChildren
    } );
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.hasChildren !== this.props.hasChildren ) {
      // sync local state
      this.setState( {
        hasChildren: this.props.hasChildren
      } );
    }
  }

  render() {
    let composeClasses = 'o-expandable';
    if ( this.props.className ) {
      composeClasses += ' ' + this.props.className;
    }

    const buttonClasses = 'a-btn a-btn__link o-expandable_cue ';

    const opened =
      <button
        aria-label={`Hide ${ this.props.title } filter`}
        className={buttonClasses + 'o-expandable_cue-close'}
        onClick={this._toggleChildDisplay}
      >
        Hide
        {iconMap.getIcon( 'minus-round' )}
      </button>
    ;
    const closed =
      <button
        aria-label={`Show ${ this.props.title } filter`}
        className={buttonClasses + 'o-expandable_cue-open'}
        onClick={this._toggleChildDisplay}
      >
        Show
        {iconMap.getIcon( 'plus-round' )}
      </button>
    ;
    return (
      <section className={composeClasses}>
        <div className="o-expandable_header o-expandable_target">
          <h4 className="o-expandable_header-left o-expandable_label">
            {this.props.title}
          </h4>
          <span className="o-expandable_header-right o-expandable_link">
            {this.state.hasChildren ? opened : closed}
          </span>
        </div>
        {this.state.hasChildren ?
          <>
            <p>{this.props.desc}</p>
            {this.props.children}
          </> :
         null}
      </section>
    );
  }
}

CollapsibleFilter.propTypes = {
  hasChildren: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  children: PropTypes.node
};

CollapsibleFilter.defaultProps = {
  hasChildren: true
};
