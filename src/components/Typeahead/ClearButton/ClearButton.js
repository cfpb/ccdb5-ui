import PropTypes from 'prop-types';
import { Icon } from '@cfpb/design-system-react';

export const ClearButton = ({ onClear }) => {
  return (
    // do not switch this to the DSR button since it adds
    // a-btn class causing blue background when the button appears
    <button
      type="reset"
      title="Clear search"
      onClick={onClear}
      aria-label="clear search"
    >
      <Icon name="error" isPresentational />
    </button>
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
