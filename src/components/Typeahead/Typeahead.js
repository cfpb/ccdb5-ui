import './Typeahead.less';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Typeahead as DropdownTypeahead } from 'react-bootstrap-typeahead';
import iconMap from '../iconMap';
import HighlightingOption from './HighlightingOption';

export const Typeahead = ({
  ariaLabel,
  className,
  htmlId,
  isDisabled,
  handleChange,
  handleInputChange,
  maxResults,
  minLength,
  options,
  placeholder,
}) => {
  const ref = useRef();

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
        <DropdownTypeahead
          id="zipcode-typeahead"
          minLength={minLength}
          className="typeahead-selector"
          clearButton={true}
          disabled={isDisabled}
          isLoading={false}
          ref={ref}
          onChange={(selection) => {
            handleChange(selection);
            ref.current.clear();
          }}
          onInputChange={(value) => handleInputChange(value)}
          options={options}
          maxResults={maxResults}
          placeholder={placeholder}
          renderMenuItemChildren={(option) => (
            <li className="typeahead-option body-copy">
              <HighlightingOption {...option} />
            </li>
          )}
          data-cy="input-search"
        />
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
  htmlId: PropTypes.string.isRequired,
  maxResults: PropTypes.number,
  minLength: PropTypes.number,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};

Typeahead.defaultProps = {
  className: '',
  isDisabled: false,
  maxResults: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
};
