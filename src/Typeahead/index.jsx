// Adapted from https://github.com/fmoo/react-typeahead

import React from 'react'
import PropTypes from 'prop-types'
import Selector from './Selector'
import * as keys from '../constants'
import './Typeahead.less'

// ----------------------------------------------------------------------------
// State Machine

const ERROR = 'ERROR'
const EMPTY = 'EMPTY'
const ACCUM = 'ACCUM'
const WAITING = 'WAITING'
const NO_RESULTS = 'NO_RESULTS'
const RESULTS = 'RESULTS'
const TOO_MANY = 'TOO_MANY'
const CHOSEN = 'CHOSEN'

export const nextStateFromValue = (value, props) => {
  let phase = value ? WAITING : EMPTY
  if (value && value.length < props.minLength) {
    phase = ACCUM
  }

  return {
    inputValue: value,
    phase,
    searchResults: [],
    selectedIndex: -1
  }
}

export const nextStateFromOptions = (options, props) => {
  let phase = RESULTS
  if (!options || options.length === 0) {
    phase = NO_RESULTS
  }
  else if ( options && options.length > props.maxVisible) {
    phase = TOO_MANY
  }

  return {
    phase,
    searchResults: options,
    selectedIndex: -1
  }
}

// ----------------------------------------------------------------------------
// Class

export default class Typeahead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...nextStateFromValue(props.value, props),
      focused: false
    }

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError.bind(this),
      EMPTY: this._renderEmpty.bind(this),
      ACCUM: this._renderEmpty.bind(this),
      WAITING: this._renderWaiting.bind(this),
      NO_RESULTS: this._renderNoResults.bind(this),
      RESULTS: this._renderResults.bind(this),
      TOO_MANY: this._renderTooManyResults.bind(this),
      CHOSEN: this._renderEmpty.bind(this)
    }

    // Key/function map
    this.keyMap = {}
    this.keyMap[keys.VK_ESCAPE] = this._keyCancel.bind(this)
    this.keyMap[keys.VK_UP] = this._nav.bind(this, -1)
    this.keyMap[keys.VK_DOWN] = this._nav.bind(this, 1)

    // TODO: If allowAnyValue psuedocode
    // if (this.props.allowAnyValue) {
    //   this.keyMap[keys.VK_ENTER] = this._keyEnter.bind(this)
    //   this.keyMap[keys.VK_RETURN] = this._keyEnter.bind(this)
    //   this.keyMap[keys.VK_TAB] = this._keyTab.bind(this)
    //}
    //else {
    this.keyMap[keys.VK_ENTER] = this._chooseSelectedIndex.bind(this)
    this.keyMap[keys.VK_RETURN] = this._chooseSelectedIndex.bind(this)
    this.keyMap[keys.VK_TAB] = this._chooseSelectedIndex.bind(this)

    // Bindings
    this._onBlur = this._onBlur.bind(this)
    this._onFocus = this._onFocus.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._onOptionsError = this._onOptionsError.bind(this)
    this._setOptions = this._setOptions.bind(this)
    this._valueUpdated = this._valueUpdated.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextStateFromValue(nextProps.value, nextProps))
  }

  componentDidUpdate() {
    if (this.state.phase !== WAITING ) {
      return
    }

    const value = this.state.inputValue
    const returned = this.props.onInputChange(value)

    if (typeof(returned.then) === 'function') {
      returned.then(
        options => this._setOptions(options),
        error => this._onOptionsError(error)
      )
    }
    else {
      this._setOptions(returned)
    }
  }

  render() {
    return (
      <section className={`typeahead ${ this.props.className }`}
               onBlur={this._onBlur}
               onFocus={this._onFocus}>
        <input type="text"
               autoComplete="off"
               onChange={this._valueUpdated}
               onKeyDown={this._onKeyDown}
               placeholder={this.props.placeholder}
               value={this.state.inputValue}
               {...this.props.textBoxProps}
        />
        { this.state.focused ? this.renderMap[this.state.phase]() : null }
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Event Methods

  _onBlur(event) {
    this.setState({ focused: false })
  }

  _onFocus(event) {
    this.setState({ focused: true })
  }

  _onKeyDown(event) {
    const handler = this.keyMap[event.which]
    if (handler) {
      handler(event)
    }
  }

  _valueUpdated(event) {
    const nextState = nextStateFromValue(event.target.value, this.props)
    this.setState(nextState)
  }

  // --------------------------------------------------------------------------
  // Search Methods

  _onOptionsError() {
    this.setState({
      phase: ERROR
    })
  }

  _setOptions(options) {
    const nextState = nextStateFromOptions(options, this.props)
    this.setState(nextState)
  }

  _selectOption(index) {
    this.props.onOptionSelected(this.state.searchResults[index])
    this.setState({
      phase: CHOSEN,
      inputValue: '',
      searchResults: [],
      selectedIndex: -1
    })
  }

  // --------------------------------------------------------------------------
  // Key Helpers

  _chooseSelectedIndex(event) {
    if (this.state.searchResults.length === 0) {
      return;
    }

    let idx = this.state.selectedIndex
    if (idx === -1) {
      idx = 0
    }

    this._selectOption(idx)
    event.preventDefault()
  }

  _keyCancel(event) {
    event.preventDefault()
    this.setState(nextStateFromValue('', this.props))
  }

  _nav(delta, event) {
    event.preventDefault()

    const max = Math.min(this.props.maxVisible, this.state.searchResults.length)
    if (max === 0) {
      return
    }

    // Clamp the new index
    let newIndex = this.state.selectedIndex + delta
    if (newIndex < 0) {
      newIndex = 0
    }
    if (newIndex >= max) {
      newIndex = max - 1
    }

    this.setState({selectedIndex: newIndex})
  }

  // --------------------------------------------------------------------------
  // Render Helpers

  _renderError() {
    return (<span className="error">There was a problem retrieving the options</span>)
  }

  _renderEmpty() {
    return null
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
                  onOptionSelected={this._selectOption.bind(this)}
                  renderOption={this.props.renderOption}
                  selectedIndex={this.state.selectedIndex}
        />
    )
  }

  _renderTooManyResults() {
    const subset = this.state.searchResults.slice(0, this.props.maxVisible)
    return (
        <Selector options={subset}
                  onOptionSelected={this._selectOption.bind(this)}
                  renderOption={this.props.renderOption}
                  selectedIndex={this.state.selectedIndex}
                  footer="Continue typing for more results"
        />
    )
  }
}

Typeahead.propTypes = {
  className: PropTypes.string,
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  onInputChange: PropTypes.func.isRequired,
  onOptionSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  renderOption: PropTypes.func,
  textBoxProps: PropTypes.object,
  value: PropTypes.string
}

Typeahead.defaultProps = {
  className: '',
  maxVisible: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
  renderOption: (x) => {
    return {
      value: x,
      component: x
    }
  },
  textBoxProps: {},
  value: ''
}
