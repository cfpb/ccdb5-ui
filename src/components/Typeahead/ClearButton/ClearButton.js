import PropTypes from 'prop-types';
import { Button, Icon } from '@cfpb/design-system-react';

export const ClearButton = ({ onClear }) => {
  return (
    <Button
      type="reset"
      title="Clear search"
      onClick={onClear}
      aria-label="clear search"
    >
      <Icon name="error" isPresentational />
    </Button>
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
