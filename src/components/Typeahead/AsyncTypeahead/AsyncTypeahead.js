import '../Typeahead.less';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import getIcon from '../../iconMap';
import HighlightingOption from '../HighlightingOption/HighlightingOption';
import { ClearButton } from '../ClearButton/ClearButton';

export const AsyncTypeahead = ({
  ariaLabel,
  className,
  defaultValue,
  delayWait,
  htmlId,
  isDisabled,
  handleChange,
  handleClear,
  handleSearch,
  hasClearButton,
  maxResults,
  minLength,
  options,
  placeholder,
}) => {
  const ref = useRef();
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isVisible, setIsVisible] = useState(
    hasClearButton && (!!defaultValue || !!searchValue),
  );
  useEffect(() => {
    ref.current.setState({ text: defaultValue });
    setSearchValue(ref.current.inputNode.value);
    if (defaultValue === '') {
      ref.current.clear();
      setIsVisible(false);
    } else setIsVisible(true);
  }, [defaultValue]);

  const handleTypeaheadClear = () => {
    if (handleClear) handleClear();
    ref.current.clear();
    setSearchValue('');
  };

  return (
    <section className={`typeahead ${className | ''}`}>
      <div className="m-btn-inside-input input-contains-label">
        <div
          className="input-contains-label_before
                          input-contains-label_before__search"
        >
          {getIcon('search')}
        </div>
        <label className="u-visually-hidden" htmlFor={htmlId}>
          {ariaLabel}
        </label>
        <Typeahead
          id={htmlId}
          minLength={minLength}
          className="typeahead-selector"
          defaultInputValue={defaultValue}
          delay={delayWait}
          disabled={isDisabled}
          isLoading={false}
          ref={ref}
          onInputChange={(input) => {
            if (input === '') setIsVisible(false);
            else setIsVisible(true);
          }}
          onSearch={(input) => {
            setSearchValue(input);
            handleSearch(input);
          }}
          onChange={(selected) => {
            handleChange(selected);
            ref.current.clear();
            setSearchValue('');
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
        {!!isVisible && (
          <ClearButton
            onClear={() => {
              handleTypeaheadClear();
              setIsVisible(false);
            }}
          />
        )}
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
  handleClear: PropTypes.func,
  handleSearch: PropTypes.func.isRequired,
  hasClearButton: PropTypes.bool,
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
  hasClearButton: false,
  isDisabled: false,
  maxResults: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
};
