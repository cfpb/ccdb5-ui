import './Typeahead.less';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import iconMap from '../iconMap';
import HighlightingOption from './HighlightingOption';

export const AsyncTypeahead = ({
  ariaLabel,
  className,
  defaultValue,
  delayWait,
  htmlId,
  isDisabled,
  handleChange,
  handleSearch,
  maxResults,
  minLength,
  options,
  placeholder,
}) => {
  const ref = useRef();
  const [searchValue, setSearchValue] = useState(defaultValue);
  // TODO: ClearButton
  // Leave so eslint doesn't complain about searchValue not being used; will be
  // used with adding clear button
  console.log(searchValue);
  useEffect(() => {
    ref.current.setState({ text: defaultValue });
    setSearchValue(ref.current.inputNode.value);
    if (defaultValue === '') ref.current.clear();
  }, [defaultValue]);

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
        <Typeahead
          id="zipcode-typeahead"
          minLength={minLength}
          className="typeahead-selector"
          clearButton={true}
          defaultInputValue={defaultValue}
          delay={delayWait}
          disabled={isDisabled}
          isLoading={false}
          ref={ref}
          onSearch={(input) => {
            setSearchValue(input);
            handleSearch(input);
          }}
          onChange={(selected) => {
            handleChange(selected);
            ref.current.clear();
          }}
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

AsyncTypeahead.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  delayWait: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  htmlId: PropTypes.string.isRequired,
  maxResults: PropTypes.number,
  minLength: PropTypes.number,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};

AsyncTypeahead.defaultProps = {
  className: '',
  defaultValue: '',
  delayWait: 0,
  isDisabled: false,
  maxResults: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
};
