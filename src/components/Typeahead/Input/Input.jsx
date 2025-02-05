import PropTypes from 'prop-types';
import getIcon from '../../Common/Icon/iconMap';
import { ClearButton } from '../ClearButton/ClearButton';

export const Input = ({
  ariaLabel,
  className,
  htmlId,
  isDisabled = false,
  handleChange,
  handleClear,
  handlePressEnter,
  placeholder = 'Enter your search text',
  value,
}) => {
  return (
    <div className="o-search-input">
      <div className="o-search-input__input">
        <label
          htmlFor={htmlId}
          className="o-search-input__input-label"
          aria-label={ariaLabel}
        >
          {getIcon('search')}
        </label>
        <input
          type="search"
          id={htmlId}
          disabled={isDisabled}
          value={value}
          onChange={handleChange}
          onKeyDown={handlePressEnter}
          className={'a-text-input a-text-input--full ' + className}
          placeholder={placeholder}
          title={placeholder}
          autoComplete="off"
          maxLength="75"
        />
        <ClearButton onClear={handleClear} />
      </div>
      <button type="submit" className="a-btn">
        Search
      </button>
    </div>
  );
};
Input.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleClear: PropTypes.func,
  handlePressEnter: PropTypes.func,
  htmlId: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};
