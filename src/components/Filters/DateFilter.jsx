/* eslint complexity: ["error", 6] */
import './DateFilter.less'
import {
    DATE_VALIDATION_FORMAT,
    maxDate,
    minDate
} from '../../constants'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    selectQueryDateReceivedMax, selectQueryDateReceivedMin
} from '../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux'
import { changeDates } from '../../actions/filter'
import CollapsibleFilter from './CollapsibleFilter'
import { DateRanges } from './DateRanges';
import dayjs from 'dayjs'
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat'
import dayjsIsBetween from 'dayjs/plugin/isBetween'
import dayjsTimezone from 'dayjs/plugin/timezone'
import dayjsUtc from 'dayjs/plugin/utc'
import { formatDate } from '../../utils/formatDate';
import iconMap from '../iconMap'

dayjs.extend( dayjsCustomParseFormat )
dayjs.extend( dayjsIsBetween )
dayjs.extend( dayjsUtc )
dayjs.extend( dayjsTimezone )
dayjs.tz.setDefault( 'America/New_York' );
const WARN_SERIES_BREAK = 'CFPB updated product and issue options' +
    ' available to consumers in April 2017 ';

const LEARN_SERIES_BREAK = 'https://files.consumerfinance.gov/f/' +
    'documents/201704_cfpb_Summary_of_Product_and_Sub-product_Changes.pdf';


export const DateFilter = () => {
  const fieldName = 'date_received'
  const title = 'Date CFPB received the complaint'
  const dateFrom = useSelector( selectQueryDateReceivedMin );
  const dateThrough = useSelector( selectQueryDateReceivedMax );
  const from = dayjs( dateFrom ).format( DATE_VALIDATION_FORMAT )
  const through = dayjs( dateThrough ).format( DATE_VALIDATION_FORMAT )
  const initialFromDate = dayjs( dateFrom ).isValid() ?
      formatDate( dateFrom ) : '';
  const initialThroughDate = dayjs( dateThrough ).isValid() ?
      formatDate( dateThrough ) : '';
  const [ fromDate, setFromDate ] = useState( initialFromDate );
  const [ throughDate, setThroughDate ] =
      useState( formatDate( initialThroughDate ) );
  const dispatch = useDispatch();
  const showWarning =
      dayjs( '2017-04-23' ).isBetween( from, through, 'day' )
  const errorMessageText = "'From' date must be less than 'through' date";

  const fromRef = useRef();
  const throughRef = useRef();

  useEffect( () => {
    // put it in YYYY-MM-DD format
    // validate to make sure it's not invalid
    const validFromDate = dateFrom ? formatDate( dateFrom ) : '';
    setFromDate( validFromDate );
  }, [ dateFrom ] );

  useEffect( () => {
    const validThroughDate = dateThrough ? formatDate( dateThrough ) : '';
    setThroughDate( validThroughDate );
  }, [ dateThrough ] );

  const handleClear = period => {
    if ( period === 'from' ) {
      dispatch( changeDates( fieldName, '', throughDate ) )
    }
    if ( period === 'through' ) {
      dispatch( changeDates( fieldName, fromDate, '' ) )
    }
  }

  const handleKeyDownFromDate = event => {
    if ( event.key === 'Enter' ) {
      fromRef.current.blur();
    }
  }

  const handleKeyDownThroughDate = event => {
    if ( event.key === 'Enter' ) {
      throughRef.current.blur();
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
      fromRef.current.value = minDate;
      _startDate = minDate;
    }
    if ( _endDate > maxDate ) {
      throughRef.current.value = maxDate;
      _endDate = maxDate;
    }

    const isDateDifferent = dateFrom !== _startDate || dateThrough !== _endDate;
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
                               onKeyDown={handleKeyDownFromDate}
                               min={minDate}
                               max={maxDate}
                               ref={fromRef}
                               placeholder={DATE_VALIDATION_FORMAT}
                               type="date"
                               value={fromDate}
                        />
                        <button className="a-btn a-btn__link"
                                onClick={() => handleClear( 'from' )}>
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
                               onKeyDown={handleKeyDownThroughDate}
                               min={minDate}
                               max={maxDate}
                               placeholder={DATE_VALIDATION_FORMAT}
                               ref={throughRef}
                               type="date"
                               value={throughDate}
                        />
                        <button className="a-btn a-btn__link"
                                onClick={() => handleClear( 'through' )}>
                            {iconMap.getIcon( 'delete' )}
                            <span className="u-visually-hidden">Clear</span>
                        </button>
                    </div>
                </li>
            </ul>
            <DateRanges/>
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

