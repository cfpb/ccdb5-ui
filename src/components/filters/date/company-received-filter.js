/* eslint complexity: ["error", 7] */
import './date-filter.scss';
import { DATE_VALIDATION_FORMAT, maxDate, minDate } from '../../../constants';
import { useRef, useState } from 'react';
import {
  selectQueryCompanyReceivedMax,
  selectQueryCompanyReceivedMin,
} from '../../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import { formatDate } from '../../../utils/format-date';
import { Icon } from '@cfpb/design-system-react';
import { companyReceivedDateChanged } from '../../../reducers/query/query-slice';
import { sanitizeHtmlId } from '../../../utils';

dayjs.extend(dayjsCustomParseFormat);
dayjs.extend(dayjsIsBetween);

const ERROR_FROM_AFTER_THROUGH = "'From' date must be less than 'To' date";

const companyReceivedErrors = (fromDate, throughDate) => {
  const errs = [];
  if (dayjs(fromDate).isAfter(throughDate)) {
    errs.push(ERROR_FROM_AFTER_THROUGH);
  }
  if (dayjs(fromDate).isBefore(minDate)) {
    errs.push(
      "'From' date must be after " +
        dayjs(minDate).format(DATE_VALIDATION_FORMAT),
    );
  }
  if (dayjs(throughDate).isAfter(maxDate)) {
    errs.push(
      "'To' date must be before " +
        dayjs(maxDate).format(DATE_VALIDATION_FORMAT),
    );
  }
  return errs;
};

const dateInputClassName = (hasError) =>
  ['a-text-input', hasError ? 'a-text-input--error' : '']
    .filter(Boolean)
    .join(' ');

const fromDateHasError = (fromDate, throughDate) =>
  dayjs(fromDate).isBefore(minDate) || dayjs(fromDate).isAfter(throughDate);

const throughDateHasError = (fromDate, throughDate) =>
  dayjs(throughDate).isAfter(maxDate) || dayjs(throughDate).isBefore(fromDate);

export const CompanyReceivedFilter = () => {
  const fieldName = 'company_received';
  const title = 'The date the CFPB sent the complaint to the company';
  const dateFrom = useSelector(selectQueryCompanyReceivedMin);
  const dateThrough = useSelector(selectQueryCompanyReceivedMax);
  const formattedFromDate = dayjs(dateFrom).isValid()
    ? formatDate(dateFrom)
    : '';
  const formattedThroughDate = dayjs(dateThrough).isValid()
    ? formatDate(dateThrough)
    : '';
  const [draftFromDate, setDraftFromDate] = useState(null);
  const [draftThroughDate, setDraftThroughDate] = useState(null);
  const dispatch = useDispatch();

  const fromRef = useRef();
  const throughRef = useRef();

  const fromDate = draftFromDate ?? formattedFromDate;
  const throughDate = draftThroughDate ?? formattedThroughDate;
  const errors = companyReceivedErrors(fromDate, throughDate);

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
      dispatch(companyReceivedDateChanged(_fromDate, _throughDate));
    }
    setDraftFromDate(null);
    setDraftThroughDate(null);
  };

  const inputFromClassName = dateInputClassName(
    fromDateHasError(fromDate, throughDate),
  );

  const inputThroughClassName = dateInputClassName(
    throughDateHasError(fromDate, throughDate),
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
                  onChange={(evt) => setDraftFromDate(evt.target.value)}
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
                  onChange={(evt) => setDraftThroughDate(evt.target.value)}
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

        {errors.length > 0 ? (
          <div className="a-form-alert a-form-alert--error" role="alert">
            {errors.map((message, key) => (
              <div key={key}>
                <span aria-hidden="true">
                  <Icon name="error-round" isPresentational />
                </span>
                <div className="a-form-alert__text">{message}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </CollapsibleFilter>
  );
};
