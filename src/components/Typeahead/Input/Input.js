import '../Typeahead.less';
import React from 'react';
import PropTypes from 'prop-types';
import iconMap from '../../iconMap';
import { ClearButton } from '../ClearButton/ClearButton';

export const Input = ({
  ariaLabel,
  className,
  htmlId,
  isDisabled,
  handleChange,
  handleClear,
  handlePressEnter,
  isClearVisible,
  placeholder,
  value,
}) => {
  return (
    <section className={`typeahead ${className | ''}`}>
      <div className="m-btn-inside-input input-contains-label">
        <div
          className="input-contains-label_before
                            input-contains-label_before__search"
        >
          {iconMap.getIcon('search')}
        </div>
        <label className="u-visually-hidden" htmlFor={htmlId}>
          {ariaLabel}
        </label>
        <input
          type="text"
          className="a-text-input"
          disabled={isDisabled}
          id={htmlId}
          onChange={handleChange}
          onKeyDown={handlePressEnter}
          placeholder={placeholder}
          value={value}
        />
        {!!isClearVisible && <ClearButton onClear={handleClear} />}
      </div>
    </section>
  );
};
Input.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClear: PropTypes.func,
  handlePressEnter: PropTypes.func,
  htmlId: PropTypes.string.isRequired,
  isClearVisible: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

Input.defaultProps = {
  isClearVisible: false,
  isDisabled: false,
  placeholder: 'Enter your search text',
};
