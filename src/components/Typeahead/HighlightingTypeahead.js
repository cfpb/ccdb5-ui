import HighlightingOption from './HighlightingOption';
import { normalize } from '../../utils';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Typeahead from './index';

export const compileOptions = (options) =>
  options.map((x) => ({
    key: x,
    normalized: normalize(x),
  }));

export const HighlightingTypeahead = ({
  maxVisible = 5,
  minLength = 2,
  onOptionSelected,
  options,
  placeholder = 'Enter your search text',
  value = '',
  ...otherProps
}) => {
  const [compiled, setCompiled] = useState(compileOptions(options));

  useEffect(() => {
    setCompiled(compileOptions(options));
  }, [options]);

  const handleInputChange = (value) => {
    const normalized = normalize(value);

    const filteredMatches = compiled
      .filter((x) => x.normalized.indexOf(normalized) !== -1)
      .map((x) => ({
        key: x.key,
        label: x.key,
        position: x.normalized.indexOf(normalized),
        value,
      }));

    filteredMatches.sort((a, b) => a.position - b.position);

    return filteredMatches;
  };

  const handleRenderOption = (obj) => {
    return {
      value: obj.key,
      component: <HighlightingOption {...obj} />,
    };
  };

  return (
    <Typeahead
      {...otherProps}
      maxVisible={maxVisible}
      minLength={minLength}
      onInputChange={handleInputChange}
      onOptionSelected={onOptionSelected}
      placeholder={placeholder}
      renderOption={handleRenderOption}
      value={value}
    />
  );
};

HighlightingTypeahead.propTypes = {
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  onOptionSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};
