import './DateFilter.less'
import { changeDateRange } from '../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { shortIsoFormat } from './utils'

export class DateFilter extends React.Component {
  constructor( props ) {
    super( props )

    this.state = this._validate(
      {
        from: this.props.from,
        through: this.props.through
      }
    )
  }

  componentWillReceiveProps( nextProps ) {
    const newState = {
      from: nextProps.from,
      through: nextProps.through
    }

    this.setState( this._validate( newState ) )
  }

  componentDidUpdate() {
    if ( this._hasMessages() === false ) {
      const { from, through } = this.state
      const dateFrom = from ? new Date( from ) : null
      const dateThrough = through ? new Date( through ) : null
      this.props.changeDateRange( dateFrom, dateThrough )
    }
  }

  render() {
    return (
      <CollapsibleFilter title="Date CFPB Received the complaint"
                         className="aggregation date-filter">
          <div className="layout-row">
            { this._renderDateInput( 'From:', 'from' ) }
            { this._renderDateInput( 'Through:', 'through' ) }
            { this._hasMessages() ? this._renderMessages() : null }
          </div>
        </CollapsibleFilter>
    )
  }

  // --------------------------------------------------------------------------
  // Subrender Methods

  _renderDateInput( label, field ) {
    return (
      <div className="flex-all">
          <label className="a-label a-label__heading body-copy">
            { label }
          </label>
          <input type="date"
                 aria-describedby={'input-error_message-' + field}
                 className={ this._lookupStyle( field ) }
                 onChange={ this._changeDate.bind( this, field ) }
                 min={ this.props.minimumDate }
                 max={ this.props.maximumDate }
                 value={ this.state[field] }
          />
      </div>
    )
  }

  _renderMessages() {
    return (
      <ul className="messages">
      { Object.keys( this.state.messages ).map( field =>
          <li className="a-error-message"
               key={'input-error_message-' + field}
               id={'input-error_message-' + field}
               role="alert">
            <span className="cf-icon cf-icon-delete-round"
                  aria-hidden="true">
            </span>
            { this.state.messages[field] }
          </li>
         ) }
      </ul>
    )
  }

  // --------------------------------------------------------------------------
  // Date Methods

  _changeDate( field, event ) {
    const newState = {
      from: this.state.from,
      through: this.state.through
    }
    newState[field] = event.target.value
    this.setState( this._validate( newState ) )
  }

  // --------------------------------------------------------------------------
  // Validation methods

  _hasMessages() {
    return Object.keys( this.state.messages ).length > 0
  }

  _lookupStyle( field ) {
    const style = []
    if ( field in this.state.messages ) {
      style.push( 'a-text-input__error' )
    }

    return style.join( ' ' )
  }

  /* eslint complexity: ["error", 10] */

  _validateOneDate( v ) {
    if ( v === '' ) {
      return ''
    }

    if ( isNaN( Date.parse( v ) ) ) {
      return "'" + v + "' is not a valid date."
    }

    if ( this.props.minimumDate && v < this.props.minimumDate ) {
      return "'" + v + "' must be greater than " + this.props.minimumDate
    }

    if ( this.props.maximumDate && v > this.props.maximumDate ) {
      return "'" + v + "' must be less than " + this.props.maximumDate
    }

    return ''
  }

  /* eslint complexity: ["error", 5] */

  _validate( state ) {
    const messages = {}
    const { from, through } = state

    let m = this._validateOneDate( from )
    if ( m ) {
      messages.from = m
    }

    m = this._validateOneDate( through )
    if ( m ) {
      messages.through = m
    }

    if ( from && through && from > through ) {
      messages.ordered = "'From' must be less than 'Through'"
    }

    state.messages = messages
    return state
  }
}

// ----------------------------------------------------------------------------
// Meta

DateFilter.propTypes = {
  fieldName: PropTypes.string.isRequired,
  from: PropTypes.string,
  maximumDate: PropTypes.string,
  minimumDate: PropTypes.string,
  through: PropTypes.string
}

DateFilter.defaultProps = {
  from: '',
  maximumDate: '',
  minimumDate: '2014-01-01',
  through: ''
}

export const mapStateToProps = ( state, ownProps ) => ( {
  from: shortIsoFormat( state.query[ownProps.fieldName + '_min'] ),
  through: shortIsoFormat( state.query[ownProps.fieldName + '_max'] )
} )

export const mapDispatchToProps = ( dispatch, ownProps ) => ( {
  changeDateRange: ( from, through ) => {
    dispatch( changeDateRange( ownProps.fieldName, from, through ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( DateFilter )
