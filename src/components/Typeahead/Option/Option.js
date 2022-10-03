// Adapted from https://github.com/fmoo/react-typeahead

import PropTypes from 'prop-types';
import React from 'react';

export const Option = ({ children, isSelected = false, onClick }) => {
  const classes = ['typeahead-option', 'body-copy'];
  if (isSelected) {
    classes.push('selected');
  }

  return (
    <li
      className={classes.join(' ')}
      onMouseDown={onClick}
      onTouchStart={onClick}
    >
      {children}
    </li>
  );
};

Option.propTypes = {
  children: PropTypes.node,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
