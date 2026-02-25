import PropTypes from 'prop-types';
import { Icon } from '@cfpb/design-system-react';

export const ClearButton = ({ onClear }) => {
  return (
    <button
      type="reset"
      title="Clear search"
      onClick={onClear}
      aria-label="clear search"
    >
      <div>
        <Icon name="error" isPresentational />
      </div>
    </button>
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
