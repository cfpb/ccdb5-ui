/* eslint complexity: ["error", 7] */
import './DateFilter.less';
import { DATE_VALIDATION_FORMAT, maxDate, minDate } from '../../constants';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  selectQueryCompanyReceivedMax,
  selectQueryCompanyReceivedMin,
} from '../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { changeDates } from '../../actions/filter';
import CollapsibleFilter from './CollapsibleFilter';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import { formatDate } from '../../utils/formatDate';
import iconMap from '../iconMap';

dayjs.extend(dayjsCustomParseFormat);
dayjs.extend(dayjsIsBetween);

export const CompanyReceivedFilter = () => {
  const fieldName = 'company_received';
  const title = 'The date the CFPB sent the complaint to the company';
  const dateFrom = useSelector(selectQueryCompanyReceivedMin);
  const dateThrough = useSelector(selectQueryCompanyReceivedMax);

  const initialFromDate = dayjs(dateFrom).isValid() ? formatDate(dateFrom) : '';
  const initialThroughDate = dayjs(dateThrough).isValid()
    ? formatDate(dateThrough)
    : '';

  const [fromDate, setFromDate] = useState(initialFromDate);
  const [throughDate, setThroughDate] = useState(initialThroughDate);
  const dispatch = useDispatch();
  const errorMessageText = "'From' date must be less than 'through' date";

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
      dispatch(changeDates(fieldName, '', throughDate));
    }
    if (period === 'through') {
      dispatch(changeDates(fieldName, fromDate, ''));
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
    const errs = [];
    if (dayjs(fromDate).isAfter(throughDate)) {
      errs.push(errorMessageText);
    }
    if (dayjs(fromDate).isBefore(minDate)) {
      errs.push(
        "'From' date must be after " +
          dayjs(minDate).format(DATE_VALIDATION_FORMAT)
      );
    }
    if (dayjs(throughDate).isAfter(maxDate)) {
      errs.push(
        "'Through' date must be before " +
          dayjs(maxDate).format(DATE_VALIDATION_FORMAT)
      );
    }

    return errs;
  }, [fromDate, throughDate]);

  const handleDateChange = () => {
    let _throughDate = throughDate;
    let _fromDate = fromDate;
    if (_fromDate && !dayjs(fromDate).isValid()) {
      fromRef.current.value = '';
      _fromDate = '';
    }
    if (_throughDate && !dayjs(throughDate).isValid()) {
      throughRef.current.value = '';
      _throughDate = '';
    }
    const isDateDifferent =
      dateFrom !== _fromDate || dateThrough !== _throughDate;
    if (isDateDifferent) {
      dispatch(changeDates(fieldName, _fromDate, _throughDate));
    }
  };

  const inputFromClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      dayjs(fromDate).isBefore(minDate) ||
      dayjs(fromDate).isAfter(throughDate)
    ) {
      style.push('a-text-input__error');
    }
    return style.join(' ');
  }, [fromDate, throughDate]);

  const inputThroughClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      dayjs(throughDate).isAfter(maxDate) ||
      dayjs(throughDate).isBefore(fromDate)
    ) {
      style.push('a-text-input__error');
    }
    return style.join(' ');
  }, [fromDate, throughDate]);

  return (
    <CollapsibleFilter title={title} className="aggregation date-filter">
      <div>
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
                  Clear company received from date filter
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
                  Clear company received through date filter
                </span>
              </button>
            </div>
          </li>
        </ul>

        {errors.length
          ? errors.map((message, key) => (
              <div key={key}>
                {message}
                <span aria-hidden="true">
                  {iconMap.getIcon('delete-round', 'cf-icon-delete-round')}
                </span>
              </div>
            ))
          : null}
      </div>
    </CollapsibleFilter>
  );
};
