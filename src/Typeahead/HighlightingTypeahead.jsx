import React from 'react'
import PropTypes from 'prop-types'
import Typeahead from '.'

export const normalize = s => {
  return s.toLowerCase()
}

export const compileOptions = options => {
  return options.map(x => {
    return {
      key: x,
      normalized: normalize(x)
    }
  })
}

export default class HighlightingTypeahead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      compiled: compileOptions(props.options)
    }
    this._onInputChange = this._onInputChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      compiled: compileOptions(nextProps.options)
    })
  }

  render() {
    return (
      <Typeahead {...this.props}
                 onInputChange={this._onInputChange}
                 renderOption={this._renderOption}
      />
    )
  }

  _onInputChange(value) {
    // Normalize the input value 
    const normalized = normalize(value)

    // Find the matches
    const filtered = this.state.compiled
      .filter(x => x.normalized.indexOf(normalized) !== -1)
      .map(x => {
        return {
          key: x.key,
          position: x.normalized.indexOf(normalized),
          value
        }
      })

    // Sort the matches so that matches at the beginning of the string
    // appear first
    filtered.sort((a,b) => {
      return a.position - b.position
    })

    return filtered
  }

  _renderOption(obj) {
    const start = obj.key.substring(0, obj.position)
    const match = obj.key.substr(obj.position, obj.value.length)
    const end = obj.key.substring(obj.position + obj.value.length)

    return {
      value: obj.key,
      component: (
        <span>{start}<b>{match}</b>{end}</span>
      )
    }
  }
}

HighlightingTypeahead.propTypes = {
  disabled: PropTypes.bool,
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  onOptionSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string
}

HighlightingTypeahead.defaultProps = {
  disabled: false,
  maxVisible: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
  value: ''
}
