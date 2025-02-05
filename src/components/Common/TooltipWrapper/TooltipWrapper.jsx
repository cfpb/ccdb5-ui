import './TooltipWrapper.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PropTypes from 'prop-types';
import Tooltip from 'react-bootstrap/Tooltip';

// We use react-bootstrap's tooltip instead of popperjs due to the overlay
// and placement utilities that come with it.
// See https://react-bootstrap.github.io/components/overlays/#overview
export const TooltipWrapper = ({ children, placement, text }) => {
  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip>{text}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );
};

TooltipWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  placement: PropTypes.string,
  text: PropTypes.string.isRequired,
};
