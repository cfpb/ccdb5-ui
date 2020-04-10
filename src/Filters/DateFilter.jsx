import './DateFilter.less'
import { changeDateRange } from '../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { connect } from 'react-redux'
import { DATE_RANGE_MIN } from '../constants'
import DateInput from '../DateInput'
import iconMap from '../iconMap'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { shortFormat } from '../utils'

const WARN_SERIES_BREAK = 'In April 2017 we made changes to consumer' +
  ' complaint Product fields. This may result in discrepancies in the' +
  ' display of visualizations ';

const LEARN_SERIES_BREAK = 'http://files.consumerfinance.gov/f/documents/201704_cfpb_Summary_of_Product_and_Sub-product_Changes.pdf';

export class DateFilter extends React.Component {
  constructor( props ) {
    super( props )

    this.state = this._validate( {
      from: props.from,
      through: props.through,
      messages: {}
    } )
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps( nextProps ) {
    const newState = {
      from: nextProps.from,
      through: nextProps.through,
      messages: {}
    }

    this.setState( this._validate( newState ) )
  }

  render() {
    const from = moment( this.state.from, 'MM-DD-YYYY' )
    const through = moment( this.state.through, 'MM-DD-YYYY' )

    const showWarning = moment( '2017-04-23' ).isBetween( from, through, 'day' )

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
            { showWarning ?
              <p> { WARN_SERIES_BREAK }
                <a href={ LEARN_SERIES_BREAK } >
                  Learn More
                </a>
              </p> :
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
    const inputId = `${ this.props.fieldName }-${ field }`

    const localProps = {
      id: inputId
    }

    return (
      <li>
          <label className="a-label a-label__heading body-copy"
                 htmlFor={ inputId }>
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
              { iconMap.getIcon( 'delete-round', 'cf-icon-delete-round' ) }
            </span>

            { this.state.messages[field] }
          </li>
         ) }
      </ul>
    )
  }

  // --------------------------------------------------------------------------
  // Validation methods
  _isChanged( props, state ) {
    return props.from !== state.from || props.through !== state.through
  }

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
  /* eslint complexity: ["error", 5] */
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
    // only fire off change when there is a mismatch in the dates,
    // when DateInterval changed vs manually changing the date
    if ( this._hasMessages( state.messages ) === false &&
      this._isChanged( this.props, state ) ) {

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
  minimumDate: new Date( DATE_RANGE_MIN ),
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
