// import 'react-bootstrap-typeahead/css/Typeahead.css';
import './Typeahead.less';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import iconMap from '../iconMap';
import HighlightingOption from './HighlightingOption';

export const AsyncTypeahead = ({
  className,
  delayWait,
  htmlId,
  ariaLabel,
  handleChange,
  handleSearch,
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
        <Typeahead
          id="zipcode-typeahead"
          minLength={minLength}
          className="typeahead-selector"
          clearButton={true}
          delay={delayWait}
          isLoading={false}
          ref={ref}
          onSearch={(input) => handleSearch(input)}
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
  delayWait: PropTypes.number.isRequired,
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
  delayWait: 0,
  maxResults: 5,
  minLength: 2,
  placeholder: 'Enter your search text',
};
