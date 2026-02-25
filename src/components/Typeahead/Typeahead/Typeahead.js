import '../Typeahead.scss';
import { ClearButton } from '../ClearButton/ClearButton';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Typeahead as DropdownTypeahead } from 'react-bootstrap-typeahead';
import { Icon } from '@cfpb/design-system-react';
import { HighlightingOption } from '../HighlightingOption/HighlightingOption';

export const Typeahead = ({
  ariaLabel,
  htmlId,
  isDisabled = false,
  handleChange,
  handleInputChange,
  maxResults = 5,
  options,
  placeholder = 'Enter your search text',
}) => {
  const ref = useRef();
  const [input, setInput] = useState('');

  const handleClear = () => {
    ref.current.clear();
    setInput('');
  };

  return (
    <section className="typeahead">
      <div className="o-search-input">
        <div className="o-search-input__input">
          <label
            aria-label={ariaLabel}
            className="o-search-input__input-label"
            htmlFor={htmlId}
          >
            <Icon name="search" isPresentational />
          </label>
          <DropdownTypeahead
            id={htmlId}
            minLength={1}
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
                <HighlightingOption
                  key={option.key}
                  label={option.label}
                  position={option.position}
                  value={option.value}
                />
              </li>
            )}
            inputProps={{
              id: htmlId,
              className: 'a-text-input a-text-input--full',
            }}
          />
          {!!input && <ClearButton onClear={handleClear} />}
        </div>
      </div>
    </section>
  );
};
Typeahead.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  htmlId: PropTypes.string.isRequired,
  maxResults: PropTypes.number,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};
