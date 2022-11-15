import PropTypes from 'prop-types';
import iconMap from '../../iconMap';

export const ClearButton = ({ onClear }) => {
  return (
    <button
      className="a-btn a-btn__link"
      onClick={onClear}
      aria-label="clear search"
    >
      <div>{iconMap.getIcon('delete')} Clear</div>
    </button>
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
