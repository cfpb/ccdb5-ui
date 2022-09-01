import './CollapsibleFilter.less';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export default class CollapsibleFilter extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      showChildren: props.showChildren
    };

    /* This binding is necessary to make `this` work in the callback
       https://facebook.github.io/react/docs/handling-events.html */
    this._toggleChildDisplay = this._toggleChildDisplay.bind( this );
  }

  _toggleChildDisplay() {
    this.setState( {
      showChildren: !this.state.showChildren
    } );
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.showChildren !== this.props.showChildren ) {
      // sync local state
      this.setState( {
        showChildren: this.props.showChildren
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
      <button aria-label={ `Hide ${ this.props.title } filter` }
        className={ buttonClasses + 'o-expandable_cue-close' }
        onClick={this._toggleChildDisplay}>
        Hide
        { iconMap.getIcon( 'minus-round' ) }
      </button>;
    const closed =
      <button aria-label={ `Show ${ this.props.title } filter` }
        className={ buttonClasses + 'o-expandable_cue-open' }
        onClick={this._toggleChildDisplay}>
        Show
        { iconMap.getIcon( 'plus-round' ) }
      </button>;

    return (
      <section className={composeClasses}>
        <div className='o-expandable_header o-expandable_target'>
          <h4 className='o-expandable_header-left o-expandable_label'>
            {this.props.title}
          </h4>
          <span className='o-expandable_header-right o-expandable_link'>
            { this.state.showChildren ? opened : closed }
          </span>
        </div>
        { this.state.showChildren ? <>
          <p>{this.props.desc}</p>
          {this.props.children}
        </> : null }
      </section>
    );
  }
}

CollapsibleFilter.propTypes = {
  showChildren: PropTypes.bool
};

CollapsibleFilter.defaultProps = {
  showChildren: true
};
