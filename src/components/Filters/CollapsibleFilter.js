import './CollapsibleFilter.less';
import getIcon from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export default class CollapsibleFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasChildren: props.hasChildren,
    };

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._toggleChildDisplay = this._toggleChildDisplay.bind(this);
  }

  _toggleChildDisplay() {
    this.setState({
      hasChildren: !this.state.hasChildren,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hasChildren !== this.props.hasChildren) {
      // sync local state
      this.setState({
        hasChildren: this.props.hasChildren,
      });
    }
  }

  render() {
    let composeClasses = 'o-expandable';
    if (this.props.className) {
      composeClasses += ' ' + this.props.className;
    }

    const buttonAttr = this.state.hasChildren ? 'true' : 'false';

    const opened = (
      <>
        <span className="o-expandable__cue-close" role="img" aria-label="Hide">
          {getIcon('minus-round')}
        </span>
      </>
    );
    const closed = (
      <>
        <span className="o-expandable__cue-open" role="img" aria-label="Show">
          {getIcon('plus-round')}
        </span>
      </>
    );
    return (
      <section className={composeClasses}>
        <button
          className="o-expandable__header"
          aria-expanded={buttonAttr}
          aria-label={`Hide ${this.props.title} filter`}
          onClick={this._toggleChildDisplay}
        >
          <h3 className="o-expandable__label">{this.props.title}</h3>
          <span className="o-expandable__cues">
            {this.state.hasChildren ? opened : closed}
          </span>
        </button>
        {this.state.hasChildren ? (
          <div className="o-expandable__content">
            <p>{this.props.desc}</p>
            {this.props.children}
          </div>
        ) : null}
      </section>
    );
  }
}

CollapsibleFilter.propTypes = {
  hasChildren: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  children: PropTypes.node,
};

CollapsibleFilter.defaultProps = {
  hasChildren: true,
};
