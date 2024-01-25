/* eslint complexity: ["error", 8] */
import './DateFilter.less';
import { DATE_VALIDATION_FORMAT, maxDate, minDate } from '../../constants';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { changeDates } from '../../actions/filter';
import CollapsibleFilter from './CollapsibleFilter';
import { DateRanges } from './DateRanges';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import dayjsUtc from 'dayjs/plugin/utc';
import { formatDate } from '../../utils/formatDate';
import iconMap from '../iconMap';

dayjs.extend(dayjsCustomParseFormat);
dayjs.extend(dayjsIsBetween);
dayjs.extend(dayjsUtc);

const WARN_SERIES_BREAK =
  'CFPB updated product and issue options in April 2017 and August 2023.';

const LEARN_SERIES_BREAK =
  'https://www.consumerfinance.gov/data-research/consumer-complaints/#past-changes';

export const DateFilter = () => {
  const fieldName = 'date_received';
  const title = 'Date CFPB received the complaint';
  const dateFrom = useSelector(selectQueryDateReceivedMin);
  const dateThrough = useSelector(selectQueryDateReceivedMax);
  const initialFromDate = dayjs(dateFrom).isValid() ? formatDate(dateFrom) : '';
  const initialThroughDate = dayjs(dateThrough).isValid()
    ? formatDate(dateThrough)
    : '';
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [throughDate, setThroughDate] = useState(initialThroughDate);
  const dispatch = useDispatch();

  const errorMessageText = "'From' date must be less than 'through' date";
  const errorSameDate = "'From' date cannot be the same as 'Through' date";

  const fromRef = useRef();
  const throughRef = useRef();

  useEffect(() => {
    // put it in YYYY-MM-DD format
    // validate to make sure it's not invalid
    const validFromDate = dateFrom ? formatDate(dateFrom) : '';
    setFromDate(validFromDate);
  }, [dateFrom]);

  useEffect(() => {
    const validThroughDate = dateThrough ? formatDate(dateThrough) : '';
    setThroughDate(validThroughDate);
  }, [dateThrough]);

  const handleClear = (period) => {
    if (period === 'from') {
      dispatch(changeDates(fieldName, minDate, throughDate));
    }
    if (period === 'through') {
      dispatch(changeDates(fieldName, fromDate, maxDate));
    }
  };

  const handleKeyDownFromDate = (event) => {
    if (event.key === 'Enter') {
      fromRef.current.blur();
    }
  };

  const handleKeyDownThroughDate = (event) => {
    if (event.key === 'Enter') {
      throughRef.current.blur();
    }
  };

  const errors = useMemo(() => {
    if (dayjs(fromDate).isAfter(throughDate)) {
      return errorMessageText;
    }
    if (dayjs(fromDate).isSame(throughDate)) {
      return errorSameDate;
    }
    return false;
  }, [fromDate, throughDate]);

  const handleDateChange = () => {
    // setFromDate and setThroughDate do not update the state quick enough
    // to be used here
    let _fromDate = fromDate;
    let _throughDate = throughDate;
    // don't do anything if its empty
    if (_fromDate < minDate && _fromDate) {
      fromRef.current.value = minDate;
      _fromDate = minDate;
    }
    if (_throughDate > maxDate && _throughDate) {
      throughRef.current.value = maxDate;
      _throughDate = maxDate;
    }

    const isDateDifferent =
      dateFrom !== _fromDate || dateThrough !== _throughDate;
    if (dayjs(_throughDate).isAfter(_fromDate) && isDateDifferent) {
      dispatch(changeDates(fieldName, _fromDate, _throughDate));
    }
  };

  const inputFromClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      dayjs(fromDate).isBefore(minDate) ||
      dayjs(fromDate).isAfter(throughDate) ||
      dayjs(fromDate).isSame(throughDate)
    ) {
      style.push('a-text-input__error');
    }
    return style.join(' ');
  }, [fromDate, throughDate]);

  const inputThroughClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      dayjs(throughDate).isAfter(maxDate) ||
      dayjs(throughDate).isBefore(fromDate) ||
      dayjs(throughDate).isSame(fromDate)
    ) {
      style.push('a-text-input__error');
    }
    return style.join(' ');
  }, [fromDate, throughDate]);

  return (
    <CollapsibleFilter title={title} className="aggregation date-filter">
      <div>
        <p className="u-mt15">
          {' '}
          {WARN_SERIES_BREAK}{' '}
          <a
            href={LEARN_SERIES_BREAK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Learn more about Product and
                  Issue changes (opens in new window)"
          >
            Learn More
          </a>
        </p>
        <ul className="date-inputs">
          <li>
            <label
              className="a-label a-label__heading body-copy"
              htmlFor={`${fieldName}-from`}
            >
              From
            </label>
            <div className="m-btn-inside-input">
              <input
                id={`${fieldName}-from`}
                className={inputFromClassName}
                onBlur={handleDateChange}
                onChange={(evt) => setFromDate(evt.target.value)}
                onKeyDown={handleKeyDownFromDate}
                min={minDate}
                max={maxDate}
                ref={fromRef}
                placeholder={DATE_VALIDATION_FORMAT}
                type="date"
                value={fromDate}
              />
              <button
                className="a-btn a-btn__link"
                onClick={() => handleClear('from')}
              >
                {iconMap.getIcon('delete')}
                <span className="u-visually-hidden">
                  Clear date received from filter
                </span>
              </button>
            </div>
          </li>
          <li>
            <label
              className="a-label a-label__heading body-copy"
              htmlFor={`${fieldName}-through`}
            >
              Through
            </label>
            <div className="m-btn-inside-input">
              <input
                id={`${fieldName}-through`}
                className={inputThroughClassName}
                onBlur={handleDateChange}
                onChange={(evt) => setThroughDate(evt.target.value)}
                onKeyDown={handleKeyDownThroughDate}
                min={minDate}
                max={maxDate}
                placeholder={DATE_VALIDATION_FORMAT}
                ref={throughRef}
                type="date"
                value={throughDate}
              />
              <button
                className="a-btn a-btn__link"
                onClick={() => handleClear('through')}
              >
                {iconMap.getIcon('delete')}
                <span className="u-visually-hidden">
                  Clear date received through filter
                </span>
              </button>
            </div>
          </li>
        </ul>
        <DateRanges />
        {errors ? (
          <>
            {errors + ' '}
            <span aria-hidden="true">
              {iconMap.getIcon('delete-round', 'cf-icon-delete-round')}
            </span>
          </>
        ) : null}
      </div>
    </CollapsibleFilter>
  );
};
