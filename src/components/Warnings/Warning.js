import './Warning.less';
import getIcon from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export const Warning = ({ text, closeFn }) => (
  <div
    role="alert"
    className="warning m-notification m-notification__visible m-notification__warning"
  >
    {getIcon('warning-round')}
    <div className="m-notification_content">
      <div className="m-notification_message">{text}</div>
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

export default Warning;

Warning.propTypes = {
  text: PropTypes.string.isRequired,
  closeFn: PropTypes.func,
};
