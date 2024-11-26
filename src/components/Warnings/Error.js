import getIcon from '../iconMap';
import PropTypes from 'prop-types';

export const ErrorBlock = ({ text }) => (
  <div
    role="alert"
    className="error m-notification m-notification--visible m-notification--error"
  >
    {getIcon('error-round')}
    <div className="m-notification__content">
      <div className="m-notification__message">{text}</div>
    </div>
  </div>
);

export default ErrorBlock;

ErrorBlock.propTypes = {
  text: PropTypes.string.isRequired,
};
