// Adapted from https://github.com/fmoo/react-typeahead

import React from 'react'
import PropTypes from 'prop-types'

export default class Option extends React.Component {
  render() {
    const classes = ['typeahead-option', 'body-copy']
    if (this.props.selected) {
      classes.push('selected')
    }

    return (
     <li className={classes.join(' ')}
         onMouseDown={this.props.onClick}>
       { this.props.children }
     </li>
    )
  }
}

Option.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func
}

Option.defaultProps = {
  selected: false,
  onClick: function(event) {
    event.preventDefault();
  }
}