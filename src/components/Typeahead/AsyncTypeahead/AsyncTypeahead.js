import '../Typeahead.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import getIcon from '../../Common/Icon/iconMap';
import { HighlightingOption } from '../HighlightingOption/HighlightingOption';
import { ClearButton } from '../ClearButton/ClearButton';

export const AsyncTypeahead = ({
  ariaLabel,
  defaultValue = '',
  delayWait = 0,
  htmlId,
  isDisabled = false,
  handleChange,
  handleClear,
  handleSearch,
  hasClearButton = false,
  hasSearchButton = false,
  maxResults = 5,
  options,
  placeholder = 'Enter your search text',
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

  const filterBy = () => true;

  return (
    <section className="typeahead">
      <div className="o-search-input">
        <div className="o-search-input__input">
          <label
            aria-label={ariaLabel}
            className="o-search-input__input-label"
            htmlFor={htmlId}
          >
            {getIcon('search')}
          </label>
          <Typeahead
            id={htmlId}
            minLength={2}
            className="typeahead-selector"
            defaultInputValue={defaultValue}
            delay={delayWait}
            disabled={isDisabled}
            filterBy={filterBy}
            inputProps={{
              id: htmlId,
              className: 'a-text-input a-text-input--full',
            }}
            isLoading={false}
            ref={ref}
            onInputChange={(input) => {
              setIsVisible(input !== '');
              setSearchValue(input);
            }}
            onChange={(selected) => {
              handleChange(selected);
              ref.current.clear();
              setSearchValue('');
            }}
            onSearch={handleSearch}
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
        {!!hasSearchButton && (
          <button type="submit" className="a-btn">
            Search
          </button>
        )}
      </div>
    </section>
  );
};

AsyncTypeahead.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  delayWait: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleClear: PropTypes.func,
  handleSearch: PropTypes.func.isRequired,
  hasClearButton: PropTypes.bool,
  hasSearchButton: PropTypes.bool,
  htmlId: PropTypes.string.isRequired,
  maxResults: PropTypes.number,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};
