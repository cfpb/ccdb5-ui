import PropTypes from 'prop-types';
import { Button } from '@cfpb/design-system-react';

export const ClearButton = ({ onClear }) => {
  return (
    <Button
      type="reset"
      title="Clear search"
      label=""
      iconLeft="delete"
      aria-label="clear search"
      onClick={onClear}
    />
  );
};

ClearButton.propTypes = {
  onClear: PropTypes.func.isRequired,
};
