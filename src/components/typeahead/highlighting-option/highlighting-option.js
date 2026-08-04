import PropTypes from 'prop-types';

export const HighlightingOption = ({ label, position, value }) => {
  if (!value || position < 0) {
    return <span>{label}</span>;
  }

  const start = label.slice(0, Math.max(0, position));
  const match = label.slice(position, position + value.length);
  const end = label.slice(Math.max(0, position + value.length));
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
