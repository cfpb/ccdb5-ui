import PropTypes from 'prop-types';
import getIcon from '../../iconMap';

export const ClearButton = ({ onClear }) => {
  return (
    <button
      className="a-btn a-btn__link"
      onClick={onClear}
      aria-label="clear search"
    >
      <div>{getIcon('delete')} Clear</div>
    </button>
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
