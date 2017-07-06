// Adapted from https://github.com/fmoo/react-typeahead

import React from 'react'
import PropTypes from 'prop-types'

export default class Option extends React.Component {
  render() {
    return (
     <li className="typeahead-option body-copy"
         onClick={this.props.onClick}>
       { this.props.children }
     </li>
    )
  }
}

Option.propTypes = {
  onClick: PropTypes.func
}

Option.defaultProps = {
  onClick: function(event) {
    event.preventDefault();
  }
}