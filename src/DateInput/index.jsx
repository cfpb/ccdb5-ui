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

  componentWillReceiveProps( nextProps ) {
    this.setState( this._calculateState( nextProps, nextProps.value ) )
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
        this.props.onError( `'${ v }' is not a valid date.`, v )
        break

      case TOO_LOW:
        this.props.onError(
          `'${ v }' must be greater than ` + shortFormat( this.props.min ), v
        )
        break

      case TOO_HIGH:
        this.props.onError(
          `'${ v }' must be less than ` + shortFormat( this.props.max ), v
        )
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

    return state
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
