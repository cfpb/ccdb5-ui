import PropTypes from 'prop-types';

export const HighlightingOption = ({ label, position, value }) => {
  if (position < 0) {
    return <span>{label}</span>;
  }

  const start = label.substring(0, position);
  const match = label.slice(position, position + value.length);
  const end = label.substring(position + value.length);
  return (
    <span>
      {start}
      <b>{match}</b>
      {end}
    </span>
  );
};

HighlightingOption.propTypes = {
  label: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};
