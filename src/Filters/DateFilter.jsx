import './DateFilter.less'
import { changeDateRange } from '../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import DateInput from '../DateInput'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { shortFormat } from '../utils'

export class DateFilter extends React.Component {
  constructor( props ) {
    super( props )

    this.state = this._validate( {
      from: props.from,
      through: props.through,
      messages: {}
    } )
  }

  componentWillReceiveProps( nextProps ) {
    const newState = {
      from: nextProps.from,
      through: nextProps.through,
      messages: {}
    }

    this.setState( this._validate( newState ) )
  }

  render() {
    return (
      <CollapsibleFilter title={ this.props.title }
                         className="aggregation date-filter">
          <div>
            <ul className="date-inputs">
            { this._renderDateInput( 'From', 'from' ) }
            { this._renderDateInput( 'Through', 'through' ) }
            </ul>
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
      <li>
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
      </li>
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
            <span aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm261.8 692.2c19.4 19.6 19.3 51.3-.3 70.7-19.5 19.3-50.9 19.3-70.4 0L499.6 676.6 308 868.1c-19.6 19.4-51.3 19.3-70.7-.3-19.3-19.5-19.3-50.9 0-70.4l191.6-191.5-191.6-191.6c-19.3-19.8-18.9-51.4.9-70.7 19.4-18.9 50.4-18.9 69.8 0l191.6 191.5 191.5-191.5c19.6-19.4 51.3-19.3 70.7.3 19.3 19.5 19.3 50.9 0 70.4L570.3 605.9l191.5 191.5z"></path></svg>
            </span>

            { this.state.messages[field] }
          </li>
         ) }
      </ul>
    )
  }

  // --------------------------------------------------------------------------
  // Validation methods

  _validate( state ) {

    // Check for range errors
    const from = moment( state.from, 'MM-DD-YYYY' )
    const through = moment( state.through, 'MM-DD-YYYY' )
    if ( from && through && from > through ) {
      state.messages.ordered = "'From' must be less than 'Through'"
    } else {
      delete state.messages.ordered
    }

    return state
  }

  // --------------------------------------------------------------------------
  // DateInput interface methods

  _onDateEntered( field, date ) {
    let state = {
      from: this.state.from,
      through: this.state.through,
      messages: { ...this.state.messages }
    }

    // Update the correct field
    state[field] = shortFormat( date )

    // Clear any messages for that field
    delete state.messages[field]

    state = this._validate( state )

    this.setState( state )

    // If it's good, send an update
    if ( this._hasMessages( state.messages ) === false ) {
      const from = moment( state.from, 'MM-DD-YYYY' )
      const through = moment( state.through, 'MM-DD-YYYY' )
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
  minimumDate: new Date( '2011-11-30T12:00:00.000Z' ),
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
