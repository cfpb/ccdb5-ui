import '../Typeahead.less';
import { ClearButton } from '../ClearButton/ClearButton';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Typeahead as DropdownTypeahead } from 'react-bootstrap-typeahead';
import getIcon from '../../iconMap';
import HighlightingOption from '../HighlightingOption/HighlightingOption';

export const Typeahead = ({
  ariaLabel,
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
            {getIcon('search')}
          </label>
          <DropdownTypeahead
            id={htmlId}
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
  isDisabled: false,
  maxResults: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
};
