/* eslint complexity: ["error", 7] */
import './date-filter.scss';
import { DATE_VALIDATION_FORMAT, maxDate, minDate } from '../../../constants';
import { useRef, useState } from 'react';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { datesChanged } from '../../../reducers/query/query-slice';
import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import { DateRanges } from './date-ranges';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import dayjsUtc from 'dayjs/plugin/utc';
import { formatDateModel, formatDisplayDate } from '../../../utils/format-date';
import { Icon } from '@cfpb/design-system-react';
import { isTrue, sanitizeHtmlId } from '../../../utils';

dayjs.extend(dayjsCustomParseFormat);
dayjs.extend(dayjsIsBetween);
dayjs.extend(dayjsUtc);

const ERROR_FROM_AFTER_THROUGH = "'From' date must be less than 'To' date";
const ERROR_SAME_DATE = "'From' date cannot be the same as 'To' date";

const dateReceivedError = (fromDate, throughDate) => {
  if (dayjs(fromDate).isAfter(throughDate)) {
    return ERROR_FROM_AFTER_THROUGH;
  }
  if (dayjs(fromDate).isSame(throughDate)) {
    return ERROR_SAME_DATE;
  }
  if (dayjs(throughDate).isAfter(maxDate)) {
    return "'To' date cannot be later than " + formatDisplayDate(maxDate);
  }
  return false;
};

const dateInputClassName = (hasError) =>
  ['a-text-input', hasError ? 'a-text-input--error' : '']
    .filter(Boolean)
    .join(' ');

export const DateFilter = () => {
  const fieldName = 'date_received';
  const title = 'The date the CFPB received the complaint';
  const dateFrom = useSelector(selectQueryDateReceivedMin);
  const dateThrough = useSelector(selectQueryDateReceivedMax);
  const formattedFromDate = dayjs(dateFrom).isValid()
    ? formatDateModel(dateFrom)
    : '';
  const formattedThroughDate = dayjs(dateThrough).isValid()
    ? formatDateModel(dateThrough)
    : '';
  const [draftFromDate, setDraftFromDate] = useState(null);
  const [draftThroughDate, setDraftThroughDate] = useState(null);
  const dispatch = useDispatch();

  const fromRef = useRef();
  const throughRef = useRef();

  const fromDate = draftFromDate ?? formattedFromDate;
  const throughDate = draftThroughDate ?? formattedThroughDate;
  const errors = dateReceivedError(fromDate, throughDate);

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

  const handleDateChange = () => {
    // use local vars so we can sanitize before committing
    let _fromDate = fromDate;
    let _throughDate = throughDate;

    if (
      isTrue([
        // these are the checks, reset the date to minDate if
        !dayjs(fromDate).isValid(), // date is not valid
        dayjs(fromDate).isBefore(minDate), // date is before minDate
        dayjs(fromDate).isAfter(maxDate), // date comes after max date
        !fromRef.current.value, // input value is empty
      ])
    ) {
      fromRef.current.value = minDate;
      _fromDate = minDate;
    }

    if (
      isTrue([
        // reset the through date to maxDate if date is
        !dayjs(throughDate).isValid(), // not valid
        dayjs(throughDate).isAfter(maxDate), //  later than maxDate
        dayjs(throughDate).isBefore(minDate), // before minDate
        dayjs(throughDate).isBefore(fromDate), // before current fromDate
        !throughRef.current.value,
      ])
    ) {
      throughRef.current.value = maxDate;
      _throughDate = maxDate;
    }

    // if valid, go ahead and set the correct values
    if (dayjs(_throughDate).isAfter(_fromDate)) {
      dispatch(datesChanged(_fromDate, _throughDate));
      setDraftFromDate(null);
      setDraftThroughDate(null);
      return;
    }

    setDraftFromDate(_fromDate);
    setDraftThroughDate(_throughDate);
  };

  const inputFromClassName = dateInputClassName(
    isTrue([
      !dayjs(fromDate).isValid(),
      dayjs(fromDate).isBefore(minDate),
      dayjs(fromDate).isAfter(throughDate),
      dayjs(fromDate).isSame(throughDate),
    ]),
  );

  const inputThroughClassName = dateInputClassName(
    isTrue([
      !dayjs(throughDate).isValid(),
      dayjs(throughDate).isAfter(maxDate),
      dayjs(throughDate).isBefore(fromDate),
      dayjs(throughDate).isSame(fromDate),
    ]),
  );

  return (
    <CollapsibleFilter
      title={title}
      className="aggregation date-filter"
      desc=""
    >
      <div>
        <ul className="date-inputs">
          <li>
            <label
              className="a-label a-label--heading"
              htmlFor={sanitizeHtmlId(`${fieldName}-from`)}
            >
              From
            </label>
            <div className="o-search-input">
              <div className="o-search-input__input">
                <input
                  id={sanitizeHtmlId(`${fieldName}-from`)}
                  className={inputFromClassName}
                  onBlur={handleDateChange}
                  onChange={(evt) => {
                    setDraftFromDate(evt.target.value);
                  }}
                  onKeyDown={handleKeyDownFromDate}
                  min={minDate}
                  max={maxDate}
                  ref={fromRef}
                  placeholder={DATE_VALIDATION_FORMAT}
                  type="date"
                  value={fromDate}
                />
              </div>
            </div>
          </li>
          <li>
            <label
              className="a-label a-label--heading"
              htmlFor={sanitizeHtmlId(`${fieldName}-through`)}
            >
              To
            </label>
            <div className="o-search-input">
              <div className="o-search-input__input">
                <input
                  id={sanitizeHtmlId(`${fieldName}-through`)}
                  className={inputThroughClassName}
                  onBlur={handleDateChange}
                  onChange={(evt) => {
                    setDraftThroughDate(evt.target.value);
                  }}
                  onKeyDown={handleKeyDownThroughDate}
                  min={minDate}
                  max={maxDate}
                  placeholder={DATE_VALIDATION_FORMAT}
                  ref={throughRef}
                  type="date"
                  value={throughDate}
                />
              </div>
            </div>
          </li>
        </ul>
        <DateRanges />
        {errors ? (
          <div className="a-form-alert a-form-alert--error" role="alert">
            <span aria-hidden="true">
              <Icon name="error-round" isPresentational />
            </span>
            <span className="a-form-alert__text">{errors + ' '}</span>
          </div>
        ) : null}
      </div>
    </CollapsibleFilter>
  );
};
