import React from 'react';
import { DATE_VALIDATION_FORMAT, maxDate, minDate } from '../../../constants';

// Reusable date range inputs with identical markup/behavior wiring.
// Parents control state, validation, commit, refs, classNames, and handlers.
export const DateRangeInputs = ({
  fieldName,
  fromDate,
  throughDate,
  inputFromClassName,
  inputThroughClassName,
  onCommit, // (nextFrom, nextThrough) => void
  onChangeFrom, // (val) => void
  onChangeThrough, // (val) => void
  onKeyDownFrom, // (event) => void
  onKeyDownThrough, // (event) => void
  fromRef,
  throughRef,
}) => {
  return (
    <ul className="date-inputs">
      <li>
        <label
          className="a-label a-label__heading body-copy"
          htmlFor={`${fieldName}-from`}
        >
          From
        </label>
        <div className="o-search-input">
          <div className="o-search-input__input">
            <input
              id={`${fieldName}-from`}
              className={inputFromClassName}
              onBlur={() => onCommit(fromDate, throughDate)}
              onChange={(evt) => {
                const val = evt.target.value;
                onChangeFrom(val);
                onCommit(val, throughDate);
              }}
              onKeyDown={onKeyDownFrom}
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
          className="a-label a-label__heading body-copy"
          htmlFor={`${fieldName}-through`}
        >
          Through
        </label>
        <div className="o-search-input">
          <div className="o-search-input__input">
            <input
              id={`${fieldName}-through`}
              className={inputThroughClassName}
              onBlur={() => onCommit(fromDate, throughDate)}
              onChange={(evt) => {
                const val = evt.target.value;
                onChangeThrough(val);
                onCommit(fromDate, val);
              }}
              onKeyDown={onKeyDownThrough}
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
  );
};
