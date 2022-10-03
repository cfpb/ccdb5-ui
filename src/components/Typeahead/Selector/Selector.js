// Adapted from https://github.com/fmoo/react-typeahead

import PropTypes from 'prop-types';
import React from 'react';
import { Option } from '../Option/Option';

export const Selector = ({
  options,
  onOptionSelected,
  renderOption,
  selectedIndex = -1,
  footer,
}) => {
  const handleClick = (event, index) => {
    console.log('HERE IN HAANDLE CLICK');
    onOptionSelected(index);
    event.preventDefault();
  };

  const results = options.map((result, index) => {
    const { component, value } = renderOption(result);
    return (
      <Option
        key={value + index}
        onClick={(event) => handleClick(event, index)}
        selected={selectedIndex === index}
      >
        {component}
      </Option>
    );
  });

  return (
    <div className="typeahead-selector">
      <ul>
        {results}
        {footer ? <li className="footer">{footer}</li> : null}
      </ul>
    </div>
  );
};

Selector.propTypes = {
  footer: PropTypes.string,
  onOptionSelected: PropTypes.func.isRequired,
  options: PropTypes.array,
  renderOption: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
};
