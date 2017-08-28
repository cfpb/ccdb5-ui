import './DateFilter.less'
import { changeDateRange } from '../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import DateInput from '../DateInput'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { shortFormat } from './utils'

export class DateFilter extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      from: this.props.from,
      through: this.props.through,
      messages: {}
    }
  }

  componentWillReceiveProps( nextProps ) {
    const newState = {
      from: nextProps.from,
      through: nextProps.through,
      messages: {}
    }

    this.setState( newState )
  }

  render() {
    return (
      <CollapsibleFilter title={ this.props.title }
                         className="aggregation date-filter">
          <div className="layout-row">
            { this._renderDateInput( 'From', 'from' ) }
            { this._renderDateInput( 'Through', 'through' ) }
            { this._hasMessages( this.state.messages ) ?
              this._renderMessages() :
              null
            }
          </div>
        </CollapsibleFilter>
    )
  }

  // --------------------------------------------------------------------------
  // Subrender Methods

  _hasMessages( messages ) {
    return Object.keys( messages ).length > 0
  }

  _renderDateInput( label, field ) {
    const localProps = {
      'aria-describedby': 'input-error_message-' + field
    }

    return (
      <div className="flex-all">
          <label className="a-label a-label__heading body-copy">
            { label }
          </label>
          <DateInput min={ this.props.minimumDate }
                     max={ this.props.maximumDate }
                     onDateEntered={ this._onDateEntered.bind( this, field ) }
                     onError={ this._onError.bind( this, field ) }
                     textBoxProps={ localProps }
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
  // DateInput interface methods

  /* eslint complexity: ["error", 6] */

  _onDateEntered( field, date ) {
    const newState = {
      from: this.state.from,
      through: this.state.through,
      messages: { ...this.state.messages }
    }

    // Update the correct field
    newState[field] = shortFormat( date )

    // Clear any messages for that field
    delete newState.messages[field]

    // Check for range errors
    const from = moment( newState.from, 'MM-DD-YYYY' )
    const through = moment( newState.through, 'MM-DD-YYYY' )
    if ( from && through && from > through ) {
      newState.messages.ordered = "'From' must be less than 'Through'"
    } else {
      delete newState.messages.ordered
    }

    this.setState( newState )

    // If it's good, send an update
    if ( this._hasMessages( newState.messages ) === false ) {
      const dateFrom = from.isValid() ? from.toDate() : null
      const dateThrough = through.isValid() ? through.toDate() : null
      this.props.changeDateRange( dateFrom, dateThrough )
    }
  }

  _onError( field, error, value ) {
    const messages = { ...this.state.messages }
    messages[field] = error
    this.setState( { messages, [field]: value } )
  }
}

// ----------------------------------------------------------------------------
// Meta

DateFilter.propTypes = {
  fieldName: PropTypes.string.isRequired,
  from: PropTypes.string,
  maximumDate: PropTypes.instanceOf( Date ),
  minimumDate: PropTypes.instanceOf( Date ),
  through: PropTypes.string,
  title: PropTypes.string.isRequired
}

DateFilter.defaultProps = {
  from: '',
  maximumDate: null,
  minimumDate: new Date( '2014-01-01T12:00:00' ),
  through: ''
}

export const mapStateToProps = ( state, ownProps ) => ( {
  from: shortFormat( state.query[ownProps.fieldName + '_min'] ),
  through: shortFormat( state.query[ownProps.fieldName + '_max'] )
} )

export const mapDispatchToProps = ( dispatch, ownProps ) => ( {
  changeDateRange: ( from, through ) => {
    dispatch( changeDateRange( ownProps.fieldName, from, through ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( DateFilter )
