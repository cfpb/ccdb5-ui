import './DateFilter.scss';
import { DATE_VALIDATION_FORMAT, maxDate, minDate } from '../../../constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  selectQueryCompanyReceivedMax,
  selectQueryCompanyReceivedMin,
} from '../../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import { formatDate } from '../../../utils/formatDate';
import getIcon from '../../Common/Icon/iconMap';
import { companyReceivedDateChanged } from '../../../reducers/query/querySlice';
import { isTrue } from '../../../utils';
import { DateRangeInputs } from './DateRangeInputs';

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
          dayjs(minDate).format(DATE_VALIDATION_FORMAT),
      );
    }
    if (dayjs(throughDate).isAfter(maxDate)) {
      errs.push(
        "'Through' date must be before " +
          dayjs(maxDate).format(DATE_VALIDATION_FORMAT),
      );
    }

    return errs;
  }, [fromDate, throughDate]);

  // helper: sanitize a single date value; empty string on invalid
  const sanitizeDate = (value, inputRef) => {
    if (value && !dayjs(value).isValid()) {
      if (inputRef?.current) inputRef.current.value = '';
      return '';
    }
    return value;
  };

  // helper: dispatch only when different
  const dispatchIfChanged = (nextFrom, nextThrough) => {
    if (isTrue([dateFrom !== nextFrom, dateThrough !== nextThrough])) {
      dispatch(companyReceivedDateChanged(nextFrom, nextThrough));
    }
  };

  // Centralized validation + dispatch with reduced branching
  const commitChange = (nextFrom, nextThrough) => {
    const _fromDate = sanitizeDate(nextFrom, fromRef);
    const _throughDate = sanitizeDate(nextThrough, throughRef);
    dispatchIfChanged(_fromDate, _throughDate);
  };

  const inputFromClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      isTrue([
        dayjs(fromDate).isBefore(minDate),
        dayjs(fromDate).isAfter(throughDate),
      ])
    ) {
      style.push('a-text-input--error');
    }
    return style.join(' ');
  }, [fromDate, throughDate]);

  const inputThroughClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      isTrue([
        dayjs(throughDate).isAfter(maxDate),
        dayjs(throughDate).isBefore(fromDate),
      ])
    ) {
      style.push('a-text-input--error');
    }
    return style.join(' ');
  }, [fromDate, throughDate]);

  return (
    <CollapsibleFilter
      title={title}
      className="aggregation date-filter"
      desc=""
    >
      <div>
        <DateRangeInputs
          fieldName={fieldName}
          fromDate={fromDate}
          throughDate={throughDate}
          inputFromClassName={inputFromClassName}
          inputThroughClassName={inputThroughClassName}
          onCommit={commitChange}
          onChangeFrom={setFromDate}
          onChangeThrough={setThroughDate}
          onKeyDownFrom={handleKeyDownFromDate}
          onKeyDownThrough={handleKeyDownThroughDate}
          fromRef={fromRef}
          throughRef={throughRef}
        />
        {errors.length ? (
          <div className="a-form-alert a-form-alert--error" role="alert">
            {errors.map((message, key) => (
              <div key={key}>
                <span aria-hidden="true">
                  {getIcon('delete-round', 'cf-icon-delete-round')}
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
