import '../Typeahead.less';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Typeahead as DropdownTypeahead } from 'react-bootstrap-typeahead';
import getIcon from '../../iconMap';
import HighlightingOption from '../HighlightingOption/HighlightingOption';
import { ClearButton } from '../ClearButton/ClearButton';

export const Typeahead = ({
  ariaLabel,
  className,
  htmlId,
  isDisabled,
  handleChange,
  handleInputChange,
  hasClearButton,
  maxResults,
  minLength,
  options,
  placeholder,
}) => {
  const ref = useRef();
  const [input, setInput] = useState('');
  const isVisible = hasClearButton && input;

  const handleClear = () => {
    ref.current.clear();
    setInput('');
  };

  return (
    <section className={`typeahead ${className | ''}`}>
      <div className="m-btn-inside-input input-contains-label">
        <div
          className="input-contains-label__before
                            input-contains-label__before--search"
        >
          {getIcon('search')}
        </div>
        <label className="u-visually-hidden" htmlFor={htmlId}>
          {ariaLabel}
        </label>
        <DropdownTypeahead
          id="zipcode-typeahead"
          minLength={minLength}
          className="typeahead-selector"
          disabled={isDisabled}
          isLoading={false}
          ref={ref}
          onChange={(selection) => {
            handleChange(selection);
            handleClear();
          }}
          onInputChange={(value) => {
            handleInputChange(value);
            setInput(value);
          }}
          options={options}
          maxResults={maxResults}
          placeholder={placeholder}
          renderMenuItemChildren={(option) => (
            <li className="typeahead-option body-copy">
              <HighlightingOption {...option} />
            </li>
          )}
        />
        {!!isVisible && <ClearButton onClear={handleClear} />}
      </div>
    </section>
  );
};
Typeahead.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  hasClearButton: PropTypes.bool,
  htmlId: PropTypes.string.isRequired,
  maxResults: PropTypes.number,
  minLength: PropTypes.number,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};

Typeahead.defaultProps = {
  className: '',
  hasClearButton: false,
  isDisabled: false,
  maxResults: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
};
