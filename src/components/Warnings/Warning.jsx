import './Warning.scss';
import getIcon from '../Common/Icon/iconMap';
import PropTypes from 'prop-types';

export const Warning = ({ text, closeFn }) => (
  <div
    role="alert"
    className="warning m-notification m-notification--visible m-notification--warning"
  >
    {getIcon('warning-round')}
    <div className="m-notification__content">
      <div className="m-notification__message">{text}</div>
    </div>
    {closeFn ? (
      <button
        onClick={closeFn}
        onKeyDown={closeFn}
        aria-label="Dismiss"
        className="close"
      >
        {getIcon('delete')}
      </button>
    ) : (
      ''
    )}
  </div>
);

Warning.propTypes = {
  text: PropTypes.string.isRequired,
  closeFn: PropTypes.func,
};
