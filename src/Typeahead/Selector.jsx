// Adapted from https://github.com/fmoo/react-typeahead

import React from 'react'
import PropTypes from 'prop-types'
import Option from './Option'

export default class Selector extends React.Component {
  _onClick(result, event) {
    console.log(result)
  }

  render() {
    const results = this.props.options.map((x, i) => {
      const { component, value } = this.props.renderOption(x)
      return (
        <Option key={value + i}
                onClick={this._onClick.bind(this, value)}
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
  options: PropTypes.array,
  renderOption: PropTypes.func,
  selectedIndex: PropTypes.number  
}

Selector.defaultProps = {
  selectedIndex: -1
}