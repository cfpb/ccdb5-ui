import './Warning.less';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React from 'react';

export const Warning = ({ text, closeFn }) => (
  <div
    role="alert"
    className="warning
               m-notification
               m-notification__visible
               m-notification__warning"
  >
    {iconMap.getIcon('warning-round')}
    <div className="m-notification_content">
      <div className="h4 m-notification_message">{text}</div>
    </div>
    {closeFn ? (
      <span aria-label="Dismiss" className="close" onClick={closeFn}>
        {iconMap.getIcon('delete')}
      </span>
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
