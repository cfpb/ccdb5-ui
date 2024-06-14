import PropTypes from 'prop-types';
import React from 'react';

export const HighlightingOption = ({ label, position, value }) => {
  if (position < 0) {
    return <span>{label}</span>;
  }

  const start = label.substring(0, position);
  const end = label.substring(position + value.length);
  return (
    <span>
      {start}
      <b>{value}</b>
      {end}
    </span>
  );
};

export default HighlightingOption;

HighlightingOption.propTypes = {
  label: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};
