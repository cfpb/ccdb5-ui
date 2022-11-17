import './TooltipWrapper.less';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PropTypes from 'prop-types';
import Tooltip from 'react-bootstrap/Tooltip';

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
