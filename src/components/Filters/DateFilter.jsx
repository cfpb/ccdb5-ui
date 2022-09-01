import './DateFilter.less';
import { DATE_RANGE_MIN, DATE_VALIDATION_FORMAT } from '../../constants';
import { shortFormat, startOfToday } from '../../utils';
import { changeDates } from '../../actions/filter';
import CollapsibleFilter from './CollapsibleFilter';
import { connect } from 'react-redux';
import DateInput from '../DateInput';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

dayjs.extend( dayjsCustomParseFormat );
dayjs.extend( dayjsIsBetween );

const WARN_SERIES_BREAK = 'CFPB updated product and issue options' +
  ' available to consumers in April 2017 ';

const LEARN_SERIES_BREAK = 'https://files.consumerfinance.gov/f/' +
  'documents/201704_cfpb_Summary_of_Product_and_Sub-product_Changes.pdf';

export class DateFilter extends React.Component {
  constructor( props ) {
    super( props );

    this.state = this._validate( {
      from: props.from,
      through: props.through,
      messages: {}
    } );
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps( nextProps ) {
    const newState = {
      from: nextProps.from,
      through: nextProps.through,
      messages: {}
    };

    this.setState( this._validate( newState ) );
  }

  render() {
    const from = dayjs( this.state.from, DATE_VALIDATION_FORMAT );
    const through = dayjs( this.state.through, DATE_VALIDATION_FORMAT );

    const showWarning = dayjs( '2017-04-23' ).isBetween( from, through, 'day' );

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
              <a href={ LEARN_SERIES_BREAK }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Learn more about Product and
                  Issue changes (opens in new window)" >
                  Learn More
              </a>
            </p> :
            null
          }
        </div>
      </CollapsibleFilter>
    );
  }

  /* --------------------------------------------------------------------------
     Subrender Methods */

  _hasMessages( messages ) {
    return Object.keys( messages ).length > 0;
  }

  _renderDateInput( label, field ) {
    const inputId = `${ this.props.fieldName }-${ field }`;

    const localProps = {
      id: inputId
    };

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
    );
  }

  _renderMessages() {
    return (
      <ul className="messages">
        { Object.keys( this.state.messages ).map( field => <li className="a-error-message"
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
    );
  }

  /* --------------------------------------------------------------------------
     Validation methods */
  _isChanged( props, state ) {
    return props.from !== state.from || props.through !== state.through;
  }

  _validate( state ) {

    // Check for range errors
    const from = dayjs( state.from, DATE_VALIDATION_FORMAT );
    const through = dayjs( state.through, DATE_VALIDATION_FORMAT );
    if ( from && through && from > through ) {
      state.messages.ordered = "'From' must be less than 'Through'";
    } else {
      delete state.messages.ordered;
    }

    return state;
  }

  /* --------------------------------------------------------------------------
     DateInput interface methods */
  /* eslint complexity: ["error", 5] */
  _onDateEntered( field, date ) {
    let state = {
      from: this.state.from,
      through: this.state.through,
      messages: { ...this.state.messages }
    };

    // Update the correct field
    state[field] = shortFormat( date );

    // Clear any messages for that field
    delete state.messages[field];

    state = this._validate( state );

    this.setState( state );

    /* If it's good, send an update
       only fire off change when there is a mismatch in the dates,
       when DateInterval changed vs manually changing the date */
    if ( this._hasMessages( state.messages ) === false &&
      this._isChanged( this.props, state ) ) {

      const from = dayjs( state.from, 'M/D/YYYY' );
      const through = dayjs( state.through, 'M/D/YYYY' );
      const dateFrom = from.isValid() ? from.toDate() : null;
      const dateThrough = through.isValid() ? through.toDate() : null;

      this.props.changeDates( dateFrom, dateThrough );
    }
  }

  _onError( field, error, value ) {
    const messages = { ...this.state.messages };
    messages[field] = error;
    this.setState( { messages, [field]: value } );
  }
}

/* ----------------------------------------------------------------------------
   Meta */

DateFilter.propTypes = {
  fieldName: PropTypes.string.isRequired,
  from: PropTypes.string,
  maximumDate: PropTypes.instanceOf( Date ),
  minimumDate: PropTypes.instanceOf( Date ),
  through: PropTypes.string,
  title: PropTypes.string.isRequired
};

DateFilter.defaultProps = {
  from: '',
  maximumDate: startOfToday(),
  minimumDate: new Date( DATE_RANGE_MIN ),
  through: ''
};

export const mapStateToProps = ( state, ownProps ) => ( {
  from: shortFormat( state.query[ownProps.fieldName + '_min'] ),
  through: shortFormat( state.query[ownProps.fieldName + '_max'] )
} );

export const mapDispatchToProps = ( dispatch, ownProps ) => ( {
  changeDates: ( from, through ) => {
    dispatch( changeDates( ownProps.fieldName, from, through ) );
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( DateFilter );
