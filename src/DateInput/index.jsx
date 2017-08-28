/* eslint complexity: ["error", 6] */

import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { shortFormat } from '../Filters/utils'

const FORMAT = 'MM-DD-YYYY'
const ONLY_VALID_SYMBOLS = /^[0-9/-]{1,10}$/
const HAS_4_DIGIT_YEAR = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/

// ----------------------------------------------------------------------------
// State Machine

const EMPTY = 'EMPTY'
const ACCUM = 'ACCUM'
const READY = 'READY'
const VALID = 'VALID'

const ERROR = 'ERROR'
const TOO_LOW = 'TOO_LOW'
const TOO_HIGH = 'TOO_HIGH'

// ----------------------------------------------------------------------------
// The Class

export default class DateInput extends React.Component {
  constructor( props ) {
    super( props )

    this.state = this._calculateState( props, this.props.value )

    this._changeDate = this._changeDate.bind( this )
  }

  componentWillMount() {
    if ( this.state.message ) {
      this.props.onError( this.state.message, this.props.value )
    }
  }

  componentWillReceiveProps( nextProps ) {
    const state = this._calculateState( nextProps, nextProps.value )
    this.setState( state )
  }

  render() {
    const placeholder = this.props.placeholder || 'mm/dd/yyyy'

    return (
      <div>
        <input className={ this._className }
               onChange={ this._changeDate }
               min={ this.props.min }
               max={ this.props.max }
               placeholder={ placeholder }
               size="15"
               value={ this.state.asText }
               {...this.props.textBoxProps}
        />
      </div>
    )
  }

  // https://cfpb.github.io/capital-framework/components/cf-forms/
  //       <div className="m-btn-inside-input">
  //
  // <button className="a-btn a-btn__link">
  //     <span className="cf-icon cf-icon-delete"></span>
  // </button>

  // --------------------------------------------------------------------------
  // Properties

  get _className() {
    const style = [ 'a-text-input' ]
    if ( this.state.phase === ERROR ) {
      style.push( 'a-text-input__error' )
    }

    return style.join( ' ' )
  }

  // --------------------------------------------------------------------------
  // Event Handlers

  _changeDate( event ) {
    const v = event.target.value
    const newState = this._calculateState( this.props, v )
    this.setState( newState )

    switch ( newState.phase ) {
      case EMPTY:
        this.props.onDateEntered( null )
        break

      case VALID:
        this.props.onDateEntered( newState.asDate.toDate() )
        break

      case ERROR:
      case TOO_LOW:
      case TOO_HIGH:
        this.props.onError( newState.message, v )
        break

      default:
        this.props.onChange( v )
        break
    }
  }

  // --------------------------------------------------------------------------
  // Validation

  _initialPhase( s ) {
    if ( !s ) {
      return EMPTY
    }

    let m = s.match( ONLY_VALID_SYMBOLS )
    if ( !m ) {
      return ERROR
    }

    if ( s.length < 8 ) {
      return ACCUM
    }

    m = s.match( HAS_4_DIGIT_YEAR )
    return m ? READY : ACCUM
  }

  _validateAsDate( props, d ) {
    if ( d.isValid() === false ) {
      return ERROR
    }

    if ( props.min && d < props.min ) {
      return TOO_LOW
    }

    if ( props.max && d > props.max ) {
      return TOO_HIGH
    }

    return VALID
  }

  _calculateState( props, v ) {
    const state = {
      asDate: null,
      asText: v,
      phase: this._initialPhase( v )
    }

    if ( state.phase === READY ) {
      state.asDate = moment( v, FORMAT )
      state.phase = this._validateAsDate( props, state.asDate )
    }

    state.message = this._buildErrorMessage( state.phase, props, v )

    return state
  }

  _buildErrorMessage( phase, props, v ) {
    switch ( phase ) {
      case ERROR:
        return `'${ v }' is not a valid date.`

      case TOO_LOW:
        return `'${ v }' must be greater than ` + shortFormat( props.min )

      case TOO_HIGH:
        return `'${ v }' must be less than ` + shortFormat( props.max )

      default:
        return ''
    }
  }
}

// --------------------------------------------------------------------------
// Meta

DateInput.propTypes = {
  max: PropTypes.instanceOf( Date ),
  min: PropTypes.instanceOf( Date ),
  onChange: PropTypes.func,
  onDateEntered: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  textBoxProps: PropTypes.object,
  value: PropTypes.string
}

/* eslint-disable no-empty-function */

DateInput.defaultProps = {
  max: null,
  min: null,
  onChange: () => {},
  placeholder: '',
  textBoxProps: {},
  value: ''
}
