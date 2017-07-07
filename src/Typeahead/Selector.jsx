// Adapted from https://github.com/fmoo/react-typeahead

import React from 'react'
import PropTypes from 'prop-types'
import Option from './Option'

export default class Selector extends React.Component {
  _onClick(index, event) {
    this.props.onOptionSelected(index)
    event.preventDefault()
  }

  render() {
    const results = this.props.options.map((x, i) => {
      const { component, value } = this.props.renderOption(x)
      return (
        <Option key={value + i}
                onClick={this._onClick.bind(this, i)}
                selected={this.props.selectedIndex === i}>
          {component}
        </Option>
      )
    })

    return (
      <div className="typeahead-selector">
        <ul>
          {results}
          { this.props.footer ? (<li className="footer">{this.props.footer}</li>) : null }
        </ul>
      </div>
    )
  }
}

Selector.propTypes = {
  footer: PropTypes.string,
  onOptionSelected: PropTypes.func,
  options: PropTypes.array,
  renderOption: PropTypes.func,
  selectedIndex: PropTypes.number  
}

Selector.defaultProps = {
  onOptionSelected: (obj) => {console.warn('onOptionSelected', obj)},
  selectedIndex: -1
}