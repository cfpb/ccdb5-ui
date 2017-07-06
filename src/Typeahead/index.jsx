// Adapted from https://github.com/fmoo/react-typeahead

import React from 'react'
import PropTypes from 'prop-types'
import Selector from './Selector'
import './Typeahead.less'

// ----------------------------------------------------------------------------
// State Machine

// const ERROR = 'ERROR'
const EMPTY = 'EMPTY'
const ACCUM = 'ACCUM'
const WAITING = 'WAITING'
const NO_RESULTS = 'NO_RESULTS'
const RESULTS = 'RESULTS'
const TOO_MANY = 'TOO_MANY'
// const CHOSEN = 'CHOSEN'

const nextStateFromValue = (value, props) => {
  let phase = value ? WAITING : EMPTY
  if (value && value.length < props.minLength) {
    phase = ACCUM
  }

  return {
    inputValue: value,
    phase
  }
}

const nextStateFromOptions = (options, props) => {
  let phase = RESULTS
  if (!options || options.length === 0) {
    phase = NO_RESULTS
  }
  else if ( options && options.length > props.maxVisible) {
    phase = TOO_MANY
  }

  return {
    phase,
    searchResults: options
  }
}

// ----------------------------------------------------------------------------
// Class

export default class Typeahead extends React.Component {
  constructor(props) {
    super(props)
    this.state = Object.assign(
      {
        searchResults: []
      },
      nextStateFromValue(props.value, props)
    )

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError.bind(this),
      EMPTY: this._renderEmpty.bind(this),
      ACCUM: this._renderAccum.bind(this),
      WAITING: this._renderWaiting.bind(this),
      NO_RESULTS: this._renderNoResults.bind(this),
      RESULTS: this._renderResults.bind(this),
      TOO_MANY: this._renderTooManyResults.bind(this),
      CHOSEN: this._renderChosen.bind(this)
    }

    // Bindings
    this._valueUpdated = this._valueUpdated.bind(this)
    this._setOptions = this._setOptions.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextStateFromValue(nextProps.value, nextProps))
  }

  render() {
    return (
      <section className="typeahead">
        <input type="text"
               disabled={this.props.disabled}
               onChange={this._valueUpdated}
               placeholder={this.props.placeholder}
               value={this.state.inputValue}
        />
        { this.renderMap[this.state.phase]() }
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Event Methods

  _valueUpdated(evt) {
    this._callForOptions(evt.target.value)
  }  

  // --------------------------------------------------------------------------
  // Search Methods

  _callForOptions(value) {
    const nextState = nextStateFromValue(value, this.props)
    this.setState(nextState)
    if (nextState.phase !== WAITING ) {
      return
    }

    // TODO: If async psuedocode
    // if (this.props.onInputChangeAsynch) {
    //   this.props.onInputChangeAsynch(value).then(
    //     options => _setOptions(options),
    //     error => onError(error)
    //   )
    // }

    this._setOptions(this.props.onInputChange(value))
  }

  _setOptions(options) {
    const nextState = nextStateFromOptions(options, this.props)
    this.setState(nextState)
  }

  // --------------------------------------------------------------------------
  // Render Helpers

  _renderError() {
    return (<span className="error">There was a problem retrieving the options</span>)
  }

  _renderEmpty() {
    return null
  }

  _renderAccum() {
    return (<span className="instructions">Enter more characters to see results</span>)
  }

  _renderWaiting() {
    return (<span className="waiting">waiting...</span>)
  }

  _renderNoResults() {
    return (<span className="no-results">No results found</span>)
  }

  _renderResults() {
    return (
        <Selector options={this.state.searchResults}
                  renderOption={this.props.renderOption} />
    )
  }

  _renderTooManyResults() {
    const subset = this.state.searchResults.slice(0, this.props.maxVisible)
    return (
        <Selector options={subset}
                  renderOption={this.props.renderOption}
                  footer="Continue typing to narrow the set of results" />
    )
  }

  _renderChosen() {
    return null
  }
}

Typeahead.propTypes = {
  disabled: PropTypes.bool,
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  onInputChange: PropTypes.func,
  onOptionSelected: PropTypes.func,
  placeholder: PropTypes.string,
  renderOption: PropTypes.func,
  value: PropTypes.string
}

Typeahead.defaultProps = {
  disabled: false,
  maxVisible: 5,
  minLength: 2,
  onInputChange: () => [],
  placeholder: 'Enter your search text',
  renderOption: (x) => {
    return {
      value: x,
      component: x
    }
  },
  value: ''
}