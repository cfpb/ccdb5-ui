/* eslint complexity: ["error", 6] */
import './DateFilter.less'
import {
    DATE_VALIDATION_FORMAT,
    maxDate,
    minDate
} from '../../constants'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    selectQueryDateReceivedMax,
    selectQueryDateReceivedMin
} from '../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux'
import { changeDates } from '../../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { DateRanges } from './DateRanges';
import dayjs from 'dayjs'
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat'
import dayjsIsBetween from 'dayjs/plugin/isBetween'
import { formatDate } from '../../utils/formatDate';
import iconMap from '../iconMap'
import PropTypes from 'prop-types'

dayjs.extend( dayjsCustomParseFormat )
dayjs.extend( dayjsIsBetween )

const WARN_SERIES_BREAK = 'CFPB updated product and issue options' +
    ' available to consumers in April 2017 ';

const LEARN_SERIES_BREAK = 'https://files.consumerfinance.gov/f/' +
    'documents/201704_cfpb_Summary_of_Product_and_Sub-product_Changes.pdf';


export const DateFilter = ( { fieldName, title } ) => {
  const dateFrom = useSelector( state => state.query.date_received_min );
  const dateThrough = useSelector( state => state.query.date_received_max );
  const from = dayjs( dateFrom ).format( DATE_VALIDATION_FORMAT )
  const through = dayjs( dateThrough ).format( DATE_VALIDATION_FORMAT )
  const queryDateReceivedMax = useSelector( selectQueryDateReceivedMax );
  const queryDateReceivedMin = useSelector( selectQueryDateReceivedMin );
  const [ fromDate, setFromDate ] =
      useState( formatDate( queryDateReceivedMin ) );
  const [ throughDate, setThroughDate ] =
      useState( formatDate( queryDateReceivedMax ) );
  const dispatch = useDispatch();
  const showWarning = dayjs( '2017-04-23' ).isBetween( from, through, 'day' )
  const errorMessageText = "'From' date must be less than 'through' date";

  const startRef = useRef();
  const endRef = useRef();

  useEffect( () => {
    // put it in YYYY-MM-DD format
    setFromDate( formatDate( queryDateReceivedMin ) );
    setThroughDate( formatDate( queryDateReceivedMax ) );
  }, [ queryDateReceivedMax, queryDateReceivedMin ] );

  const handleClear = period => {
    if ( period === 'from' ) {
      dispatch( changeDates( fieldName, minDate, throughDate ) )
    }
    if ( period === 'through' ) {
      dispatch( changeDates( fieldName, fromDate, maxDate ) )
    }
  }

  const errors = useMemo( () => {
    if ( dayjs( fromDate ).isAfter( throughDate ) ) {
      return errorMessageText;
    }
    return false;
  }, [ fromDate, throughDate ] )

  const handleDateChange = () => {
    // setFromDate and setThroughDate do not update the state quick enough
    // to be used here
    let _startDate = fromDate;
    let _endDate = throughDate;
    if ( _startDate < minDate ) {
      startRef.current.value = minDate;
      _startDate = minDate;
    }
    if ( _endDate > maxDate ) {
      endRef.current.value = maxDate;
      _endDate = maxDate;
    }

    const isDateDifferent = queryDateReceivedMin !== _startDate ||
        queryDateReceivedMax !== _endDate;
    if ( dayjs( _endDate ).isAfter( _startDate ) && isDateDifferent ) {
      dispatch( changeDates( fieldName, _startDate, _endDate ) )
    }
  };

  const inputStartClassName = useMemo( () => {
    const style = [ 'a-text-input' ]
    if ( dayjs( fromDate ).isBefore( minDate ) ||
        dayjs( fromDate ).isAfter( throughDate ) ) {
      style.push( 'a-text-input__error' )
    }
    return style.join( ' ' )
  }, [ fromDate, throughDate ] );

  const inputEndClassName = useMemo( () => {
    const style = [ 'a-text-input' ]
    if ( dayjs( throughDate ).isAfter( maxDate ) ||
        dayjs( throughDate ).isBefore( fromDate ) ) {
      style.push( 'a-text-input__error' )
    }
    return style.join( ' ' )
  }, [ fromDate, throughDate ] );

  return <CollapsibleFilter title={title}
                              className="aggregation date-filter">
        <div>
            <ul className="date-inputs">
                <li>
                    <label className="a-label a-label__heading body-copy"
                           htmlFor={`${ fieldName }-from`}>
                        From
                    </label>
                    <div className="m-btn-inside-input">
                        <input id={`${ fieldName }-from`}
                               className={inputStartClassName}
                               onBlur={handleDateChange}
                               onChange={evt => setFromDate( evt.target.value )}
                               min={minDate}
                               max={maxDate}
                               ref={startRef}
                               placeholder={DATE_VALIDATION_FORMAT}
                               type="date"
                               value={fromDate}
                        />
                        <button className="a-btn a-btn__link"
                                onClick={() => handleClear( 'start' )}>
                            {iconMap.getIcon( 'delete' )}
                            <span className="u-visually-hidden">Clear</span>
                        </button>
                    </div>
                </li>
                <li>
                    <label className="a-label a-label__heading body-copy"
                           htmlFor={`${ fieldName }-through`}>
                        Through
                    </label>
                    <div className="m-btn-inside-input">
                        <input id={`${ fieldName }-through`}
                               className={inputEndClassName}
                               onBlur={handleDateChange}
                               onChange={
                                   evt => setThroughDate( evt.target.value )
                               }
                               min={minDate}
                               max={maxDate}
                               placeholder={DATE_VALIDATION_FORMAT}
                               ref={endRef}
                               type="date"
                               value={throughDate}
                        />
                        <button className="a-btn a-btn__link"
                                onClick={() => handleClear( 'end' )}>
                            {iconMap.getIcon( 'delete' )}
                            <span className="u-visually-hidden">Clear</span>
                        </button>
                    </div>
                </li>
            </ul>

            {fieldName === 'date_received' ? <DateRanges/> : null}

            {errors ?
                <>{errors + ' '}
                <span aria-hidden="true">
                    {
                    iconMap.getIcon( 'delete-round', 'cf-icon-delete-round' )
                    }
                </span>
                </> :
                null
            }
            {showWarning ?
                <p> {WARN_SERIES_BREAK}
                    <a href={LEARN_SERIES_BREAK}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Learn more about Product and
                  Issue changes (opens in new window)">
                        Learn More
                    </a>
                </p> :
                null
            }
        </div>

    </CollapsibleFilter>
}

// ----------------------------------------------------------------------------
// Meta

DateFilter.propTypes = {
  fieldName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

