import PropTypes from 'prop-types';
import getIcon from '../../Common/Icon/iconMap';

export const ClearButton = ({ onClear }) => {
  return (
    <button
      type="reset"
      title="Clear search"
      onClick={onClear}
      aria-label="clear search"
    >
      <div>{getIcon('delete')}</div>
    </button>
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
