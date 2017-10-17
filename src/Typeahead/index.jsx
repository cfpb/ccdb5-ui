// Adapted from https://github.com/fmoo/react-typeahead

import './Typeahead.less'
import * as keys from '../constants'
import { bindAll, debounce } from '../utils'
import PropTypes from 'prop-types'
import React from 'react'
import Selector from './Selector'

// ----------------------------------------------------------------------------
// Usage Mode

// The user can enter any text or choose one of the drop down options
export const MODE_OPEN = 'OPEN'

// The user is only allowed to choose one of the drop down options
export const MODE_CLOSED = 'CLOSED'

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

export const nextStateFromValue = ( value, props ) => {
  let phase = value ? WAITING : EMPTY
  if ( value && value.length < props.minLength ) {
    phase = ACCUM
  }

  return {
    inputValue: value,
    phase,
    searchResults: [],
    selectedIndex: -1
  }
}

export const nextStateFromOptions = ( options, props ) => {
  let phase = RESULTS
  if ( !options || options.length === 0 ) {
    phase = NO_RESULTS
  } else if ( options && options.length > props.maxVisible ) {
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
  constructor( props ) {
    super( props )
    this.state = {
      ...nextStateFromValue( props.value, props ),
      focused: false
    }

    // Bindings
    bindAll( this, [
      '_callForOptions',
      '_closedChooseIndex', '_closedKeyCancel',
      '_renderError', '_renderEmpty', '_renderNoResults', '_renderResults',
      '_renderTooManyResults', '_renderWaiting',
      '_onBlur', '_onFocus', '_onKeyDown', '_onOptionsError',
      '_openChooseIndex', '_openClear', '_openKeyCancel', '_openKeyEnter',
      '_selectOption', '_setOptions',
      '_valueUpdated'
    ] )

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError,
      EMPTY: this._renderEmpty,
      ACCUM: this._renderEmpty,
      WAITING: this._renderWaiting,
      NO_RESULTS: this._renderNoResults,
      RESULTS: this._renderResults,
      TOO_MANY: this._renderTooManyResults,
      CHOSEN: this._renderEmpty
    }

    // Key/function map
    this.keyMap = {}

    if ( props.mode === MODE_OPEN ) {
      this.keyMap[keys.VK_ESCAPE] = this._openKeyCancel
      this.keyMap[keys.VK_UP] = this._openNav.bind( this, -1 )
      this.keyMap[keys.VK_DOWN] = this._openNav.bind( this, 1 )
      this.keyMap[keys.VK_ENTER] = this._openKeyEnter
      this.keyMap[keys.VK_RETURN] = this._openKeyEnter
      this.keyMap[keys.VK_TAB] = this._openChooseIndex

      // In open mode, just hide the fact that no typeahead results match
      this.renderMap[NO_RESULTS] = this._renderEmpty
    } else {
      this.keyMap[keys.VK_ESCAPE] = this._closedKeyCancel
      this.keyMap[keys.VK_UP] = this._closedNav.bind( this, -1 )
      this.keyMap[keys.VK_DOWN] = this._closedNav.bind( this, 1 )
      this.keyMap[keys.VK_ENTER] = this._closedChooseIndex
      this.keyMap[keys.VK_RETURN] = this._closedChooseIndex
      this.keyMap[keys.VK_TAB] = this._closedChooseIndex
    }

    this.search = props.debounceWait ?
      debounce( this._callForOptions, props.debounceWait ) :
      this._callForOptions
  }

  componentWillReceiveProps( nextProps ) {
    this.setState( nextStateFromValue( nextProps.value, nextProps ) )
  }

  componentDidUpdate() {
    this.search()
  }

  render() {
    const clearAction = this.props.mode === MODE_OPEN ?
      this._openClear :
      this._closedKeyCancel

    const clear = <button className="a-btn a-btn__link"
                          onClick={ clearAction }>
                      <span className="cf-icon cf-icon-delete"></span>
                      Clear
                  </button>

    return (
      <section className={`typeahead ${ this.props.className }`}
               onBlur={this._onBlur}
               onFocus={this._onFocus}>
        <div className="m-btn-inside-input input-contains-label">
            <label className="input-contains-label_before
                              input-contains-label_before__search">
            </label>

          <input type="text"
                 autoComplete="off"
                 className="a-text-input"
                 onChange={this._valueUpdated}
                 onKeyDown={this._onKeyDown}
                 placeholder={this.props.placeholder}
                 value={this.state.inputValue}
                 {...this.props.textBoxProps}
          />
          { this.state.inputValue ? clear : null }
         </div>
        { this.state.focused ? this.renderMap[this.state.phase]() : null }
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Event Methods

  _onBlur() {
    this.setState( { focused: false } )
  }

  _onFocus() {
    this.setState( { focused: true } )
  }

  _onKeyDown( event ) {
    const handler = this.keyMap[event.which]
    if ( handler ) {
      handler( event )
    }
  }

  _valueUpdated( event ) {
    const nextState = nextStateFromValue( event.target.value, this.props )
    this.setState( nextState )
  }

  // --------------------------------------------------------------------------
  // Search Methods

  _calculateNewIndex( delta ) {
    const max = Math.min(
      this.props.maxVisible, this.state.searchResults.length
    )
    if ( max === 0 ) {
      return -1
    }

    // Clamp the new index
    let newIndex = this.state.selectedIndex + delta
    if ( newIndex < 0 ) {
      newIndex = 0
    }
    if ( newIndex >= max ) {
      newIndex = max - 1
    }

    return newIndex
  }

  _callForOptions() {
    if ( this.state.phase !== WAITING ) {
      return
    }

    const value = this.state.inputValue
    const returned = this.props.onInputChange( value )

    // Did the callback produce a promise?
    if ( typeof returned.then === 'function' ) {
      returned.then(
        options => this._setOptions( options ),
        error => this._onOptionsError( error )
      )
    } else {
      this._setOptions( returned )
    }
  }

  _onOptionsError() {
    this.setState( { phase: ERROR } )
  }

  _setOptions( options ) {
    const nextState = nextStateFromOptions( options, this.props )
    this.setState( nextState )
  }

  _selectOption( index ) {
    this.props.onOptionSelected( this.state.searchResults[index] )
    const nextState = {
      phase: CHOSEN,
      searchResults: [],
      selectedIndex: -1
    }

    if ( this.props.mode === MODE_CLOSED ) {
      nextState.inputValue = ''
    }

    this.setState( nextState )
  }

  // --------------------------------------------------------------------------
  // Key Helpers

  _closedChooseIndex( event ) {
    if ( this.state.searchResults.length === 0 ) {
      return;
    }

    let idx = this.state.selectedIndex
    if ( idx === -1 ) {
      idx = 0
    }

    this._selectOption( idx )
    event.preventDefault()
  }

  _closedKeyCancel( event ) {
    event.preventDefault()
    this.setState( nextStateFromValue( '', this.props ) )
  }

  _closedNav( delta, event ) {
    event.preventDefault()
    const newIndex = this._calculateNewIndex( delta )
    if ( newIndex >= 0 ) {
      this.setState( { selectedIndex: newIndex } )
    }
  }

  _openChooseIndex( event ) {
    if ( this.state.searchResults.length === 0 ) {
      event.preventDefault()
      this.props.onOptionSelected( this.state.inputValue )
      this.setState( { phase: CHOSEN } )
    } else {
      this._closedChooseIndex( event )
    }
  }

  _openClear() {
    this.setState( nextStateFromValue( '', this.props ) )
    this.props.onOptionSelected( '' )
  }

  _openKeyEnter( event ) {
    event.preventDefault()
    this.props.onOptionSelected( this.state.inputValue )
    this.setState( { phase: CHOSEN } )
  }

  _openKeyCancel( event ) {
    event.preventDefault()
    this.setState( { phase: CHOSEN } )
  }

  _openNav( delta, event ) {
    event.preventDefault()
    const newIndex = this._calculateNewIndex( delta )
    if ( newIndex >= 0 ) {
      // May need an extractor callback eventually
      // For now, assume the shape of the options
      const inputValue = this.state.searchResults[newIndex].key

      this.setState( {
        selectedIndex: newIndex,
        inputValue
      } )
    }
  }

  // --------------------------------------------------------------------------
  // Render Helpers

  _renderError() {
    return <span className="error">
      There was a problem retrieving the options
    </span>
  }

  _renderEmpty() {
    return null
  }

  _renderWaiting() {
    return <span className="waiting">waiting...</span>
  }

  _renderNoResults() {
    return <span className="no-results">No results found</span>
  }

  _renderResults() {
    return (
        <Selector options={this.state.searchResults}
                  onOptionSelected={this._selectOption}
                  renderOption={this.props.renderOption}
                  selectedIndex={this.state.selectedIndex}
        />
    )
  }

  _renderTooManyResults() {
    const subset = this.state.searchResults.slice( 0, this.props.maxVisible )
    return (
        <Selector options={subset}
                  onOptionSelected={this._selectOption}
                  renderOption={this.props.renderOption}
                  selectedIndex={this.state.selectedIndex}
                  footer="Continue typing for more results"
        />
    )
  }
}

Typeahead.propTypes = {
  className: PropTypes.string,
  debounceWait: PropTypes.number,
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  mode: PropTypes.oneOf( [ MODE_OPEN, MODE_CLOSED ] ).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onOptionSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  renderOption: PropTypes.func,
  textBoxProps: PropTypes.object,
  value: PropTypes.string
}

Typeahead.defaultProps = {
  className: '',
  debounceWait: 0,
  maxVisible: 5,
  minLength: 2,
  mode: MODE_CLOSED,
  placeholder: 'Enter your search text',
  renderOption: x => ( {
    value: x,
    component: x
  } ),
  textBoxProps: {},
  value: ''
}
