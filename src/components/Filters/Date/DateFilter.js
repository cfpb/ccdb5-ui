import './DateFilter.scss';
import { maxDate, minDate } from '../../../constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { datesChanged } from '../../../reducers/query/querySlice';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { DateRanges } from './DateRanges';
import dayjs from 'dayjs';
import dayjsCustomParseFormat from 'dayjs/plugin/customParseFormat';
import dayjsIsBetween from 'dayjs/plugin/isBetween';
import dayjsUtc from 'dayjs/plugin/utc';
import { formatDateModel, formatDisplayDate } from '../../../utils/formatDate';
import getIcon from '../../Common/Icon/iconMap';
import { isTrue } from '../../../utils';
import { DateRangeInputs } from './DateRangeInputs';

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
  const initialFromDate = dayjs(dateFrom).isValid()
    ? formatDateModel(dateFrom)
    : '';
  const initialThroughDate = dayjs(dateThrough).isValid()
    ? formatDateModel(dateThrough)
    : '';
  const [fromDate, setFromDate] = useState(initialFromDate);
  const [throughDate, setThroughDate] = useState(initialThroughDate);
  const dispatch = useDispatch();

  const errorMessageText = "'From' date must be less than 'through' date";
  const errorSameDate = "'From' date cannot be the same as 'Through' date";
  const errorThroughOutOfBounds =
    "'Through' date cannot be later than " + formatDisplayDate(maxDate);

  const fromRef = useRef();
  const throughRef = useRef();

  useEffect(() => {
    // put it in YYYY-MM-DD format
    // validate to make sure it's not invalid
    const validFromDate = dateFrom ? formatDateModel(dateFrom) : '';
    setFromDate(validFromDate);
  }, [dateFrom]);

  useEffect(() => {
    const validThroughDate = dateThrough ? formatDateModel(dateThrough) : '';
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
    if (dayjs(fromDate).isAfter(throughDate)) {
      return errorMessageText;
    }
    if (dayjs(fromDate).isSame(throughDate)) {
      return errorSameDate;
    }
    if (dayjs(throughDate).isAfter(maxDate)) {
      return errorThroughOutOfBounds;
    }
    return false;
  }, [errorThroughOutOfBounds, fromDate, throughDate]);

  // Centralized validation + dispatch that works with fresh values from the event
  const commitChange = (nextFrom, nextThrough) => {
    // Start from the proposed values, not from state (avoids stale state)
    let _fromDate = nextFrom;
    let _throughDate = nextThrough;

    // From date auto-clamp to min/max or set to min if invalid/empty
    if (
      isTrue([
        !dayjs(_fromDate).isValid(),
        dayjs(_fromDate).isBefore(minDate),
        dayjs(_fromDate).isAfter(maxDate),
        !_fromDate, // empty string
      ])
    ) {
      if (fromRef.current) fromRef.current.value = minDate;
      _fromDate = minDate;
    }

    // Through date auto-clamp to bounds and after from
    if (
      isTrue([
        !dayjs(_throughDate).isValid(),
        dayjs(_throughDate).isAfter(maxDate),
        dayjs(_throughDate).isBefore(minDate),
        dayjs(_throughDate).isBefore(_fromDate),
        !_throughDate, // empty
      ])
    ) {
      if (throughRef.current) throughRef.current.value = maxDate;
      _throughDate = maxDate;
    }

    // Only dispatch if valid ordering
    if (dayjs(_throughDate).isAfter(_fromDate)) {
      // keep local state in sync immediately
      setFromDate(_fromDate);
      setThroughDate(_throughDate);
      // Only dispatch if values actually changed from Redux
      const isDateDifferent = isTrue([
        dateFrom !== _fromDate,
        dateThrough !== _throughDate,
      ]);
      if (isDateDifferent) {
        dispatch(datesChanged(_fromDate, _throughDate));
      }
    }
  };

  const inputFromClassName = useMemo(() => {
    const style = ['a-text-input'];
    if (
      isTrue([
        !dayjs(fromDate).isValid(),
        dayjs(fromDate).isBefore(minDate),
        dayjs(fromDate).isAfter(throughDate),
        dayjs(fromDate).isSame(throughDate),
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
        !dayjs(throughDate).isValid(),
        dayjs(throughDate).isAfter(maxDate),
        dayjs(throughDate).isBefore(fromDate),
        dayjs(throughDate).isSame(fromDate),
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
        <DateRanges />
        {errors ? (
          <div className="a-form-alert a-form-alert--error" role="alert">
            <span aria-hidden="true">
              {getIcon('delete-round', 'cf-icon-delete-round')}
            </span>
            <span className="a-form-alert__text">{errors + ' '}</span>
          </div>
        ) : null}
      </div>
    </CollapsibleFilter>
  );
};
