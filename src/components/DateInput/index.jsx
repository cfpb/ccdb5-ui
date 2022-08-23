/* eslint complexity: ["error", 7] */

import './DateInput.less'
import { bindAll, debounce, shortFormat } from '../../utils'
import { DATE_VALIDATION_FORMAT } from '../../constants';
import dayjs from 'dayjs'
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat'
import iconMap from '../iconMap'
import PropTypes from 'prop-types'
import React from 'react'

dayjs.extend( dayjsCustomParseFormat )

const ONLY_VALID_SYMBOLS = /^[0-9/]{1,10}$/
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

    this.state = this._calculateState( props, props.value )

    bindAll( this, [ '_onClear', '_onChange', '_triggerCallbacks' ] )
    this._triggerCallbacks = props.debounceWait ?
      debounce( this._triggerCallbacks, props.debounceWait ) :
      this._triggerCallbacks
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    if ( this.state.message ) {
      this.props.onError( this.state.message, this.props.value )
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps( nextProps ) {
    const state = this._calculateState( nextProps, nextProps.value )
    this.setState( state )
  }

  shouldComponentUpdate( nextProps, nextState ) {
    return JSON.stringify( this.state ) !== JSON.stringify( nextState )
  }

  componentDidUpdate() {
    this._triggerCallbacks()
  }

  render() {
    const placeholder = this.props.placeholder || DATE_VALIDATION_FORMAT

    return (
      <div className="m-btn-inside-input">
        <input className={ this._inputClassName }
               onChange={ this._onChange }
               min={ this.props.min }
               max={ this.props.max }
               placeholder={ placeholder }
               size="15"
               value={ this.state.asText }
               {...this.props.textBoxProps}
        />
        { this.state.asText ?
          <button className="a-btn a-btn__link"
                  onClick={ this._onClear }>
              { iconMap.getIcon( 'delete' ) }
              <span className="u-visually-hidden">Clear</span>
          </button> :
          null
        }
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // Properties

  get _inputClassName() {
    const style = [ 'a-text-input' ]
    if ( this.state.phase === ERROR ) {
      style.push( 'a-text-input__error' )
    }

    return style.join( ' ' )
  }

  // --------------------------------------------------------------------------
  // Event Handlers

  _onClear() {
    const newState = this._calculateState( this.props, '' )
    this.setState( newState )
  }

  _onChange( event ) {
    const v = event.target.value.replace( '-', '/' )
    const newState = this._calculateState( this.props, v )
    this.setState( newState )
  }

  _triggerCallbacks() {
    switch ( this.state.phase ) {
      case EMPTY:
        if ( this.props.value ) {
          this.props.onDateEntered( null )
        }
        break

      case VALID:
        this.props.onDateEntered( this.state.asDate.toDate() )
        break

      case ERROR:
      case TOO_LOW:
      case TOO_HIGH:
        this.props.onError( this.state.message, this.state.asText )
        break

      default:
        this.props.onChange( this.state.asText )
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
    if ( dayjs( d, DATE_VALIDATION_FORMAT, true ).isValid() === false ) {
      return ERROR
    }

    if ( props.min && dayjs( d ).isBefore( props.min, 'day' ) ) {
      return TOO_LOW
    }

    if ( props.max && dayjs( d ).isAfter( props.max, 'day' ) ) {
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
      state.asDate = dayjs( v, DATE_VALIDATION_FORMAT, true )
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
  debounceWait: PropTypes.number,
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
  debounceWait: 400,
  max: null,
  min: null,
  onChange: () => {},
  placeholder: '',
  textBoxProps: {},
  value: ''
}
